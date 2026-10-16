import React, { useState } from 'react';
import {
  X,
  Gem,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Zap,
  Send,
  Printer,
  ShieldAlert,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { availablePerks, availableAchievements } from '../../data/initialData';
import { sound } from '../../utils/audio';
import { PerkId } from '../../types';

export const GemForgeModal: React.FC = () => {
  const {
    gems,
    isGemForgeOpen,
    setIsGemForgeOpen,
    unlockedPerks,
    claimedAchievements,
    claimAchievement,
    unlockPerk,
    isPerkUnlocked,
    getAchievementProgress,
    claimableAchievementsCount
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'perks' | 'achievements'>('perks');

  if (!isGemForgeOpen) return null;

  const getPerkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-[#ECC968]" />;
      case 'Send': return <Send className="w-5 h-5 text-[#ECC968]" />;
      case 'Printer': return <Printer className="w-5 h-5 text-[#ECC968]" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-[#ECC968]" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-[#ECC968]" />;
      default: return <Sparkles className="w-5 h-5 text-[#ECC968]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-[#0F1420] border border-[#232D42] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#1E2638] bg-[#121826] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A2234] border border-[#C9A038]/50 flex items-center justify-center text-[#ECC968] shadow-sm shrink-0">
              <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="font-heading font-bold text-sm sm:text-base text-slate-100 truncate">
                  Citadel Gem Forge & Armory
                </h2>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#C9A038]/15 text-[#ECC968] border border-[#C9A038]/40 font-bold flex items-center gap-1 shrink-0">
                  <Gem className="w-3 h-3" /> {gems} Gems
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate hidden sm:block">
                Earn Gems through Clan Milestones. Spend Gems to permanently unlock speed shortcuts and automation.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsGemForgeOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A2234] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#1E2638] bg-[#0E121C] px-3.5 sm:px-5 gap-3 sm:gap-4 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('perks');
            }}
            className={`py-3 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'perks'
                ? 'border-[#C9A038] text-[#ECC968]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Permanent Perk Unlocks ({unlockedPerks.length}/{availablePerks.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('achievements');
            }}
            className={`py-3 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'achievements'
                ? 'border-[#C9A038] text-[#ECC968]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Clan Achievements & Rewards</span>
            {claimableAchievementsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#C9A038] text-slate-950 font-bold text-[10px] animate-pulse">
                {claimableAchievementsCount} Claimable
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'perks' ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
                <span>Unlock powerful automation features permanently using earned Gems.</span>
                <span className="font-bold text-[#ECC968] flex items-center gap-1 shrink-0">
                  Balance: <Gem className="w-3.5 h-3.5 inline" /> {gems} Gems
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePerks.map(perk => {
                  const unlocked = isPerkUnlocked(perk.id);
                  const canAfford = gems >= perk.gemCost;

                  return (
                    <div
                      key={perk.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                        unlocked
                          ? 'bg-[#121826] border-[#C9A038]/40'
                          : 'bg-[#151C2C] border-[#232D42] hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg border ${
                              unlocked
                                ? 'bg-[#C9A038]/15 border-[#C9A038]/40 text-[#ECC968]'
                                : 'bg-[#0A0D14] border-[#232D42] text-slate-400'
                            }`}>
                              {getPerkIcon(perk.iconName)}
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-xs text-slate-100">
                                {perk.name}
                              </h4>
                              <span className="text-[10px] uppercase font-bold text-slate-400">
                                {perk.category}
                              </span>
                            </div>
                          </div>

                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            unlocked
                              ? 'bg-[#C9A038]/20 text-[#ECC968] border border-[#C9A038]/40'
                              : 'bg-[#0A0D14] text-slate-300 border border-[#232D42]'
                          }`}>
                            <Gem className="w-3 h-3 text-[#ECC968]" />
                            {perk.gemCost}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">
                          {perk.description}
                        </p>

                        <div className="mt-2 text-[11px] text-[#ECC968] font-medium bg-[#0A0D14] p-2 rounded-lg border border-[#20293D]">
                          <strong>Workflow Boost:</strong> {perk.benefit}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1E2638] flex items-center justify-between">
                        {unlocked ? (
                          <div className="w-full text-center py-1.5 rounded-lg bg-[#C9A038]/15 border border-[#C9A038]/40 text-xs font-bold text-[#ECC968] flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Permanently Unlocked</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => unlockPerk(perk.id)}
                            className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                              canAfford
                                ? 'btn-gold'
                                : 'bg-[#1A2234] text-slate-400 border border-[#232D42] hover:border-slate-500'
                            }`}
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Unlock for {perk.gemCost} Gems {canAfford ? '' : `(Need ${perk.gemCost - gems} more)`}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#121826] border border-[#20293D] flex items-center justify-between text-xs text-slate-300">
                <span>Complete business milestones and daily missions to harvest reward Gems and bonus XP.</span>
                {claimableAchievementsCount > 0 && (
                  <span className="font-bold text-[#ECC968]">
                    {claimableAchievementsCount} Reward{claimableAchievementsCount > 1 ? 's' : ''} Ready!
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {availableAchievements.map(ach => {
                  const progress = getAchievementProgress(ach.id);
                  const pct = Math.min(100, Math.round((progress.current / progress.target) * 100));

                  return (
                    <div
                      key={ach.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        progress.isCompleted && !progress.isClaimed
                          ? 'bg-[#151C2C] border-[#C9A038] shadow-sm'
                          : progress.isClaimed
                          ? 'bg-[#0E121C] border-[#1E2638] opacity-75'
                          : 'bg-[#121826] border-[#20293D]'
                      }`}
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-xs text-slate-100">
                            {ach.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A038]/10 text-[#ECC968] font-bold border border-[#C9A038]/30 flex items-center gap-1">
                            <Gem className="w-3 h-3" /> +{ach.gemReward} Gems
                          </span>
                          <span className="text-[10px] text-slate-400">
                            +{ach.xpReward} XP
                          </span>
                        </div>

                        <p className="text-xs text-slate-400">
                          {ach.description}
                        </p>

                        {/* Progress Meter */}
                        <div className="flex items-center gap-2 max-w-xs">
                          <div className="flex-1 h-1.5 rounded-full bg-[#0A0D14] overflow-hidden border border-[#232D42]">
                            <div
                              className="h-full bg-[#C9A038] rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {progress.current > 1000 ? `₹${progress.current.toLocaleString('en-IN')}` : progress.current} / {progress.target > 1000 ? `₹${progress.target.toLocaleString('en-IN')}` : progress.target}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {progress.isClaimed ? (
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 px-3 py-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Claimed</span>
                          </span>
                        ) : progress.isCompleted ? (
                          <button
                            onClick={() => claimAchievement(ach.id)}
                            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md animate-bounce"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Claim +{ach.gemReward}</span>
                            <Gem className="w-3.5 h-3.5 fill-[#ECC968]/40" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500 px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-[#20293D]">
                            {pct}% Progress
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[#1E2638] bg-[#121826] flex items-center justify-between text-xs text-slate-400">
          <span>Clash of Clans Business Progression System</span>
          <button
            onClick={() => {
              sound.playClick();
              setIsGemForgeOpen(false);
            }}
            className="btn-dark px-3 py-1 rounded-lg text-xs"
          >
            Close Armory
          </button>
        </div>
      </div>
    </div>
  );
};
