import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/nav/Navbar'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[var(--background)] py-20 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium tracking-widest text-[var(--brand)] uppercase mb-4">About</p>
              <h1 className="text-4xl font-light text-[var(--foreground)] mb-6">
                Hi, I&apos;m <span className="font-semibold">Millie</span>
              </h1>
              <div className="space-y-4 text-[var(--brand-dark)]">
                <p>
                  Core By Millie is a subscription-based platform built by an active Pilates instructor — for instructors, studios, and clients who love Pilates.
                </p>
                <p>
                  I created this platform because I know how time-consuming it is to program fresh, well-structured classes week after week. The hours spent planning can lead to burnout and repetition — neither of which serves your students.
                </p>
                <p>
                  Core By Millie provides a complete &ldquo;done-for-you&rdquo; programming system covering Reformer Pilates, Mat flows, Barre, Sculpt, and Strength — with everything you need to walk into class with confidence.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/about-millie.png"
                alt="About Millie"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-20 px-4 bg-[var(--cream)]">
          <div className="max-w-3xl mx-auto text-center">
            <Image src="/logo.png" alt="Core By Millie" width={64} height={64} className="mx-auto mb-6 rounded-full" />
            <h2 className="text-2xl font-light text-[var(--foreground)] mb-4">Our Vision</h2>
            <p className="text-[var(--brand-dark)] text-lg leading-relaxed">
              To become the leading modern Pilates programming platform that simplifies teaching, improves instructor confidence, and elevates studio standards worldwide.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
