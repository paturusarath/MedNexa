import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Package,
  ShieldCheck,
  Calendar,
  FileText,
  Upload,
  Sparkles,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { PharmacyOrder } from '../../types';

interface ReturnMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PharmacyOrder;
  initialItemIndex?: number;
}

export const ReturnMedicineModal: React.FC<ReturnMedicineModalProps> = ({
  isOpen,
  onClose,
  order,
  initialItemIndex = 0,
}) => {
  const { requestMedicineReturn } = useHealth();

  const [selectedItemIndex, setSelectedItemIndex] = useState(initialItemIndex);
  const [returnReason, setReturnReason] = useState<
    'expired' | 'damaged_seal_foil' | 'broken_bottle_tablets' | 'wrong_item_dispensed' | 'doctor_discontinued'
  >('expired');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDateFound, setExpiryDateFound] = useState('');
  const [reasonDescription, setReasonDescription] = useState(
    'The medicine strip received had expired or damaged packaging upon unboxing.'
  );
  const [resolutionRequested, setResolutionRequested] = useState<'refund' | 'replacement'>('refund');
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentItem = order.items[selectedItemIndex] || order.items[0];
  const unitPrice = currentItem ? currentItem.price : 0;
  const quantity = currentItem ? currentItem.quantity : 1;
  const totalRefund = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    setIsSubmitting(true);
    setTimeout(() => {
      requestMedicineReturn({
        orderId: order.id,
        patientId: order.patientId,
        patientName: order.patientName,
        patientPhone: order.shippingAddress.phone,
        medicineName: currentItem.name,
        medicineId: currentItem.medicineId,
        quantity,
        itemPrice: unitPrice,
        totalRefundAmount: totalRefund,
        reason: returnReason,
        reasonDescription,
        batchNumber: batchNumber || 'BATCH-DETECTED-2026',
        expiryDateFound: expiryDateFound || '08/2026',
        photoProofUrl:
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
        resolutionRequested,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Return Medicine &bull; Expired or Damaged Item
              </h3>
              <p className="text-xs text-slate-400">
                Order #{order.id} &bull; Delivered {order.orderedAt}
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

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900">
                Return Request Submitted Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your claim for <strong className="text-slate-900">{currentItem.name}</strong> has been transmitted directly to the dispensing chemist. You will be notified as soon as it is accepted.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Claim ID:</span>
                <span className="font-mono font-bold text-slate-900">RET-{order.id.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Resolution:</span>
                <span className="font-bold text-indigo-700 capitalize">
                  {resolutionRequested === 'refund' ? `Instant Refund of ₹${totalRefund}` : 'Free Replacement'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chemist Portal:</span>
                <span className="font-bold text-emerald-600">Pending Review ✓</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Select Item in Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Select Item to Return:
              </label>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedItemIndex(idx)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      selectedItemIndex === idx
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Qty: {item.quantity} &bull; ₹{item.price} each
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-xs text-slate-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Return Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Reason for Return:
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-indigo-600"
              >
                <option value="expired">Expired Medicine (Past printed expiry date on foil)</option>
                <option value="damaged_seal_foil">Damaged Packaging / Broken Blister Foil</option>
                <option value="broken_bottle_tablets">Crushed Tablets / Broken Bottle</option>
                <option value="wrong_item_dispensed">Wrong Dosage / Incorrect Medicine Sent</option>
                <option value="doctor_discontinued">Doctor Discontinued Therapy</option>
              </select>
            </div>

            {/* Step 3: Batch Number & Expiry Date Found */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Batch Number on Strip:
                </label>
                <input
                  type="text"
                  placeholder="e.g. TLM-2025-B4"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-indigo-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Expiry Date Printed on Item:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 08/2026 or past date"
                  value={expiryDateFound}
                  onChange={(e) => setExpiryDateFound(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-indigo-600"
                />
              </div>
            </div>

            {/* Step 4: Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Describe the Defect or Expiry Issue:
              </label>
              <textarea
                rows={2}
                value={reasonDescription}
                onChange={(e) => setReasonDescription(e.target.value)}
                placeholder="Describe why the medicine cannot be consumed..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                required
              />
            </div>

            {/* Step 5: Photo Proof Verification */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Photo Proof of Expired Strip / Damaged Seal
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {photoUploaded ? 'Photo verified: batch_stamp_proof.jpg' : 'Attach snapshot'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhotoUploaded(!photoUploaded)}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                {photoUploaded ? 'Attached ✓' : 'Upload Photo'}
              </button>
            </div>

            {/* Step 6: Choose Resolution */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Choose Desired Resolution:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setResolutionRequested('refund')}
                  className={`p-3 rounded-2xl border cursor-pointer transition text-left ${
                    resolutionRequested === 'refund'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="text-xs font-black">Instant Refund</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ₹{totalRefund} back to original payment
                  </div>
                </div>

                <div
                  onClick={() => setResolutionRequested('replacement')}
                  className={`p-3 rounded-2xl border cursor-pointer transition text-left ${
                    resolutionRequested === 'replacement'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="text-xs font-black">Free Replacement</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Fresh verified batch re-dispensed
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
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
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Return to Chemist'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
