'use client'

import { useActionState, useState } from 'react'
import { createBooking } from '@/app/actions/bookings'
import { formatSlotDate, formatTime } from '@/lib/datetime'

export type AvailableSlot = {
  id: string
  slot_date: string
  start_time: string
  duration_minutes: number
  label: string | null
}

export default function BookingForm({ slots }: { slots: AvailableSlot[] }) {
  const [state, action, pending] = useActionState(createBooking, undefined)
  const [selected, setSelected] = useState<string>('')

  // Group available slots by date for a tidy list.
  const groups = new Map<string, AvailableSlot[]>()
  for (const slot of slots) {
    const list = groups.get(slot.slot_date) ?? []
    list.push(slot)
    groups.set(slot.slot_date, list)
  }

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-12 text-center">
        <p className="text-2xl font-light text-stone-800 mb-2">Thank you!</p>
        <p className="text-stone-600">
          Your booking request has been received. Millie will be in touch shortly to confirm.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-10">
      {/* Slot picker */}
      <div>
        <h2 className="text-sm font-medium text-stone-700 mb-4">1. Choose a time</h2>
        <div className="space-y-6">
          {[...groups.entries()].map(([date, list]) => (
            <div key={date}>
              <p className="text-xs font-medium tracking-wide text-stone-400 uppercase mb-2">
                {formatSlotDate(date)}
              </p>
              <div className="flex flex-wrap gap-2">
                {list.map(slot => (
                  <label
                    key={slot.id}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors ${
                      selected === slot.id
                        ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-[var(--brand)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot_id"
                      value={slot.id}
                      checked={selected === slot.id}
                      onChange={() => setSelected(slot.id)}
                      className="sr-only"
                    />
                    <span className="font-medium">{formatTime(slot.start_time)}</span>
                    <span className={selected === slot.id ? 'text-white/80' : 'text-stone-400'}>
                      {' '}· {slot.duration_minutes}min
                    </span>
                    {slot.label && (
                      <span className={`block text-xs mt-0.5 ${selected === slot.id ? 'text-white/80' : 'text-stone-400'}`}>
                        {slot.label}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <h2 className="text-sm font-medium text-stone-700 mb-4">2. Your details</h2>
        <div className="space-y-5">
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
            <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="phone">
              Phone <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <input
              id="phone" name="phone" type="tel"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="message">
              Anything Millie should know? <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="message" name="message" rows={4}
              placeholder="Goals, injuries, experience level…"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending || !selected}
        className="px-8 py-3 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Sending…' : 'Request Booking'}
      </button>
      {!selected && (
        <p className="text-xs text-stone-400">Choose a time above to continue.</p>
      )}
    </form>
  )
}
