import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ projects: [] })

  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    where: { postedBy: { equals: user.id }, status: { in: ['open', 'awarded', 'in-progress'] } },
    sort: '-createdAt',
    limit: 50,
  })

  return NextResponse.json({ projects: projects.docs.map((p: any) => ({ id: String(p.id), title: p.title })) })
}
