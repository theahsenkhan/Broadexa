import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'

function idOf(v: any) {
  return typeof v === 'object' && v !== null ? v.id : v
}

async function loadProjectForOwner(payload: any, id: string, user: any) {
  const project: any = await payload.findByID({ collection: 'projects', id }).catch(() => null)
  if (!project) return null
  const posterId = idOf(project.postedBy)
  if (String(posterId) !== String(user.id) && user.role !== 'admin') return null
  return project
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const { id } = await params
  const { username } = await req.json()
  if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })

  const payload = await getPayload({ config })
  const project = await loadProjectForOwner(payload, id, user)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const found = await payload.find({
    collection: 'users',
    where: { username: { equals: String(username).trim().toLowerCase() }, role: { equals: 'designer' } },
    limit: 1,
  })
  const designer: any = found.docs[0]
  if (!designer) return NextResponse.json({ error: 'No designer found with that username' }, { status: 404 })

  const current: string[] = (project.invitedDesigners || []).map(idOf).map(String)
  if (current.includes(String(designer.id))) return NextResponse.json({ error: 'Already invited' }, { status: 400 })

  await payload.update({
    collection: 'projects',
    id,
    data: { invitedDesigners: [...current, designer.id].map(Number) },
    user,
    overrideAccess: false,
  })

  return NextResponse.json({ designer: { id: String(designer.id), name: designer.name, studioName: designer.studioName, username: designer.username } })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const { id } = await params
  const { designerId } = await req.json()

  const payload = await getPayload({ config })
  const project = await loadProjectForOwner(payload, id, user)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const current: string[] = (project.invitedDesigners || []).map(idOf).map(String)
  const next = current.filter((d) => d !== String(designerId))

  await payload.update({
    collection: 'projects',
    id,
    data: { invitedDesigners: next.map(Number) },
    user,
    overrideAccess: false,
  })

  return NextResponse.json({ ok: true })
}
