import { getPayload } from 'payload'
import config from '@payload-config'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://broadexa.netlify.app'
  const payload = await getPayload({ config }).catch(() => null)
  if (!payload) return []

  const staticRoutes = [
    '', '/marketplace', '/services', '/awards', '/competitions', '/blog', '/jobs',
    '/sell', '/faq', '/terms', '/privacy', '/refund-policy', '/login', '/signup',
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }))

  const [assets, projects, posts, jobs, competitions] = await Promise.all([
    payload.find({ collection: 'assets', where: { status: { equals: 'published' } }, limit: 1000 }).catch(() => ({ docs: [] as any[] })),
    payload.find({ collection: 'projects', where: { status: { equals: 'open' } }, limit: 1000 }).catch(() => ({ docs: [] as any[] })),
    payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 1000 }).catch(() => ({ docs: [] as any[] })),
    payload.find({ collection: 'jobs', where: { status: { equals: 'live' } }, limit: 1000 }).catch(() => ({ docs: [] as any[] })),
    payload.find({ collection: 'competitions', limit: 1000 }).catch(() => ({ docs: [] as any[] })),
  ])

  return [
    ...staticRoutes,
    ...assets.docs.map((a: any) => ({ url: `${base}/marketplace/${a.slug}`, lastModified: a.updatedAt })),
    ...projects.docs.map((p: any) => ({ url: `${base}/services/${p.id}`, lastModified: p.updatedAt })),
    ...posts.docs.map((p: any) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt })),
    ...jobs.docs.map((j: any) => ({ url: `${base}/jobs/${j.id}`, lastModified: j.updatedAt })),
    ...competitions.docs.map((c: any) => ({ url: `${base}/competitions/${c.slug}`, lastModified: c.updatedAt })),
  ]
}
