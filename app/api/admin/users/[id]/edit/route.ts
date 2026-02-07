import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const updates = await request.json()

    // Update profile data
    const profileUpdates: any = {}
    
    if (updates.displayName !== undefined) profileUpdates.display_name = updates.displayName
    if (updates.bio !== undefined) profileUpdates.bio = updates.bio
    if (updates.experienceLevel !== undefined) profileUpdates.experience_level = updates.experienceLevel
    if (updates.dateOfBirth !== undefined) profileUpdates.date_of_birth = updates.dateOfBirth
    if (updates.phoneNumber !== undefined) profileUpdates.phone_number = updates.phoneNumber
    if (updates.phoneVerified !== undefined) profileUpdates.phone_verified = updates.phoneVerified
    if (updates.isAdmin !== undefined) profileUpdates.is_admin = updates.isAdmin
    if (updates.isVerified !== undefined) profileUpdates.is_verified = updates.isVerified
    if (updates.points !== undefined) profileUpdates.points = updates.points
    if (updates.currentStreak !== undefined) profileUpdates.current_streak = updates.currentStreak

    const { data, error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update email if provided (requires service role)
    if (updates.email) {
      const { error: emailError } = await supabaseService.auth.admin.updateUserById(
        id,
        { email: updates.email }
      )
      if (emailError) throw emailError
    }

    return NextResponse.json({ 
      success: true,
      user: data,
    })
  } catch (error) {
    console.error('[v0] User edit error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
