import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Download, 
  Smartphone, 
  MapPin, 
  ShieldCheck, 
  Database, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function PricingPage() {
  const commercialPlans = [
    {
      name: 'Basic',
      price: '$200',
      desc: 'Perfect for local real estate agents.',
      features: ['50 reports/month', 'Standard property profiles', 'Email support', 'Mobile app access', 'Photo documentation']
    },
    {
      name: 'Pro',
      price: '$500',
      desc: 'Best for regional property managers.',
      features: ['200 reports/month', 'Custom condition scoring', 'API access', 'Priority support', 'GPS verification', 'CRM integration']
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'For national carriers and government.',
      features: ['Unlimited reports', 'White-label option', 'Dedicated account manager', 'Custom integrations', 'SLA guarantees']
    }
  ];

  return (
    <div className="space-y-24 pb-20 pt-20">
      {/* Header */}
      <section className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Simple, Transparent <br /><span className="text-accent">Pricing</span></h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">Choose the plan that fits your property data needs.</p>
      </section>

      {/* Commercial Pricing */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Commercial Solutions</h2>
          <p className="text-text-muted">Scalable data for businesses of all sizes.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {commercialPlans.map((plan, i) => (
            <div key={i} className={cn(
              "glass-card p-10 flex flex-col",
              plan.name === 'Pro' ? "border-accent ring-1 ring-accent/50 scale-105 z-10 bg-accent/5" : ""
            )}>
              {plan.name === 'Pro' && (
                <span className="text-[10px] font-bold uppercase tracking-widest bg-accent text-background px-3 py-1 rounded-full w-fit mb-6">Most Popular</span>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-text-muted text-sm mb-6">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-text-muted">/month</span>}
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-text-muted">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={cn(
                "w-full justify-center py-3 rounded-xl font-bold transition-all",
                plan.name === 'Pro' ? "bg-accent text-background hover:opacity-90" : "bg-card border border-card-border hover:bg-card-border"
              )}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Surveyor Pricing */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="glass-card p-12 bg-accent/5 border-accent/20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Become a Field Surveyor</h2>
            <p className="text-text-muted">Join our network and start earning today.</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent" /> Free to join</li>
              <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent" /> $0.25 per survey</li>
              <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent" /> Weekly payouts</li>
            </ul>
          </div>
          <button className="btn-primary px-10 py-4 text-lg shrink-0">
            Download App
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing FAQ</h2>
        <div className="space-y-4">
          {[
            { q: 'Can I change plans?', a: 'Yes, you can upgrade or downgrade your plan at any time from your dashboard.' },
            { q: 'What if I exceed my limit?', a: 'Additional reports are billed at a flat rate of $2.00 per report on Basic and Pro plans.' },
            { q: 'Is there a setup fee?', a: 'No, there are no setup fees or hidden costs. You only pay your monthly subscription.' },
          ].map((faq, i) => (
            <details key={i} className="glass-card group">
              <summary className="p-6 cursor-pointer font-bold flex justify-between items-center list-none">
                {faq.q}
                <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-text-muted text-sm border-t border-card-border pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
