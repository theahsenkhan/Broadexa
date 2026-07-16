import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { SiteNav } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { Reveal } from './components/Reveal'
import { HeroHUD } from './components/HeroHUD'
import { HowItWorks } from './components/HowItWorks'
import { FeaturedTabs, type AssetCard } from './components/FeaturedTabs'

export const dynamic = 'force-dynamic'

const DEFAULT_ORDER = ['howItWorks', 'valueProps', 'featured', 'verifiedExplainer', 'competitionsTeaser', 'stats', 'testimonials']

function toCard(a: any): AssetCard {
  return {
    id: String(a.id),
    slug: a.slug,
    title: a.title,
    price: a.price,
    isFree: a.isFree,
    verified: a.verified,
    designerName: typeof a.designer === 'object' ? a.designer?.studioName || a.designer?.name : undefined,
    thumbUrl: Array.isArray(a.gallery) && typeof a.gallery[0] === 'object' ? a.gallery[0]?.url : null,
  }
}

// The homepage reads SiteSettings — your CMS visibility switches work from day one.
export default async function Home() {
  const payload = await getPayload({ config }).catch(() => null)

  const settings = await payload?.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const sections = settings?.sections

  const engines = await payload
    ?.find({ collection: 'engines', sort: 'name', limit: 20 })
    .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }
  const engineLabels = engines.docs.map((e: any) => e.shortLabel || e.name)

  // Prefer assets an admin has marked "featured"; fall back to most-recent published.
  const featured = await payload
    ?.find({
      collection: 'assets',
      where: { status: { equals: 'published' }, featured: { equals: true } },
      limit: 5,
      sort: '-createdAt',
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }

  const recent = featured.docs.length >= 5 ? { docs: [] as any[] } : await payload
    ?.find({
      collection: 'assets',
      where: { status: { equals: 'published' } },
      limit: 5 - featured.docs.length,
      sort: '-createdAt',
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }

  const featuredCards = [...featured.docs, ...recent.docs].map(toCard)

  const freeAssets = settings?.showFreeSpotlight !== false
    ? await payload
        ?.find({
          collection: 'assets',
          where: { status: { equals: 'published' }, isFree: { equals: true } },
          limit: 5,
          sort: '-createdAt',
          depth: 1,
        })
        .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }
    : { docs: [] as any[] }
  const freeCards = freeAssets.docs.map(toCard)

  const competition = sections?.competitions && settings?.showCompetitionsTeaser !== false
    ? await payload
        ?.find({ collection: 'competitions', where: { status: { equals: 'open' } }, sort: 'deadline', limit: 1 })
        .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }
    : { docs: [] as any[] }

  const stats = settings?.stats || []
  const testimonials = settings?.testimonials || []
  const valueProps = settings?.valueProps || []
  const buyerSteps = settings?.howItWorksBuyerSteps || []
  const designerSteps = settings?.sellSteps || []
  const order = settings?.sectionOrder && settings.sectionOrder.length > 0 ? settings.sectionOrder : DEFAULT_ORDER

  const heroBg: any = settings?.heroBackgroundImage
  const heroVideoUrl = settings?.heroBackgroundVideoUrl

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    howItWorks: () =>
      (buyerSteps.length > 0 || designerSteps.length > 0) && (
        <section className="section" key="howItWorks">
          <div className="container">
            <Reveal>
              <div className="sec-head"><h2>How it works</h2></div>
              <HowItWorks buyerSteps={buyerSteps} designerSteps={designerSteps} />
            </Reveal>
          </div>
        </section>
      ),
    valueProps: () =>
      valueProps.length > 0 && (
        <section className="section" key="valueProps">
          <div className="container">
            <Reveal>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
                {valueProps.map((v: any, i: number) => (
                  <div key={i} className="card-a" style={{ padding: 20 }}>
                    {v.icon && <div style={{ fontSize: 22, marginBottom: 8 }}>{v.icon}</div>}
                    <h3 style={{ marginBottom: 6, fontSize: 15 }}>{v.title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{v.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ),
    featured: () =>
      sections?.marketplace && (featuredCards.length > 0 || freeCards.length > 0) && (
        <section className="section" key="featured">
          <div className="container">
            <Reveal>
              <div className="sec-head">
                <h2>Featured assets</h2>
                <Link href="/marketplace" style={{ fontSize: 13, color: 'var(--violet)', fontWeight: 600 }}>Browse all</Link>
              </div>
              <FeaturedTabs featured={featuredCards} free={freeCards} />
            </Reveal>
          </div>
        </section>
      ),
    verifiedExplainer: () =>
      (settings?.verifiedHeading || settings?.verifiedBody) && (
        <section className="verified-band" key="verifiedExplainer">
          <div className="container">
            <Reveal>
              <div className="verified-inner">
                <div className="verified-icon">✓</div>
                <div className="verified-text">
                  <h2>{settings?.verifiedHeading || 'What "Verified" means'}</h2>
                  <p>{settings?.verifiedBody}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ),
    competitionsTeaser: () =>
      competition.docs.length > 0 && (
        <section className="section" key="competitionsTeaser">
          <div className="container">
            <Reveal>
              <div className="comp-teaser">
                <div>
                  <h2>{competition.docs[0].title}</h2>
                  <p>{competition.docs[0].theme}</p>
                </div>
                <Link className="btn btn-primary" href={`/competitions/${competition.docs[0].slug}`}>Enter now</Link>
              </div>
            </Reveal>
          </div>
        </section>
      ),
    stats: () =>
      stats.length > 0 && (
        <section className="container" key="stats">
          <Reveal>
            <div className="stat-row" style={{ marginTop: 8 }}>
              {stats.map((s: any, i: number) => (
                <div key={i} className="stat" style={{ textAlign: 'center' }}>
                  <div className="num">{s.value}</div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      ),
    testimonials: () =>
      testimonials.length > 0 && (
        <section className="section" key="testimonials">
          <div className="container">
            <Reveal>
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
            </Reveal>
          </div>
        </section>
      ),
  }

  return (
    <>
      <SiteNav />

      <section className="hero">
        {heroVideoUrl ? (
          <video className="hero-bg" autoPlay muted loop playsInline src={heroVideoUrl} />
        ) : heroBg?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero-bg" src={heroBg.url} alt="" />
        ) : null}
        <div className="hero-grid">
          <div>
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
          </div>
          <HeroHUD engines={engineLabels.length > 0 ? engineLabels : ['VIZ', 'UNREAL', 'PIXOTOPE']} />
        </div>
      </section>

      {settings?.showEngineStrip !== false && engineLabels.length > 0 && (
        <div className="engine-strip">
          <div className="container">
            <div className="engine-strip-row">
              {engineLabels.map((label: string, i: number) => (
                <span key={i} className="engine-pill">{label}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {order.map((key: string) => sectionRenderers[key]?.())}

      {(sections?.marketplace || sections?.sellPage) && (
        <section className="section" key="dualCta">
          <div className="container">
            <Reveal>
              <div className="dual-cta">
                {sections?.marketplace && (
                  <div className="dual-cta-card">
                    <h3>Looking for assets?</h3>
                    <p>Browse verified virtual sets, AR graphics and show packages for the engines you run.</p>
                    <Link className="btn btn-primary" href="/marketplace">{settings?.ctaBuyLabel || 'Browse the marketplace'}</Link>
                  </div>
                )}
                {sections?.sellPage && (
                  <div className="dual-cta-card">
                    <h3>Design broadcast assets?</h3>
                    <p>List your work, set your own prices, and keep 80% of every sale.</p>
                    <Link className="btn btn-dark" href="/sell">{settings?.ctaSellLabel || 'Start selling'}</Link>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <SiteFooter />
    </>
  )
}
