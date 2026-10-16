import React, { useState } from 'react';
import {
  Plus,
  UserPlus,
  Receipt,
  CheckSquare,
  Binoculars,
  Coins,
  MessageSquare
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { sound } from '../../utils/audio';

export const FloatingQuickActionButton: React.FC = () => {
  const { setActiveModal } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    sound.playClick();
    setIsOpen(prev => !prev);
  };

  const handleActionClick = (modalType: string) => {
    sound.playClick();
    setIsOpen(false);
    setActiveModal(modalType);
  };

  const radialActions = [
    { id: 'add-client', label: 'Add Client', icon: <UserPlus className="w-3.5 h-3.5 text-[#ECC968]" /> },
    { id: 'add-invoice', label: 'Create Invoice', icon: <Receipt className="w-3.5 h-3.5 text-[#ECC968]" /> },
    { id: 'add-task', label: 'Add Task', icon: <CheckSquare className="w-3.5 h-3.5 text-[#ECC968]" /> },
    { id: 'log-payment', label: 'Log Payment', icon: <Coins className="w-3.5 h-3.5 text-[#ECC968]" /> },
    { id: 'log-comm', label: 'Log Comm', icon: <MessageSquare className="w-3.5 h-3.5 text-[#ECC968]" /> },
    { id: 'add-lead', label: 'Add Lead', icon: <Binoculars className="w-3.5 h-3.5 text-[#ECC968]" /> },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
      {/* Expanded Quick Action Pills */}
      {isOpen && (
        <div className="flex flex-col items-end gap-1.5 mb-2">
          {radialActions.map(act => (
            <button
              key={act.id}
              onClick={() => handleActionClick(act.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121826] border border-[#232D42] text-slate-200 hover:text-[#ECC968] hover:border-[#C9A038]/50 shadow-lg text-xs font-medium transition-all"
            >
              <span>{act.label}</span>
              <div className="p-1 rounded-md bg-[#151C2C]">
                {act.icon}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={toggleOpen}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen
            ? 'bg-[#151C2C] text-white border border-[#232D42] rotate-45'
            : 'btn-gold'
        }`}
        title="Quick Actions"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
