'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addSlot } from '@/app/actions/bookings'

export default function AddSlotForm() {
  const [state, action, pending] = useActionState(addSlot, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  // Clear the fields after a successful add so Amelia can keep adding slots.
  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Date *</label>
          <input
            name="slot_date" type="date" required
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Start time *</label>
          <input
            name="start_time" type="time" required
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Duration (min)</label>
          <input
            name="duration_minutes" type="number" min={1} max={240} defaultValue={60}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Label <span className="text-stone-400 font-normal">(optional, shown to visitors)</span>
        </label>
        <input
          name="label" type="text" placeholder="e.g. In-studio · Reformer"
          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)]"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg">Slot added.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="px-6 py-3 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium disabled:opacity-60"
      >
        {pending ? 'Adding…' : 'Add Slot'}
      </button>
    </form>
  )
}
