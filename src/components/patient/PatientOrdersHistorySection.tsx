import React, { useState } from 'react';
import {
  Package,
  RotateCcw,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  FileText,
  DollarSign,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { PharmacyOrder, MedicineReturnRequest } from '../../types';
import { OrderTrackingModal } from '../pharmacy/OrderTrackingModal';
import { ReturnMedicineModal } from '../pharmacy/ReturnMedicineModal';

interface PatientOrdersHistorySectionProps {
  onNavigateToPharmacy?: () => void;
}

export const PatientOrdersHistorySection: React.FC<PatientOrdersHistorySectionProps> = ({
  onNavigateToPharmacy,
}) => {
  const { orders, medicineReturns, updateOrderStatus } = useHealth();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered' | 'returns'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [returnStatusFilter, setReturnStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modals
  const [trackingOrder, setTrackingOrder] = useState<PharmacyOrder | null>(null);
  const [returnOrder, setReturnOrder] = useState<PharmacyOrder | null>(null);

  const activeOrders = orders.filter((o) => o.status === 'processing' || o.status === 'shipped' || o.status === 'pending');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'active' && order.status === 'delivered') return false;
    if (activeTab === 'delivered' && order.status !== 'delivered') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesItem = order.items.some((it) => it.name.toLowerCase().includes(q));
      const matchesTx = order.transactionId.toLowerCase().includes(q);
      return matchesId || matchesItem || matchesTx;
    }
    return true;
  });

  const filteredReturns = medicineReturns.filter((ret) => {
    if (returnStatusFilter === 'pending') return ret.status === 'pending';
    if (returnStatusFilter === 'approved') return ret.status === 'approved' || ret.status === 'accepted';
    if (returnStatusFilter === 'rejected') return ret.status === 'rejected';

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ret.id.toLowerCase().includes(q) ||
        ret.orderId.toLowerCase().includes(q) ||
        ret.medicineName.toLowerCase().includes(q) ||
        ret.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Orders &amp; Returns History
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track your doorstep medicine deliveries, review order invoices, and monitor return or replacement claims.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToPharmacy && (
            <button
              type="button"
              onClick={onNavigateToPharmacy}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <span>+ Order Medicines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer text-center ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold ${activeTab === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>
            Total Orders
          </span>
          <div className="text-xl font-black mt-0.5">{orders.length}</div>
          <span className={`text-[10px] ${activeTab === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
            All Time
          </span>
        </div>

        <div
          onClick={() => setActiveTab('active')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer text-center ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-blue-50/70 border-blue-200 text-blue-900 hover:bg-blue-50'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold ${activeTab === 'active' ? 'text-blue-100' : 'text-blue-700'}`}>
            Active Deliveries
          </span>
          <div className="text-xl font-black mt-0.5">{activeOrders.length}</div>
          <span className={`text-[10px] ${activeTab === 'active' ? 'text-blue-100' : 'text-blue-700'}`}>
            In Transit / Packed
          </span>
        </div>

        <div
          onClick={() => setActiveTab('delivered')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer text-center ${
            activeTab === 'delivered'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-50'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold ${activeTab === 'delivered' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Delivered Orders
          </span>
          <div className="text-xl font-black mt-0.5">{deliveredOrders.length}</div>
          <span className={`text-[10px] ${activeTab === 'delivered' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Completed
          </span>
        </div>

        <div
          onClick={() => setActiveTab('returns')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer text-center ${
            activeTab === 'returns'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-amber-50/70 border-amber-200 text-amber-900 hover:bg-amber-50'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold ${activeTab === 'returns' ? 'text-amber-100' : 'text-amber-700'}`}>
            Returned Orders
          </span>
          <div className="text-xl font-black mt-0.5">{medicineReturns.length}</div>
          <span className={`text-[10px] ${activeTab === 'returns' ? 'text-amber-100' : 'text-amber-700'}`}>
            Claims &amp; Refunds
          </span>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Deliveries ({activeOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'delivered' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delivered ({deliveredOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('returns')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'returns' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Returned Orders ({medicineReturns.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, medicine..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* VIEW: ORDER HISTORY (all / active / delivered) */}
      {activeTab !== 'returns' && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs space-y-2">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600 text-sm">No Orders Found</p>
              <p>You haven't placed any pharmacy orders matching this filter.</p>
              {onNavigateToPharmacy && (
                <button
                  type="button"
                  onClick={onNavigateToPharmacy}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                >
                  <span>Browse Medicine Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const orderReturns = medicineReturns.filter((r) => r.orderId === order.id);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-slate-900">
                          Order #{order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-xs text-slate-500">Ordered: {order.orderedAt}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Est. Delivery: <strong>{order.estimatedDelivery}</strong> &bull; Tx: {order.transactionId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setTrackingOrder(order)}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Truck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Track Live Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReturnOrder(order)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Submit return request for expired or damaged medicine"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Request Return / Exchange</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Returns / Claims Banner for this order */}
                  {orderReturns.length > 0 && (
                    <div className="space-y-2">
                      {orderReturns.map((ret) => (
                        <div
                          key={ret.id}
                          className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
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
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono font-bold text-slate-800">
                              ₹{ret.totalRefundAmount} ({ret.resolutionRequested})
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                ret.status === 'accepted' || ret.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ret.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-200 text-amber-900'
                              }`}
                            >
                              {ret.status === 'accepted' || ret.status === 'approved'
                                ? 'Approved & Settled ✓'
                                : ret.status === 'rejected'
                                ? 'Rejected'
                                : 'Chemist Review Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block mb-2">
                        Prescribed Medicines ({order.items.length})
                      </span>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Qty: {item.quantity} &bull; ₹{item.price} each
                                </span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-slate-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block mb-1">
                          Delivery Address &bull; Recipient
                        </span>
                        <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                        <p className="text-slate-600 text-xs">
                          {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.zip}
                        </p>
                        <p className="text-slate-500 text-[11px]">Phone: {order.shippingAddress.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Payment: <strong>{order.paymentMethod}</strong></span>
                        <span className="text-sm font-black text-slate-900">
                          Total: ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW: RETURNED ORDERS & CLAIMS HISTORY */}
      {activeTab === 'returns' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <span>Returned Orders &bull; Quality &amp; Expiry Claims</span>
              </h3>
              <p className="text-xs text-slate-500">
                Log of returned medications, damaged packaging reports, batch audits, and refund settlements.
              </p>
            </div>

            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => setReturnOrder(orders[0])}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>+ Submit New Return Request</span>
              </button>
            )}
          </div>

          {/* Status Subfilters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold w-fit">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setReturnStatusFilter(filterKey)}
                className={`px-3 py-1 rounded-lg transition capitalize cursor-pointer ${
                  returnStatusFilter === filterKey
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filterKey === 'all'
                  ? `All Claims (${medicineReturns.length})`
                  : filterKey === 'pending'
                  ? `Pending Review (${medicineReturns.filter((r) => r.status === 'pending').length})`
                  : filterKey === 'approved'
                  ? `Approved & Settled (${medicineReturns.filter((r) => r.status === 'approved' || r.status === 'accepted').length})`
                  : `Rejected (${medicineReturns.filter((r) => r.status === 'rejected').length})`}
              </button>
            ))}
          </div>

          {/* Returns Cards List */}
          {filteredReturns.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs space-y-2">
              <RotateCcw className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600 text-sm">No Return Claims</p>
              <p>No medication returns match the selected filter.</p>
            </div>
          ) : (
            filteredReturns.map((ret) => (
              <div
                key={ret.id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs space-y-4 transition ${
                  ret.status === 'accepted' || ret.status === 'approved'
                    ? 'border-emerald-300'
                    : ret.status === 'rejected'
                    ? 'border-rose-300'
                    : 'border-amber-300 hover:border-amber-400'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-900">
                        Claim #{ret.id}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        (Order #{ret.orderId})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          ret.status === 'accepted' || ret.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ret.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}
                      >
                        {ret.status === 'accepted' || ret.status === 'approved'
                          ? 'Approved & Settled ✓'
                          : ret.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending Chemist Review'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Requested on: <strong>{ret.requestedAt}</strong> &bull; Resolution: <strong className="capitalize">{ret.resolutionRequested}</strong>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-slate-900">
                      ₹{ret.totalRefundAmount.toFixed(2)} INR
                    </div>
                    <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                      {ret.resolutionRequested === 'refund' ? 'Refund to Source Account' : 'Direct Replacement'}
                    </span>
                  </div>
                </div>

                {/* Return Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Returned Medicine
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{ret.medicineName}</p>
                    <p className="text-slate-600 text-xs">
                      Quantity: <strong>{ret.quantity} unit(s)</strong> &bull; MRP: ₹{ret.itemPrice}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span>Batch: <strong>{ret.batchNumber || 'N/A'}</strong></span>
                      <span>Printed Expiry: <strong>{ret.expiryDateFound || 'N/A'}</strong></span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Reason for Return
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-[11px] bg-amber-100 text-amber-900 capitalize">
                      {ret.reason.replace(/_/g, ' ')}
                    </span>
                    <p className="text-slate-700 text-xs italic mt-1">
                      &ldquo;{ret.reasonDescription}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Pharmacy Inspection Log if processed */}
                {ret.pharmacyNotes && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Chemist Inspection &amp; Settlement Note:
                    </span>
                    <p className="text-slate-800 font-medium">{ret.pharmacyNotes}</p>
                    {ret.quarantineBinId && (
                      <span className="text-[11px] text-amber-800 font-mono block">
                        Quarantine Shelf: {ret.quarantineBinId}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <OrderTrackingModal
        order={trackingOrder}
        isOpen={!!trackingOrder}
        onClose={() => setTrackingOrder(null)}
        onUpdateStatus={(id, status) => updateOrderStatus(id, status)}
      />

      {returnOrder && (
        <ReturnMedicineModal
          order={returnOrder}
          isOpen={!!returnOrder}
          onClose={() => setReturnOrder(null)}
        />
      )}
    </div>
  );
};
