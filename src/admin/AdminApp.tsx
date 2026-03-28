import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  FileText, 
  Wallet, 
  TrendingUp, 
  Settings, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// Pages
import AdminDashboard from '../pages/Dashboard'; // We'll treat this as Admin Dashboard
import SurveyorDashboard from '../pages/SurveyorDashboard';
import CustomerDashboard from '../pages/CustomerDashboard';
import Customers from '../pages/Customers';
import Surveyors from '../pages/Surveyors';
import Surveys from '../pages/Surveys';
import Billing from '../pages/Billing';
import Analytics from '../pages/Analytics';
import SettingsPage from '../pages/Settings';
import CustomerPortal from '../pages/CustomerPortal';
import UsersPage from '../pages/Users';
import Leads from '../pages/Leads';

type Page = 'dashboard' | 'customers' | 'surveyors' | 'surveys' | 'billing' | 'analytics' | 'settings' | 'portal' | 'users' | 'leads';

interface AdminAppProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  user: any;
}

export default function AdminApp({ onLogout, onNavigateHome, user }: AdminAppProps) {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCustomerView, setIsCustomerView] = useState(false);

  const role = user?.role || 'admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'power_user', 'employer', 'surveyor', 'customer'] },
    { id: 'customers', label: 'Customers', icon: Building, roles: ['admin', 'power_user', 'employer'] },
    { id: 'surveyors', label: 'Surveyors', icon: Users, roles: ['admin', 'power_user', 'employer'] },
    { id: 'leads', label: 'Leads', icon: Users, roles: ['admin', 'power_user', 'employer'] },
    { id: 'surveys', label: 'Surveys', icon: FileText, roles: ['admin', 'power_user', 'employer', 'surveyor', 'customer'] },
    { id: 'users', label: 'Users', icon: ShieldCheck, roles: ['admin'] },
    { id: 'billing', label: 'Billing', icon: Wallet, roles: ['admin', 'customer'] },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, roles: ['admin', 'power_user', 'employer'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'power_user', 'employer', 'surveyor', 'customer'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const renderPage = () => {
    if (isCustomerView) return <CustomerPortal onBack={() => setIsCustomerView(false)} />;
    
    switch (activePage) {
      case 'dashboard': 
        if (role === 'surveyor') return <SurveyorDashboard />;
        if (role === 'customer') return <CustomerDashboard />;
        return <AdminDashboard onViewAsCustomer={() => setIsCustomerView(true)} />;
      case 'customers': return <Customers />;
      case 'surveyors': return <Surveyors />;
      case 'leads': return <Leads />;
      case 'surveys': return <Surveys />;
      case 'billing': return <Billing />;
      case 'analytics': return <Analytics />;
      case 'settings': return <SettingsPage />;
      case 'users': return <UsersPage />;
      default: 
        if (role === 'surveyor') return <SurveyorDashboard />;
        if (role === 'customer') return <CustomerDashboard />;
        return <AdminDashboard onViewAsCustomer={() => setIsCustomerView(true)} />;
    }
  };

  const activeLabel = navItems.find(i => i.id === activePage)?.label || 'Dashboard';

  return (
    <div className="h-screen flex bg-background text-text-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r border-card-border bg-background transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background font-bold">
            C
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight"
            >
              CanvasRadar
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                activePage === item.id 
                  ? "bg-accent/10 text-accent" 
                  : "text-text-muted hover:bg-card hover:text-text-primary"
              )}
            >
              <item.icon className={cn("w-5 h-5", activePage === item.id ? "text-accent" : "text-text-muted group-hover:text-text-primary")} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-card-border space-y-2">
          <button 
            onClick={onNavigateHome}
            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted hover:text-accent transition-colors group"
          >
            <Home className="w-5 h-5 group-hover:text-accent" />
            {isSidebarOpen && <span className="text-sm font-medium">Back to Website</span>}
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronRight className={cn("w-5 h-5 transition-transform", isSidebarOpen && "rotate-180")} />
            {isSidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-card-border flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background font-bold">C</div>
          <span className="font-bold text-lg">CanvasRadar</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-background z-40 pt-20 px-6 md:hidden"
          >
            <nav className="space-y-4">
              {filteredNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id as Page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl",
                    activePage === item.id ? "bg-accent/10 text-accent" : "text-text-muted"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-lg font-medium">{item.label}</span>
                </button>
              ))}
              <div className="h-px bg-card-border w-full my-2"></div>
              <button
                onClick={onNavigateHome}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-text-muted hover:text-accent"
              >
                <Home className="w-6 h-6" />
                <span className="text-lg font-medium">Back to Website</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-text-muted hover:text-red-400"
              >
                <LogOut className="w-6 h-6" />
                <span className="text-lg font-medium">Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:pt-0 pt-16">
        {/* Top Header */}
        <header className="h-16 border-b border-card-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-text-primary hidden md:block">
            {isCustomerView ? 'Customer Portal' : activeLabel}
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search platform..." 
                className="bg-card border border-card-border rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-accent/50 w-64 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-text-muted hover:text-text-primary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
              </button>
              
              <div className="h-8 w-[1px] bg-card-border mx-2"></div>
              
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-text-muted uppercase tracking-wider">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center text-text-muted overflow-hidden">
                  <User className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isCustomerView ? 'portal' : activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
