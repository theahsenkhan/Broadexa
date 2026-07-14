import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  const payload = await getPayload({ config })
  const order = await payload.findByID({ collection: 'orders', id, depth: 1 }).catch(() => null)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const buyerId = typeof order.buyer === 'object' ? order.buyer?.id : order.buyer
  if (String(buyerId) !== String(user.id) && user.role !== 'admin') {
    return NextResponse.json({ error: 'Not your order' }, { status: 403 })
  }
  if (order.status !== 'paid' && order.status !== 'delivered') {
    return NextResponse.json({ error: 'Order is not paid yet' }, { status: 403 })
  }

  const asset: any = typeof order.asset === 'object' ? order.asset : await payload.findByID({ collection: 'assets', id: order.asset, depth: 1 })
  const file: any = asset && typeof asset.file === 'object' ? asset.file : null
  if (!file?.url) return NextResponse.json({ error: 'No file attached to this listing yet' }, { status: 404 })

  if (order.status === 'paid') {
    await payload.update({ collection: 'orders', id, data: { downloadCount: (order.downloadCount || 0) + 1 } })
  }

  return NextResponse.json({ url: file.url })
}
