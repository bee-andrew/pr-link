'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import CreateLinkForm from './create-link-form'
import LinkCard from './link-card'
import HeaderNav from './header-nav'

interface Link {
  id: string
  slug: string
  long_url: string
  title: string | null
  description: string | null
  created_at: string
}

interface User {
  id: string
  email: string | undefined
}

export default function DashboardClient({
  user,
  initialLinks,
}: {
  user: User
  initialLinks: Link[]
}) {
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('links')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'links' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLinks((prev) => [payload.new as Link, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setLinks((prev) => prev.filter((l) => l.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setLinks((prev) =>
              prev.map((l) => (l.id === payload.new.id ? (payload.new as Link) : l))
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  async function handleDeleteLink(linkId: string) {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)

    if (error) {
      alert('Error deleting link: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <HeaderNav user={user} onLogout={handleLogout} loading={loading} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Your Links
              </h1>
              <p className="text-slate-600">
                Manage and track your short links
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              {showForm ? 'Cancel' : '+ New Link'}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <CreateLinkForm onSuccess={() => setShowForm(false)} />
          </div>
        )}

        {links.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-4">No links created yet</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Create Your First Link
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
