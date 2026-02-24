import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Download, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  ChevronRight,
  X
} from 'lucide-react';
import { MOCK_CUSTOMERS, Customer, INDUSTRIES } from '../types';
import { cn } from '../lib/utils';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'All' || c.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Past Due': return 'status-past-due';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-text-muted mt-1">Manage your client base and subscriptions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by company or contact..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select 
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-card border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent/50"
          >
            <option value="All">All Industries</option>
            {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border bg-background/30">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Company</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Industry</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Subscription</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Usage</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filteredCustomers.map((customer) => (
              <tr 
                key={customer.id} 
                className="hover:bg-accent/5 transition-colors cursor-pointer group"
                onClick={() => setSelectedCustomer(customer)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-background border border-card-border flex items-center justify-center text-accent">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary group-hover:text-accent transition-colors">{customer.name}</p>
                      <p className="text-xs text-text-muted">{customer.contactName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">{customer.industry}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">${customer.monthlySubscription.toLocaleString()}/mo</p>
                    <p className="text-xs text-text-muted">{customer.tier}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-32">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span>{customer.surveysUsed} / {customer.surveyLimit}</span>
                      <span>{Math.round((customer.surveysUsed / customer.surveyLimit) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          (customer.surveysUsed / customer.surveyLimit) > 0.9 ? "bg-red-400" : "bg-accent"
                        )} 
                        style={{ width: `${(customer.surveysUsed / customer.surveyLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("status-badge", getStatusClass(customer.status))}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-text-muted hover:text-text-primary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Overlay */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl h-full bg-card border-l border-card-border p-8 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-background border border-card-border flex items-center justify-center text-accent">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedCustomer.name}</h3>
                  <p className="text-text-muted">{selectedCustomer.industry} • {selectedCustomer.tier} Plan</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-background rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-background rounded-xl border border-card-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Contact Info</p>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-accent" />
                    {selectedCustomer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-accent" />
                    555-0199
                  </div>
                </div>
              </div>
              <div className="p-4 bg-background rounded-xl border border-card-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Billing</p>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-accent" />
                    Renews: {selectedCustomer.renewalDate}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-accent">
                    <DollarSign className="w-4 h-4" />
                    ${selectedCustomer.monthlySubscription.toLocaleString()} / month
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-lg border-b border-card-border pb-2">Recent Activity</h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Survey Completed - 123 Maple St</p>
                      <p className="text-xs text-text-muted">2 hours ago by Alex Rivera</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <button className="btn-primary flex-1">Edit Subscription</button>
              <button className="btn-secondary flex-1">View All Surveys</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
