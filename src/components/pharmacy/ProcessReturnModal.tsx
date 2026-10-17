import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  Calendar,
  Phone,
  User,
  IndianRupee,
  ShieldCheck,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { MedicineReturnRequest } from '../../types';
import { useHealth } from '../../context/HealthContext';

interface ProcessReturnModalProps {
  returnRequest: MedicineReturnRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessReturnModal: React.FC<ProcessReturnModalProps> = ({
  returnRequest,
  isOpen,
  onClose,
}) => {
  const { acceptMedicineReturn, rejectMedicineReturn } = useHealth();
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionDone, setActionDone] = useState<'accepted' | 'rejected' | null>(null);

  if (!isOpen || !returnRequest) return null;

  const handleApprove = () => {
    setIsProcessing(true);
    const notes =
      decisionNotes.trim() ||
      `Chemist inspected and verified return of ${returnRequest.medicineName}. ₹${returnRequest.totalRefundAmount.toFixed(
        2
      )} approved for ${returnRequest.resolutionRequested}. Stock quarantined.`;

    setTimeout(() => {
      acceptMedicineReturn(returnRequest.id, notes);
      setIsProcessing(false);
      setActionDone('accepted');
      setTimeout(() => {
        setActionDone(null);
        onClose();
      }, 1400);
    }, 500);
  };

  const handleReject = () => {
    setIsProcessing(true);
    const notes =
      decisionNotes.trim() ||
      'Claim declined after counter inspection: packaging defect criteria not satisfied or outside policy window.';

    setTimeout(() => {
      rejectMedicineReturn(returnRequest.id, notes);
      setIsProcessing(false);
      setActionDone('rejected');
      setTimeout(() => {
        setActionDone(null);
        onClose();
      }, 1400);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Process Return Request</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    returnRequest.status === 'accepted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : returnRequest.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                  }`}
                >
                  {returnRequest.status === 'accepted'
                    ? 'Approved ✓'
                    : returnRequest.status === 'rejected'
                    ? 'Declined ✕'
                    : 'Pending Action'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Claim #{returnRequest.id} &bull; Ref Order #{returnRequest.orderId}
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

        {/* Content */}
        {actionDone ? (
          <div className="p-8 text-center space-y-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
                actionDone === 'accepted'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              {actionDone === 'accepted' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">
                {actionDone === 'accepted'
                  ? 'Return Approved & Settled Successfully!'
                  : 'Return Request Declined'}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {actionDone === 'accepted'
                  ? `₹${returnRequest.totalRefundAmount.toFixed(
                      2
                    )} settlement registered and customer ${returnRequest.patientName} notified.`
                  : 'Customer notified of decision with provided rationale.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* Customer & Order Information */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                Patient &amp; Claim Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Patient Name</span>
                    <strong className="text-slate-900">{returnRequest.patientName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contact Phone</span>
                    <strong className="text-slate-900">
                      {returnRequest.patientPhone || '+91 98450 21980'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Submission Date</span>
                    <strong className="text-slate-900">{returnRequest.requestedAt}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Requested Resolution</span>
                    <strong className="text-indigo-600 capitalize">
                      {returnRequest.resolutionRequested === 'refund'
                        ? 'Full Refund (₹ INR)'
                        : 'Immediate Replacement Dispatch'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Medicine Item Details */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {returnRequest.medicineName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Quantity: <strong>{returnRequest.quantity} unit(s)</strong> &bull; Unit Price:{' '}
                      <strong>₹{returnRequest.itemPrice}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Total Claim Value</span>
                  <span className="text-base font-black text-slate-900 flex items-center justify-end">
                    ₹{returnRequest.totalRefundAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Defect description & Batch info */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider">
                    Reported Issue: {returnRequest.reason.replace(/_/g, ' ')}
                  </span>
                  <span className="text-amber-800 text-[11px] font-mono">
                    Batch: {returnRequest.batchNumber || 'N/A'} &bull; Exp:{' '}
                    {returnRequest.expiryDateFound || 'N/A'}
                  </span>
                </div>
                <p className="text-slate-700 italic text-[11px] leading-relaxed">
                  &ldquo;{returnRequest.reasonDescription}&rdquo;
                </p>
              </div>

              {/* Photo Proof thumbnail */}
              {returnRequest.photoProofUrl && (
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    Customer Photo Proof:
                  </span>
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={returnRequest.photoProofUrl}
                      alt="Damaged Item Proof"
                      className="w-14 h-14 object-cover rounded-lg border border-slate-300"
                    />
                    <div className="text-xs space-y-0.5">
                      <span className="font-bold text-slate-800 block">
                        Defect Verification Image
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> High Resolution Attached
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chemist Audit Notes / Remarks input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Chemist Inspection / Settlement Notes (Optional):
              </label>
              <textarea
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="e.g., Physical packaging inspected. Seal was cracked in transit. Approved for immediate UPI refund and batch logged."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Existing Status / Decision */}
            {returnRequest.pharmacyNotes && (
              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
                <span className="font-bold block text-[11px] text-slate-500">
                  Recorded Chemist Action Notes:
                </span>
                <p className="italic">{returnRequest.pharmacyNotes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleReject}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  Decline Return
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleApprove}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Approve Return &bull; Settle ₹{returnRequest.totalRefundAmount.toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
