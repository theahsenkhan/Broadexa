import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { SiteNav } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { Reveal } from './components/Reveal'
import { HeroHUD } from './components/HeroHUD'
import { HowItWorks } from './components/HowItWorks'
import { FeaturedTabs } from './components/FeaturedTabs'
import { AssetCard, type AssetCardData } from './components/AssetCard'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

const DEFAULT_ORDER = [
  'categoryTiles', 'howItWorks', 'valueProps', 'featured', 'editorsPicks', 'featureBands',
  'verifiedExplainer', 'competitionsTeaser', 'stats', 'blogRow', 'testimonials',
]

const CAT_ICONS = ['ic-monitor', 'ic-ar', 'ic-signal', 'ic-wave']
const CAT_GRADIENTS = [
  'linear-gradient(135deg,#1B2740,#3E5A8F)',
  'linear-gradient(135deg,#2B1D3E,#7E4FA6)',
  'linear-gradient(135deg,#123244,#2E7DA6)',
  'linear-gradient(135deg,#1F1B33,#5A4A9E)',
]

function toCardData(a: any): AssetCardData {
  return {
    id: String(a.id),
    slug: a.slug,
    title: a.title,
    price: a.price,
    isFree: a.isFree,
    originalPrice: a.originalPrice,
    dealLabel: a.dealLabel,
    ribbon: a.ribbon,
    verified: a.verified,
    rating: a.rating,
    reviewCount: a.reviewCount,
    designerName: typeof a.designer === 'object' ? a.designer?.studioName || a.designer?.name : undefined,
    categoryName: typeof a.category === 'object' ? a.category?.name : undefined,
    engineLabel: typeof a.engine === 'object' ? `${a.engine?.shortLabel || a.engine?.name || ''} ${a.engineVersionBuilt || ''}`.trim() : undefined,
    thumbUrl: Array.isArray(a.gallery) && typeof a.gallery[0] === 'object' ? a.gallery[0]?.url : null,
  }
}

