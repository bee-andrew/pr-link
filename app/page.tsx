import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Purin Link Hub
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Create short links for your Facebook Reels, track clicks, and generate QR codes instantly
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/sign-up">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="border-slate-400 text-white hover:bg-slate-700 px-8 py-3 rounded-lg font-medium transition text-lg"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold text-white mb-2">Short Links</h3>
              <p className="text-slate-400">
                Create custom short links for your Reels with memorable slugs
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
              <p className="text-slate-400">
                Track clicks, referrers, and geographic data in real-time
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-lg font-semibold text-white mb-2">QR Codes</h3>
              <p className="text-slate-400">
                Generate and download QR codes for each link instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
