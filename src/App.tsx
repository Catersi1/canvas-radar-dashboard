/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Download,
  Shield,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Website Pages
import HomePage from './website/HomePage';
import ResidentialPage from './website/ResidentialPage';
import CommercialPage from './website/CommercialPage';
import PricingPage from './website/PricingPage';
import AboutPage from './website/AboutPage';
import AuthPage from './website/AuthPage';

// Admin App
import AdminApp from './admin/AdminApp';

type View = 'home' | 'residential' | 'commercial' | 'pricing' | 'about' | 'login' | 'signup' | 'admin';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'surveyor' | 'customer'>('surveyor');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (view === 'admin') {
    return <AdminApp />;
  }

  const renderView = () => {
    switch (view) {
      case 'home': return <HomePage onNavigate={setView} />;
      case 'residential': return <ResidentialPage />;
      case 'commercial': return <CommercialPage />;
      case 'pricing': return <PricingPage />;
      case 'about': return <AboutPage />;
      case 'login': return (
        <AuthPage 
          type="login" 
          role={authRole} 
          onToggleType={() => setView('signup')} 
          onToggleRole={() => setAuthRole(role => role === 'surveyor' ? 'customer' : 'surveyor')} 
        />
      );
      case 'signup': return (
        <AuthPage 
          type="signup" 
          role={authRole} 
          onToggleType={() => setView('login')} 
          onToggleRole={() => setAuthRole(role => role === 'surveyor' ? 'customer' : 'surveyor')} 
        />
      );
      default: return <HomePage onNavigate={setView} />;
    }
  };

  const navLinks = [
    { label: 'Solutions', id: 'commercial' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', id: 'about' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-card-border z-50">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-background font-bold text-2xl">C</div>
            <span className="text-2xl font-bold tracking-tight">CanvasRadar</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button 
                key={link.id}
                onClick={() => setView(link.id as View)}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-colors",
                  view === link.id ? "text-accent" : "text-text-muted hover:text-text-primary"
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => {
                setAuthRole('surveyor');
                setView('login');
              }}
              className="btn-primary"
            >
              <Download className="w-4 h-4" />
              Download App
            </button>
            <button 
              onClick={() => {
                setAuthRole('customer');
                setView('login');
              }}
              className="btn-secondary"
            >
              Commercial
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-text-muted hover:text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 bg-background z-40 pt-24 px-6 md:hidden"
          >
            <nav className="space-y-6">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => {
                    setView(link.id as View);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-2xl font-bold"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-6 space-y-4">
                <button 
                  onClick={() => {
                    setAuthRole('surveyor');
                    setView('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full justify-center py-4 text-lg"
                >
                  Download App
                </button>
                <button 
                  onClick={() => {
                    setAuthRole('customer');
                    setView('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-secondary w-full justify-center py-4 text-lg"
                >
                  Commercial
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-card-border py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background font-bold text-xl">C</div>
                <span className="text-xl font-bold tracking-tight">CanvasRadar</span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                The infrastructure for property leads. High-intent, qualified property data for modern businesses.
              </p>
              <div className="flex items-center gap-4">
                <Facebook className="w-5 h-5 text-text-muted hover:text-accent cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-text-muted hover:text-accent cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-text-muted hover:text-accent cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-text-muted hover:text-accent cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-4 text-sm text-text-muted">
                <li className="hover:text-accent cursor-pointer" onClick={() => setView('residential')}>Lead Generation</li>
                <li className="hover:text-accent cursor-pointer" onClick={() => setView('commercial')}>Commercial Solutions</li>
                <li className="hover:text-accent cursor-pointer" onClick={() => setView('pricing')}>Pricing</li>
                <li className="hover:text-accent cursor-pointer" onClick={() => setView('admin')}>Admin Dashboard</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4 text-sm text-text-muted">
                <li className="hover:text-accent cursor-pointer" onClick={() => setView('about')}>About Us</li>
                <li className="hover:text-accent cursor-pointer">Careers</li>
                <li className="hover:text-accent cursor-pointer">Privacy Policy</li>
                <li className="hover:text-accent cursor-pointer">Terms of Service</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
              <p className="text-xs text-text-muted">Get the latest property data insights delivered to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-background border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent flex-1"
                />
                <button className="p-2 bg-accent text-background rounded-lg hover:opacity-90 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
            <p>© 2026 CanvasRadar Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Built with Precision</span>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
