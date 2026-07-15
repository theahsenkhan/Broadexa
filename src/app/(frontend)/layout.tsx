import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
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
      <body>{children}</body>
    </html>
  )
}
