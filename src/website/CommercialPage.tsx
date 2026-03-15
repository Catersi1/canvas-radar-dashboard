import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  ShieldCheck, 
  Sun, 
  Wrench, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Download,
  Database,
  Zap,
  Layout,
  Waves,
  ClipboardCheck,
  Leaf,
  Shield,
  Thermometer,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function CommercialPage() {
  const solutions = [
    { 
      title: 'Insurance', 
      icon: ShieldCheck, 
      price: '$1000/mo',
      features: ['Claims documentation', 'Underwriting assessments', 'Risk-qualified data', 'GPS-verified profiles']
    },
    { 
      title: 'Property Management', 
      icon: Building2, 
      price: '$500/mo',
      features: ['Move-in/out docs', 'Routine inspections', 'Portfolio health tracking', 'Maintenance checklists']
    },
    { 
      title: 'Real Estate', 
      icon: Layout, 
      price: '$300/mo',
      features: ['Pre-listing reports', 'Listing preparation', 'MLS-ready data', 'Condition disclosures']
    },
    { 
      title: 'Government', 
      icon: Database, 
      price: '$2000/mo',
      features: ['Tax assessment data', 'Code enforcement docs', 'Blight documentation', 'Municipal contracts']
    },
    { 
      title: 'Roofing', 
      icon: Wrench, 
      price: '$400/mo',
      features: ['High-intent roofing leads', 'Roof condition reports', 'Storm damage alerts', 'Material estimates']
    },
    { 
      title: 'Solar', 
      icon: Sun, 
      price: '$350/mo',
      features: ['Solar-qualified leads', 'Roof shading analysis', 'Utility bill verification', 'Installation site docs']
    },
    { 
      title: 'Pool Services', 
      icon: Waves, 
      price: '$250/mo',
      features: ['Pool condition reports', 'Equipment assessments', 'Maintenance leads', 'Chemical level data']
    },
    { 
      title: 'Home Inspections', 
      icon: ClipboardCheck, 
      price: '$300/mo',
      features: ['Supplemental inspections', 'Pre-listing reports', 'Condition checklists', 'Professional PDF export']
    },
    { 
      title: 'Landscaping', 
      icon: Leaf, 
      price: '$200/mo',
      features: ['Property feature docs', 'Lot size measurements', 'Vegetation analysis', 'Maintenance contracts']
    },
    { 
      title: 'Home Security', 
      icon: Lock, 
      price: '$450/mo',
      features: ['Security risk assessments', 'Entry point analysis', 'High-value property alerts', 'System design data']
    },
    { 
      title: 'HVAC Sizing', 
      icon: Thermometer, 
      price: '$300/mo',
      features: ['System capacity assessments', 'Energy efficiency data', 'Unit condition reports', 'Installation leads']
    },
  ];

  return (
    <div className="space-y-24 pb-20 pt-20">
      {/* Hero */}
      <section className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Property Data <br />
            <span className="text-accent">at Scale</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10">
            Professional property documentation for enterprise teams. 
            Integrated with your existing CRM and workflows.
          </p>
          <button className="btn-primary text-lg px-10 py-4 mx-auto">
            Request a Demo
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* Solutions Grid */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((sol, i) => (
            <div key={i} className="glass-card p-10 group hover:border-accent/50 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-accent/10 rounded-2xl text-accent">
                  <sol.icon className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Starting at</p>
                  <p className="text-2xl font-bold text-accent">{sol.price}</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6">{sol.title}</h3>
              <ul className="space-y-4 mb-10">
                {sol.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-text-muted">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full justify-center">Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="container mx-auto px-6">
        <div className="glass-card p-12 bg-background/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">360° Enriched Property Reports</h2>
              <p className="text-text-muted mb-8 text-lg">
                Our reports don't just show photos—they provide a complete market and structural profile of every property, enriched by AI and verified by humans.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Structural & Market Enrichment', desc: 'Sq Ft, Year Built, Est. Value, and Tax History.', icon: Layout },
                  { title: 'Amenity & Safety Mapping', desc: 'Driving distance to Walmart, schools, and transit.', icon: Zap },
                  { title: 'Ground-Truth Verification', desc: 'GPS-verified photos of roof, exterior, and yard.', icon: FileText },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="p-2 bg-accent/10 rounded-lg text-accent h-fit">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-10">
                <Download className="w-5 h-5" />
                Download Sample PDF
              </button>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] bg-card border border-card-border rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="h-8 w-32 bg-accent/20 rounded mb-6"></div>
                <div className="h-4 w-full bg-text-muted/20 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-text-muted/20 rounded mb-8"></div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="aspect-square bg-background rounded-xl border border-card-border"></div>
                  <div className="aspect-square bg-background rounded-xl border border-card-border"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-full bg-background border border-card-border rounded-xl"></div>
                  <div className="h-12 w-full bg-background border border-card-border rounded-xl"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card p-6 bg-accent text-background font-bold rounded-2xl shadow-xl">
                99% Accuracy Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Seamless Integrations</h2>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          {['Salesforce', 'HubSpot', 'Zapier', 'Slack', 'Microsoft Teams'].map(p => (
            <span key={p} className="text-xl font-bold tracking-tighter">{p}</span>
          ))}
        </div>
        <p className="mt-12 text-text-muted">Plus full REST API access for custom workflows.</p>
      </section>

      {/* Case Study */}
      <section className="container mx-auto px-6">
        <div className="glass-card p-12 bg-accent/5 border-accent/20 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-32 h-32 bg-background rounded-2xl flex items-center justify-center text-accent shrink-0 text-4xl font-bold">GS</div>
          <div>
            <h3 className="text-2xl font-bold mb-4">How Greystar reduced inspection time by 60%</h3>
            <p className="text-text-muted text-lg mb-6">
              "By using CanvasRadar's professional reports, our property managers spend more time on-site and less time on paperwork. The data consistency is unmatched."
            </p>
            <p className="font-bold">— Sarah Miller, Regional Director</p>
          </div>
        </div>
      </section>

      {/* Request Demo Form */}
      <section className="container mx-auto px-6 max-w-2xl">
        <div className="glass-card p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Request a Demo</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Name</label>
                <input type="text" className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Email</label>
                <input type="email" className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="john@company.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Company</label>
              <input type="text" className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" placeholder="Acme Corp" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Message</label>
              <textarea className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent h-32" placeholder="Tell us about your needs..."></textarea>
            </div>
            <button className="btn-primary w-full justify-center py-4 text-lg">Send Request</button>
          </form>
        </div>
      </section>
    </div>
  );
}
