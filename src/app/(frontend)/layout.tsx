import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Broadexa — The home of broadcast design',
  description:
    'A global marketplace for broadcast-ready real-time assets. Virtual sets, AR graphics and show packages for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
