import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=/dashboard')

  const isDesigner = user.role === 'designer' || user.role === 'admin'

  return (
    <>
      <div className="container">
        <nav className="nav">
          <Link href="/" className="logo">BROADEXA</Link>
          <div className="navlinks">
            <span style={{ color: 'var(--muted)' }}>{user.name}</span>
          </div>
          <div className="nav-cta">
            <Link className="btn btn-ghost" href="/marketplace">Marketplace</Link>
            <form action="/api/users/logout" method="POST">
              <button className="btn btn-ghost" type="submit">Sign out</button>
            </form>
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
          </nav>
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}
