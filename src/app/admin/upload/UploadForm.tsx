'use client'

import { useState, useActionState } from 'react'
import { uploadContent } from '@/app/actions/content'

const MODALITIES = ['reformer', 'mat', 'barre', 'sculpt', 'strength', 'mobility', 'wellness']
const LEVELS = ['all_levels', 'beginner', 'intermediate', 'advanced']
const ACCESS_TIERS = [
  { value: 'instructor_monthly', label: 'Instructor' },
  { value: 'studio_small', label: 'Studio Small' },
  { value: 'studio_medium', label: 'Studio Medium' },
  { value: 'consumer_monthly', label: 'Home Consumer' },
]

export default function UploadForm() {
  const [state, action, pending] = useActionState(uploadContent, undefined)
  const [tags, setTags] = useState('')

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Title *</label>
          <input name="title" required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
          <textarea name="description" rows={3} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Modality *</label>
            <select name="modality" required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] bg-white capitalize">
              {MODALITIES.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Level</label>
            <select name="level" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] bg-white">
              {LEVELS.map(l => <option key={l} value={l}>{l.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Duration (minutes)</label>
          <input name="duration_minutes" type="number" min={1} max={120} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)]" />
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-4">
          <p className="text-sm font-medium text-stone-700">Bunny Stream Video</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">Library ID</label>
              <input name="bunny_library_id" placeholder="e.g. 123456" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] bg-white" />
              <p className="text-xs text-stone-400 mt-1">Found in Bunny Stream → Library settings</p>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">Video ID</label>
              <input name="bunny_video_id" placeholder="e.g. abc123-def456" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)] bg-white" />
              <p className="text-xs text-stone-400 mt-1">Found in Bunny Stream after uploading</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">PDF URL</label>
          <input name="pdf_url" type="url" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Tags (comma-separated)</label>
          <input
            name="tags"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. short spine, teaser, obliques"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[var(--brand)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Access Tiers *</label>
          <div className="space-y-2">
            {ACCESS_TIERS.map(tier => (
              <label key={tier.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="access_tiers"
                  value={tier.value}
                  defaultChecked={tier.value !== 'consumer_monthly'}
                  className="rounded"
                />
                <span className="text-sm text-stone-700">{tier.label}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_published" value="true" className="rounded" />
          <span className="text-sm font-medium text-stone-700">Publish immediately</span>
        </label>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg">Content uploaded successfully!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="px-8 py-3 rounded-full bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors text-sm font-medium disabled:opacity-60"
      >
        {pending ? 'Uploading…' : 'Upload Content'}
      </button>
    </form>
  )
}
