import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { UsersTableClient } from './users-table-client'

export const metadata = {
  title: 'User Management - Admin',
}

export default async function UsersPage() {
  const supabase = await createServerClient()
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

  // Fetch all users with their auth data
  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Get auth data for all users
  const { data: authUsers } = await serviceClient.auth.admin.listUsers()

  // Combine profile and auth data
  const users = profiles?.map((profile) => {
    const authUser = authUsers?.users.find((u) => u.id === profile.id)
    return {
      ...profile,
      email: authUser?.email || 'N/A',
      email_confirmed: authUser?.email_confirmed_at ? true : false,
      last_sign_in: authUser?.last_sign_in_at || null,
    }
  })

  return <UsersTableClient users={users || []} />
}
