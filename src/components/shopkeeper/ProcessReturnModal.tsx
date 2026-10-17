import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  ShieldCheck,
  Calendar,
  DollarSign,
  FileText,
  User,
  Phone,
  Camera,
  Layers,
} from 'lucide-react';
import { MedicineReturnRequest } from '../../types';

interface ProcessReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnRequest: MedicineReturnRequest | null;
  onProcessReturn: (
    returnId: string,
    decision: 'approve' | 'reject',
    notes: string,
    quarantineBin?: string
  ) => void;
}

export const ProcessReturnModal: React.FC<ProcessReturnModalProps> = ({
  isOpen,
  onClose,
  returnRequest,
  onProcessReturn,
}) => {
  const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
  const [notes, setNotes] = useState(
    'Item inspected by counter pharmacist. Defect/expiry confirmed; replacement dispatched & inventory quarantined.'
  );
  const [quarantineBin, setQuarantineBin] = useState('Bin Q-04 (Damaged/Expired Quarantine Shelf)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !returnRequest) return null;

  const handleDecisionChange = (newDecision: 'approve' | 'reject') => {
    setDecision(newDecision);
    if (newDecision === 'approve') {
      setNotes(
        'Item inspected by counter pharmacist. Defect/expiry confirmed; replacement/refund approved and inventory quarantined.'
      );
    } else {
      setNotes(
        'Item inspected: Seals intact and printed shelf-life is within statutory limits. Does not qualify for return.'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onProcessReturn(returnRequest.id, decision, notes, quarantineBin);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Process Return Request</h3>
                <span className="font-mono text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
                  #{returnRequest.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ref Order #{returnRequest.orderId} &bull; Requested on {returnRequest.requestedAt}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Customer & Item Overview */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Customer Particulars
                </span>
                <span className="font-bold text-slate-900 text-sm">{returnRequest.patientName}</span>
                {returnRequest.patientPhone && (
                  <span className="text-slate-500 ml-2">({returnRequest.patientPhone})</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Claim Value
                </span>
                <span className="font-black text-emerald-700 text-base">
                  ₹{returnRequest.totalRefundAmount.toFixed(2)}
                </span>
                <span className="block text-[11px] font-bold text-indigo-700 capitalize">
                  Requested: {returnRequest.resolutionRequested}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Medicine &amp; Quantity
                </span>
                <p className="font-bold text-slate-900">{returnRequest.medicineName}</p>
                <p className="text-slate-500 text-[11px]">
                  Qty: {returnRequest.quantity} strip(s) &bull; Unit MRP: ₹{returnRequest.itemPrice}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Claimed Defect Reason
                </span>
                <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[11px] bg-amber-100 text-amber-900 capitalize">
                  {returnRequest.reason.replace(/_/g, ' ')}
                </span>
                <div className="text-[11px] text-slate-500 mt-1">
                  Batch: <strong>{returnRequest.batchNumber || 'N/A'}</strong> &bull; Printed Exp:{' '}
                  <strong>{returnRequest.expiryDateFound || 'N/A'}</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Customer Defect Notes:
              </span>
              <p className="text-slate-700 italic">&ldquo;{returnRequest.reasonDescription}&rdquo;</p>
            </div>
          </div>

          {/* Decision Selection: Approve vs Reject */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Shopkeeper / Pharmacist Action:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDecisionChange('approve')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3 ${
                  decision === 'approve'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    decision === 'approve'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black">Approve Return</div>
                  <div className="text-[11px] opacity-80">
                    Settle ₹{returnRequest.totalRefundAmount} / Dispatch pack
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDecisionChange('reject')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3 ${
                  decision === 'reject'
                    ? 'border-rose-600 bg-rose-50/70 text-rose-950 ring-2 ring-rose-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    decision === 'reject' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black">Reject Return</div>
                  <div className="text-[11px] opacity-80">Decline claim with remarks</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quarantine Bin ID (if approved) */}
          {decision === 'approve' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                Physical Quarantine Bin / Shelf Location:
              </label>
              <input
                type="text"
                value={quarantineBin}
                onChange={(e) => setQuarantineBin(e.target.value)}
                placeholder="e.g. Bin Q-04 (Damaged/Expired Quarantine)"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-indigo-600"
              />
              <span className="text-[10px] text-slate-500 block">
                Damaged/expired items are separated from regular inventory per Drug Controller norms.
              </span>
            </div>
          )}

          {/* Shopkeeper Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Pharmacist Inspection Notes &bull; Transmitted to Customer:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 ${
                decision === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {decision === 'approve' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Processing...'
                      : `Approve Return & Settle ₹${returnRequest.totalRefundAmount}`}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing...' : 'Reject Return Request'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
