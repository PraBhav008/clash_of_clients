import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  RotateCcw,
  Coins,
  Trash2,
  Database,
  Cloud,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Info,
  FileCode,
  ShieldCheck,
  Lock,
  Key,
  Mail,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';
import { testCloudflareConnection, getSavedCloudflareConfig, getWorkerBaseUrl } from '../utils/cloudflareD1';
import { WORKER_CONFIG } from '../config/cloudflare';

export const SettingsView: React.FC = () => {
  const {
    soundEnabled,
    toggleSound,
    triggerConfetti,
    clearAllData,
    cloudflareConfig,
    updateCloudflareConfig,
    isCloudflareSyncing,
    syncToCloudflare,
    restoreFromCloudflare
  } = useDashboard();

  const [agencyName, setAgencyName] = useState('Webcraft Citadel');
  const [freelancerName, setFreelancerName] = useState('Bhavsar Prathmesh');
  const [currency] = useState('₹ (INR)');

  // Cloudflare D1 Local UI State
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Admin Auth State
  const { user, logout, updateCredentials } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState(user?.email || 'raisstudio100k@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [credStatus, setCredStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredStatus(null);
    if (!currentPassword.trim() || !newEmail.trim() || !newPassword.trim()) {
      setCredStatus({ type: 'error', message: 'All credential fields are required.' });
      sound.playClick();
      return;
    }

    setIsUpdatingCreds(true);
    sound.playClick();

    const res = await updateCredentials(currentPassword.trim(), newEmail.trim(), newPassword.trim());
    setIsUpdatingCreds(false);

    if (res.success) {
      sound.playUpgrade();
      setCredStatus({
        type: 'success',
        message: 'Admin credentials updated successfully! Changes are active across all connected devices.'
      });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      sound.playClick();
      setCredStatus({
        type: 'error',
        message: res.error || 'Failed to update credentials. Check your current password.'
      });
    }
  };

  const handleResetData = () => {
    if (window.confirm('Clear all stored dashboard data and start fresh?')) {
      clearAllData();
      sound.playClick();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Return Button */}
      <div>
        <ReturnButton />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#C9A038]" />
          Settings & Command Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Audio effects, agency branding, and keyboard shortcuts
        </p>
      </div>

      {/* Sound Effects & Haptics */}
      <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${soundEnabled ? 'bg-[#C9A038]/10 text-[#ECC968] border border-[#C9A038]/30' : 'bg-[#151C2C] text-slate-400'}`}>
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-100">
                Strategy Game Sound Effects (Web Audio API)
              </h3>
              <p className="text-xs text-slate-400">Audio feedback on gold deposits, phase advancements, and completed missions</p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              soundEnabled
                ? 'btn-gold'
                : 'btn-dark'
            }`}
          >
            {soundEnabled ? 'Sound ON' : 'Sound Muted'}
          </button>
        </div>

        <div className="pt-2 border-t border-[#1E2638] flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => sound.playGold()}
            className="px-3 py-1.5 rounded-lg bg-[#151C2C] hover:bg-[#1A2234] text-slate-200 border border-[#232D42] flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5 text-[#C9A038]" />
            <span>Test Gold Clink</span>
          </button>

          <button
            onClick={() => {
              sound.playVictory();
              triggerConfetti();
            }}
            className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            Test Victory Fanfare 🎺
          </button>
        </div>
      </div>

      {/* Admin Authentication & Multi-Device Access */}
      <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C9A038]/15 text-[#ECC968] border border-[#C9A038]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-slate-100">
                  Admin Access & Multi-Device Security
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#C9A038]/15 text-[#ECC968] border border-[#C9A038]/30">
                  Active Session
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <span className="text-slate-200 font-semibold">{user?.email || 'raisstudio100k@gmail.com'}</span> · Credentials sync via Cloudflare D1
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              logout();
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Change Credentials Form */}
        <form onSubmit={handleUpdateCredentials} className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E2638] space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Key className="w-3.5 h-3.5 text-[#ECC968]" />
            <span>Update Admin Email & Password</span>
          </div>

          {credStatus && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              credStatus.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {credStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{credStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 bg-[#141B2D] border border-[#232F48] rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#C9A038]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                New Admin Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="raisstudio100k@gmail.com"
                className="w-full px-3 py-2 bg-[#141B2D] border border-[#232F48] rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#C9A038]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-3 py-2 bg-[#141B2D] border border-[#232F48] rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#C9A038]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Updating here updates the D1 database edge immediately.
            </span>
            <button
              type="submit"
              disabled={isUpdatingCreds}
              className="btn-gold px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingCreds ? 'Updating Edge...' : 'Save & Sync Credentials'}
            </button>
          </div>
        </form>
      </div>

      {/* Cloudflare Worker & D1 Database Edge Sync */}
      <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F6821F]/10 text-[#F6821F] border border-[#F6821F]/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-slate-100">
                  Cloudflare Worker + D1 Database Sync
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#F6821F]/15 text-[#F6821F] border border-[#F6821F]/30">
                  Worker + D1 Edge
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Edge database architecture · Zero Cloudflare API tokens in browser bundle · Native <code className="text-[#ECC968]">env.DB</code> bindings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {cloudflareConfig.lastSyncedAt ? (
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Synced {new Date(cloudflareConfig.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 bg-[#151C2C] border border-[#232D42] px-2.5 py-1 rounded-lg">
                Not synced yet
              </span>
            )}
          </div>
        </div>

        {/* Secure Architecture Status Card */}
        <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#232D42] space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1E2638]">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Production Security: Verified</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              React → Worker → env.DB → D1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#121826] border border-[#1E2638]">
              <span className="text-[10px] uppercase font-sans text-slate-500 block">Worker Endpoint</span>
              <span className="text-slate-200 truncate block mt-0.5 font-semibold">
                {getWorkerBaseUrl() || '(relative /api)'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#121826] border border-[#1E2638]">
              <span className="text-[10px] uppercase font-sans text-slate-500 block">D1 Database Binding</span>
              <span className="text-slate-200 block mt-0.5 font-semibold">
                env.DB (Cloudflare D1 Edge)
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            All database queries execute on Cloudflare Workers via native D1 bindings. Cloudflare master credentials and database UUIDs remain securely on the server.
          </p>
        </div>

        {/* Test Result Callout if available */}
        {testResult && (
          <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
            testResult.success
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="flex-1">{testResult.message}</span>
            <button
              onClick={() => setTestResult(null)}
              className="text-slate-400 hover:text-white text-[11px] underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#1E2638] flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                setIsTesting(true);
                setTestResult(null);
                sound.playClick();
                const res = await testCloudflareConnection();
                setIsTesting(false);
                setTestResult(res);
                if (res.success) sound.playVictory();
              }}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-lg bg-[#151C2C] hover:bg-[#1C253B] text-slate-200 border border-[#232D42] hover:border-[#F6821F]/40 flex items-center gap-1.5 font-medium transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F6821F] ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Pinging Worker...' : 'Test D1 Connection'}</span>
            </button>

            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-all"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>{showSetupGuide ? 'Hide Deploy Guide' : 'Worker Setup & Deploy Guide'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (window.confirm('Restore from Cloudflare D1? This will overwrite local dashboard state with the latest cloud database snapshot.')) {
                  await restoreFromCloudflare();
                }
              }}
              disabled={isCloudflareSyncing}
              className="px-3 py-1.5 rounded-lg bg-[#151C2C] hover:bg-[#1E273D] text-slate-200 border border-[#232D42] flex items-center gap-1.5 font-medium transition-all"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-[#C9A038]" />
              <span>Restore from Cloud</span>
            </button>

            <button
              onClick={() => syncToCloudflare()}
              disabled={isCloudflareSyncing}
              className="px-3.5 py-1.5 rounded-lg bg-[#F6821F] hover:bg-[#FF8E2D] text-white font-semibold flex items-center gap-1.5 shadow-md shadow-[#F6821F]/20 transition-all disabled:opacity-50"
            >
              <UploadCloud className={`w-3.5 h-3.5 stroke-[2.5] ${isCloudflareSyncing ? 'animate-bounce' : ''}`} />
              <span>{isCloudflareSyncing ? 'Syncing to Worker...' : 'Push Snapshot to D1'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Setup & Deployment Guide */}
        {showSetupGuide && (
          <div className="p-4 rounded-xl bg-[#0A0D14] border border-[#232D42] space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between text-[#F6821F] font-bold">
              <span>Cloudflare Worker + D1 Deployment Checklist</span>
              <a
                href="https://dash.cloudflare.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] underline text-slate-400 hover:text-white"
              >
                <span>Cloudflare Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300 font-mono">
              <div className="p-2 rounded bg-[#121826] border border-[#1E2638]">
                <span className="text-slate-500 font-sans block mb-1">Step 1: Install Wrangler CLI</span>
                <code className="text-[#ECC968]">npm install -g wrangler</code> (or <code className="text-[#ECC968]">npx wrangler login</code>)
              </div>

              <div className="p-2 rounded bg-[#121826] border border-[#1E2638]">
                <span className="text-slate-500 font-sans block mb-1">Step 2: Bind Existing D1 Database in worker/wrangler.toml</span>
                <span className="text-slate-400 font-sans block">Put your existing D1 database UUID in <code className="text-[#ECC968]">worker/wrangler.toml</code>:</span>
                <code className="text-slate-200 block mt-1">database_id = "your-existing-d1-uuid"</code>
              </div>

              <div className="p-2 rounded bg-[#121826] border border-[#1E2638]">
                <span className="text-slate-500 font-sans block mb-1">Step 3: Deploy Worker Backend</span>
                <code className="text-[#ECC968]">cd worker && npx wrangler deploy</code>
              </div>

              <div className="p-2 rounded bg-[#121826] border border-[#1E2638]">
                <span className="text-slate-500 font-sans block mb-1">Step 4: Set Optional Secret Key</span>
                <code className="text-[#ECC968]">npx wrangler secret put DASHBOARD_API_KEY</code>
              </div>

              <div className="p-2 rounded bg-[#121826] border border-[#1E2638]">
                <span className="text-slate-500 font-sans block mb-1">Step 5: Configure React Frontend</span>
                <span className="text-slate-400 font-sans block">Set <code className="text-[#ECC968]">WORKER_URL</code> in <code className="text-[#ECC968]">src/config/cloudflare.ts</code> or <code className="text-[#ECC968]">.env</code>:</span>
                <code className="text-slate-200 block mt-1">VITE_WORKER_URL=https://citadel-edge-api.your-subdomain.workers.dev</code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Agency Branding Details */}
      <div className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
        <h3 className="font-heading font-bold text-sm text-slate-100">
          Agency Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={e => setAgencyName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none focus:border-[#C9A038]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Freelancer Name</label>
            <input
              type="text"
              value={freelancerName}
              onChange={e => setFreelancerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-slate-200 outline-none focus:border-[#C9A038]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Currency</label>
            <input
              type="text"
              disabled
              value={currency}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0D14]/60 border border-[#232D42] text-slate-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Keyboard Shortcuts</label>
            <div className="p-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-[11px] text-slate-400">
              <kbd className="px-1.5 py-0.5 rounded bg-[#151C2C] text-slate-200 border border-[#232D42]">Ctrl + K</kbd> Global Search · <kbd className="px-1.5 py-0.5 rounded bg-[#151C2C] text-slate-200 border border-[#232D42]">Esc</kbd> Dismiss
            </div>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-xs text-slate-200">
            Clear Local Storage
          </h4>
          <p className="text-[11px] text-slate-400">Permanently clears stored projects, clients, tasks, and starts with empty data</p>
        </div>

        <button
          onClick={handleResetData}
          className="btn-dark px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-rose-300 hover:border-rose-500/50"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Clear All Data</span>
        </button>
      </div>

    </div>
  );
};
