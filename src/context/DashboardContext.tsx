import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Client,
  Project,
  Task,
  Lead,
  Invoice,
  PaymentTransaction,
  DocumentItem,
  HostingDomain,
  Communication,
  NotificationItem,
  KingdomStats,
  PerkId,
  TrashedClientBundle,
  CloudflareD1Config,
  CloudflareSyncPayload
} from '../types';
import {
  getSavedCloudflareConfig,
  saveCloudflareConfig,
  pushSnapshotToCloudflare,
  pullSnapshotFromCloudflare
} from '../utils/cloudflareD1';
import {
  initialClients,
  initialProjects,
  initialTasks,
  initialLeads,
  initialInvoices,
  initialTransactions,
  initialDocuments,
  initialHostingDomains,
  initialCommunications,
  initialNotifications,
  initialKingdomStats,
  createPhasesForProject,
  availablePerks,
  availableAchievements
} from '../data/initialData';
import { sound } from '../utils/audio';

export type ActiveView = 
  | 'command-center'
  | 'clients'
  | 'client-hq'
  | 'projects'
  | 'tasks'
  | 'leads'
  | 'treasury'
  | 'invoices'
  | 'documents'
  | 'hosting'
  | 'communications'
  | 'calendar'
  | 'analytics'
  | 'settings';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'gold' | 'elixir' | 'success' | 'info' | 'danger';
}

