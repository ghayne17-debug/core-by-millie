import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type MembershipTier =
  | 'instructor_monthly'
  | 'studio_small'
  | 'studio_medium'
  | 'consumer_monthly'
  | 'admin'

export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const getProfile = cache(async () => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, membership_tier, subscription_status, is_admin, current_period_end')
    .eq('id', user.id)
    .single()

  return data
})

export const verifyAuth = cache(async () => {
  const user = await getUser()
  if (!user) redirect('/auth/login')
  return user
})

export const verifyMembership = cache(async (requiredTiers: MembershipTier[]) => {
  const profile = await getProfile()

  if (!profile) redirect('/auth/login')

  const hasAccess =
    profile.is_admin ||
    (
      profile.subscription_status === 'active' &&
      profile.membership_tier &&
      requiredTiers.includes(profile.membership_tier as MembershipTier)
    )

  if (!hasAccess) redirect('/membership')

  return profile
})

export const verifyAdmin = cache(async () => {
  const profile = await getProfile()
  if (!profile?.is_admin) redirect('/')
  return profile
})
