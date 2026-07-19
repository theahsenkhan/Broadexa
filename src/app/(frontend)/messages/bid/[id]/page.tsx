import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import { SiteNav } from '../../../components/SiteNav'
import { SiteFooter } from '../../../components/SiteFooter'
import { getSessionUser } from '@/lib/session'
import { MessageThread } from '../../MessageThread'

export const dynamic = 'force-dynamic'

export default async function BidMessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) redirect(`/login?next=/messages/bid/${id}`)

  const payload = await getPayload({ config })
  const bid: any = await payload.findByID({ collection: 'bids', id, depth: 1 }).catch(() => null)
  if (!bid) notFound()
  if (bid.status !== 'submitted' && bid.status !== 'accepted') notFound()

  const project: any = typeof bid.project === 'object' ? bid.project : await payload.findByID({ collection: 'projects', id: bid.project })
  const designerId = typeof bid.designer === 'object' ? bid.designer.id : bid.designer
  const posterId = typeof project.postedBy === 'object' ? project.postedBy.id : project.postedBy

  if (![String(designerId), String(posterId)].includes(String(user.id)) && user.role !== 'admin') notFound()

  const messages = await payload.find({
    collection: 'messages',
    where: { contextType: { equals: 'bid' }, contextId: { equals: Number(id) } },
    sort: 'createdAt',
    limit: 200,
    depth: 1,
  })

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <div className="eyebrow">Project message</div>
        <h1 className="listing-title">{project.title}</h1>
        <MessageThread contextType="bid" contextId={id} messages={messages.docs} currentUserId={String(user.id)} />
      </div>
      <SiteFooter />
    </>
  )
}
