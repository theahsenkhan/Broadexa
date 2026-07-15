import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'

export async function SiteNav() {
  const settings = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'site-settings' }))
    .catch(() => null)
  const sections = settings?.sections
  const extraLinks = settings?.extraNavLinks || []
  const logo: any = settings?.logo
  const user = await getSessionUser().catch(() => null)

  return (
    <div className="container">
      <nav className="nav">
        <Link href="/" className="logo">
          {logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.url} alt="Broadexa" style={{ height: 22 }} />
          ) : (
            'BROADEXA'
          )}
        </Link>
        <div className="navlinks">
          {sections?.marketplace && <Link href="/marketplace">Marketplace</Link>}
          {sections?.services && <Link href="/services">Services</Link>}
          {sections?.awards && <Link href="/awards">Awards</Link>}
          {sections?.competitions && <Link href="/competitions">Competitions</Link>}
          {sections?.blog && <Link href="/blog">Blog</Link>}
          {sections?.jobs && <Link href="/jobs">Jobs</Link>}
          {extraLinks.map((l: any, i: number) => (
            <a key={i} href={l.url}>{l.label}</a>
          ))}
        </div>
        <div className="nav-cta">
          {user ? (
            <Link className="btn btn-ghost" href="/dashboard">Dashboard</Link>
          ) : (
            <Link className="btn btn-ghost" href="/login">Sign in</Link>
          )}
          {sections?.sellPage && !user && (
            <Link className="btn btn-primary" href="/sell">Sell your scenes</Link>
          )}
        </div>
      </nav>
    </div>
  )
}
