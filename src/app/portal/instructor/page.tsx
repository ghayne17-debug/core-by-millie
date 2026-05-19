import type { Metadata } from 'next'
import Link from 'next/link'
import { verifyMembership } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/nav/Navbar'

export const metadata: Metadata = { title: 'Instructor Portal' }

const MODALITIES = ['reformer', 'mat', 'barre', 'sculpt', 'strength', 'mobility', 'wellness'] as const
const LEVELS = ['all_levels', 'beginner', 'intermediate', 'advanced'] as const

export default async function InstructorPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ modality?: string; level?: string; q?: string }>
}) {
  await verifyMembership(['instructor_monthly', 'studio_small', 'studio_medium'])

  const { modality, level, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('content')
    .select('id, title, description, modality, level, duration_minutes, vimeo_id, pdf_url, thumbnail_url, published_at')
    .eq('is_published', true)
    .contains('access_tiers', ['instructor_monthly'])
    .order('published_at', { ascending: false })

  if (modality) query = query.eq('modality', modality)
  if (level && level !== 'all_levels') query = query.eq('level', level)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data: items } = await query

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-stone-800">Programming Library</h1>
            <p className="text-stone-500 text-sm mt-1">{items?.length ?? 0} classes available</p>
          </div>
          <Link href="/portal/instructor/favourites" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
            ♡ Saved
          </Link>
        </div>

        {/* Filters */}
        <form className="flex flex-wrap gap-3 mb-8">
          <input
            name="q" defaultValue={q}
            placeholder="Search classes…"
            className="flex-1 min-w-48 px-4 py-2 rounded-full border border-stone-200 text-sm focus:outline-none focus:border-[var(--brand)]"
          />
          <select
            name="modality" defaultValue={modality ?? ''}
            className="px-4 py-2 rounded-full border border-stone-200 text-sm focus:outline-none focus:border-[var(--brand)] bg-white"
          >
            <option value="">All types</option>
            {MODALITIES.map(m => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>
          <select
            name="level" defaultValue={level ?? ''}
            className="px-4 py-2 rounded-full border border-stone-200 text-sm focus:outline-none focus:border-[var(--brand)] bg-white"
          >
            <option value="">All levels</option>
            {LEVELS.map(l => (
              <option key={l} value={l}>{l.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-[var(--brand)] text-white text-sm hover:bg-[var(--brand-dark)] transition-colors"
          >
            Filter
          </button>
        </form>

        {/* Grid */}
        {!items?.length ? (
          <div className="text-center py-24 text-stone-400">
            No classes found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

type ContentItem = {
  id: string
  title: string
  description: string | null
  modality: string
  level: string
  duration_minutes: number | null
  vimeo_id: string | null
  pdf_url: string | null
  thumbnail_url: string | null
  published_at: string | null
}

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <Link
      href={`/portal/instructor/content/${item.id}`}
      className="group block rounded-2xl border border-stone-100 bg-white hover:border-stone-200 hover:shadow-sm transition-all overflow-hidden"
    >
      <div className="aspect-video bg-stone-100 flex items-center justify-center text-stone-300 text-3xl">
        {item.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          '▶'
        )}
      </div>
      <div className="p-5">
        <div className="flex gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 capitalize">{item.modality}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 capitalize">{item.level.replace('_', ' ')}</span>
          {item.duration_minutes && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{item.duration_minutes}min</span>
          )}
        </div>
        <h3 className="font-semibold text-stone-800 group-hover:text-[var(--brand)] transition-colors">{item.title}</h3>
        {item.description && (
          <p className="text-stone-400 text-sm mt-1 line-clamp-2">{item.description}</p>
        )}
        <div className="flex gap-3 mt-3 text-xs text-stone-400">
          {item.vimeo_id && <span>▶ Video</span>}
          {item.pdf_url && <span>↓ PDF</span>}
        </div>
      </div>
    </Link>
  )
}
