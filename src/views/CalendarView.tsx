import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Coins,
  Globe,
  Swords,
  Rocket,
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  CheckCircle2
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const CalendarView: React.FC = () => {
  const {
    projects,
    invoices,
    tasks,
    hostingDomains,
    openClientHQ,
    setActiveModal
  } = useDashboard();

  const [filterType, setFilterType] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');
  
  // Current visible month on the calendar
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  
  // Today's date string "YYYY-MM-DD"
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Selected date on the calendar
  const [selectedDate, setSelectedDate] = useState<string>(() => todayStr);

  // Dynamically assemble real events from state
  const allEvents = useMemo(() => {
    const list: Array<{
      id: string;
      date: string;
      time: string;
      title: string;
      type: 'launch' | 'payment' | 'hosting' | 'task';
      client: string;
      clientId: string;
    }> = [];

    // Project launches
    projects.forEach(p => {
      if (p.expectedLaunch) {
        list.push({
          id: `proj-${p.id}`,
          date: p.expectedLaunch,
          time: 'Target Launch',
          title: `Project Launch: ${p.name}`,
          type: 'launch',
          client: p.clientName,
          clientId: p.clientId
        });
      }
    });

    // Invoices due
    invoices.forEach(inv => {
      if (inv.status !== 'Paid' && inv.dueDate) {
        list.push({
          id: `inv-${inv.id}`,
          date: inv.dueDate,
          time: 'Milestone Due',
          title: `Invoice Due: ${inv.invoiceNumber} (${inv.notes || 'Milestone settlement'})`,
          type: 'payment',
          client: inv.clientCompany,
          clientId: inv.clientId
        });
      }
    });

    // Domain & Hosting renewals
    hostingDomains.forEach(hd => {
      if (hd.domainExpiryDate) {
        list.push({
          id: `dom-${hd.id}`,
          date: hd.domainExpiryDate,
          time: 'Domain Renewal',
          title: `Domain Renewal: ${hd.domain} (${hd.domainProvider})`,
          type: 'hosting',
          client: hd.clientName,
          clientId: hd.clientId
        });
      }
      if (hd.hostingExpiryDate) {
        list.push({
          id: `host-${hd.id}`,
          date: hd.hostingExpiryDate,
          time: 'Hosting Renewal',
          title: `Hosting Expiry: ${hd.hostingProvider}`,
          type: 'hosting',
          client: hd.clientName,
          clientId: hd.clientId
        });
      }
    });

    // Tasks due
    tasks.forEach(t => {
      if (t.status !== 'Completed' && t.deadline) {
        list.push({
          id: `task-${t.id}`,
          date: t.deadline,
          time: 'Mission Target',
          title: `Mission: ${t.title}`,
          type: 'task',
          client: t.clientName,
          clientId: t.clientId
        });
      }
    });

    // Sort by date ascending
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [projects, invoices, hostingDomains, tasks]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => filterType === 'All' || e.type === filterType);
  }, [allEvents, filterType]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // First day of month (0 = Sun, 1 = Mon...)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    sound.playClick();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    sound.playClick();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    sound.playClick();
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(todayStr);
  };

  // Events grouped by date for fast calendar lookup
  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof filteredEvents>();
    filteredEvents.forEach(evt => {
      const arr = map.get(evt.date) || [];
      arr.push(evt);
      map.set(evt.date, arr);
    });
    return map;
  }, [filteredEvents]);

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    return eventsByDate.get(selectedDate) || [];
  }, [eventsByDate, selectedDate]);

  // Summary counts
  const launchCount = allEvents.filter(e => e.type === 'launch').length;
  const paymentCount = allEvents.filter(e => e.type === 'payment').length;
  const renewalCount = allEvents.filter(e => e.type === 'hosting').length;
  const taskCount = allEvents.filter(e => e.type === 'task').length;

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
            <CalendarIcon className="w-5 h-5 text-[#C9A038]" />
            War Planner: Master Business Calendar
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive scheduling of website deployments, milestone dues, domain renewals, and missions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-[#121826] border border-[#20293D] p-1 text-xs">
            <button
              onClick={() => { sound.playClick(); setViewMode('calendar'); }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#182033] text-[#ECC968] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setViewMode('agenda'); }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'agenda'
                  ? 'bg-[#182033] text-[#ECC968] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('add-project');
            }}
            className="btn-gold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-bold shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Schedule Operation</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-[#121826] border border-[#20293D] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A038]/15 border border-[#C9A038]/30 flex items-center justify-center text-[#ECC968] shrink-0">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Launches</span>
            <div className="text-sm font-bold text-slate-100 font-heading">{launchCount} Scheduled</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#121826] border border-[#20293D] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Invoices Due</span>
            <div className="text-sm font-bold text-slate-100 font-heading">{paymentCount} Pending</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#121826] border border-[#20293D] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Renewals</span>
            <div className="text-sm font-bold text-slate-100 font-heading">{renewalCount} Assets</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#121826] border border-[#20293D] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/15 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA] shrink-0">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Missions</span>
            <div className="text-sm font-bold text-slate-100 font-heading">{taskCount} Targets</div>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
        {['All', 'launch', 'payment', 'hosting', 'task'].map(cat => (
          <button
            key={cat}
            onClick={() => { sound.playClick(); setFilterType(cat); }}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 border transition-all ${
              filterType === cat
                ? 'bg-[#182033] text-[#ECC968] border-[#C9A038]/50 font-semibold'
                : 'bg-[#0A0D14] text-slate-400 hover:text-slate-200 border-[#1E2638]'
            }`}
          >
            {cat === 'launch' ? '🚀 Launches' :
             cat === 'payment' ? '💰 Invoices & Dues' :
             cat === 'hosting' ? '🌐 Renewals' :
             cat === 'task' ? '⚔️ Missions' : 'All Operations'}
          </button>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Month Grid (2 cols on lg) */}
          <div className="lg:col-span-2 p-4 sm:p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
            
            {/* Calendar Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-slate-100">
                  {monthName}
                </span>
                <button
                  onClick={handleGoToday}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#182033] text-[#ECC968] border border-[#C9A038]/30 hover:border-[#C9A038] transition-all"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-lg bg-[#0E131E] border border-[#1E2638] text-slate-300 hover:text-white hover:border-[#C9A038]/50 flex items-center justify-center transition-all"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-lg bg-[#0E131E] border border-[#1E2638] text-slate-300 hover:text-white hover:border-[#C9A038]/50 flex items-center justify-center transition-all"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {/* Blank cells for offset */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`blank-${i}`} className="min-h-[64px] sm:min-h-[82px] rounded-xl bg-[#0A0D14]/40 border border-[#182030]/40 opacity-30" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const dayEvents = eventsByDate.get(dateStr) || [];

                return (
                  <div
                    key={dateStr}
                    onClick={() => {
                      sound.playClick();
                      setSelectedDate(dateStr);
                    }}
                    className={`min-h-[64px] sm:min-h-[82px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#182238] border-[#C9A038] shadow-[0_0_12px_rgba(201,160,56,0.2)]'
                        : isToday
                        ? 'bg-[#151D30] border-[#C9A038]/40 hover:border-[#C9A038]'
                        : 'bg-[#0E131F] border-[#1C263B] hover:border-slate-600 hover:bg-[#121828]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                          isToday
                            ? 'bg-[#C9A038] text-slate-950 shadow-sm'
                            : isSelected
                            ? 'text-[#ECC968]'
                            : 'text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold px-1 rounded-full bg-[#1A253D] text-[#ECC968] border border-[#C9A038]/30">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Event Pill Preview on Day */}
                    <div className="space-y-0.5 overflow-hidden">
                      {dayEvents.slice(0, 2).map(evt => (
                        <div
                          key={evt.id}
                          className={`text-[9px] px-1 py-0.5 rounded truncate font-medium flex items-center gap-1 ${
                            evt.type === 'launch'
                              ? 'bg-[#C9A038]/20 text-[#ECC968] border border-[#C9A038]/30'
                              : evt.type === 'payment'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : evt.type === 'hosting'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />
                          <span className="truncate">{evt.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[8px] text-slate-400 block text-right font-medium">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Selected Date Inspector Sidebar (1 col on lg) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="pb-3 border-b border-[#1E2638] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Operations on
                  </span>
                  <h3 className="font-heading font-bold text-sm text-slate-100 mt-0.5">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                </div>

                <span className="text-xs px-2 py-0.5 rounded-full bg-[#182033] text-[#ECC968] font-bold border border-[#C9A038]/30">
                  {selectedDateEvents.length} Item(s)
                </span>
              </div>

              {/* Events on selected day */}
              {selectedDateEvents.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-xl bg-[#0A0D14]/70 border border-[#1A2338] space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-[#151D30] border border-[#232D42] flex items-center justify-center text-[#C9A038]">
                    <CheckCircle2 className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300">No Operations on this Date</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Schedule a launch, task mission, or milestone for this day.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveModal('add-project');
                    }}
                    className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span>Schedule on this Day</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
                  {selectedDateEvents.map(evt => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl border border-[#232D42] bg-[#151C2C] hover:border-[#C9A038]/40 transition-all text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          evt.type === 'launch'
                            ? 'bg-[#C9A038]/20 text-[#ECC968]'
                            : evt.type === 'payment'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : evt.type === 'hosting'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {evt.time}
                        </span>

                        <button
                          onClick={() => openClientHQ(evt.clientId)}
                          className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Client HQ →
                        </button>
                      </div>

                      <div className="font-semibold text-slate-100">{evt.title}</div>
                      
                      <div className="text-[11px] text-[#ECC968] font-medium">
                        Clan Alliance: {evt.client}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setActiveModal('add-project');
              }}
              className="w-full py-2 rounded-xl bg-[#141B2B] hover:bg-[#1A2438] border border-[#232D42] hover:border-[#C9A038]/50 text-xs text-slate-300 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5 text-[#ECC968]" />
              <span>Schedule Operation for this Day</span>
            </button>
          </div>

        </div>
      ) : (
        /* Agenda List View */
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
            <h2 className="font-heading font-bold text-sm text-slate-100">
              Master Scheduled Operations
            </h2>
            <span className="text-xs text-slate-400">{filteredEvents.length} Total Operations</span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0A0D14] border border-[#1E2638] space-y-3">
              <p className="text-xs text-slate-400">No operations found matching current filter.</p>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveModal('add-project');
                }}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Create Operation / Project</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-xl border border-[#232D42] bg-[#151C2C] hover:border-[#C9A038]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0A0D14] border border-[#232D42] text-slate-400 shrink-0">
                      {evt.type === 'launch' ? <Rocket className="w-4 h-4 text-[#C9A038]" /> :
                       evt.type === 'payment' ? <Coins className="w-4 h-4 text-emerald-400" /> :
                       evt.type === 'hosting' ? <Globe className="w-4 h-4 text-sky-400" /> :
                       <Swords className="w-4 h-4 text-purple-400" />}
                    </div>

                    <div>
                      <div className="font-semibold text-slate-100">{evt.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span 
                          onClick={() => openClientHQ(evt.clientId)}
                          className="text-[#ECC968] font-medium hover:underline cursor-pointer"
                        >
                          {evt.client}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {evt.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="font-mono text-xs font-semibold text-slate-200 bg-[#0A0D14] px-2.5 py-1 rounded border border-[#232D42]">
                      {evt.date}
                    </span>

                    <button
                      onClick={() => openClientHQ(evt.clientId)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      Client HQ →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
