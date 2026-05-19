import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/nav/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-block.png"
              alt="Core By Millie"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-[var(--cream)]/70" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
            <div className="max-w-xl">
              <Image src="/logo.png" alt="Core By Millie logo" width={72} height={72} className="mb-6 rounded-full" />
              <p className="text-sm font-medium tracking-widest text-[var(--brand)] uppercase mb-4">
                Pilates Programming Platform
              </p>
              <h1 className="text-5xl md:text-6xl font-light text-[var(--foreground)] leading-tight mb-6">
                Teach with confidence.<br />
                <span className="font-semibold">Program with ease.</span>
              </h1>
              <p className="text-lg text-[var(--brand-dark)] mb-10 max-w-md">
                Ready-to-teach Pilates and fitness programs for instructors, studios, and home workout enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/membership"
                  className="px-8 py-4 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium text-center"
                >
                  Start Your Membership
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 rounded-full border border-[var(--brand)] text-[var(--brand-dark)] hover:bg-[var(--background)] transition-colors text-sm font-medium text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-24 px-4 bg-[var(--cream)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-light text-center text-[var(--foreground)] mb-16">
              Everything you need to <span className="font-semibold">teach brilliantly</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Weekly Programs', desc: 'New classes every week — Reformer, Mat, Barre, Sculpt & more.' },
                { title: 'Video Demos', desc: 'Exercise demonstrations with cueing notes and modifications.' },
                { title: 'PDF Downloads', desc: 'Printable class plans ready to walk into any studio.' },
                { title: 'Beginner to Advanced', desc: 'Programs for every level with progression systems.' },
                { title: 'Music Suggestions', desc: 'Curated playlists matched to each class style.' },
                { title: 'Instructor Education', desc: 'Teaching guides that build your confidence and skill.' },
              ].map(({ title, desc }) => (
                <div key={title} className="p-6 rounded-2xl border border-[#e8d8cc] bg-white hover:border-[var(--brand)] transition-colors">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">{title}</h3>
                  <p className="text-[var(--brand-dark)] text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lifestyle image break */}
        <section className="relative h-96 overflow-hidden">
          <Image
            src="/hero-ball.png"
            alt="Core By Millie equipment"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[var(--brand-dark)]/40 flex items-center justify-center">
            <p className="text-white text-2xl font-light italic text-center px-4">
              &ldquo;Designed by an instructor, for instructors.&rdquo;
            </p>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-24 px-4 bg-[var(--foreground)] text-white text-center">
          <div className="max-w-2xl mx-auto">
            <Image src="/logo.png" alt="Core By Millie" width={56} height={56} className="mx-auto mb-6 rounded-full opacity-90" />
            <h2 className="text-3xl font-light mb-4">
              Ready to transform your teaching?
            </h2>
            <p className="text-[#c8a88a] mb-8">
              Join instructors and studios across Australia using Core By Millie.
            </p>
            <Link
              href="/membership"
              className="inline-block px-8 py-4 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium"
            >
              View Membership Plans — from $29/month
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
