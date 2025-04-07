'use client'

import { Check } from 'lucide-react'
import { useStripeCheckout } from '@/hooks/useStripeCheckout'
import { toast } from 'sonner'
import { useState } from 'react'

const tiers = [
  {
    name: 'Startup',
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTUP_PRICE_ID,
    priceMonthly: 29,
    description: 'Perfeito para empreendedores iniciantes e ideias em desenvolvimento.',
    features: [
      'Até 10 ideias por mês',
      '5 planos de lançamento',
      'Geração básica de ideias com IA',
      'Análise de mercado simplificada',
      'Suporte por email',
    ],
  },
  {
    name: 'Business',
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    priceMonthly: 99,
    description: 'Ideal para empresas em crescimento com múltiplos projetos de lançamento.',
    features: [
      'Ideias ilimitadas',
      'Planos de lançamento ilimitados',
      'Análise avançada de mercado com IA',
      'Validação de ideias',
      'Suporte prioritário',
      'Planos de lançamento personalizados',
      'Cronograma inteligente',
    ],
  },
]

export function Pricing() {
  const { handleCheckout } = useStripeCheckout()
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)

  const handlePriceClick = async (priceId: string | undefined) => {
    if (!priceId) {
      toast.error('ID do plano inválido. Por favor, tente novamente.')
      return
    }

    try {
      setLoadingPlanId(priceId)
      await handleCheckout(priceId)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.')
    } finally {
      setLoadingPlanId(null)
    }
  }

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-purple-400 font-semibold tracking-wide uppercase">Preços</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Planos para Todos os Tamanhos de Equipe
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
            Comece grátis por 30 dias. Sem necessidade de cartão de crédito.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`glass-card p-8 flex flex-col hover:scale-105 transition-transform duration-300 ${
                tier.name === 'Startup' ? 'border-purple-500/50 glow' : ''
              }`}
            >
              {tier.name === 'Startup' && (
                <div className="absolute top-0 right-0 -mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Mais Popular
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                <p className="mt-4 flex items-baseline text-white">
                  <span className="text-5xl font-extrabold tracking-tight gradient-text">
                    R${tier.priceMonthly}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-300">/mês</span>
                </p>
                <p className="mt-6 text-gray-300">{tier.description}</p>

                <ul role="list" className="mt-6 space-y-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="flex-shrink-0 w-6 h-6 text-purple-400" aria-hidden="true" />
                      <span className="ml-3 text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePriceClick(tier.priceId)}
                disabled={loadingPlanId === tier.priceId}
                className="mt-8 block w-full rounded-md py-3 px-6 text-center font-medium transition-colors duration-200
                  bg-purple-600 text-white hover:bg-purple-700 glow
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPlanId === tier.priceId ? 'Processando...' : 'Comece agora'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 