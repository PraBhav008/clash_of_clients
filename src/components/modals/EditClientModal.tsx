import React, { useState } from 'react';
import {
  X,
  Pencil,
  Save,
  Plus,
  Trash2,
  User,
  Building2,
  Mail,
  Globe,
  Activity,
  Coins,
  Tag,
  FileText,
  FolderGit2,
  Receipt,
  Swords,
  Library,
  RefreshCw,
  Eraser
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Client,
  ClientStatus,
  PriorityLevel,
  Project,
  HostingDomain,
  Task,
  Invoice,
  PaymentTransaction,
  DocumentItem,
  Communication
} from '../../types';
import { sound } from '../../utils/audio';
import { ClientAvatar } from '../common/ClientAvatar';
import {
  EditProjectsTab,
  EditHostingTab,
  EditBillingTab,
  EditTasksTab,
  EditDocsAndCommsTab,
  modalInputCls,
  modalLabelCls
} from './EditClientRelatedTabs';

interface EditClientModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
}

type EditTab = 'profile' | 'projects' | 'hosting' | 'billing' | 'tasks' | 'docs_comms';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
];

const QUICK_TAGS = ['Website', 'E-commerce', 'Design', 'Urgent', 'SaaS', 'VIP', 'Retainer'];

const inferHealthStatus = (score: number): Client['healthStatus'] => {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 40) return 'Needs Attention';
  return 'At Risk';
};

export const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, client, onClose }) => {
  if (!isOpen || !client) return null;
  return <EditClientModalBody key={client.id} client={client} onClose={onClose} />;
};

