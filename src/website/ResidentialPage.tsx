import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  ArrowRight,
  Download,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function ResidentialPage() {
  const [housesPerWeek, setHousesPerWeek] = useState(500);

  const weeklyEarnings = housesPerWeek * 0.25;
  const monthlyEarnings = weeklyEarnings * 4;

  const steps = [
    { title: 'Download the App', desc: 'Available on iOS and Android. Create your account in minutes.', icon: Download },
    { title: 'Find Properties', desc: 'Use our map to find properties that need routine assessments or inspections.', icon: MapPin },
    { title: 'Capture Data', desc: 'Take photos and answer a few questions to document property condition.', icon: CheckCircle2 },
    { title: 'Get Paid Weekly', desc: 'Earnings are deposited directly into your bank account every Friday.', icon: DollarSign },
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
            The Foundation of <br />
            <span className="text-accent">Ground-Truth Data</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10">
            Earn money by capturing the real-world data that powers our 360° property platform. Your surveys provide the ground truth that AI can't see.
          </p>
          <button className="btn-primary text-lg px-10 py-4 mx-auto">
            Download the App
            <Download className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="glass-card p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-4">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-text-muted text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="container mx-auto px-6">
        <div className="glass-card p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Earnings Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
                  How many surveys per week?
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="100"
                  value={housesPerWeek}
                  onChange={(e) => setHousesPerWeek(parseInt(e.target.value))}
                  className="w-full accent-accent h-2 bg-background rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-4 text-sm font-bold">
                  <span>100</span>
                  <span className="text-accent text-xl">{housesPerWeek.toLocaleString()} surveys</span>
                  <span>2,000</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-background rounded-2xl border border-card-border text-center">
                <p className="text-sm text-text-muted uppercase font-bold tracking-widest mb-1">Weekly Earnings</p>
                <p className="text-4xl font-bold text-accent">${weeklyEarnings.toLocaleString()}</p>
              </div>
              <div className="p-6 bg-background rounded-2xl border border-card-border text-center">
                <p className="text-sm text-text-muted uppercase font-bold tracking-widest mb-1">Monthly Earnings</p>
                <p className="text-4xl font-bold text-accent">${monthlyEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="glass-card p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Smartphone', desc: 'iOS or Android with a high-quality camera.', icon: Smartphone },
              { title: 'Transportation', desc: 'Reliable car, bike, or scooter to get around.', icon: MapPin },
              { title: 'Age', desc: 'Must be at least 18 years old to join.', icon: Clock },
            ].map((req, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-12 h-12 bg-background border border-card-border rounded-xl flex items-center justify-center text-accent mx-auto">
                  <req.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold">{req.title}</h4>
                <p className="text-sm text-text-muted">{req.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Surveyor Success Stories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Alex R.', city: 'Austin, TX', text: 'I complete about 800 surveys a week while listening to podcasts. It is the perfect side hustle that pays for my travel.' },
            { name: 'Jordan S.', city: 'Dallas, TX', text: 'The app is so easy to use. I just drive through neighborhoods and document properties. I made $500 in my first week!' },
          ].map((t, i) => (
            <div key={i} className="glass-card p-8 flex gap-6">
              <div className="w-16 h-16 rounded-full bg-background border border-card-border overflow-hidden shrink-0">
                <img src={`https://picsum.photos/seed/${t.name}/100/100`} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-text-primary italic mb-4">"{t.text}"</p>
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs text-text-muted">{t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 text-center">
        <div className="glass-card p-16 bg-accent/5 border-accent/20">
          <h2 className="text-4xl font-bold mb-6">Ready to start earning?</h2>
          <button className="btn-primary px-12 py-4 mx-auto text-lg">
            Download the App Now
          </button>
        </div>
      </section>
    </div>
  );
}
