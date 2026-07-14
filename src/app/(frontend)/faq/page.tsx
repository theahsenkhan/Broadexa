import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

export const dynamic = 'force-dynamic'

const faqs: { q: string; a: string }[] = [
  {
    q: 'What is Broadexa?',
    a: 'A marketplace for broadcast-ready real-time assets — virtual sets, AR graphics and show packages — built for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry, Brainstorm, Chyron, Ross and Reality.',
  },
  {
    q: 'What does the commission structure look like?',
    a: 'Designers keep 80% of every sale, on both marketplace assets and custom projects. Broadexa takes a 20% commission. Designers set their own prices.',
  },
  {
    q: 'What does the "Verified" badge mean?',
    a: 'It means the designer supplied an on-engine screen recording of the asset and our team checked it against the listing. It confirms the asset matches what\'s described — it is not a quality guarantee or endorsement.',
  },
  {
    q: 'Can I list an asset without a recording?',
    a: 'Yes — publishing is allowed without a recording, but the listing won\'t carry the Verified badge. Every listing is still reviewed by our team before it goes live.',
  },
  {
    q: 'Are bids on projects public?',
    a: 'No — bids are private, visible only to the project poster, the bidding designer, and Broadexa admins. The number of bids on a project is shown publicly.',
  },
  {
    q: 'Do I need an account to browse?',
    a: 'No — buyers can browse the marketplace and see prices without an account. You\'ll need one to purchase, post a project, or submit a bid.',
  },
  {
    q: 'When do designers get paid?',
    a: 'Payouts run monthly through Stripe Connect. Once you connect your Stripe account from your dashboard, sales are transferred automatically minus the 20% commission.',
  },
  {
    q: 'What\'s your refund policy?',
    a: 'Refunds are handled case-by-case. Contact us with your order details and we\'ll review it against our written refund policy.',
  },
  {
    q: 'Are there free assets?',
    a: 'Yes — browse the Free section of the marketplace for assets designers have made available at no cost.',
  },
  {
    q: 'What is an exclusive buyout?',
    a: 'Some designers offer an exclusive licence at a higher price. Once purchased, the listing is automatically delisted from the marketplace — you\'re the only one who has it.',
  },
]

export default function FaqPage() {
  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">FAQ</div>
          <h1>Frequently asked questions</h1>
        </div>
        <div style={{ maxWidth: 720, paddingBottom: 72, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {faqs.map((f) => (
            <div key={f.q} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 22 }}>
              <h3 style={{ fontFamily: 'Montserrat', fontSize: 15.5, fontWeight: 600, marginBottom: 8 }}>{f.q}</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
