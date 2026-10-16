import React, { useState } from 'react';
import {
  Swords,
  X,
  Building2,
  User,
  Phone,
  Shield,
  Layers,
  Globe,
  ShoppingCart,
  Palette,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { sound } from '../../utils/audio';
import { Client } from '../../types';

export const RecruitClientModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    addClient,
    openClientHQ,
    setActiveView
  } = useDashboard();

  // Clean 3-field structured state
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Website']);
  const [recruitedClient, setRecruitedClient] = useState<Client | null>(null);

  if (activeModal !== 'add-client') return null;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
    setCompany('');
    setContactPerson('');
    setPhone('');
    setSelectedClasses(['Website']);
    setRecruitedClient(null);
  };

  const toggleClass = (classId: string) => {
    sound.playClick();
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(c => c !== classId)
        : [...prev, classId]
    );
  };

  const handleRecruit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCompany = company.trim();
    if (!trimmedCompany) return;

    const contactName = contactPerson.trim() || trimmedCompany;
    const isUrgent = selectedClasses.includes('Urgent');

    try {
      sound.playUpgrade();
    } catch {
      // Safe fallback
    }

    // Immediately create client in system
    const newClient = addClient({
      name: contactName,
      company: trimmedCompany,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: `${contactName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}@${trimmedCompany.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
      phone: phone.trim() || '+91 98000 00000',
      website: `https://${trimmedCompany.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
      status: 'Active',
      projectValue: 0, // Contract set later inside Client HQ
      amountPaid: 0,
      amountPending: 0,
      nextDeadline: 'To be scheduled',
      lastCommunication: 'Recruited today',
      healthScore: 95,
      healthStatus: 'Excellent',
      priority: isUrgent ? 'High' : 'Medium',
      tags: selectedClasses.length > 0 ? selectedClasses : ['Website'],
      notes: 'Recruited into citadel. Configure scope & contract in Client HQ.',
      billingAddress: 'India',
    });

    setRecruitedClient(newClient);
  };

  const handleViewClient = () => {
    if (!recruitedClient) return;
    sound.playClick();
    openClientHQ(recruitedClient.id);
    handleClose();
  };

  const handleStartProject = () => {
    if (!recruitedClient) return;
    sound.playClick();
    openClientHQ(recruitedClient.id);
    setActiveView('client-hq');
    handleClose();
  };

  const quickClassOptions = [
    { id: 'Website', label: 'Website', icon: <Globe className="w-3 h-3" /> },
    { id: 'E-commerce', label: 'E-commerce', icon: <ShoppingCart className="w-3 h-3" /> },
    { id: 'Design', label: 'Design', icon: <Palette className="w-3 h-3" /> },
    { id: 'Urgent', label: 'Urgent', icon: <Zap className="w-3 h-3" /> },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md bg-gradient-to-b from-[#141A29] via-[#0E131F] to-[#0A0D14] border border-[#232D42] hover:border-[#C9A038]/40 rounded-2xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle fantasy top highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C9A038] to-[#8B5CF6]/50" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#1E2638] flex items-start justify-between bg-[#111726]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#182033] border border-[#C9A038]/40 flex items-center justify-center text-[#ECC968] shadow-sm shrink-0">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                Recruit Client
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Add a new ally to your kingdom
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5">
          {!recruitedClient ? (
            /* Fast 3-Field Structured Form */
            <form onSubmit={handleRecruit} className="space-y-3.5">
              
              {/* FIELD 1 — COMPANY / BRAND (Full width, required) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  COMPANY / BRAND <span className="text-[#ECC968]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Apex Digital"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090C14] border border-[#232D42] focus:border-[#C9A038] focus:ring-1 focus:ring-[#C9A038]/30 text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* FIELD 2 + 3 — CONTACT (Side-by-side on desktop, stacked on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    CONTACT PERSON
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={e => setContactPerson(e.target.value)}
                      placeholder="Rohan Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090C14] border border-[#232D42] focus:border-[#C9A038] focus:ring-1 focus:ring-[#C9A038]/30 text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    PHONE / WHATSAPP
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090C14] border border-[#232D42] focus:border-[#C9A038] focus:ring-1 focus:ring-[#C9A038]/30 text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* QUICK CLASS (Compact selectable chips) */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                  QUICK CLASS
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickClassOptions.map(opt => {
                    const isSelected = selectedClasses.includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => toggleClass(opt.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all select-none ${
                          isSelected
                            ? 'bg-[#C9A038]/15 text-[#ECC968] border border-[#C9A038]/50 shadow-sm font-semibold'
                            : 'bg-[#0E131F] text-slate-400 border border-[#20293D] hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#1E2638]/60 mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-[#151C2C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!company.trim()}
                  className="btn-gold px-5 py-2.5 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center gap-2 uppercase disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-[#C9A038]/20 transition-all"
                >
                  <Swords className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Recruit Client</span>
                </button>
              </div>
            </form>
          ) : (
            /* Short Success State */
            <div className="space-y-4 py-2 text-center animate-fadeIn">
              <div className="w-11 h-11 rounded-2xl bg-[#C9A038]/10 border border-[#C9A038]/40 flex items-center justify-center text-[#ECC968] mx-auto shadow-md">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-slate-100 tracking-wide flex items-center justify-center gap-2">
                  <Swords className="w-4 h-4 text-[#ECC968]" />
                  <span>CLIENT RECRUITED</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  <span className="text-[#ECC968] font-semibold">{recruitedClient.company}</span> has joined your kingdom.
                </p>
              </div>

              {/* Contact summary if provided */}
              {(recruitedClient.name || phone.trim()) && (
                <div className="p-3 rounded-xl bg-[#090C14] border border-[#1E2638] text-xs text-slate-300 space-y-1.5 text-left max-w-xs mx-auto">
                  {recruitedClient.name && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👤</span>
                      <span className="text-slate-200 font-medium">{recruitedClient.name}</span>
                    </div>
                  )}
                  {phone.trim() && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📱</span>
                      <span className="text-slate-300 font-mono text-[11px]">{phone.trim()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Outcome Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartProject}
                  className="btn-gold px-4 py-2 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Start Project</span>
                </button>
                <button
                  type="button"
                  onClick={handleViewClient}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#151C2C] border border-[#232D42] text-slate-200 hover:text-white hover:border-[#C9A038]/50 transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-[#ECC968]" />
                  <span>View Client</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
