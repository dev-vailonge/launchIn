'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSubmitted(true)
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao enviar o email de recuperação. Por favor, tente novamente.')
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
              Enviamos instruções de recuperação para <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-700">
              Siga as instruções no email para redefinir sua senha.
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
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Recuperar Senha</h1>
        
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <p className="text-gray-700 text-center">
              Digite seu email e enviaremos instruções para redefinir sua senha.
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
              {loading ? 'Enviando...' : 'Enviar Instruções'}
            </button>
          </form>

          <div className="space-y-3 text-center text-sm">
            <Link href="/login" className="block text-purple-700 hover:text-purple-900 hover:underline">
              Voltar para login
            </Link>
            <Link href="/magic-link" className="block text-purple-700 hover:text-purple-900 hover:underline">
              Entrar com link mágico
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 