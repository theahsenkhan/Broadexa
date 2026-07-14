import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  if (user.role !== 'designer' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Only designers connect payouts' }, { status: 403 })
  }

  const payload = await getPayload({ config })
  const stripe = getStripe()
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  let accountId = user.stripeAccountId
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
    })
    accountId = account.id
    await payload.update({ collection: 'users', id: user.id, data: { stripeAccountId: accountId } })
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/dashboard/payouts`,
    return_url: `${origin}/dashboard/payouts`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}
