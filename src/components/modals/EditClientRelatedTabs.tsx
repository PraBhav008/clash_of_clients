import React from 'react';
import {
  Plus,
  Trash2,
  FolderGit2,
  Globe,
  Receipt,
  Coins,
  Swords,
  Library,
  MessageSquare,
  Key
} from 'lucide-react';
import {
  Project,
  HostingDomain,
  Invoice,
  PaymentTransaction,
  Task,
  DocumentItem,
  Communication,
  PriorityLevel,
  TaskStatus,
  InvoiceStatus
} from '../../types';
import { createPhasesForProject, standardProjectPhases } from '../../data/initialData';

export const modalInputCls =
  'w-full px-3 py-1.5 rounded-lg bg-[#090C14] border border-[#232D42] focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors';
export const modalLabelCls =
  'block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1';
const itemCardCls =
  'p-3.5 rounded-xl bg-[#0D121E] border border-[#202A40] space-y-3';

const todayStr = () => new Date().toISOString().split('T')[0];

const daysUntilDate = (dateStr: string): number => {
  const target = new Date(dateStr).getTime();
  if (Number.isNaN(target)) return 365;
  return Math.ceil((target - Date.now()) / 86400000);
};

function SectionHeader({
  icon,
  title,
  count,
  addLabel,
  onAdd,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-100">
          {title} <span className="text-slate-400 font-normal">({count})</span>
        </h4>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 text-[11px] font-semibold flex items-center gap-1 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{addLabel}</span>
      </button>
    </div>
  );
}

function updateItemAt<T>(list: T[], idx: number, patch: Partial<T>): T[] {
  return list.map((item, i) => (i === idx ? { ...item, ...patch } : item));
}

function removeItemAt<T>(list: T[], idx: number): T[] {
  return list.filter((_, i) => i !== idx);
}

