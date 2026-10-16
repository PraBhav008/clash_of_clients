import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Users,
  FolderGit2,
  Swords,
  Receipt,
  Binoculars,
  Hammer,
  Library,
  ChevronRight
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    clients,
    projects,
    tasks,
    invoices,
    leads,
    hostingDomains,
    documents,
    openClientHQ,
    setActiveView
  } = useDashboard();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();

    const matchedClients = clients.filter(
      c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );

    const matchedProjects = projects.filter(
      p => p.name.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q) || p.websiteType.toLowerCase().includes(q)
    );

    const matchedTasks = tasks.filter(
      t => t.title.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );

    const matchedInvoices = invoices.filter(
      i => i.invoiceNumber.toLowerCase().includes(q) || i.clientCompany.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q)
    );

    const matchedLeads = leads.filter(
      l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.industry.toLowerCase().includes(q)
    );

    const matchedDomains = hostingDomains.filter(
      h => h.domain.toLowerCase().includes(q) || h.clientName.toLowerCase().includes(q)
    );

    const matchedDocuments = documents.filter(
      d => d.title.toLowerCase().includes(q) || d.clientName.toLowerCase().includes(q)
    );

    return {
      clients: matchedClients,
      projects: matchedProjects,
      tasks: matchedTasks,
      invoices: matchedInvoices,
      leads: matchedLeads,
      domains: matchedDomains,
      documents: matchedDocuments,
      totalCount:
        matchedClients.length +
        matchedProjects.length +
        matchedTasks.length +
        matchedInvoices.length +
        matchedLeads.length +
        matchedDomains.length +
        matchedDocuments.length
    };
  }, [query, clients, projects, tasks, invoices, leads, hostingDomains, documents]);

  if (!isSearchOpen) return null;

  const handleSelectClient = (clientId: string) => {
    setIsSearchOpen(false);
    openClientHQ(clientId);
  };

  const handleGoTo = (view: any) => {
    setIsSearchOpen(false);
    setActiveView(view);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#121826] border border-[#232D42]/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#151C2C]/80">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            placeholder="Type 'Varsha', 'Invoice', 'Domain', 'Dental', or project name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white border border-[#232D42]"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!query.trim() ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-400">Search anything across your Freelance Kingdom</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                {['Varsha Furniture', 'Apex Dental', 'FinPulse', 'INV-2026-038', 'Hosting Expiry', 'Deploy'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-[#232D42]"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults && searchResults.totalCount === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              No matching records found in the kingdom for "{query}".
            </div>
          ) : (
            searchResults && (
              <>
                {/* Matched Clients */}
                {searchResults.clients.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80 px-2 mb-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Clients ({searchResults.clients.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.clients.map(c => (
                        <div
                          key={c.id}
                          onClick={() => handleSelectClient(c.id)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-[#232D42] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                                {c.company}
                              </div>
                              <div className="text-[11px] text-slate-400">{c.name} · {c.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              Open HQ
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Projects */}
                {searchResults.projects.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300/80 px-2 mb-1 flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5" /> Projects ({searchResults.projects.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.projects.map(p => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectClient(p.clientId)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-[#232D42] transition-all group"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-rose-300">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {p.clientName} · {p.websiteType} · Phase {p.currentPhaseIndex + 1}/11
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Invoices */}
                {searchResults.invoices.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80 px-2 mb-1 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5" /> Invoices ({searchResults.invoices.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.invoices.map(inv => (
                        <div
                          key={inv.id}
                          onClick={() => handleGoTo('invoices')}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-[#232D42] transition-all group"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                              {inv.invoiceNumber} — {inv.clientCompany}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Total: ₹{inv.totalAmount.toLocaleString('en-IN')} · Due {inv.dueDate}
                            </div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-500/20 text-[#ECC968]' :
                            inv.status === 'Overdue' ? 'bg-rose-500/20 text-slate-300' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Tasks */}
                {searchResults.tasks.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300/80 px-2 mb-1 flex items-center gap-1.5">
                      <Swords className="w-3.5 h-3.5" /> Tasks & Missions ({searchResults.tasks.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.tasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => handleGoTo('tasks')}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-[#232D42] transition-all group"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                              {t.title}
                            </div>
                            <div className="text-[11px] text-slate-400">{t.clientName} · {t.status}</div>
                          </div>
                          <span className="text-[10px] text-amber-400 font-bold">+{t.xpReward} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Domains */}
                {searchResults.domains.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#ECC968]/80 px-2 mb-1 flex items-center gap-1.5">
                      <Hammer className="w-3.5 h-3.5" /> Domains & Hosting ({searchResults.domains.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.domains.map(h => (
                        <div
                          key={h.id}
                          onClick={() => handleGoTo('hosting')}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-[#232D42] transition-all group"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                              {h.domain}
                            </div>
                            <div className="text-[11px] text-slate-400">{h.clientName} · Expires in {h.daysUntilDomainExpiry} days</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Documents */}
                {searchResults.documents.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300/80 px-2 mb-1 flex items-center gap-1.5">
                      <Library className="w-3.5 h-3.5" /> Documents & Archives ({searchResults.documents.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.documents.map(d => (
                        <div
                          key={d.id}
                          onClick={() => handleGoTo('documents')}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-[#232D42] transition-all group"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-300">
                              {d.title}
                            </div>
                            <div className="text-[11px] text-slate-400">{d.clientName} · {d.category}</div>
                          </div>
                          <span className="text-[10px] text-slate-500">{d.fileSize}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </>
            )
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-800 bg-[#151C2C]/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Search tip: Enter client name or domain to jump directly</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
