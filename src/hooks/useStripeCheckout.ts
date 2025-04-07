'use client'

import { getStripe } from '@/lib/stripe'
import { toast } from 'sonner'
import Stripe from 'stripe'

export function useStripeCheckout() {
  const handleCheckout = async (priceId: string) => {
    try {
      const stripe = await getStripe()

      if (!stripe) {
        throw new Error('Stripe failed to initialize. Please check your configuration.')
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/thank-you`,
          cancelUrl: `${window.location.origin}`,
        }),
      })

      const session = await response.json()

      if (session.error) {
        throw new Error(session.error)
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof Stripe.errors.StripeError) {
        toast.error(`Erro ao processar o pagamento: ${error.message}`)
      } else if (error instanceof Error) {
        toast.error(`Erro ao processar o pagamento: ${error.message}`)
      } else {
        toast.error('Erro ao processar o pagamento. Por favor, tente novamente.')
      }
      throw error
    }
  }

  return { handleCheckout }
} 