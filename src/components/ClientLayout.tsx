'use client'

import { Toaster } from 'sonner'
import { usePathname } from 'next/navigation'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <>
      {children}
      {!isDashboard && <Toaster richColors position="top-right" />}
    </>
  )
} 