import Stripe from 'stripe'
import { PLANS as BASE_PLANS, type PlanKey } from './plans'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

// Server-side PLANS includes priceId — only use in server components / route handlers
export const PLANS = {
  instructor_monthly: {
    ...BASE_PLANS.instructor_monthly,
    priceId: process.env.STRIPE_PRICE_INSTRUCTOR_MONTHLY!,
  },
  studio_small: {
    ...BASE_PLANS.studio_small,
    priceId: process.env.STRIPE_PRICE_STUDIO_SMALL_MONTHLY!,
  },
  studio_medium: {
    ...BASE_PLANS.studio_medium,
    priceId: process.env.STRIPE_PRICE_STUDIO_MEDIUM_MONTHLY!,
  },
  consumer_monthly: {
    ...BASE_PLANS.consumer_monthly,
    priceId: process.env.STRIPE_PRICE_CONSUMER_MONTHLY!,
  },
} as const

export type { PlanKey }
