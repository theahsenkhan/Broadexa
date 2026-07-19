import { SignJWT } from 'jose'
import { randomUUID } from 'crypto'

// Bridges an OAuth login into Payload's own session mechanism, replicating
// what Payload's local-strategy login does internally (see
// node_modules/payload/dist/auth/{jwt,sessions}.js): a session record on the
// user doc plus a jose-signed HS256 JWT carrying {id, collection, email, sid}.
// Payload's `useSessions` defaults to true, so a token without a matching
// session entry is rejected — minting the JWT alone isn't enough.
const TOKEN_EXPIRATION_SECONDS = 7200

export async function issuePayloadSessionToken(payload: any, user: any): Promise<{ token: string; exp: number }> {
  const sid = randomUUID()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + TOKEN_EXPIRATION_SECONDS * 1000)
  const existingSessions = ((user.sessions || []) as any[]).filter((s) => new Date(s.expiresAt) > now)

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { sessions: [...existingSessions, { id: sid, createdAt: now.toISOString(), expiresAt: expiresAt.toISOString() }] },
  })

  const secretKey = new TextEncoder().encode(process.env.PAYLOAD_SECRET || '')
  const issuedAt = Math.floor(Date.now() / 1000)
  const exp = issuedAt + TOKEN_EXPIRATION_SECONDS
  const token = await new SignJWT({ id: String(user.id), collection: 'users', email: user.email, sid })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(exp)
    .sign(secretKey)

  return { token, exp }
}

export function payloadCookieName(): string {
  // Payload's default cookie prefix is "payload" (no custom cookiePrefix set in payload.config.ts).
  return 'payload-token'
}
