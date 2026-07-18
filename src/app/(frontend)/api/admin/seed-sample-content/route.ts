import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'
import { runFullSeed } from '@/lib/seedSampleContent'

// One-click way to populate sample catalog content (designers, listings,
// reviews, homepage picks) without a terminal — visit this URL once while
// signed in as an admin. Safe to run more than once: everything it creates
// is looked up by a unique key first and skipped if it already exists.
export async function GET() {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') {
    return new NextResponse('<p>Sign in as an admin first, then visit this page again.</p>', {
      status: 403,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  const payload = await getPayload({ config })
  const lines: string[] = []
  try {
    await runFullSeed(payload, (msg) => lines.push(msg))
  } catch (err: any) {
    lines.push(`ERROR: ${err.message}`)
  }

  const html = `
    <!doctype html><html><head><meta charset="utf-8"><title>Seeding sample content</title>
    <style>body{font-family:-apple-system,sans-serif;max-width:640px;margin:60px auto;padding:0 20px;color:#14141A}
    h1{font-size:20px}pre{background:#F5F5F7;padding:16px;border-radius:8px;font-size:13px;white-space:pre-wrap;line-height:1.6}
    a{color:#7E6BDB}</style></head><body>
    <h1>Sample content seeded</h1>
    <p>This filled in sample designers, listings, reviews and homepage picks so the site doesn't look empty. Everything here is clearly seed data — edit or delete any of it from <a href="/admin">/admin</a> whenever you're ready to replace it with real listings.</p>
    <pre>${lines.join('\n')}</pre>
    <p>Safe to reload this page any time — it skips anything that already exists.</p>
    </body></html>
  `
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
