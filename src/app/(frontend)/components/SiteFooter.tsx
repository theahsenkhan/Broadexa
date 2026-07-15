import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function SiteFooter() {
  const settings = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'site-settings' }))
    .catch(() => null)

  return (
    <div className="container">
      <footer className="footer">
        <div className="logo" style={{ fontSize: 13 }}>BROADEXA</div>
        <span>{settings?.tagline || 'The home of broadcast design'}</span>
        <Link href="/faq" style={{ fontSize: 12, color: 'var(--muted)' }}>FAQ</Link>
      </footer>
    </div>
  )
}
