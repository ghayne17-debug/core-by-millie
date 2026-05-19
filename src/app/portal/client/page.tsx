import type { Metadata } from 'next'
import Link from 'next/link'
import { verifyMembership } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/nav/Navbar'

export const metadata: Metadata = { title: 'Home Workouts' }

export default async function ClientPortalPage() {
  await verifyMembership(['consumer_monthly'])

  const supabase = await createClient()
  const { data: items } = await supabase
    .from('content')
    .select('id, title, description, modality, level, duration_minutes, vimeo_id, thumbnail_url, published_at')
    .eq('is_published', true)
    .contains('access_tiers', ['consumer_monthly'])
    .order('published_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-800">Home Workouts</h1>
          <p className="text-stone-500 text-sm mt-1">Your weekly programs, ready to go</p>
        </div>

        {!items?.length ? (
          <div className="text-center py-24 text-stone-400">
            New workouts coming soon — check back Sunday!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <Link
                key={item.id}
                href={`/portal/client/workout/${item.id}`}
                className="group block rounded-2xl border border-stone-100 bg-white hover:border-stone-200 hover:shadow-sm transition-all overflow-hidden"
              >
                <div className="aspect-video bg-stone-100 flex items-center justify-center text-stone-300 text-3xl">
                  {item.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : '▶'}
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 capitalize">{item.modality}</span>
                    {item.duration_minutes && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{item.duration_minutes}min</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-stone-800 group-hover:text-[var(--brand)] transition-colors">{item.title}</h3>
                  {item.description && (
                    <p className="text-stone-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
