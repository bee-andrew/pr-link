'use client'

import { Button } from '@/components/ui/button'

interface User {
  id: string
  email: string | undefined
}

export default function HeaderNav({
  user,
  onLogout,
  loading,
}: {
  user: User
  onLogout: () => void
  loading: boolean
}) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Purin Link Hub</h1>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
        <Button
          onClick={onLogout}
          disabled={loading}
          variant="outline"
          className="border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    </header>
  )
}
