import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Smartphone, 
  User, 
  Phone, 
  MapPin, 
  Upload,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthPageProps {
  type: 'login' | 'signup';
  role: 'surveyor' | 'customer' | 'admin';
  onToggleType: () => void;
  onChangeRole: (role: 'surveyor' | 'customer' | 'admin') => void;
  onAuthSuccess: (user: any) => void;
}

export default function AuthPage({ type, role, onToggleType, onChangeRole, onAuthSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      // Mock user based on role and input
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || (email.split('@')[0]),
        email: email,
        role: email.includes('admin') ? 'admin' : role
      };
      
      onAuthSuccess(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-background font-bold text-3xl mx-auto mb-6">C</div>
          <h1 className="text-3xl font-bold mb-2">
            {type === 'login' ? 'Welcome Back' : 'Join CanvasRadar'}
          </h1>
          <p className="text-text-muted">
            {role === 'surveyor' ? 'Surveyor Portal' : 'Commercial Customer Portal'}
          </p>
        </div>

        <div className="glass-card p-8">
          {/* Quick Login for Demo */}
          <div className="mb-8 p-4 bg-accent/5 border border-accent/20 rounded-xl">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 text-center">Quick Access (Demo Mode)</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => {
                  setEmail('admin@canvasradar.com');
                  setPassword('password');
                }}
                className="py-2 px-1 text-[9px] font-bold uppercase tracking-tighter bg-background border border-card-border rounded-lg hover:border-accent transition-colors"
              >
                Admin
              </button>
              <button 
                onClick={() => {
                  setEmail('customer@greystar.com');
                  setPassword('password');
                }}
                className="py-2 px-1 text-[9px] font-bold uppercase tracking-tighter bg-background border border-card-border rounded-lg hover:border-blue-500 transition-colors"
              >
                Customer
              </button>
              <button 
                onClick={() => {
                  setEmail('alex@canvasradar.com');
                  setPassword('password');
                }}
                className="py-2 px-1 text-[9px] font-bold uppercase tracking-tighter bg-background border border-card-border rounded-lg hover:border-emerald-500 transition-colors"
              >
                Surveyor
              </button>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1 bg-background rounded-xl border border-card-border mb-8">
            <button 
              onClick={() => onChangeRole('surveyor')}
              className={cn(
                "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                role === 'surveyor' ? "bg-accent text-background" : "text-text-muted hover:text-text-primary"
              )}
            >
              Surveyor
            </button>
            <button 
              onClick={() => onChangeRole('customer')}
              className={cn(
                "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                role === 'customer' ? "bg-accent text-background" : "text-text-muted hover:text-text-primary"
              )}
            >
              Customer
            </button>
            <button 
              onClick={() => onChangeRole('admin')}
              className={cn(
                "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                role === 'admin' ? "bg-accent text-background" : "text-text-muted hover:text-text-primary"
              )}
            >
              Admin
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {type === 'signup' && role === 'surveyor' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text" 
                      className="w-full bg-background border border-card-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="tel" className="w-full bg-background border border-card-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent" placeholder="555-0123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" className="w-full bg-background border border-card-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent" placeholder="Austin, TX" />
                  </div>
                </div>
                <div className="p-4 bg-background border border-dashed border-card-border rounded-xl text-center cursor-pointer hover:border-accent transition-colors">
                  <Upload className="w-6 h-6 text-text-muted mx-auto mb-2" />
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Upload ID Verification</p>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 accent-accent" />
                  <p className="text-xs text-text-muted">I consent to a background check as part of the surveyor onboarding process.</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="email" 
                  className="w-full bg-background border border-card-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Password</label>
                {type === 'login' && <button type="button" className="text-[10px] text-accent font-bold uppercase tracking-widest hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="password" 
                  className="w-full bg-background border border-card-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-4 text-lg"
            >
              {isLoading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">
              {type === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={onToggleType}
                className="ml-2 text-accent font-bold hover:underline"
              >
                {type === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>

        {role === 'customer' && type === 'login' && (
          <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-xl text-center">
            <p className="text-xs text-text-muted">New commercial customer? <button className="text-accent font-bold hover:underline">Request access</button></p>
          </div>
        )}
      </div>
    </div>
  );
}
