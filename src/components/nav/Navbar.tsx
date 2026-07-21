import Link from 'next/link'
import Image from 'next/image'
import { getUser, getProfile } from '@/lib/dal'
import { signOut } from '@/app/actions/auth'

export default async function Navbar() {
  const user = await getUser()
  const profile = user ? await getProfile() : null

  return (
    <header className="sticky top-0 z-50 bg-[var(--cream)]/90 backdrop-blur border-b border-[#e8d8cc]">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Core By Millie" width={40} height={40} className="rounded-full" />
          <span className="text-lg font-semibold tracking-wide text-[var(--foreground)] hidden sm:block">
            Core By Millie
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-[var(--brand-dark)]">
          <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">About</Link>
          <Link href="/membership" className="hover:text-[var(--foreground)] transition-colors">Membership</Link>
          <Link href="/studio-plans" className="hover:text-[var(--foreground)] transition-colors">Studios</Link>
          <Link href="/book" className="hover:text-[var(--foreground)] transition-colors">Book Private</Link>
          <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {profile?.is_admin && (
                <>
                  <Link
                    href="/admin/privates"
                    className="text-sm text-[var(--brand-dark)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Privates
                  </Link>
                  <Link
                    href="/admin/upload"
                    className="text-sm px-4 py-2 rounded-full bg-[var(--foreground)] text-white hover:bg-[var(--brand-dark)] transition-colors"
                  >
                    + Upload Content
                  </Link>
                </>
              )}
              <Link
                href="/portal/instructor"
                className="text-sm text-[var(--brand-dark)] hover:text-[var(--foreground)] transition-colors"
              >
                My Portal
              </Link>
              <form action={signOut}>
                <button className="text-sm px-4 py-2 rounded-full border border-[#c8a88a] text-[var(--brand-dark)] hover:bg-[var(--background)] transition-colors">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-[var(--brand-dark)] hover:text-[var(--foreground)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/membership"
                className="text-sm px-4 py-2 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
