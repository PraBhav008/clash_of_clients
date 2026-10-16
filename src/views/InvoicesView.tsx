import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Printer,
  Download,
  Eye,
  X,
  Zap,
  Lock,
  Unlock,
  Gem,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Invoice, InvoiceStatus } from '../types';
import { sound } from '../utils/audio';
import { ReturnButton } from '../components/common/ReturnButton';

export const InvoicesView: React.FC = () => {
  const {
    invoices,
    markInvoicePaid,
    setActiveModal,
    openClientHQ,
    formatCurrency,
    addToast,
    isPerkUnlocked,
    unlockPerk
  } = useDashboard();

  const isStampUnlocked = isPerkUnlocked('pdf_invoice_stamp');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [includeTax, setIncludeTax] = useState<boolean>(true);

  const filteredInvoices = invoices.filter(inv => {
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientCompany.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-slate-200 border border-[#232D42] font-semibold">Paid</span>;
      case 'Pending':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#C9A038]/10 text-[#ECC968] border border-[#C9A038]/30 font-semibold">Pending</span>;
      case 'Overdue':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#EF4444]/10 text-rose-300 border border-[#EF4444]/30 font-semibold">Overdue</span>;
      case 'Draft':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-[#151C2C] text-slate-400 border border-[#232D42] font-semibold">Draft</span>;
    }
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleSimulatePDF = () => {
    sound.playGold();
    addToast({
      title: 'PDF Export Ready',
      description: `Downloaded ${viewInvoice?.invoiceNumber}.pdf`,
      type: 'gold'
    });
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
            <Receipt className="w-5 h-5 text-[#C9A038]" />
            Invoices & Commercial Billing
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Milestone billing, payment tracking, PDF generator and settlement receipts
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModal('add-invoice');
          }}
          className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Perk Banner: Royal Paid Seal & Tax Invoice */}
      {isStampUnlocked ? (
        <div className="p-4 rounded-2xl bg-[#141B2B] border border-[#C9A038]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A038]/20 border border-[#C9A038]/50 flex items-center justify-center text-[#ECC968] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-xs text-slate-100">Royal Paid Seal & Tax Invoice Stamper</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#C9A038]/15 text-[#ECC968] font-bold border border-[#C9A038]/30">UNLOCKED</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Automatic gold-embossed Verified Paid wax stamp and 18% GST / VAT tax calculation breakdowns on all invoices.</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#ECC968] bg-[#0A0D14] px-3 py-1.5 rounded-xl border border-[#232D42] shrink-0">
            Active on all PDF exports
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A0D14] border border-[#232D42] flex items-center justify-center text-slate-400 shrink-0">
              <Lock className="w-4 h-4 text-[#C9A038]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-xs text-slate-300">Royal Paid Seal & Tax Invoice Stamper</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#151C2C] text-slate-400 border border-[#232D42] font-semibold flex items-center gap-1">
                  <Gem className="w-3 h-3 text-[#ECC968]" /> 20 Gems to Unlock
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Upgrades invoices with official gold verification stamps and automated tax/GST breakdown calculations for clients.</p>
            </div>
          </div>
          <button
            onClick={() => unlockPerk('pdf_invoice_stamp')}
            className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock (20</span>
            <Gem className="w-3.5 h-3.5 fill-[#ECC968]/40" />
            <span>)</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-[#20293D] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice # or client name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A0D14] border border-[#232D42] text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#C9A038]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['All', 'Paid', 'Pending', 'Overdue', 'Draft'].map(st => (
            <button
              key={st}
              onClick={() => { sound.playClick(); setStatusFilter(st); }}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 border transition-all ${
                statusFilter === st
                  ? 'bg-[#182033] text-[#ECC968] border-[#C9A038]/50 font-semibold'
                  : 'bg-[#0A0D14] text-slate-400 hover:text-slate-200 border-[#1E2638]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121826] border border-[#20293D] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#182033] border border-[#232D42] flex items-center justify-center text-[#C9A038]">
            <Receipt className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Invoices Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {invoices.length === 0
                ? "No billing records currently exist. Create milestone invoices to collect payments and track gold flow."
                : "No invoices match your selected status or search term."}
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('add-invoice');
            }}
            className="btn-gold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create First Invoice</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#121826] border border-[#20293D] overflow-hidden">
          <div className="divide-y divide-[#1E2638]">
            {filteredInvoices.map(inv => (
            <div
              key={inv.id}
              className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#151C2C] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#151C2C] border border-[#232D42] flex items-center justify-center text-slate-300 shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-slate-100 font-mono">
                      {inv.invoiceNumber}
                    </span>
                    {getStatusBadge(inv.status)}
                  </div>

                  <p className="text-xs text-slate-300 mt-0.5">
                    <strong 
                      onClick={() => openClientHQ(inv.clientId)}
                      className="text-[#ECC968] hover:underline cursor-pointer"
                    >
                      {inv.clientCompany}
                    </strong>
                    <span className="text-slate-400"> ({inv.clientName})</span>
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Issued: {inv.issueDate}</span>
                    <span>·</span>
                    <span>Due: <strong className="text-slate-200">{inv.dueDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center justify-between lg:justify-end gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1E2638]">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amount</span>
                  <span className="text-base font-bold text-slate-100 font-heading">
                    {formatCurrency(inv.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setViewInvoice(inv);
                    }}
                    className="p-2 rounded-lg bg-[#151C2C] hover:bg-[#1A2234] text-slate-300 border border-[#232D42] text-xs font-semibold"
                    title="View & Print"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {inv.status !== 'Paid' && (
                    <button
                      onClick={() => markInvoicePaid(inv.id)}
                      className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="w-full max-w-xl bg-[#0F1420] border border-[#232D42] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-[#1E2638] flex items-center justify-between bg-[#151C2C]">
              <span className="font-heading font-bold text-xs text-slate-200 font-mono">
                Invoice {viewInvoice.invoiceNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulatePDF}
                  className="px-2.5 py-1 rounded bg-[#0A0D14] text-slate-300 text-xs flex items-center gap-1 border border-[#232D42]"
                >
                  <Download className="w-3 h-3" /> PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1 rounded bg-[#0A0D14] text-slate-300 text-xs flex items-center gap-1 border border-[#232D42]"
                >
                  <Printer className="w-3 h-3" /> Print
                </button>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
              <div className="flex justify-between items-start pb-3 border-b border-[#1E2638]">
                <div>
                  <h2 className="font-heading font-bold text-base text-slate-100">
                    WEBCRAFT CITADEL
                  </h2>
                  <p className="text-[11px] text-slate-400">Freelance Web Engineering</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-100 font-mono">{viewInvoice.invoiceNumber}</div>
                  <div className="text-[11px] text-slate-400">Due: {viewInvoice.dueDate}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Billed To</span>
                <div className="font-bold text-slate-100">{viewInvoice.clientCompany}</div>
                <div className="text-slate-400">{viewInvoice.clientName} · {viewInvoice.clientEmail}</div>
              </div>

              <div className="rounded-xl border border-[#232D42] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#151C2C] text-slate-400 border-b border-[#232D42]">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2638]">
                    {viewInvoice.items.map(it => (
                      <tr key={it.id}>
                        <td className="p-2.5 text-slate-200">{it.description}</td>
                        <td className="p-2.5 text-right font-bold text-slate-100">{formatCurrency(it.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Breakdown & Stamp Section */}
              {isStampUnlocked ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141B2B] border border-[#20293D] text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={includeTax}
                        onChange={e => setIncludeTax(e.target.checked)}
                        className="rounded border-[#232D42] text-[#C9A038] focus:ring-0"
                      />
                      <span>Itemized Tax Breakdown (18% GST / VAT Calculation)</span>
                    </label>
                    <span className="text-[#ECC968] font-bold text-[10px] px-2 py-0.5 rounded bg-[#C9A038]/10 border border-[#C9A038]/30">STAMP ACTIVE</span>
                  </div>

                  {includeTax && (
                    <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#232D42] space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Net Engineering Subtotal:</span>
                        <span className="font-mono text-slate-300">{formatCurrency(Math.round(viewInvoice.totalAmount / 1.18))}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Applicable GST / VAT (18%):</span>
                        <span className="font-mono text-slate-300">{formatCurrency(Math.round(viewInvoice.totalAmount - (viewInvoice.totalAmount / 1.18)))}</span>
                      </div>
                    </div>
                  )}

                  {viewInvoice.status === 'Paid' && (
                    <div className="p-3 rounded-xl bg-[#C9A038]/10 border border-[#C9A038]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#C9A038]/20 border border-[#C9A038] flex items-center justify-center text-[#ECC968] font-bold text-sm">
                          ✓
                        </div>
                        <div>
                          <div className="text-[11px] font-bold font-heading text-[#ECC968] tracking-wider uppercase">CITADEL VERIFIED & SETTLED</div>
                          <div className="text-[10px] text-slate-400">Official Commercial Tax Receipt · Authenticated Seal</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400">TXN #WCK-8824</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#121826] border border-[#20293D] flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C9A038]" />
                    <span>Royal Paid Seal & Tax Invoice Stamper is Locked</span>
                  </div>
                  <button
                    onClick={() => unlockPerk('pdf_invoice_stamp')}
                    className="text-[#ECC968] hover:underline font-bold text-[10px] flex items-center gap-1"
                  >
                    <span>Unlock (20</span>
                    <Gem className="w-2.5 h-2.5 fill-[#ECC968]/40" />
                    <span>)</span>
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-bold text-slate-100 border-t border-[#1E2638] pt-3">
                <span>Total Due:</span>
                <span className="text-[#ECC968] font-heading text-base">{formatCurrency(viewInvoice.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
