import React from 'react';
import {
  Hammer,
  Globe,
  AlertTriangle,
  ExternalLink,
  Plus,
  ShieldAlert,
  Zap,
  Lock,
  Unlock,
  Gem,
  Receipt,
  Send
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const HostingView: React.FC = () => {
  const {
    hostingDomains,
    clients,
    openClientHQ,
    setActiveModal,
    isPerkUnlocked,
    unlockPerk,
    addInvoice,
    addToast
  } = useDashboard();

  const isGuardianUnlocked = isPerkUnlocked('domain_guardian');

  const handleDraftRenewalInvoice = (domainItem: typeof hostingDomains[0]) => {
    sound.playGold();
    addInvoice({
      clientId: domainItem.clientId,
      clientName: domainItem.clientName,
      clientCompany: domainItem.clientName,
      clientEmail: 'billing@client.com',
      projectId: 'p_hosting',
      projectName: `Domain & Hosting Renewal: ${domainItem.domain}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: domainItem.domainExpiryDate || '2027-10-14',
      status: 'Pending',
      subtotal: 180,
      tax: 0,
      totalAmount: 180,
      amountPaid: 0,
      balanceDue: 180,
      items: [
        {
          id: 'item_' + Date.now(),
          description: `Annual Domain Registrar & High-Availability Hosting Renewal (${domainItem.domain})`,
          quantity: 1,
          rate: 180,
          amount: 180
        }
      ]
    });

    addToast({
      title: 'Renewal Invoice Created',
      description: `Drafted $180 annual renewal invoice for ${domainItem.clientName}.`,
      type: 'gold'
    });
  };

  const handleSendRenewalReminder = (domainItem: typeof hostingDomains[0]) => {
    sound.playClick();
    const matchedClient = clients.find(c => c.id === domainItem.clientId);
    const phone = matchedClient?.phone?.replace(/[^0-9]/g, '') || '';
    const text = `Hi ${domainItem.clientName}, automated notice: Your website domain (${domainItem.domain}) is approaching its annual renewal date (${domainItem.domainExpiryDate}). We have prepared your renewal so you experience zero downtime!`;
    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    addToast({
      title: 'Reminder Opened',
      description: `WhatsApp renewal prompt dispatched for ${domainItem.domain}`,
      type: 'gold'
    });
  };

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
            <Hammer className="w-5 h-5 text-[#C9A038]" />
            Builder's Hall: Website Infrastructure
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Domain registrar renewals, cloud hosting servers, and SSL certificates
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModal('add-domain');
          }}
          className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Domain / Server</span>
        </button>
      </div>

      {/* Perk Banner: Domain Guardian */}
      {isGuardianUnlocked ? (
        <div className="p-4 rounded-2xl bg-[#141B2B] border border-[#C9A038]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A038]/20 border border-[#C9A038]/50 flex items-center justify-center text-[#ECC968] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-xs text-slate-100">Domain Guardian & Auto-Renew Dispatcher</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A038]/15 text-[#ECC968] font-bold border border-[#C9A038]/30">UNLOCKED</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Automated expiration monitor with 1-click renewal invoice drafting ($180/yr) & WhatsApp renewal alerts.</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#ECC968] bg-[#0A0D14] px-3 py-1.5 rounded-xl border border-[#232D42] shrink-0">
            Active on all Domains
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A0D14] border border-[#232D42] flex items-center justify-center text-slate-400 shrink-0">
              <Lock className="w-4 h-4 text-[#C9A038]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-xs text-slate-300">Domain Guardian & Auto-Renew Dispatcher</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#151C2C] text-slate-400 border border-[#232D42] font-semibold flex items-center gap-1">
                  <Gem className="w-3 h-3 text-[#ECC968]" /> 15 Gems to Unlock
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Automates tracking registrar expirations and enables 1-click recurring renewal invoice generation for clients.</p>
            </div>
          </div>
          <button
            onClick={() => unlockPerk('domain_guardian')}
            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock (15</span>
            <Gem className="w-3.5 h-3.5 fill-[#ECC968]/40" />
            <span>)</span>
          </button>
        </div>
      )}

      {/* Domain Cards */}
      {hostingDomains.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#182033] border border-[#232D42] flex items-center justify-center text-[#C9A038]">
            <Hammer className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Domains or Servers Monitored</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Connect domains and hosting packages to automatically track SSL health, registrar expirations, and renewal alerts.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('add-domain');
            }}
            className="btn-gold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Connect First Domain</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hostingDomains.map(item => {
          const isDomainWarning = item.daysUntilDomainExpiry <= 30;
          const isHostingWarning = item.daysUntilHostingExpiry <= 14;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    onClick={() => openClientHQ(item.clientId)}
                    className="text-xs font-bold text-[#ECC968] hover:underline cursor-pointer"
                  >
                    {item.clientName} →
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <h3 className="font-heading font-bold text-sm text-slate-100">
                      {item.domain}
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-slate-300 border border-[#232D42]">
                  SSL Active
                </span>
              </div>

              {(isDomainWarning || isHostingWarning) && (
                <div className="p-2.5 rounded-xl bg-[#151C2C] border border-[#C9A038]/30 text-xs text-slate-200 space-y-1">
                  {isDomainWarning && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#C9A038]" />
                      <span>Domain expires in {item.daysUntilDomainExpiry} days ({item.domainExpiryDate})</span>
                    </div>
                  )}
                  {isHostingWarning && (
                    <div className="flex items-center gap-1.5 font-medium text-slate-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hosting renewal in {item.daysUntilHostingExpiry} days ({item.hostingExpiryDate})</span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
                  <span className="text-slate-400 block text-[10px]">Registrar</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{item.domainProvider}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
                  <span className="text-slate-400 block text-[10px]">Hosting</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block truncate">{item.hostingProvider}</span>
                </div>
              </div>

              {/* Domain Guardian 1-Click Operations */}
              {isGuardianUnlocked && (
                <div className="pt-2 border-t border-[#1E2638] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDraftRenewalInvoice(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0A0D14] hover:bg-[#182033] border border-[#232D42] hover:border-[#C9A038]/50 text-slate-300 hover:text-[#ECC968] text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                    title="Draft $180 annual renewal invoice"
                  >
                    <Receipt className="w-3 h-3 text-[#C9A038]" />
                    <span>Draft Renewal ($180)</span>
                  </button>

                  <button
                    onClick={() => handleSendRenewalReminder(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0A0D14] hover:bg-[#182033] border border-[#232D42] hover:border-[#C9A038]/50 text-slate-300 hover:text-[#ECC968] text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                    title="Send WhatsApp renewal alert"
                  >
                    <Send className="w-3 h-3 text-[#C9A038]" />
                    <span>Alert Client</span>
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-[#1E2638] flex items-center justify-between text-xs">
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#ECC968] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visit Website</span>
                </a>

                <button
                  onClick={() => openClientHQ(item.clientId)}
                  className="text-slate-400 hover:text-white"
                >
                  Client HQ →
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

    </div>
  );
};
