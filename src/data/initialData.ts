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
  ProjectPhase,
  DashboardPerk,
  ClanAchievement
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
  gems: 15,
};

export const availablePerks: DashboardPerk[] = [
  {
    id: 'sprint_deployer',
    name: '1-Click Website Sprint Deployer',
    category: 'workflow',
    gemCost: 15,
    description: 'Instantly deploys a battle-tested 8-mission website development sprint with a single click.',
    benefit: 'Saves 15 mins of manual task entry per client project.',
    iconName: 'Zap'
  },
  {
    id: 'whatsapp_speed_dial',
    name: 'Instant WhatsApp Speed-Dispatcher',
    category: 'communication',
    gemCost: 15,
    description: 'Pre-formatted 1-click WhatsApp message triggers for milestone reviews, payment reminders, and launches.',
    benefit: 'Opens personalized WhatsApp Web messages directly in 1 second.',
    iconName: 'Send'
  },
  {
    id: 'pdf_invoice_stamp',
    name: 'Pro PDF Invoice & Paid Seal Stamper',
    category: 'billing',
    gemCost: 20,
    description: 'Generates official branded invoice prints, custom tax (GST) calculations, and verified paid settlement stamps.',
    benefit: 'Eliminates 3rd-party invoicing software expenses and looks ultra-professional.',
    iconName: 'Printer'
  },
  {
    id: 'domain_guardian',
    name: 'Domain & Server Automated Guardian',
    category: 'infrastructure',
    gemCost: 15,
    description: 'Automated SSL and registrar expiration alerts with 1-click renewal notification templates.',
    benefit: 'Guarantees zero risk of client website outages or lapsed domains.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'client_health_radar',
    name: 'VIP Client Diagnostic & Upsell Radar',
    category: 'intelligence',
    gemCost: 25,
    description: 'Algorithmic relationship health monitor with automatic retainer and SEO upsell revenue calculator.',
    benefit: 'Identifies high-value upsell opportunities to scale recurring revenue.',
    iconName: 'TrendingUp'
  }
];

export const availableAchievements: ClanAchievement[] = [
  {
    id: 'ach_level_2',
    title: 'Clan Castle Upgrade: Level 2',
    description: 'Advance your kingdom to Level 2 (Websmith) by earning XP.',
    gemReward: 10,
    xpReward: 250,
    targetCount: 2,
    category: 'level'
  },
  {
    id: 'ach_level_3',
    title: 'Clan Castle Upgrade: Level 3',
    description: 'Advance your kingdom to Level 3 (Digital Architect).',
    gemReward: 20,
    xpReward: 500,
    targetCount: 3,
    category: 'level'
  },
  {
    id: 'ach_first_client',
    title: 'First Alliance',
    description: 'Recruit and onboard your first client base.',
    gemReward: 10,
    xpReward: 150,
    targetCount: 1,
    category: 'clients'
  },
  {
    id: 'ach_three_clients',
    title: 'Clan Expansion',
    description: 'Recruit and manage 3 active client bases.',
    gemReward: 20,
    xpReward: 400,
    targetCount: 3,
    category: 'clients'
  },
  {
    id: 'ach_tasks_3',
    title: 'Skirmish Raider',
    description: 'Complete 3 battle tasks or daily sprint missions.',
    gemReward: 10,
    xpReward: 200,
    targetCount: 3,
    category: 'tasks'
  },
  {
    id: 'ach_tasks_8',
    title: 'Battle Hardened',
    description: 'Complete 8 operational battle tasks.',
    gemReward: 15,
    xpReward: 350,
    targetCount: 8,
    category: 'tasks'
  },
  {
    id: 'ach_revenue_50k',
    title: 'Gold Storage Vault',
    description: 'Collect ₹50,000 in verified milestone payments.',
    gemReward: 15,
    xpReward: 300,
    targetCount: 50000,
    category: 'revenue'
  },
  {
    id: 'ach_revenue_100k',
    title: 'Treasury Hoard',
    description: 'Reach ₹1,00,000 in total collected kingdom revenue.',
    gemReward: 30,
    xpReward: 800,
    targetCount: 100000,
    category: 'revenue'
  },
  {
    id: 'ach_project_launch',
    title: 'Empire Builder',
    description: 'Advance any project to Phase 10 or 11 (Deployment / Launch).',
    gemReward: 20,
    xpReward: 500,
    targetCount: 10,
    category: 'level'
  },
  {
    id: 'ach_domains_2',
    title: 'Fortified Infrastructure',
    description: 'Connect and monitor 2 domain / server infrastructure assets.',
    gemReward: 10,
    xpReward: 200,
    targetCount: 2,
    category: 'infrastructure'
  },
  {
    id: 'ach_comms_3',
    title: 'Diplomatic Envoy',
    description: 'Log 3 client phone calls, meetings, or WhatsApp discussions.',
    gemReward: 10,
    xpReward: 150,
    targetCount: 3,
    category: 'communication'
  }
];
