import React from 'react';
import {
  Binoculars,
  Plus,
  ArrowRight,
  TrendingUp,
  Gem,
  Sparkles
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { LeadStatus } from '../types';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const LeadsView: React.FC = () => {
  const {
    leads,
    updateLeadStatus,
    convertLeadToClient,
    setActiveModal,
    formatCurrency
  } = useDashboard();

  const stages: LeadStatus[] = ['Discovered', 'Contacted', 'Interested', 'Proposal', 'Negotiation', 'Won'];

  const totalPipelineValue = leads.reduce((sum, l) => l.status !== 'Lost' ? sum + l.potentialValue : sum, 0);
  const weightedPipelineValue = leads.reduce((sum, l) => l.status !== 'Lost' ? sum + (l.potentialValue * (l.probability / 100)) : sum, 0);

  return (
    <div className="space-y-6">
      
      {/* Return Button */}
      <div>
        <ReturnButton />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <Binoculars className="w-5 h-5 text-[#C9A038]" />
            Scout Tower & Leads Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track prospective website opportunities from scouting discovery to proposal and winning the contract
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModal('add-lead');
          }}
          className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Scout New Lead</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#121826] border border-[#20293D]">
          <div className="text-xs text-slate-400 mb-1">Total Pipeline Value</div>
          <div className="text-2xl font-bold text-slate-100 font-heading">
            {formatCurrency(totalPipelineValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{leads.length} Active Deals</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121826] border border-[#20293D]">
          <div className="text-xs text-slate-400 mb-1">Weighted Pipeline Forecast</div>
          <div className="text-2xl font-bold text-[#ECC968] font-heading">
            {formatCurrency(Math.round(weightedPipelineValue))}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Probability adjusted</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121826] border border-[#20293D]">
          <div className="text-xs text-slate-400 mb-1">Win Conversion Rate</div>
          <div className="text-2xl font-bold text-slate-200 font-heading">
            68.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">High conversion momentum</div>
        </div>
      </div>

      {/* Pipeline Lanes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage);
          const stageTotal = stageLeads.reduce((acc, l) => acc + l.potentialValue, 0);

          return (
            <div key={stage} className="p-3 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col h-full">
              <div className="mb-2 pb-2 border-b border-[#1E2638]">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-slate-200">{stage}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#151C2C] text-slate-400 font-bold">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                  {formatCurrency(stageTotal)}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="py-6 text-center text-slate-600 text-[11px]">
                    No deals
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] hover:border-[#C9A038]/40 transition-all space-y-1.5"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-slate-100">
                          {lead.company}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {lead.probability}%
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[#ECC968]">
                        {formatCurrency(lead.potentialValue)}
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{lead.source}</span>
                        <span>{lead.nextFollowUp}</span>
                      </div>

                      <div className="pt-2 border-t border-[#1E2638] flex items-center justify-between">
                        {stage === 'Won' ? (
                          <button
                            onClick={() => convertLeadToClient(lead.id)}
                            className="btn-gold w-full py-1 text-[10px] font-bold rounded-lg"
                          >
                            Convert to HQ →
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                const nextIndex = stages.indexOf(stage) + 1;
                                if (nextIndex < stages.length) {
                                  updateLeadStatus(lead.id, stages[nextIndex]);
                                }
                              }}
                              className="text-[10px] text-slate-300 hover:text-[#ECC968] font-semibold flex items-center gap-1"
                            >
                              <span>Next Stage</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => updateLeadStatus(lead.id, 'Won')}
                              className="text-[10px] text-[#ECC968] font-bold hover:underline"
                            >
                              Won ✓
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
