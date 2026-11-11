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
  ProjectPhase
} from '../types';

export const standardProjectPhases: { id: number; name: string; description: string }[] = [
  { id: 1, name: 'Lead', description: 'Initial contact and feasibility evaluation' },
  { id: 2, name: 'Requirement Gathering', description: 'Briefing, sitemap, functional specs and user stories' },
  { id: 3, name: 'Proposal', description: 'Scope document, commercial quotation & timeline' },
  { id: 4, name: 'Advance Payment', description: '50% initial commitment deposit cleared' },
  { id: 5, name: 'Design', description: 'UI/UX wireframes, visual style guide & mockups' },
  { id: 6, name: 'Development', description: 'Frontend code, CMS integration & responsive layouts' },
  { id: 7, name: 'Client Review', description: 'Staging preview walk-through & initial feedback' },
  { id: 8, name: 'Revisions', description: 'Polishing typography, copy tweaks & layout adjustments' },
  { id: 9, name: 'Final Payment', description: 'Remaining milestone settlement verification' },
  { id: 10, name: 'Deployment', description: 'Domain DNS pointing, SSL activation & production launch' },
  { id: 11, name: 'Maintenance', description: 'Post-launch support, backups & uptime monitoring' },
];

export const createPhasesForProject = (currentPhaseIndex: number): ProjectPhase[] => {
  return standardProjectPhases.map((phase, idx) => ({
    ...phase,
    status: idx < currentPhaseIndex ? 'Completed' : idx === currentPhaseIndex ? 'Current' : 'Locked',
    completedAt: idx < currentPhaseIndex ? new Date().toISOString().split('T')[0] : undefined,
  }));
};

// Default empty data as requested
export const initialClients: Client[] = [];
export const initialProjects: Project[] = [];
export const initialTasks: Task[] = [];
export const initialLeads: Lead[] = [];
export const initialInvoices: Invoice[] = [];
export const initialTransactions: PaymentTransaction[] = [];
export const initialDocuments: DocumentItem[] = [];
export const initialHostingDomains: HostingDomain[] = [];
export const initialCommunications: Communication[] = [];
export const initialNotifications: NotificationItem[] = [];

export const initialKingdomStats: KingdomStats = {
  level: 1,
  title: 'Novice Builder',
  currentXP: 0,
  maxXP: 1000,
  goldRevenue: 0,
  goldCapacity: 100000,
  elixirActiveProjects: 0,
  elixirCapacity: 5,
  darkElixirPending: 0,
  gemsOpportunities: 0,
  monthlyRevenue: 0,
  collectedRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
};
