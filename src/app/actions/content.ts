'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/dal'

type ContentState = { error?: string; success?: boolean } | undefined

export async function uploadContent(state: ContentState, formData: FormData): Promise<ContentState> {
  await verifyAdmin()

  const supabase = await createClient()

  const title = formData.get('title') as string
  const modality = formData.get('modality') as string
  const level = formData.get('level') as string

  if (!title || !modality) return { error: 'Title and modality are required.' }

  const rawTags = formData.get('tags') as string
  const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : []
  const access_tiers = formData.getAll('access_tiers') as string[]
  const is_published = formData.get('is_published') === 'true'

  const { error } = await supabase.from('content').insert({
    title,
    description: formData.get('description') || null,
    modality,
    level: level || 'all_levels',
    duration_minutes: formData.get('duration_minutes') ? Number(formData.get('duration_minutes')) : null,
    bunny_library_id: formData.get('bunny_library_id') || null,
    bunny_video_id: formData.get('bunny_video_id') || null,
    pdf_url: formData.get('pdf_url') || null,
    tags,
    access_tiers: access_tiers.length ? access_tiers : ['instructor_monthly', 'studio_small', 'studio_medium'],
    is_published,
    published_at: is_published ? new Date().toISOString() : null,
  })

  if (error) return { error: error.message }

  revalidatePath('/portal/instructor')
  revalidatePath('/portal/client')
  return { success: true }
}
