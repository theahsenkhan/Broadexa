import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  const post: any = result.docs[0]
  if (!post) notFound()

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <div className="eyebrow">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</div>
        <h1 className="listing-title">{post.title}</h1>
        {Array.isArray(post.categories) && post.categories.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {post.categories.map((c: any) => (
              <span key={c.id || c} className="tag">{typeof c === 'object' ? c.name : c}</span>
            ))}
          </div>
        )}
        <div style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
          {post.content && <RichText data={post.content} />}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
