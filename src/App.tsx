import React, { useState } from 'react';
import AdminApp from './admin/AdminApp';
import HomePage from './website/HomePage';
import AboutPage from './website/AboutPage';
import CommercialPage from './website/CommercialPage';
import ResidentialPage from './website/ResidentialPage';
import PricingPage from './website/PricingPage';
import AuthPage from './website/AuthPage';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { cn } from './lib/utils';

type Page = 'home' | 'about' | 'commercial' | 'residential' | 'pricing' | 'login' | 'signup' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'surveyor' | 'customer'>('customer');
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  if (currentPage === 'admin') {
    return <AdminApp onLogout={() => navigate('home')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={(p) => navigate(p as Page)} />;
      case 'about': return <AboutPage />;
      case 'commercial': return <CommercialPage />;
      case 'residential': return <ResidentialPage />;
      case 'pricing': return <PricingPage />;
      case 'login': 
      case 'signup': 
        return (
          <AuthPage 
            type={authType} 
            role={authRole} 
            onToggleType={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
            onToggleRole={() => setAuthRole(authRole === 'customer' ? 'surveyor' : 'customer')}
          />
        );
      default: return <HomePage onNavigate={(p) => navigate(p as Page)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-accent selection:text-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('home')}
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-background font-bold text-xl group-hover:scale-110 transition-transform">
              C
            </div>
            <span className="font-bold text-2xl tracking-tight">CanvasRadar</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {[
              { id: 'about', label: 'About' },
              { id: 'commercial', label: 'Commercial' },
              { id: 'residential', label: 'Surveyors' },
              { id: 'pricing', label: 'Pricing' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id as Page)}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-colors hover:text-accent",
                  currentPage === item.id ? "text-accent" : "text-text-muted"
                )}
              >
                {item.label}
              </button>
            ))}
            <div className="h-6 w-px bg-card-border mx-2"></div>
            <button 
              onClick={() => {
                setAuthType('login');
                navigate('login');
              }}
              className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('admin')}
              className="btn-primary py-2.5 px-6"
            >
              Dashboard
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-8">
              {[
                { id: 'about', label: 'About' },
                { id: 'commercial', label: 'Commercial' },
                { id: 'residential', label: 'Surveyors' },
                { id: 'pricing', label: 'Pricing' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id as Page)}
                  className="text-3xl font-bold text-left hover:text-accent transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-card-border w-full my-4"></div>
              <button 
                onClick={() => {
                  setAuthType('login');
                  navigate('login');
                }}
                className="text-2xl font-bold text-left text-text-muted"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('admin')}
                className="btn-primary py-4 text-xl justify-center"
              >
                Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-card-border pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-background font-bold text-xl">
                  C
                </div>
                <span className="font-bold text-2xl tracking-tight">CanvasRadar</span>
              </div>
              <p className="text-text-muted leading-relaxed">
                The physical-first property data platform. We visit neighborhoods in person to provide the most accurate leads on the market.
              </p>
              <div className="flex items-center gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <button key={i} className="p-2 bg-background border border-card-border rounded-lg text-text-muted hover:text-accent hover:border-accent transition-all">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Platform</h4>
              <ul className="space-y-4">
                {['Commercial Leads', 'Data API', 'Surveyor Network', 'Territory Map', 'Pricing'].map((item) => (
                  <li key={item}>
                    <button className="text-text-muted hover:text-accent transition-colors">{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Press', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <button className="text-text-muted hover:text-accent transition-colors">{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-text-muted">
                  <MapPin className="w-5 h-5 text-accent" />
                  123 Data Way, Austin, TX 78701
                </li>
                <li className="flex items-center gap-3 text-text-muted">
                  <Phone className="w-5 h-5 text-accent" />
                  (555) 123-4567
                </li>
                <li className="flex items-center gap-3 text-text-muted">
                  <Mail className="w-5 h-5 text-accent" />
                  hello@canvasradar.com
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-text-muted">
              © 2026 CanvasRadar. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <button className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors">Privacy</button>
              <button className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors">Terms</button>
              <button className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
