'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { BusinessIdea } from '@/types/idea'

export default function ResultadoIdeias() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<BusinessIdea[]>([])
  const [savingIdeas, setSavingIdeas] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    try {
      const storedIdeas = localStorage.getItem('generatedIdeas')
      if (storedIdeas) {
        const parsedIdeas = JSON.parse(storedIdeas)
        if (Array.isArray(parsedIdeas)) {
          setIdeas(parsedIdeas)
        } else {
          console.error('Stored ideas is not an array:', parsedIdeas)
          toast.error('Erro ao carregar as ideias')
          router.push('/dashboard/gerar-ideias')
        }
      } else {
        console.error('No ideas found in localStorage')
        toast.error('Nenhuma ideia encontrada')
        router.push('/dashboard/gerar-ideias')
      }
    } catch (error) {
      console.error('Error parsing stored ideas:', error)
      toast.error('Erro ao carregar as ideias')
      router.push('/dashboard/gerar-ideias')
    }
  }, [router])

  const handleSaveIdea = async (idea: BusinessIdea, index: number) => {
    try {
      setSavingIdeas(prev => ({ ...prev, [index]: true }))
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Você precisa estar logado para salvar ideias')
        return
      }

      const { error } = await supabase
        .from('generated_ideas')
        .insert({
          user_id: user.id,
          title: idea.title,
          description: idea.description,
          target_audience: idea.targetAudience,
          challenges: idea.challenges,
          original_prompt: localStorage.getItem('lastPrompt') || ''
        })

      if (error) throw error

      toast.success('Ideia salva com sucesso!')
      
      // Desabilitar o botão após salvar
      const updatedIdeas = [...ideas]
      updatedIdeas[index] = { ...idea, saved: true }
      setIdeas(updatedIdeas)
      
    } catch (error) {
      console.error('Error saving idea:', error)
      toast.error('Erro ao salvar a ideia')
    } finally {
      setSavingIdeas(prev => ({ ...prev, [index]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Ideias Geradas</h1>
        </div>

        {/* Grid de ideias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {idea.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {idea.description}
              </p>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-purple-600">Público-alvo:</span>
                  <p className="text-sm text-gray-600">{idea.targetAudience}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-purple-600">Desafios:</span>
                  <p className="text-sm text-gray-600">{idea.challenges}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSaveIdea(idea, index)}
                  disabled={idea.saved || savingIdeas[index]}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    idea.saved
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {idea.saved 
                    ? '✓ Salva' 
                    : savingIdeas[index] 
                      ? 'Salvando...' 
                      : 'Salvar Ideia'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 