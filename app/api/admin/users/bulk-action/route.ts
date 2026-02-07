import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const supabaseService = createServiceClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action, userIds, data: actionData } = await request.json()

    switch (action) {
      case 'send_notification':
        // Send notification to selected users
        const notifications = userIds.map((userId: string) => ({
          user_id: userId,
          title: actionData.title,
          message: actionData.message,
          type: actionData.type || 'info',
          is_important: actionData.isImportant || false,
        }))

        const { error: notifError } = await supabase
          .from('notifications')
          .insert(notifications)

        if (notifError) throw notifError
        break

      case 'reset_password':
        // Send password reset emails
        const resetPromises = userIds.map(async (userId: string) => {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single()

          if (userProfile) {
            // Get user email from auth
            const { data: authUser } = await supabaseService.auth.admin.getUserById(userId)
            if (authUser.user?.email) {
              await supabaseService.auth.resetPasswordForEmail(authUser.user.email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
              })
            }
          }
        })

        await Promise.all(resetPromises)
        break

      case 'update_experience':
        // Update experience level for selected users
        const { error: expError } = await supabase
          .from('profiles')
          .update({ experience_level: actionData.experienceLevel })
          .in('id', userIds)

        if (expError) throw expError
        break

      case 'toggle_admin':
        // Toggle admin status
        const { error: adminError } = await supabase
          .from('profiles')
          .update({ is_admin: actionData.isAdmin })
          .in('id', userIds)

        if (adminError) throw adminError
        break

      case 'delete_users':
        // Delete users (will cascade due to foreign keys)
        const deletePromises = userIds.map(async (userId: string) => {
          await supabaseService.auth.admin.deleteUser(userId)
        })

        await Promise.all(deletePromises)
        break

      case 'export':
        // This will be handled client-side with the data
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true,
      message: `Successfully performed ${action} on ${userIds.length} user(s)`,
    })
  } catch (error) {
    console.error('[v0] Bulk action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
}
