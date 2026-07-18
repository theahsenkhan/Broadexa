import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'

function idOf(v: any) {
  return typeof v === 'object' && v !== null ? v.id : v
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ assetIds: [] })

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'wishlists', where: { user: { equals: user.id } }, limit: 1, user, overrideAccess: false })
  const doc: any = existing.docs[0]
  const assetIds = (doc?.assets || []).map(idOf).map(String)
  return NextResponse.json({ assetIds })
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const { assetId } = await req.json()
  if (!assetId) return NextResponse.json({ error: 'assetId required' }, { status: 400 })

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'wishlists', where: { user: { equals: user.id } }, limit: 1, user, overrideAccess: false })
  const doc: any = existing.docs[0]
  const currentIds: string[] = (doc?.assets || []).map(idOf).map(String)
  const has = currentIds.includes(String(assetId))
  const nextIds = (has ? currentIds.filter((id) => id !== String(assetId)) : [...currentIds, String(assetId)]).map(Number)

  if (doc) {
    await payload.update({ collection: 'wishlists', id: doc.id, data: { assets: nextIds }, user, overrideAccess: false })
  } else {
    await payload.create({ collection: 'wishlists', data: { user: user.id, assets: nextIds }, user, overrideAccess: false })
  }

  const asset: any = await payload.findByID({ collection: 'assets', id: assetId }).catch(() => null)
  return NextResponse.json({ wishlisted: !has, count: asset?.wishlistCount ?? 0 })
}
