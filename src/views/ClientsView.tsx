import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Clock,
  Activity,
  ChevronRight,
  Phone,
  Mail,
  SlidersHorizontal,
  UserPlus,
  Trash2
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Client, ClientStatus } from '../types';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';
import { DeleteClientConfirmModal } from '../components/modals/DeleteClientConfirmModal';

export const ClientsView: React.FC = () => {
  const {
    clients,
    openClientHQ,
    setActiveModal,
    formatCurrency,
    deleteClient,
    trashedClients,
    setIsTrashOpen
  } = useDashboard();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'value' | 'health' | 'name' | 'pending'>('value');
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchPriority && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'value') return b.projectValue - a.projectValue;
      if (sortBy === 'health') return b.healthScore - a.healthScore;
      if (sortBy === 'pending') return b.amountPending - a.amountPending;
      return a.company.localeCompare(b.company);
    });
  }, [clients, statusFilter, priorityFilter, searchQuery, sortBy]);

  const statuses = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Waiting', value: 'Waiting' },
    { label: 'Prospect', value: 'Prospect' },
    { label: 'Payment Pending', value: 'Payment Pending' },
    { label: 'At Risk', value: 'At Risk' },
    { label: 'Completed', value: 'Completed' },
  ];

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'Active':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-slate-200 border border-[#232D42] font-semibold">Active</span>;
      case 'Waiting':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-slate-300 border border-[#232D42] font-semibold">Waiting</span>;
      case 'Prospect':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-slate-300 border border-[#232D42] font-semibold">Prospect</span>;
      case 'Payment Pending':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#C9A038]/10 text-[#ECC968] border border-[#C9A038]/30 font-semibold">Payment Due</span>;
      case 'At Risk':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#EF4444]/10 text-rose-300 border border-[#EF4444]/30 font-semibold">At Risk</span>;
      case 'Completed':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-slate-400 border border-[#232D42] font-semibold">Delivered</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Return to Command Center button */}
      <div>
        <ReturnButton />
      </div>

      {/* Header */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C9A038] shrink-0" />
            <span className="break-words">Client Management Command</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {clients.length} Registered Client Bases · Click any client card to open their all-in-one Headquarters
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => {
              sound.playClick();
              setIsTrashOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 bg-[#171216] hover:bg-[#251522] text-slate-300 hover:text-white border border-[#331C26] hover:border-rose-500/40 transition-all font-semibold shadow-sm"
            title="Open Trash Can"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Trash Can</span>
            {trashedClients.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                {trashedClients.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('add-client');
            }}
            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Recruit New Client</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, brand, tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-xs text-slate-200 placeholder-slate-500 focus:border-[#C9A038] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#0A0D14] border border-[#232D42] text-slate-200 rounded-lg px-2 py-1 text-xs outline-none"
              >
                <option value="value">Highest Contract Value</option>
                <option value="health">Relationship Health</option>
                <option value="pending">Highest Pending Loot</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="bg-[#0A0D14] border border-[#232D42] text-slate-200 rounded-lg px-2 py-1 text-xs outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

        </div>

        {/* Clean Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {statuses.map(st => (
            <button
              key={st.value}
              onClick={() => {
                sound.playClick();
                setStatusFilter(st.value);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 border transition-all ${
                statusFilter === st.value
                  ? 'bg-[#182033] text-[#ECC968] border-[#C9A038]/50 font-semibold'
                  : 'bg-[#0A0D14] text-slate-400 hover:text-slate-200 border-[#1E2638]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Empty State or Grid */}
      {filteredClients.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#121826] border border-[#20293D] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#151C2C] border border-[#232D42] flex items-center justify-center text-slate-400 mx-auto">
            <UserPlus className="w-6 h-6 text-[#C9A038]" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-200">
            No Clients Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your client roster is currently clean. Click below to register your first freelance client and initialize their headquarters.
          </p>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('add-client');
            }}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold"
          >
            + Recruit First Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <div
              key={client.id}
              onClick={() => openClientHQ(client.id)}
              className="p-5 rounded-2xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 min-w-0">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-[#232D42] shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-sm text-slate-100 group-hover:text-[#ECC968] transition-colors truncate">
                        {client.company}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{client.name}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {getStatusBadge(client.status)}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        setClientToDelete(client);
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-transparent hover:border-[#EF4444]/30 transition-all opacity-80 hover:opacity-100"
                      title={`Delete ${client.company} & records`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3 bg-[#0A0D14] px-3 py-1.5 rounded-lg border border-[#1E2638]">
                  <span className="flex items-center gap-1 truncate" title={client.email}>
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{client.phone}</span>
                  </span>
                </div>

                {/* Health Meter */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      Client Health
                    </span>
                    <span className="font-semibold text-slate-200">
                      {client.healthScore}% · {client.healthStatus}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0A0D14] rounded-full overflow-hidden border border-[#232D42]">
                    <div
                      className="h-full bg-[#C9A038] rounded-full"
                      style={{ width: `${client.healthScore}%` }}
                    />
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-3 rounded-xl bg-[#151C2C] border border-[#232D42] mb-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400">Contract Value:</span>
                    <span className="font-bold text-slate-100">{formatCurrency(client.projectValue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">Paid: {formatCurrency(client.amountPaid)}</span>
                    <span className="text-slate-400">Pending: {formatCurrency(client.amountPending)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {client.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-slate-400 border border-[#232D42]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom footer */}
              <div className="pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Launch: <strong className="text-slate-200">{client.nextDeadline}</strong></span>
                </div>

                <div className="flex items-center gap-1 text-[#ECC968] font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                  Enter HQ <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Client Confirmation Modal */}
      <DeleteClientConfirmModal
        isOpen={!!clientToDelete}
        client={clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={() => {
          if (clientToDelete) {
            deleteClient(clientToDelete.id);
          }
          setClientToDelete(null);
        }}
      />

    </div>
  );
};
