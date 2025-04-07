'use client'

import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { DashboardSidebar } from '@/components/DashboardSidebar'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-purple-100 text-gray-900`}>
      <Toaster position="top-right" />
      <div className="flex h-screen">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}