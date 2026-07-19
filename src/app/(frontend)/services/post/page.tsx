import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'
import { PostProjectForm } from './PostProjectForm'

export const dynamic = 'force-dynamic'

export default async function PostProjectPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/services/post')

  const { invite } = await searchParams
  const payload = await getPayload({ config })
  const engines = await payload.find({ collection: 'engines', limit: 100, sort: 'name' })

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Post a project</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>
          {invite
            ? `Describe your brief — @${invite} will be invited to bid once it's posted.`
            : 'Describe your brief. Designers will bid privately — only the bid count shows publicly.'}
        </p>
        <PostProjectForm userId={String(user.id)} engines={engines.docs.map((e: any) => ({ id: e.id, name: e.name }))} inviteUsername={invite} />
      </div>
      <SiteFooter />
    </>
  )
}
