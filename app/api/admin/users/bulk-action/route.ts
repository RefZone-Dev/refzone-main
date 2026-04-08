import { requireAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/service'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const adminUserId = await requireAdmin()
    const supabaseService = createServiceClient()

    const { action, userIds } = await request.json()

    if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
    }

    switch (action) {
      case 'reset_password':
        // Clerk handles password resets via its own UI/email flow
        return NextResponse.json({
          success: true,
          message: 'Password resets are managed through Clerk. Users can reset via the sign-in page.',
        })

      case 'grant_admin':
        await supabaseService
          .from('profiles')
          .update({ is_admin: true })
          .in('id', userIds)
        break

      case 'revoke_admin':
        const filteredIds = userIds.filter((id: string) => id !== adminUserId)
        if (filteredIds.length > 0) {
          await supabaseService
            .from('profiles')
            .update({ is_admin: false })
            .in('id', filteredIds)
        }
        break

      case 'delete':
        const clerk = await clerkClient()
        for (const userId of userIds) {
          if (userId === adminUserId) continue
          await supabaseService.from('profiles').delete().eq('id', userId)
          try {
            await clerk.users.deleteUser(userId)
          } catch {
            // Clerk user deletion failed, profile already removed
          }
        }
        break

      case 'export':
        const { data: exportData } = await supabaseService
          .from('profiles')
          .select('*')
          .in('id', userIds)
        return NextResponse.json({ success: true, data: exportData })

      default:
        return NextResponse.json({ message: 'Unknown action' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully performed ${action} on ${userIds.length} user(s)`,
    })
  } catch {
    return NextResponse.json(
      { message: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
}
