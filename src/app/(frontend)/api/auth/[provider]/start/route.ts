import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getOAuthProvider } from '@/lib/oauthProviders'

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: providerId } = await params
  const provider = getOAuthProvider(providerId)
  if (!provider || !provider.clientId || !provider.clientSecret) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const next = req.nextUrl.searchParams.get('next') || '/dashboard'
  const role = req.nextUrl.searchParams.get('role') === 'designer' ? 'designer' : 'buyer'
  const state = randomBytes(16).toString('hex')

  const redirectUri = `${req.nextUrl.origin}/api/auth/${providerId}/callback`

  const authUrl = new URL(provider.authUrl)
  authUrl.searchParams.set('client_id', provider.clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', provider.scope)
  authUrl.searchParams.set('state', state)

  const res = NextResponse.redirect(authUrl.toString())
  res.cookies.set('oauth_flow', JSON.stringify({ state, next, role, provider: providerId }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
  return res
}
