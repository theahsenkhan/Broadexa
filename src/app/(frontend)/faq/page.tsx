import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function FaqPage() {
  const payload = await getPayload({ config })
  const faqs = await payload.find({ collection: 'faq-items', sort: 'order', limit: 100 }).catch(() => ({ docs: [] as any[] }))

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">FAQ</div>
          <h1>Frequently asked questions</h1>
        </div>
        <div style={{ maxWidth: 720, paddingBottom: 72, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {faqs.docs.length === 0 ? (
            <div className="empty">No FAQ entries yet — add some in Payload admin.</div>
          ) : (
            faqs.docs.map((f: any) => (
              <div key={f.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 22 }}>
                <h3 style={{ fontFamily: 'Montserrat', fontSize: 15.5, fontWeight: 600, marginBottom: 8 }}>{f.question}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65 }}>{f.answer}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
