'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  // Check if we're on an auth page
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password', '/magic-link'].includes(pathname)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-purple-600">
              Logo
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!isAuthPage && (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-purple-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 