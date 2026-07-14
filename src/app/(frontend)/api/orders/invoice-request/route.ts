import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const { assetId } = await req.json()
  if (!assetId) return NextResponse.json({ error: 'Missing assetId' }, { status: 400 })

  const payload = await getPayload({ config })
  const asset: any = await payload.findByID({ collection: 'assets', id: assetId }).catch(() => null)
  if (!asset || asset.status !== 'published') {
    return NextResponse.json({ error: 'Listing not available' }, { status: 404 })
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const commissionPct = settings?.commerce?.commissionAssetsPct ?? 20

  const order = await payload.create({
    collection: 'orders',
    data: {
      asset: asset.id,
      buyer: user.id,
      orderType: 'standard',
      amount: Number(asset.price || 0),
      commissionPct,
      status: 'invoice-requested',
      notes: 'Buyer requested an invoice (PO / bank transfer). Follow up by email, then mark paid once settled.',
    },
  })

  return NextResponse.json({ order: order.id })
}
