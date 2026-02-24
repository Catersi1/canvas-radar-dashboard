import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Zap, 
  Shield, 
  Users, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function AboutPage() {
  return (
    <div className="space-y-24 pb-20 pt-20">
      {/* Hero */}
      <section className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Our Mission: <br /><span className="text-accent">Property Data for All</span></h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">Founded in 2024, CanvasRadar is building the infrastructure for the next generation of property insights.</p>
      </section>

      {/* Story */}
      <section className="container mx-auto px-6">
        <div className="glass-card p-12 bg-background/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-video bg-card border border-card-border rounded-2xl overflow-hidden relative">
              <img src="https://picsum.photos/seed/team/800/600" alt="Team" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-accent font-bold text-2xl tracking-widest uppercase">Our Team</span>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-text-muted leading-relaxed">
                CanvasRadar started with a simple observation: property data was either too expensive, too slow, or too inaccurate. We saw insurance adjusters spending days on the road and real estate agents taking blurry photos with their phones.
              </p>
              <p className="text-text-muted leading-relaxed">
                We built a platform that leverages the power of local networks and advanced AI to capture high-quality property data at a fraction of the cost and time. Today, we serve hundreds of companies across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Accuracy', desc: 'We believe data is only useful if it is correct. Our 99% accuracy rate is our pride.', icon: Target },
            { title: 'Speed', desc: 'In a fast-moving market, 48-hour turnaround is not just a goal—it is our standard.', icon: Zap },
            { title: 'Transparency', desc: 'From pricing to data collection, we believe in being open with our partners.', icon: Shield },
          ].map((v, i) => (
            <div key={i} className="glass-card p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-4">
                <v.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">{v.title}</h3>
              <p className="text-text-muted text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recognition */}
      <section className="container mx-auto px-6 text-center">
        <p className="text-text-muted uppercase tracking-widest text-sm font-bold mb-12">Featured In</p>
        <div className="flex flex-wrap justify-center gap-16 opacity-40 grayscale">
          {['TechCrunch', 'Forbes', 'Inman', 'Wired', 'The Verge'].map(p => (
            <span key={p} className="text-2xl font-bold tracking-tighter">{p}</span>
          ))}
        </div>
      </section>

      {/* Careers */}
      <section className="container mx-auto px-6">
        <div className="glass-card p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
          <p className="text-text-muted mb-10 max-w-xl mx-auto">We are always looking for talented individuals to help us redefine property data.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Surveyors', loc: 'Remote / Field', type: 'Contract' },
              { title: 'Sales Executive', loc: 'Austin, TX', type: 'Full-time' },
              { title: 'Senior Engineer', loc: 'Remote', type: 'Full-time' },
            ].map((job, i) => (
              <div key={i} className="p-6 bg-background rounded-xl border border-card-border hover:border-accent transition-colors cursor-pointer">
                <p className="font-bold mb-1">{job.title}</p>
                <p className="text-xs text-text-muted">{job.loc} • {job.type}</p>
              </div>
            ))}
          </div>
          <button className="btn-secondary mt-10 mx-auto">View All Positions</button>
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Get in Touch</h2>
            <p className="text-text-muted">Have questions about our platform or solutions? We are here to help.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-card border border-card-border rounded-xl flex items-center justify-center text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Email</p>
                  <p className="font-medium">hello@canvasradar.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-card border border-card-border rounded-xl flex items-center justify-center text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Phone</p>
                  <p className="font-medium">+1 (555) 012-3456</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-card border border-card-border rounded-xl flex items-center justify-center text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Office</p>
                  <p className="font-medium">123 Tech Ridge, Austin, TX 78701</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card p-10">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Name</label>
                <input type="text" className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Email</label>
                <input type="email" className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Message</label>
                <textarea className="w-full bg-background border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent h-32"></textarea>
              </div>
              <button className="btn-primary w-full justify-center py-4">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
