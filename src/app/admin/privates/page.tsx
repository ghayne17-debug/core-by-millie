import type { Metadata } from 'next'
import { verifyAdmin } from '@/lib/dal'
import { createServiceClient } from '@/lib/supabase/server'
import { deleteSlot, deleteBooking } from '@/app/actions/bookings'
import { formatSlotDate, formatTime, isFutureSlot, slotStamp } from '@/lib/datetime'
import Navbar from '@/components/nav/Navbar'
import AddSlotForm from './AddSlotForm'

export const metadata: Metadata = { title: 'Private Bookings' }
export const dynamic = 'force-dynamic'

type SlotRow = {
  id: string
  slot_date: string
  start_time: string
  duration_minutes: number
  label: string | null
}

type BookingRow = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  created_at: string
  private_slots: SlotRow | null
}

export default async function AdminPrivatesPage() {
  await verifyAdmin()
  const supabase = await createServiceClient()

  const [{ data: slotsData }, { data: bookingsData }] = await Promise.all([
    supabase.from('private_slots').select('id, slot_date, start_time, duration_minutes, label'),
    supabase
      .from('private_bookings')
      .select('id, name, email, phone, message, created_at, private_slots(slot_date, start_time, duration_minutes, label)'),
  ])

  const slots = (slotsData ?? []) as SlotRow[]
  const bookings = (bookingsData ?? []) as unknown as BookingRow[]

  // Booked slot ids — used to work out which slots are still open.
  const { data: bookedRows } = await supabase.from('private_bookings').select('slot_id')
  const bookedSlotIds = new Set((bookedRows ?? []).map(r => (r as { slot_id: string }).slot_id))

  const openSlots = slots
    .filter(s => !bookedSlotIds.has(s.id) && isFutureSlot(s.slot_date, s.start_time))
    .sort((a, b) => slotStamp(a.slot_date, a.start_time).localeCompare(slotStamp(b.slot_date, b.start_time)))

  const sortedBookings = [...bookings].sort((a, b) => {
    const sa = a.private_slots ? slotStamp(a.private_slots.slot_date, a.private_slots.start_time) : ''
    const sb = b.private_slots ? slotStamp(b.private_slots.slot_date, b.private_slots.start_time) : ''
    return sa.localeCompare(sb)
  })

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-14">
        <div>
          <h1 className="text-3xl font-light text-stone-800 mb-2">Private Bookings</h1>
          <p className="text-stone-500 text-sm">
            Add the times you&apos;re available for one-on-one sessions, and review who has booked.
          </p>
        </div>

        {/* Add availability */}
        <section>
          <h2 className="text-lg font-medium text-stone-800 mb-4">Add availability</h2>
          <div className="rounded-2xl border border-stone-100 bg-white p-6">
            <AddSlotForm />
          </div>
        </section>

        {/* Bookings */}
        <section>
          <h2 className="text-lg font-medium text-stone-800 mb-4">
            Bookings <span className="text-stone-400 font-normal">({sortedBookings.length})</span>
          </h2>
          {sortedBookings.length === 0 ? (
            <p className="text-stone-400 text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {sortedBookings.map(b => {
                const slot = b.private_slots
                const past = slot ? !isFutureSlot(slot.slot_date, slot.start_time) : false
                return (
                  <div
                    key={b.id}
                    className={`rounded-2xl border p-5 ${past ? 'border-stone-100 bg-stone-50 opacity-70' : 'border-stone-100 bg-white'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-stone-800">
                          {slot ? `${formatSlotDate(slot.slot_date)} · ${formatTime(slot.start_time)}` : 'Slot removed'}
                          {slot && <span className="text-stone-400 font-normal"> · {slot.duration_minutes}min</span>}
                          {past && <span className="ml-2 text-xs text-stone-400">(past)</span>}
                        </p>
                        {slot?.label && <p className="text-sm text-stone-400">{slot.label}</p>}
                        <p className="text-sm text-stone-700 mt-2">
                          <span className="font-medium">{b.name}</span> ·{' '}
                          <a href={`mailto:${b.email}`} className="text-[var(--brand)] underline underline-offset-2">{b.email}</a>
                          {b.phone && <> · {b.phone}</>}
                        </p>
                        {b.message && <p className="text-sm text-stone-500 mt-2 italic">“{b.message}”</p>}
                      </div>
                      <form action={deleteBooking}>
                        <input type="hidden" name="booking_id" value={b.id} />
                        <button className="text-xs text-stone-400 hover:text-red-600 transition-colors whitespace-nowrap">
                          Cancel
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Open slots */}
        <section>
          <h2 className="text-lg font-medium text-stone-800 mb-4">
            Open times <span className="text-stone-400 font-normal">({openSlots.length})</span>
          </h2>
          {openSlots.length === 0 ? (
            <p className="text-stone-400 text-sm">No open upcoming times. Add some above.</p>
          ) : (
            <div className="space-y-2">
              {openSlots.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-stone-100 bg-white px-5 py-3">
                  <p className="text-sm text-stone-700">
                    <span className="font-medium">{formatSlotDate(s.slot_date)}</span> · {formatTime(s.start_time)}
                    <span className="text-stone-400"> · {s.duration_minutes}min</span>
                    {s.label && <span className="text-stone-400"> · {s.label}</span>}
                  </p>
                  <form action={deleteSlot}>
                    <input type="hidden" name="slot_id" value={s.id} />
                    <button className="text-xs text-stone-400 hover:text-red-600 transition-colors">Remove</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
