import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CompareBar } from './components/CompareBar'
import './globals.css'

const fallbackTitle = 'Broadexa — The home of broadcast design'
const fallbackDescription =
  'A global marketplace for broadcast-ready real-time assets. Virtual sets, AR graphics and show packages for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry and more.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'site-settings' }))
    .catch(() => null)

  const favicon: any = settings?.favicon

  return {
    title: settings?.defaultSeoTitle || fallbackTitle,
    description: settings?.defaultSeoDescription || fallbackDescription,
    icons: favicon?.url ? { icon: favicon.url } : undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <svg style={{ display: 'none' }} aria-hidden="true">
          <symbol id="ic-monitor" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M8 21h8M12 17v4" /></symbol>
          <symbol id="ic-ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3" /><circle cx="12" cy="12" r="2.2" /></symbol>
          <symbol id="ic-wave" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round"><path d="M2 12h2M6 7v10M10 4v16M14 8v8M18 6v12M22 12h-2" /></symbol>
          <symbol id="ic-signal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19l6-13 6 13" /><path d="M8 19l3-6.5 3 6.5" /><circle cx="11" cy="5" r="1.2" fill="currentColor" stroke="none" /></symbol>
          <symbol id="ic-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none" /></symbol>
        </svg>
        {children}
        <CompareBar />
      </body>
    </html>
  )
}
