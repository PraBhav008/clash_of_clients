import React, { useState } from 'react';
import {
  Library,
  FileText,
  Key,
  Download,
  Plus,
  Search,
  Copy,
  Check
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    setActiveModal,
    openClientHQ,
    addToast
  } = useDashboard();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Contract', 'Proposal', 'Brand Asset', 'Requirements', 'Credentials & Access'];

  const filteredDocs = documents.filter(doc => {
    const matchCat = categoryFilter === 'All' || doc.category === categoryFilter;
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || doc.clientName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sound.playClick();
    addToast({
      title: 'Copied to Clipboard',
      description: text,
      type: 'info'
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Return Button */}
      <div>
        <ReturnButton />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <Library className="w-5 h-5 text-[#C9A038]" />
            Clan Library & Secure Vault
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Repository of client contracts, proposals, design files, and credentials
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModal('add-doc');
          }}
          className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents or clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#C9A038]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { sound.playClick(); setCategoryFilter(cat); }}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 border transition-all ${
                categoryFilter === cat
                  ? 'bg-[#182033] text-[#ECC968] border-[#C9A038]/50 font-semibold'
                  : 'bg-[#0A0D14] text-slate-400 hover:text-slate-200 border-[#1E2638]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#182033] border border-[#232D42] flex items-center justify-center text-[#C9A038]">
            <Library className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Documents or Credentials</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Store contracts, requirement specs, brand assets, and client staging credentials securely in your vault.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('add-doc');
            }}
            className="btn-gold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Store First Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDocs.map(doc => {
          const isCred = doc.category === 'Credentials & Access';

          return (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] hover:border-[#C9A038]/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span 
                    onClick={() => openClientHQ(doc.clientId)}
                    className="text-xs font-bold text-[#ECC968] hover:underline cursor-pointer"
                  >
                    {doc.clientName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#151C2C] text-slate-400 border border-[#232D42]">
                    {doc.fileType.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xs text-slate-100">
                  {doc.title}
                </h3>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {doc.category} · {doc.fileSize}
                </div>

                {doc.credentialData && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-[#0A0D14] border border-[#232D42] text-[11px] font-mono text-slate-300 space-y-1">
                    <div>Service: <span className="text-[#ECC968]">{doc.credentialData.service}</span></div>
                    <div>User: {doc.credentialData.username}</div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#1E2638] flex items-center justify-between text-xs">
                {isCred && doc.credentialData ? (
                  <button
                    onClick={() => handleCopy(doc.id, doc.credentialData!.username)}
                    className="text-[#ECC968] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === doc.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === doc.id ? 'Copied' : 'Copy'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playGold();
                      addToast({
                        title: 'Document Downloaded',
                        description: `Saved ${doc.title}`,
                        type: 'gold'
                      });
                    }}
                    className="text-slate-300 hover:text-white font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                )}

                <button
                  onClick={() => openClientHQ(doc.clientId)}
                  className="text-slate-400 hover:text-slate-200 text-[11px]"
                >
                  Client Base →
                </button>
              </div>

            </div>
          );
        })}
        </div>
      )}

    </div>
  );
};
