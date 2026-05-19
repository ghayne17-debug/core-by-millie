'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, undefined)

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-stone-800">
            Core <span className="text-[var(--brand)]">By Millie</span>
          </Link>
          <p className="text-stone-500 text-sm mt-2">Sign in to your portal</p>
        </div>

        <form action={action} className="space-y-5">
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
              id="password" name="password" type="password" required autoComplete="current-password"
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
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/membership" className="text-[var(--brand)] hover:underline">
            Choose a plan
          </Link>
        </p>
      </div>
    </main>
  )
}
