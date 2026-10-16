import React from 'react';
import {
  BarChart3,
  Award,
  TrendingUp
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { ReturnButton } from '../components/common/ReturnButton';

export const AnalyticsView: React.FC = () => {
  const {
    clients,
    projects,
    leads,
    hostingDomains,
    transactions,
    kingdomStats,
    formatCurrency
  } = useDashboard();

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const avgProjectValue = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.projectValue, 0) / projects.length)
    : 0;

  // Real Proposal Win Rate from scouted leads
  const wonLeads = leads.filter(l => l.status === 'Won').length;
  const closedLeads = leads.filter(l => l.status === 'Won' || l.status === 'Lost').length;
  const winRateText = closedLeads > 0
    ? `${((wonLeads / closedLeads) * 100).toFixed(1)}%`
    : '0.0%';
  const winRateSubtext = closedLeads > 0
    ? `${wonLeads} of ${closedLeads} closed deals won`
    : 'No closed proposals yet';

  // Real Retainer Renewal from hosting & maintenance domains
  const activeRetainers = hostingDomains.filter(h => h.maintenanceStatus === 'Active Retainer').length;
  const totalDomains = hostingDomains.length;
  const retainerRateText = totalDomains > 0
    ? `${((activeRetainers / totalDomains) * 100).toFixed(1)}%`
    : '0.0%';
  const retainerSubtext = totalDomains > 0
    ? `${activeRetainers} of ${totalDomains} on active retainer`
    : 'No maintenance contracts yet';

  // Real Monthly Revenue Breakdown for last 6 months from real payment transactions
  const now = new Date();
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = d.toLocaleString('en-US', { month: 'short' });
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    const monthRevenue = transactions
      .filter(t => t.date && t.date.startsWith(yearMonth))
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    monthlyData.push({
      month: monthLabel,
      val: monthRevenue,
      isCurrentMonth: i === 0
    });
  }

  const maxMonthVal = Math.max(...monthlyData.map(m => m.val), 1);
  const totalRecentRevenue = monthlyData.reduce((sum, m) => sum + m.val, 0);

  return (
    <div className="space-y-6">
      
      {/* Return Button */}
      <div>
        <ReturnButton />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#C9A038]" />
          Kingdom Statistics & Business Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          High-level operational performance, project throughput, and revenue velocity
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-[#121826] border border-[#20293D]">
          <div className="text-slate-400 font-medium">Total Clients</div>
          <div className="text-xl font-bold text-slate-100 font-heading mt-1">{totalClients}</div>
          <div className="text-[10px] text-slate-400 mt-1">{activeClients} Active Builds</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121826] border border-[#20293D]">
          <div className="text-slate-400 font-medium">Average Contract</div>
          <div className="text-xl font-bold text-[#ECC968] font-heading mt-1">{formatCurrency(avgProjectValue)}</div>
          <div className="text-[10px] text-slate-400 mt-1">Per website project</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121826] border border-[#20293D]">
          <div className="text-slate-400 font-medium">Proposal Win Rate</div>
          <div className="text-xl font-bold text-slate-100 font-heading mt-1">{winRateText}</div>
          <div className="text-[10px] text-slate-400 mt-1">{winRateSubtext}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121826] border border-[#20293D]">
          <div className="text-slate-400 font-medium">Retainer Renewal</div>
          <div className="text-xl font-bold text-slate-100 font-heading mt-1">{retainerRateText}</div>
          <div className="text-[10px] text-slate-400 mt-1">{retainerSubtext}</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-100">
                Monthly Revenue ({now.getFullYear()})
              </h3>
              <p className="text-xs text-slate-400">Total collected milestone revenue from treasury deposits</p>
            </div>
            <span className="text-xs font-semibold text-[#ECC968] bg-[#C9A038]/10 px-2.5 py-0.5 rounded border border-[#C9A038]/30 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{totalRecentRevenue > 0 ? `${formatCurrency(totalRecentRevenue)} Total` : 'Awaiting Deposits'}</span>
            </span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-3 h-48">
            {monthlyData.map(m => {
              const heightPct = m.val > 0 ? Math.max(12, Math.round((m.val / maxMonthVal) * 100)) : 4;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className={`text-[10px] font-bold transition-opacity ${m.val > 0 ? 'text-[#ECC968] group-hover:opacity-100 opacity-80' : 'text-slate-500 opacity-40 group-hover:opacity-100'}`}>
                    {formatCurrency(m.val)}
                  </span>
                  <div
                    className={`w-full rounded-xl transition-all ${
                      m.val > 0
                        ? m.isCurrentMonth
                          ? 'bg-gradient-to-t from-[#C9A038] to-[#ECC968] shadow-[0_0_12px_rgba(201,160,56,0.3)]'
                          : 'bg-[#C9A038]/70 hover:bg-[#C9A038]'
                        : 'bg-[#151C2C] border border-[#232D42]/60 hover:border-[#C9A038]/30'
                    }`}
                    style={{ height: `${heightPct}%` }}
                    title={`${m.month}: ${formatCurrency(m.val)}`}
                  />
                  <span className={`text-[11px] mt-1 ${m.isCurrentMonth ? 'text-[#ECC968] font-bold' : 'text-slate-400'}`}>
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kingdom Milestones */}
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C9A038]" />
            <h3 className="font-heading font-bold text-sm text-slate-100">
              Kingdom Milestones
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">First ₹1,00,000 Milestone</span>
                <p className="text-[10px] text-slate-400">
                  {kingdomStats.collectedRevenue >= 100000 ? 'Unlocked' : `${formatCurrency(kingdomStats.collectedRevenue)} / ₹1,00,000`}
                </p>
              </div>
              <span className={`font-bold ${kingdomStats.collectedRevenue >= 100000 ? 'text-[#ECC968]' : 'text-slate-500'}`}>
                {kingdomStats.collectedRevenue >= 100000 ? '✓' : 'Locked'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">5 Active Concurrent Projects</span>
                <p className="text-[10px] text-slate-400">
                  {projects.length >= 5 ? 'Unlocked Level 4 Digital Architect' : `${projects.length} / 5 Projects created`}
                </p>
              </div>
              <span className={`font-bold ${projects.length >= 5 ? 'text-[#ECC968]' : 'text-slate-500'}`}>
                {projects.length >= 5 ? '✓' : 'Locked'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">{kingdomStats.title} (Level {kingdomStats.level})</span>
                <p className="text-[10px] text-slate-400">
                  {kingdomStats.currentXP} / {kingdomStats.maxXP} XP to Level {kingdomStats.level + 1}
                </p>
              </div>
              <span className="text-[#ECC968] font-bold text-xs">
                {Math.round((kingdomStats.currentXP / (kingdomStats.maxXP || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
