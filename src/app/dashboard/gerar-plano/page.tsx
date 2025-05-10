'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { LaunchPlan, LaunchPlanStep, LaunchPlanTask } from '@/types/idea'

interface GeneratedIdea {
  id: string
  title: string
  description: string
  target_audience: string
  challenges: string
  created_at: string
}

export default function GerarPlano() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ideaId = searchParams.get('id')
  const [loading, setLoading] = useState(false)
  const [savingPlan, setSavingPlan] = useState(false)
  const [plan, setPlan] = useState<LaunchPlan | null>(null)
  const [idea, setIdea] = useState<GeneratedIdea | null>(null)

  useEffect(() => {
    const fetchIdea = async () => {
      if (!ideaId) {
        toast.error('ID da ideia não encontrado')
        router.push('/dashboard')
        return
      }

      try {
        const { data, error } = await supabase
          .from('generated_ideas')
          .select('*')
          .eq('id', ideaId)
          .single()

        if (error) throw error
        if (!data) {
          toast.error('Ideia não encontrada')
          router.push('/dashboard')
          return
        }

        setIdea(data)
      } catch (error) {
        console.error('Error fetching idea:', error)
        toast.error('Erro ao carregar a ideia')
        router.push('/dashboard')
      }
    }

    fetchIdea()
  }, [ideaId, router])

  const generatePlan = async () => {
    if (!idea) return

    setLoading(true)
    try {
      console.log('Sending request with data:', { 
        title: idea.title,
        description: idea.description,
        target_audience: idea.target_audience,
        challenges: idea.challenges
      })

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: idea.title,
          description: idea.description,
          target_audience: idea.target_audience,
          challenges: idea.challenges
        })
      })

      const data = await response.json()
      console.log('API Response status:', response.status)
      console.log('API Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar o plano')
      }

      if (!data.steps || !Array.isArray(data.steps)) {
        console.error('Invalid response format:', data)
        throw new Error('Formato de resposta inválido')
      }

      setPlan(data)
      toast.success('Plano gerado com sucesso!')
    } catch (error: any) {
      console.error('Full error details:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      })
      toast.error(`Erro ao gerar o plano: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const savePlan = async () => {
    if (!plan || !idea) return

    setSavingPlan(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Você precisa estar logado para salvar o plano')
        return
      }

      const { error } = await supabase
        .from('launch_plans')
        .insert({
          user_id: user.id,
          idea_id: idea.id,
          title: idea.title,
          description: idea.description,
          target_audience: idea.target_audience,
          challenges: idea.challenges,
          plan_data: plan
        })

      if (error) throw error

      toast.success('Plano salvo com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving plan:', error)
      toast.error('Erro ao salvar o plano')
    } finally {
      setSavingPlan(false)
    }
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Voltar</span>
          </button>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Plano de Lançamento</h1>
          </div>
        </div>

        {/* Idea Details */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Ideia: {idea.title}
          </h2>
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-purple-600 mb-1">Descrição:</h3>
              <p className="text-gray-700">{idea.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-600 mb-1">Público-alvo:</h3>
              <p className="text-gray-700">{idea.target_audience}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-600 mb-1">Desafios:</h3>
              <p className="text-gray-700">{idea.challenges}</p>
            </div>
          </div>
          {!plan && (
            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Gerando plano...' : 'Gerar Plano de Lançamento'}
            </button>
          )}
        </div>

        {/* Launch Plan */}
        {plan && (
          <div className="space-y-8">
            {plan.steps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {index + 1}. {step.title}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 mb-2">Objetivo:</h4>
                    <p className="text-gray-700">{step.objective}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 mb-2">Dica Mestre:</h4>
                    <p className="text-gray-700">{step.masterTip}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 mb-2">Como medir o sucesso:</h4>
                    <p className="text-gray-700">{step.successMeasure}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 mb-2">Tarefas:</h4>
                    <ul className="space-y-3">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start">
                          <span className="h-6 w-6 rounded-full border-2 border-purple-200 flex items-center justify-center text-sm text-purple-600 mr-3 flex-shrink-0">
                            {taskIndex + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{task.name}</p>
                            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Floating Save Button */}
      {plan && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={savePlan}
            disabled={savingPlan}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Save className="h-5 w-5" />
            <span>{savingPlan ? 'Salvando...' : 'Salvar Plano'}</span>
          </button>
        </div>
      )}
    </div>
  )
} 