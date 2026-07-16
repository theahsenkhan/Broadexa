import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { AccountForm } from './AccountForm'
import { PasswordForm } from './PasswordForm'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/account')

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Account settings</h1>

        <AccountForm
          userId={String(user.id)}
          initial={{
            name: user.name || '',
            studioName: user.studioName || '',
            bio: user.bio || '',
            onAirCredits: user.onAirCredits || '',
            country: user.country || '',
          }}
        />

        <div style={{ borderTop: '1px solid var(--line)', marginTop: 32, paddingTop: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Change password</h3>
          <PasswordForm userId={String(user.id)} email={user.email as string} />
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
