import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Thermometer,
  AlertCircle,
  Navigation,
  Package,
  User,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { PharmacyOrder } from '../../types';

interface OrderTrackingModalProps {
  order: PharmacyOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: PharmacyOrder['status']) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [simulatedStep, setSimulatedStep] = useState<number>(3); // 0: Placed, 1: Verified, 2: Packed, 3: In-Transit, 4: Out for Delivery, 5: Delivered
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen || !order) return null;

  const steps = [
    {
      title: 'Order Placed & Confirmed',
      desc: 'Digital prescription verified & payment captured via UPI',
      time: order.orderedAt || 'Today, 10:15 AM',
      icon: Package,
    },
    {
      title: 'Pharmacist Prescription Review',
      desc: 'Pharmacist Rajesh Kumar (Reg #44910) verified dosages & batch integrity',
      time: 'Today, 10:28 AM',
      icon: ShieldCheck,
    },
    {
      title: 'Cold-Chain Packing & Quality Sealed',
      desc: 'Packed in insulated box with IoT temperature data logger at 4.2°C',
      time: 'Today, 10:42 AM',
      icon: Thermometer,
    },
    {
      title: 'Dispatched with Medimart Express',
      desc: 'Handed over to cold-chain delivery rider (KA-03-EM-8821)',
      time: 'Today, 11:05 AM',
      icon: Truck,
    },
    {
      title: 'Out for Doorstep Delivery',
      desc: 'Rider is 1.4 km away, approaching your destination',
      time: 'Live Now &bull; ETA 12 mins',
      icon: Navigation,
    },
    {
      title: 'Delivered to Patient',
      desc: 'Package handed over with OTP verification',
      time: 'Expected: ' + (order.estimatedDelivery || 'Today by 12:30 PM'),
      icon: CheckCircle2,
    },
  ];

  const handleAdvanceSimulation = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSimulatedStep((prev) => {
        const next = prev < 5 ? prev + 1 : 0;
        if (next === 5 && onUpdateStatus) {
          onUpdateStatus(order.id, 'delivered');
        } else if (next >= 3 && onUpdateStatus) {
          onUpdateStatus(order.id, 'shipped');
        }
        return next;
      });
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Live Medimart Order Tracking
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold">
                  Order #{order.id}
                </span>
              </div>
              <p className="text-[11px] text-teal-300">
                Temperature-controlled express courier &bull; Expected in 14-18 mins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAdvanceSimulation}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-white/10 cursor-pointer"
              title="Simulate courier progress"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh GPS</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto bg-slate-50/50">
          {/* 1. LIVE DELIVERY MAP & ROUTE SIMULATION CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Live Dispatch Route Simulation
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                1.4 km to destination
              </span>
            </div>

            {/* Interactive Progress Highway Banner */}
            <div className="relative bg-slate-900 rounded-xl p-4 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="text-[10px] text-teal-300 font-bold block uppercase">Pharmacy Origin</span>
                  <strong className="text-white">PulseMed Chemist</strong>
                  <span className="text-[10px] text-slate-400 block">Indiranagar 100ft Rd</span>
                </div>

                {/* Animated Highway Line */}
                <div className="flex-1 mx-4 relative">
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-indigo-400 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min(100, ((simulatedStep + 1) / 6) * 100)}%` }}
                    />
                  </div>
                  <div
                    className="absolute -top-3 text-teal-400 transition-all duration-500 transform -translate-x-1/2"
                    style={{ left: `${Math.min(95, Math.max(5, ((simulatedStep + 1) / 6) * 100))}%` }}
                  >
                    <div className="p-1 rounded-full bg-teal-500 text-slate-950 shadow-md shadow-teal-500/50">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-teal-300 font-bold block uppercase">Your Doorstep</span>
                  <strong className="text-white">{order.shippingAddress.city || 'Bengaluru'}</strong>
                  <span className="text-[10px] text-slate-400 block">{order.shippingAddress.zip || '560038'}</span>
                </div>
              </div>
            </div>

            {/* Live Metrics Bar: Temp + OTP + ETA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              {/* Cold Chain Box Temperature */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Thermometer className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Cold-Box Temp</span>
                  <strong className="text-emerald-950 font-mono text-sm">4.2°C &bull; Optimal</strong>
                  <span className="text-[10px] text-emerald-700 block">Active 2°C &ndash; 8°C Sera safe</span>
                </div>
              </div>

              {/* Delivery OTP Security Code */}
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                </div>
                <div>
                  <span className="text-[10px] text-indigo-800 font-bold uppercase block">Delivery OTP</span>
                  <strong className="text-indigo-950 font-mono text-sm tracking-widest">7842</strong>
                  <span className="text-[10px] text-indigo-700 block">Share with rider on arrival</span>
                </div>
              </div>

              {/* Courier Partner Details */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
                  <User className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Rider Partner</span>
                  <strong className="text-slate-900 text-xs">Ramesh K. (4.9 ★)</strong>
                  <span className="text-[10px] text-teal-700 font-bold block">+91 98450 77112</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. STEP-BY-STEP DETAILED MILESTONE TRACKER */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              Real-time Milestone Timeline
            </h4>

            <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {steps.map((step, idx) => {
                const isCompleted = idx <= simulatedStep;
                const isCurrent = idx === simulatedStep;
                const IconComponent = step.icon;

                return (
                  <div key={idx} className="relative flex items-start gap-3.5 pl-1 text-xs">
                    {/* Circle Node */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        isCompleted
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-300 border-slate-200'
                      } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 pb-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                        <strong
                          className={`text-xs ${
                            isCompleted ? 'text-slate-900 font-black' : 'text-slate-400 font-medium'
                          }`}
                        >
                          {step.title}
                        </strong>
                        <span
                          className={`text-[10px] font-mono ${
                            isCurrent
                              ? 'text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.time}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. ORDERED MEDICATIONS SUMMARY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs text-xs space-y-2.5">
            <span className="font-bold text-slate-600 block uppercase text-[10px] tracking-wider">
              En Route Packages ({order.items.length} items &bull; Total ₹{order.totalAmount})
            </span>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, i) => (
                <div key={i} className="py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-6 h-6 rounded object-cover border border-slate-200"
                    />
                    <span className="text-slate-900 font-medium">
                      {item.name} <strong className="text-slate-600">x{item.quantity}</strong>
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Delivery query? Call <strong>1800-419-MEDIMART</strong> (24x7 Support)
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
