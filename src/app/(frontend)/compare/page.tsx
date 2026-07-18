import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { CompareView } from './CompareView'

export const dynamic = 'force-dynamic'

export default function ComparePage() {
  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Compare</div>
          <h1>Compare assets</h1>
          <p>Side-by-side specs for the assets you've picked while browsing.</p>
        </div>
        <CompareView />
      </div>
      <SiteFooter />
    </>
  )
}
