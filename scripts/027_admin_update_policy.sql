-- Add RLS policy to allow admins to update any profile
-- This is needed for admin actions like approving/rejecting verification requests

CREATE POLICY "profiles_admin_update" ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS admin_profile
    WHERE admin_profile.id = auth.uid()
    AND admin_profile.is_admin = true
  )
);
