import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

// The homepage reads SiteSettings — your CMS visibility switches work from day one.
export default async function Home() {
  const payload = await getPayload({ config })

  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  const sections = settings?.sections

  const assets = await payload
    .find({
      collection: 'assets',
      where: { status: { equals: 'published' } },
      limit: 4,
      sort: '-createdAt',
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  return (
    <>
      <div className="container">
        <nav className="nav">
          <div className="logo">BROADEXA</div>
          <div className="navlinks">
            {sections?.marketplace && <Link href="/marketplace">Marketplace</Link>}
            {sections?.services && <Link href="/services">Services</Link>}
            {sections?.awards && <Link href="/awards">Awards</Link>}
            {sections?.blog && <Link href="/blog">Blog</Link>}
            {sections?.jobs && <Link href="/jobs">Jobs</Link>}
          </div>
          <div className="nav-cta">
            <Link className="btn btn-ghost" href="/admin">Sign in</Link>
            {sections?.sellPage && (
              <Link className="btn btn-primary" href="/sell">Sell your scenes</Link>
            )}
          </div>
        </nav>
      </div>

      <section className="hero">
        <div className="tc">● REC — Coming soon</div>
        <h1>
          The home of
          <br />
          <em>broadcast design</em>
        </h1>
        <p>
          Virtual sets, AR graphics and full show packages — built by real-time designers,
          verified on the engines you run.
        </p>
        <div className="hero-ctas">
          {sections?.marketplace ? (
            <Link className="btn btn-primary" href="/marketplace">Browse the marketplace</Link>
          ) : (
            <span className="btn btn-primary">Launching soon</span>
          )}
        </div>
      </section>

      {sections?.marketplace && assets.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head">
              <h2>Featured assets</h2>
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

      <div className="container">
        <footer className="footer">
          <div className="logo" style={{ fontSize: 13 }}>BROADEXA</div>
          <span>{settings?.tagline || 'The home of broadcast design'}</span>
        </footer>
      </div>
    </>
  )
}
