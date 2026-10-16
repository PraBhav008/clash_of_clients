import React, { useState } from 'react';
import {
  Trash2,
  X,
  RotateCcw,
  AlertTriangle,
  FolderGit2,
  Swords,
  Receipt,
  Globe,
  Library,
  MessageSquare,
  Shield,
  Building2,
  Clock
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { sound } from '../../utils/audio';

export const TrashCanModal: React.FC = () => {
  const {
    trashedClients,
    isTrashOpen,
    setIsTrashOpen,
    restoreFromTrash,
    permanentlyDeleteFromTrash,
    emptyTrash,
    formatCurrency
  } = useDashboard();

  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const [selectedToErase, setSelectedToErase] = useState<string | null>(null);

  if (!isTrashOpen) return null;

  const handleClose = () => {
    sound.playClick();
    setIsTrashOpen(false);
    setConfirmEmpty(false);
    setSelectedToErase(null);
  };

  const handleRestore = (id: string) => {
    restoreFromTrash(id);
  };

  const handlePermanentDelete = (id: string) => {
    permanentlyDeleteFromTrash(id);
    setSelectedToErase(null);
  };

  const handleEmptyAll = () => {
    emptyTrash();
    setConfirmEmpty(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-2xl bg-gradient-to-b from-[#161219] via-[#100D15] to-[#0A0D14] border border-[#2A1E29] hover:border-[#EF4444]/40 rounded-2xl shadow-[0_0_50px_-10px_rgba(239,68,68,0.2)] overflow-hidden transition-all duration-300 relative flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle red warning top strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#EF4444]/60 to-transparent" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#231822] flex items-center justify-between bg-[#191017]/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25121B] border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] shadow-sm shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-slate-100">
                  Citadel Trash Can
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                  {trashedClients.length} {trashedClients.length === 1 ? 'Client' : 'Clients'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Safely restore clients or completely erase their records permanently
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trashedClients.length > 0 && !confirmEmpty && (
              <button
                type="button"
                onClick={() => setConfirmEmpty(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#25121B] hover:bg-[#341620] text-[#EF4444] border border-[#EF4444]/30 hover:border-[#EF4444]/60 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Empty Trash Can</span>
                <span className="sm:hidden">Empty</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Confirmation banner when Empty Trash is clicked */}
        {confirmEmpty && (
          <div className="p-3.5 bg-[#2B141B] border-b border-[#EF4444]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
              <span>
                Permanently erase all <strong>{trashedClients.length}</strong> clients and all their records? This cannot be undone.
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setConfirmEmpty(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmptyAll}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-[#DC2626] hover:bg-[#EF4444] text-white shadow-md transition-all"
              >
                Yes, Empty All
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {trashedClients.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#140F16] border border-[#231822] flex items-center justify-center text-slate-500 mx-auto">
                <Trash2 className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">The Trash Can is Empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Deleted clients are safely held here before permanent erasure, so you never lose data by accident.
                </p>
              </div>
            </div>
          ) : (
            trashedClients.map(bundle => {
              const { client, projects, tasks, invoices, hostingDomains, documents, communications, deletedAt } = bundle;
              const formattedDate = new Date(deletedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={client.id}
                  className="p-4 rounded-xl bg-[#0E0B12] border border-[#261924] hover:border-[#EF4444]/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  {/* Client Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#231822] shrink-0 opacity-80"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-200 truncate">
                          {client.company}
                        </h4>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <span>Deleted {formattedDate}</span>
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Contact: <strong className="text-slate-300">{client.name}</strong> · {client.phone}
                      </p>

                      {/* Preserved Data Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-[#16101A] text-slate-400 border border-[#281825] flex items-center gap-1">
                          <FolderGit2 className="w-3 h-3 text-slate-500" />
                          <span>{projects.length} Projects</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#16101A] text-slate-400 border border-[#281825] flex items-center gap-1">
                          <Swords className="w-3 h-3 text-slate-500" />
                          <span>{tasks.length} Tasks</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#16101A] text-slate-400 border border-[#281825] flex items-center gap-1">
                          <Receipt className="w-3 h-3 text-slate-500" />
                          <span>{invoices.length} Invoices</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#16101A] text-slate-400 border border-[#281825] flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-500" />
                          <span>{hostingDomains.length} Domains</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#16101A] text-slate-400 border border-[#281825] flex items-center gap-1">
                          <Library className="w-3 h-3 text-slate-500" />
                          <span>{documents.length} Docs</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRestore(client.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121A15] hover:bg-[#18261F] text-[#4ADE80] border border-[#22C55E]/30 hover:border-[#22C55E]/60 transition-all flex items-center gap-1.5 shadow-sm"
                      title="Restore client and all associated data"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedToErase(client.id)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#25121B] hover:bg-[#341620] text-[#EF4444] border border-[#EF4444]/30 hover:border-[#EF4444]/60 transition-all flex items-center gap-1"
                      title="Erase completely forever"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Erase</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Confirmation Modal to Erase Single Client */}
        {selectedToErase && (
          <div className="p-4 bg-[#201016] border-t border-[#EF4444]/30 flex items-center justify-between gap-3 animate-fadeIn shrink-0">
            <div className="text-xs text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
              <span>
                Completely erase this client and all its whole details forever?
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedToErase(null)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDelete(selectedToErase)}
                className="px-3.5 py-1 rounded-lg text-xs font-bold bg-[#DC2626] hover:bg-[#EF4444] text-white shadow-md transition-all"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#231822] bg-[#0E0B12] text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Items in Trash Can remain safely archived until emptied</span>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
