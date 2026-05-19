'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

export default function SignupPage() {
  const [state, action, pending] = useActionState(signUp, undefined)

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-stone-800">
            Core <span className="text-[var(--brand)]">By Millie</span>
          </Link>
          <p className="text-stone-500 text-sm mt-2">Create your account</p>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="full_name">
              Full Name
            </label>
            <input
              id="full_name" name="full_name" type="text" required autoComplete="name"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email" name="email" type="email" required autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password" name="password" type="password" required autoComplete="new-password"
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] transition-colors"
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
            {pending ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[var(--brand)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
