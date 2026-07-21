// Helpers for the private-booking feature.
//
// Slots are stored as a plain `date` + `time` (no timezone) so that what Amelia
// types is exactly what visitors see — no UTC conversion surprises. We treat all
// times as Australian local time.

const TZ = 'Australia/Sydney'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-08-15" -> "Sat 15 Aug 2026" */
export function formatSlotDate(slotDate: string): string {
  const [y, m, d] = slotDate.split('-').map(Number)
  // Build at UTC noon so the weekday never shifts across a timezone boundary.
  const dt = new Date(Date.UTC(y, m - 1, d, 12))
  return `${WEEKDAYS[dt.getUTCDay()]} ${d} ${MONTHS[m - 1]} ${y}`
}

/** "09:00:00" or "09:00" -> "9:00 AM" */
export function formatTime(startTime: string): string {
  const [hStr, minStr] = startTime.split(':')
  const h = Number(hStr)
  const min = minStr ?? '00'
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${min} ${period}`
}

/** Sortable "YYYY-MM-DDTHH:MM" string for the current moment in Australian time. */
export function nowInAuStamp(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '00'
  // en-CA hour can come back as "24" at midnight; normalise to "00".
  const hour = get('hour') === '24' ? '00' : get('hour')
  return `${get('year')}-${get('month')}-${get('day')}T${hour}:${get('minute')}`
}

/** Sortable stamp for a slot, e.g. slot_date "2026-08-15" + start_time "09:00" -> "2026-08-15T09:00" */
export function slotStamp(slotDate: string, startTime: string): string {
  return `${slotDate}T${startTime.slice(0, 5)}`
}

/** Is the slot in the future relative to Australian "now"? */
export function isFutureSlot(slotDate: string, startTime: string): boolean {
  return slotStamp(slotDate, startTime) > nowInAuStamp()
}
