import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { SiteNav } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'

export const dynamic = 'force-dynamic'

// The homepage reads SiteSettings — your CMS visibility switches work from day one.
export default async function Home() {
  const payload = await getPayload({ config }).catch(() => null)

  const settings = await payload?.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const sections = settings?.sections

  // Prefer assets an admin has marked "featured"; fall back to most-recent published.
  const featured = await payload
    ?.find({
      collection: 'assets',
      where: { status: { equals: 'published' }, featured: { equals: true } },
      limit: 4,
      sort: '-createdAt',
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }

  const recent = featured.docs.length >= 4 ? { docs: [] as any[] } : await payload
    ?.find({
      collection: 'assets',
      where: { status: { equals: 'published' } },
      limit: 4 - featured.docs.length,
      sort: '-createdAt',
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }

  const assets = { docs: [...featured.docs, ...recent.docs] }

  const freeAssets = settings?.showFreeSpotlight !== false
    ? await payload
        ?.find({
          collection: 'assets',
          where: { status: { equals: 'published' }, isFree: { equals: true } },
          limit: 4,
          sort: '-createdAt',
          depth: 1,
        })
        .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }
    : { docs: [] as any[] }

  const stats = settings?.stats || []
  const testimonials = settings?.testimonials || []

  return (
    <>
      <SiteNav />

      <section className="hero">
        <div className="tc">{settings?.heroEyebrow || '● REC — Coming soon'}</div>
        <h1>
          <em>{settings?.heroHeadline || 'The home of broadcast design'}</em>
        </h1>
        <p>
          {settings?.heroSubhead ||
            'Virtual sets, AR graphics and full show packages — built by real-time designers, verified on the engines you run.'}
        </p>
        <div className="hero-ctas">
          {sections?.marketplace ? (
            <Link className="btn btn-primary" href="/marketplace">{settings?.heroCtaLabel || 'Browse the marketplace'}</Link>
          ) : (
            <span className="btn btn-primary">Launching soon</span>
          )}
        </div>
      </section>

      {stats.length > 0 && (
        <section className="container">
          <div className="stat-row" style={{ marginTop: 8 }}>
            {stats.map((s: any, i: number) => (
              <div key={i} className="stat" style={{ textAlign: 'center' }}>
                <div className="num">{s.value}</div>
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sections?.marketplace && assets.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head">
              <h2>Featured assets</h2>
              <Link href="/marketplace" style={{ fontSize: 13, color: 'var(--violet)', fontWeight: 600 }}>Browse all</Link>
            </div>
            <div className="grid">
              {assets.docs.map((a: any) => (
                <Link key={a.id} href={`/marketplace/${a.slug}`} className="card-a">
                  <div className="thumb" />
                  <div className="card-body">
                    <h3>{a.title}</h3>
                    <div className="byline">
                      {typeof a.designer === 'object' ? a.designer?.studioName || a.designer?.name : ''}
                    </div>
                    <div className="card-foot">
                      <span className="price">{a.isFree ? 'Free' : `$${Number(a.price || 0).toLocaleString()}`}</span>
                      {a.verified && <span className="badge verified">✓ Verified</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections?.marketplace && freeAssets.docs.length > 0 && (
        <section className="section" style={{ background: 'var(--card)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          <div className="container">
            <div className="sec-head">
              <h2>Free assets</h2>
              <Link href="/marketplace?free=1" style={{ fontSize: 13, color: 'var(--violet)', fontWeight: 600 }}>See all free</Link>
            </div>
            <div className="grid">
              {freeAssets.docs.map((a: any) => (
                <Link key={a.id} href={`/marketplace/${a.slug}`} className="card-a">
                  <div className="thumb" />
                  <div className="card-body">
                    <h3>{a.title}</h3>
                    <div className="byline">
                      {typeof a.designer === 'object' ? a.designer?.studioName || a.designer?.name : ''}
                    </div>
                    <div className="card-foot">
                      <span className="price">Free</span>
                      {a.verified && <span className="badge verified">✓ Verified</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head"><h2>What people say</h2></div>
            <div className="grid">
              {testimonials.map((t: any, i: number) => (
                <div key={i} className="card-a" style={{ padding: 20 }}>
                  <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>&ldquo;{t.quote}&rdquo;</p>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                  {t.role && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.role}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </>
  )
}
