import React, { useState } from 'react';
import {
  Swords,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Zap,
  Lock,
  Unlock,
  Gem
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { TaskStatus } from '../types';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const TasksView: React.FC = () => {
  const {
    tasks,
    clients,
    toggleTaskStatus,
    setActiveModal,
    openClientHQ,
    isPerkUnlocked,
    unlockPerk,
    deployStandardSprint
  } = useDashboard();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [sprintClientId, setSprintClientId] = useState<string>(clients[0]?.id || '');

  const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Waiting for Client', 'Review', 'Completed'];

  const dailyMissions = tasks.filter(t => t.isDailyMission);
  const completedDailyCount = dailyMissions.filter(t => t.status === 'Completed').length;
  const isSprintUnlocked = isPerkUnlocked('sprint_deployer');

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
            <Swords className="w-5 h-5 text-[#C9A038]" />
            Task Battle Board & Daily Missions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational freelance tasks, client sprint items, and daily battle objectives
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModal('add-task');
          }}
          className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Deploy New Mission</span>
        </button>
      </div>

      {/* Perk Banner: 1-Click Sprint Deployer */}
      {isSprintUnlocked ? (
        <div className="p-4 rounded-2xl bg-[#141B2B] border border-[#C9A038]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A038]/20 border border-[#C9A038]/50 flex items-center justify-center text-[#ECC968] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-xs text-slate-100">1-Click Website Sprint Deployer</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A038]/15 text-[#ECC968] font-bold border border-[#C9A038]/30">UNLOCKED</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Instantly populate an 8-mission full-lifecycle website sprint with real deadlines & XP.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {clients.length > 0 && (
              <select
                value={sprintClientId}
                onChange={e => setSprintClientId(e.target.value)}
                className="bg-[#0A0D14] border border-[#232D42] text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.company}</option>
                ))}
              </select>
            )}
            <button
              onClick={() => deployStandardSprint(sprintClientId)}
              className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Deploy 8-Mission Sprint</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A0D14] border border-[#232D42] flex items-center justify-center text-slate-400 shrink-0">
              <Lock className="w-4 h-4 text-[#C9A038]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-xs text-slate-300">1-Click Website Sprint Deployer</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#151C2C] text-slate-400 border border-[#232D42] font-semibold flex items-center gap-1">
                  <Gem className="w-3 h-3 text-[#ECC968]" /> 15 Gems to Unlock
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Automates generating 8 essential development missions (Wireframing, UI, Mobile code, SEO, Deployment) in 1 second.</p>
            </div>
          </div>
          <button
            onClick={() => unlockPerk('sprint_deployer')}
            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock (15</span>
            <Gem className="w-3.5 h-3.5 fill-[#ECC968]/40" />
            <span>)</span>
          </button>
        </div>
      )}

      {/* Daily Missions Hero Banner */}
      <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              Daily Battle Missions
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A038]/10 text-[#ECC968] border border-[#C9A038]/30 font-bold">
                {completedDailyCount} / {dailyMissions.length} Complete
              </span>
            </h3>
          </div>

          <span className="text-xs font-semibold text-[#ECC968]">
            +{completedDailyCount * 150} XP Claimed
          </span>
        </div>

        {dailyMissions.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No daily missions active today. Click <strong className="text-slate-200">Deploy New Mission</strong> and toggle "Daily Mission" to assign daily XP goals.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
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
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-[#C9A038] text-slate-950 font-bold' : 'border border-slate-600'
                  }`}>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {mission.title}
                    </span>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-slate-300">{mission.clientName}</span>
                      <span>·</span>
                      <span>Due {mission.deadline}</span>
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
    </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search missions or client names..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#C9A038]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['All', 'To Do', 'In Progress', 'Waiting for Client', 'Review', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => { sound.playClick(); setStatusFilter(st); }}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 border transition-all ${
                statusFilter === st
                  ? 'bg-[#182033] text-[#ECC968] border-[#C9A038]/50 font-semibold'
                  : 'bg-[#0A0D14] text-slate-400 hover:text-slate-200 border-[#1E2638]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {statuses.map(statusCol => {
          const colTasks = tasks.filter(t => t.status === statusCol && (search === '' || t.title.toLowerCase().includes(search.toLowerCase())));

          return (
            <div key={statusCol} className="p-3.5 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col h-full">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E2638]">
                <span className="font-heading font-bold text-xs text-slate-200">
                  {statusCol}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#151C2C] text-slate-400 font-bold">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {colTasks.length === 0 ? (
                  <div className="py-6 text-center text-slate-600 text-[11px]">
                    No items
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] hover:border-[#C9A038]/40 transition-all space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span 
                          onClick={() => openClientHQ(task.clientId)}
                          className="text-[10px] font-bold text-[#ECC968] hover:underline cursor-pointer"
                        >
                          {task.clientName}
                        </span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#101522] text-slate-400 border border-[#232D42]">
                          {task.priority}
                        </span>
                      </div>

                      <h4 
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`text-xs font-semibold cursor-pointer ${
                          task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200 hover:text-[#ECC968]'
                        }`}
                      >
                        {task.title}
                      </h4>

                      <div className="pt-1.5 border-t border-[#1E2638] flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {task.deadline}
                        </span>
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="text-[#ECC968] hover:underline font-semibold"
                        >
                          {task.status === 'Completed' ? 'Undo' : 'Done ✓'}
                        </button>
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
