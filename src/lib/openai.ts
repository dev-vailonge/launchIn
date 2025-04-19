import OpenAI from 'openai'

// Verificação da API key no ambiente server-side
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('[OpenAI Service] API key is not configured in environment variables')
}

const openai = new OpenAI({
  apiKey: apiKey || '', // Fallback para string vazia para evitar erro de inicialização
  timeout: 60000, // 60 segundos de timeout
  maxRetries: 3, // Número de tentativas em caso de erro
})

const SYSTEM_PROMPT = `Você é um especialista em geração de ideias de negócios inovadores.
Para cada solicitação, gere 6 ideias diferentes de negócios relacionadas ao tema fornecido.
Cada ideia deve ter:
- Um título curto e atraente
- Uma descrição detalhada do negócio em até 2 parágrafos
- O público-alvo principal
- Principais desafios de implementação

Formate a resposta em JSON seguindo exatamente esta estrutura:
{
  "ideas": [
    {
      "title": "Título da Ideia",
      "description": "Descrição detalhada",
      "targetAudience": "Público-alvo",
      "challenges": "Principais desafios"
    }
  ]
}`

export async function generateBusinessIdeas(prompt: string) {
  console.log('[OpenAI Service] Starting idea generation with prompt:', prompt)
  
  if (!apiKey) {
    console.error('[OpenAI Service] API key is missing')
    throw new Error('OpenAI API key is not configured')
  }

  try {
    console.log('[OpenAI Service] Making API request...')
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Mudando para gpt-3.5-turbo que é mais acessível
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    console.log('[OpenAI Service] Received response from API')
    const response = completion.choices[0].message.content
    if (!response) {
      console.error('[OpenAI Service] No content in response')
      throw new Error('No response from OpenAI')
    }

    console.log('[OpenAI Service] Parsing JSON response')
    const parsedResponse = JSON.parse(response)
    console.log('[OpenAI Service] Successfully generated ideas:', parsedResponse)
    return parsedResponse
  } catch (error: any) {
    console.error('[OpenAI Service] Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    })

    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key')
    } else if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded')
    } else if (error.response?.status === 500) {
      throw new Error('OpenAI API internal server error')
    }
    throw new Error(error.message || 'Failed to generate ideas')
  }
} 