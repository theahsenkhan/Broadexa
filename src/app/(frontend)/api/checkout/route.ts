import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const { assetId, orderType } = await req.json()
  if (!assetId || (orderType !== 'standard' && orderType !== 'exclusive')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const asset: any = await payload.findByID({ collection: 'assets', id: assetId, depth: 1 }).catch(() => null)
  if (!asset || asset.status !== 'published') {
    return NextResponse.json({ error: 'Listing not available' }, { status: 404 })
  }
  if (orderType === 'exclusive' && !asset.exclusiveAvailable) {
    return NextResponse.json({ error: 'Exclusive buyout not offered on this listing' }, { status: 400 })
  }

  const amount = orderType === 'exclusive' ? Number(asset.exclusivePrice || 0) : Number(asset.price || 0)

  // Free standard assets skip Stripe entirely — order is paid on creation.
  if (asset.isFree && orderType === 'standard') {
    const order = await payload.create({
      collection: 'orders',
      data: {
        asset: asset.id,
        buyer: user.id,
        orderType,
        amount: 0,
        status: 'paid',
      },
    })
    return NextResponse.json({ url: `/dashboard/orders?order=${order.id}` })
  }

  const designer = typeof asset.designer === 'object' ? asset.designer : null
  if (!designer?.stripeAccountId) {
    return NextResponse.json({ error: 'This designer has not connected payouts yet — check back soon.' }, { status: 400 })
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const commissionPct = settings?.commerce?.commissionAssetsPct ?? 20
  const amountCents = Math.round(amount * 100)
  const applicationFeeCents = Math.round((amountCents * commissionPct) / 100)

  const stripe = getStripe()
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: amountCents,
          product_data: { name: orderType === 'exclusive' ? `${asset.title} (exclusive buyout)` : asset.title },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: applicationFeeCents,
      transfer_data: { destination: designer.stripeAccountId },
    },
    metadata: {
      assetId: String(asset.id),
      buyerId: String(user.id),
      orderType,
      commissionPct: String(commissionPct),
    },
    success_url: `${origin}/dashboard/orders?success=1`,
    cancel_url: `${origin}/marketplace/${asset.slug}`,
  })

  return NextResponse.json({ url: session.url })
}
