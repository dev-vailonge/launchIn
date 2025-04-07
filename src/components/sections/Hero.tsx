import { Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Transformando o futuro do lançamento de produtos</span>
          </div>
          
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Sua ideia em planos prontos</span>
            <span className="block gradient-text">em menos de 10 minutos</span>
          </h1>
          
          <p className="mt-6 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
            Aproveite o poder da IA para aumentar em até 70% a velocidade dos seus lançamentos. Tenha ideias inovadoras e crie planos simples de lançamento. Do conceito à execução, ajudamos você a construir seu próximo SaaS.
          </p>
        </div>
      </div>
    </section>
  )
} 