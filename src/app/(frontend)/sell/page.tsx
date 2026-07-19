import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function SellPage() {
  const settings = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'site-settings' }))
    .catch(() => null)
  const user = await getSessionUser().catch(() => null)

  const steps = settings?.sellSteps || []
  const isDesigner = user && (user.role === 'designer' || user.role === 'admin')
  const sellHref = isDesigner ? '/dashboard/new-asset' : '/signup?role=designer'
  const sellLabel = isDesigner ? 'Upload an asset' : undefined

  return (
    <>
      <SiteNav />

      <section className="hero">
        <div className="tc">For real-time designers</div>
        <h1>
          <em>{settings?.sellHeadline || 'Sell your scenes. Keep 80%.'}</em>
        </h1>
        <p>
          {settings?.sellSubhead ||
            'List virtual sets, AR graphics and show packages for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry, Brainstorm, Chyron, Ross and Reality. You set your own prices. We take 20% — nothing else.'}
        </p>
        <div className="hero-ctas">
          <Link className="btn btn-primary" href={sellHref}>{sellLabel || 'Start selling'}</Link>
          <Link className="btn btn-ghost" href="/faq">Read the FAQ</Link>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head"><h2>How it works</h2></div>
            <div className="hiw-steps">
              {steps.map((s: any, i: number) => (
                <div key={i} className="hiw-card">
                  <div className="hiw-num">{i + 1}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ background: 'var(--card)', borderTop: '1px solid var(--line)' }}>
        <div className="container">
          <div className="sec-head"><h2>What you can sell</h2></div>
          <div className="chips">
            <span className="chip">Virtual sets</span>
            <span className="chip">AR graphics</span>
            <span className="chip">Show packages</span>
            <span className="chip">Lower thirds</span>
            <span className="chip">Data visualization</span>
            <span className="chip">Transitions &amp; stingers</span>
            <span className="chip">Free assets (under a studio name if you like)</span>
          </div>
        </div>
      </section>

      <section className="hero" style={{ padding: '64px 24px' }}>
        <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, marginBottom: 16 }}>
          {settings?.sellClosingHeadline || 'Ready to list your first scene?'}
        </h2>
        <Link className="btn btn-primary" href={sellHref}>{isDesigner ? 'Upload an asset' : 'Create your designer account'}</Link>
      </section>

      <SiteFooter />
    </>
  )
}
