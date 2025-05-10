import { NextResponse } from 'next/server'
import { generateLaunchPlan } from '@/lib/openai'

export const maxDuration = 90 // 90 segundos

export async function POST(req: Request) {
  console.log('[API Route] Received request to generate launch plan')
  
  try {
    const body = await req.json()
    console.log('[API Route] Request body:', body)

    const { title, description, target_audience, challenges } = body

    if (!title || !description || !target_audience || !challenges) {
      console.log('[API Route] Missing required fields:', { title, description, target_audience, challenges })
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios (título, descrição, público-alvo e desafios)' },
        { status: 400 }
      )
    }

    console.log('[API Route] Calling OpenAI service...')
    const plan = await generateLaunchPlan({
      title,
      description,
      target_audience,
      challenges
    })

    console.log('[API Route] OpenAI response:', plan)

    // Validate the response format
    if (!plan || !plan.steps || !Array.isArray(plan.steps)) {
      console.error('[API Route] Invalid response format from OpenAI:', plan)
      return NextResponse.json(
        { error: 'Formato de resposta inválido do serviço de IA' },
        { status: 500 }
      )
    }

    console.log('[API Route] Successfully generated plan')
    return NextResponse.json(plan)
  } catch (error: any) {
    console.error('[API Route] Error details:', {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack
    })
    
    if (error.message === 'OpenAI API key is not configured') {
      return NextResponse.json(
        { error: 'O serviço de geração de planos não está configurado corretamente.' },
        { status: 503 }
      )
    }
    
    if (error.message === 'Invalid OpenAI API key') {
      return NextResponse.json(
        { error: 'Erro de autenticação com o serviço de geração de planos.' },
        { status: 401 }
      )
    }
    
    if (error.message === 'OpenAI API rate limit exceeded') {
      return NextResponse.json(
        { error: 'Limite de requisições excedido. Tente novamente em alguns minutos' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: `Erro ao gerar plano: ${error.message}` },
      { status: 500 }
    )
  }
} 