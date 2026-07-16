import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'
import { PostJobForm } from './PostJobForm'

export const dynamic = 'force-dynamic'

export default async function PostJobPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/jobs/post')

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Post a job</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>
          Anyone can post a job. We review every posting before it goes live.
        </p>
        <PostJobForm userId={String(user.id)} />
      </div>
      <SiteFooter />
    </>
  )
}
