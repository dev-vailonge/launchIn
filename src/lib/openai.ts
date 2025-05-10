import OpenAI from 'openai'

// Verificação da API key no ambiente server-side
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('[OpenAI Service] API key is not configured in environment variables')
}

const openai = new OpenAI({
  apiKey: apiKey || '', // Fallback para string vazia para evitar erro de inicialização
  timeout: 120000, // 120 segundos (2 minutos) de timeout
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

const LAUNCH_PLAN_SYSTEM_PROMPT = `Você é um especialista em criação de planos de lançamento para sites, aplicativos e produtos digitais.

Para cada ideia de negócio fornecida, crie um plano de lançamento detalhado com 6 etapas.

Cada etapa deve conter:
- Um título claro e objetivo
- Um objetivo específico e direto
- No minimo 5 tarefas práticas
- Para cada tarefa, inclua uma breve descrição de como executar ou uma sugestão prática de como realizá-la, mesmo com poucos recursos

As etapas devem seguir esta ordem fixa:
1. Validar
2. Construir o MVP
3. Estratégia de marketing
4. Lançamento
5. Observar comportamento e feedback
6. Iterar ou matar

Leve em consideração o contexto completo da ideia, incluindo:
- A descrição do negócio
- O público-alvo
- Os desafios identificados

Importante:
- Seja direto
- Use linguagem prática e acessível
- Não repita etapas
- Quando a tarefa envolver contratação, ofereça também a alternativa de executar sozinho
- Priorize tarefas que levem à validação com o menor custo possível
- Estruture visualmente com títulos e bullets

Instruções específicas por etapa:

1. **Validar**
   - Criar um formulário de validação com perguntas como no exemplo:
   - Adicione essas perguntas abaixo na descrição ou sugira outras perguntas para validar a ideia, importante ter as perguntas.
   - Pergunta 1: Quais são os principais problemas que você enfrenta?
   - Pergunta 2: Como você acha que minha solução pode ajudar você?
   - Pergunta 3: Você estaria disposto a pagar por esta solução? Quanto?
   - Dê exemplos de como fazer landing pages, entrevistas e simulações de compra.
   - Dê sugestoes de ferramentas de validação como Typeform, Google Forms, etc.
   - Dê sugestoes de ferramentas para landing pages como Vercel, Webflow, etc.
   - Dê sugestoes de ferramentas de email marketing como Mailchimp, etc.

2. **Construir o MVP**
- Liste stacks e ferramentas modernas para desenvolvimento rápido (ex: Next.js, Supabase, Firebase, Stripe, Tailwind, Vercel).
- Sugira também alternativas no-code/low-code quando fizer sentido (ex: Softr, Bubble, Glide, Tally, Notion + Super).
- Com base no tipo de ideia, sugira o escopo mínimo possível que ainda entrega valor real. Evite funcionalidades "nice to have".
- Estimule que o MVP seja construído e lançado em até 10 dias.
- Dê sugestões de **1 funcionalidade principal** que represente a essência do produto e resolva o problema central do usuário.
- Indique se é possível fazer sozinho ou se vale a pena contratar ajuda, com links de onde encontrar freelancers (ex: Fiverr, Upwork, 99freelas).
- Dê exemplos reais de MVPs simples que funcionaram (ex: Gumroad começou com uma única página, o Buffer vendia um botão fake que levava pra um Typeform).

**Exemplo de output desejado:**

- *Stack recomendada:* Next.js + Supabase + Stripe + Vercel
- *Alternativa no-code:* Softr + Airtable + Gumroad
- *Funcionalidade principal:* Criar um plano de mentoria com etapas personalizadas
- *Escopo mínimo sugerido:*
  - Login com Google
  - Criação de 1 projeto com nome e descrição
  - Upload de arquivos e comentários simples
- *Tempo estimado para desenvolvimento solo:* 5 a 7 dias
- *Se contratar ajuda:* crie um briefing curto e contrate em plataformas como Fiverr ou Upwork

3. **Estratégia de Marketing**
- Ajude a definir o **modelo de negócio mais adequado** à ideia (ex: assinatura mensal, plano vitalício, freemium, pagamento por uso).
- Sugira **valores iniciais de preços** específicos (ex: R$19/mês, $49 vitalício) com justificativas simples — e como testar variações de pricing (ex: usar um formulário com três opções).
- Mostre **quais canais de aquisição** podem funcionar melhor com base no público-alvo e no tipo de SaaS:
  - Para devs: X (Twitter), Reddit, comunidades no Discord, Product Hunt
  - Para creators: Instagram, TikTok, YouTube, Email marketing
  - Para B2B: LinkedIn, SEO, Cold outreach
  - Para nichos: comunidades específicas, fóruns, grupos no WhatsApp/Telegram
- Dê sugestões de **campanhas práticas** para tração inicial, como:
  - "Receba acesso vitalício se for um dos 20 primeiros a testar"
  - "Indique 3 amigos e ganhe 1 mês grátis"
  - "Desconto exclusivo para quem vier de [canal X]"
- Indique **ferramentas de marketing** para cada tipo de canal:
  - **SEO:** Ahrefs, Ubersuggest, Google Search Console
  - **Ads:** Google Ads, Facebook/Meta Ads, TikTok Ads
  - **Email marketing:** MailerLite, ConvertKit, Substack
  - **Análise e tracking:** Google Analytics, Pixel do Meta, UTM.io
- Oriente como **criar um funil simples** para capturar leads e validar conversão:
  - Landing page com call-to-action
  - Lead magnet ou oferta de pré-lançamento
  - Lista de espera com email automatizado (ex: via MailerLite)

**Exemplo de output esperado:**

- *Modelo de negócio sugerido:* Assinatura mensal de R$19 com 7 dias grátis
- *Preço alternativo:* Plano vitalício de R$49 para os primeiros 50 usuários
- *Canais principais para aquisição:* YouTube (vídeos curtos mostrando a ferramenta), Discord (comunidades de devs), Product Hunt
- *Campanha recomendada:* "50 contas vitalícias para quem entrar na pré-venda até sexta"
- *Campanha recomendada:* “50 contas vitalícias para quem entrar na pré-venda até sexta”
- *Ferramentas sugeridas:* MailerLite para capturar leads, Google Ads para tráfego segmentado, Ahrefs para SEO técnico

4. **Lançamento**
   - Ensine estratégias de escassez, urgência e pré-venda (ex: bônus, limite de contas), seja específico nas estratégias, list pelo menos 3 estratégias e de exemplos de como aplicar em cada uma.
   - Dê ideias de postagens, threads, e-mails e como comunicar o lançamento.
   - Mostre como criar expectativa com conteúdo nas redes (build in public), de 5 maneiras de construir em publico atraves de conteudo.

5. **Observar comportamento e feedback**
   - Liste métricas importantes (retenção, conversão, tempo de uso, churn), seja específico, mostre exemplos de métricas para cada tipo de negócio.
   - Indique ferramentas fáceis de usar.
   - Ensine a fazer entrevistas pós-uso e analisar padrões de comportamento, de 3 maneiras de fazer entrevistas pós-uso.

6. **Iterar ou matar**
   - Dê critérios práticos para decidir se continua ou encerra
   - Fale sobre como Pivotalizar o negócio, de 3 maneiras de como fazer isso.
   - Se continuar, como comunicar melhorias e organizar feedback.
   - Se encerrar, como aprender com a experiência, documentar e reaproveitar ativos criados.


Formate a resposta em JSON com a seguinte estrutura exata:
{
  "steps": [
    {
      "title": "Título da Etapa",
      "objective": "Objetivo específico da etapa",
      "masterTip": "Dica mestre para a etapa",
      "successMeasure": "Como medir o sucesso",
      "tasks": [
        {
          "name": "Título curto da tarefa",
          "description": "Explicação prática de como realizar a tarefa"
        }
      ]
    }
  ]
}
`

interface IdeaContext {
  title: string
  description: string
  target_audience: string
  challenges: string
}

export async function generateBusinessIdeas(prompt: string) {
  console.log('[OpenAI Service] Starting idea generation with prompt:', prompt)
  
  if (!apiKey) {
    console.error('[OpenAI Service] API key is missing')
    throw new Error('OpenAI API key is not configured')
  }

  try {
    console.log('[OpenAI Service] Making API request...')
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
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

export async function generateLaunchPlan(idea: IdeaContext) {
  console.log('[OpenAI Service] Starting launch plan generation for idea:', idea.title)
  
  if (!apiKey) {
    console.error('[OpenAI Service] API key is missing')
    throw new Error('OpenAI API key is not configured')
  }

  const userPrompt = `Crie um plano de lançamento para a seguinte ideia de negócio:

Título: ${idea.title}
Descrição: ${idea.description}
Público-alvo: ${idea.target_audience}
Desafios: ${idea.challenges}

Por favor, crie um plano de lançamento detalhado com 6 etapas, considerando o contexto completo da ideia.`

  try {
    console.log('[OpenAI Service] Making API request...')
   
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // ou "gpt-4-turbo" se disponível
      messages: [
        { role: "system", content: LAUNCH_PLAN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 2000,
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
    console.log('[OpenAI Service] Successfully generated launch plan:', parsedResponse)
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
    throw new Error(error.message || 'Failed to generate launch plan')
  }
} 