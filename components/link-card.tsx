'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Link {
  id: string
  slug: string
  long_url: string
  title: string | null
  description: string | null
  created_at: string
}

interface LinkCardProps {
  link: Link
  onDelete: (linkId: string) => void
}

export default function LinkCard({ link, onDelete }: LinkCardProps) {
  const [showQR, setShowQR] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [loadingClicks, setLoadingClicks] = useState(false)
  const supabase = createClient()

  const shortUrl = `purinh.com/${link.slug}`
  const fullShortUrl = `https://purinh.com/${link.slug}`

  async function loadClicks() {
    if (loadingClicks) return
    setLoadingClicks(true)
    const { count } = await supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true })
      .eq('link_id', link.id)

    if (count !== null) {
      setClicks(count)
    }
    setLoadingClicks(false)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(fullShortUrl)
    alert('Copied to clipboard!')
  }

  function downloadQR() {
    const qrElement = document.getElementById(`qr-${link.id}`)
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas')
      if (canvas) {
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `${link.slug}-qr.png`
        link.click()
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <code className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm font-mono">
              {shortUrl}
            </code>
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
            >
              📋
            </Button>
          </div>
          {link.title && (
            <h3 className="text-lg font-semibold text-slate-900">{link.title}</h3>
          )}
          {link.description && (
            <p className="text-sm text-slate-600 mb-2">{link.description}</p>
          )}
          <a
            href={link.long_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline break-all"
          >
            {link.long_url}
          </a>
        </div>
        <div className="ml-4">
          <Button
            onClick={() => onDelete(link.id)}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
        <div className="flex-1">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Clicks</p>
          <p className="text-2xl font-bold text-slate-900">
            {showQR ? '—' : clicks}
          </p>
          {!showQR && (
            <button
              onClick={loadClicks}
              className="text-xs text-blue-600 hover:text-blue-700 mt-1"
            >
              {loadingClicks ? 'Loading...' : 'Refresh'}
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowQR(!showQR)}
            variant="outline"
            size="sm"
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            {showQR ? 'Hide' : 'Show'} QR
          </Button>
          {showQR && (
            <Button
              onClick={downloadQR}
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Download QR
            </Button>
          )}
        </div>
      </div>

      {showQR && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg flex justify-center">
          <div id={`qr-${link.id}`}>
            <QRCodeCanvas value={fullShortUrl} size={200} level="H" includeMargin />
          </div>
        </div>
      )}
    </div>
  )
}
