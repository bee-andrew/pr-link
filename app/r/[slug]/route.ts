import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  // Get the link
  const { data: link, error } = await supabase
    .from('links')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !link) {
    return NextResponse.redirect(new URL('/404', request.url))
  }

  // Track the click (don't await, fire and forget)
  const clientCountry = request.geo?.country || 'Unknown'
  const referrer = request.headers.get('referer') || 'Direct'
  const userAgent = request.headers.get('user-agent') || 'Unknown'

  supabase
    .from('clicks')
    .insert({
      link_id: link.id,
      referrer,
      user_agent: userAgent,
      country: clientCountry,
    })
    .then()
    .catch(() => {
      // Silently fail for tracking
    })

  // Redirect to the long URL
  return NextResponse.redirect(link.long_url)
}
