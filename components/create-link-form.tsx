'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface CreateLinkFormProps {
  onSuccess?: () => void
}

export default function CreateLinkForm({ onSuccess }: CreateLinkFormProps) {
  const [slug, setSlug] = useState('')
  const [longUrl, setLongUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate
    if (!slug.trim() || !longUrl.trim()) {
      setError('Slug and URL are required')
      setLoading(false)
      return
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to create a link')
      setLoading(false)
      return
    }

    // Ensure URL has protocol
    let url = longUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const { error: insertError } = await supabase.from('links').insert({
      user_id: user.id,
      slug: slug.trim().toLowerCase(),
      long_url: url,
      title: title.trim() || null,
      description: description.trim() || null,
    })

    if (insertError) {
      if (insertError.message.includes('duplicate')) {
        setError('This slug is already taken')
      } else {
        setError(insertError.message)
      }
      setLoading(false)
    } else {
      // Reset form
      setSlug('')
      setLongUrl('')
      setTitle('')
      setDescription('')
      setLoading(false)
      onSuccess?.()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 border border-slate-200"
    >
      <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Link</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
            Short Slug *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-sm text-slate-600">
              purinh.com/
            </span>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
              placeholder="my-link"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-slate-700 mb-1">
            Destination URL *
          </label>
          <input
            id="longUrl"
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/video"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Title (Optional)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Reel"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description (Optional)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Check out this video"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          {loading ? 'Creating...' : 'Create Link'}
        </Button>
      </div>
    </form>
  )
}
