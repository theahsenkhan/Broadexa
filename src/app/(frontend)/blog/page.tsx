import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 30,
  })

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Blog</div>
          <h1>Notes on broadcast design</h1>
        </div>

        {posts.docs.length === 0 ? (
          <div className="empty" style={{ marginBottom: 60 }}>No posts yet.</div>
        ) : (
          <div className="grid" style={{ paddingBottom: 60 }}>
            {posts.docs.map((p: any) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="card-a">
                <div className="thumb" />
                <div className="card-body">
                  <h3>{p.title}</h3>
                  <div className="byline">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ''}</div>
                  {p.excerpt && <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
