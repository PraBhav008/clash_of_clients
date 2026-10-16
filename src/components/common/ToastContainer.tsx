import React from 'react';
import { X, Coins, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let borderClass = 'border-[#232D42] bg-[#121826]';
        let icon = <Info className="w-4 h-4 text-slate-400" />;

        if (toast.type === 'gold' || toast.type === 'elixir' || toast.type === 'success') {
          borderClass = 'border-[#C9A038]/40 bg-[#121826] shadow-lg';
          icon = <Coins className="w-4 h-4 text-[#C9A038]" />;
        } else if (toast.type === 'danger') {
          borderClass = 'border-[#EF4444]/40 bg-[#121826]';
          icon = <AlertCircle className="w-4 h-4 text-rose-400" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass} shadow-xl transition-all`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-100 font-heading">
                {toast.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
