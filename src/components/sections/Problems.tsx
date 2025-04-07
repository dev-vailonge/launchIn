import { Lightbulb, Rocket, Target } from 'lucide-react'

const features = [
  {
    name: 'Bloqueio na Geração de Ideias',
    description:
      'Dificuldade para criar ideias inovadoras? Nossa IA ajuda você a superar bloqueios criativos e descobrir oportunidades únicas.',
    icon: Lightbulb,
  },
  {
    name: 'Complexidade do Planejamento',
    description:
      'Sobrecarregado com o processo de planejamento? Dividimos estratégias complexas de lançamento em etapas acionáveis com insights guiados por IA.',
    icon: Rocket,
  },
  {
    name: 'Validação de Mercado',
    description:
      'Não tem certeza se sua ideia será bem-sucedida? Nossa IA analisa tendências de mercado e ajuda a validar seus conceitos antes do lançamento.',
    icon: Target,
  },
]

export function Problems() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-purple-400 font-semibold tracking-wide uppercase">Desafios Comuns</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Da Ideia ao Lançamento
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
            Ajudamos empreendedores e inovadores a transformar suas ideias em lançamentos bem-sucedidos com orientação baseada em IA.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="glass-card p-8 hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                    <feature.icon className="h-8 w-8 text-purple-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-medium text-white tracking-tight mb-4">{feature.name}</h3>
                  <p className="text-base text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 