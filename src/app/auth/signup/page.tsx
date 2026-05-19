'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { signUp } from '@/app/actions/auth'
import { PLANS, type PlanKey } from '@/lib/stripe'

function SignupForm() {
  const [state, action, pending] = useActionState(signUp, undefined)
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') as PlanKey | null
  const planDetails = plan && PLANS[plan] ? PLANS[plan] : null

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-[#e8d8cc] p-8">
      <div className="text-center mb-8">
        <Link href="/" className="text-xl font-semibold text-[var(--foreground)]">
          Core <span className="text-[var(--brand)]">By Millie</span>
        </Link>
        {planDetails ? (
          <div className="mt-3">
            <p className="text-sm text-[var(--brand-dark)]">You&apos;re signing up for</p>
            <p className="font-semibold text-[var(--foreground)]">{planDetails.name}</p>
            <p className="text-sm text-[var(--brand)]">${planDetails.price / 100} AUD/month</p>
          </div>
        ) : (
          <p className="text-[var(--brand-dark)] text-sm mt-2">Create your account</p>
        )}
      </div>

      <form action={action} className="space-y-5">
        {plan && <input type="hidden" name="plan" value={plan} />}

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5" htmlFor="full_name">
            Full Name
          </label>
          <input
            id="full_name" name="full_name" type="text" required autoComplete="name"
            className="w-full px-4 py-3 rounded-xl border border-[#e8d8cc] focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5" htmlFor="email">
            Email
          </label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-[#e8d8cc] focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5" htmlFor="password">
            Password
          </label>
          <input
            id="password" name="password" type="password" required autoComplete="new-password"
            minLength={8}
            className="w-full px-4 py-3 rounded-xl border border-[#e8d8cc] focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium disabled:opacity-60"
        >
          {pending ? 'Creating account…' : planDetails ? 'Create Account & Continue to Payment' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--brand-dark)] mt-6">
        Already have an account?{' '}
        <Link
          href={plan ? `/auth/login?plan=${plan}` : '/auth/login'}
          className="text-[var(--brand)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)]">
      <Suspense fallback={<div className="w-full max-w-md bg-white rounded-2xl border border-[#e8d8cc] p-8" />}>
        <SignupForm />
      </Suspense>
    </main>
  )
}