const EditClientModalBody: React.FC<{ client: Client; onClose: () => void }> = ({ client, onClose }) => {
  const {
    projects,
    hostingDomains,
    tasks,
    invoices,
    transactions,
    documents,
    communications,
    saveClientBundle,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<EditTab>('profile');
  const [clientDraft, setClientDraft] = useState<Client>(() => ({
    ...client,
    tags: [...(client.tags || [])],
  }));
  const [projectsDraft, setProjectsDraft] = useState<Project[]>(() =>
    projects
      .filter(p => p.clientId === client.id)
      .map(p => ({ ...p, phases: p.phases.map(ph => ({ ...ph })) }))
  );
  const [hostingDraft, setHostingDraft] = useState<HostingDomain[]>(() =>
    hostingDomains.filter(h => h.clientId === client.id).map(h => ({ ...h }))
  );
  const [tasksDraft, setTasksDraft] = useState<Task[]>(() =>
    tasks.filter(t => t.clientId === client.id).map(t => ({ ...t }))
  );
  const [invoicesDraft, setInvoicesDraft] = useState<Invoice[]>(() =>
    invoices
      .filter(i => i.clientId === client.id)
      .map(i => ({ ...i, items: i.items.map(it => ({ ...it })) }))
  );
  const [transactionsDraft, setTransactionsDraft] = useState<PaymentTransaction[]>(() =>
    transactions.filter(tx => tx.clientId === client.id).map(tx => ({ ...tx }))
  );
  const [documentsDraft, setDocumentsDraft] = useState<DocumentItem[]>(() =>
    documents
      .filter(d => d.clientId === client.id)
      .map(d => ({
        ...d,
        credentialData: d.credentialData ? { ...d.credentialData } : undefined,
      }))
  );
  const [commsDraft, setCommsDraft] = useState<Communication[]>(() =>
    communications
      .filter(c => c.clientId === client.id)
      .map(c => ({ ...c, keyPoints: [...(c.keyPoints || [])] }))
  );
  const [newTag, setNewTag] = useState('');

  const patchClient = (patch: Partial<Client>) => {
    setClientDraft(prev => ({ ...prev, ...patch }));
  };

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd ?? newTag).trim();
    if (!val) return;
    if (!clientDraft.tags.includes(val)) {
      patchClient({ tags: [...clientDraft.tags, val] });
    }
    if (tagToAdd === undefined) setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    sound.playClick();
    patchClient({ tags: clientDraft.tags.filter(t => t !== tag) });
  };

  const handleFinancialChange = (field: 'projectValue' | 'amountPaid', val: number) => {
    const nextVal = Math.max(0, val);
    const oldExpectedPending = Math.max(0, (clientDraft.projectValue || 0) - (clientDraft.amountPaid || 0));
    const wasAutoSynced = clientDraft.amountPending === oldExpectedPending;
    const nextProjVal = field === 'projectValue' ? nextVal : clientDraft.projectValue;
    const nextPaid = field === 'amountPaid' ? nextVal : clientDraft.amountPaid;
    patchClient({
      [field]: nextVal,
      ...(wasAutoSynced ? { amountPending: Math.max(0, nextProjVal - nextPaid) } : {}),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientDraft.company.trim()) {
      setActiveTab('profile');
      return;
    }

    saveClientBundle({
      client: clientDraft,
      projects: projectsDraft,
      hostingDomains: hostingDraft,
      tasks: tasksDraft,
      invoices: invoicesDraft,
      transactions: transactionsDraft,
      documents: documentsDraft,
      communications: commsDraft.map(c => ({
        ...c,
        keyPoints: c.keyPoints.map(k => k.trim()).filter(Boolean),
      })),
    });
    onClose();
  };

  const tabs: { id: EditTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Client Profile', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'projects', label: `Projects (${projectsDraft.length})`, icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { id: 'hosting', label: `Domains & Hosting (${hostingDraft.length})`, icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'billing', label: `Invoices & Payments (${invoicesDraft.length + transactionsDraft.length})`, icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'tasks', label: `Tasks (${tasksDraft.length})`, icon: <Swords className="w-3.5 h-3.5" /> },
    { id: 'docs_comms', label: `Docs & Comms (${documentsDraft.length + commsDraft.length})`, icon: <Library className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
    >
      <form
        onSubmit={handleSave}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#131A2B] via-[#0E1422] to-[#0A0D14] border border-cyan-500/40 rounded-2xl shadow-[0_0_55px_-10px_rgba(34,211,238,0.28)] overflow-hidden relative flex flex-col"
      >
        {/* Glowing Cyan Top Highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-sky-400" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E2638] bg-[#111828]/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <ClientAvatar
              src={clientDraft.avatar}
              name={clientDraft.name}
              company={clientDraft.company}
              className="w-11 h-11 rounded-xl"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-bold text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate">
                  <Pencil className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">Edit Client: {clientDraft.company || 'Unnamed'}</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  #{clientDraft.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Update, add, or delete any client field, tag, project, domain, invoice, payment, task, doc, or log
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-[#1E2638] bg-[#0B0F19] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 border transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                  : 'bg-[#121826] text-slate-400 hover:text-slate-200 border-[#20293D]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Section: Identity & Avatar */}
              <div className="p-4 rounded-xl bg-[#0D121E] border border-[#202A40] space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Identity & Avatar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={modalLabelCls}>Company / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={clientDraft.company}
                      onChange={e => patchClient({ company: e.target.value })}
                      placeholder="Apex Digital"
                      className={modalInputCls}
                    />
                  </div>
                  <div>
                    <label className={modalLabelCls}>Contact Person</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={clientDraft.name}
                        onChange={e => patchClient({ name: e.target.value })}
                        placeholder="Rohan Sharma"
                        className={modalInputCls}
                      />
                      {clientDraft.name && (
                        <button
                          type="button"
                          onClick={() => patchClient({ name: '' })}
                          className="px-2 rounded-lg bg-[#151C2C] text-slate-400 hover:text-rose-400 border border-[#232D42]"
                          title="Clear contact name"
                        >
                          <Eraser className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={modalLabelCls}>Avatar Image URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={clientDraft.avatar}
                      onChange={e => patchClient({ avatar: e.target.value })}
                      placeholder="https://... (leave empty for initials badge)"
                      className={modalInputCls}
                    />
                    {clientDraft.avatar && (
                      <button
                        type="button"
                        onClick={() => patchClient({ avatar: '' })}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    <span className="text-[10px] text-slate-500">Presets:</span>
                    {AVATAR_PRESETS.map((url, i) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => patchClient({ avatar: url })}
                        className={`rounded-lg p-0.5 border transition-all ${
                          clientDraft.avatar === url ? 'border-cyan-400' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={`Preset Avatar ${i + 1}`}
                      >
                        <img src={url} alt={`Preset ${i + 1}`} className="w-7 h-7 rounded-md object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section: Contact & Web */}
              <div className="p-4 rounded-xl bg-[#0D121E] border border-[#202A40] space-y-3">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Contact, Website & Billing Address
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={modalLabelCls}>Email Address</label>
                    <div className="flex gap-1.5">
                      <input
                        type="email"
                        value={clientDraft.email}
                        onChange={e => patchClient({ email: e.target.value })}
                        placeholder="client@company.com"
                        className={modalInputCls}
                      />
                      {clientDraft.email && (
                        <button
                          type="button"
                          onClick={() => patchClient({ email: '' })}
                          className="px-2 rounded-lg bg-[#151C2C] text-slate-400 hover:text-rose-400 border border-[#232D42]"
                          title="Clear email"
                        >
                          <Eraser className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Phone / WhatsApp</label>
                    <div className="flex gap-1.5">
                      <input
                        type="tel"
                        value={clientDraft.phone}
                        onChange={e => patchClient({ phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={modalInputCls}
                      />
                      {clientDraft.phone && (
                        <button
                          type="button"
                          onClick={() => patchClient({ phone: '' })}
                          className="px-2 rounded-lg bg-[#151C2C] text-slate-400 hover:text-rose-400 border border-[#232D42]"
                          title="Clear phone"
                        >
                          <Eraser className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Website URL</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={clientDraft.website || ''}
                        onChange={e => patchClient({ website: e.target.value || undefined })}
                        placeholder="https://company.com"
                        className={modalInputCls}
                      />
                      {clientDraft.website && (
                        <button
                          type="button"
                          onClick={() => patchClient({ website: undefined })}
                          className="px-2 rounded-lg bg-[#151C2C] text-slate-400 hover:text-rose-400 border border-[#232D42]"
                          title="Remove website"
                        >
                          <Eraser className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Billing Address</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={clientDraft.billingAddress}
                        onChange={e => patchClient({ billingAddress: e.target.value })}
                        placeholder="Street, City, State, Country"
                        className={modalInputCls}
                      />
                      {clientDraft.billingAddress && (
                        <button
                          type="button"
                          onClick={() => patchClient({ billingAddress: '' })}
                          className="px-2 rounded-lg bg-[#151C2C] text-slate-400 hover:text-rose-400 border border-[#232D42]"
                          title="Clear billing address"
                        >
                          <Eraser className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Status, Priority, Health & Timeline */}
              <div className="p-4 rounded-xl bg-[#0D121E] border border-[#202A40] space-y-3">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Status, Health & Timeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className={modalLabelCls}>Client Status</label>
                    <select
                      value={clientDraft.status}
                      onChange={e => patchClient({ status: e.target.value as ClientStatus })}
                      className={modalInputCls}
                    >
                      <option value="Active">Active</option>
                      <option value="Waiting">Waiting</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Payment Pending">Payment Pending</option>
                      <option value="At Risk">At Risk</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Priority Level</label>
                    <select
                      value={clientDraft.priority}
                      onChange={e => patchClient({ priority: e.target.value as PriorityLevel })}
                      className={modalInputCls}
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Health Status</label>
                    <select
                      value={clientDraft.healthStatus}
                      onChange={e => patchClient({ healthStatus: e.target.value as Client['healthStatus'] })}
                      className={modalInputCls}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Needs Attention">Needs Attention</option>
                      <option value="At Risk">At Risk</option>
                    </select>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Health Score (0–100)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={clientDraft.healthScore}
                        onChange={e => {
                          const score = Number(e.target.value);
                          patchClient({ healthScore: score, healthStatus: inferHealthStatus(score) });
                        }}
                        className="w-full accent-cyan-400"
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={clientDraft.healthScore}
                        onChange={e => {
                          const score = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                          patchClient({ healthScore: score, healthStatus: inferHealthStatus(score) });
                        }}
                        className="w-14 px-2 py-1 rounded-lg bg-[#090C14] border border-[#232D42] text-xs text-center text-slate-100 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className={modalLabelCls}>Joined Date</label>
                    <input
                      type="date"
                      value={clientDraft.joinedDate}
                      onChange={e => patchClient({ joinedDate: e.target.value })}
                      className={modalInputCls}
                    />
                  </div>
                  <div>
                    <label className={modalLabelCls}>Next Deadline / Launch</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={clientDraft.nextDeadline}
                        onChange={e => patchClient({ nextDeadline: e.target.value })}
                        placeholder="YYYY-MM-DD or text"
                        className={modalInputCls}
                      />
                      <input
                        type="date"
                        value={/^\d{4}-\d{2}-\d{2}$/.test(clientDraft.nextDeadline) ? clientDraft.nextDeadline : ''}
                        onChange={e => patchClient({ nextDeadline: e.target.value })}
                        className="w-8 px-1 rounded-lg bg-[#090C14] border border-[#232D42] text-xs text-slate-300 cursor-pointer shrink-0"
                        title="Pick deadline date"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Last Communication</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={clientDraft.lastCommunication}
                        onChange={e => patchClient({ lastCommunication: e.target.value })}
                        placeholder="e.g. Today, Call on Nov 10"
                        className={modalInputCls}
                      />
                      <button
                        type="button"
                        onClick={() => patchClient({ lastCommunication: new Date().toISOString().split('T')[0] })}
                        className="px-2 rounded-lg bg-[#151C2C] text-cyan-300 hover:text-cyan-200 border border-[#232D42] text-[10px] font-semibold shrink-0"
                        title="Set to today"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={modalLabelCls}>Current Primary Project</label>
                    <select
                      value={clientDraft.currentProjectId || ''}
                      onChange={e => patchClient({ currentProjectId: e.target.value || undefined })}
                      className={modalInputCls}
                    >
                      <option value="">None / Unassigned</option>
                      {projectsDraft.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Contract Financials */}
              <div className="p-4 rounded-xl bg-[#0D121E] border border-[#202A40] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5" /> Contract Financials
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      patchClient({
                        amountPending: Math.max(0, (clientDraft.projectValue || 0) - (clientDraft.amountPaid || 0)),
                      })
                    }
                    className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" /> Sync Pending (Total − Paid)
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={modalLabelCls}>Contract Value (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={clientDraft.projectValue}
                      onChange={e => handleFinancialChange('projectValue', Number(e.target.value) || 0)}
                      className={modalInputCls}
                    />
                  </div>
                  <div>
                    <label className={modalLabelCls}>Amount Paid (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={clientDraft.amountPaid}
                      onChange={e => handleFinancialChange('amountPaid', Number(e.target.value) || 0)}
                      className={modalInputCls}
                    />
                  </div>
                  <div>
                    <label className={modalLabelCls}>Amount Pending (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={clientDraft.amountPending}
                      onChange={e => patchClient({ amountPending: Math.max(0, Number(e.target.value) || 0) })}
                      className={modalInputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Tags & Notes */}
              <div className="p-4 rounded-xl bg-[#0D121E] border border-[#202A40] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Tags & Classification
                  </span>
                  {clientDraft.tags.length > 0 && (
                    <button
                      type="button"
                      onClick={() => patchClient({ tags: [] })}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All Tags
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {clientDraft.tags.length === 0 ? (
                    <span className="text-[11px] text-slate-500">No tags attached. Add tags below.</span>
                  ) : (
                    clientDraft.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-200 border border-cyan-400/40 text-xs font-semibold"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-cyan-300 hover:text-rose-400"
                          title={`Delete tag ${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type custom tag and press Add..."
                    className={modalInputCls}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center pt-0.5">
                  <span className="text-[10px] text-slate-500">Quick add:</span>
                  {QUICK_TAGS.filter(t => !clientDraft.tags.includes(t)).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddTag(t)}
                      className="px-2 py-0.5 rounded bg-[#151C2C] hover:bg-[#1C263B] text-slate-300 border border-[#232D42] text-[10px]"
                    >
                      + {t}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#1E2638]">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-cyan-400" /> Strategic Client Notes
                    </label>
                    {clientDraft.notes && (
                      <button
                        type="button"
                        onClick={() => patchClient({ notes: '' })}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Clear Notes
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={clientDraft.notes}
                    onChange={e => patchClient({ notes: e.target.value })}
                    placeholder="Client requirements, preferences, technical notes..."
                    className={modalInputCls}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <EditProjectsTab
              clientId={clientDraft.id}
              companyName={clientDraft.company}
              projects={projectsDraft}
              onChange={setProjectsDraft}
            />
          )}

          {activeTab === 'hosting' && (
            <EditHostingTab
              clientId={clientDraft.id}
              companyName={clientDraft.company}
              hostingDomains={hostingDraft}
              onChange={setHostingDraft}
            />
          )}

          {activeTab === 'billing' && (
            <EditBillingTab
              clientId={clientDraft.id}
              clientName={clientDraft.name}
              companyName={clientDraft.company}
              clientEmail={clientDraft.email}
              projects={projectsDraft}
              invoices={invoicesDraft}
              transactions={transactionsDraft}
              onInvoicesChange={setInvoicesDraft}
              onTransactionsChange={setTransactionsDraft}
            />
          )}

          {activeTab === 'tasks' && (
            <EditTasksTab
              clientId={clientDraft.id}
              companyName={clientDraft.company}
              projects={projectsDraft}
              tasks={tasksDraft}
              onChange={setTasksDraft}
            />
          )}

          {activeTab === 'docs_comms' && (
            <EditDocsAndCommsTab
              clientId={clientDraft.id}
              companyName={clientDraft.company}
              projects={projectsDraft}
              documents={documentsDraft}
              communications={commsDraft}
              onDocumentsChange={setDocumentsDraft}
              onCommsChange={setCommsDraft}
            />
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-[#1E2638] bg-[#0B0F19] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-400 text-center sm:text-left">
            Saves all client details & syncs across Client HQ, Projects, Treasury, Hosting, Tasks & Vault
          </span>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#151C2C] border border-[#232D42] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-edit-glow px-5 py-2 rounded-xl text-xs tracking-wide flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.3]" />
              <span>Save All Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

