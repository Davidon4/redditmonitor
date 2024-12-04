'use client';

import { signIn } from 'next-auth/react';
import Pricing from './Pricing';

export default function LandingPagePricing() {
  const handleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/home' })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  return (
    <section className="bg-purple-100 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent pricing</h2>
        <div className="max-w-sm mx-auto">
          <Pricing onClick={handleSignIn} buttonText="Get started - free" />
        </div>
      </div>
    </section>
  ) 
}
