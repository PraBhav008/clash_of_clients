import React from 'react';
import {
  AlertTriangle,
  Trash2,
  X,
  FolderGit2,
  Swords,
  Receipt,
  Globe,
  Library,
  MessageSquare
} from 'lucide-react';
import { Client } from '../../types';
import { sound } from '../../utils/audio';

interface DeleteClientConfirmModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteClientConfirmModal: React.FC<DeleteClientConfirmModalProps> = ({
  isOpen,
  client,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !client) return null;

  const handleConfirm = () => {
    sound.playClick();
    onConfirm();
  };

  const handleCancel = () => {
    sound.playClick();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={handleCancel}
    >
      <div 
        className="w-full max-w-md bg-gradient-to-b from-[#181219] via-[#120E15] to-[#0A0D14] border border-[#EF4444]/40 hover:border-[#EF4444]/70 rounded-2xl shadow-[0_0_50px_-10px_rgba(239,68,68,0.25)] overflow-hidden transition-all duration-300 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle red warning top strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#EF4444] to-transparent" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#2A1822] flex items-start justify-between bg-[#1F1218]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A141A] border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] shadow-sm shrink-0">
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-slate-100 flex items-center gap-1.5">
                Move Client to Trash Can?
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Safe deletion with 1-click restore or permanent purge
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Are you sure you want to delete <strong className="text-white font-semibold underline decoration-[#EF4444]/50">{client.company}</strong>?
          </p>

          {/* Breakdown of what will be moved */}
          <div className="p-3 rounded-xl bg-[#090C14] border border-[#261A22] space-y-2 text-xs text-slate-300">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
              The following will be moved to the Trash Can:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 truncate">
                <FolderGit2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Active Projects & Phases</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Swords className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Tasks & Missions</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Receipt className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Invoices & Billing</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Hosting & Domains</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Library className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Documents & Credentials</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Communication Logs</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-[11px] text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#F59E0B]" />
            <span>The client will wait in your Trash Can. You can restore them anytime or completely erase them forever from the Trash Can.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#1E2638]/60">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1E2638] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2.5 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center gap-2 uppercase bg-[#DC2626] hover:bg-[#EF4444] text-white shadow-lg shadow-red-950/50 hover:shadow-red-500/30 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Move to Trash Can</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
