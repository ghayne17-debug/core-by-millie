import type { Metadata } from 'next'
import Navbar from '@/components/nav/Navbar'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-20">
        <p className="text-sm font-medium tracking-widest text-[var(--brand)] uppercase mb-4">Contact</p>
        <h1 className="text-4xl font-light text-stone-800 mb-4">Get in touch</h1>
        <p className="text-stone-500 mb-12">
          Questions about membership, studio plans, or anything else — we&apos;d love to hear from you.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="name">Name</label>
            <input
              id="name" name="name" type="text" required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="message">Message</label>
            <textarea
              id="message" name="message" rows={5} required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium"
          >
            Send Message
          </button>
        </form>
      </main>
    </>
  )
}
