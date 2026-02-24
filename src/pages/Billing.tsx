import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download, 
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Billing() {
  const billingStats = [
    { label: 'Total MRR', value: '$64,500', change: '+8.2%', trend: 'up' },
    { label: 'Upcoming Renewals', value: '12', sub: 'Next 30 days' },
    { label: 'Past Due', value: '2', sub: '$3,500 total' },
    { label: 'Avg. LTV', value: '$12,400', change: '+1.5%', trend: 'up' },
  ];

  const invoices = [
    { id: 'INV-2026-001', customer: 'Greystar', amount: 4500, date: '2026-02-24', status: 'Paid' },
    { id: 'INV-2026-002', customer: 'Auto-Owners', amount: 5000, date: '2026-02-23', status: 'Paid' },
    { id: 'INV-2026-003', customer: 'SunPower', amount: 3000, date: '2026-02-22', status: 'Past Due' },
    { id: 'INV-2026-004', customer: 'Mercury Insurance', amount: 2500, date: '2026-02-21', status: 'Paid' },
    { id: 'INV-2026-005', customer: 'Compass', amount: 1200, date: '2026-02-20', status: 'Pending' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h2>
        <p className="text-text-muted mt-1">Manage revenue, invoices, and payment processing.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {billingStats.map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <p className="text-sm text-text-muted uppercase tracking-wider font-medium">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              {stat.change && (
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend === 'up' ? 'text-accent' : 'text-red-400'
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              )}
              {stat.sub && <span className="text-xs text-text-muted">{stat.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl">Recent Invoices</h3>
            <button className="text-accent text-sm font-medium hover:underline flex items-center gap-1">
              <Download className="w-4 h-4" /> Export All
            </button>
          </div>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-background/30">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Invoice</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{inv.id}</td>
                    <td className="px-6 py-4 text-sm">{inv.customer}</td>
                    <td className="px-6 py-4 text-sm font-bold">${inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "status-badge",
                        inv.status === 'Paid' ? "status-active" : 
                        inv.status === 'Past Due' ? "status-past-due" : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods / Upcoming */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent" />
              Payment Processing
            </h4>
            <div className="p-4 bg-background rounded-xl border border-card-border mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Stripe Status</span>
                <span className="flex items-center gap-1 text-xs text-accent">
                  <CheckCircle2 className="w-3 h-3" /> Operational
                </span>
              </div>
              <p className="text-xs text-text-muted">Last payout: $12,450.00 (2 days ago)</p>
            </div>
            <button className="btn-secondary w-full justify-center text-sm">Configure Gateway</button>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Upcoming Renewals
            </h4>
            <div className="space-y-4">
              {[
                { name: 'Greystar', date: 'Mar 18', amount: 4500 },
                { name: 'Compass', date: 'Mar 25', amount: 1200 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.date}</p>
                  </div>
                  <span className="text-sm font-bold">${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <button className="btn-secondary w-full justify-center text-sm mt-6">View Renewal Calendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
