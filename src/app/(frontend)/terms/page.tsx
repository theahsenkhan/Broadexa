import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function TermsPage() {
  const settings = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'site-settings' }))
    .catch(() => null)

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <h1 className="listing-title">Terms of Service</h1>
        <div style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
          {settings?.termsOfService ? (
            <RichText data={settings.termsOfService} />
          ) : (
            <p style={{ color: 'var(--muted)' }}>Not published yet.</p>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