// The homepage reads SiteSettings — your CMS visibility switches work from day one.
export default async function Home() {
  const payload = await getPayload({ config }).catch(() => null)
  const user = await getSessionUser().catch(() => null)

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

  const featuredCards = [...featured.docs, ...recent.docs].map(toCardData)

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
  const freeCards = freeAssets.docs.map(toCardData)

  // Category tiles — admin picks which categories + optional custom image; item counts are always live.
  const tileEntries = settings?.categoryTiles?.tiles || []
  const categoryTiles = await Promise.all(
    tileEntries.map(async (tile: any, i: number) => {
      const category = typeof tile.category === 'object' ? tile.category : null
      if (!category) return null
      const count = await payload
        ?.count({ collection: 'assets', where: { category: { equals: category.id }, status: { equals: 'published' } } })
        .catch(() => ({ totalDocs: 0 })) ?? { totalDocs: 0 }
      return {
        name: category.name,
        slug: category.slug,
        imageUrl: typeof tile.image === 'object' ? tile.image?.url : null,
        count: count.totalDocs,
        icon: CAT_ICONS[i % CAT_ICONS.length],
        gradient: CAT_GRADIENTS[i % CAT_GRADIENTS.length],
      }
    }),
  ) ?? []
  const resolvedTiles = categoryTiles.filter(Boolean) as any[]

  // Editor's picks — re-fetch by ID so designer/category/engine resolve at the depth AssetCard needs.
  const pickIds = (settings?.editorsPicks?.assets || []).map((a: any) => (typeof a === 'object' ? a.id : a))
  const picks = pickIds.length > 0
    ? await payload
        ?.find({ collection: 'assets', where: { id: { in: pickIds }, status: { equals: 'published' } }, depth: 1, limit: 20 })
        .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }
    : { docs: [] as any[] }
  // Preserve the admin's chosen order rather than the DB's default sort.
  const pickCards = pickIds
    .map((id: any) => picks.docs.find((d: any) => String(d.id) === String(id)))
    .filter(Boolean)
    .map(toCardData)

  const featureBands = settings?.featureBands || []

  const latestPosts = sections?.blog
    ? await payload
        ?.find({ collection: 'posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 3, depth: 1 })
        .catch(() => ({ docs: [] as any[] })) ?? { docs: [] as any[] }
    : { docs: [] as any[] }

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
  const isLoggedIn = Boolean(user)

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    categoryTiles: () =>
      sections?.marketplace && resolvedTiles.length > 0 && (
        <section className="section" key="categoryTiles">
          <div className="container">
            <Reveal>
              <div className="sec-head">
                <div className="txt">
                  <h2>{settings?.categoryTiles?.heading || 'Explore by category'}</h2>
                  {settings?.categoryTiles?.subheading && <p>{settings.categoryTiles.subheading}</p>}
                </div>
              </div>
              <div className="cat-grid">
                {resolvedTiles.map((t, i) => (
                  <Link key={i} className="cat-tile" href={`/marketplace?category=${t.slug}`}>
                    {t.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="ph" src={t.imageUrl} alt="" />
                    ) : (
                      <>
                        <div className="ph" style={{ background: t.gradient }} />
                        <div className="thumb-dots" />
                        <div className="thumb-icon-wrap"><svg><use href={`#${t.icon}`} /></svg></div>
                      </>
                    )}
                    <div className="scrim" />
                    <div className="txt">
                      <div className="name">{t.name}</div>
                      <div className="count mono">{t.count} item{t.count === 1 ? '' : 's'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ),
    howItWorks: () =>
      (buyerSteps.length > 0 || designerSteps.length > 0) && (
        <section className="section" key="howItWorks">
          <div className="container">
            <Reveal>
              <div className="sec-head"><div className="txt"><h2>How it works</h2></div></div>
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
                <div className="txt"><h2>Featured assets</h2></div>
                <Link className="sec-link" href="/marketplace" style={{ fontSize: 13, color: 'var(--violet)', fontWeight: 600 }}>Browse all</Link>
              </div>
              <FeaturedTabs featured={featuredCards} free={freeCards} isLoggedIn={isLoggedIn} />
            </Reveal>
          </div>
        </section>
      ),
    editorsPicks: () =>
      pickCards.length > 0 && (
        <section className="section" key="editorsPicks">
          <div className="container">
            <Reveal>
              <div className="sec-head">
                <div className="txt">
                  <h2>{settings?.editorsPicks?.heading || "Editor's picks"}</h2>
                  {settings?.editorsPicks?.subheading && <p>{settings.editorsPicks.subheading}</p>}
                </div>
              </div>
              <div className="scroll-row">
                {pickCards.map((a, i) => (
                  <AssetCard key={a.id} asset={a} index={i} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ),
    featureBands: () =>
      featureBands.length > 0 && (
        <section className="section section-ink" key="featureBands">
          <div className="container">
            {featureBands.map((band: any, i: number) => (
              <Reveal key={i}>
                <div className={`fband ${band.imageSide === 'left' ? 'flip' : ''}`}>
                  <div>
                    {band.eyebrow && <div className="fband-eyebrow">{band.eyebrow}</div>}
                    <h3>{band.heading}</h3>
                    <p>{band.body}</p>
                  </div>
                  <div className="fband-media">
                    {typeof band.image === 'object' && band.image?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={band.image.url} alt="" />
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
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
    blogRow: () =>
      sections?.blog && latestPosts.docs.length > 0 && (
        <section className="section" key="blogRow">
          <div className="container">
            <Reveal>
              <div className="sec-head">
                <div className="txt"><h2>{settings?.blogRow?.heading || 'Latest from the blog'}</h2></div>
                <Link className="sec-link" href="/blog">All posts</Link>
              </div>
              <div className="grid-dense" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                {latestPosts.docs.map((p: any) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="card-a">
                    <div className="thumb" />
                    <div className="card-body">
                      <h3>{p.title}</h3>
                      {p.excerpt && <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{p.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ),
    testimonials: () =>
      testimonials.length > 0 && (
        <section className="section" key="testimonials">
          <div className="container">
            <Reveal>
              <div className="sec-head"><div className="txt"><h2>What people say</h2></div></div>
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
        <div className="hero-deco">
          <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
          <div className="blob blob-4" /><div className="blob blob-5" /><div className="blob blob-6" /><div className="blob blob-7" />
          <svg className="hero-wave" viewBox="0 0 1200 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A24CC8" /><stop offset="50%" stopColor="#7E6BDB" /><stop offset="100%" stopColor="#38B6FF" />
              </linearGradient>
            </defs>
            <path d="M0,180 C200,100 350,240 600,160 C850,80 1000,220 1200,140" fill="none" stroke="url(#waveGrad)" strokeWidth="1.5" opacity=".5" />
            <path d="M0,220 C220,260 380,140 620,200 C860,260 1020,140 1200,190" fill="none" stroke="url(#waveGrad)" strokeWidth="1" opacity=".3" />
          </svg>
        </div>
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
          <div className="engine-marquee">
            {[...engineLabels, ...engineLabels].map((label: string, i: number) => (
              <span key={i} className="engine-pill">{label}</span>
            ))}
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
                    <Link className="btn btn-primary" href="/sell">{settings?.ctaSellLabel || 'Start selling'}</Link>
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
