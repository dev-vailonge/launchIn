'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Sparkles, Lightbulb, Plus, MoreVertical, Trash2, FileText, X } from 'lucide-react'

interface GeneratedIdea {
  id: string
  title: string
  description: string
  target_audience: string
  challenges: string
  created_at: string
}

export default function Dashboard() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [ideaToDelete, setIdeaToDelete] = useState<GeneratedIdea | null>(null)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('generated_ideas')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setIdeas(data || [])
      } catch (error) {
        console.error('Error fetching ideas:', error)
        toast.error('Erro ao carregar suas ideias')
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [router])

  const handleDelete = async (idea: GeneratedIdea) => {
    try {
      const { error } = await supabase
        .from('generated_ideas')
        .delete()
        .eq('id', idea.id)

      if (error) throw error

      setIdeas(ideas.filter(i => i.id !== idea.id))
      toast.success('Ideia excluída com sucesso')
    } catch (error) {
      console.error('Error deleting idea:', error)
      toast.error('Erro ao excluir ideia')
    } finally {
      setIdeaToDelete(null)
    }
  }

  const handleGeneratePlan = (idea: GeneratedIdea) => {
    router.push(`/dashboard/gerar-plano?id=${idea.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Minhas Ideias</h1>
          <button
            onClick={() => router.push('/dashboard/gerar-ideias')}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            <span>Gerar Nova Ideia</span>
          </button>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma ideia salva ainda</h2>
            <p className="text-gray-600 mb-6">Comece gerando sua primeira ideia de negócio!</p>
            <button
              onClick={() => router.push('/dashboard/gerar-ideias')}
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Gerar Primeira Ideia</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow border border-purple-100"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {idea.title}
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === idea.id ? null : idea.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {showMenu === idea.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => {
                          handleGeneratePlan(idea)
                          setShowMenu(null)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Gerar Plano
                      </button>
                      <button
                        onClick={() => {
                          setIdeaToDelete(idea)
                          setShowMenu(null)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {ideaToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirmar exclusão</h3>
                <button
                  onClick={() => setIdeaToDelete(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir a ideia "{ideaToDelete.title}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIdeaToDelete(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(ideaToDelete)}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 