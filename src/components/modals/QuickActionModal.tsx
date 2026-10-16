import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Receipt,
  CheckSquare,
  Binoculars,
  Coins,
  MessageSquare,
  Upload,
  Globe,
  Rocket
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { sound } from '../../utils/audio';

export const QuickActionModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    clients,
    addClient,
    addProject,
    addInvoice,
    addTask,
    addLead,
    logPayment,
    logCommunication,
    addDocument
  } = useDashboard();

  // Sub-modal form states
  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    projectValue: 75000,
    priority: 'High' as any,
    notes: '',
    billingAddress: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    clientId: clients[0]?.id || '',
    projectName: 'Website Development',
    itemDescription: 'Milestone 1: Web Design & Frontend Development',
    amount: 45000,
    dueDate: '2026-10-25',
    notes: '',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    clientId: clients[0]?.id || '',
    priority: 'High' as any,
    deadline: '2026-10-20',
    estimatedHours: 4,
    isDailyMission: true,
  });

  const [leadForm, setLeadForm] = useState({
    name: '',
    company: '',
    industry: 'Retail & E-Commerce',
    contact: '',
    email: '',
    phone: '',
    source: 'Referral',
    potentialValue: 80000,
    status: 'Discovered' as any,
    probability: 50,
    notes: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    clientId: clients[0]?.id || '',
    amount: 35000,
    type: 'Milestone Payment' as any,
    method: 'UPI / Bank Transfer' as any,
    referenceNo: 'TXN-' + Math.floor(1000000 + Math.random() * 9000000),
    note: 'Bank transfer received',
  });

  const [commForm, setCommForm] = useState({
    clientId: clients[0]?.id || '',
    type: 'WhatsApp' as any,
    summary: '',
    keyPoints: '',
    nextAction: '',
    nextActionDate: '2026-10-18',
  });

  const [docForm, setDocForm] = useState({
    clientId: clients[0]?.id || '',
    title: '',
    category: 'Contract' as any,
    fileType: 'pdf' as any,
    fileSize: '2.4 MB',
    confidential: true,
  });

  const [projectForm, setProjectForm] = useState({
    name: '',
    clientId: '',
    customClientName: '',
    websiteType: 'Website Build',
    projectValue: 65000,
    expectedLaunch: '2026-11-20',
    notes: '',
  });

  if (!activeModal) return null;

  const closeModal = () => {
    sound.playClick();
    setActiveModal(null);
  };

  const actions = [
    { id: 'add-project', label: 'Create Project', icon: <Rocket className="w-5 h-5 text-indigo-400" />, desc: 'Launch new website mission' },
    { id: 'add-client', label: 'Add Client', icon: <UserPlus className="w-5 h-5 text-amber-400" />, desc: 'Recruit new client to village' },
    { id: 'add-lead', label: 'Add Lead', icon: <Binoculars className="w-5 h-5 text-emerald-400" />, desc: 'Scout new website opportunity' },
    { id: 'add-invoice', label: 'Create Invoice', icon: <Receipt className="w-5 h-5 text-amber-300" />, desc: 'Issue milestone billing & PDF' },
    { id: 'add-task', label: 'Add Task / Mission', icon: <CheckSquare className="w-5 h-5 text-rose-400" />, desc: 'Assign mission to battle board' },
    { id: 'log-payment', label: 'Log Payment', icon: <Coins className="w-5 h-5 text-yellow-400" />, desc: 'Deposit gold into Treasury' },
    { id: 'log-comm', label: 'Log Communication', icon: <MessageSquare className="w-5 h-5 text-sky-400" />, desc: 'Record WhatsApp, call or note' },
    { id: 'add-doc', label: 'Upload Document', icon: <Upload className="w-5 h-5 text-purple-400" />, desc: 'Archive contract or credentials' },
    { id: 'add-domain', label: 'Add Domain', icon: <Globe className="w-5 h-5 text-blue-400" />, desc: "Register in Builder's Hall" },
  ];

  // Submission handlers
  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.company) return;
    addClient({
      name: clientForm.name,
      company: clientForm.company,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: clientForm.email || `${clientForm.name.toLowerCase().replace(/\s+/g, '')}@${clientForm.company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: clientForm.phone || '+91 98000 00000',
      website: clientForm.website,
      status: 'Active',
      projectValue: Number(clientForm.projectValue),
      amountPaid: 0,
      amountPending: Number(clientForm.projectValue),
      nextDeadline: '2026-11-20',
      lastCommunication: 'Just now',
      healthScore: 90,
      healthStatus: 'Excellent',
      priority: clientForm.priority,
      tags: ['New Client', 'Website'],
      notes: clientForm.notes,
      billingAddress: clientForm.billingAddress || 'India',
    });
    closeModal();
  };

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cl = clients.find(c => c.id === invoiceForm.clientId) || clients[0];
    addInvoice({
      clientId: cl.id,
      clientName: cl.name,
      clientEmail: cl.email,
      clientCompany: cl.company,
      projectId: cl.currentProjectId || 'p1',
      projectName: invoiceForm.projectName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invoiceForm.dueDate,
      items: [
        {
          id: 'item_' + Date.now(),
          description: invoiceForm.itemDescription,
          quantity: 1,
          rate: Number(invoiceForm.amount),
          amount: Number(invoiceForm.amount)
        }
      ],
      subtotal: Number(invoiceForm.amount),
      tax: 0,
      totalAmount: Number(invoiceForm.amount),
      amountPaid: 0,
      balanceDue: Number(invoiceForm.amount),
      status: 'Pending',
      notes: invoiceForm.notes
    });
    closeModal();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return;
    const cl = clients.find(c => c.id === taskForm.clientId) || clients[0];
    addTask({
      clientId: cl.id,
      clientName: cl.company,
      projectId: cl.currentProjectId,
      projectName: 'Website Build',
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      status: 'To Do',
      deadline: taskForm.deadline,
      estimatedHours: Number(taskForm.estimatedHours),
      actualHours: 0,
      isDailyMission: taskForm.isDailyMission,
      xpReward: taskForm.isDailyMission ? 150 : 80
    });
    closeModal();
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.company) return;
    addLead({
      name: leadForm.name,
      company: leadForm.company,
      industry: leadForm.industry,
      contact: leadForm.email || leadForm.phone,
      email: leadForm.email,
      phone: leadForm.phone,
      source: leadForm.source,
      potentialValue: Number(leadForm.potentialValue),
      status: leadForm.status,
      probability: Number(leadForm.probability),
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: '2026-10-20',
      notes: leadForm.notes
    });
    closeModal();
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cl = clients.find(c => c.id === paymentForm.clientId) || clients[0];
    logPayment({
      clientId: cl.id,
      clientName: cl.company,
      amount: Number(paymentForm.amount),
      date: new Date().toISOString().split('T')[0],
      type: paymentForm.type,
      method: paymentForm.method,
      referenceNo: paymentForm.referenceNo,
      note: paymentForm.note
    });
    closeModal();
  };

  const handleCommSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commForm.summary) return;
    const cl = clients.find(c => c.id === commForm.clientId) || clients[0];
    logCommunication({
      clientId: cl.id,
      clientName: cl.company,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      type: commForm.type,
      summary: commForm.summary,
      keyPoints: commForm.keyPoints ? commForm.keyPoints.split('\n') : ['Follow-up action registered'],
      nextAction: commForm.nextAction || 'Continue development',
      nextActionDate: commForm.nextActionDate
    });
    closeModal();
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title) return;
    const cl = clients.find(c => c.id === docForm.clientId) || clients[0];
    addDocument({
      clientId: cl.id,
      clientName: cl.company,
      title: docForm.title,
      category: docForm.category,
      fileType: docForm.fileType,
      fileSize: docForm.fileSize,
      url: '#',
      confidential: docForm.confidential
    });
    closeModal();
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name) return;

    const matchedClient = clients.find(c => c.id === projectForm.clientId);
    const clientName = matchedClient ? matchedClient.company : (projectForm.customClientName || 'Direct Client');

    addProject({
      clientId: matchedClient?.id,
      clientName: clientName,
      name: projectForm.name,
      websiteType: projectForm.websiteType,
      projectValue: Number(projectForm.projectValue),
      expectedLaunch: projectForm.expectedLaunch,
      notes: projectForm.notes
    });

    closeModal();
  };

  if (!activeModal || activeModal === 'add-client') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-[#121826] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
              {activeModal === 'quick-action' && '⚡ Strategic Quick Actions'}
              {activeModal === 'add-project' && '🚀 Deploy New Operation / Project'}
              {activeModal === 'add-client' && '👥 Recruit New Client'}
              {activeModal === 'add-invoice' && '🧾 Issue Milestone Invoice'}
              {activeModal === 'add-task' && '⚔️ Assign New Mission'}
              {activeModal === 'add-lead' && '🔭 Scout Potential Deal'}
              {activeModal === 'log-payment' && '💰 Deposit Gold into Treasury'}
              {activeModal === 'log-comm' && '💬 Messenger Tower Log'}
              {activeModal === 'add-doc' && '📁 Clan Library Archive'}
              {activeModal === 'add-domain' && "🏗️ Builder's Hall Infrastructure"}
            </h3>
            <p className="text-xs text-slate-400">One-click management across your entire freelance kingdom</p>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Action Selection Grid */}
          {activeModal === 'quick-action' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {actions.map(act => (
                <button
                  key={act.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveModal(act.id);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="p-2 w-fit rounded-lg bg-slate-800 group-hover:scale-110 transition-transform mb-2">
                    {act.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400">
                      {act.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {act.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Form: Add Project / Operation */}
          {activeModal === 'add-project' && (
            <form onSubmit={handleProjectSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Operation / Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Store Redesign"
                    value={projectForm.name}
                    onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client / Clan Alliance *</label>
                  {clients.length > 0 ? (
                    <select
                      value={projectForm.clientId}
                      onChange={e => setProjectForm({ ...projectForm, clientId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                    >
                      <option value="">-- Select Existing Client or New --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                      ))}
                    </select>
                  ) : null}
                  {(clients.length === 0 || !projectForm.clientId) && (
                    <input
                      type="text"
                      placeholder="e.g. Apex Digital Ltd"
                      value={projectForm.customClientName}
                      onChange={e => setProjectForm({ ...projectForm, customClientName: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none ${clients.length > 0 ? 'mt-2' : ''}`}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Website / Build Type</label>
                  <select
                    value={projectForm.websiteType}
                    onChange={e => setProjectForm({ ...projectForm, websiteType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  >
                    <option value="Website Build">🌐 Custom Website</option>
                    <option value="E-Commerce Portal">🛒 E-Commerce Portal</option>
                    <option value="Landing Page Sprint">⚡ Landing Page Sprint</option>
                    <option value="Web Application">💻 Web App / SaaS</option>
                    <option value="Branding & UI Redesign">🎨 UI/UX Redesign</option>
                    <option value="Maintenance Retainer">🛡️ Maintenance Retainer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contract Value (₹)</label>
                  <input
                    type="number"
                    value={projectForm.projectValue}
                    onChange={e => setProjectForm({ ...projectForm, projectValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Launch / Due Date</label>
                  <input
                    type="date"
                    required
                    value={projectForm.expectedLaunch}
                    onChange={e => setProjectForm({ ...projectForm, expectedLaunch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Scope & Strategic Notes</label>
                <textarea
                  rows={2}
                  placeholder="Key deliverables, milestones, tech stack or special requirements..."
                  value={projectForm.notes}
                  onChange={e => setProjectForm({ ...projectForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 rounded-xl font-bold flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Deploy Operation</span>
                </button>
              </div>
            </form>
          )}

          {/* Form: Add Client */}
          {activeModal === 'add-client' && (
            <form onSubmit={handleClientSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Digital"
                    value={clientForm.company}
                    onChange={e => setClientForm({ ...clientForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sharma"
                    value={clientForm.name}
                    onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={clientForm.email}
                    onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={clientForm.phone}
                    onChange={e => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Contract Value (₹)</label>
                  <input
                    type="number"
                    value={clientForm.projectValue}
                    onChange={e => setClientForm({ ...clientForm, projectValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={clientForm.priority}
                    onChange={e => setClientForm({ ...clientForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                  >
                    <option value="Critical">🔴 Critical</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Scope & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Website requirements, target launch, key features..."
                  value={clientForm.notes}
                  onChange={e => setClientForm({ ...clientForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 rounded-xl font-bold">
                  Recruit Client
                </button>
              </div>
            </form>
          )}

          {/* Form: Add Invoice */}
          {activeModal === 'add-invoice' && (
            <form onSubmit={handleInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client</label>
                <select
                  value={invoiceForm.clientId}
                  onChange={e => setInvoiceForm({ ...invoiceForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Milestone Item Description</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.itemDescription}
                  onChange={e => setInvoiceForm({ ...invoiceForm, itemDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={invoiceForm.amount}
                    onChange={e => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={invoiceForm.dueDate}
                    onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 rounded-xl font-bold">
                  Issue Invoice
                </button>
              </div>
            </form>
          )}

          {/* Form: Add Task / Mission */}
          {activeModal === 'add-task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mission Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finish mobile responsive checkout"
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assign to Client</label>
                  <select
                    value={taskForm.clientId}
                    onChange={e => setTaskForm({ ...taskForm, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.company}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  >
                    <option value="Critical">🔴 Critical</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="dailyMissionCheck"
                  checked={taskForm.isDailyMission}
                  onChange={e => setTaskForm({ ...taskForm, isDailyMission: e.target.checked })}
                  className="rounded text-amber-500 bg-slate-800"
                />
                <label htmlFor="dailyMissionCheck" className="text-slate-300 font-medium">
                  ⚔️ Feature in Daily Missions (+150 XP on completion)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 rounded-xl font-bold">
                  Deploy Mission
                </button>
              </div>
            </form>
          )}

          {/* Form: Add Lead */}
          {activeModal === 'add-lead' && (
            <form onSubmit={handleLeadSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BlueSky Cafe"
                    value={leadForm.company}
                    onChange={e => setLeadForm({ ...leadForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahil Khan"
                    value={leadForm.name}
                    onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Potential Value (₹)</label>
                  <input
                    type="number"
                    value={leadForm.potentialValue}
                    onChange={e => setLeadForm({ ...leadForm, potentialValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lead Stage</label>
                  <select
                    value={leadForm.status}
                    onChange={e => setLeadForm({ ...leadForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  >
                    <option value="Discovered">Discovered</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 rounded-xl font-bold">
                  Record Scout Lead
                </button>
              </div>
            </form>
          )}

          {/* Form: Log Payment */}
          {activeModal === 'log-payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client</label>
                <select
                  value={paymentForm.clientId}
                  onChange={e => setPaymentForm({ ...paymentForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.company} (Pending: ₹{c.amountPending.toLocaleString('en-IN')})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount Received (₹) *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentForm.method}
                    onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  >
                    <option value="UPI / Bank Transfer">UPI / IMPS Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Stripe">Stripe</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash / Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reference / Transaction Number</label>
                <input
                  type="text"
                  value={paymentForm.referenceNo}
                  onChange={e => setPaymentForm({ ...paymentForm, referenceNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 rounded-xl font-bold">
                  Deposit to Treasury
                </button>
              </div>
            </form>
          )}

          {/* Form: Log Communication */}
          {activeModal === 'log-comm' && (
            <form onSubmit={handleCommSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client</label>
                  <select
                    value={commForm.clientId}
                    onChange={e => setCommForm({ ...commForm, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.company}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Channel</label>
                  <select
                    value={commForm.type}
                    onChange={e => setCommForm({ ...commForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Call">Phone Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting (Zoom/Meet)</option>
                    <option value="Internal Note">Internal Strategy Note</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Discussion Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What was discussed or decided?"
                  value={commForm.summary}
                  onChange={e => setCommForm({ ...commForm, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Next Action Required</label>
                  <input
                    type="text"
                    placeholder="e.g. Send updated pricing wireframe"
                    value={commForm.nextAction}
                    onChange={e => setCommForm({ ...commForm, nextAction: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={commForm.nextActionDate}
                    onChange={e => setCommForm({ ...commForm, nextActionDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 rounded-xl font-bold">
                  Log to Messenger Tower
                </button>
              </div>
            </form>
          )}

          {/* Form: Upload Document */}
          {activeModal === 'add-doc' && (
            <form onSubmit={handleDocSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Services Contract & Retainer Agreement"
                  value={docForm.title}
                  onChange={e => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client</label>
                  <select
                    value={docForm.clientId}
                    onChange={e => setDocForm({ ...docForm, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.company}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={docForm.category}
                    onChange={e => setDocForm({ ...docForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none"
                  >
                    <option value="Contract">Contract</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Brand Asset">Brand Asset</option>
                    <option value="Requirements">Requirements Doc</option>
                    <option value="Credentials & Access">Credentials & Access</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="btn-gold px-5 py-2 rounded-xl font-bold">
                  Archive Document
                </button>
              </div>
            </form>
          )}

          {/* Form: Add Domain / Hosting */}
          {activeModal === 'add-domain' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-300">Builder's Hall allows registering domain & hosting assets per client.</p>
              <button 
                onClick={() => {
                  closeModal();
                  setActiveModal('add-client');
                }} 
                className="btn-gold w-full py-2 rounded-xl font-bold"
              >
                Go to Add Client & Domain Details
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
