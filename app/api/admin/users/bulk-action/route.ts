import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const supabaseService = createServiceClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabaseService
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action, userIds } = await request.json()

    if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
    }

    switch (action) {
      case 'reset_password':
        for (const userId of userIds) {
          try {
            const { data: authUser } = await supabaseService.auth.admin.getUserById(userId)
            if (authUser?.user?.email) {
              await supabase.auth.resetPasswordForEmail(authUser.user.email, {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.refzone.com.au'}/auth/reset-password`,
              })
            }
          } catch (err) {
            console.error(`Failed to reset password for ${userId}:`, err)
          }
        }
        break

      case 'grant_admin':
        await supabaseService
          .from('profiles')
          .update({ is_admin: true })
          .in('id', userIds)
        break

      case 'revoke_admin':
        const filteredIds = userIds.filter((id: string) => id !== user.id)
        if (filteredIds.length > 0) {
          await supabaseService
            .from('profiles')
            .update({ is_admin: false })
            .in('id', filteredIds)
        }
        break

      case 'delete':
        for (const userId of userIds) {
          if (userId === user.id) continue
          await supabaseService.from('profiles').delete().eq('id', userId)
          try {
            await supabaseService.auth.admin.deleteUser(userId)
          } catch {}
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
  } catch (error) {
    console.error('Bulk action error:', error)
    return NextResponse.json(
      { message: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
}
