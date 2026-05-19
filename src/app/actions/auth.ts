'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PLANS, type PlanKey } from '@/lib/stripe'

export async function signUp(state: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const plan = formData.get('plan') as PlanKey | null

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) return { error: error.message }

  if (plan && PLANS[plan]) {
    redirect(`/api/stripe/checkout?plan=${plan}`)
  }

  redirect('/portal/instructor')
}

export async function signIn(state: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const plan = formData.get('plan') as PlanKey | null

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'Invalid email or password.' }

  if (plan && PLANS[plan]) {
    redirect(`/api/stripe/checkout?plan=${plan}`)
  }

  redirect('/portal/instructor')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
