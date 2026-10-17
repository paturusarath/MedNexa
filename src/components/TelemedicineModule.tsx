import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Video,
  Star,
  Search,
  Filter,
  FileText,
  UserCheck,
  Building2,
  GraduationCap,
  Sparkles,
  Phone,
  ChevronRight,
  Plus,
  ShoppingCart,
  XCircle,
  X,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Doctor, Appointment } from '../types';
import { UnifiedPaymentSelector, PaymentMethodType } from './common/UnifiedPaymentSelector';

interface TelemedicineModuleProps {
  initialDoctorToBook?: Doctor | null;
  onNavigateToShopping?: () => void;
}

export const TelemedicineModule: React.FC<TelemedicineModuleProps> = ({
  initialDoctorToBook,
  onNavigateToShopping,
}) => {
  const {
    doctors,
    appointments,
    bookAppointment,
    cancelAppointment,
    startConsultation,
    prescriptions,
    setActivePrescriptionModal,
    addPrescriptionToCart,
    role,
  } = useHealth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [maxFee, setMaxFee] = useState<number>(1500);

  // Doctor Details Profile Modal
  const [viewingDoctorDetails, setViewingDoctorDetails] = useState<Doctor | null>(null);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(initialDoctorToBook || null);
  const [bookingDate, setBookingDate] = useState('2026-09-24');
  const [bookingSlot, setBookingSlot] = useState(
    initialDoctorToBook?.availableSlots[0] || '10:30 AM'
  );
  const [bookingType, setBookingType] = useState<'video' | 'in-clinic' | 'audio'>('video');
  const [bookingReason, setBookingReason] = useState('Routine health check and prescription renewal');
  const [doctorPaymentMethod, setDoctorPaymentMethod] = useState<PaymentMethodType>('upi');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Sync when parent component passes a doctor to book/consult (e.g. treating doctor)
  useEffect(() => {
    if (initialDoctorToBook) {
      setBookingDoctor(initialDoctorToBook);
      setBookingSlot(initialDoctorToBook.availableSlots[0] || '10:30 AM');
      setSubTab('directory');
    }
  }, [initialDoctorToBook]);

  // Tab within module: 'directory' | 'appointments' | 'prescriptions'
  const [subTab, setSubTab] = useState<'directory' | 'appointments' | 'prescriptions'>('directory');

  const specialties = [
    'All',
    'Endocrinology & Diabetes',
    'Cardiology',
    'Pulmonology & Respiratory',
    'Thyroid & Endocrinology',
    'Neurology',
    'Pediatrics',
    'Dermatology',
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialization.includes(selectedSpecialty);
    const matchesFee = doc.fee <= maxFee;
    return matchesSearch && matchesSpecialty && matchesFee;
  });

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor) return;
    setIsSubmittingBooking(true);
    try {
      await bookAppointment(bookingDoctor, bookingDate, bookingSlot, bookingType, bookingReason);
      setBookingDoctor(null);
      setSubTab('appointments');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-teal-600" />
            Telemedicine &amp; Clinical Consultations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Board-certified specialist directory, interactive scheduling, and encrypted digital prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              subTab === 'directory' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doctor Directory
          </button>
          <button
            type="button"
            onClick={() => setSubTab('appointments')}
            className={`px-3.5 py-1.5 rounded-lg transition relative ${
              subTab === 'appointments' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Appointments
            {appointments.filter((a) => a.status === 'confirmed').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-teal-600 text-white rounded-full text-[10px]">
                {appointments.filter((a) => a.status === 'confirmed').length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('prescriptions')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              subTab === 'prescriptions' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            e-Prescriptions (e-Rx)
          </button>
        </div>
      </div>

      {/* VIEW 1: Doctor Directory */}
      {subTab === 'directory' && (
        <div className="space-y-6">
          {initialDoctorToBook && (
            <div className="bg-gradient-to-r from-teal-900 to-indigo-950 text-white rounded-3xl p-5 border border-teal-700/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={initialDoctorToBook.avatar}
                  alt={initialDoctorToBook.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-400 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-400/30">
                      Assigned Treating Physician
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Care Provider
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {initialDoctorToBook.name}
                  </h3>
                  <p className="text-xs text-teal-200">
                    {initialDoctorToBook.specialization} &bull; {initialDoctorToBook.hospital}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBookingDoctor(initialDoctorToBook)}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
                >
                  Consult / Book Now &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Filter Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, or hospital..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'All Specializations' : s}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex items-center justify-between gap-3 px-2">
              <span className="text-xs text-slate-500 shrink-0 font-medium">Max Fee: ₹{maxFee}</span>
              <input
                type="range"
                min="500"
                max="2000"
                step="50"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-300 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {doc.specialization}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                          <span className="text-slate-400 font-normal text-[11px]">({doc.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">{doc.name}</h3>
                      <p className="text-xs text-slate-500 font-medium truncate">{doc.title}</p>
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.hospital}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.education}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.experienceYears} yrs experience &bull; {doc.languages.join(', ')}</span>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Consultation Fee</span>
                    <span className="text-base font-bold text-slate-900">₹{doc.fee}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingDoctorDetails(doc)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                      title="View Doctor Profile & Qualifications"
                    >
                      Doctor Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBookingDoctor(doc);
                        setBookingSlot(doc.availableSlots[0] || '10:00 AM');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Book
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Appointments List */}
      {subTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Scheduled &amp; Past Telehealth Consultations
            </h3>
            <button
              type="button"
              onClick={() => setSubTab('directory')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule New Consultation
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    apt.status === 'confirmed' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{apt.doctorName}</span>
                      <span className="text-xs text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded">
                        {apt.doctorSpecialization}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {apt.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {apt.timeSlot}
                      </span>
                      <span>Type: <strong className="text-slate-700 capitalize">{apt.type} Visit</strong></span>
                      <span>Fee: <strong className="text-slate-700">₹{apt.fee} (Paid)</strong></span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 italic">
                      Chief Complaint: "{apt.reason}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {apt.status?.toLowerCase().includes('cancel') && (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cancelled (Slot Released)</span>
                    </span>
                  )}

                  {!apt.status?.toLowerCase().includes('cancel') && apt.status === 'confirmed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => startConsultation(apt)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Enter Video Call
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelAppointment(apt.id)}
                        className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl text-xs font-medium transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {apt.prescriptionId && (
                    <button
                      type="button"
                      onClick={() => {
                        const rx = prescriptions.find((p) => p.id === apt.prescriptionId);
                        if (rx) setActivePrescriptionModal(rx);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View e-Rx
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: e-Prescriptions */}
      {subTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Verified Digital Prescriptions (e-Rx)
            </h3>
            <span className="text-xs text-slate-500">
              {prescriptions.length} official clinical records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                    #{rx.id}
                  </span>
                  <span className="text-xs text-slate-500">{rx.date}</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rx.doctorName}</h4>
                  <p className="text-xs text-teal-700">{rx.doctorSpecialization}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Diagnosis: <strong className="text-slate-800">{rx.diagnosis}</strong>
                  </p>
                </div>

                {/* Medicine preview */}
                <div className="bg-slate-50 rounded-xl p-2.5 space-y-1 text-xs">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">
                    Prescribed Medications ({rx.medicines.length})
                  </div>
                  {rx.medicines.map((m, i) => (
                    <div key={i} className="flex justify-between text-slate-700">
                      <span className="font-medium truncate">{m.name}</span>
                      <span className="text-slate-500 text-[11px] shrink-0">{m.dosage}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Follow-up: {rx.followUpDate}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addPrescriptionToCart(rx);
                        if (onNavigateToShopping) {
                          onNavigateToShopping();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                      title="Shop prescribed medications into pharmacy cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Shop Medicines</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePrescriptionModal(rx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Certificate</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Appointment Modal - Responsive to any screen size */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-3xl max-w-xl lg:max-w-2xl w-full shadow-2xl border border-slate-200/90 max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Sticky Header: Doctor identity & Fee preview */}
            <div className="shrink-0 p-4 sm:px-6 sm:py-4 border-b border-slate-200/90 bg-white flex items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={bookingDoctor.avatar}
                    alt={bookingDoctor.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
                    title="Available for consultation"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {bookingDoctor.name}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 shrink-0 font-mono">
                      ₹{bookingDoctor.fee} INR
                    </span>
                  </div>
                  <p className="text-xs text-teal-700 font-medium truncate">
                    {bookingDoctor.specialization} &bull; <span className="text-slate-500">{bookingDoctor.hospital}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBookingDoctor(null)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleConfirmBooking} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-5 space-y-4 text-xs overscroll-contain">
                {/* Consultation Type Selector */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Consultation Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingType('video')}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl border text-center font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        bookingType === 'video'
                          ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5 text-teal-600" />
                      <span className="truncate">Video Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('audio')}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl border text-center font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        bookingType === 'audio'
                          ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span className="truncate">Audio Only</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('in-clinic')}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl border text-center font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        bookingType === 'in-clinic'
                          ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      <span className="truncate">In-Clinic</span>
                    </button>
                  </div>
                </div>

                {/* Date & Slot Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min="2026-09-22"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-500 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Available Time Slot</label>
                    <select
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-500 font-sans"
                    >
                      {bookingDoctor.availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Chief Complaint / Reason */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Reason for Visit / Symptoms
                  </label>
                  <textarea
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    rows={2}
                    placeholder="Describe current symptoms or reason for scheduling..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-teal-500 resize-none font-sans"
                    required
                  />
                </div>

                {/* Doctor Fee Payment with 4 Options and Dynamic QR Code */}
                <div className="pt-1">
                  <UnifiedPaymentSelector
                    amount={bookingDoctor.fee}
                    title={`OPD Consultation with ${bookingDoctor.name}`}
                    recipient={`${bookingDoctor.name} (${bookingDoctor.specialization})`}
                    selectedMethod={doctorPaymentMethod}
                    onMethodChange={(m) => setDoctorPaymentMethod(m)}
                    type="doctor"
                    referenceId={`DOC-${bookingDoctor.id}-${Date.now().toString().slice(-4)}`}
                  />
                </div>
              </div>

              {/* Sticky Footer: Total Fee & Action Controls */}
              <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-200 bg-slate-50/95 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Total Payable:</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
                    ₹{bookingDoctor.fee}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">&bull;</span>
                  <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {bookingType === 'video' ? 'Video' : bookingType === 'audio' ? 'Audio' : 'In-Clinic'}
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setBookingDoctor(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-700 hover:via-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95 text-xs disabled:opacity-50"
                  >
                    {isSubmittingBooking
                      ? 'Securing Consultation...'
                      : doctorPaymentMethod === 'cod'
                      ? `Confirm (Pay ₹${bookingDoctor.fee} at Clinic)`
                      : `Authorize & Confirm Slot (₹${bookingDoctor.fee})`}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Doctor Details Profile Modal - Responsive to any screen size */}
      {viewingDoctorDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-3xl max-w-lg sm:max-w-xl w-full shadow-2xl border border-slate-200/90 max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Sticky Header: Doctor identity & Close */}
            <div className="shrink-0 p-4 sm:px-6 sm:py-4 border-b border-slate-200/90 bg-white flex items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={viewingDoctorDetails.avatar}
                    alt={viewingDoctorDetails.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-2xs"
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
                    title="Available for consultation"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {viewingDoctorDetails.name}
                  </h3>
                  <p className="text-xs text-teal-700 font-semibold truncate">
                    {viewingDoctorDetails.specialization}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                    <span>{viewingDoctorDetails.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({viewingDoctorDetails.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingDoctorDetails(null)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body: Doctor credentials, bio, and slots */}
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-5 space-y-4 text-xs overscroll-contain">
              {/* Doctor Credentials & Hospital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90">
                  <span className="text-[11px] text-slate-400 font-medium block">Hospital / Health Center</span>
                  <span className="font-bold text-slate-800 mt-0.5 block truncate">
                    {viewingDoctorDetails.hospital}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90">
                  <span className="text-[11px] text-slate-400 font-medium block">Clinical Experience</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">
                    {viewingDoctorDetails.experienceYears} Years Practicing
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90">
                  <span className="text-[11px] text-slate-400 font-medium block">Education &amp; Credentials</span>
                  <span className="font-bold text-slate-800 mt-0.5 block truncate">
                    {viewingDoctorDetails.education}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90">
                  <span className="text-[11px] text-slate-400 font-medium block">Languages Spoken</span>
                  <span className="font-bold text-slate-800 mt-0.5 block truncate">
                    {viewingDoctorDetails.languages.join(', ')}
                  </span>
                </div>
              </div>

              {/* Professional Biography */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">About Physician</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                  {viewingDoctorDetails.bio}
                </p>
              </div>

              {/* Next Available Slots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Available Consultation Slots</h4>
                  <span className="text-[11px] text-emerald-600 font-semibold">Today &amp; Tomorrow</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {viewingDoctorDetails.availableSlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs font-semibold"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer: Fee & Action */}
            <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-200 bg-slate-50/95 backdrop-blur-xs flex items-center justify-between gap-3 z-10">
              <div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block">Standard Consultation Fee</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">₹{viewingDoctorDetails.fee}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingDoctorDetails(null)}
                  className="px-3.5 sm:px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const doc = viewingDoctorDetails;
                    setViewingDoctorDetails(null);
                    setBookingDoctor(doc);
                    setBookingSlot(doc.availableSlots[0] || '10:00 AM');
                  }}
                  className="px-4 sm:px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer active:scale-95"
                >
                  Book Appointment Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
