import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function SiteFooter() {
  const settings = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'site-settings' }))
    .catch(() => null)

  const social = settings?.social
  const extraLinks = settings?.extraNavLinks || []
  const logo: any = settings?.logo

  return (
    <div className="container">
      <footer className="footer-full">
        <div className="footer-top">
          <div>
            {logo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.url} alt="Broadexa" style={{ height: 22 }} />
            ) : (
              <div className="logo" style={{ fontSize: 13 }}>BROADEXA</div>
            )}
            <span style={{ display: 'block', marginTop: 6 }}>{settings?.tagline || 'The home of broadcast design'}</span>
            {settings?.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`} style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginTop: 4 }}>
                {settings.contactEmail}
              </a>
            )}
          </div>

          <div className="footer-links">
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund-policy">Refunds</Link>
            {extraLinks.map((l: any, i: number) => (
              <a key={i} href={l.url}>{l.label}</a>
            ))}
          </div>

          {social && (social.twitter || social.instagram || social.linkedin || social.youtube) && (
            <div className="footer-links">
              {social.twitter && <a href={social.twitter} target="_blank" rel="noreferrer">X</a>}
              {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer">Instagram</a>}
              {social.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer">YouTube</a>}
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <span>{settings?.copyrightText || '© Broadexa. All rights reserved.'}</span>
        </div>
      </footer>
    </div>
  )
}
