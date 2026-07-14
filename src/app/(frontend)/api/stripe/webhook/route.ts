import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })

  const signature = req.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  const rawBody = await req.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (err: any) {
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 })
  }

  const payload = await getPayload({ config })

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { assetId, buyerId, orderType, commissionPct } = session.metadata || {}
    if (!assetId || !buyerId || !orderType) {
      return NextResponse.json({ received: true })
    }

    const order = await payload.create({
      collection: 'orders',
      data: {
        asset: Number(assetId),
        buyer: Number(buyerId),
        orderType: orderType as 'standard' | 'exclusive',
        amount: (session.amount_total || 0) / 100,
        commissionPct: commissionPct ? Number(commissionPct) : 20,
        status: 'paid',
        stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      },
    })

    if (orderType === 'exclusive') {
      await payload.update({ collection: 'assets', id: assetId, data: { status: 'delisted' } })
    }

    payload.logger.info(`Order ${order.id} created from Stripe session ${session.id}`)
  }

  return NextResponse.json({ received: true })
}
