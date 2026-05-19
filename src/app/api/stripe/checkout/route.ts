import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get('plan') as PlanKey | null

  if (!plan || !PLANS[plan]) {
    return NextResponse.redirect(new URL('/membership', request.url))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', `/api/stripe/checkout?plan=${plan}`)
    return NextResponse.redirect(loginUrl)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: profile?.stripe_customer_id || undefined,
    customer_email: !profile?.stripe_customer_id ? user.email : undefined,
    line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
    metadata: { user_id: user.id, plan },
    success_url: `${appUrl}/portal/instructor?checkout=success`,
    cancel_url: `${appUrl}/membership`,
    subscription_data: {
      metadata: { user_id: user.id, plan },
    },
  })

  return NextResponse.redirect(session.url!)
}
