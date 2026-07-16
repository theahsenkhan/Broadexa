import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal } from '../components/Reveal'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: categorySlug } = await searchParams
  const payload = await getPayload({ config })

  const categories = await payload.find({ collection: 'blog-categories', limit: 100, sort: 'name' })

  const where: Where = { status: { equals: 'published' } }
  if (categorySlug) {
    const cat = categories.docs.find((c) => c.slug === categorySlug)
    if (cat) where.categories = { equals: cat.id }
  }

  const posts = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: 30,
    depth: 1,
  })

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Blog</div>
          <h1>Notes on broadcast design</h1>
        </div>

        {categories.docs.length > 0 && (
          <div className="filter-row" style={{ marginBottom: 24 }}>
            <Link href="/blog" className={`chip-toggle ${!categorySlug ? 'active' : ''}`}>All</Link>
            {categories.docs.map((c: any) => (
              <Link key={c.id} href={`/blog?category=${c.slug}`} className={`chip-toggle ${categorySlug === c.slug ? 'active' : ''}`}>
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {posts.docs.length === 0 ? (
          <div className="empty list-pad">No posts yet.</div>
        ) : (
          <Reveal>
            <div className="grid list-pad">
              {posts.docs.map((p: any) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="card-a">
                  <div className="thumb" />
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <div className="byline">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ''}</div>
                    {p.excerpt && <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>{p.excerpt}</p>}
                    {Array.isArray(p.categories) && p.categories.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {p.categories.map((c: any) => (
                          <span key={c.id || c} className="tag">{typeof c === 'object' ? c.name : c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
