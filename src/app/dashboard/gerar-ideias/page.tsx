'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { BusinessIdea } from '@/types/idea'

const suggestionPrompts = [
  "Crie uma ideia para app de produtividade",
  "Negócio para mães que trabalham em casa",
  "SaaS simples para desenvolvedores",
  "Marketplace local para artesãos",
  "App de gestão financeira pessoal"
]

export default function GerarIdeias() {
  const router = useRouter()
  const [ideia, setIdeia] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[Page] Starting idea generation submission')
    
    if (!ideia.trim()) {
      console.log('[Page] Empty prompt submitted')
      toast.error('Por favor, descreva sua ideia')
      return
    }

    setLoading(true)
    
    // Criar um AbortController para gerenciar o timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000) // 90 segundos de timeout

    try {
      console.log('[Page] Sending request to API...')
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: ideia }),
        signal: controller.signal
      })

      console.log('[Page] Received API response:', {
        status: response.status,
        statusText: response.statusText
      })

      const data = await response.json()
      console.log('[Page] Parsed response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar ideias')
      }
      
      console.log('[Page] Storing generated ideas in localStorage')
      localStorage.setItem('generatedIdeas', JSON.stringify(data.ideas))
      localStorage.setItem('lastPrompt', ideia)
      
      toast.success('Ideias geradas com sucesso!')
      console.log('[Page] Navigating to results page')
      router.push('/dashboard/gerar-ideias/resultado')
    } catch (error: any) {
      console.error('[Page] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // Tratamento específico para timeout
      if (error.name === 'AbortError') {
        toast.error('O tempo de geração excedeu o limite. Por favor, tente novamente.')
      } else {
        toast.error(error.message || 'Erro ao processar sua ideia. Por favor, tente novamente.')
      }
    } finally {
      clearTimeout(timeout) // Limpar o timeout
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Padrões geométricos de fundo */}
      <div className="absolute inset-0 bg-grid-purple-100/[0.1] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-white/50 -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Logo/Título */}
        <h1 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900">
          LaunchIn
        </h1>
        
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input principal */}
            <div className="relative">
              <textarea
                id="ideia"
                rows={3}
                value={ideia}
                onChange={(e) => setIdeia(e.target.value)}
                placeholder="Descreva sua ideia ou área de interesse..."
                className="w-full px-6 py-4 bg-white border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-purple-500 resize-none text-gray-800 placeholder-gray-400"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
              />
            </div>

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-purple-600 text-white px-6 py-4 rounded-xl hover:bg-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-lg font-medium">{loading ? 'Gerando ideias...' : 'Gerar Ideias'}</span>
            </button>
          </form>

          {/* Sugestões de prompts */}
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center mb-4">
              Ou experimente uma dessas sugestões:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestionPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setIdeia(prompt)}
                  className="px-4 py-2 bg-white/80 hover:bg-purple-50 text-gray-700 rounded-full text-sm transition-all hover:shadow-md border border-purple-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 