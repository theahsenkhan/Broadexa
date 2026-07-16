import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'
import { getStripe } from '@/lib/stripe'

// Multiple assets can come from different designers, and a single Stripe
// Checkout Session's payment_intent_data.transfer_data only supports one
// destination account. So a cart charges the platform directly (no
// destination on the session) and the webhook splits it into a separate
// stripe.transfers.create() per designer afterward — the standard "separate
// charges and transfers" pattern for multi-vendor Connect checkouts.
export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const { assetIds } = await req.json()
  if (!Array.isArray(assetIds) || assetIds.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const assets: any[] = []
  for (const id of assetIds) {
    const asset: any = await payload.findByID({ collection: 'assets', id, depth: 1 }).catch(() => null)
    if (!asset || asset.status !== 'published' || asset.isFree) continue
    const designer = typeof asset.designer === 'object' ? asset.designer : null
    if (!designer?.stripeAccountId) {
      return NextResponse.json({ error: `"${asset.title}" — the designer hasn't connected payouts yet. Remove it from your cart to continue.` }, { status: 400 })
    }
    assets.push(asset)
  }
  if (assets.length === 0) return NextResponse.json({ error: 'No purchasable assets in cart' }, { status: 400 })

  const stripe = getStripe()
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const line_items = assets.map((asset) => ({
    price_data: {
      currency: 'usd',
      unit_amount: Math.round(Number(asset.price || 0) * 100),
      product_data: {
        name: asset.title,
        metadata: { assetId: String(asset.id) },
      },
    },
    quantity: 1,
  }))

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    line_items,
    metadata: {
      cart: 'true',
      buyerId: String(user.id),
    },
    success_url: `${origin}/dashboard/orders?success=1`,
    cancel_url: `${origin}/cart`,
  })

  return NextResponse.json({ url: session.url })
}
