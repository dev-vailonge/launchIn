import { Sparkles, Brain, Rocket } from 'lucide-react'

const steps = [
  {
    title: 'Gere Ideias',
    description: 'Use nossa IA para criar ideias inovadoras e descobrir oportunidades únicas no seu mercado.',
    icon: Sparkles,
  },
  {
    title: 'Análise com IA',
    description: 'Nossa IA analisa tendências de mercado, concorrência e potencial para validar e refinar suas ideias.',
    icon: Brain,
  },
  {
    title: 'Plano de Lançamento',
    description: 'Obtenha um plano de lançamento detalhado e acionável, adaptado à sua ideia e condições de mercado.',
    icon: Rocket,
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-purple-400 font-semibold tracking-wide uppercase">Como Funciona</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Da Ideia ao Lançamento
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
            Transforme sua visão em um lançamento bem-sucedido com nossa plataforma baseada em IA em três passos simples.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="absolute flex items-center justify-center h-16 w-16 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400">
                  <step.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="ml-20">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold">
                      {index + 1}
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-white tracking-tight">{step.title}</h3>
                  </div>
                  <p className="mt-4 text-base text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 