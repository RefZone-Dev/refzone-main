import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const serviceClient = createServiceClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
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

    const userId = params.id

    // Get user profile
    const { data: userProfile } = await serviceClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Get user auth data
    const { data: authUser } = await serviceClient.auth.admin.getUserById(userId)

    return NextResponse.json({
      ...userProfile,
      email: authUser?.user?.email,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const serviceClient = createServiceClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
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

    const userId = params.id

    // Prevent self-deletion
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if target user is admin
    const { data: targetProfile } = await serviceClient
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()

    if (targetProfile?.is_admin) {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 400 }
      )
    }

    // Delete user from Supabase Auth
    const { error: authError } = await serviceClient.auth.admin.deleteUser(userId)
    if (authError) {
      console.error('Error deleting auth user:', authError)
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      )
    }

    // Profile will be automatically deleted by database cascade

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
