import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'
import { EnterForm } from './EnterForm'

export const dynamic = 'force-dynamic'

export default async function EnterAwardsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/awards/enter')

  const payload = await getPayload({ config })
  const engines = await payload.find({ collection: 'engines', limit: 100, sort: 'name' })

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Enter the awards</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>Submit a scene or package for judging.</p>
        <EnterForm userId={String(user.id)} engines={engines.docs.map((e: any) => ({ id: e.id, name: e.name }))} />
      </div>
      <SiteFooter />
    </>
  )
}
