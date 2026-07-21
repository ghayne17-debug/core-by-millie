import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { isFutureSlot, slotStamp } from '@/lib/datetime'
import Navbar from '@/components/nav/Navbar'
import BookingForm, { type AvailableSlot } from './BookingForm'

export const metadata: Metadata = { title: 'Book a Private Session' }

// Always reflect the latest availability.
export const dynamic = 'force-dynamic'

export default async function BookPage() {
  const supabase = await createServiceClient()

  const [{ data: slots }, { data: bookings }] = await Promise.all([
    supabase.from('private_slots').select('id, slot_date, start_time, duration_minutes, label'),
    supabase.from('private_bookings').select('slot_id'),
  ])

  const bookedIds = new Set((bookings ?? []).map(b => b.slot_id))

  const available: AvailableSlot[] = (slots ?? [])
    .filter(s => !bookedIds.has(s.id) && isFutureSlot(s.slot_date, s.start_time))
    .sort((a, b) =>
      slotStamp(a.slot_date, a.start_time).localeCompare(slotStamp(b.slot_date, b.start_time))
    )

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-20">
        <p className="text-sm font-medium tracking-widest text-[var(--brand)] uppercase mb-4">Private Sessions</p>
        <h1 className="text-4xl font-light text-stone-800 mb-4">Book a private with Millie</h1>
        <p className="text-stone-500 mb-12">
          One-on-one Pilates, tailored to you. Choose a time that suits and I&apos;ll be in touch to
          confirm the details.
        </p>

        {available.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
            <p className="text-stone-500">
              No private times are available just now. Please check back soon, or reach out via the{' '}
              <a href="/contact" className="text-[var(--brand)] underline underline-offset-2">contact page</a>.
            </p>
          </div>
        ) : (
          <BookingForm slots={available} />
        )}
      </main>
    </>
  )
}
