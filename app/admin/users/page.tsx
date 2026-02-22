import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { UsersTableClient } from './users-table-client'

export const metadata = {
  title: 'User Management - Admin',
}

export default async function UsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  const serviceClient = createServiceClient()

  // Fetch all users with their profile data
  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('id, display_name, experience_level, total_points, current_streak, longest_streak, last_activity_date, created_at, updated_at, is_admin, has_set_username')
    .order('created_at', { ascending: false })

  // Get auth data for all users - wrapped in try/catch as it requires service role
  let authUserMap: Record<string, { email?: string; email_confirmed_at?: string | null; last_sign_in_at?: string | null }> = {}
  try {
    const { data: authUsers } = await serviceClient.auth.admin.listUsers()
    if (authUsers?.users) {
      for (const u of authUsers.users) {
        authUserMap[u.id] = {
          email: u.email,
          email_confirmed_at: u.email_confirmed_at,
          last_sign_in_at: u.last_sign_in_at,
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch auth users:', err)
  }

  // Combine profile and auth data
  const users = profiles?.map((profile) => {
    const authUser = authUserMap[profile.id]
    return {
      id: profile.id,
      display_name: profile.display_name,
      experience_level: profile.experience_level,
      total_points: profile.total_points || 0,
      current_streak: profile.current_streak || 0,
      is_admin: profile.is_admin,
      has_set_username: profile.has_set_username,
      created_at: profile.created_at,
      email: authUser?.email || 'N/A',
      email_confirmed: authUser?.email_confirmed_at ? true : false,
      last_sign_in: authUser?.last_sign_in_at || null,
    }
  })

  return <UsersTableClient users={users || []} />
}
