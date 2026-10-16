import React from 'react';
import {
  Castle,
  Users,
  FolderGit2,
  Swords,
  Binoculars,
  Coins,
  Receipt,
  Library,
  Hammer,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  ShieldAlert,
  Shield,
  X,
  Gem,
  Sparkles,
  Trash2,
  LogOut
} from 'lucide-react';
import { useDashboard, ActiveView } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const {
    activeView,
    setActiveView,
    kingdomStats,
    tasks,
    invoices,
    hostingDomains,
    leads,
    clients,
    gems,
    setIsGemForgeOpen,
    claimableAchievementsCount,
    trashedClients,
    setIsTrashOpen
  } = useDashboard();
  const { user, logout } = useAuth();

  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const overdueInvoicesCount = invoices.filter(i => i.status === 'Overdue').length;
  const expiringDomainsCount = hostingDomains.filter(h => h.daysUntilDomainExpiry <= 30 || h.daysUntilHostingExpiry <= 14).length;
  const activeLeadsCount = leads.filter(l => l.status !== 'Lost' && l.status !== 'Won').length;

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number | string; badgeAlert?: boolean }[] = [
    { id: 'command-center', label: 'Command Center', icon: <Castle className="w-4 h-4" /> },
    { id: 'clients', label: 'Clients', icon: <Users className="w-4 h-4" />, badge: clients.length },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks & Missions', icon: <Swords className="w-4 h-4" />, badge: pendingTasksCount },
    { id: 'leads', label: 'Leads Pipeline', icon: <Binoculars className="w-4 h-4" />, badge: activeLeadsCount },
    { id: 'treasury', label: 'Treasury & Revenue', icon: <Coins className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <Receipt className="w-4 h-4" />, badge: overdueInvoicesCount > 0 ? `${overdueInvoicesCount} Overdue` : undefined, badgeAlert: overdueInvoicesCount > 0 },
    { id: 'documents', label: 'Documents', icon: <Library className="w-4 h-4" /> },
    { id: 'hosting', label: 'Hosting & Domains', icon: <Hammer className="w-4 h-4" />, badge: expiringDomainsCount > 0 ? expiringDomainsCount : undefined, badgeAlert: expiringDomainsCount > 0 },
    { id: 'communications', label: 'Communications', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleNavClick = (id: ActiveView) => {
    sound.playClick();
    setActiveView(id);
    onCloseMobileMenu();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A0D14] w-64 sm:w-60 select-none text-xs">
      {/* Mobile Drawer Header */}
      <div className="lg:hidden p-3.5 border-b border-[#1E2638] flex items-center justify-between bg-[#0E131E]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#162033] to-[#0E1522] border border-[#C9A038]/40 flex items-center justify-center text-[#E5B842]">
            <Shield className="w-3.5 h-3.5 fill-[#C9A038]/20" />
          </div>
          <div>
            <div className="font-heading font-black text-xs text-slate-100 flex items-center gap-1.5 leading-none">
              <span>CITADEL NAV</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#C9A038]/15 text-[#ECC968] border border-[#C9A038]/30">
                TH-{kingdomStats?.level || 1}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Control Center</div>
          </div>
        </div>
        <button
          onClick={onCloseMobileMenu}
          className="w-7 h-7 rounded-lg bg-[#141A29] border border-[#232D42] text-slate-400 hover:text-white flex items-center justify-center transition-colors active:scale-95"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(item => {
          const isActive = activeView === item.id || (item.id === 'clients' && activeView === 'client-hq');
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-[#151C2C] text-[#ECC968] border border-[#C9A038]/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121826] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-[#ECC968]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  item.badgeAlert
                    ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                    : 'bg-[#141A29] text-slate-400 border border-[#232D42]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Expiry Warning Callout at Bottom if any */}
      {expiringDomainsCount > 0 && (
        <div 
          onClick={() => handleNavClick('hosting')}
          className="m-3 p-2.5 rounded-xl bg-[#141B2B] border border-[#C9A038]/30 cursor-pointer hover:border-[#C9A038] transition-all text-xs"
        >
          <div className="flex items-center gap-1.5 text-[#ECC968] font-bold text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Infrastructure Alert
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {expiringDomainsCount} renewal due soon.
          </p>
        </div>
      )}

      {/* Gem Forge & Armory Trigger */}
      <div 
        onClick={() => {
          sound.playClick();
          setIsGemForgeOpen(true);
          onCloseMobileMenu();
        }}
        className="mx-2 mb-2 p-3 rounded-xl bg-[#141B2B] border border-[#C9A038]/40 hover:border-[#C9A038] cursor-pointer transition-all text-xs group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#ECC968] font-bold text-xs">
            <Gem className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Gem Forge</span>
          </div>
          <span className="font-bold text-[#ECC968] bg-[#C9A038]/20 px-2 py-0.5 rounded-full text-[10px] border border-[#C9A038]/30 flex items-center gap-1">
            <Gem className="w-3 h-3 text-[#ECC968]" />
            <span>{gems}</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {claimableAchievementsCount > 0
            ? `✨ ${claimableAchievementsCount} milestone reward ready!`
            : 'Unlock speed tools & shortcuts'}
        </p>
      </div>

      {/* Trashed Items Shortcut */}
      {trashedClients.length > 0 && (
        <button
          onClick={() => {
            sound.playClick();
            setIsTrashOpen(true);
            onCloseMobileMenu();
          }}
          className="mx-2 mb-2 p-2.5 rounded-xl bg-[#171116] hover:bg-[#251522] border border-[#331C26] hover:border-rose-500/40 text-slate-300 hover:text-white flex items-center justify-between transition-all text-xs group"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-rose-200">Trash Can</span>
          </div>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
            {trashedClients.length}
          </span>
        </button>
      )}

      {/* Admin Profile & Logout */}
      <div className="p-2.5 mx-2 mb-2 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#C9A038]/40 flex items-center justify-center text-[#ECC968] font-black text-xs shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-200 truncate leading-tight">
              {user?.email || 'admin@citadel.com'}
            </div>
            <div className="text-[9px] text-[#ECC968] font-semibold uppercase tracking-wider">
              {user?.role || 'Administrator'}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            logout();
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Sign Out of Citadel"
          aria-label="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#1E2638] text-[11px] text-slate-500 flex items-center justify-between">
        <span>Citadel Command</span>
        <span className="text-[#C9A038] font-semibold">Active</span>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col shrink-0 h-full w-60 bg-[#0A0D14] border-r border-[#1E2638]">
        {sidebarContent}
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div onClick={onCloseMobileMenu} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 h-full max-w-[80vw] shadow-2xl border-r border-[#1E2638]">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