/* ==================== PROJECTS TAB ==================== */
export const EditProjectsTab: React.FC<{
  clientId: string;
  companyName: string;
  projects: Project[];
  onChange: (next: Project[]) => void;
}> = ({ clientId, companyName, projects, onChange }) => {
  const handleAdd = () => {
    const newProj: Project = {
      id: 'p_' + Date.now(),
      clientId,
      clientName: companyName,
      name: `${companyName || 'Client'} Website Build`,
      websiteType: 'Website Build',
      projectValue: 0,
      amountPaid: 0,
      amountPending: 0,
      startDate: todayStr(),
      expectedLaunch: 'To be scheduled',
      currentPhaseIndex: 0,
      phases: createPhasesForProject(0),
      completionPercentage: 9,
      revisionsCount: 0,
      maxRevisions: 3,
      approvalStatus: 'In Review',
      liveUrl: '',
      previewUrl: '',
      repoUrl: '',
      notes: '',
    };
    onChange([newProj, ...projects]);
  };

  return (
    <div className="space-y-3">
      <SectionHeader
        icon={<FolderGit2 className="w-4 h-4 text-cyan-400" />}
        title="Client Projects & Phases"
        count={projects.length}
        addLabel="Add Project"
        onAdd={handleAdd}
      />

      {projects.length === 0 ? (
        <div className="p-6 rounded-xl bg-[#0D121E] border border-[#202A40] text-center text-xs text-slate-400">
          No projects attached to this client. Click "Add Project" to create one.
        </div>
      ) : (
        projects.map((p, idx) => (
          <div key={p.id} className={itemCardCls}>
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#1E2638]">
              <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                #{p.id} · {p.completionPercentage}% Complete
              </span>
              <button
                type="button"
                onClick={() => onChange(removeItemAt(projects, idx))}
                className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Delete Project
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className={modalLabelCls}>Project Name</label>
                <input
                  type="text"
                  value={p.name}
                  onChange={e => onChange(updateItemAt(projects, idx, { name: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Website Type</label>
                <input
                  type="text"
                  value={p.websiteType}
                  onChange={e => onChange(updateItemAt(projects, idx, { websiteType: e.target.value }))}
                  placeholder="E-Commerce, Corporate, SaaS..."
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Approval Status</label>
                <select
                  value={p.approvalStatus}
                  onChange={e => onChange(updateItemAt(projects, idx, { approvalStatus: e.target.value as Project['approvalStatus'] }))}
                  className={modalInputCls}
                >
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Revision Requested">Revision Requested</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className={modalLabelCls}>Project Value (₹)</label>
                <input
                  type="number"
                  value={p.projectValue}
                  onChange={e => onChange(updateItemAt(projects, idx, { projectValue: Number(e.target.value) || 0 }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Paid (₹)</label>
                <input
                  type="number"
                  value={p.amountPaid}
                  onChange={e => onChange(updateItemAt(projects, idx, { amountPaid: Number(e.target.value) || 0 }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Pending (₹)</label>
                <input
                  type="number"
                  value={p.amountPending}
                  onChange={e => onChange(updateItemAt(projects, idx, { amountPending: Number(e.target.value) || 0 }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Completion %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={p.completionPercentage}
                  onChange={e => onChange(updateItemAt(projects, idx, { completionPercentage: Math.max(0, Math.min(100, Number(e.target.value) || 0)) }))}
                  className={modalInputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="col-span-2">
                <label className={modalLabelCls}>Current Phase (1–11)</label>
                <select
                  value={p.currentPhaseIndex}
                  onChange={e => {
                    const phaseIdx = Number(e.target.value);
                    onChange(
                      updateItemAt(projects, idx, {
                        currentPhaseIndex: phaseIdx,
                        phases: createPhasesForProject(phaseIdx),
                        completionPercentage: Math.round(((phaseIdx + 1) / 11) * 100),
                      })
                    );
                  }}
                  className={modalInputCls}
                >
                  {standardProjectPhases.map((ph, i) => (
                    <option key={ph.id} value={i}>
                      {i + 1}. {ph.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={modalLabelCls}>Start Date</label>
                <input
                  type="date"
                  value={p.startDate}
                  onChange={e => onChange(updateItemAt(projects, idx, { startDate: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Expected Launch</label>
                <input
                  type="text"
                  value={p.expectedLaunch}
                  onChange={e => onChange(updateItemAt(projects, idx, { expectedLaunch: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className={modalLabelCls}>Rev</label>
                  <input
                    type="number"
                    min={0}
                    value={p.revisionsCount}
                    onChange={e => onChange(updateItemAt(projects, idx, { revisionsCount: Number(e.target.value) || 0 }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Max</label>
                  <input
                    type="number"
                    min={0}
                    value={p.maxRevisions}
                    onChange={e => onChange(updateItemAt(projects, idx, { maxRevisions: Number(e.target.value) || 0 }))}
                    className={modalInputCls}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className={modalLabelCls}>Live URL</label>
                <input
                  type="url"
                  value={p.liveUrl || ''}
                  onChange={e => onChange(updateItemAt(projects, idx, { liveUrl: e.target.value || undefined }))}
                  placeholder="https://example.com"
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Preview / Staging URL</label>
                <input
                  type="url"
                  value={p.previewUrl || ''}
                  onChange={e => onChange(updateItemAt(projects, idx, { previewUrl: e.target.value || undefined }))}
                  placeholder="https://staging.example.com"
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Repository URL</label>
                <input
                  type="text"
                  value={p.repoUrl || ''}
                  onChange={e => onChange(updateItemAt(projects, idx, { repoUrl: e.target.value || undefined }))}
                  placeholder="github.com/org/repo"
                  className={modalInputCls}
                />
              </div>
            </div>

            <div>
              <label className={modalLabelCls}>Project Notes</label>
              <textarea
                rows={2}
                value={p.notes || ''}
                onChange={e => onChange(updateItemAt(projects, idx, { notes: e.target.value }))}
                className={modalInputCls}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

/* ==================== HOSTING & DOMAINS TAB ==================== */
export const EditHostingTab: React.FC<{
  clientId: string;
  companyName: string;
  hostingDomains: HostingDomain[];
  onChange: (next: HostingDomain[]) => void;
}> = ({ clientId, companyName, hostingDomains, onChange }) => {
  const handleAdd = () => {
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'domain';
    const nextItem: HostingDomain = {
      id: 'hd_' + Date.now(),
      clientId,
      clientName: companyName,
      domain: `${slug}.com`,
      domainProvider: 'Cloudflare / Registrar',
      domainExpiryDate: '2027-10-14',
      daysUntilDomainExpiry: daysUntilDate('2027-10-14'),
      hostingProvider: 'Vercel / Cloud Server',
      hostingExpiryDate: '2027-10-14',
      daysUntilHostingExpiry: daysUntilDate('2027-10-14'),
      sslStatus: 'Active',
      deploymentPlatform: 'Vite React / Next.js',
      repoUrl: '',
      database: 'Cloudflare D1 / PostgreSQL',
      websiteUrl: `https://${slug}.com`,
      adminUrl: `https://${slug}.com/admin`,
      maintenanceStatus: 'Active Retainer',
    };
    onChange([nextItem, ...hostingDomains]);
  };

  return (
    <div className="space-y-3">
      <SectionHeader
        icon={<Globe className="w-4 h-4 text-cyan-400" />}
        title="Domains, Hosting & Infrastructure"
        count={hostingDomains.length}
        addLabel="Add Domain / Server"
        onAdd={handleAdd}
      />

      {hostingDomains.length === 0 ? (
        <div className="p-6 rounded-xl bg-[#0D121E] border border-[#202A40] text-center text-xs text-slate-400">
          No domain or hosting records for this client. Click "Add Domain / Server" to create one.
        </div>
      ) : (
        hostingDomains.map((hd, idx) => (
          <div key={hd.id} className={itemCardCls}>
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
              <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                {hd.domain || 'New Domain'}
              </span>
              <button
                type="button"
                onClick={() => onChange(removeItemAt(hostingDomains, idx))}
                className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Delete Domain
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className={modalLabelCls}>Domain</label>
                <input
                  type="text"
                  value={hd.domain}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { domain: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Domain Provider</label>
                <input
                  type="text"
                  value={hd.domainProvider}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { domainProvider: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>SSL Status</label>
                <select
                  value={hd.sslStatus}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { sslStatus: e.target.value as HostingDomain['sslStatus'] }))}
                  className={modalInputCls}
                >
                  <option value="Active">Active</option>
                  <option value="Expiring">Expiring</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className={modalLabelCls}>Domain Expiry</label>
                <input
                  type="date"
                  value={hd.domainExpiryDate}
                  onChange={e =>
                    onChange(
                      updateItemAt(hostingDomains, idx, {
                        domainExpiryDate: e.target.value,
                        daysUntilDomainExpiry: daysUntilDate(e.target.value),
                      })
                    )
                  }
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Days Left (Domain)</label>
                <input
                  type="number"
                  value={hd.daysUntilDomainExpiry}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { daysUntilDomainExpiry: Number(e.target.value) || 0 }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Hosting Expiry</label>
                <input
                  type="date"
                  value={hd.hostingExpiryDate}
                  onChange={e =>
                    onChange(
                      updateItemAt(hostingDomains, idx, {
                        hostingExpiryDate: e.target.value,
                        daysUntilHostingExpiry: daysUntilDate(e.target.value),
                      })
                    )
                  }
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Days Left (Hosting)</label>
                <input
                  type="number"
                  value={hd.daysUntilHostingExpiry}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { daysUntilHostingExpiry: Number(e.target.value) || 0 }))}
                  className={modalInputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className={modalLabelCls}>Hosting Provider</label>
                <input
                  type="text"
                  value={hd.hostingProvider}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { hostingProvider: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Deployment Platform</label>
                <input
                  type="text"
                  value={hd.deploymentPlatform}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { deploymentPlatform: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Database</label>
                <input
                  type="text"
                  value={hd.database}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { database: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div>
                <label className={modalLabelCls}>Website URL</label>
                <input
                  type="text"
                  value={hd.websiteUrl}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { websiteUrl: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Admin URL</label>
                <input
                  type="text"
                  value={hd.adminUrl}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { adminUrl: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Repo URL</label>
                <input
                  type="text"
                  value={hd.repoUrl}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { repoUrl: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Maintenance Status</label>
                <select
                  value={hd.maintenanceStatus}
                  onChange={e => onChange(updateItemAt(hostingDomains, idx, { maintenanceStatus: e.target.value as HostingDomain['maintenanceStatus'] }))}
                  className={modalInputCls}
                >
                  <option value="Active Retainer">Active Retainer</option>
                  <option value="On Demand">On Demand</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

/* ==================== INVOICES & PAYMENTS TAB ==================== */
export const EditBillingTab: React.FC<{
  clientId: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  projects: Project[];
  invoices: Invoice[];
  transactions: PaymentTransaction[];
  onInvoicesChange: (next: Invoice[]) => void;
  onTransactionsChange: (next: PaymentTransaction[]) => void;
}> = ({
  clientId,
  clientName,
  companyName,
  clientEmail,
  projects,
  invoices,
  transactions,
  onInvoicesChange,
  onTransactionsChange,
}) => {
  const handleAddInvoice = () => {
    const inv: Invoice = {
      id: 'inv_' + Date.now(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId,
      clientName: clientName || companyName,
      clientEmail,
      clientCompany: companyName,
      projectId: projects[0]?.id || '',
      projectName: projects[0]?.name || 'Website Build',
      issueDate: todayStr(),
      dueDate: todayStr(),
      items: [{ id: 'item_' + Date.now(), description: 'Milestone Deliverable', quantity: 1, rate: 0, amount: 0 }],
      subtotal: 0,
      tax: 0,
      totalAmount: 0,
      amountPaid: 0,
      balanceDue: 0,
      status: 'Pending',
      paymentMethod: '',
      notes: '',
    };
    onInvoicesChange([inv, ...invoices]);
  };

  const handleAddTx = () => {
    const tx: PaymentTransaction = {
      id: 'tx_' + Date.now(),
      invoiceId: invoices[0]?.id,
      clientId,
      clientName: companyName,
      amount: 0,
      date: todayStr(),
      type: 'Milestone Payment',
      method: 'UPI / Bank Transfer',
      referenceNo: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      note: '',
    };
    onTransactionsChange([tx, ...transactions]);
  };

  const updateInvoiceItems = (invIdx: number, nextItems: Invoice['items']) => {
    const inv = invoices[invIdx];
    const subtotal = nextItems.reduce((s, it) => s + (Number(it.amount) || 0), 0);
    const totalAmount = subtotal + (Number(inv.tax) || 0);
    const balanceDue = Math.max(0, totalAmount - (Number(inv.amountPaid) || 0));
    onInvoicesChange(updateItemAt(invoices, invIdx, { items: nextItems, subtotal, totalAmount, balanceDue }));
  };

  return (
    <div className="space-y-6">
      {/* Invoices */}
      <div className="space-y-3">
        <SectionHeader
          icon={<Receipt className="w-4 h-4 text-cyan-400" />}
          title="Invoices"
          count={invoices.length}
          addLabel="Add Invoice"
          onAdd={handleAddInvoice}
        />

        {invoices.length === 0 ? (
          <div className="p-5 rounded-xl bg-[#0D121E] border border-[#202A40] text-center text-xs text-slate-400">
            No invoices for this client.
          </div>
        ) : (
          invoices.map((inv, idx) => (
            <div key={inv.id} className={itemCardCls}>
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
                <span className="text-[11px] font-mono text-cyan-300 font-semibold">{inv.invoiceNumber}</span>
                <button
                  type="button"
                  onClick={() => onInvoicesChange(removeItemAt(invoices, idx))}
                  className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete Invoice
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className={modalLabelCls}>Invoice #</label>
                  <input
                    type="text"
                    value={inv.invoiceNumber}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { invoiceNumber: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Status</label>
                  <select
                    value={inv.status}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { status: e.target.value as InvoiceStatus }))}
                    className={modalInputCls}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className={modalLabelCls}>Issue Date</label>
                  <input
                    type="date"
                    value={inv.issueDate}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { issueDate: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Due Date</label>
                  <input
                    type="date"
                    value={inv.dueDate}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { dueDate: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className={modalLabelCls}>Project Name</label>
                  <input
                    type="text"
                    value={inv.projectName}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { projectName: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Payment Method</label>
                  <input
                    type="text"
                    value={inv.paymentMethod || ''}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { paymentMethod: e.target.value || undefined }))}
                    placeholder="UPI / Bank Transfer, Stripe..."
                    className={modalInputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className={modalLabelCls}>Subtotal (₹)</label>
                  <input
                    type="number"
                    value={inv.subtotal}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { subtotal: Number(e.target.value) || 0 }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Tax (₹)</label>
                  <input
                    type="number"
                    value={inv.tax}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { tax: Number(e.target.value) || 0 }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Total (₹)</label>
                  <input
                    type="number"
                    value={inv.totalAmount}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { totalAmount: Number(e.target.value) || 0 }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Paid (₹)</label>
                  <input
                    type="number"
                    value={inv.amountPaid}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { amountPaid: Number(e.target.value) || 0 }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Balance Due (₹)</label>
                  <input
                    type="number"
                    value={inv.balanceDue}
                    onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { balanceDue: Number(e.target.value) || 0 }))}
                    className={modalInputCls}
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="p-2.5 rounded-lg bg-[#090C14] border border-[#1E2638] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Line Items ({inv.items.length})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateInvoiceItems(idx, [
                        ...inv.items,
                        { id: 'item_' + Date.now(), description: '', quantity: 1, rate: 0, amount: 0 },
                      ])
                    }
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Line Item
                  </button>
                </div>
                {inv.items.map((it, itemIdx) => (
                  <div key={it.id} className="grid grid-cols-12 gap-1.5 items-center">
                    <input
                      type="text"
                      placeholder="Description"
                      value={it.description}
                      onChange={e =>
                        updateInvoiceItems(idx, updateItemAt(inv.items, itemIdx, { description: e.target.value }))
                      }
                      className={`${modalInputCls} col-span-5`}
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={e => {
                        const qty = Number(e.target.value) || 0;
                        updateInvoiceItems(
                          idx,
                          updateItemAt(inv.items, itemIdx, { quantity: qty, amount: qty * (Number(it.rate) || 0) })
                        );
                      }}
                      className={`${modalInputCls} col-span-2`}
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={it.rate}
                      onChange={e => {
                        const rate = Number(e.target.value) || 0;
                        updateInvoiceItems(
                          idx,
                          updateItemAt(inv.items, itemIdx, { rate, amount: (Number(it.quantity) || 0) * rate })
                        );
                      }}
                      className={`${modalInputCls} col-span-2`}
                    />
                    <input
                      type="number"
                      placeholder="Amt"
                      value={it.amount}
                      onChange={e =>
                        updateInvoiceItems(
                          idx,
                          updateItemAt(inv.items, itemIdx, { amount: Number(e.target.value) || 0 })
                        )
                      }
                      className={`${modalInputCls} col-span-2`}
                    />
                    <button
                      type="button"
                      onClick={() => updateInvoiceItems(idx, removeItemAt(inv.items, itemIdx))}
                      className="col-span-1 p-1.5 rounded text-rose-400 hover:bg-rose-500/10 flex justify-center"
                      title="Delete line item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className={modalLabelCls}>Invoice Notes</label>
                <input
                  type="text"
                  value={inv.notes || ''}
                  onChange={e => onInvoicesChange(updateItemAt(invoices, idx, { notes: e.target.value || undefined }))}
                  className={modalInputCls}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Transactions */}
      <div className="space-y-3 pt-2 border-t border-[#1E2638]">
        <SectionHeader
          icon={<Coins className="w-4 h-4 text-cyan-400" />}
          title="Payment Transactions"
          count={transactions.length}
          addLabel="Add Payment"
          onAdd={handleAddTx}
        />

        {transactions.length === 0 ? (
          <div className="p-5 rounded-xl bg-[#0D121E] border border-[#202A40] text-center text-xs text-slate-400">
            No payment transactions logged for this client.
          </div>
        ) : (
          transactions.map((tx, idx) => (
            <div key={tx.id} className={itemCardCls}>
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
                <span className="text-[11px] font-mono text-cyan-300 font-semibold">{tx.referenceNo}</span>
                <button
                  type="button"
                  onClick={() => onTransactionsChange(removeItemAt(transactions, idx))}
                  className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete Payment
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className={modalLabelCls}>Amount (₹)</label>
                  <input
                    type="number"
                    value={tx.amount}
                    onChange={e => onTransactionsChange(updateItemAt(transactions, idx, { amount: Number(e.target.value) || 0 }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Date</label>
                  <input
                    type="date"
                    value={tx.date}
                    onChange={e => onTransactionsChange(updateItemAt(transactions, idx, { date: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Type</label>
                  <select
                    value={tx.type}
                    onChange={e => onTransactionsChange(updateItemAt(transactions, idx, { type: e.target.value as PaymentTransaction['type'] }))}
                    className={modalInputCls}
                  >
                    <option value="Advance Payment">Advance Payment</option>
                    <option value="Milestone Payment">Milestone Payment</option>
                    <option value="Final Payment">Final Payment</option>
                    <option value="Maintenance Retainer">Maintenance Retainer</option>
                  </select>
                </div>
                <div>
                  <label className={modalLabelCls}>Method</label>
                  <select
                    value={tx.method}
                    onChange={e => onTransactionsChange(updateItemAt(transactions, idx, { method: e.target.value as PaymentTransaction['method'] }))}
                    className={modalInputCls}
                  >
                    <option value="UPI / Bank Transfer">UPI / Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Stripe">Stripe</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className={modalLabelCls}>Reference No</label>
                  <input
                    type="text"
                    value={tx.referenceNo}
                    onChange={e => onTransactionsChange(updateItemAt(transactions, idx, { referenceNo: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Linked Invoice</label>
                  <select
                    value={tx.invoiceId || ''}
                    onChange={e => onTransactionsChange(updateItemAt(transactions, idx, { invoiceId: e.target.value || undefined }))}
                    className={modalInputCls}
                  >
                    <option value="">None</option>
                    {invoices.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.invoiceNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={modalLabelCls}>Note</label>
                  <input
                    type="text"
                    value={tx.note || ''}
                    onChange={e => onTransactionsChange(updateItemAt(transactions, idx, { note: e.target.value || undefined }))}
                    className={modalInputCls}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ==================== TASKS TAB ==================== */
export const EditTasksTab: React.FC<{
  clientId: string;
  companyName: string;
  projects: Project[];
  tasks: Task[];
  onChange: (next: Task[]) => void;
}> = ({ clientId, companyName, projects, tasks, onChange }) => {
  const handleAdd = () => {
    const t: Task = {
      id: 't_' + Date.now(),
      clientId,
      clientName: companyName,
      projectId: projects[0]?.id,
      projectName: projects[0]?.name,
      title: 'New Client Mission',
      description: '',
      priority: 'High',
      status: 'To Do',
      deadline: todayStr(),
      estimatedHours: 4,
      actualHours: 0,
      notes: '',
      isDailyMission: false,
      xpReward: 150,
    };
    onChange([t, ...tasks]);
  };

  return (
    <div className="space-y-3">
      <SectionHeader
        icon={<Swords className="w-4 h-4 text-cyan-400" />}
        title="Tasks & Battle Missions"
        count={tasks.length}
        addLabel="Add Task"
        onAdd={handleAdd}
      />

      {tasks.length === 0 ? (
        <div className="p-6 rounded-xl bg-[#0D121E] border border-[#202A40] text-center text-xs text-slate-400">
          No tasks assigned to this client.
        </div>
      ) : (
        tasks.map((t, idx) => (
          <div key={t.id} className={itemCardCls}>
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
              <span className="text-[11px] font-semibold text-cyan-300 truncate">{t.title || 'Untitled Task'}</span>
              <button
                type="button"
                onClick={() => onChange(removeItemAt(tasks, idx))}
                className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1 shrink-0"
              >
                <Trash2 className="w-3 h-3" /> Delete Task
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className={modalLabelCls}>Task Title</label>
                <input
                  type="text"
                  value={t.title}
                  onChange={e => onChange(updateItemAt(tasks, idx, { title: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Linked Project</label>
                <select
                  value={t.projectId || ''}
                  onChange={e => {
                    const proj = projects.find(p => p.id === e.target.value);
                    onChange(updateItemAt(tasks, idx, { projectId: proj?.id, projectName: proj?.name }));
                  }}
                  className={modalInputCls}
                >
                  <option value="">None</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className={modalLabelCls}>Status</label>
                <select
                  value={t.status}
                  onChange={e => {
                    const nextStatus = e.target.value as TaskStatus;
                    onChange(
                      updateItemAt(tasks, idx, {
                        status: nextStatus,
                        completedAt: nextStatus === 'Completed' ? t.completedAt || todayStr() : undefined,
                      })
                    );
                  }}
                  className={modalInputCls}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for Client">Waiting for Client</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className={modalLabelCls}>Priority</label>
                <select
                  value={t.priority}
                  onChange={e => onChange(updateItemAt(tasks, idx, { priority: e.target.value as PriorityLevel }))}
                  className={modalInputCls}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className={modalLabelCls}>Deadline</label>
                <input
                  type="date"
                  value={t.deadline}
                  onChange={e => onChange(updateItemAt(tasks, idx, { deadline: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>XP Reward</label>
                <input
                  type="number"
                  value={t.xpReward}
                  onChange={e => onChange(updateItemAt(tasks, idx, { xpReward: Number(e.target.value) || 0 }))}
                  className={modalInputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-end">
              <div>
                <label className={modalLabelCls}>Est. Hours</label>
                <input
                  type="number"
                  value={t.estimatedHours}
                  onChange={e => onChange(updateItemAt(tasks, idx, { estimatedHours: Number(e.target.value) || 0 }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Actual Hours</label>
                <input
                  type="number"
                  value={t.actualHours}
                  onChange={e => onChange(updateItemAt(tasks, idx, { actualHours: Number(e.target.value) || 0 }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Completed At</label>
                <input
                  type="date"
                  value={t.completedAt || ''}
                  onChange={e => onChange(updateItemAt(tasks, idx, { completedAt: e.target.value || undefined }))}
                  className={modalInputCls}
                />
              </div>
              <label className="flex items-center gap-2 py-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={t.isDailyMission}
                  onChange={e => onChange(updateItemAt(tasks, idx, { isDailyMission: e.target.checked }))}
                  className="rounded border-[#232D42] bg-[#090C14] text-cyan-400"
                />
                <span>Daily Mission</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className={modalLabelCls}>Description</label>
                <input
                  type="text"
                  value={t.description}
                  onChange={e => onChange(updateItemAt(tasks, idx, { description: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className={modalLabelCls}>Task Notes</label>
                <input
                  type="text"
                  value={t.notes || ''}
                  onChange={e => onChange(updateItemAt(tasks, idx, { notes: e.target.value || undefined }))}
                  className={modalInputCls}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

/* ==================== DOCS & COMMUNICATIONS TAB ==================== */
export const EditDocsAndCommsTab: React.FC<{
  clientId: string;
  companyName: string;
  projects: Project[];
  documents: DocumentItem[];
  communications: Communication[];
  onDocumentsChange: (next: DocumentItem[]) => void;
  onCommsChange: (next: Communication[]) => void;
}> = ({
  clientId,
  companyName,
  projects,
  documents,
  communications,
  onDocumentsChange,
  onCommsChange,
}) => {
  const handleAddDoc = () => {
    const doc: DocumentItem = {
      id: 'doc_' + Date.now(),
      clientId,
      clientName: companyName,
      projectId: projects[0]?.id,
      title: 'Client Document',
      category: 'Contract',
      fileType: 'pdf',
      fileSize: '1.2 MB',
      uploadDate: todayStr(),
      url: '#',
      confidential: false,
    };
    onDocumentsChange([doc, ...documents]);
  };

  const handleAddComm = () => {
    const comm: Communication = {
      id: 'comm_' + Date.now(),
      clientId,
      clientName: companyName,
      date: todayStr(),
      type: 'WhatsApp',
      summary: '',
      keyPoints: [],
      nextAction: '',
      nextActionDate: todayStr(),
    };
    onCommsChange([comm, ...communications]);
  };

  return (
    <div className="space-y-6">
      {/* Documents & Credentials */}
      <div className="space-y-3">
        <SectionHeader
          icon={<Library className="w-4 h-4 text-cyan-400" />}
          title="Documents & Credentials"
          count={documents.length}
          addLabel="Add Document"
          onAdd={handleAddDoc}
        />

        {documents.length === 0 ? (
          <div className="p-5 rounded-xl bg-[#0D121E] border border-[#202A40] text-center text-xs text-slate-400">
            No documents or credentials archived for this client.
          </div>
        ) : (
          documents.map((doc, idx) => (
            <div key={doc.id} className={itemCardCls}>
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
                <span className="text-[11px] font-semibold text-cyan-300 truncate">{doc.title || 'Document'}</span>
                <button
                  type="button"
                  onClick={() => onDocumentsChange(removeItemAt(documents, idx))}
                  className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1 shrink-0"
                >
                  <Trash2 className="w-3 h-3" /> Delete Doc
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className={modalLabelCls}>Title</label>
                  <input
                    type="text"
                    value={doc.title}
                    onChange={e => onDocumentsChange(updateItemAt(documents, idx, { title: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Category</label>
                  <select
                    value={doc.category}
                    onChange={e =>
                      onDocumentsChange(updateItemAt(documents, idx, { category: e.target.value as DocumentItem['category'] }))
                    }
                    className={modalInputCls}
                  >
                    <option value="Contract">Contract</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Brand Asset">Brand Asset</option>
                    <option value="Requirements">Requirements</option>
                    <option value="Credentials & Access">Credentials & Access</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-end">
                <div>
                  <label className={modalLabelCls}>File Type</label>
                  <select
                    value={doc.fileType}
                    onChange={e =>
                      onDocumentsChange(updateItemAt(documents, idx, { fileType: e.target.value as DocumentItem['fileType'] }))
                    }
                    className={modalInputCls}
                  >
                    <option value="pdf">pdf</option>
                    <option value="figma">figma</option>
                    <option value="zip">zip</option>
                    <option value="doc">doc</option>
                    <option value="key">key</option>
                    <option value="img">img</option>
                  </select>
                </div>
                <div>
                  <label className={modalLabelCls}>File Size</label>
                  <input
                    type="text"
                    value={doc.fileSize}
                    onChange={e => onDocumentsChange(updateItemAt(documents, idx, { fileSize: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Upload Date</label>
                  <input
                    type="date"
                    value={doc.uploadDate}
                    onChange={e => onDocumentsChange(updateItemAt(documents, idx, { uploadDate: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>File / Link URL</label>
                  <input
                    type="text"
                    value={doc.url}
                    onChange={e => onDocumentsChange(updateItemAt(documents, idx, { url: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <label className="flex items-center gap-2 py-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doc.confidential}
                    onChange={e => onDocumentsChange(updateItemAt(documents, idx, { confidential: e.target.checked }))}
                    className="rounded border-[#232D42] bg-[#090C14] text-cyan-400"
                  />
                  <span>Confidential</span>
                </label>
              </div>

              {/* Optional Credential Data */}
              <div className="p-2.5 rounded-lg bg-[#090C14] border border-[#1E2638] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-cyan-400" /> Access Credentials
                  </span>
                  {doc.credentialData ? (
                    <button
                      type="button"
                      onClick={() => onDocumentsChange(updateItemAt(documents, idx, { credentialData: undefined }))}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Remove Credentials
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onDocumentsChange(
                          updateItemAt(documents, idx, {
                            credentialData: { service: '', username: '', notes: '' },
                          })
                        )
                      }
                      className="text-[10px] text-cyan-300 hover:underline"
                    >
                      + Attach Credentials
                    </button>
                  )}
                </div>
                {doc.credentialData && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Service (e.g. Cloudflare / WP)"
                      value={doc.credentialData.service}
                      onChange={e =>
                        onDocumentsChange(
                          updateItemAt(documents, idx, {
                            credentialData: { ...doc.credentialData!, service: e.target.value },
                          })
                        )
                      }
                      className={modalInputCls}
                    />
                    <input
                      type="text"
                      placeholder="Username / Email"
                      value={doc.credentialData.username}
                      onChange={e =>
                        onDocumentsChange(
                          updateItemAt(documents, idx, {
                            credentialData: { ...doc.credentialData!, username: e.target.value },
                          })
                        )
                      }
                      className={modalInputCls}
                    />
                    <input
                      type="text"
                      placeholder="Notes / Password hint"
                      value={doc.credentialData.notes || ''}
                      onChange={e =>
                        onDocumentsChange(
                          updateItemAt(documents, idx, {
                            credentialData: { ...doc.credentialData!, notes: e.target.value || undefined },
                          })
                        )
                      }
                      className={modalInputCls}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Communication Logs */}
      <div className="space-y-3 pt-2 border-t border-[#1E2638]">
        <SectionHeader
          icon={<MessageSquare className="w-4 h-4 text-cyan-400" />}
          title="Communication Logs"
          count={communications.length}
          addLabel="Add Comm Log"
          onAdd={handleAddComm}
        />

        {communications.length === 0 ? (
          <div className="p-5 rounded-xl bg-[#0D121E] border border-[#202A40] text-center text-xs text-slate-400">
            No communication logs recorded for this client.
          </div>
        ) : (
          communications.map((c, idx) => (
            <div key={c.id} className={itemCardCls}>
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
                <span className="text-[11px] font-semibold text-cyan-300">
                  {c.type} · {c.date}
                </span>
                <button
                  type="button"
                  onClick={() => onCommsChange(removeItemAt(communications, idx))}
                  className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete Log
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className={modalLabelCls}>Channel</label>
                  <select
                    value={c.type}
                    onChange={e => onCommsChange(updateItemAt(communications, idx, { type: e.target.value as Communication['type'] }))}
                    className={modalInputCls}
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Internal Note">Internal Note</option>
                  </select>
                </div>
                <div>
                  <label className={modalLabelCls}>Date / Timestamp</label>
                  <input
                    type="text"
                    value={c.date}
                    onChange={e => onCommsChange(updateItemAt(communications, idx, { date: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Next Action Date</label>
                  <input
                    type="date"
                    value={c.nextActionDate || ''}
                    onChange={e => onCommsChange(updateItemAt(communications, idx, { nextActionDate: e.target.value || undefined }))}
                    className={modalInputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className={modalLabelCls}>Summary</label>
                  <textarea
                    rows={2}
                    value={c.summary}
                    onChange={e => onCommsChange(updateItemAt(communications, idx, { summary: e.target.value }))}
                    className={modalInputCls}
                  />
                </div>
                <div>
                  <label className={modalLabelCls}>Key Points (one per line)</label>
                  <textarea
                    rows={2}
                    value={c.keyPoints.join('\n')}
                      onChange={e =>
                      onCommsChange(
                        updateItemAt(communications, idx, {
                          keyPoints: e.target.value.split('\n'),
                        })
                      )
                    }
                    className={modalInputCls}
                  />
                </div>
              </div>

              <div>
                <label className={modalLabelCls}>Next Action</label>
                <input
                  type="text"
                  value={c.nextAction}
                  onChange={e => onCommsChange(updateItemAt(communications, idx, { nextAction: e.target.value }))}
                  className={modalInputCls}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