interface DashboardContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  openClientHQ: (clientId: string) => void;
  
  // Data State
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  leads: Lead[];
  invoices: Invoice[];
  transactions: PaymentTransaction[];
  documents: DocumentItem[];
  hostingDomains: HostingDomain[];
  communications: Communication[];
  notifications: NotificationItem[];
  kingdomStats: KingdomStats;

  // Sound & Effects
  soundEnabled: boolean;
  toggleSound: () => void;
  triggerConfetti: () => void;

  // CRUD & Operations
  addClient: (client: Omit<Client, 'id' | 'joinedDate'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addProject: (project: {
    clientId?: string;
    clientName?: string;
    name: string;
    websiteType?: string;
    projectValue?: number;
    expectedLaunch?: string;
    notes?: string;
  }) => Project;
  updateProjectPhase: (projectId: string, newPhaseIndex: number) => void;
  updateProjectApproval: (projectId: string, status: Project['approvalStatus']) => void;

  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTaskStatus: (taskId: string) => void;
  deleteTask: (taskId: string) => void;

  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  convertLeadToClient: (leadId: string) => void;

  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  markInvoicePaid: (invoiceId: string) => void;

  logPayment: (payment: Omit<PaymentTransaction, 'id'>) => void;
  logCommunication: (comm: Omit<Communication, 'id'>) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllData: () => void;

  // Modals & UI Controls
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Currency helper
  formatCurrency: (amount: number) => string;

  // Gems & Perks System
  gems: number;
  unlockedPerks: PerkId[];
  claimedAchievements: string[];
  isGemForgeOpen: boolean;
  setIsGemForgeOpen: (open: boolean) => void;
  claimAchievement: (achievementId: string) => void;
  unlockPerk: (perkId: PerkId) => boolean;
  isPerkUnlocked: (perkId: PerkId) => boolean;
  deployStandardSprint: (clientId: string) => void;
  getAchievementProgress: (achievementId: string) => {
    current: number;
    target: number;
    isCompleted: boolean;
    isClaimed: boolean;
  };
  claimableAchievementsCount: number;

  // Trash Can System
  trashedClients: TrashedClientBundle[];
  isTrashOpen: boolean;
  setIsTrashOpen: (open: boolean) => void;
  moveToTrash: (clientId: string) => void;
  restoreFromTrash: (clientId: string) => void;
  permanentlyDeleteFromTrash: (clientId: string) => void;
  emptyTrash: () => void;

  // Cloudflare D1 Database Edge Sync
  cloudflareConfig: CloudflareD1Config;
  updateCloudflareConfig: (cfg: Partial<CloudflareD1Config>) => void;
  isCloudflareSyncing: boolean;
  syncToCloudflare: (silent?: boolean) => Promise<boolean>;
  restoreFromCloudflare: (silent?: boolean) => Promise<boolean>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('command-center');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Use clean versioned keys (v2) to purge old demo data from localStorage
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('coc_v2_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('coc_v2_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('coc_v2_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('coc_v2_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('coc_v2_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('coc_v2_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('coc_v2_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [hostingDomains, setHostingDomains] = useState<HostingDomain[]>(() => {
    const saved = localStorage.getItem('coc_v2_hosting');
    return saved ? JSON.parse(saved) : initialHostingDomains;
  });

  const [communications, setCommunications] = useState<Communication[]>(() => {
    const saved = localStorage.getItem('coc_v2_comms');
    return saved ? JSON.parse(saved) : initialCommunications;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('coc_v2_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [kingdomStats, setKingdomStats] = useState<KingdomStats>(() => {
    const saved = localStorage.getItem('coc_v2_stats');
    return saved ? JSON.parse(saved) : initialKingdomStats;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Gems & Perks State
  const [gems, setGems] = useState<number>(() => {
    const saved = localStorage.getItem('coc_v2_gems');
    return saved !== null ? Number(saved) : 15;
  });

  const [unlockedPerks, setUnlockedPerks] = useState<PerkId[]>(() => {
    const saved = localStorage.getItem('coc_v2_unlocked_perks');
    return saved ? JSON.parse(saved) : [];
  });

  const [claimedAchievements, setClaimedAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('coc_v2_claimed_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [isGemForgeOpen, setIsGemForgeOpen] = useState<boolean>(false);

  // Trash Can State & Persistence
  const [trashedClients, setTrashedClients] = useState<TrashedClientBundle[]>(() => {
    const saved = localStorage.getItem('coc_v2_trash');
    return saved ? JSON.parse(saved) : [];
  });
  const [isTrashOpen, setIsTrashOpen] = useState<boolean>(false);

  // Cloudflare D1 Database Edge Sync State
  const [cloudflareConfig, setCloudflareConfig] = useState<CloudflareD1Config>(() => getSavedCloudflareConfig());
  const [isCloudflareSyncing, setIsCloudflareSyncing] = useState<boolean>(false);

  const updateCloudflareConfig = (cfg: Partial<CloudflareD1Config>) => {
    setCloudflareConfig(prev => {
      const next = { ...prev, ...cfg };
      saveCloudflareConfig(next);
      return next;
    });
  };

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('coc_v2_gems', gems.toString());
  }, [gems]);

  useEffect(() => {
    localStorage.setItem('coc_v2_unlocked_perks', JSON.stringify(unlockedPerks));
  }, [unlockedPerks]);

  useEffect(() => {
    localStorage.setItem('coc_v2_claimed_achievements', JSON.stringify(claimedAchievements));
  }, [claimedAchievements]);

  useEffect(() => {
    localStorage.setItem('coc_v2_trash', JSON.stringify(trashedClients));
  }, [trashedClients]);

  // Persist states
  useEffect(() => {
    localStorage.setItem('coc_v2_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('coc_v2_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('coc_v2_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('coc_v2_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('coc_v2_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('coc_v2_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('coc_v2_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('coc_v2_hosting', JSON.stringify(hostingDomains));
  }, [hostingDomains]);

  useEffect(() => {
    localStorage.setItem('coc_v2_comms', JSON.stringify(communications));
  }, [communications]);

  useEffect(() => {
    localStorage.setItem('coc_v2_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('coc_v2_stats', JSON.stringify(kingdomStats));
  }, [kingdomStats]);

  // Multi-Device Auto-Sync: Load latest cloud data on mount if authenticated
  const isInitialSyncDone = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('coc_auth_token');
    if (token) {
      restoreFromCloudflare(true).finally(() => {
        isInitialSyncDone.current = true;
      });
    } else {
      isInitialSyncDone.current = true;
    }
  }, []);

  // Multi-Device Auto-Sync: Silently refresh when switching back to this tab/window
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const token = localStorage.getItem('coc_auth_token');
        if (token && !isCloudflareSyncing) {
          restoreFromCloudflare(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isCloudflareSyncing]);

  // Multi-Device Auto-Sync: Debounced auto-save to Cloudflare D1 when data changes
  useEffect(() => {
    if (!isInitialSyncDone.current) return;
    const token = localStorage.getItem('coc_auth_token');
    if (!token) return;

    const timer = setTimeout(() => {
      syncToCloudflare(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    clients,
    trashedClients,
    projects,
    tasks,
    invoices,
    transactions,
    documents,
    hostingDomains,
    communications,
    leads,
    kingdomStats,
    gems,
    unlockedPerks
  ]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E5C358', '#9CA3AF', '#FFFFFF']
    });
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const formatCurrency = (amount: number): string => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const openClientHQ = (clientId: string) => {
    sound.playClick();
    setSelectedClientId(clientId);
    setActiveView('client-hq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllData = () => {
    localStorage.clear();
    setClients([]);
    setProjects([]);
    setTasks([]);
    setLeads([]);
    setInvoices([]);
    setTransactions([]);
    setDocuments([]);
    setHostingDomains([]);
    setCommunications([]);
    setNotifications([]);
    setKingdomStats(initialKingdomStats);
    setGems(15);
    setUnlockedPerks([]);
    setClaimedAchievements([]);
    setSelectedClientId(null);
    sound.playClick();
    addToast({
      title: 'Database Cleared',
      description: 'All records have been reset to a fresh clean state.',
      type: 'info'
    });
  };

  // Business Action: Add Client
  const addClient = (clientData: Omit<Client, 'id' | 'joinedDate'>): Client => {
    const newId = 'c_' + Date.now();
    const projectVal = clientData.projectValue || 0;
    const newClient: Client = {
      ...clientData,
      id: newId,
      joinedDate: new Date().toISOString().split('T')[0],
      projectValue: projectVal,
      amountPaid: clientData.amountPaid || 0,
      amountPending: clientData.amountPending ?? projectVal,
    };
    setClients(prev => [newClient, ...prev]);

    // Also auto-create initial project for this client
    const newProject: Project = {
      id: 'p_' + Date.now(),
      clientId: newId,
      clientName: newClient.company,
      name: `${newClient.company} Official Website`,
      websiteType: clientData.tags?.includes('E-commerce') ? 'E-Commerce Portal' : 'Website Build',
      projectValue: projectVal,
      amountPaid: 0,
      amountPending: projectVal,
      startDate: new Date().toISOString().split('T')[0],
      expectedLaunch: newClient.nextDeadline || 'To be scheduled',
      currentPhaseIndex: 0,
      phases: createPhasesForProject(0),
      completionPercentage: 10,
      revisionsCount: 0,
      maxRevisions: 3,
      approvalStatus: 'In Review',
      notes: newClient.notes || 'Recruited into citadel.'
    };
    setProjects(prev => [newProject, ...prev]);

    // Auto-create initial hosting domain entry
    const newDomain: HostingDomain = {
      id: 'hd_' + Date.now(),
      clientId: newId,
      clientName: newClient.company,
      domain: newClient.website ? newClient.website.replace('https://', '').replace('http://', '') : `${newClient.company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'domain'}.com`,
      domainProvider: 'Cloudflare / Registrar',
      domainExpiryDate: '2027-10-14',
      daysUntilDomainExpiry: 365,
      hostingProvider: 'Vercel / Cloud Server',
      hostingExpiryDate: '2027-10-14',
      daysUntilHostingExpiry: 365,
      sslStatus: 'Active',
      deploymentPlatform: 'Next.js / Vite React',
      repoUrl: 'github.com/agency/website',
      database: 'PostgreSQL / Supabase',
      websiteUrl: newClient.website || `https://${newClient.company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'domain'}.com`,
      adminUrl: `https://${newClient.company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'domain'}.com/admin`,
      maintenanceStatus: 'Active Retainer'
    };
    setHostingDomains(prev => [newDomain, ...prev]);

    // Update kingdom revenue and project count
    if (projectVal > 0) {
      setKingdomStats(st => ({
        ...st,
        goldRevenue: st.goldRevenue + projectVal,
        elixirActiveProjects: st.elixirActiveProjects + 1,
        darkElixirPending: st.darkElixirPending + projectVal
      }));
    } else {
      setKingdomStats(st => ({
        ...st,
        elixirActiveProjects: st.elixirActiveProjects + 1
      }));
    }

    sound.playGold();
    addToast({
      title: 'New Ally Recruited!',
      description: `${newClient.company} joined your Kingdom.`,
      type: 'gold'
    });

    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    sound.playClick();
  };

  const addProject = (projectData: {
    clientId?: string;
    clientName?: string;
    name: string;
    websiteType?: string;
    projectValue?: number;
    expectedLaunch?: string;
    notes?: string;
  }): Project => {
    let resolvedClientId = projectData.clientId;
    let resolvedClientName = projectData.clientName;

    if (!resolvedClientId) {
      if (resolvedClientName) {
        const found = clients.find(c => c.company.toLowerCase() === resolvedClientName?.toLowerCase());
        if (found) {
          resolvedClientId = found.id;
          resolvedClientName = found.company;
        } else {
          const createdClient = addClient({
            name: resolvedClientName,
            company: resolvedClientName,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            email: `contact@${resolvedClientName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
            phone: '+91 98000 00000',
            status: 'Active',
            projectValue: projectData.projectValue || 50000,
            amountPaid: 0,
            amountPending: projectData.projectValue || 50000,
            nextDeadline: projectData.expectedLaunch || '2026-11-30',
            lastCommunication: 'Just now',
            healthScore: 90,
            healthStatus: 'Excellent',
            priority: 'High',
            tags: ['Website', projectData.websiteType || 'Custom Build'],
            notes: projectData.notes || 'Project mission initiated',
            billingAddress: 'India'
          });
          resolvedClientId = createdClient.id;
          resolvedClientName = createdClient.company;
        }
      } else if (clients.length > 0) {
        resolvedClientId = clients[0].id;
        resolvedClientName = clients[0].company;
      } else {
        resolvedClientId = 'c_' + Date.now();
        resolvedClientName = 'Direct Client';
      }
    } else {
      const existingClient = clients.find(c => c.id === resolvedClientId);
      if (existingClient) {
        resolvedClientName = existingClient.company;
      }
    }

    const val = projectData.projectValue || 0;
    const newProject: Project = {
      id: 'p_' + Date.now(),
      clientId: resolvedClientId || 'c_' + Date.now(),
      clientName: resolvedClientName || 'Client',
      name: projectData.name,
      websiteType: projectData.websiteType || 'Website Build',
      projectValue: val,
      amountPaid: 0,
      amountPending: val,
      startDate: new Date().toISOString().split('T')[0],
      expectedLaunch: projectData.expectedLaunch || '2026-11-20',
      currentPhaseIndex: 0,
      phases: createPhasesForProject(0),
      completionPercentage: 10,
      revisionsCount: 0,
      maxRevisions: 3,
      approvalStatus: 'In Review',
      notes: projectData.notes || 'Initiated from War Planner / Project Base'
    };

    setProjects(prev => [newProject, ...prev]);

    if (val > 0) {
      setKingdomStats(st => ({
        ...st,
        goldRevenue: st.goldRevenue + val,
        elixirActiveProjects: st.elixirActiveProjects + 1,
        darkElixirPending: st.darkElixirPending + val
      }));
    } else {
      setKingdomStats(st => ({
        ...st,
        elixirActiveProjects: st.elixirActiveProjects + 1
      }));
    }

    sound.playUpgrade();
    addToast({
      title: 'Project Deployed!',
      description: `${newProject.name} scheduled for ${newProject.clientName}.`,
      type: 'gold'
    });

    return newProject;
  };

  // Trash Can Operations
  const moveToTrash = (id: string) => {
    const clientToTrash = clients.find(c => c.id === id);
    if (!clientToTrash) return;

    // Gather and bundle all associated records
    const clientProjects = projects.filter(p => p.clientId === id);
    const clientTasks = tasks.filter(t => t.clientId === id);
    const clientInvoices = invoices.filter(i => i.clientId === id);
    const clientTransactions = transactions.filter(t => t.clientId === id);
    const clientDocuments = documents.filter(d => d.clientId === id);
    const clientHosting = hostingDomains.filter(h => h.clientId === id);
    const clientComms = communications.filter(c => c.clientId === id);

    const bundle: TrashedClientBundle = {
      client: clientToTrash,
      projects: clientProjects,
      tasks: clientTasks,
      invoices: clientInvoices,
      transactions: clientTransactions,
      documents: clientDocuments,
      hostingDomains: clientHosting,
      communications: clientComms,
      deletedAt: new Date().toISOString()
    };

    // 1. Move bundle to Trash Can
    setTrashedClients(prev => [bundle, ...prev.filter(b => b.client.id !== id)]);

    // 2. Remove from active state
    setClients(prev => prev.filter(c => c.id !== id));
    setProjects(prev => prev.filter(p => p.clientId !== id));
    setTasks(prev => prev.filter(t => t.clientId !== id));
    setInvoices(prev => prev.filter(i => i.clientId !== id));
    setTransactions(prev => prev.filter(t => t.clientId !== id));
    setDocuments(prev => prev.filter(d => d.clientId !== id));
    setHostingDomains(prev => prev.filter(h => h.clientId !== id));
    setCommunications(prev => prev.filter(c => c.clientId !== id));
    setNotifications(prev => prev.filter(n => n.clientId !== id));

    // 3. Reset selected client if currently active
    if (selectedClientId === id) {
      setSelectedClientId(null);
      if (activeView === 'client-hq') {
        setActiveView('clients');
      }
    }

    // 4. Temporarily remove from kingdom totals while in trash
    const val = clientToTrash.projectValue || 0;
    setKingdomStats(st => ({
      ...st,
      goldRevenue: Math.max(0, st.goldRevenue - val),
      elixirActiveProjects: Math.max(0, st.elixirActiveProjects - 1),
      darkElixirPending: Math.max(0, st.darkElixirPending - (clientToTrash.amountPending || 0))
    }));

    sound.playClick();
    addToast({
      title: 'Sent to Trash Can',
      description: `${clientToTrash.company} moved to Trash Can. You can restore it anytime or erase the trash permanently.`,
      type: 'danger'
    });
  };

  const restoreFromTrash = (id: string) => {
    const bundle = trashedClients.find(b => b.client.id === id);
    if (!bundle) return;

    // Restore client & all records
    setClients(prev => [bundle.client, ...prev]);
    setProjects(prev => [...bundle.projects, ...prev]);
    setTasks(prev => [...bundle.tasks, ...prev]);
    setInvoices(prev => [...bundle.invoices, ...prev]);
    setTransactions(prev => [...bundle.transactions, ...prev]);
    setDocuments(prev => [...bundle.documents, ...prev]);
    setHostingDomains(prev => [...bundle.hostingDomains, ...prev]);
    setCommunications(prev => [...bundle.communications, ...prev]);

    // Remove from trash
    setTrashedClients(prev => prev.filter(b => b.client.id !== id));

    // Restore to kingdom stats
    const val = bundle.client.projectValue || 0;
    setKingdomStats(st => ({
      ...st,
      goldRevenue: st.goldRevenue + val,
      elixirActiveProjects: st.elixirActiveProjects + 1,
      darkElixirPending: st.darkElixirPending + (bundle.client.amountPending || 0)
    }));

    sound.playUpgrade();
    addToast({
      title: 'Client Restored!',
      description: `${bundle.client.company} and all its records have been restored to your Kingdom.`,
      type: 'gold'
    });
  };

  const permanentlyDeleteFromTrash = (id: string) => {
    const bundle = trashedClients.find(b => b.client.id === id);
    const company = bundle ? bundle.client.company : 'Client';

    setTrashedClients(prev => prev.filter(b => b.client.id !== id));
    sound.playClick();
    addToast({
      title: 'Permanently Erased',
      description: `${company} and all its whole details have been completely erased forever.`,
      type: 'danger'
    });
  };

  const emptyTrash = () => {
    const count = trashedClients.length;
    setTrashedClients([]);
    sound.playClick();
    addToast({
      title: 'Trash Can Emptied',
      description: `Completely erased ${count} client(s) and all associated records permanently.`,
      type: 'danger'
    });
  };

  // Alias deleteClient to moveToTrash so all delete actions safely route to Trash Can
  const deleteClient = (id: string) => {
    moveToTrash(id);
  };

  // Cloudflare D1 Database Synchronization Actions
  const syncToCloudflare = async (silent = false): Promise<boolean> => {
    setIsCloudflareSyncing(true);
    try {
      const payload: CloudflareSyncPayload = {
        version: '1.0.0',
        syncedAt: new Date().toISOString(),
        clients,
        trashedClients,
        projects,
        tasks,
        invoices,
        transactions,
        documents,
        hostingDomains,
        communications,
        leads,
        kingdomStats,
        gems,
        unlockedPerkIds: unlockedPerks
      };

      const activeConfig = getSavedCloudflareConfig();
      const res = await pushSnapshotToCloudflare(activeConfig, payload);
      if (res.success) {
        setCloudflareConfig(prev => {
          const next = { ...prev, lastSyncedAt: res.timestamp };
          saveCloudflareConfig(next);
          return next;
        });
        if (!silent) {
          sound.playUpgrade();
          addToast({
            title: 'Cloudflare D1 Synced!',
            description: res.message,
            type: 'gold'
          });
        }
        return true;
      } else {
        if (!silent) {
          sound.playClick();
          addToast({
            title: 'Cloudflare Sync Failed',
            description: res.message,
            type: 'danger'
          });
        }
        return false;
      }
    } catch (err: any) {
      if (!silent) {
        addToast({
          title: 'Cloudflare Sync Error',
          description: err.message || 'Unexpected network error',
          type: 'danger'
        });
      }
      return false;
    } finally {
      setIsCloudflareSyncing(false);
    }
  };

  const restoreFromCloudflare = async (silent = false): Promise<boolean> => {
    setIsCloudflareSyncing(true);
    try {
      const activeConfig = getSavedCloudflareConfig();
      const res = await pullSnapshotFromCloudflare(activeConfig);
      if (res.success && res.payload) {
        const p = res.payload;
        if (Array.isArray(p.clients)) setClients(p.clients);
        if (Array.isArray(p.trashedClients)) setTrashedClients(p.trashedClients);
        if (Array.isArray(p.projects)) setProjects(p.projects);
        if (Array.isArray(p.tasks)) setTasks(p.tasks);
        if (Array.isArray(p.invoices)) setInvoices(p.invoices);
        if (Array.isArray(p.transactions)) setTransactions(p.transactions);
        if (Array.isArray(p.documents)) setDocuments(p.documents);
        if (Array.isArray(p.hostingDomains)) setHostingDomains(p.hostingDomains);
        if (Array.isArray(p.communications)) setCommunications(p.communications);
        if (Array.isArray(p.leads)) setLeads(p.leads);
        if (p.kingdomStats) setKingdomStats(p.kingdomStats);
        if (typeof p.gems === 'number') setGems(p.gems);
        if (Array.isArray(p.unlockedPerkIds)) setUnlockedPerks(p.unlockedPerkIds as any);

        if (!silent) {
          triggerConfetti();
          sound.playUpgrade();
          addToast({
            title: 'Restored from Cloudflare D1',
            description: `Successfully restored database snapshot with ${p.clients?.length || 0} clients & ${p.trashedClients?.length || 0} trashed clients!`,
            type: 'gold'
          });
        }
        return true;
      } else {
        if (!silent) {
          addToast({
            title: 'Restore Failed',
            description: res.message,
            type: 'danger'
          });
        }
        return false;
      }
    } catch (err: any) {
      if (!silent) {
        addToast({
          title: 'Cloudflare Restore Error',
          description: err.message || 'Failed to download snapshot',
          type: 'danger'
        });
      }
      return false;
    } finally {
      setIsCloudflareSyncing(false);
    }
  };

  // Business Action: Project Phase Progression
  const updateProjectPhase = (projectId: string, newPhaseIndex: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const clampedIndex = Math.max(0, Math.min(10, newPhaseIndex));
        const newPhases = createPhasesForProject(clampedIndex);
        const completionPct = Math.round(((clampedIndex + 1) / 11) * 100);
        return {
          ...p,
          currentPhaseIndex: clampedIndex,
          phases: newPhases,
          completionPercentage: completionPct
        };
      }
      return p;
    }));

    sound.playVictory();
    triggerConfetti();

    setKingdomStats(prev => {
      const nextXP = prev.currentXP + 350;
      let nextLevel = prev.level;
      let nextTitle = prev.title;
      if (nextXP >= prev.maxXP) {
        nextLevel += 1;
        nextTitle = nextLevel === 2 ? 'Websmith' : nextLevel === 3 ? 'Digital Architect' : 'Agency Master';
        addToast({
          title: '⚔️ KINGDOM LEVEL UP!',
          description: `You reached Level ${nextLevel} — ${nextTitle}!`,
          type: 'gold'
        });
      }
      return {
        ...prev,
        currentXP: nextXP % prev.maxXP,
        level: nextLevel,
        title: nextTitle
      };
    });

    addToast({
      title: 'Phase Advanced!',
      description: 'Project progression advanced +350 XP earned.',
      type: 'gold'
    });
  };

  const updateProjectApproval = (projectId: string, status: Project['approvalStatus']) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, approvalStatus: status } : p));
    sound.playClick();
  };

  // Business Action: Tasks
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: 't_' + Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    sound.playClick();
    addToast({
      title: 'Task Created',
      description: 'Mission added to battle board.',
      type: 'info'
    });
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isNowCompleted = t.status !== 'Completed';
        if (isNowCompleted) {
          sound.playGold();
          triggerConfetti();
          setKingdomStats(st => ({
            ...st,
            currentXP: Math.min(st.maxXP, st.currentXP + (t.xpReward || 100))
          }));
          addToast({
            title: 'Mission Complete!',
            description: `Earned +${t.xpReward || 100} XP!`,
            type: 'gold'
          });
        }
        return {
          ...t,
          status: isNowCompleted ? 'Completed' : 'In Progress',
          completedAt: isNowCompleted ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    sound.playClick();
  };

  // Business Action: Leads
  const addLead = (leadData: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'l_' + Date.now()
    };
    setLeads(prev => [newLead, ...prev]);
    setKingdomStats(st => ({
      ...st,
      gemsOpportunities: st.gemsOpportunities + 1
    }));
    sound.playGold();
    addToast({
      title: 'Lead Scouted',
      description: `${newLead.company} added to pipeline.`,
      type: 'info'
    });
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
    sound.playClick();
  };

  const convertLeadToClient = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    addClient({
      name: lead.name,
      company: lead.company,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: lead.email,
      phone: lead.phone,
      status: 'Active',
      projectValue: lead.potentialValue,
      amountPaid: 0,
      amountPending: lead.potentialValue,
      nextDeadline: '2026-11-30',
      lastCommunication: 'Just now',
      healthScore: 85,
      healthStatus: 'Good',
      priority: 'High',
      tags: [lead.industry, 'Converted Lead'],
      notes: lead.notes,
      billingAddress: 'Client HQ',
    });

    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  // Business Action: Invoices
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const invCount = invoices.length + 1;
    const invNum = `INV-2026-${String(invCount).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: 'inv_' + Date.now(),
      invoiceNumber: invNum
    };
    setInvoices(prev => [newInvoice, ...prev]);
    sound.playGold();
    addToast({
      title: 'Invoice Issued',
      description: `${invNum} created for ${newInvoice.clientCompany}`,
      type: 'gold'
    });
  };

  const markInvoicePaid = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'Paid',
          amountPaid: inv.totalAmount,
          balanceDue: 0
        };
      }
      return inv;
    }));

    const amountToCollect = invoice.balanceDue || invoice.totalAmount;

    // Record transaction
    const newTx: PaymentTransaction = {
      id: 'tx_' + Date.now(),
      invoiceId: invoice.id,
      clientId: invoice.clientId,
      clientName: invoice.clientCompany,
      amount: amountToCollect,
      date: new Date().toISOString().split('T')[0],
      type: 'Milestone Payment',
      method: 'UPI / Bank Transfer',
      referenceNo: 'TXN-' + Math.floor(1000000 + Math.random() * 9000000),
      note: `Cleared ${invoice.invoiceNumber}`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update client paid amount
    setClients(prev => prev.map(c => {
      if (c.id === invoice.clientId) {
        const newPaid = c.amountPaid + amountToCollect;
        const newPending = Math.max(0, c.projectValue - newPaid);
        return {
          ...c,
          amountPaid: newPaid,
          amountPending: newPending
        };
      }
      return c;
    }));

    setKingdomStats(st => ({
      ...st,
      collectedRevenue: st.collectedRevenue + amountToCollect,
      darkElixirPending: Math.max(0, st.darkElixirPending - amountToCollect)
    }));

    sound.playGold();
    triggerConfetti();
    addToast({
      title: 'Payment Collected!',
      description: `Payment of ${formatCurrency(amountToCollect)} deposited into Treasury.`,
      type: 'gold'
    });
  };

  // Log Payment directly
  const logPayment = (paymentData: Omit<PaymentTransaction, 'id'>) => {
    const newTx: PaymentTransaction = {
      ...paymentData,
      id: 'tx_' + Date.now()
    };
    setTransactions(prev => [newTx, ...prev]);

    setClients(prev => prev.map(c => {
      if (c.id === paymentData.clientId) {
        const newPaid = c.amountPaid + paymentData.amount;
        const newPending = Math.max(0, c.projectValue - newPaid);
        return {
          ...c,
          amountPaid: newPaid,
          amountPending: newPending
        };
      }
      return c;
    }));

    setKingdomStats(st => ({
      ...st,
      collectedRevenue: st.collectedRevenue + paymentData.amount,
      darkElixirPending: Math.max(0, st.darkElixirPending - paymentData.amount)
    }));

    sound.playGold();
    triggerConfetti();
    addToast({
      title: 'Payment Deposited',
      description: `${formatCurrency(paymentData.amount)} received from ${paymentData.clientName}`,
      type: 'gold'
    });
  };

  const logCommunication = (commData: Omit<Communication, 'id'>) => {
    const newComm: Communication = {
      ...commData,
      id: 'comm_' + Date.now()
    };
    setCommunications(prev => [newComm, ...prev]);
    sound.playClick();
    addToast({
      title: 'Communication Logged',
      description: `Interaction with ${commData.clientName} recorded.`,
      type: 'info'
    });
  };

  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: 'doc_' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    sound.playClick();
    addToast({
      title: 'Document Saved',
      description: `${newDoc.title} stored in Clan Library.`,
      type: 'info'
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    sound.playClick();
  };

  // Gems & Achievements System
  const getAchievementProgress = (achievementId: string) => {
    const isClaimed = claimedAchievements.includes(achievementId);
    let current = 0;
    let target = 1;
    let isCompleted = false;

    switch (achievementId) {
      case 'ach_level_2':
        current = kingdomStats.level;
        target = 2;
        isCompleted = kingdomStats.level >= 2;
        break;
      case 'ach_level_3':
        current = kingdomStats.level;
        target = 3;
        isCompleted = kingdomStats.level >= 3;
        break;
      case 'ach_first_client':
        current = clients.length;
        target = 1;
        isCompleted = clients.length >= 1;
        break;
      case 'ach_three_clients':
        current = clients.length;
        target = 3;
        isCompleted = clients.length >= 3;
        break;
      case 'ach_tasks_3': {
        const done = tasks.filter(t => t.status === 'Completed').length;
        current = done;
        target = 3;
        isCompleted = done >= 3;
        break;
      }
      case 'ach_tasks_8': {
        const done = tasks.filter(t => t.status === 'Completed').length;
        current = done;
        target = 8;
        isCompleted = done >= 8;
        break;
      }
      case 'ach_revenue_50k':
        current = kingdomStats.collectedRevenue;
        target = 50000;
        isCompleted = kingdomStats.collectedRevenue >= 50000;
        break;
      case 'ach_revenue_100k':
        current = kingdomStats.collectedRevenue;
        target = 100000;
        isCompleted = kingdomStats.collectedRevenue >= 100000;
        break;
      case 'ach_project_launch': {
        const maxPhase = projects.length > 0 ? Math.max(...projects.map(p => p.currentPhaseIndex)) : 0;
        current = maxPhase >= 9 ? 10 : maxPhase;
        target = 10;
        isCompleted = maxPhase >= 9;
        break;
      }
      case 'ach_domains_2':
        current = hostingDomains.length;
        target = 2;
        isCompleted = hostingDomains.length >= 2;
        break;
      case 'ach_comms_3':
        current = communications.length;
        target = 3;
        isCompleted = communications.length >= 3;
        break;
      default:
        break;
    }

    return { current, target, isCompleted, isClaimed };
  };

  const claimableAchievementsCount = availableAchievements.filter(ach => {
    const prog = getAchievementProgress(ach.id);
    return prog.isCompleted && !prog.isClaimed;
  }).length;

  const claimAchievement = (achievementId: string) => {
    const ach = availableAchievements.find(a => a.id === achievementId);
    if (!ach) return;
    if (claimedAchievements.includes(achievementId)) return;
    const progress = getAchievementProgress(achievementId);
    if (!progress.isCompleted) return;

    sound.playGem();
    triggerConfetti();
    setClaimedAchievements(prev => [...prev, achievementId]);
    setGems(prev => prev + ach.gemReward);

    setKingdomStats(prev => {
      const nextXP = prev.currentXP + ach.xpReward;
      let nextLevel = prev.level;
      let nextTitle = prev.title;
      if (nextXP >= prev.maxXP) {
        nextLevel += 1;
        nextTitle = nextLevel === 2 ? 'Websmith' : nextLevel === 3 ? 'Digital Architect' : 'Agency Master';
        addToast({
          title: '⚔️ KINGDOM LEVEL UP!',
          description: `You reached Level ${nextLevel} — ${nextTitle}!`,
          type: 'gold'
        });
      }
      return {
        ...prev,
        currentXP: nextXP % prev.maxXP,
        level: nextLevel,
        title: nextTitle,
        gems: prev.gems + ach.gemReward
      };
    });

    addToast({
      title: `💎 +${ach.gemReward} Gems Claimed!`,
      description: `Completed milestone: ${ach.title}`,
      type: 'gold'
    });
  };

  const unlockPerk = (perkId: PerkId): boolean => {
    const perk = availablePerks.find(p => p.id === perkId);
    if (!perk) return false;
    if (unlockedPerks.includes(perkId)) return true;

    if (gems < perk.gemCost) {
      sound.playClick();
      addToast({
        title: 'Not Enough Gems',
        description: `Requires ${perk.gemCost} 💎 (You have ${gems} 💎). Complete Clan Milestones to earn gems!`,
        type: 'danger'
      });
      return false;
    }

    sound.playGem();
    triggerConfetti();
    setGems(prev => prev - perk.gemCost);
    setUnlockedPerks(prev => [...prev, perkId]);

    addToast({
      title: '🔓 Perk Permanently Unlocked!',
      description: `${perk.name} is now permanently unlocked and active.`,
      type: 'gold'
    });

    return true;
  };

  const isPerkUnlocked = (perkId: PerkId): boolean => {
    return unlockedPerks.includes(perkId);
  };

  const deployStandardSprint = (targetClientId?: string) => {
    const cId = targetClientId || selectedClientId || (clients[0] ? clients[0].id : '');
    const client = clients.find(c => c.id === cId);
    const clientName = client ? client.company : 'Client Website';

    const sprintMissions: Omit<Task, 'id'>[] = [
      {
        title: '1. Wireframes & Sitemap Architecture',
        description: 'Establish layout hierarchy, core page wireframes, and conversion journey.',
        status: 'To Do',
        priority: 'High',
        deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        clientId: cId,
        clientName,
        xpReward: 150,
        isDailyMission: true,
        estimatedHours: 4,
        actualHours: 0
      },
      {
        title: '2. UI Design System & Component Library',
        description: 'Design typography scale, curated color palette, and high-fidelity mockups.',
        status: 'To Do',
        priority: 'High',
        deadline: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        clientId: cId,
        clientName,
        xpReward: 200,
        isDailyMission: false,
        estimatedHours: 6,
        actualHours: 0
      },
      {
        title: '3. Responsive Frontend Code Implementation',
        description: 'Build fluid mobile, tablet, and desktop responsive layouts with modern CSS.',
        status: 'To Do',
        priority: 'Critical',
        deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        clientId: cId,
        clientName,
        xpReward: 300,
        isDailyMission: false,
        estimatedHours: 12,
        actualHours: 0
      },
      {
        title: '4. CMS Modeling & Dynamic Data Integration',
        description: 'Setup headless CMS, dynamic schemas, content collections, and media assets.',
        status: 'To Do',
        priority: 'Medium',
        deadline: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
        clientId: cId,
        clientName,
        xpReward: 250,
        isDailyMission: false,
        estimatedHours: 6,
        actualHours: 0
      },
      {
        title: '5. Payment Gateway Webhook & Form Submissions',
        description: 'Configure and test Stripe/UPI payments, SSL tokens, and email notifications.',
        status: 'To Do',
        priority: 'High',
        deadline: new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0],
        clientId: cId,
        clientName,
        xpReward: 250,
        isDailyMission: false,
        estimatedHours: 4,
        actualHours: 0
      },
      {
        title: '6. Technical SEO & Core Web Vitals Optimization',
        description: 'Compress images, add OpenGraph metadata, structured schema, and 95+ PageSpeed audit.',
        status: 'To Do',
        priority: 'Medium',
        deadline: new Date(Date.now() + 13 * 86400000).toISOString().split('T')[0],
        clientId: cId,
        clientName,
        xpReward: 200,
        isDailyMission: false,
        estimatedHours: 4,
        actualHours: 0
      },
      {
        title: '7. Staging Walkthrough & Stakeholder Approval',
        description: 'Live staging preview demo session and feedback reconciliation.',
        status: 'To Do',
        priority: 'High',
        deadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        clientId: cId,
        clientName,
        xpReward: 200,
        isDailyMission: true,
        estimatedHours: 3,
        actualHours: 0
      },
      {
        title: '8. DNS Domain Cutover & Production Deployment',
        description: 'Point nameservers, verify SSL certificates, and monitor initial launch traffic.',
        status: 'To Do',
        priority: 'Critical',
        deadline: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
        clientId: cId,
        clientName,
        xpReward: 400,
        isDailyMission: false,
        estimatedHours: 3,
        actualHours: 0
      }
    ];

    sprintMissions.forEach(m => addTask(m));
    sound.playVictory();
    triggerConfetti();
    addToast({
      title: '⚡ 8-Mission Sprint Deployed!',
      description: `Complete development pipeline populated for ${clientName}.`,
      type: 'gold'
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedClientId,
        setSelectedClientId,
        openClientHQ,
        clients,
        projects,
        tasks,
        leads,
        invoices,
        transactions,
        documents,
        hostingDomains,
        communications,
        notifications,
        kingdomStats,
        soundEnabled,
        toggleSound,
        triggerConfetti,
        addClient,
        updateClient,
        deleteClient,
        addProject,
        updateProjectPhase,
        updateProjectApproval,
        addTask,
        toggleTaskStatus,
        deleteTask,
        addLead,
        updateLeadStatus,
        convertLeadToClient,
        addInvoice,
        markInvoicePaid,
        logPayment,
        logCommunication,
        addDocument,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllData,
        isSearchOpen,
        setIsSearchOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        activeModal,
        setActiveModal,
        toasts,
        addToast,
        removeToast,
        formatCurrency,
        gems,
        unlockedPerks,
        claimedAchievements,
        isGemForgeOpen,
        setIsGemForgeOpen,
        claimAchievement,
        unlockPerk,
        isPerkUnlocked,
        deployStandardSprint,
        getAchievementProgress,
        claimableAchievementsCount,
        trashedClients,
        isTrashOpen,
        setIsTrashOpen,
        moveToTrash,
        restoreFromTrash,
        permanentlyDeleteFromTrash,
        emptyTrash,
        cloudflareConfig,
        updateCloudflareConfig,
        isCloudflareSyncing,
        syncToCloudflare,
        restoreFromCloudflare
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
