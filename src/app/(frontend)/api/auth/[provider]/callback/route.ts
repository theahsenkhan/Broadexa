import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getOAuthProvider } from '@/lib/oauthProviders'
import { issuePayloadSessionToken, payloadCookieName } from '@/lib/oauthSession'

function slugifyUsername(v: string) {
  return v.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30)
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: providerId } = await params
  const provider = getOAuthProvider(providerId)
  const origin = req.nextUrl.origin
  const fail = (msg: string) => NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(msg)}`)

  if (!provider || !provider.clientId || !provider.clientSecret) return fail('Sign-in method unavailable')

  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const flowCookie = req.cookies.get('oauth_flow')?.value
  if (!code || !state || !flowCookie) return fail('Sign-in expired — please try again')

  let flow: { state: string; next: string; role: string; provider: string }
  try {
    flow = JSON.parse(flowCookie)
  } catch {
    return fail('Sign-in expired — please try again')
  }
  if (flow.state !== state || flow.provider !== providerId) return fail('Sign-in could not be verified')

  const redirectUri = `${origin}/api/auth/${providerId}/callback`

  const tokenRes = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
    }),
  }).catch(() => null)
  if (!tokenRes || !tokenRes.ok) return fail('Could not sign in — please try again')
  const tokenData = await tokenRes.json()

  const userinfoRes = await fetch(provider.userinfoUrl, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  }).catch(() => null)
  if (!userinfoRes || !userinfoRes.ok) return fail('Could not sign in — please try again')
  const profile: any = await userinfoRes.json()

  const email: string | undefined = profile.email
  // Google sends an explicit boolean; LinkedIn's OIDC /userinfo only ever
  // returns a verified account email in the first place.
  const emailVerified = profile.email_verified !== false
  if (!email || !emailVerified) return fail('Your account email must be verified to sign in this way')

  const name: string = profile.name || [profile.given_name, profile.family_name].filter(Boolean).join(' ') || email.split('@')[0]

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  let user: any = existing.docs[0]

  if (!user) {
    let username = slugifyUsername(email.split('@')[0]) || `user-${Date.now()}`
    for (let attempt = 0; attempt < 5; attempt++) {
      const clash = await payload.find({ collection: 'users', where: { username: { equals: username } }, limit: 1 })
      if (clash.docs.length === 0) break
      username = `${username}-${Math.random().toString(36).slice(2, 6)}`
    }
    user = await payload.create({
      collection: 'users',
      data: {
        name,
        username,
        email,
        password: `oauth-${randomUUID()}-${Date.now()}`,
        role: flow.role === 'designer' ? 'designer' : 'buyer',
        authProvider: providerId === 'linkedin' ? 'linkedin' : 'google',
      },
    })
  }

  const { token } = await issuePayloadSessionToken(payload, user)

  const res = NextResponse.redirect(`${origin}${flow.next || '/dashboard'}`)
  res.cookies.set(payloadCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7200,
  })
  res.cookies.delete('oauth_flow')
  return res
}
