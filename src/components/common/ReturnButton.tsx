import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useDashboard, ActiveView } from '../../context/DashboardContext';
import { sound } from '../../utils/audio';

interface ReturnButtonProps {
  to?: ActiveView;
  label?: string;
  className?: string;
}

export const ReturnButton: React.FC<ReturnButtonProps> = ({
  to = 'command-center',
  label = 'Return to Command Center',
  className = ''
}) => {
  const { setActiveView } = useDashboard();

  const handleClick = () => {
    sound.playClick();
    setActiveView(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121826] border border-[#20293D] text-xs font-semibold text-slate-300 hover:text-white hover:border-[#C9A038]/60 transition-all shadow-sm ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-[#C9A038]" />
      <span>{label}</span>
    </button>
  );
};
