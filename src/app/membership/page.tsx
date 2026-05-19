import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/nav/Navbar'
import { PLANS } from '@/lib/stripe'
import { formatPrice as fp } from '@/lib/utils'

export const metadata: Metadata = { title: 'Membership' }

export default function MembershipPage() {
  const instructorPlans = [
    { key: 'instructor_monthly' as const, highlight: false },
  ]
  const studioPlanKeys = ['studio_small', 'studio_medium'] as const
  const consumerKey = 'consumer_monthly' as const

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest text-[var(--brand)] uppercase mb-3">Pricing</p>
          <h1 className="text-4xl font-light text-stone-800 mb-4">Choose your plan</h1>
          <p className="text-stone-500 max-w-lg mx-auto">
            All plans billed monthly in AUD. Cancel anytime.
          </p>
        </div>

        {/* Instructor Plan */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-stone-700 mb-6">For Instructors</h2>
          <div className="max-w-sm">
            <PlanCard planKey="instructor_monthly" />
          </div>
        </div>

        {/* Studio Plans */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-stone-700 mb-6">For Studios</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            {studioPlanKeys.map(key => <PlanCard key={key} planKey={key} />)}
          </div>
          <p className="text-sm text-stone-400 mt-4">
            Need more than 15 instructors?{' '}
            <Link href="/contact" className="underline hover:text-stone-600">Contact us for enterprise pricing.</Link>
          </p>
        </div>

        {/* Consumer Plan */}
        <div>
          <h2 className="text-lg font-semibold text-stone-700 mb-6">For Home Workouts</h2>
          <div className="max-w-sm">
            <PlanCard planKey="consumer_monthly" />
          </div>
        </div>
      </main>
    </>
  )
}

function PlanCard({ planKey }: { planKey: keyof typeof PLANS }) {
  const plan = PLANS[planKey]
  return (
    <div className="p-8 rounded-2xl border border-stone-200 bg-white hover:border-[var(--brand)] transition-colors flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-stone-800 mb-1">{plan.name}</h3>
        <p className="text-stone-400 text-sm mb-4">{plan.description}</p>
        <div className="text-3xl font-light text-stone-800">
          {fp(plan.price)}
          <span className="text-base text-stone-400 font-normal">/month</span>
        </div>
      </div>
      <ul className="space-y-2 mb-8 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex gap-2 text-sm text-stone-600">
            <span className="text-[var(--brand)] mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={`/api/stripe/checkout?plan=${planKey}`}
        className="block text-center px-6 py-3 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium"
      >
        Get Started
      </Link>
    </div>
  )
}
