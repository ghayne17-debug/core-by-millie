'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/dal'
import { isFutureSlot } from '@/lib/datetime'

type FormState = { error?: string; success?: boolean } | undefined

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---------------------------------------------------------------------------
// Public: request a private booking for a slot
// ---------------------------------------------------------------------------
export async function createBooking(state: FormState, formData: FormData): Promise<FormState> {
  const slotId = (formData.get('slot_id') as string || '').trim()
  const name = (formData.get('name') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const phone = (formData.get('phone') as string || '').trim()
  const message = (formData.get('message') as string || '').trim()

  if (!slotId) return { error: 'Please choose a time.' }
  if (!name) return { error: 'Please enter your name.' }
  if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email address.' }

  // Service-role client: booking is created server-side so no public write
  // access to the bookings table is exposed.
  const supabase = await createServiceClient()

  // Confirm the slot exists and is still in the future.
  const { data: slot } = await supabase
    .from('private_slots')
    .select('id, slot_date, start_time')
    .eq('id', slotId)
    .single()

  if (!slot) return { error: 'That time is no longer available.' }
  if (!isFutureSlot(slot.slot_date, slot.start_time)) {
    return { error: 'That time has already passed.' }
  }

  const { error } = await supabase.from('private_bookings').insert({
    slot_id: slotId,
    name,
    email,
    phone: phone || null,
    message: message || null,
  })

  if (error) {
    // 23505 = unique_violation: someone booked this slot moments ago.
    if (error.code === '23505') {
      return { error: 'Sorry — that time was just booked by someone else. Please choose another.' }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  // NOTE: email notification to Amelia is intentionally not wired up yet
  // (reviewed via the admin dashboard for now). To add later, send here via
  // Resend once RESEND_API_KEY is configured.

  revalidatePath('/book')
  revalidatePath('/admin/privates')
  return { success: true }
}

// ---------------------------------------------------------------------------
// Admin: add an availability slot
// ---------------------------------------------------------------------------
export async function addSlot(state: FormState, formData: FormData): Promise<FormState> {
  await verifyAdmin()

  const slotDate = (formData.get('slot_date') as string || '').trim()
  const startTime = (formData.get('start_time') as string || '').trim()
  const durationRaw = (formData.get('duration_minutes') as string || '').trim()
  const label = (formData.get('label') as string || '').trim()

  if (!slotDate) return { error: 'Please choose a date.' }
  if (!startTime) return { error: 'Please choose a start time.' }

  const duration = durationRaw ? Number(durationRaw) : 60
  if (!Number.isFinite(duration) || duration <= 0) {
    return { error: 'Please enter a valid duration.' }
  }

  const supabase = await createServiceClient()
  const { error } = await supabase.from('private_slots').insert({
    slot_date: slotDate,
    start_time: startTime,
    duration_minutes: duration,
    label: label || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/privates')
  revalidatePath('/book')
  return { success: true }
}

// ---------------------------------------------------------------------------
// Admin: delete a slot (cascades to its booking, if any)
// ---------------------------------------------------------------------------
export async function deleteSlot(formData: FormData): Promise<void> {
  await verifyAdmin()
  const slotId = (formData.get('slot_id') as string || '').trim()
  if (!slotId) return

  const supabase = await createServiceClient()
  await supabase.from('private_slots').delete().eq('id', slotId)

  revalidatePath('/admin/privates')
  revalidatePath('/book')
}

// ---------------------------------------------------------------------------
// Admin: cancel a booking (frees the slot back onto the public list)
// ---------------------------------------------------------------------------
export async function deleteBooking(formData: FormData): Promise<void> {
  await verifyAdmin()
  const bookingId = (formData.get('booking_id') as string || '').trim()
  if (!bookingId) return

  const supabase = await createServiceClient()
  await supabase.from('private_bookings').delete().eq('id', bookingId)

  revalidatePath('/admin/privates')
  revalidatePath('/book')
}
