import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  ArrowRight,
  Zap,
  Lock,
  Unlock,
  Gem,
  Send,
  ExternalLink
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const CommunicationsView: React.FC = () => {
  const {
    communications,
    clients,
    setActiveModal,
    openClientHQ,
    isPerkUnlocked,
    unlockPerk,
    addToast
  } = useDashboard();

  const isSpeedDialUnlocked = isPerkUnlocked('whatsapp_speed_dial');
  const [targetClientId, setTargetClientId] = useState<string>(clients[0]?.id || '');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const targetClient = clients.find(c => c.id === targetClientId) || clients[0];

  const handleSendWhatsApp = (templateType: 'milestone' | 'invoice' | 'live') => {
    sound.playClick();
    if (!targetClient) {
      addToast({
        title: 'No Client Selected',
        description: 'Recruit or select a client first.',
        type: 'danger'
      });
      return;
    }

    const clientName = targetClient.name || targetClient.company;
    const phone = targetClient.phone?.replace(/[^0-9]/g, '') || '';

    let text = '';
    if (templateType === 'milestone') {
      text = `Hi ${clientName}, greetings from WebCraft! Your website milestone is ready for review. Please take a look and let us know your thoughts.`;
    } else if (templateType === 'invoice') {
      text = `Hi ${clientName}, gentle reminder regarding your website project invoice settlement. Please let us know once transferred so we can update your ledger!`;
    } else {
      text = `Hi ${clientName}, exciting news! Your website is officially live and deployed to production. Thank you for partnering with us!`;
    }

    const url = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
    addToast({
      title: 'WhatsApp Dispatched',
      description: `Opened message for ${targetClient.company}`,
      type: 'gold'
    });
  };

  const types: string[] = ['All', 'WhatsApp', 'Call', 'Meeting', 'Email', 'Internal Note'];

  const filteredComms = communications.filter(c => {
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    const matchSearch = c.summary.toLowerCase().includes(search.toLowerCase()) || c.clientName.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

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
            <MessageSquare className="w-5 h-5 text-[#C9A038]" />
            Messenger Tower: Client Communications
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log of client calls, WhatsApp discussions, meetings, and follow-up commitments
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModal('log-comm');
          }}
          className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Log Communication</span>
        </button>
      </div>

      {/* Perk Banner: WhatsApp Speed Dial */}
      {isSpeedDialUnlocked ? (
        <div className="p-4 rounded-2xl bg-[#141B2B] border border-[#C9A038]/40 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C9A038]/20 border border-[#C9A038]/50 flex items-center justify-center text-[#ECC968] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-xs text-slate-100">WhatsApp Speed Dial Engine</h4>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A038]/15 text-[#ECC968] font-bold border border-[#C9A038]/30">UNLOCKED</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">1-click pre-filled WhatsApp action buttons. Open chats without manual copy-pasting.</p>
              </div>
            </div>

            {clients.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Recipient:</span>
                <select
                  value={targetClientId}
                  onChange={e => setTargetClientId(e.target.value)}
                  className="bg-[#0A0D14] border border-[#232D42] text-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#C9A038]"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.company} ({c.phone || 'No phone'})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-[#1E2638]">
            <button
              onClick={() => handleSendWhatsApp('milestone')}
              className="p-2.5 rounded-xl bg-[#0A0D14] hover:bg-[#151C2C] border border-[#232D42] hover:border-[#C9A038]/50 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-[#ECC968] flex items-center gap-1.5">
                  <Send className="w-3 h-3 text-[#C9A038]" /> Milestone Ready
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ask client for feedback/approval</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ECC968]" />
            </button>

            <button
              onClick={() => handleSendWhatsApp('invoice')}
              className="p-2.5 rounded-xl bg-[#0A0D14] hover:bg-[#151C2C] border border-[#232D42] hover:border-[#C9A038]/50 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-[#ECC968] flex items-center gap-1.5">
                  <Send className="w-3 h-3 text-[#C9A038]" /> Payment Reminder
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Polite milestone invoice follow-up</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ECC968]" />
            </button>

            <button
              onClick={() => handleSendWhatsApp('live')}
              className="p-2.5 rounded-xl bg-[#0A0D14] hover:bg-[#151C2C] border border-[#232D42] hover:border-[#C9A038]/50 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-[#ECC968] flex items-center gap-1.5">
                  <Send className="w-3 h-3 text-[#C9A038]" /> Website Live Celebration
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Congratulate & hand over project</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ECC968]" />
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
                <h4 className="font-heading font-bold text-xs text-slate-300">WhatsApp Speed Dial Engine</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#151C2C] text-slate-400 border border-[#232D42] font-semibold flex items-center gap-1">
                  <Gem className="w-3 h-3 text-[#ECC968]" /> 15 Gems to Unlock
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Unlocks 1-click pre-filled WhatsApp dispatches for milestone feedback, payment reminders, and live handovers.</p>
            </div>
          </div>
          <button
            onClick={() => unlockPerk('whatsapp_speed_dial')}
            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock (15</span>
            <Gem className="w-3.5 h-3.5 fill-[#ECC968]/40" />
            <span>)</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search discussion or client name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#C9A038]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {types.map(t => (
            <button
              key={t}
              onClick={() => { sound.playClick(); setTypeFilter(t); }}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 border transition-all ${
                typeFilter === t
                  ? 'bg-[#182033] text-[#ECC968] border-[#C9A038]/50 font-semibold'
                  : 'bg-[#0A0D14] text-slate-400 hover:text-slate-200 border-[#1E2638]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Communications Feed */}
      {filteredComms.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#182033] border border-[#232D42] flex items-center justify-center text-[#C9A038]">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Communications Logged</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Log phone calls, WhatsApp messages, stakeholder meetings, and actionable commitments directly against your client bases.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('log-comm');
            }}
            className="btn-gold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log First Interaction</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComms.map(comm => (
            <div
              key={comm.id}
              className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/40 transition-all space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span 
                    onClick={() => openClientHQ(comm.clientId)}
                    className="font-bold text-slate-100 hover:text-[#ECC968] cursor-pointer"
                  >
                    {comm.clientName}
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-[#151C2C] text-slate-300 border border-[#232D42]">
                    {comm.type}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">{comm.date}</span>
              </div>

              <p className="font-medium text-slate-200">
                "{comm.summary}"
              </p>

              {comm.keyPoints.length > 0 && (
                <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                  {comm.keyPoints.map((kp, idx) => (
                    <li key={idx}>{kp}</li>
                  ))}
                </ul>
              )}

              {comm.nextAction && (
                <div className="pt-2 border-t border-[#1E2638] flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A038]" />
                    <span><strong>Action:</strong> {comm.nextAction}</span>
                  </div>
                  {comm.nextActionDate && <span>Due: {comm.nextActionDate}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
