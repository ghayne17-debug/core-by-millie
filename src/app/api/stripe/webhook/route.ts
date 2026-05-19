import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new NextResponse('Webhook signature invalid', { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan

      if (!userId || !plan) break

      await supabase.from('profiles').update({
        stripe_customer_id: session.customer as string,
        membership_tier: plan,
        subscription_status: 'active',
        subscription_id: session.subscription as string,
      }).eq('id', userId)

      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.user_id
      if (!userId) break

      const plan = sub.metadata?.plan
      const status = sub.status === 'active' ? 'active'
        : sub.status === 'past_due' ? 'past_due'
        : sub.status === 'canceled' ? 'canceled'
        : 'inactive'

      const periodEnd = sub.items.data[0]?.current_period_end
      await supabase.from('profiles').update({
        subscription_status: status,
        membership_tier: plan ?? undefined,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      }).eq('id', userId)

      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.user_id
      if (!userId) break

      await supabase.from('profiles').update({
        subscription_status: 'canceled',
        membership_tier: null,
      }).eq('id', userId)

      break
    }
  }

  return NextResponse.json({ received: true })
}
