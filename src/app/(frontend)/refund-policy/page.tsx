import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function RefundPolicyPage() {
  const settings = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'site-settings' }))
    .catch(() => null)

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <h1 className="listing-title">Refund Policy</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 20 }}>
          Refunds are handled case-by-case. Contact us with your order details and we&apos;ll review it against the policy below.
        </p>
        <div style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
          {settings?.refundPolicy ? (
            <RichText data={settings.refundPolicy} />
          ) : (
            <p style={{ color: 'var(--muted)' }}>Not published yet.</p>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
