import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'
import { getSessionUser } from '@/lib/session'
import Link from 'next/link'
import { BidForm } from './BidForm'
import { BidRow } from './BidRow'

export const dynamic = 'force-dynamic'

const getProject = cache(async (id: string) => {
  const payload = await getPayload({ config })
  return payload.findByID({ collection: 'projects', id, depth: 1 }).catch(() => null) as Promise<any>
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const project = await getProject(id)
  if (!project) return {}
  return {
    title: project.seoTitle || `${project.title} — Broadexa Services`,
    description: project.seoDescription || project.description?.slice(0, 160),
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const project = await getProject(id)
  if (!project) notFound()

  const user = await getSessionUser().catch(() => null)
  const posterId = typeof project.postedBy === 'object' ? project.postedBy?.id : project.postedBy
  const isOwner = user && String(posterId) === String(user.id)
  const isDesigner = user && (user.role === 'designer' || user.role === 'admin')

  let bids: any[] = []
  let myBid: any = null
  if (user) {
    const result = await payload.find({
      collection: 'bids',
      where: { project: { equals: id } },
      depth: 1,
      limit: 100,
      sort: '-createdAt',
    })
    bids = result.docs
    if (!isOwner) myBid = bids.find((b) => (typeof b.designer === 'object' ? b.designer.id : b.designer) === user.id)
  }
  const acceptedBid = bids.find((b) => b.status === 'accepted')

  return (
    <>
      <SiteNav />
      <div className="container" style={{ paddingBottom: 72 }}>
        <div className="page-head">
          <div className="eyebrow">Project brief</div>
          <h1>{project.title}</h1>
        </div>

        <div className="listing" style={{ gridTemplateColumns: '1fr 320px' }}>
          <div>
            <div className="listing-meta">
              {typeof project.engine === 'object' && project.engine && <span className="tag">{project.engine.name}</span>}
              <span className="tag">{project.bidCount || 0} bid{project.bidCount === 1 ? '' : 's'}</span>
              <span className="tag">{project.status}</span>
            </div>
            <p className="listing-desc">{project.description}</p>
            <table className="specs">
              <tbody>
                <tr><td>Budget</td><td>{project.budgetMin || project.budgetMax ? `$${project.budgetMin || 0} – $${project.budgetMax || '?'}` : 'Not specified'}</td></tr>
                <tr><td>Deadline</td><td>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Flexible'}</td></tr>
              </tbody>
            </table>

            {isOwner && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Bids ({bids.length}) — private to you</h4>
                {bids.length === 0 ? (
                  <div className="empty">No bids yet.</div>
                ) : (
                  <table className="table">
                    <thead><tr><th>Designer</th><th>Amount</th><th>Delivery</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      {bids.map((b) => (
                        <BidRow key={b.id} bid={b} projectId={project.id} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          <div className="buybox">
            {!user ? (
              <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>Sign in as a designer to submit a bid.</p>
            ) : isOwner ? (
              <div>
                <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>This is your project. Bids are listed to the left.</p>
                {acceptedBid && (
                  <Link className="btn btn-primary btn-block" style={{ marginTop: 12 }} href={`/messages/bid/${acceptedBid.id}`}>Message hired designer</Link>
                )}
              </div>
            ) : myBid ? (
              <div>
                <h5 style={{ marginBottom: 6 }}>Your bid</h5>
                <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>${myBid.amount} · {myBid.timelineDays || '—'} days · <span className="status-pill">{myBid.status}</span></p>
                {myBid.status === 'accepted' && (
                  <Link className="btn btn-primary btn-block" style={{ marginTop: 12 }} href={`/messages/bid/${myBid.id}`}>Message client</Link>
                )}
              </div>
            ) : isDesigner ? (
              <BidForm projectId={project.id} />
            ) : (
              <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>Only designers can bid on projects.</p>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
