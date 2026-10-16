export type ClientStatus = 'Active' | 'Waiting' | 'Prospect' | 'Payment Pending' | 'At Risk' | 'Completed';
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Waiting for Client' | 'Review' | 'Completed';
export type LeadStatus = 'Discovered' | 'Contacted' | 'Interested' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';
export type CommunicationType = 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Internal Note';

export interface ProjectPhase {
  id: number;
  name: string;
  description: string;
  status: 'Completed' | 'Current' | 'Locked';
  completedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  avatar: string;
  email: string;
  phone: string;
  website?: string;
  status: ClientStatus;
  currentProjectId?: string;
  projectValue: number;
  amountPaid: number;
  amountPending: number;
  nextDeadline: string;
  lastCommunication: string;
  healthScore: number; // 0 - 100
  healthStatus: 'Excellent' | 'Good' | 'Needs Attention' | 'At Risk';
  priority: PriorityLevel;
  tags: string[];
  notes: string;
  billingAddress: string;
  joinedDate: string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  websiteType: string; // e.g. E-Commerce, Corporate, SaaS, Portfolio
  projectValue: number;
  amountPaid: number;
  amountPending: number;
  startDate: string;
  expectedLaunch: string;
  currentPhaseIndex: number; // 0 to 10 (11 phases)
  phases: ProjectPhase[];
  completionPercentage: number;
  revisionsCount: number;
  maxRevisions: number;
  approvalStatus: 'Approved' | 'In Review' | 'Revision Requested';
  liveUrl?: string;
  previewUrl?: string;
  repoUrl?: string;
  notes?: string;
}

export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: TaskStatus;
  deadline: string;
  estimatedHours: number;
  actualHours: number;
  notes?: string;
  isDailyMission: boolean;
  xpReward: number;
  completedAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  industry: string;
  contact: string;
  email: string;
  phone: string;
  source: string;
  potentialValue: number;
  status: LeadStatus;
  probability: number; // 0 - 100
  lastContact: string;
  nextFollowUp: string;
  notes: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  projectId: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceId?: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  type: 'Advance Payment' | 'Milestone Payment' | 'Final Payment' | 'Maintenance Retainer';
  method: 'UPI / Bank Transfer' | 'Credit Card' | 'Stripe' | 'PayPal' | 'Cash';
  referenceNo: string;
  note?: string;
}

export interface DocumentItem {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  title: string;
  category: 'Contract' | 'Proposal' | 'Invoice' | 'Brand Asset' | 'Requirements' | 'Credentials & Access';
  fileType: 'pdf' | 'figma' | 'zip' | 'doc' | 'key' | 'img';
  fileSize: string;
  uploadDate: string;
  url: string;
  confidential: boolean;
  credentialData?: {
    service: string;
    username: string;
    notes?: string;
  };
}

export interface HostingDomain {
  id: string;
  clientId: string;
  clientName: string;
  domain: string;
  domainProvider: string;
  domainExpiryDate: string;
  daysUntilDomainExpiry: number;
  hostingProvider: string;
  hostingExpiryDate: string;
  daysUntilHostingExpiry: number;
  sslStatus: 'Active' | 'Expiring' | 'Expired';
  deploymentPlatform: string;
  repoUrl: string;
  database: string;
  websiteUrl: string;
  adminUrl: string;
  maintenanceStatus: 'Active Retainer' | 'On Demand' | 'Expired';
}

export interface Communication {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  type: CommunicationType;
  summary: string;
  keyPoints: string[];
  nextAction: string;
  nextActionDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionView?: string;
  clientId?: string;
  invoiceId?: string;
}

export interface KingdomStats {
  level: number;
  title: string;
  currentXP: number;
  maxXP: number;
  goldRevenue: number;
  goldCapacity: number;
  elixirActiveProjects: number;
  elixirCapacity: number;
  darkElixirPending: number;
  gemsOpportunities: number;
  monthlyRevenue: number;
  collectedRevenue: number;
  totalExpenses: number;
  netProfit: number;
  gems: number;
}

export type PerkId = 
  | 'sprint_deployer'
  | 'whatsapp_speed_dial'
  | 'pdf_invoice_stamp'
  | 'domain_guardian'
  | 'client_health_radar';

export interface DashboardPerk {
  id: PerkId;
  name: string;
  category: 'workflow' | 'billing' | 'communication' | 'infrastructure' | 'intelligence';
  gemCost: number;
  description: string;
  benefit: string;
  iconName: string;
}

export interface ClanAchievement {
  id: string;
  title: string;
  description: string;
  gemReward: number;
  xpReward: number;
  targetCount: number;
  category: 'level' | 'tasks' | 'clients' | 'revenue' | 'infrastructure' | 'communication';
}

export interface TrashedClientBundle {
  client: Client;
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  transactions: PaymentTransaction[];
  documents: DocumentItem[];
  hostingDomains: HostingDomain[];
  communications: Communication[];
  deletedAt: string;
}

export interface CloudflareD1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface CloudflareSyncPayload {
  version: string;
  syncedAt: string;
  clients: Client[];
  trashedClients: TrashedClientBundle[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  transactions: PaymentTransaction[];
  documents: DocumentItem[];
  hostingDomains: HostingDomain[];
  communications: Communication[];
  leads: Lead[];
  kingdomStats: KingdomStats;
  gems: number;
  unlockedPerkIds: string[];
}


