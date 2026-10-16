import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Plus,
  Volume2,
  VolumeX,
  Coins,
  Shield,
  Menu,
  X,
  Briefcase,
  Layers,
  Sparkles,
  Gem,
  UploadCloud,
  LogOut
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    kingdomStats,
    soundEnabled,
    toggleSound,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsSearchOpen,
    setActiveModal,
    setActiveView,
    openClientHQ,
    formatCurrency,
    gems,
    setIsGemForgeOpen,
    claimableAchievementsCount,
    cloudflareConfig,
    isCloudflareSyncing,
    syncToCloudflare
  } = useDashboard();
  const { user, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadNotifications = notifications.filter(n => !n.read);

  const xpPercent = Math.round((kingdomStats.currentXP / kingdomStats.maxXP) * 100);

  // OS detection for keyboard shortcut display (Ctrl K on Windows/Linux, ⌘K on macOS)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const searchShortcut = isMac ? '⌘K' : 'Ctrl K';

  // Click outside listener for notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <header className="sticky top-0 z-30 bg-[#0A0E17]/95 backdrop-blur-xl border-b border-[#1C2436] transition-all select-none">
      {/* Main Top Header Bar */}
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0">

        {/* Left: Hamburger + Brand / Citadel Crest + XP Bar */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#121826] hover:bg-[#182133] text-slate-300 hover:text-white border border-[#202B40] hover:border-[#C9A038]/50 flex items-center justify-center transition-all active:scale-95 shrink-0"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-[#ECC968]" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Citadel Brand Shield */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveView('command-center');
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#162033] to-[#0E1522] border border-[#C9A038]/40 group-hover:border-[#C9A038] group-hover:shadow-[0_0_12px_rgba(201,160,56,0.3)] flex items-center justify-center text-[#E5B842] transition-all shrink-0">
              <Shield className="w-4 h-4 fill-[#C9A038]/20 group-hover:scale-110 transition-transform" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-heading font-black text-xs sm:text-sm tracking-wider text-slate-100 group-hover:text-[#F3D37A] transition-colors truncate">
                  COMMAND<span className="hidden sm:inline"> CENTER</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-[#C9A038]/20 to-[#ECC968]/10 text-[#ECC968] border border-[#C9A038]/40 shadow-sm shrink-0">
                  TH-{kingdomStats.level || 1}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none truncate hidden sm:block">
                Freelance Web Citadel
              </p>
            </div>
          </div>

          {/* Level & XP Progress (Visible on Desktop >= 1280px) */}
          <div className="hidden xl:flex items-center gap-2.5 ml-2 pl-3 border-l border-[#1E2638]">
            <div className="flex flex-col justify-center">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 leading-none mb-1">
                <span className="text-slate-200 font-semibold">{kingdomStats.title}</span>
                <span className="text-slate-500">·</span>
                <span className="text-[#ECC968] font-bold font-mono">{kingdomStats.currentXP} / {kingdomStats.maxXP} XP</span>
              </div>
              <div className="w-28 h-1.5 bg-[#121826] rounded-full overflow-hidden border border-[#202B40]">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A038] to-[#ECC968] rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(201,160,56,0.5)]"
                  style={{ width: `${Math.min(100, Math.max(0, xpPercent))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Uniform Height Resource Vaults (Shown on lg+ Screens) */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 min-w-0">
          {/* Revenue Vault (Gold) */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveView('treasury');
            }}
            className="h-9 px-2.5 xl:px-3 rounded-xl bg-[#121826]/90 hover:bg-[#161F33] border border-[#1E273D] hover:border-[#C9A038]/50 flex items-center gap-2 transition-all cursor-pointer group shadow-sm shrink-0"
            title="Treasury Revenue"
          >
            <div className="w-6 h-6 rounded-lg bg-[#C9A038]/15 flex items-center justify-center shrink-0">
              <Coins className="w-3.5 h-3.5 text-[#ECC968] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-slate-300 tracking-wider mb-0.5">
                Revenue
              </span>
              <span className="text-xs font-bold text-slate-100 group-hover:text-[#F3D37A] transition-colors truncate">
                {formatCurrency(kingdomStats.goldRevenue)}
              </span>
            </div>
          </div>

          {/* Active Projects (Elixir) */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveView('projects');
            }}
            className="h-9 px-2.5 xl:px-3 rounded-xl bg-[#121826]/90 hover:bg-[#161F33] border border-[#1E273D] hover:border-[#0284C7]/50 flex items-center gap-2 transition-all cursor-pointer group shadow-sm shrink-0"
            title="Active Client Missions"
          >
            <div className="w-6 h-6 rounded-lg bg-[#0284C7]/15 flex items-center justify-center shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-[#38BDF8] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-slate-300 tracking-wider mb-0.5">
                Projects
              </span>
              <span className="text-xs font-bold text-slate-100 group-hover:text-[#7DD3FC] transition-colors truncate">
                {kingdomStats.elixirActiveProjects} Active
              </span>
            </div>
          </div>

          {/* Pending Invoices (Dark Elixir) */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveView('treasury');
            }}
            className="h-9 px-2.5 xl:px-3 rounded-xl bg-[#121826]/90 hover:bg-[#161F33] border border-[#1E273D] hover:border-[#8B5CF6]/50 flex items-center gap-2 transition-all cursor-pointer group shadow-sm shrink-0"
            title="Pending Milestone Invoices"
          >
            <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5 text-[#A78BFA] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-slate-300 tracking-wider mb-0.5">
                Pending
              </span>
              <span className="text-xs font-bold text-slate-100 group-hover:text-[#C4B5FD] transition-colors truncate">
                {formatCurrency(kingdomStats.darkElixirPending)}
              </span>
            </div>
          </div>

          {/* Scouted Leads (Intel) */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveView('leads');
            }}
            className="h-9 px-2.5 xl:px-3 rounded-xl bg-[#121826]/90 hover:bg-[#161F33] border border-[#1E273D] hover:border-[#10B981]/50 flex items-center gap-2 transition-all cursor-pointer group shadow-sm shrink-0"
            title="Scouted Client Leads"
          >
            <div className="w-6 h-6 rounded-lg bg-[#10B981]/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#34D399] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-slate-300 tracking-wider mb-0.5">
                Leads
              </span>
              <span className="text-xs font-bold text-slate-100 group-hover:text-[#6EE7B7] transition-colors truncate">
                {kingdomStats.gemsOpportunities} Scouted
              </span>
            </div>
          </div>

          {/* Gem Forge & Armory (Gems Vault) */}
          <div
            onClick={() => {
              sound.playClick();
              setIsGemForgeOpen(true);
            }}
            className="h-9 px-3 rounded-xl bg-gradient-to-r from-[#172138] to-[#141C2E] border border-[#C9A038]/50 hover:border-[#C9A038] hover:shadow-[0_0_12px_rgba(201,160,56,0.25)] flex items-center gap-2 transition-all cursor-pointer group shadow-sm shrink-0"
            title="Citadel Gem Forge & Armory"
          >
            <Gem className="w-4 h-4 text-[#ECC968] group-hover:scale-110 transition-transform shrink-0" />
            <div className="flex flex-col justify-center leading-none">
              <div className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-slate-300 tracking-wider flex items-center gap-1 mb-0.5">
                <span>Gems</span>
                {claimableAchievementsCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ECC968] animate-ping" />
                )}
              </div>
              <div className="text-xs font-black text-[#ECC968] flex items-center gap-1">
                <span>{gems}</span>
                {claimableAchievementsCount > 0 && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#C9A038] text-slate-950 font-black">
                    +{claimableAchievementsCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Search, Cloud Sync, Sound, Quick Add, Notifications */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile Gems Button (Only on < lg screens) */}
          <button
            onClick={() => {
              sound.playClick();
              setIsGemForgeOpen(true);
            }}
            className="lg:hidden h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg sm:rounded-xl bg-[#172138] border border-[#C9A038]/50 active:border-[#C9A038] text-[11px] sm:text-xs font-bold text-[#ECC968] flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-sm"
            title="Open Gem Forge"
          >
            <Gem className="w-3.5 h-3.5 text-[#ECC968]" />
            <span>{gems}</span>
            {claimableAchievementsCount > 0 && (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ECC968] animate-ping" />
            )}
          </button>

          {/* Global Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-lg sm:rounded-xl bg-[#121826] border border-[#1E273D] hover:border-[#C9A038]/50 text-slate-300 hover:text-white text-xs font-medium transition-all shrink-0 flex items-center justify-center sm:gap-2 group shadow-sm"
            title={`Search (${searchShortcut})`}
            aria-label="Global search"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ECC968] transition-colors" />
            <span className="hidden md:inline text-slate-300 group-hover:text-white">Search</span>
            <kbd className="hidden md:inline-flex items-center text-[10px] font-mono bg-[#182136] text-slate-400 group-hover:text-slate-200 px-1.5 py-0.5 rounded border border-[#232D42]">
              {searchShortcut}
            </kbd>
          </button>

          {/* Cloudflare Worker & D1 Quick Sync Button */}
          <button
            onClick={() => syncToCloudflare()}
            disabled={isCloudflareSyncing}
            className={`h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-2.5 rounded-lg sm:rounded-xl border transition-all shrink-0 flex items-center justify-center sm:gap-1.5 ${
              isCloudflareSyncing
                ? 'bg-[#F6821F]/15 border-[#F6821F] text-[#F6821F]'
                : 'bg-[#14151C] border-[#222738] hover:border-[#F6821F]/60 text-slate-300 hover:text-white'
            }`}
            title={
              cloudflareConfig.lastSyncedAt
                ? `Cloudflare D1 Synced at ${new Date(cloudflareConfig.lastSyncedAt).toLocaleTimeString()}`
                : 'Push backup to Cloudflare D1 via Worker'
            }
            aria-label="Cloudflare D1 Sync"
          >
            <div className="relative flex items-center justify-center">
              <UploadCloud className={`w-3.5 h-3.5 text-[#F6821F] ${isCloudflareSyncing ? 'animate-bounce' : ''}`} />
              {cloudflareConfig.lastSyncedAt && !isCloudflareSyncing && (
                <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
            <span className="hidden sm:inline text-[11px] font-semibold text-[#F6821F]">D1 Sync</span>
          </button>

          {/* Sound FX Toggle (Hidden on mobile to keep action bar uncluttered) */}
          <button
            onClick={toggleSound}
            className={`hidden sm:flex h-9 w-9 rounded-xl border items-center justify-center transition-all shrink-0 ${
              soundEnabled
                ? 'bg-[#C9A038]/10 border-[#C9A038]/40 text-[#ECC968] shadow-[0_0_8px_rgba(201,160,56,0.15)]'
                : 'bg-[#121826] border-[#1E273D] text-slate-400 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'SFX Audio On' : 'SFX Audio Muted'}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Quick Action Deploy Button */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('quick-action');
            }}
            className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-3 rounded-lg sm:rounded-xl btn-gold flex items-center justify-center sm:gap-1.5 text-xs font-bold tracking-wide shrink-0 shadow-sm cursor-pointer"
            title="Deploy New Mission, Client, or Task"
            aria-label="Create new item"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative shrink-0" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl border flex items-center justify-center transition-all relative ${
                showNotifications
                  ? 'bg-[#182136] border-[#C9A038]/50 text-white'
                  : 'bg-[#121826] border-[#1E273D] hover:border-[#C9A038]/50 text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#C9A038] text-slate-950 font-black text-[8px] sm:text-[9px] flex items-center justify-center shadow-[0_0_8px_rgba(201,160,56,0.6)]">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Menu Card */}
            {showNotifications && (
              <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto top-16 sm:top-11 sm:right-0 mt-1 sm:w-80 rounded-2xl bg-[#111728] border border-[#222E46] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-[#1E2638] flex items-center justify-between bg-[#151D30]">
                  <span className="font-heading font-bold text-xs text-slate-200">Alerts & Notices</span>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-[#ECC968] hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#1E2638]/60 text-xs">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3 transition-colors hover:bg-[#182238] ${!n.read ? 'bg-[#C9A038]/5' : ''}`}
                      >
                        <div className="font-semibold text-slate-200">{n.title}</div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                        {n.actionLabel && (
                          <button
                            onClick={() => {
                              markNotificationRead(n.id);
                              setShowNotifications(false);
                              if (n.clientId) openClientHQ(n.clientId);
                              else if (n.actionView) setActiveView(n.actionView as any);
                            }}
                            className="mt-2 text-[10px] text-[#ECC968] font-bold hover:underline block"
                          >
                            {n.actionLabel} →
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin User / Logout Button */}
          <button
            onClick={() => {
              sound.playClick();
              logout();
            }}
            className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg sm:rounded-xl bg-[#141B2D] border border-[#232F48] hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-300 hover:text-rose-200 flex items-center gap-1.5 transition-all shrink-0 text-xs font-semibold group cursor-pointer"
            title={`Logged in as ${user?.email || 'admin@citadel.com'} • Click to Sign Out`}
            aria-label="Sign Out"
          >
            <div className="w-5 h-5 rounded bg-[#C9A038]/20 border border-[#C9A038]/50 text-[#ECC968] flex items-center justify-center text-[10px] font-black group-hover:border-rose-400 group-hover:text-rose-300">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="hidden xl:inline text-[11px] max-w-[100px] truncate text-slate-300 group-hover:text-rose-200">
              {user?.email?.split('@')[0] || 'Admin'}
            </span>
            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>

      </div>

      {/* Mobile / Tablet Quick-Stats Ribbon (< lg screens) */}
      <div className="lg:hidden border-t border-[#161F33] bg-[#090D15]/95 px-2 sm:px-3 py-1.5 shadow-inner">
        <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full">
          {/* Revenue */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('treasury');
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2.5 py-1 rounded-lg bg-[#111726] border border-[#1E273D] active:border-[#C9A038]/60 text-left transition-all active:scale-95 min-w-0"
            title={`Revenue: ${formatCurrency(kingdomStats.goldRevenue)}`}
          >
            <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ECC968] shrink-0" />
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">REV:</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-100 truncate">{formatCurrency(kingdomStats.goldRevenue)}</span>
          </button>

          {/* Projects */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('projects');
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2.5 py-1 rounded-lg bg-[#111726] border border-[#1E273D] active:border-[#0284C7]/60 text-left transition-all active:scale-95 min-w-0"
            title={`Active Projects: ${kingdomStats.elixirActiveProjects}`}
          >
            <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#38BDF8] shrink-0" />
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">PROJECTS:</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-100 truncate">{kingdomStats.elixirActiveProjects}</span>
          </button>

          {/* Pending */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('treasury');
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2.5 py-1 rounded-lg bg-[#111726] border border-[#1E273D] active:border-[#8B5CF6]/60 text-left transition-all active:scale-95 min-w-0"
            title={`Pending: ${formatCurrency(kingdomStats.darkElixirPending)}`}
          >
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#A78BFA] shrink-0" />
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">PENDING:</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-100 truncate">{formatCurrency(kingdomStats.darkElixirPending)}</span>
          </button>

          {/* Leads */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('leads');
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2.5 py-1 rounded-lg bg-[#111726] border border-[#1E273D] active:border-[#10B981]/60 text-left transition-all active:scale-95 min-w-0"
            title={`Leads Scouted: ${kingdomStats.gemsOpportunities}`}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#34D399] shrink-0" />
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">LEADS:</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-100 truncate">{kingdomStats.gemsOpportunities}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
