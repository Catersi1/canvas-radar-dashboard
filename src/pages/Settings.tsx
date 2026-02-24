import React from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Globe, 
  Lock,
  Smartphone,
  Cloud
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  const sections = [
    {
      title: 'Platform Configuration',
      icon: SettingsIcon,
      items: [
        { label: 'General Settings', desc: 'Platform name, logo, and global preferences.' },
        { label: 'Territory Management', desc: 'Define regions and service area boundaries.' },
        { label: 'Survey Types', desc: 'Configure residential and commercial survey checklists.' },
      ]
    },
    {
      title: 'Integrations',
      icon: Cloud,
      items: [
        { label: 'Stripe Connect', desc: 'Manage payment processing and surveyor payouts.', status: 'Connected' },
        { label: 'SendGrid', desc: 'Email templates and notification delivery.', status: 'Connected' },
        { label: 'Google Maps API', desc: 'Geocoding and route optimization services.', status: 'Connected' },
      ]
    },
    {
      title: 'Security & Access',
      icon: Shield,
      items: [
        { label: 'User Roles', desc: 'Manage admin, dispatcher, and support permissions.' },
        { label: 'Audit Logs', desc: 'Track all administrative actions and system changes.' },
        { label: 'API Keys', desc: 'Generate keys for external developer access.' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-text-muted mt-1">Configure your platform preferences and integrations.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <div key={i} className="space-y-4">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <section.icon className="w-5 h-5 text-accent" />
              {section.title}
            </h3>
            <div className="glass-card divide-y divide-card-border">
              {section.items.map((item, j) => (
                <div key={j} className="p-6 flex items-center justify-between hover:bg-accent/5 transition-colors cursor-pointer group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold group-hover:text-accent transition-colors">{item.label}</p>
                      {item.status && (
                        <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {item.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted mt-1">{item.desc}</p>
                  </div>
                  <button className="text-text-muted group-hover:text-text-primary transition-colors">
                    <Globe className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-card-border flex justify-end gap-4">
        <button className="btn-secondary">Discard Changes</button>
        <button className="btn-primary">Save Configuration</button>
      </div>
    </div>
  );
}
