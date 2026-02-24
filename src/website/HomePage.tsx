import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Camera, 
  RefreshCw, 
  Download, 
  Zap, 
  Database, 
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  Layout,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomeProps) {
  const steps = [
    { title: 'We Send Surveyors', desc: 'Our trained surveyors visit neighborhoods and document every property in person.', icon: Users },
    { title: 'We Collect Data', desc: 'Photos, condition, features, and owner contact information from public records.', icon: Camera },
    { title: 'We Verify & Update', desc: 'Data is verified and refreshed monthly. No stale lists.', icon: RefreshCw },
    { title: 'You Get Leads', desc: 'Download fresh leads or integrate via API. Exclusive territories available.', icon: Download },
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$500',
      features: ['25 fresh leads', '1 territory', 'Basic photos', 'Email support'],
      cta: 'Get Started',
      accent: false
    },
    {
      name: 'Professional',
      price: '$1,500',
      features: ['100 fresh leads', '3 territories', 'High-res photos', 'API access', 'Phone support'],
      cta: 'Get Started',
      accent: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited leads', 'Exclusive regions', 'Custom data fields', 'White-label options', 'Dedicated account manager'],
      cta: 'Contact Sales',
      accent: false
    }
  ];

  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[150px] animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
              Fresh Property Leads <br />
              <span className="text-accent">Delivered Monthly</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-12 leading-relaxed">
              Our surveyors visit homes in person. You get verified addresses, current photos, and owner data - updated every 30 days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => onNavigate('commercial')}
                className="btn-primary text-xl px-10 py-5 w-full sm:w-auto shadow-lg shadow-accent/20"
              >
                For Sales Teams
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate('commercial')}
                className="btn-secondary text-xl px-10 py-5 w-full sm:w-auto"
              >
                For Data Buyers
              </button>
            </div>
            <p className="mt-8 text-sm text-text-muted font-medium uppercase tracking-[0.2em]">
              Solar • Roofing • Insurance • Real Estate • Investors
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Logos */}
      <section className="container mx-auto px-6">
        <div className="glass-card p-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-text-muted uppercase tracking-widest text-xs font-bold mb-8">Real Estate & Platforms</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                {['Local MLS', 'Regional Realty', 'Investor Group', 'Zillow Competitor'].map((logo) => (
                  <span key={logo} className="text-xl font-bold text-text-primary tracking-tighter">{logo}</span>
                ))}
              </div>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-card-border pt-12 md:pt-0 md:pl-12">
              <p className="text-text-muted uppercase tracking-widest text-xs font-bold mb-8">Sales Teams</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                {['Solar Co', 'Roofing Pros', 'Insurance Agency', 'Home Services'].map((logo) => (
                  <span key={logo} className="text-xl font-bold text-text-primary tracking-tighter">{logo}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">Our physical-first approach ensures the most accurate property data on the market.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8" />
              </div>
              <div className="absolute top-8 left-16 right-0 h-px bg-gradient-to-r from-accent/20 to-transparent hidden lg:block"></div>
              <h3 className="text-2xl font-bold mb-4">Step {i + 1}: {step.title}</h3>
              <p className="text-text-muted leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Two Customer Paths */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Path A: Sales Teams */}
          <div className="glass-card p-12 border-accent/20 bg-accent/5">
            <div className="p-3 bg-accent text-background rounded-xl w-fit mb-8">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Prequalified Leads for Closers</h2>
            <p className="text-text-muted mb-8 text-lg">For: Solar, Roofing, Insurance, Home Services</p>
            
            <div className="space-y-6 mb-12">
              {[
                'Property condition documented (know the opportunity)',
                'Owner contact info verified',
                'Photos of roof, exterior, yard',
                'Buying intent signals',
                'Exclusive territory (you\'re the only one)'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <span className="text-text-primary">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mb-10 p-6 bg-background/50 rounded-2xl border border-card-border">
              <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-2">Pricing</p>
              <p className="text-2xl font-bold text-accent">$25-50 per lead <span className="text-text-muted text-sm font-normal">| $500-2000/month subscriptions</span></p>
            </div>
            
            <button className="btn-primary w-full justify-center py-5 text-lg">Get Sample Lead</button>
          </div>

          {/* Path B: Data Buyers */}
          <div className="glass-card p-12">
            <div className="p-3 bg-card border border-card-border text-accent rounded-xl w-fit mb-8">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Property Data for Platforms</h2>
            <p className="text-text-muted mb-8 text-lg">For: Real Estate Agencies, Real Estate Websites, MLS Providers, Investors</p>
            
            <div className="space-y-6 mb-12">
              {[
                'Complete property database for your area',
                'Monthly refreshed condition data',
                'High-resolution photos',
                'API access or bulk download',
                'Custom data fields available'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <span className="text-text-primary">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mb-10 p-6 bg-background/50 rounded-2xl border border-card-border">
              <p className="text-sm text-text-muted uppercase tracking-widest font-bold mb-2">Pricing</p>
              <p className="text-2xl font-bold text-accent">Custom <span className="text-text-muted text-sm font-normal">based on volume and geography</span></p>
            </div>
            
            <button className="btn-secondary w-full justify-center py-5 text-lg">Request Data Demo</button>
          </div>
        </div>
      </section>

      {/* Sample Lead Preview */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What a Lead Looks Like</h2>
          <p className="text-text-muted">Detailed, verified, and ready for your sales team.</p>
        </div>
        
        <div className="max-w-4xl mx-auto glass-card overflow-hidden">
          <div className="bg-accent/10 border-b border-card-border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-background rounded-xl border border-card-border text-accent">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">1234 Oak Street, Phoenix, AZ 85018</h3>
                <p className="text-text-muted text-sm">Owner: John & Mary Smith</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-card-border text-sm font-bold">
                <Phone className="w-4 h-4 text-accent" />
                (555) 123-4567
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-card-border text-sm font-bold text-text-muted">
                <Mail className="w-4 h-4" />
                Available in Pro
              </div>
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Property Details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    { label: 'Year Built', value: '1985' },
                    { label: 'Roof', value: 'Shingle, Fair condition, 12 years old' },
                    { label: 'Solar', value: 'None, Excellent exposure' },
                    { label: 'HVAC', value: 'Visible unit, age unknown' },
                    { label: 'Yard', value: '0.25 acres, maintained' },
                    { label: 'Pool', value: 'Yes, in ground' },
                  ].map((detail, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-xs text-text-muted">{detail.label}</p>
                      <p className="text-sm font-semibold">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-card-border">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Data Freshness</p>
                    <p className="text-sm font-bold">Updated 15 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Territory</p>
                  <p className="text-sm font-bold text-accent">Available</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Current Photos</h4>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-background border border-card-border rounded-lg overflow-hidden group cursor-pointer">
                    <img 
                      src={`https://picsum.photos/seed/property-${i}/300/300`} 
                      alt={`Property view ${i}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-text-muted italic text-center">Captured by Surveyor ID #842 on Feb 10, 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Physical Surveys */}
      <section className="container mx-auto px-6">
        <div className="glass-card p-16 bg-accent/5 border-accent/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Why Physical Surveys?</h2>
              <p className="text-xl text-text-muted mb-12 italic">"Why not just scrape public records?"</p>
              
              <div className="space-y-6">
                {[
                  'Photos show current condition (not 2 years old)',
                  'We see what satellites miss (roof condition, yard features)',
                  'Owner info verified and current',
                  'Monthly updates catch changes fast',
                  'Data you can\'t get anywhere else'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="p-1 bg-accent rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-background" />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-card rounded-2xl border border-card-border overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/surveyor/800/600" 
                  alt="Surveyor in field" 
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-accent text-background rounded-full flex items-center justify-center shadow-xl">
                    <Users className="w-10 h-10" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card p-6 bg-accent text-background font-bold rounded-2xl shadow-xl">
                Real-World Verification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">Choose the plan that fits your growth goals.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <div key={i} className={cn(
              "glass-card p-10 flex flex-col relative overflow-hidden",
              tier.accent ? "border-accent ring-1 ring-accent/50 scale-105 z-10 bg-accent/5" : ""
            )}>
              {tier.accent && (
                <div className="absolute top-0 right-0 bg-accent text-background text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-text-muted text-sm">/month</span>}
              </div>
              
              <ul className="space-y-4 mb-12 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-text-muted">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              
              <button className={cn(
                "w-full py-4 rounded-xl font-bold transition-all",
                tier.accent ? "bg-accent text-background hover:opacity-90" : "bg-card border border-card-border hover:bg-card-border"
              )}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How is this different from buying a lead list?', a: 'Our data is collected in person and updated monthly. Lead lists are often 6-12 months old and contain stale information.' },
            { q: 'Do homeowners know you\'re surveying their property?', a: 'We survey from public streets and sidewalks. No trespassing or physical contact with the property is required.' },
            { q: 'What areas do you cover?', a: 'Currently Phoenix, Houston, Atlanta, Tampa, and Dallas. We are expanding to new markets every month.' },
            { q: 'Can I get exclusive rights to a neighborhood?', a: 'Yes, Enterprise customers can lock exclusive territories to ensure they are the only ones with access to that data.' },
            { q: 'How fresh is the data?', a: 'We update our entire database every 30 days. You always get the most current information available.' },
          ].map((faq, i) => (
            <details key={i} className="glass-card group">
              <summary className="p-6 cursor-pointer font-bold flex justify-between items-center list-none">
                {faq.q}
                <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform text-accent" />
              </summary>
              <div className="px-6 pb-6 text-text-muted text-sm border-t border-card-border pt-4 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6">
        <div className="glass-card p-20 text-center bg-gradient-to-b from-accent/10 to-transparent border-accent/20">
          <h2 className="text-5xl font-bold mb-8">Ready to Scale Your Sales?</h2>
          <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">Join the industry leaders using physical property data to close more deals.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="btn-primary px-12 py-5 text-xl">Get Started Now</button>
            <button className="btn-secondary px-12 py-5 text-xl">Contact Sales</button>
          </div>
        </div>
      </section>
    </div>
  );
}
