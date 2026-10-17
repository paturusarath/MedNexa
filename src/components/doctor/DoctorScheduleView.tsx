import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  FileText,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { Appointment } from '../../types';
import { BottomNavTab } from '../BottomNav';

interface DoctorScheduleViewProps {
  onNavigate?: (tab: BottomNavTab, subSection?: string) => void;
}

export const DoctorScheduleView: React.FC<DoctorScheduleViewProps> = ({ onNavigate }) => {
  const { appointments, startConsultation, cancelAppointment } = useHealth();

  const [selectedDay, setSelectedDay] = useState('Today (May 12, 2025)');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'in-clinic' | 'cancelled'>('all');
  const [isAcceptingInstantCalls, setIsAcceptingInstantCalls] = useState(true);

  const filteredAppointments = appointments.filter((appt) => {
    if (filterType === 'all') return true;
    if (filterType === 'cancelled') return appt.status?.toLowerCase().includes('cancel');
    return appt.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Schedule Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Doctor Schedule &amp; Consultations
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage daily appointments, video teleconsultations, and clinical consultation slots.
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-xs font-bold text-slate-700">Teleconsult Status:</span>
          <button
            type="button"
            onClick={() => setIsAcceptingInstantCalls(!isAcceptingInstantCalls)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isAcceptingInstantCalls
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAcceptingInstantCalls ? 'bg-white animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>{isAcceptingInstantCalls ? 'Online (Accepting Calls)' : 'Offline'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'all'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Appointments ({appointments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'video'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-teal-600" />
            <span>Video Consultations</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('in-clinic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'in-clinic'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
            <span>In-Clinic OPD</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'cancelled'
                ? 'bg-white text-rose-900 shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Cancelled ({appointments.filter((a) => a.status?.toLowerCase().includes('cancel')).length})</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          Consultation Fee: <span className="text-emerald-700 font-black">₹800 (Video) / ₹1,200 (OPD)</span>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
            No appointments found for the selected filter.
          </div>
        ) : (
          filteredAppointments.map((appt) => {
            const isCancelled = Boolean(appt.status && appt.status.toLowerCase().includes('cancel'));
            const isCompleted = Boolean(appt.status && appt.status.toLowerCase() === 'completed');

            return (
              <div
                key={appt.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCancelled
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCancelled
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : appt.type === 'video'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {isCancelled ? (
                      <XCircle className="w-6 h-6" />
                    ) : appt.type === 'video' ? (
                      <Video className="w-6 h-6" />
                    ) : (
                      <Stethoscope className="w-6 h-6" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-bold text-sm sm:text-base ${isCancelled ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {appt.patientName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                        {appt.type}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isCompleted
                            ? 'bg-slate-100 text-slate-800 border border-slate-200'
                            : appt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isCancelled ? 'Cancelled' : appt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        Slot: <strong className="text-slate-800">{appt.timeSlot}</strong>
                      </span>
                      <span>•</span>
                      <span>Date: {appt.date}</span>
                      <span>•</span>
                      <span className="font-bold text-emerald-700">Fee: ₹800 INR</span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl mt-1.5 leading-snug">
                      <strong className="text-slate-800">Chief Complaint:</strong> {appt.reason}
                    </p>
                  </div>
                </div>

                {/* Action buttons: When cancelled, Video Room is strictly disabled & hidden */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {isCancelled ? (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 shadow-2xs">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>Appointment Cancelled &bull; Slot Released (Video Call Closed)</span>
                    </div>
                  ) : (
                    <>
                      {appt.type === 'video' && !isCompleted && (
                        <button
                          type="button"
                          onClick={() => startConsultation(appt)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Enter Video Room</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('shopping')}
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Write e-Rx</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelAppointment(appt.id)}
                        className="px-3 py-2 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                        title="Cancel appointment"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
