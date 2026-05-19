import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/nav/Navbar'

export const metadata: Metadata = { title: 'Studio Plans' }

const plans = [
  {
    name: 'Studio — Small',
    price: '$149',
    seats: 'Up to 5 instructors',
    features: [
      'Full programming library access for all instructors',
      'Weekly Reformer, Mat, Barre & Sculpt releases',
      'PDF downloads & video demonstrations',
      'Shared programming system across your team',
      'Team onboarding resources',
      'Studio-wide consistency tools',
    ],
  },
  {
    name: 'Studio — Medium',
    price: '$299',
    seats: 'Up to 15 instructors',
    highlight: true,
    features: [
      'Everything in Studio Small',
      'Up to 15 instructor seats',
      'Priority support',
      'Early access to new content',
    ],
  },
]

export default function StudioPlansPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[var(--background)] py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-medium tracking-widest text-[var(--brand)] uppercase mb-4">For Studios</p>
            <h1 className="text-4xl font-light text-[var(--foreground)] mb-4">
              Consistent programming.<br />
              <span className="font-semibold">Across every class.</span>
            </h1>
            <p className="text-[var(--brand-dark)] max-w-xl mx-auto">
              Give your entire instructor team access to professionally designed, ready-to-teach programming — so every class your studio delivers is high quality.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="py-20 px-4 bg-[var(--cream)]">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {plans.map(plan => (
                <div
                  key={plan.name}
                  className={`p-8 rounded-2xl border flex flex-col ${
                    plan.highlight
                      ? 'border-[var(--brand)] bg-white shadow-md'
                      : 'border-[#e8d8cc] bg-white'
                  }`}
                >
                  {plan.highlight && (
                    <span className="text-xs font-medium tracking-widest text-[var(--brand)] uppercase mb-3">
                      Most Popular
                    </span>
                  )}
                  <h2 className="text-xl font-semibold text-[var(--foreground)] mb-1">{plan.name}</h2>
                  <p className="text-sm text-[var(--brand-dark)] mb-4">{plan.seats}</p>
                  <div className="text-3xl font-light text-[var(--foreground)] mb-6">
                    {plan.price}
                    <span className="text-base text-[var(--brand-dark)] font-normal"> AUD/month</span>
                  </div>
                  <ul className="space-y-2 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex gap-2 text-sm text-[var(--brand-dark)]">
                        <span className="text-[var(--brand)] mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/api/stripe/checkout?plan=${plan.name.includes('Small') ? 'studio_small' : 'studio_medium'}`}
                    className="block text-center px-6 py-3 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl border border-[#e8d8cc] bg-white text-center">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Enterprise / Custom</h3>
              <p className="text-[var(--brand-dark)] text-sm mb-4">
                More than 15 instructors, multiple locations, or need co-branding? Let&apos;s talk.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 rounded-full border border-[var(--brand)] text-[var(--brand-dark)] hover:bg-[var(--background)] transition-colors text-sm font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Why studios love it */}
        <section className="py-20 px-4 bg-[var(--background)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light text-center text-[var(--foreground)] mb-12">
              Why studios choose Core By Millie
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Consistency', desc: 'Every instructor teaches from the same high-quality programming system.' },
                { title: 'Save Time', desc: 'No more hours spent creating class plans — it\'s all done for you.' },
                { title: 'Retain Members', desc: 'Well-structured, progressive classes keep studio members coming back.' },
              ].map(({ title, desc }) => (
                <div key={title} className="text-center">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">{title}</h3>
                  <p className="text-[var(--brand-dark)] text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
