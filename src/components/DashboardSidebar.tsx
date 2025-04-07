'use client'

import { LogOut, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Logout realizado com sucesso')
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">LaunchIn</h2>
      </div>

      <nav className="flex-1 px-4">
        <Link
          href="/dashboard"
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/dashboard'
              ? 'bg-purple-100 text-purple-900'
              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-900'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Contatos</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
} 