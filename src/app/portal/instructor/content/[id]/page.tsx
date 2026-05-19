import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { verifyMembership } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/nav/Navbar'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('content').select('title').eq('id', id).single()
  return { title: data?.title ?? 'Class' }
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await verifyMembership(['instructor_monthly', 'studio_small', 'studio_medium'])

  const supabase = await createClient()
  const { data: item } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (!item) notFound()

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/portal/instructor" className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8 block">
          ← Back to library
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 capitalize">{item.modality}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 capitalize">{item.level.replace('_', ' ')}</span>
          {item.duration_minutes && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{item.duration_minutes}min</span>
          )}
        </div>

        <h1 className="text-3xl font-semibold text-stone-800 mb-3">{item.title}</h1>
        {item.description && <p className="text-stone-500 mb-8">{item.description}</p>}

        {/* Video — Bunny Stream */}
        {item.bunny_video_id && item.bunny_library_id && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-stone-900 mb-8">
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${item.bunny_library_id}/${item.bunny_video_id}?autoplay=false&preload=false`}
              className="w-full h-full"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* PDF Download */}
        {item.pdf_url && (
          <a
            href={item.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-200 text-stone-700 hover:border-[var(--brand)] transition-colors text-sm font-medium"
          >
            ↓ Download Class Plan PDF
          </a>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-medium text-stone-500 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: string) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-stone-50 border border-stone-100 text-stone-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
