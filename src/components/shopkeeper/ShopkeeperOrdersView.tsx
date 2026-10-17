import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Search,
  Check,
  AlertCircle,
  Eye,
  X,
  Printer,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { PharmacyOrder, MedicineReturnRequest } from '../../types';
import { BottomNavTab } from '../BottomNav';
import { ProcessReturnModal } from './ProcessReturnModal';

interface ShopkeeperOrdersViewProps {
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
}

export const ShopkeeperOrdersView: React.FC<ShopkeeperOrdersViewProps> = ({ onNavigate }) => {
  const { orders, updateOrderStatus, medicineReturns, processReturnRequest } = useHealth();

  const [activeViewTab, setActiveViewTab] = useState<'orders' | 'returns'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [returnStatusFilter, setReturnStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingOrder, setInspectingOrder] = useState<PharmacyOrder | null>(null);
  const [viewingRxPhoto, setViewingRxPhoto] = useState<string | null>(null);
  const [selectedReturnForProcessing, setSelectedReturnForProcessing] = useState<MedicineReturnRequest | null>(null);

  const pendingReturnsCount = medicineReturns.filter((r) => r.status === 'pending').length;

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.shippingAddress.fullName.toLowerCase().includes(q) ||
        order.shippingAddress.phone.includes(q)
      );
    }
    return true;
  });

  const filteredReturns = medicineReturns.filter((ret) => {
    if (returnStatusFilter === 'pending') return ret.status === 'pending';
    if (returnStatusFilter === 'approved') return ret.status === 'approved' || ret.status === 'accepted';
    if (returnStatusFilter === 'rejected') return ret.status === 'rejected';

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ret.id.toLowerCase().includes(q) ||
        ret.orderId.toLowerCase().includes(q) ||
        ret.patientName.toLowerCase().includes(q) ||
        ret.medicineName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Chemist Dispensing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Prescription Orders &amp; Returns Desk
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verify physician prescriptions, pack temperature-monitored medicines, and inspect returned medications or defect claims.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold">
            GSTIN: 29AABCP1330F1Z4
          </span>
        </div>
      </div>

      {/* Main Switcher: Orders vs Returns */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveViewTab('orders')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeViewTab === 'orders'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-amber-600" />
          <span>Orders &amp; Dispensation ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveViewTab('returns')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeViewTab === 'returns'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-amber-600" />
          <span>Returned Orders &amp; Safety Claims ({medicineReturns.length})</span>
          {pendingReturnsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
              {pendingReturnsCount} Action Needed
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ORDERS & DISPENSATION VIEW                                     */}
      {/* ========================================================================= */}
      {activeViewTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto text-xs font-semibold">
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition whitespace-nowrap cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white text-amber-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order #, customer or phone..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                No pharmacy orders match the selected filter.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const orderReturns = medicineReturns.filter((r) => r.orderId === order.id);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
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
                          <span className="text-slate-400 text-xs">&bull;</span>
                          <span className="text-xs text-slate-500">Date: {order.orderedAt}</span>
                        </div>

                        <p className="text-xs text-slate-600">
                          Recipient: <strong className="text-slate-900">{order.shippingAddress.fullName}</strong> &bull;{' '}
                          {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.zip} &bull;{' '}
                          Tel: {order.shippingAddress.phone}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-base font-black text-slate-900">
                          ₹{order.totalAmount.toFixed(2)} INR
                        </div>
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                          Payment: {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Return Claims banner on this order */}
                    {orderReturns.length > 0 && (
                      <div className="space-y-2">
                        {orderReturns.map((ret) => (
                          <div
                            key={ret.id}
                            className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                              <div>
                                <span className="font-bold text-slate-900">
                                  Return Claim #{ret.id} ({ret.medicineName}):
                                </span>
                                <span className="text-slate-600 ml-1">
                                  {ret.reason.replace(/_/g, ' ')} &bull; {ret.reasonDescription}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                  ret.status === 'approved' || ret.status === 'accepted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ret.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-200 text-amber-900'
                                }`}
                              >
                                {ret.status === 'approved' || ret.status === 'accepted'
                                  ? 'Approved & Settled ✓'
                                  : ret.status === 'rejected'
                                  ? 'Rejected'
                                  : 'Pending Chemist Inspection'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedReturnForProcessing(ret)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Inspect Return
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Items List */}
                    <div className="bg-slate-50 rounded-2xl p-3 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Prescribed Medicines ({order.items.length})</span>
                        <span>Price (₹ INR)</span>
                      </div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 last:border-0">
                          <div>
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="ml-2 text-slate-400">Qty: {item.quantity} strips</span>
                          </div>
                          <span className="font-mono font-bold text-slate-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Action Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Attached Doctor Prescription:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setViewingRxPhoto(
                              order.prescriptionFile ||
                                'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
                            )
                          }
                          className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>View Prescription Slip</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {order.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>1. Verify Rx &amp; Pack Order</span>
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>2. Handover to Courier (Out for Delivery)</span>
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>3. Confirm Customer Delivery</span>
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Successfully Delivered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: RETURNED ORDERS & SAFETY CLAIMS VIEW                           */}
      {/* ========================================================================= */}
      {activeViewTab === 'returns' && (
        <div className="space-y-5">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Return Claims</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{medicineReturns.length}</div>
              <span className="text-[10px] text-slate-500">Tracked in Pharmacy</span>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-700">Awaiting Chemist Review</span>
              <div className="text-xl font-black text-amber-900 mt-0.5">
                {medicineReturns.filter((r) => r.status === 'pending').length}
              </div>
              <span className="text-[10px] text-amber-700 font-bold">Action Needed</span>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Approved &amp; Settled</span>
              <div className="text-xl font-black text-emerald-900 mt-0.5">
                {medicineReturns.filter((r) => r.status === 'approved' || r.status === 'accepted').length}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">Refunded / Replaced</span>
            </div>
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-rose-700">Rejected Claims</span>
              <div className="text-xl font-black text-rose-900 mt-0.5">
                {medicineReturns.filter((r) => r.status === 'rejected').length}
              </div>
              <span className="text-[10px] text-rose-600">Disallowed</span>
            </div>
          </div>

          {/* Subfilters & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold w-full md:w-auto overflow-x-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setReturnStatusFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-lg transition capitalize cursor-pointer whitespace-nowrap ${
                    returnStatusFilter === filterKey
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filterKey === 'all'
                    ? `All Returns (${medicineReturns.length})`
                    : filterKey === 'pending'
                    ? `Pending (${medicineReturns.filter((r) => r.status === 'pending').length})`
                    : filterKey === 'approved'
                    ? `Approved (${medicineReturns.filter((r) => r.status === 'approved' || r.status === 'accepted').length})`
                    : `Rejected (${medicineReturns.filter((r) => r.status === 'rejected').length})`}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search return by claim #, patient, drug..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Return Requests Cards List */}
          {filteredReturns.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
              No return requests match the selected criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReturns.map((ret) => (
                <div
                  key={ret.id}
                  className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs space-y-4 transition ${
                    ret.status === 'approved' || ret.status === 'accepted'
                      ? 'border-emerald-300'
                      : ret.status === 'rejected'
                      ? 'border-rose-300'
                      : 'border-amber-300 hover:border-amber-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-slate-900">
                          Claim #{ret.id}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          (Ref Order #{ret.orderId})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            ret.status === 'approved' || ret.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ret.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900 animate-pulse'
                          }`}
                        >
                          {ret.status === 'approved' || ret.status === 'accepted'
                            ? 'Approved & Settled ✓'
                            : ret.status === 'rejected'
                            ? 'Rejected'
                            : 'Pending Chemist Inspection'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Patient: <strong className="text-slate-900">{ret.patientName}</strong> &bull;{' '}
                        {ret.patientPhone} &bull; Requested on {ret.requestedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left sm:text-right">
                        <div className="text-base font-black text-slate-900">
                          ₹{ret.totalRefundAmount.toFixed(2)} INR
                        </div>
                        <span className="text-[11px] text-indigo-700 font-bold capitalize">
                          Resolution: {ret.resolutionRequested}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReturnForProcessing(ret)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Inspect &amp; Process</span>
                      </button>
                    </div>
                  </div>

                  {/* Return Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Returned Medicine &bull; Batch Details
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{ret.medicineName}</p>
                      <p className="text-slate-500 text-xs">
                        Quantity: <strong>{ret.quantity} unit(s)</strong> &bull; Unit MRP: ₹{ret.itemPrice}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                        <span>Batch: <strong>{ret.batchNumber || 'N/A'}</strong></span>
                        <span>Printed Exp: <strong>{ret.expiryDateFound || 'N/A'}</strong></span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Defect / Expiry Details
                      </span>
                      <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-[11px] bg-amber-100 text-amber-900 capitalize">
                        {ret.reason.replace(/_/g, ' ')}
                      </span>
                      <p className="text-slate-600 text-xs mt-1 italic">
                        &ldquo;{ret.reasonDescription}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Pharmacy Inspection Notes & Quarantine Shelf */}
                  {ret.pharmacyNotes && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Chemist Verification Record:
                      </span>
                      <p className="text-slate-800 font-medium">{ret.pharmacyNotes}</p>
                      {ret.quarantineBinId && (
                        <span className="text-[11px] text-amber-800 font-mono block">
                          Quarantine Bin Location: {ret.quarantineBinId}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prescription Photo Viewer Modal */}
      {viewingRxPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Doctor Prescription Photo / Slip
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingRxPhoto(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96">
              <img
                src={viewingRxPhoto}
                alt="Prescription Slip"
                className="w-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Doctor Signature Verified
              </span>
              <button
                type="button"
                onClick={() => setViewingRxPhoto(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Process Modal */}
      <ProcessReturnModal
        isOpen={!!selectedReturnForProcessing}
        onClose={() => setSelectedReturnForProcessing(null)}
        returnRequest={selectedReturnForProcessing}
        onProcessReturn={(returnId, decision, notes, quarantineBin) => {
          processReturnRequest(returnId, decision, notes, quarantineBin);
        }}
      />
    </div>
  );
};
