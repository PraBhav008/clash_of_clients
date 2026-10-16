import React from 'react';
import {
  Coins,
  Plus,
  Receipt,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const TreasuryView: React.FC = () => {
  const {
    kingdomStats,
    transactions,
    invoices,
    setActiveModal,
    openClientHQ,
    formatCurrency
  } = useDashboard();

  const overdueTotal = invoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + i.balanceDue, 0);

  return (
    <div className="space-y-6">
      
      {/* Return Button */}
      <div>
        <ReturnButton />
      </div>

      {/* Header */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#C9A038] shrink-0" />
            <span className="break-words">Treasury & Resource Storage</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Financial revenue vaults, pending milestone settlements, and operating cashflow
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModal('log-payment');
          }}
          className="btn-gold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Deposit Gold / Log Payment</span>
        </button>
      </div>

      {/* 3 Core Financial Storage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. Total Revenue / Gold */}
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Revenue (Gold)</span>
            <Coins className="w-4 h-4 text-[#C9A038]" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-heading">
            {formatCurrency(kingdomStats.goldRevenue)}
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Capacity</span>
              <span>{formatCurrency(kingdomStats.goldCapacity)}</span>
            </div>
            <div className="w-full h-1.5 bg-[#0A0D14] rounded-full overflow-hidden border border-[#232D42]">
              <div
                className="h-full bg-[#C9A038] rounded-full"
                style={{ width: `${(kingdomStats.goldRevenue / kingdomStats.goldCapacity) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Pending Payments */}
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Loot</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-200 font-heading">
            {formatCurrency(kingdomStats.darkElixirPending)}
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Overdue Risk</span>
              <span className="text-slate-300">{formatCurrency(overdueTotal)}</span>
            </div>
            <div className="w-full h-1.5 bg-[#0A0D14] rounded-full overflow-hidden border border-[#232D42]">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* 3. Collected Loot */}
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Collected Treasury</span>
            <ShieldCheck className="w-4 h-4 text-[#C9A038]" />
          </div>
          <div className="text-2xl font-bold text-[#ECC968] font-heading">
            {formatCurrency(kingdomStats.collectedRevenue)}
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Net Profit</span>
              <span className="text-slate-300">{formatCurrency(kingdomStats.netProfit)}</span>
            </div>
            <div className="w-full h-1.5 bg-[#0A0D14] rounded-full overflow-hidden border border-[#232D42]">
              <div className="h-full bg-[#C9A038] rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#121826] border border-[#20293D]">
          <span className="text-slate-400 block text-[11px]">Monthly Revenue</span>
          <span className="text-base font-bold text-slate-100 font-heading mt-0.5 block">{formatCurrency(kingdomStats.monthlyRevenue)}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121826] border border-[#20293D]">
          <span className="text-slate-400 block text-[11px]">Operating Expenses</span>
          <span className="text-base font-bold text-slate-300 font-heading mt-0.5 block">{formatCurrency(kingdomStats.totalExpenses)}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121826] border border-[#20293D]">
          <span className="text-slate-400 block text-[11px]">Net Profit</span>
          <span className="text-base font-bold text-[#ECC968] font-heading mt-0.5 block">{formatCurrency(kingdomStats.netProfit)}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121826] border border-[#20293D]">
          <span className="text-slate-400 block text-[11px]">Overdue Invoices</span>
          <span className="text-base font-bold text-slate-300 font-heading mt-0.5 block">{formatCurrency(overdueTotal)}</span>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-400" />
            Treasury Ledger & Verified Deposits
          </h3>
          <span className="text-xs text-slate-400">{transactions.length} Total Deposits</span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 bg-[#151C2C] rounded-xl border border-[#232D42]">
            No deposit transactions recorded yet. Click <strong className="text-slate-200">Deposit Gold / Log Payment</strong> above to record milestone receipts.
          </div>
        ) : (
          <div className="divide-y divide-[#1E2638] rounded-xl border border-[#232D42] overflow-hidden bg-[#151C2C] text-xs">
            {transactions.map(tx => (
              <div key={tx.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      onClick={() => openClientHQ(tx.clientId)}
                      className="font-bold text-slate-100 hover:text-[#ECC968] cursor-pointer"
                    >
                      {tx.clientName}
                    </span>
                    <span className="text-[10px] text-slate-400">({tx.type})</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {tx.date} · {tx.method} · Ref: <span className="font-mono">{tx.referenceNo}</span>
                  </div>
                </div>

                <span className="text-sm font-bold text-[#ECC968]">
                  +{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
