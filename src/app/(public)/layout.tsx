'use client'

import { Inter } from "next/font/google"
import { ClientLayout } from "@/components/ClientLayout"

const inter = Inter({ subsets: ["latin"] });

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} min-h-screen`}>
      <ClientLayout>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </ClientLayout>
    </div>
  )
} 