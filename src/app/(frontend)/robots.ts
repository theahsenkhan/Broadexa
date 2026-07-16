import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://broadexa.netlify.app'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/dashboard', '/account', '/api'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
