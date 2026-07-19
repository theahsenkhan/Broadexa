import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { ProfileMenu } from '../components/ProfileMenu'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/dashboard')

  const isDesigner = user.role === 'designer' || user.role === 'admin'
  const avatar: any = (user as any).avatar

  return (
    <>
      <div className="container">
        <nav className="nav">
          <Link href="/" className="logo">BROADEXA</Link>
          <div className="navlinks">
            <Link href="/">Home</Link>
            <Link href="/marketplace">Marketplace</Link>
          </div>
          <div className="nav-cta">
            <ProfileMenu name={user.name} username={(user as any).username} role={user.role} avatarUrl={avatar?.url} />
          </div>
        </nav>
      </div>

      <div className="container">
        <div className="dash-layout">
          <nav className="dash-nav">
            <Link href="/dashboard">Overview</Link>
            {isDesigner && <Link href="/dashboard/assets">My assets</Link>}
            {isDesigner && <Link href="/dashboard/new-asset">Upload asset</Link>}
            <Link href="/dashboard/orders">Orders</Link>
            <Link href="/dashboard/projects">Projects &amp; bids</Link>
            <Link href="/dashboard/jobs">Jobs</Link>
            {isDesigner && <Link href="/dashboard/payouts">Payouts</Link>}
            <Link href="/account">Account settings</Link>
          </nav>
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}
