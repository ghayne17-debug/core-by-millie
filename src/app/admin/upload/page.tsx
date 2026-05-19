import type { Metadata } from 'next'
import { verifyAdmin } from '@/lib/dal'
import Navbar from '@/components/nav/Navbar'
import UploadForm from './UploadForm'

export const metadata: Metadata = { title: 'Upload Content' }

export default async function UploadPage() {
  await verifyAdmin()
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-light text-stone-800 mb-2">Upload Content</h1>
        <p className="text-stone-500 text-sm mb-8">Add new classes, programs, and resources to the library.</p>
        <UploadForm />
      </main>
    </>
  )
}
