import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const PLANS = {
  instructor_monthly: {
    name: 'Instructor',
    price: 4900, // AUD cents
    priceId: process.env.STRIPE_PRICE_INSTRUCTOR_MONTHLY!,
    description: 'Full programming library for individual instructors',
    features: [
      'Weekly programming releases',
      'Reformer & Mat Pilates classes',
      'Barre & sculpt programs',
      'PDF downloads',
      'Video demonstrations',
      'Cueing notes & exercise library',
    ],
  },
  studio_small: {
    name: 'Studio — Small',
    price: 14900,
    priceId: process.env.STRIPE_PRICE_STUDIO_SMALL_MONTHLY!,
    description: 'Up to 5 instructors',
    features: [
      'Everything in Instructor',
      'Up to 5 instructor seats',
      'Shared programming system',
      'Team onboarding resources',
      'Studio-wide consistency tools',
    ],
  },
  studio_medium: {
    name: 'Studio — Medium',
    price: 29900,
    priceId: process.env.STRIPE_PRICE_STUDIO_MEDIUM_MONTHLY!,
    description: 'Up to 15 instructors',
    features: [
      'Everything in Studio Small',
      'Up to 15 instructor seats',
      'Priority support',
    ],
  },
  consumer_monthly: {
    name: 'Home Workouts',
    price: 2900,
    priceId: process.env.STRIPE_PRICE_CONSUMER_MONTHLY!,
    description: 'At-home Pilates programs for everyday clients',
    features: [
      'Weekly mat Pilates workouts',
      'Barre & sculpt workouts',
      'Minimal-equipment options',
      'Beginner-friendly modifications',
      'Program calendars',
      'Progress tracking',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
