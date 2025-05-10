import { NextResponse } from 'next/server'
import { generateBusinessIdeas } from '@/lib/openai'

// Configurar um tempo limite maior para a rota
export const maxDuration = 90 // 90 segundos

export async function POST(req: Request) {
  console.log('[API Route] Received request to generate ideas')
  
  try {
    const { prompt } = await req.json()
    console.log('[API Route] Received prompt:', prompt)

    if (!prompt) {
      console.log('[API Route] No prompt provided')
      return NextResponse.json(
        { error: 'O prompt é obrigatório' },
        { status: 400 }
      )
    }

    console.log('[API Route] Calling OpenAI service...')
    const ideas = await generateBusinessIdeas(prompt)
    console.log('[API Route] Successfully generated ideas')
    return NextResponse.json(ideas)
  } catch (error: any) {
    console.error('[API Route] Error details:', {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack
    })
    
    // Mapeamento de erros específicos para mensagens amigáveis
    if (error.message === 'OpenAI API key is not configured') {
      console.error('[API Route] OpenAI API key not configured')
      return NextResponse.json(
        { error: 'O serviço de geração de ideias não está configurado corretamente. Verifique a variável de ambiente OPENAI_API_KEY.' },
        { status: 503 }
      )
    }
    
    if (error.message === 'Invalid OpenAI API key') {
      console.error('[API Route] Invalid OpenAI API key')
      return NextResponse.json(
        { error: 'Erro de autenticação com o serviço de geração de ideias. Verifique se a chave da API está correta.' },
        { status: 401 }
      )
    }
    
    if (error.message === 'OpenAI API rate limit exceeded') {
      console.error('[API Route] Rate limit exceeded')
      return NextResponse.json(
        { error: 'Limite de requisições excedido. Tente novamente em alguns minutos' },
        { status: 429 }
      )
    }

    console.error('[API Route] Unhandled error')
    return NextResponse.json(
      { error: `Erro ao gerar ideias: ${error.message}` },
      { status: 500 }
    )
  }
} 