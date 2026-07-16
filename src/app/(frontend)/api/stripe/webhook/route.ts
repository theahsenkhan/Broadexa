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

    if (session.metadata?.cart === 'true') {
      await handleCartCheckout(payload, stripe, session)
      return NextResponse.json({ received: true })
    }

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

async function handleCartCheckout(payload: Awaited<ReturnType<typeof getPayload>>, stripe: Stripe, session: Stripe.Checkout.Session) {
  const buyerId = session.metadata?.buyerId
  if (!buyerId) return

  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const commissionPct = settings?.commerce?.commissionAssetsPct ?? 20

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] })

  let chargeId: string | undefined
  if (typeof session.payment_intent === 'string') {
    const pi = await stripe.paymentIntents.retrieve(session.payment_intent, { expand: ['latest_charge'] })
    chargeId = typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id
  }

  for (const item of lineItems.data) {
    const product = item.price?.product
    const assetId = typeof product === 'object' && product && !product.deleted ? (product as Stripe.Product).metadata?.assetId : undefined
    if (!assetId) continue

    const amount = (item.amount_total || 0) / 100
    const order = await payload.create({
      collection: 'orders',
      data: {
        asset: Number(assetId),
        buyer: Number(buyerId),
        orderType: 'standard',
        amount,
        commissionPct,
        status: 'paid',
        stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      },
    })
    payload.logger.info(`Order ${order.id} created from cart session ${session.id}`)

    const asset: any = await payload.findByID({ collection: 'assets', id: assetId, depth: 1 }).catch(() => null)
    const designer = asset && typeof asset.designer === 'object' ? asset.designer : null
    if (designer?.stripeAccountId) {
      const transferCents = Math.round(item.amount_total! * (1 - commissionPct / 100))
      try {
        await stripe.transfers.create({
          amount: transferCents,
          currency: item.currency || 'usd',
          destination: designer.stripeAccountId,
          source_transaction: chargeId,
          transfer_group: session.id,
        })
      } catch (err: any) {
        payload.logger.error({ err, msg: `Transfer failed for order ${order.id}` })
      }
    }
  }
}
