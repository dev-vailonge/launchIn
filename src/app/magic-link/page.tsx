'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function MagicLink() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      setSubmitted(true)
      toast.success('Link mágico enviado! Verifique seu email.')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao enviar o link mágico. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-purple-100">
        <div className="max-w-md mx-auto pt-16 p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Verifique seu Email</h1>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <p className="text-gray-900 mb-4">
              Enviamos um link mágico para <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-700">
              Clique no link enviado para fazer login automaticamente.
            </p>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-700">
              Não recebeu o email?{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-purple-700 hover:text-purple-900 hover:underline font-medium"
              >
                Tentar novamente
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-purple-100">
      <div className="max-w-md mx-auto pt-16 p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Login com Link Mágico</h1>
        
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <p className="text-gray-700 text-center">
              Receba um link de login direto no seu email, sem necessidade de senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                Endereço de Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Seu endereço de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 px-4 rounded-lg hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Link Mágico'}
            </button>
          </form>

          <div className="space-y-3 text-center text-sm">
            <Link href="/login" className="block text-purple-700 hover:text-purple-900 hover:underline">
              Voltar para login com senha
            </Link>
            <Link href="/signup" className="block text-purple-700 hover:text-purple-900 hover:underline">
              Não tem uma conta? Cadastre-se
            </Link>
          </div>

          <p className="text-center text-sm text-gray-700 mt-8">
            Ao continuar, eu concordo com os{' '}
            <Link href="/terms" className="text-purple-700 hover:text-purple-900 hover:underline">
              Termos de Serviço
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="text-purple-700 hover:text-purple-900 hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 