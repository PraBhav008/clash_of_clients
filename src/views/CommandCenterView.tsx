import React from 'react';
import {
  Castle,
  Coins,
  Briefcase,
  Layers,
  Sparkles,
  Swords,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building2,
  Binoculars,
  Library,
  Hammer,
  MessageSquare,
  CalendarDays,
  ShieldAlert
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { sound } from '../utils/audio';

export const CommandCenterView: React.FC = () => {
  const {
    kingdomStats,
    tasks,
    clients,
    projects,
    leads,
    invoices,
    hostingDomains,
    transactions,
    communications,
    toggleTaskStatus,
    openClientHQ,
    setActiveView,
    formatCurrency,
    setActiveModal
  } = useDashboard();

  const dailyMissions = tasks.filter(t => t.isDailyMission);
  const completedMissionsCount = dailyMissions.filter(t => t.status === 'Completed').length;
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue');
  const expiringAssets = hostingDomains.filter(h => h.daysUntilDomainExpiry <= 30 || h.daysUntilHostingExpiry <= 14);

  const villageBuildings = [
    { id: 'clients', title: 'Clan Hall', subtitle: `${clients.length} Clients Managed`, view: 'clients', icon: <Building2 className="w-4 h-4 text-slate-300" /> },
    { id: 'projects', title: 'Project Base', subtitle: `${projects.length} Active Builds`, view: 'projects', icon: <Castle className="w-4 h-4 text-slate-300" /> },
    { id: 'treasury', title: 'Gold Storage', subtitle: `${formatCurrency(kingdomStats.collectedRevenue)} Collected`, view: 'treasury', icon: <Coins className="w-4 h-4 text-[#C9A038]" /> },
    { id: 'leads', title: 'Scout Tower', subtitle: `${leads.length} Deals in Pipeline`, view: 'leads', icon: <Binoculars className="w-4 h-4 text-slate-300" /> },
    { id: 'hosting', title: "Builder's Hall", subtitle: 'Domains & Cloud Uptime', view: 'hosting', icon: <Hammer className="w-4 h-4 text-slate-300" /> },
    { id: 'documents', title: 'Clan Library', subtitle: 'Contracts & Access Vault', view: 'documents', icon: <Library className="w-4 h-4 text-slate-300" /> },
    { id: 'comms', title: 'Messenger Tower', subtitle: 'WhatsApp & Call Logs', view: 'communications', icon: <MessageSquare className="w-4 h-4 text-slate-300" /> },
    { id: 'calendar', title: 'War Planner', subtitle: 'Deadlines & Launches', view: 'calendar', icon: <CalendarDays className="w-4 h-4 text-slate-300" /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Executive Command Banner */}
      <div className="rounded-2xl bg-[#121826] border border-[#20293D] p-4 sm:p-5 lg:p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          <div className="space-y-1.5 max-w-xl min-w-0 w-full">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A2234] border border-[#C9A038]/30 text-[#ECC968] text-xs font-semibold">
              <Castle className="w-3.5 h-3.5" />
              <span>Town Hall 4 · {kingdomStats.title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading break-words">
              Freelancer Command Village
            </h1>
            <p className="text-xs text-slate-400">
              Complete client lifecycle, website projects, payments, domains, and missions from a single unified tactical dashboard.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 w-full lg:w-auto text-xs shrink-0">
            <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#151C2C] border border-[#232D42] text-center min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block truncate">Clients</span>
              <span className="text-sm sm:text-base font-bold text-slate-100 font-heading">{clients.filter(c => c.status === 'Active').length}</span>
            </div>
            <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#151C2C] border border-[#232D42] text-center min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block truncate">Loot</span>
              <span className="text-sm sm:text-base font-bold text-[#ECC968] font-heading truncate block">{formatCurrency(kingdomStats.collectedRevenue)}</span>
            </div>
            <div className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#151C2C] border border-[#232D42] text-center min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block truncate">Pending</span>
              <span className="text-sm sm:text-base font-bold text-slate-200 font-heading truncate block">{formatCurrency(kingdomStats.darkElixirPending)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Clean Resource Metric Cards (Unified Bronze/Obsidian Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Revenue / Gold */}
        <div 
          onClick={() => { sound.playClick(); setActiveView('treasury'); }}
          className="p-4 rounded-xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue (Gold)</span>
            <Coins className="w-4 h-4 text-[#C9A038]" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-heading">
            {formatCurrency(kingdomStats.goldRevenue)}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Capacity</span>
              <span className="font-semibold text-slate-300">{formatCurrency(kingdomStats.goldCapacity)}</span>
            </div>
            <div className="w-full h-1.5 bg-[#171E2E] rounded-full overflow-hidden border border-[#232D42]">
              <div 
                className="h-full bg-[#C9A038] rounded-full"
                style={{ width: `${Math.min(100, (kingdomStats.goldRevenue / kingdomStats.goldCapacity) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Active Projects / Elixir */}
        <div 
          onClick={() => { sound.playClick(); setActiveView('projects'); }}
          className="p-4 rounded-xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Projects (Elixir)</span>
            <Briefcase className="w-4 h-4 text-slate-300" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-heading">
            {kingdomStats.elixirActiveProjects} Active Builds
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Workbench Slots</span>
              <span className="font-semibold text-slate-300">{kingdomStats.elixirCapacity} Max</span>
            </div>
            <div className="w-full h-1.5 bg-[#171E2E] rounded-full overflow-hidden border border-[#232D42]">
              <div 
                className="h-full bg-slate-300 rounded-full"
                style={{ width: `${(kingdomStats.elixirActiveProjects / kingdomStats.elixirCapacity) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Pending Payments */}
        <div 
          onClick={() => { sound.playClick(); setActiveView('treasury'); }}
          className="p-4 rounded-xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Loot</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-200 font-heading">
            {formatCurrency(kingdomStats.darkElixirPending)}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Overdue Invoices</span>
              <span className="font-semibold text-slate-300">{overdueInvoices.length} Due</span>
            </div>
            <div className="w-full h-1.5 bg-[#171E2E] rounded-full overflow-hidden border border-[#232D42]">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* 4. Scouted Leads */}
        <div 
          onClick={() => { sound.playClick(); setActiveView('leads'); }}
          className="p-4 rounded-xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scouted Leads</span>
            <Sparkles className="w-4 h-4 text-[#C9A038]" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-heading">
            {kingdomStats.gemsOpportunities} Opportunities
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Pipeline Value</span>
              <span className="font-semibold text-[#ECC968]">₹4,50,000</span>
            </div>
            <div className="w-full h-1.5 bg-[#171E2E] rounded-full overflow-hidden border border-[#232D42]">
              <div className="h-full bg-[#C9A038] rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Left (Daily Missions & Modules) + Right (Alerts & Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily Missions */}
          <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#151C2C] border border-[#232D42] flex items-center justify-center text-[#C9A038]">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
                    Daily Missions Battle Board
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A038]/10 text-[#ECC968] border border-[#C9A038]/30">
                      +{completedMissionsCount * 150} XP Today
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Complete daily freelance objectives to level up your kingdom</p>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-300">
                {completedMissionsCount} / {dailyMissions.length}
              </span>
            </div>

            {/* Missions List */}
            {dailyMissions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 bg-[#151C2C] rounded-xl border border-[#232D42]">
                No daily missions active. Click <strong className="text-slate-200">+ Add Mission</strong> below to deploy XP objectives.
              </div>
            ) : (
              <div className="space-y-2">
                {dailyMissions.map(mission => {
                  const isCompleted = mission.status === 'Completed';
                  return (
                    <div
                      key={mission.id}
                      onClick={() => toggleTaskStatus(mission.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-[#0E121C] border-[#1A2234] text-slate-500'
                          : 'bg-[#151C2C] border-[#232D42] hover:border-[#C9A038]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-[#C9A038] text-slate-950 font-bold'
                              : 'border border-slate-600'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <span className={`text-xs font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {mission.title}
                          </span>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-slate-300">{mission.clientName}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Due {mission.deadline}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-slate-400">
                        +{mission.xpReward} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs border-t border-[#1E2638]">
              <button 
                onClick={() => setActiveModal('add-task')}
                className="text-[#ECC968] hover:underline font-semibold"
              >
                + Add Mission
              </button>
              <button 
                onClick={() => setActiveView('tasks')}
                className="text-slate-400 hover:text-slate-200"
              >
                Full Task Board →
              </button>
            </div>
          </div>

          {/* Strategic Village Buildings (Clean Slate/Bronze Cards) */}
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-100 mb-3">
              Village Command Buildings
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {villageBuildings.map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveView(b.view as any);
                  }}
                  className="p-3.5 rounded-xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="p-2 rounded-lg bg-[#151C2C] border border-[#232D42] w-fit mb-2 group-hover:scale-105 transition-transform">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-slate-100 group-hover:text-[#ECC968]">
                      {b.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {b.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Relationship Watchlist */}
          <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-100">
                  Client Relationship Watchlist
                </h3>
                <p className="text-[11px] text-slate-400">Click any client to enter their all-in-one Client Headquarters</p>
              </div>
              <button
                onClick={() => setActiveView('clients')}
                className="text-xs text-[#ECC968] hover:underline font-semibold"
              >
                All Clients →
              </button>
            </div>

            {clients.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-[#151C2C] rounded-xl border border-[#232D42] space-y-2">
                <p>No client bases recruited yet.</p>
                <button
                  onClick={() => setActiveModal('add-client')}
                  className="btn-gold px-3.5 py-1.5 rounded-xl text-xs inline-flex items-center gap-1.5"
                >
                  <span>+ Recruit First Client</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clients.slice(0, 4).map(c => (
                  <div
                    key={c.id}
                    onClick={() => openClientHQ(c.id)}
                    className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] hover:border-[#C9A038]/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-200 group-hover:text-[#ECC968]">
                            {c.company}
                          </div>
                          <div className="text-[10px] text-slate-400">{c.name}</div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-slate-300 bg-[#121826] px-2 py-0.5 rounded border border-[#20293D]">
                        {c.healthScore}% Health
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#1E2638] flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Pending: <strong className="text-slate-200">{formatCurrency(c.amountPending)}</strong></span>
                      <span className="text-[#ECC968] font-semibold text-xs">Enter HQ →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Notices & Activity */}
        <div className="space-y-6">
          
          {/* Urgent Notices */}
          <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#C9A038]" /> Urgent Notices
            </div>

            <div className="space-y-2 text-xs">
              {overdueInvoices.length === 0 && expiringAssets.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] text-[11px] text-slate-400 text-center">
                  All systems operational. No overdue invoices or domain renewals.
                </div>
              ) : (
                <>
                  {overdueInvoices.map(inv => (
                    <div 
                      key={inv.id}
                      onClick={() => setActiveView('invoices')}
                      className="p-2.5 rounded-xl bg-[#151C2C] border border-[#232D42] cursor-pointer hover:border-slate-500 transition-all"
                    >
                      <div className="font-bold text-slate-200 flex items-center justify-between">
                        <span>Invoice Overdue</span>
                        <span className="text-[10px] text-rose-400">Due {inv.dueDate}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {inv.clientCompany}: {formatCurrency(inv.balanceDue)} unpaid balance.
                      </p>
                    </div>
                  ))}

                  {expiringAssets.map(exp => (
                    <div
                      key={exp.id}
                      onClick={() => setActiveView('hosting')}
                      className="p-2.5 rounded-xl bg-[#151C2C] border border-[#232D42] cursor-pointer hover:border-slate-500 transition-all"
                    >
                      <div className="font-bold text-slate-200 flex items-center justify-between">
                        <span>Renewal Alert</span>
                        <span className="text-[10px] text-[#ECC968] font-bold">
                          {exp.daysUntilDomainExpiry <= 30 ? `${exp.daysUntilDomainExpiry}d domain` : `${exp.daysUntilHostingExpiry}d server`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {exp.clientName} ({exp.domain})
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C9A038]" />
              Activity Feed
            </h3>

            <div className="space-y-3 text-xs">
              {transactions.length === 0 && communications.length === 0 ? (
                <div className="py-6 text-center text-[11px] text-slate-500">
                  Activity stream is clear. Completed tasks, deposits, and client communications will appear here.
                </div>
              ) : (
                <>
                  {transactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A038] mt-1.5 shrink-0" />
                      <div>
                        <p className="text-slate-200">
                          <strong className="text-[#ECC968]">+{formatCurrency(tx.amount)}</strong> received from <span className="font-semibold">{tx.clientName}</span>
                        </p>
                        <span className="text-[10px] text-slate-500">{tx.date} · {tx.type} ({tx.method})</span>
                      </div>
                    </div>
                  ))}

                  {communications.slice(0, 3).map(cm => (
                    <div key={cm.id} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-slate-200">
                          {cm.type} logged with <span className="font-semibold">{cm.clientName}</span>
                        </p>
                        <span className="text-[10px] text-slate-500">{cm.date} · {cm.summary}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
