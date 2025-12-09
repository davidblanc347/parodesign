import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Voice to Diagram - AI-Powered Diagram Generation',
  description: 'Convert natural spoken descriptions into live, auto-laid-out diagrams using voice and AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
