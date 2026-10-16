import React, { useState } from 'react';
import {
  Castle,
  ArrowLeft,
  Activity,
  Coins,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  Receipt,
  Swords,
  Library,
  Hammer,
  MessageSquare,
  Globe,
  AlertTriangle,
  FileText,
  Key,
  Edit3,
  UserPlus,
  Zap,
  Gem,
  Unlock,
  ShieldCheck,
  TrendingUp,
  Send,
  Trash2
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';
import { DeleteClientConfirmModal } from '../components/modals/DeleteClientConfirmModal';

export const ClientHQView: React.FC = () => {
  const {
    selectedClientId,
    clients,
    projects,
    tasks,
    invoices,
    transactions,
    documents,
    hostingDomains,
    communications,
    setActiveView,
    updateProjectPhase,
    updateProjectApproval,
    toggleTaskStatus,
    markInvoicePaid,
    formatCurrency,
    setActiveModal,
    updateClient,
    deleteClient,
    addTask,
    addInvoice,
    addToast,
    isPerkUnlocked,
    unlockPerk
  } = useDashboard();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isRadarUnlocked = isPerkUnlocked('client_health_radar');
  const isSpeedDialUnlocked = isPerkUnlocked('whatsapp_speed_dial');

  const client = clients.find(c => c.id === selectedClientId) || clients[0];
  const project = projects.find(p => p.clientId === client?.id) || projects[0];

  const clientTasks = tasks.filter(t => t.clientId === client?.id);
  const clientInvoices = invoices.filter(i => i.clientId === client?.id);
  const clientTransactions = transactions.filter(t => t.clientId === client?.id);
  const clientDocs = documents.filter(d => d.clientId === client?.id);
  const clientHosting = hostingDomains.find(h => h.clientId === client?.id) || hostingDomains[0];
  const clientComms = communications.filter(c => c.clientId === client?.id);

  const [activeTab, setActiveTab] = useState<'all' | 'phases' | 'treasury' | 'tasks' | 'invoices' | 'hosting' | 'comms' | 'docs'>('all');
  const [internalNotes, setInternalNotes] = useState(client?.notes || '');

  const handleDeployRetainer = () => {
    if (!client) return;
    sound.playGold();
    addInvoice({
      clientId: client.id,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      projectId: client.currentProjectId || 'p_retainer',
      projectName: 'Annual Maintenance Retainer',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      subtotal: 1200,
      tax: 0,
      totalAmount: 1200,
      amountPaid: 0,
      balanceDue: 1200,
      items: [
        {
          id: 'item_' + Date.now(),
          description: `Annual Website Maintenance, Cloud Backups & Priority SLA Retainer (12 Months)`,
          quantity: 1,
          rate: 1200,
          amount: 1200
        }
      ]
    });
    addToast({
      title: 'Upsell Invoice Created',
      description: `Drafted $1,200 annual maintenance retainer invoice for ${client.company}.`,
      type: 'gold'
    });
  };

  const handleDeployOptimizationTask = () => {
    if (!client) return;
    sound.playGold();
    addTask({
      clientId: client.id,
      clientName: client.company,
      title: 'Run Core Web Vitals & Speed Optimization',
      priority: 'High',
      status: 'In Progress',
      deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      description: 'Audit Lighthouse performance, compress WebP assets, and reach 95+ Mobile score.',
      xpReward: 350,
      isDailyMission: false,
      estimatedHours: 4,
      actualHours: 0
    });
    addToast({
      title: 'Optimization Mission Deployed',
      description: `Task added to battle board (+350 XP on completion).`,
      type: 'gold'
    });
  };

  const handleDeploySecurityUpsell = () => {
    if (!client) return;
    sound.playGold();
    addInvoice({
      clientId: client.id,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      projectId: client.currentProjectId || 'p_sec',
      projectName: 'Security & Backup Package',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      subtotal: 350,
      tax: 0,
      totalAmount: 350,
      amountPaid: 0,
      balanceDue: 350,
      items: [
        {
          id: 'item_' + Date.now(),
          description: `Annual WAF Cloud Firewall, SSL Monitoring & Daily Encrypted Database Backups`,
          quantity: 1,
          rate: 350,
          amount: 350
        }
      ]
    });
    addToast({
      title: 'Security Package Invoiced',
      description: `Drafted $350 security & backup package for ${client.company}.`,
      type: 'gold'
    });
  };

  const handleClientWhatsApp = (type: 'milestone' | 'invoice' | 'touch') => {
    if (!client) return;
    sound.playClick();
    const phone = client.phone?.replace(/[^0-9]/g, '') || '';
    let msg = '';
    if (type === 'milestone') {
      msg = `Hi ${client.name}, your project milestone for ${client.company} is ready for review!`;
    } else if (type === 'invoice') {
      msg = `Hi ${client.name}, friendly reminder regarding the pending invoice balance for ${client.company}. Let us know once processed!`;
    } else {
      msg = `Hi ${client.name}, checking in from WebCraft on how your website and digital performance are doing!`;
    }
    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (!client) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-12">
        <div className="p-8 text-center rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#182033] border border-[#232D42] flex items-center justify-center text-[#C9A038]">
            <Castle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">No Client Headquarters Selected</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select an existing client from your list or recruit a new client to manage everything in their unified strategic headquarters.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <ReturnButton to="command-center" label="Return to Command Center" />
            <button
              onClick={() => {
                sound.playClick();
                setActiveView('clients');
              }}
              className="btn-dark px-3.5 py-1.5 rounded-xl text-xs font-semibold"
            >
              View All Clients
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal('add-client');
              }}
              className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Recruit Client</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleNotesBlur = () => {
    updateClient(client.id, { notes: internalNotes });
  };

  const paidPercentage = Math.min(100, Math.round((client.amountPaid / client.projectValue) * 100));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <ReturnButton to="clients" label="Back to Clients" />
          <ReturnButton to="command-center" label="Command Center" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => setActiveModal('log-payment')}
            className="btn-gold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>+ Log Payment</span>
          </button>

          <button
            onClick={() => setActiveModal('add-invoice')}
            className="btn-dark px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>+ Create Invoice</span>
          </button>

          <button
            onClick={() => setActiveModal('add-task')}
            className="btn-dark px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>+ Add Task</span>
          </button>

          <button
            onClick={() => setActiveModal('log-comm')}
            className="btn-dark px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>+ Log Comm</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsDeleteModalOpen(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 bg-[#251218] hover:bg-[#341620] text-[#EF4444] border border-[#EF4444]/30 hover:border-[#EF4444]/60 transition-all font-semibold"
            title="Permanently Delete Client & All Records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Client</span>
          </button>
        </div>
      </div>

      {/* Client HQ Header Banner */}
      <div className="rounded-2xl bg-[#121826] border border-[#20293D] p-4 sm:p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 w-full lg:w-auto">
            <img
              src={client.avatar}
              alt={client.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#232D42] shrink-0"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading break-words">
                  {client.company}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#151C2C] text-slate-300 border border-[#232D42] font-semibold">
                  Base #{client.id.toUpperCase()}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A038]/10 text-[#ECC968] border border-[#C9A038]/30 font-semibold">
                  {client.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Contact: <strong className="text-slate-200">{client.name}</strong> · Joined {client.joinedDate}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 hover:text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{client.email}</span>
                </a>
                <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 hover:text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{client.phone}</span>
                </a>
                {client.website && (
                  <a href={client.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-200">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>{client.website.replace('https://', '')}</span>
                  </a>
                )}
              </div>

              {/* Speed Dial Perk: Direct Client Actions */}
              {isSpeedDialUnlocked && (
                <div className="flex flex-wrap items-center gap-2 pt-2.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#C9A038]" /> Speed Dial:
                  </span>
                  <button
                    onClick={() => handleClientWhatsApp('milestone')}
                    className="px-2 py-0.5 rounded-lg bg-[#0A0D14] hover:bg-[#151C2C] text-[#ECC968] border border-[#232D42] text-[10px] font-semibold flex items-center gap-1 transition-all"
                  >
                    <Send className="w-2.5 h-2.5 text-[#C9A038]" /> Milestone Ready
                  </button>
                  <button
                    onClick={() => handleClientWhatsApp('invoice')}
                    className="px-2 py-0.5 rounded-lg bg-[#0A0D14] hover:bg-[#151C2C] text-[#ECC968] border border-[#232D42] text-[10px] font-semibold flex items-center gap-1 transition-all"
                  >
                    <Send className="w-2.5 h-2.5 text-[#C9A038]" /> Invoice Alert
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Client Relationship Health Meter */}
          <div className="p-4 rounded-xl bg-[#151C2C] border border-[#232D42] w-full lg:w-72">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-400" />
                Relationship Health
              </span>
              <span className="font-semibold text-slate-200">
                {client.healthScore}% · {client.healthStatus}
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#0A0D14] rounded-full overflow-hidden border border-[#232D42]">
              <div
                className="h-full bg-[#C9A038] rounded-full"
                style={{ width: `${client.healthScore}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
              <span>Payment Reliability: <strong className="text-slate-200">High</strong></span>
              <span>Revisions: <strong className="text-slate-200">{project?.revisionsCount || 0}/3</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* Perk Banner / Feature: VIP Client Health Radar & Upsell Recommender */}
      {isRadarUnlocked ? (
        <div className="p-5 rounded-2xl bg-[#141B2B] border border-[#C9A038]/40 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C9A038]/20 border border-[#C9A038]/50 flex items-center justify-center text-[#ECC968] shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-xs text-slate-100">VIP Client Health Radar & Upsell Recommender</h4>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A038]/15 text-[#ECC968] font-bold border border-[#C9A038]/30">UNLOCKED</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Automated high-margin account expansion proposals tailored for {client.company}.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#0A0D14] border border-[#232D42] text-slate-300 font-medium">
                Retention Risk: <strong className="text-emerald-400">Minimal</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0A0D14] border border-[#232D42] text-slate-300 font-medium">
                Loyalty Index: <strong className="text-[#ECC968]">96/100</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-[#1E2638]">
            <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#232D42] flex flex-col justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#ECC968] block">High-Value Retainer</span>
                <h5 className="font-heading font-bold text-xs text-slate-100 mt-0.5">Annual SLA & Support Retainer</h5>
                <p className="text-[11px] text-slate-400 mt-1">12-month contract: 4hrs monthly updates, daily backups, uptime SLA.</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#182033]">
                <span className="font-mono text-xs font-bold text-[#ECC968]">$1,200/yr</span>
                <button
                  onClick={handleDeployRetainer}
                  className="btn-gold px-2.5 py-1 rounded-lg text-[10px] font-bold"
                >
                  + Draft Invoice
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#232D42] flex flex-col justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#ECC968] block">Speed & SEO Package</span>
                <h5 className="font-heading font-bold text-xs text-slate-100 mt-0.5">Core Web Vitals Sprint</h5>
                <p className="text-[11px] text-slate-400 mt-1">Boost mobile speed to 95+ score, compress WebP assets, lazy loading.</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#182033]">
                <span className="font-mono text-xs font-bold text-[#ECC968]">$450 one-off</span>
                <button
                  onClick={handleDeployOptimizationTask}
                  className="btn-gold px-2.5 py-1 rounded-lg text-[10px] font-bold"
                >
                  + Deploy Mission
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#232D42] flex flex-col justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#ECC968] block">Infrastructure</span>
                <h5 className="font-heading font-bold text-xs text-slate-100 mt-0.5">Cloud Firewall & Security</h5>
                <p className="text-[11px] text-slate-400 mt-1">Managed Cloudflare WAF, SSL security monitoring, and automated database backups.</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#182033]">
                <span className="font-mono text-xs font-bold text-[#ECC968]">$350/yr</span>
                <button
                  onClick={handleDeploySecurityUpsell}
                  className="btn-gold px-2.5 py-1 rounded-lg text-[10px] font-bold"
                >
                  + Draft Invoice
                </button>
              </div>
            </div>
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
                <h4 className="font-heading font-bold text-xs text-slate-300">VIP Client Health Radar & Upsell Recommender</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#151C2C] text-slate-400 border border-[#232D42] font-semibold flex items-center gap-1">
                  <Gem className="w-3 h-3 text-[#ECC968]" /> 25 Gems to Unlock
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Unlocks AI health diagnostics, retention risk meters, and 1-click high-margin upsell proposals ($1,200 retainer, $450 speed boost).</p>
            </div>
          </div>
          <button
            onClick={() => unlockPerk('client_health_radar')}
            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock (25</span>
            <Gem className="w-3.5 h-3.5 fill-[#ECC968]/40" />
            <span>)</span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#1E2638] pb-2 overflow-x-auto no-scrollbar text-xs">
        {[
          { id: 'all', label: 'All-In-One Overview' },
          { id: 'phases', label: '11-Phase Project Path' },
          { id: 'treasury', label: 'Treasury & Gold' },
          { id: 'tasks', label: `Battle Tasks (${clientTasks.length})` },
          { id: 'invoices', label: `Invoices (${clientInvoices.length})` },
          { id: 'hosting', label: "Builder's Hall" },
          { id: 'comms', label: `Messenger Tower (${clientComms.length})` },
          { id: 'docs', label: `Clan Library (${clientDocs.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id as any);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all border ${
              activeTab === tab.id
                ? 'bg-[#182033] text-[#ECC968] border-[#C9A038]/50 font-semibold'
                : 'bg-[#121826] text-slate-400 hover:text-slate-200 border-[#20293D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1: 11-Phase Project Base Progression Path */}
      {(activeTab === 'all' || activeTab === 'phases') && project && (
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Project Base · {project.websiteType}
              </span>
              <h2 className="text-base font-bold text-slate-100 font-heading mt-0.5">
                {project.name}
              </h2>
              <p className="text-xs text-slate-400">
                Launch Target: <strong className="text-slate-200">{project.expectedLaunch}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {project.previewUrl && (
                <a
                  href={project.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#151C2C] hover:bg-[#1A2337] text-slate-300 border border-[#232D42] text-xs font-semibold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </a>
              )}

              {project.currentPhaseIndex < 10 && (
                <button
                  onClick={() => updateProjectPhase(project.id, project.currentPhaseIndex + 1)}
                  className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <span>Advance Phase (+350 XP)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Stepper */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>
                Stage {project.currentPhaseIndex + 1}/11: <strong className="text-slate-200">{project.phases[project.currentPhaseIndex]?.name}</strong>
              </span>
              <span className="font-semibold text-slate-300">{project.completionPercentage}% Complete</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5">
              {project.phases.map((ph, idx) => {
                const isCompleted = idx < project.currentPhaseIndex;
                const isCurrent = idx === project.currentPhaseIndex;

                return (
                  <div
                    key={ph.id}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isCompleted
                        ? 'bg-[#151C2C] border-[#C9A038]/30 text-slate-300'
                        : isCurrent
                        ? 'bg-[#182033] border-[#C9A038] text-[#ECC968] font-semibold'
                        : 'bg-[#0E121C] border-[#1A2234] text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A038]" />
                      ) : isCurrent ? (
                        <div className="w-2 h-2 rounded-full bg-[#C9A038]" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                    <div className="text-[10px] font-medium line-clamp-1">{idx + 1}. {ph.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approval Controls */}
          <div className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Approval Status:</span>
              <select
                value={project.approvalStatus}
                onChange={e => updateProjectApproval(project.id, e.target.value as any)}
                className="bg-[#0A0D14] border border-[#232D42] text-slate-200 rounded px-2 py-0.5 text-xs outline-none"
              >
                <option value="Approved">Approved by Client</option>
                <option value="In Review">In Review</option>
                <option value="Revision Requested">Revision Requested</option>
              </select>
            </div>

            <div className="text-slate-400 text-xs">
              Revisions: <strong className="text-slate-200">{project.revisionsCount} / {project.maxRevisions}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Treasury / Financials */}
      {(activeTab === 'all' || activeTab === 'treasury') && (
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#C9A038]" />
              <h3 className="font-heading font-bold text-sm text-slate-100">
                Client Treasury & Balances
              </h3>
            </div>

            <button
              onClick={() => setActiveModal('log-payment')}
              className="btn-gold px-3 py-1 rounded-lg text-xs font-semibold"
            >
              + Log Payment
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Contract</span>
              <div className="text-lg font-bold text-slate-100 font-heading mt-0.5">
                {formatCurrency(client.projectValue)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Collected (Paid)</span>
              <div className="text-lg font-bold text-[#ECC968] font-heading mt-0.5">
                {formatCurrency(client.amountPaid)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Pending Loot</span>
              <div className="text-lg font-bold text-slate-300 font-heading mt-0.5">
                {formatCurrency(client.amountPending)}
              </div>
            </div>
          </div>

          {clientTransactions.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">Payment History</h4>
              <div className="divide-y divide-[#1E2638] rounded-xl border border-[#232D42] overflow-hidden bg-[#151C2C] text-xs">
                {clientTransactions.map(tx => (
                  <div key={tx.id} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-200">{tx.type}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {tx.date} · {tx.method} · Ref: <span className="font-mono">{tx.referenceNo}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#ECC968]">
                      +{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 3: Tasks */}
      {(activeTab === 'all' || activeTab === 'tasks') && (
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              <Swords className="w-4 h-4 text-slate-400" />
              Missions & Tasks ({clientTasks.length})
            </h3>
            <button
              onClick={() => setActiveModal('add-task')}
              className="btn-dark px-3 py-1 rounded-lg text-xs"
            >
              + Add Task
            </button>
          </div>

          <div className="space-y-2">
            {clientTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No tasks assigned to this client.</p>
            ) : (
              clientTasks.map(t => {
                const isCompleted = t.status === 'Completed';
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleTaskStatus(t.id)}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#232D42] bg-[#151C2C] hover:border-[#C9A038]/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${
                        isCompleted ? 'bg-[#C9A038] text-slate-950 font-bold' : 'border border-slate-600'
                      }`}>
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.title}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400">Due {t.deadline}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Section 4: Invoices */}
      {(activeTab === 'all' || activeTab === 'invoices') && (
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" />
              Invoices & Billing ({clientInvoices.length})
            </h3>
            <button
              onClick={() => setActiveModal('add-invoice')}
              className="btn-gold px-3 py-1 rounded-lg text-xs"
            >
              + Create Invoice
            </button>
          </div>

          <div className="divide-y divide-[#1E2638] border border-[#232D42] rounded-xl overflow-hidden bg-[#151C2C] text-xs">
            {clientInvoices.map(inv => (
              <div key={inv.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 font-mono">{inv.invoiceNumber}</span>
                    <span className="text-[10px] text-slate-400">{inv.status}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Due {inv.dueDate}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-100">{formatCurrency(inv.totalAmount)}</span>
                  {inv.status !== 'Paid' && (
                    <button
                      onClick={() => markInvoicePaid(inv.id)}
                      className="btn-gold px-2.5 py-1 rounded text-[11px]"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5: Builder's Hall (Hosting & Domain) */}
      {(activeTab === 'all' || activeTab === 'hosting') && clientHosting && (
        <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              <Hammer className="w-4 h-4 text-slate-400" />
              Builder's Hall: Website Infrastructure
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">SSL: Active</span>
          </div>

          {(clientHosting.daysUntilDomainExpiry <= 30 || clientHosting.daysUntilHostingExpiry <= 14) && (
            <div className="p-3 rounded-xl bg-[#151C2C] border border-[#C9A038]/30 text-xs text-slate-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C9A038] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#ECC968]">Renewal Alert:</strong> Domain expires in {clientHosting.daysUntilDomainExpiry} days on {clientHosting.domainProvider}.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
              <span className="text-slate-400 block text-[10px]">Domain</span>
              <span className="font-semibold text-slate-200 mt-0.5 block truncate">{clientHosting.domain}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
              <span className="text-slate-400 block text-[10px]">Hosting</span>
              <span className="font-semibold text-slate-200 mt-0.5 block truncate">{clientHosting.hostingProvider}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
              <span className="text-slate-400 block text-[10px]">Database</span>
              <span className="font-semibold text-slate-200 mt-0.5 block truncate">{clientHosting.database}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#151C2C] border border-[#232D42]">
              <span className="text-slate-400 block text-[10px]">Maintenance</span>
              <span className="font-semibold text-slate-200 mt-0.5 block truncate">{clientHosting.maintenanceStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* Section 6: Notes */}
      <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-2">
        <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-slate-400" />
          Client Strategic Notes
        </h3>
        <textarea
          rows={3}
          value={internalNotes}
          onChange={e => setInternalNotes(e.target.value)}
          onBlur={handleNotesBlur}
          placeholder="Client preferences, payment behavior, technical requirements..."
          className="w-full p-3 rounded-xl bg-[#0A0D14] border border-[#232D42] text-xs text-slate-200 outline-none focus:border-[#C9A038]"
        />
        <span className="text-[10px] text-slate-500">Auto-saved to local storage.</span>
      </div>

      {/* Delete Client Confirmation Modal */}
      <DeleteClientConfirmModal
        isOpen={isDeleteModalOpen}
        client={client}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteClient(client.id);
          setIsDeleteModalOpen(false);
        }}
      />

    </div>
  );
};
