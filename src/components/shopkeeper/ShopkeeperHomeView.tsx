import React, { useState } from 'react';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  FileText,
  Pill,
  Sparkles,
  CreditCard,
  Plus,
  Printer,
  Calendar,
  Layers,
  Search,
  Check,
  X,
  ShieldCheck,
  RotateCcw,
  Receipt,
  Download,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { Medicine, MedicineReturnRequest } from '../../types';
import { BottomNavTab } from '../BottomNav';
import { ProcessReturnModal } from './ProcessReturnModal';

interface ShopkeeperHomeViewProps {
  onNavigate: (tab: BottomNavTab, subSection?: string) => void;
}

export const ShopkeeperHomeView: React.FC<ShopkeeperHomeViewProps> = ({ onNavigate }) => {
  const {
    orders,
    medicines,
    updateOrderStatus,
    updateMedicine,
    medicineReturns,
    acceptMedicineReturn,
    rejectMedicineReturn,
    processReturnRequest,
    addNotification,
  } = useHealth();

  // Return Processing Modal State
  const [selectedReturnForProcessing, setSelectedReturnForProcessing] = useState<MedicineReturnRequest | null>(null);

  // Modal states for requested features
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showInwardModal, setShowInwardModal] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any | null>(null);

  // Quick Counter Billing State
  const [billingCustomerName, setBillingCustomerName] = useState('Ramesh Sharma');
  const [billingCustomerPhone, setBillingCustomerPhone] = useState('+91 98450 11223');
  const [billingDoctorName, setBillingDoctorName] = useState('Dr. V. Mohan, MD');
  const [billingSelectedMedId, setBillingSelectedMedId] = useState(medicines[0]?.id || '');
  const [billingQty, setBillingQty] = useState(2);
  const [billingPaymentMethod, setBillingPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('UPI');
  const [billingSuccess, setBillingSuccess] = useState(false);

  // Inward Batch Stock Entry State
  const [inwardMedId, setInwardMedId] = useState(medicines[0]?.id || '');
  const [inwardDistributor, setInwardDistributor] = useState('Sun Pharma Wholesaler Depot, Bengaluru');
  const [inwardInvoiceNo, setInwardInvoiceNo] = useState('INV-SUN-99412');
  const [inwardBatchNo, setInwardBatchNo] = useState('BATCH-2026-INW');
  const [inwardExpDate, setInwardExpDate] = useState('12/2027');
  const [inwardQty, setInwardQty] = useState(50);
  const [inwardRate, setInwardRate] = useState(120);

  // Near-Expiry Items State (Medicines with expiry date in 2026)
  const [returnedBatches, setReturnedBatches] = useState<Record<string, boolean>>({});

  const pendingVerificationOrders = orders.filter((o) => o.status === 'pending');
  const activeDeliveryOrders = orders.filter(
    (o) => o.status === 'processing' || o.status === 'shipped'
  );
  const lowStockMedicines = medicines.filter((m) => m.stock < 30);

  // Near-expiry items filter (expiry <= 2026)
  const nearExpiryMedicines = medicines.filter((m) =>
    m.expiryDate ? m.expiryDate.includes('2026') : false
  );

  // Schedule H antibiotic / cardiac records snapshot
  const scheduleHMedicines = medicines.filter((m) => m.requiresPrescription);

  const handleGenerateCounterBill = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find((m) => m.id === billingSelectedMedId);
    if (!med) return;

    if (med.stock < billingQty) {
      alert(`Insufficient stock! Only ${med.stock} strips available in pharmacy inventory.`);
      return;
    }

    const unitPrice = med.discountPrice || med.price;
    const subtotal = unitPrice * billingQty;
    const gstRate = 0.12; // 12% GST (6% CGST + 6% SGST)
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;
    const invNumber = `GST-PM-${Date.now().toString().slice(-6)}`;

    // Deduct stock immediately
    updateMedicine(med.id, { stock: Math.max(0, med.stock - billingQty) });

    const invoiceData = {
      invoiceNumber: invNumber,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: billingCustomerName,
      customerPhone: billingCustomerPhone,
      doctorName: billingDoctorName,
      medicineName: med.name,
      dosageForm: med.dosageForm,
      strength: med.strength,
      batchNumber: med.batchNumber || 'BAT-2025-01',
      expiryDate: med.expiryDate || '28/08/2027',
      quantity: billingQty,
      unitPrice,
      subtotal,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      totalAmount,
      paymentMethod: billingPaymentMethod,
      pharmacistName: 'Rajesh Kumar (B.Pharm, KSPC-49102)',
      dlNumber: 'KA-BLR-DL-2019-48201',
      gstin: '29AABCP1330F1Z4',
    };

    setGeneratedInvoice(invoiceData);
    setBillingSuccess(true);
    addNotification(
      'Walk-In Counter Invoice Generated',
      `Dispensed ${billingQty}x ${med.name}. GST Invoice #${invNumber} generated for ₹${totalAmount.toFixed(2)}.`,
      'system',
      'shopkeeper'
    );
  };

  const handleInwardStock = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find((m) => m.id === inwardMedId);
    if (!med) return;

    updateMedicine(med.id, {
      stock: med.stock + Number(inwardQty),
      batchNumber: inwardBatchNo || med.batchNumber,
      expiryDate: inwardExpDate || med.expiryDate,
    });

    addNotification(
      'Wholesaler Stock Inward Accepted',
      `Received ${inwardQty} strips of ${med.name} from ${inwardDistributor} (Inv: ${inwardInvoiceNo}). Stock updated to ${med.stock + Number(inwardQty)}.`,
      'system',
      'shopkeeper'
    );

    setShowInwardModal(false);
  };

  const handleReturnToDistributor = (medId: string, medName: string, batch: string) => {
    setReturnedBatches((prev) => ({ ...prev, [medId]: true }));
    addNotification(
      'Near-Expiry Return Initiated',
      `Batch ${batch} of ${medName} marked for wholesaler credit note return.`,
      'system',
      'shopkeeper'
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ========================================================================= */}
      {/* 1. CHEMIST / PHARMACY HEADER BANNER WITH QUICK ACTION BUTTONS             */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-400/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Pharmacy Dispensing Counter Live
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-mono">
                DL: KA-BLR-DL-2019-48201
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                Cold Chain: 4.2°C Stable
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              PulseMed 24x7 Chemist &amp; Druggists
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Chief Pharmacist: <strong className="text-white">Rajesh Kumar (B.Pharm)</strong>. Manage counter billing POS, prescription verification, wholesaler batch inward, and Schedule H inspection logs.
            </p>
          </div>

          {/* Quick Counter Billing & Inward Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowBillingModal(true);
                setGeneratedInvoice(null);
                setBillingSuccess(false);
              }}
              className="px-4 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 rounded-2xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-slate-950" />
              <span>Counter POS Billing (GST)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInwardModal(true)}
              className="px-4 py-3 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Wholesaler Inward</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('doctors')}
              className="px-4 py-3 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Pill className="w-4 h-4 text-amber-600" />
              <span>Medicine Stock</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHEMIST SALES & OPERATIONAL METRICS                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Today's Dispense Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <span className="font-bold text-xs">₹</span>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹28,450</div>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs yesterday (₹ INR)
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Awaiting Verification</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pendingVerificationOrders.length} Orders
          </div>
          <span className="text-[11px] text-amber-700 font-bold mt-1 block">
            Prescription Check Required
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Active Deliveries</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {activeDeliveryOrders.length} In Transit
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Under 60 Min Express Delivery</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Low Stock Warning</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{lowStockMedicines.length} Items</div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
            Re-order Batch from Wholesaler
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NEW USEFUL FEATURES: NEAR-EXPIRY CLEARANCE & SCHEDULE H AUDIT STRIP     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Near Expiry Clearance Desk */}
        <div className="bg-white rounded-3xl border border-amber-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Calendar className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Near-Expiry Quarantine &amp; Credit Return Desk
                </h3>
                <p className="text-[11px] text-slate-500">
                  Batches nearing expiry (Return to distributor for credit note)
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
              {nearExpiryMedicines.length} Flagged
            </span>
          </div>

          <div className="space-y-2">
            {nearExpiryMedicines.slice(0, 3).map((med) => {
              const isReturned = returnedBatches[med.id];
              return (
                <div
                  key={med.id}
                  className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{med.name}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Batch: <strong className="font-mono text-slate-800">{med.batchNumber || 'BATCH-26'}</strong> • Exp: <strong className="text-amber-800">{med.expiryDate || '30/11/2026'}</strong>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isReturned ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Returned
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleReturnToDistributor(
                            med.id,
                            med.name,
                            med.batchNumber || 'BATCH-26'
                          )
                        }
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold cursor-pointer transition shadow-2xs"
                      >
                        Return for Credit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule H / H1 Register Desk */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Schedule H / H1 Prescription Audit Register
                </h3>
                <p className="text-[11px] text-slate-500">
                  Statutory drug inspector register for antibiotics &amp; habit-forming drugs
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
              Inspection Ready
            </span>
          </div>

          <div className="space-y-2">
            {scheduleHMedicines.slice(0, 3).map((med, idx) => (
              <div
                key={med.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{med.name}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Salt: {med.genericName.slice(0, 35)}...
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold">
                    Dr. V. Mohan (NMC-90482)
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">e-Rx Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ORDERS & LOW STOCK WORKFLOW FEED                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incoming Orders to Verify & Dispense (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-slate-900">
                Incoming Customer Prescription Orders
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('shopping')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
            >
              View All Orders &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-amber-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900">
                        Order #{order.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customer: <strong className="text-slate-800">{order.shippingAddress.fullName}</strong> •{' '}
                      {order.shippingAddress.city}, {order.shippingAddress.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                    <span className="block text-[11px] text-slate-400">UPI Paid (Instant)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                    Medicines to Dispense ({order.items.length}):
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span>
                        • {item.name} x {item.quantity} strips
                      </span>
                      <span className="font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500">
                    Attached Rx: <strong className="text-slate-700">{order.prescriptionFile || 'Verified e-Rx'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify Rx &amp; Accept</span>
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Mark Out for Delivery</span>
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FEATURE: Customer Medicine Returns & Damage Claims Desk (Expired / Damaged Items) */}
          <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <RotateCcw className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Customer Medicine Returns &amp; Damage Claims Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and accept expired, broken foil, or damaged items returned by patients
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
                {medicineReturns.filter((r) => r.status === 'pending').length} Pending Claims
              </span>
            </div>

            {medicineReturns.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                No active medicine return claims submitted by patients.
              </div>
            ) : (
              <div className="space-y-3">
                {medicineReturns.map((ret) => (
                  <div
                    key={ret.id}
                    className={`p-4 rounded-2xl border transition space-y-3 ${
                      ret.status === 'accepted'
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : ret.status === 'rejected'
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-amber-50/40 border-amber-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900">
                            Claim #{ret.id}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            (Ref Order #{ret.orderId})
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                              ret.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ret.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-900 animate-pulse'
                            }`}
                          >
                            {ret.status === 'accepted'
                              ? 'Return Accepted ✓'
                              : ret.status === 'rejected'
                              ? 'Declined'
                              : 'Pending Chemist Action'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Patient: <strong className="text-slate-900">{ret.patientName}</strong> &bull;{' '}
                          {ret.patientPhone} &bull; Requested on {ret.requestedAt}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">
                          ₹{ret.totalRefundAmount.toFixed(2)}
                        </span>
                        <span className="block text-[11px] text-indigo-700 font-bold capitalize">
                          Requested: {ret.resolutionRequested}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Returned Medicine:
                        </span>
                        <p className="font-bold text-slate-900 text-sm">{ret.medicineName}</p>
                        <p className="text-slate-500 text-[11px]">
                          Quantity: {ret.quantity} unit(s) &bull; Unit MRP: ₹{ret.itemPrice}
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Reported Defect / Condition:
                        </span>
                        <p className="font-bold text-amber-900 capitalize">
                          {ret.reason.replace(/_/g, ' ')}
                        </p>
                        <p className="text-slate-600 text-[11px] mt-0.5 italic">
                          &ldquo;{ret.reasonDescription}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span>Batch: <strong>{ret.batchNumber || 'N/A'}</strong></span>
                          <span>Foil Expiry: <strong>{ret.expiryDateFound || 'N/A'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar for Chemist */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      {ret.status === 'accepted' || ret.status === 'approved' ? (
                        <div className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            {ret.pharmacyNotes || 'Claim accepted. Replacement dispatched & batch quarantined.'}
                          </span>
                        </div>
                      ) : ret.status === 'rejected' ? (
                        <div className="text-xs text-rose-700 font-bold">
                          Claim declined: {ret.pharmacyNotes || 'Inspection criteria not satisfied.'}
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => setSelectedReturnForProcessing(ret)}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                            title="Open review modal to approve or reject this return request"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Process Return</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              processReturnRequest(
                                ret.id,
                                'reject',
                                'Physical inspection showed packaging intact and within legitimate shelf life.'
                              )
                            }
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                          >
                            Reject
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              processReturnRequest(
                                ret.id,
                                'approve',
                                `Chemist inspected and verified ${ret.reason.replace(/_/g, ' ')}. ₹${ret.totalRefundAmount} settled & stock quarantined.`,
                                'Bin Q-04 (Damaged Shelf)'
                              )
                            }
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve (₹{ret.totalRefundAmount})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-slate-900">Inventory Alerts</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('doctors')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
            >
              Stock View
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            {lowStockMedicines.slice(0, 5).map((med) => (
              <div
                key={med.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-amber-50/30 transition"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{med.name}</h4>
                  <span className="text-[11px] text-slate-500">
                    Strength: {med.strength} • MRP: ₹{med.price.toFixed(2)}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-xs">
                    {med.stock} left
                  </span>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onNavigate('doctors')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer text-center"
            >
              Manage Full Inventory ({medicines.length} items) &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. COUNTER POS BILLING MODAL & TAX INVOICE PRINTER                        */}
      {/* ========================================================================= */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Receipt className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Walk-In Counter POS Billing &amp; Tax Invoice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fast retail billing with immediate stock deduction &amp; GST tax breakdown
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBillingModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {billingSuccess && generatedInvoice ? (
              /* Printable GST Tax Receipt Preview */
              <div className="space-y-4">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs space-y-3">
                  <div className="text-center border-b pb-2">
                    <h4 className="font-black text-sm text-slate-900">
                      PULSEMED 24x7 CHEMIST &amp; DRUGGISTS
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      DL: {generatedInvoice.dlNumber} • GSTIN: {generatedInvoice.gstin}
                    </p>
                    <p className="text-[10px] text-slate-500">Indiranagar 100ft Rd, Bengaluru - 560038</p>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-600 border-b pb-2">
                    <div>
                      <div>Inv: <strong>{generatedInvoice.invoiceNumber}</strong></div>
                      <div>Date: {generatedInvoice.date} {generatedInvoice.time}</div>
                    </div>
                    <div className="text-right">
                      <div>Cust: {generatedInvoice.customerName}</div>
                      <div>Ph: {generatedInvoice.customerPhone}</div>
                    </div>
                  </div>

                  <div className="border-b pb-2 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Item / Salt</span>
                      <span>Qty x Rate</span>
                      <span>Total</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-700">
                      <span>{generatedInvoice.medicineName}</span>
                      <span>{generatedInvoice.quantity} x ₹{generatedInvoice.unitPrice}</span>
                      <span className="font-bold">₹{generatedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Batch: {generatedInvoice.batchNumber} • Exp: {generatedInvoice.expiryDate}
                    </div>
                  </div>

                  <div className="space-y-1 border-b pb-2 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹{generatedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>CGST (6%):</span>
                      <span>₹{generatedInvoice.cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SGST (6%):</span>
                      <span>₹{generatedInvoice.sgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
                      <span>Grand Total:</span>
                      <span>₹{generatedInvoice.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-slate-500">
                    Mode: {generatedInvoice.paymentMethod} • Dispensed by: {generatedInvoice.pharmacistName}
                    <div className="font-bold text-emerald-700 mt-1">✓ Stock Deducted Automatically</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBillingSuccess(false);
                      setGeneratedInvoice(null);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Bill Next Customer
                  </button>
                </div>
              </div>
            ) : (
              /* Counter Bill Input Form */
              <form onSubmit={handleGenerateCounterBill} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={billingCustomerName}
                      onChange={(e) => setBillingCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={billingCustomerPhone}
                      onChange={(e) => setBillingCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Select Medicine from Stock *
                  </label>
                  <select
                    value={billingSelectedMedId}
                    onChange={(e) => setBillingSelectedMedId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  >
                    {medicines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.strength}) • ₹{m.discountPrice || m.price} • Stock: {m.stock} strips
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Quantity (Strips) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={billingQty}
                      onChange={(e) => setBillingQty(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={billingPaymentMethod}
                      onChange={(e) => setBillingPaymentMethod(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="UPI">UPI Instant (QR Scan)</option>
                      <option value="Cash">Cash at Counter</option>
                      <option value="Card">Debit / Credit Card</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Prescribing Physician (for Schedule H audit)
                  </label>
                  <input
                    type="text"
                    value={billingDoctorName}
                    onChange={(e) => setBillingDoctorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowBillingModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Generate Invoice &amp; Deduct Stock</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. WHOLESALER INWARD STOCK ENTRY MODAL                                    */}
      {/* ========================================================================= */}
      {showInwardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Wholesaler Inward Stock Receipt
                  </h3>
                  <p className="text-xs text-slate-500">
                    Accept delivery consignment and automatically increment stock in inventory
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInwardModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInwardStock} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Medicine SKU to Inward *
                </label>
                <select
                  value={inwardMedId}
                  onChange={(e) => setInwardMedId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} • Current Stock: {m.stock} strips
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Distributor / C&amp;F Agency
                </label>
                <input
                  type="text"
                  value={inwardDistributor}
                  onChange={(e) => setInwardDistributor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Wholesaler Invoice #
                  </label>
                  <input
                    type="text"
                    value={inwardInvoiceNo}
                    onChange={(e) => setInwardInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={inwardBatchNo}
                    onChange={(e) => setInwardBatchNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Expiry Date (MM/YYYY)
                  </label>
                  <input
                    type="text"
                    value={inwardExpDate}
                    onChange={(e) => setInwardExpDate(e.target.value)}
                    placeholder="12/2027"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Received Quantity (Strips) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={inwardQty}
                    onChange={(e) => setInwardQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInwardModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Accept Consignment &amp; Stock In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Process Return Request Modal */}
      {selectedReturnForProcessing && (
        <ProcessReturnModal
          isOpen={Boolean(selectedReturnForProcessing)}
          onClose={() => setSelectedReturnForProcessing(null)}
          returnRequest={selectedReturnForProcessing}
          onProcessReturn={(id, decision, notes, bin) => {
            processReturnRequest(id, decision, notes, bin);
          }}
        />
      )}
    </div>
  );
};
