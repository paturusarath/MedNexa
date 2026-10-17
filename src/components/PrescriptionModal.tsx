import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Calendar,
  User,
  Stethoscope,
  Building2,
  FileCheck2,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react';
import { Prescription } from '../types';
import { useHealth } from '../context/HealthContext';

interface PrescriptionModalProps {
  prescription: Prescription | null;
  onClose: () => void;
  onNavigateToShopping?: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  prescription,
  onClose,
  onNavigateToShopping,
}) => {
  const { addPrescriptionToCart } = useHealth();
  const [shopSuccess, setShopSuccess] = useState(false);

  if (!prescription) return null;

  const handleShopFromPrescription = () => {
    addPrescriptionToCart(prescription);
    setShopSuccess(true);
    setTimeout(() => {
      if (onNavigateToShopping) {
        onNavigateToShopping();
      }
    }, 450);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
============================================================
PULSEHEALTH DIGITAL CLINICAL HEALTH NETWORK
OFFICIAL ELECTRONIC PRESCRIPTION (e-Rx)
============================================================
Prescription ID: ${prescription.id}
Date Issued: ${prescription.date}
Clinic: ${prescription.clinicName}

PRESCRIBING PHYSICIAN:
${prescription.doctorName} ${prescription.doctorDesignation ? `(${prescription.doctorDesignation})` : ''}
Specialty: ${prescription.doctorSpecialization}
License: ${prescription.doctorLicense}

PATIENT INFORMATION:
Name: ${prescription.patientSalutation ? `${prescription.patientSalutation} ` : ''}${prescription.patientName}
${prescription.guardianName ? `Caregiver / Guardian: ${prescription.guardianName}\n` : ''}Age/Gender: ${prescription.patientAge} Years / ${prescription.patientGender}

DIAGNOSIS:
${prescription.diagnosis}

MEDICATIONS PRESCRIBED:
${prescription.medicines
  .map(
    (m, i) =>
      `${i + 1}. ${m.name} - Dosage: ${m.dosage}\n   Frequency: ${m.frequency} | Duration: ${m.duration}\n   Instructions: ${m.instructions}`
  )
  .join('\n\n')}

DIETARY & CLINICAL ADVICE:
${prescription.dietaryAdvice}

Follow-up Date: ${prescription.followUpDate}

CRYPTOGRAPHIC VALIDATION:
${prescription.digitalSignature}
Verification Hash: ${prescription.qrCodeHash}
============================================================
    `;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prescription_${prescription.patientName.replace(/\s+/g, '_')}_${prescription.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-3xl max-h-[94vh] sm:max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800"
          id="printable-prescription"
        >
          {/* Action Header - Sticky */}
          <div className="shrink-0 flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-50 border-b border-slate-200 print:hidden gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Digital e-Rx
              </span>
              <span className="text-xs text-slate-500 font-mono">#{prescription.id}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                type="button"
                id="rx-modal-shop-btn"
                onClick={handleShopFromPrescription}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm cursor-pointer"
                title="Shop prescribed medicines online into cart"
              >
                {shopSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Shop from e-Rx</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition shadow-xs cursor-pointer"
                title="Print Prescription"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition shadow-xs cursor-pointer"
                title="Download e-Rx Document"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Clinical Document Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 overscroll-contain">
            {/* Clinic & Physician Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-teal-600 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    +
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      MedNexa Telemedicine
                    </h2>
                    <p className="text-xs font-medium text-teal-700 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {prescription.clinicName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs space-y-0.5 text-slate-600">
                <p className="font-bold text-sm text-slate-900 flex items-center sm:justify-end gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  {prescription.doctorName}
                </p>
                {prescription.doctorDesignation && (
                  <p className="text-[11px] text-slate-500 font-medium">{prescription.doctorDesignation}</p>
                )}
                <p className="text-teal-700 font-medium">{prescription.doctorSpecialization}</p>
                <p>Medical Reg: {prescription.doctorLicense}</p>
                <p className="flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3 h-3" />
                  Prescribed: {prescription.date}
                </p>
              </div>
            </div>

            {/* Patient Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-xs">
              <div>
                <span className="block text-slate-500 font-medium text-[11px]">Patient Name</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {prescription.patientSalutation ? `${prescription.patientSalutation} ` : ''}
                  {prescription.patientName}
                </span>
                {prescription.guardianName && (
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Guardian: <strong>{prescription.guardianName}</strong>
                  </span>
                )}
              </div>
              <div>
                <span className="block text-slate-500 font-medium text-[11px]">Age / Gender</span>
                <span className="font-semibold text-slate-800">
                  {prescription.patientAge} Yrs / {prescription.patientGender}
                </span>
              </div>
              <div>
                <span className="block text-slate-500 font-medium text-[11px]">Clinical Diagnosis</span>
                <span className="font-semibold text-teal-900">{prescription.diagnosis}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-medium text-[11px]">Next Follow-up</span>
                <span className="font-semibold text-slate-800">{prescription.followUpDate}</span>
              </div>
            </div>

            {/* Rx Medical Icon & Table */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-serif font-black text-teal-700 italic">℞</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Prescribed Pharmacotherapy
                </span>
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Medicine & Strength</th>
                      <th className="py-2.5 px-3">Dosage</th>
                      <th className="py-2.5 px-3">Frequency</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Clinical Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescription.medicines.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{med.name}</td>
                        <td className="py-3 px-3 font-medium text-slate-700">{med.dosage}</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                            {med.frequency}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{med.duration}</td>
                        <td className="py-3 px-3 text-slate-600 text-[11px] leading-relaxed">
                          {med.instructions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instant Shop from Prescription Action Banner */}
              <div className="p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:hidden">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-teal-700" />
                    Instant Pharmacy Dispensing &amp; Delivery
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Order these {prescription.medicines.length} doctor-prescribed medications online with ₹ INR pricing, home delivery, and verified e-Rx attachment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleShopFromPrescription}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl transition shadow-xs shrink-0 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{shopSuccess ? 'Items Added! Redirecting...' : 'Shop All Prescribed Medicines'}</span>
                </button>
              </div>
            </div>

            {/* Dietary & Lifestyle Instructions */}
            {prescription.dietaryAdvice && (
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-700" />
                  Dietary & Lifestyle Advice
                </h4>
                <p className="text-amber-800 leading-relaxed">{prescription.dietaryAdvice}</p>
              </div>
            )}

            {/* Footer with Digital Signature & QR Verification */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                {/* Visual QR Verification Box */}
                <div className="w-16 h-16 bg-slate-900 text-white rounded-lg p-1.5 flex flex-col items-center justify-center font-mono text-[9px] shadow-sm">
                  <div className="grid grid-cols-3 gap-0.5 w-full h-full p-0.5 bg-white text-slate-900 rounded">
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-slate-400">VERIFICATION HASH</p>
                  <p className="font-mono font-bold text-slate-800 text-xs">{prescription.qrCodeHash}</p>
                  <p className="text-[11px] text-slate-500">Scan at MedNexa Pharmacy for dispensing</p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="font-serif italic text-teal-800 text-base font-bold underline decoration-teal-300">
                  {prescription.doctorName}
                </div>
                <p className="text-[10px] text-slate-500 max-w-xs">{prescription.digitalSignature}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};
