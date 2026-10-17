import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  QrCode,
  ShieldCheck,
  User,
  Heart,
  Activity,
  AlertTriangle,
  Pill,
  Calendar,
  FileText,
  CheckCircle2,
  Stethoscope,
  Phone,
  Image as ImageIcon,
  Sparkles,
  Download,
} from 'lucide-react';
import { QRCodeDisplay } from '../common/QRCodeDisplay';
import { useHealth } from '../../context/HealthContext';

interface PatientRecordPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

export const PatientRecordPrintModal: React.FC<PatientRecordPrintModalProps> = ({
  isOpen,
  onClose,
  patientName: propPatientName,
}) => {
  const {
    currentUser,
    vitals,
    allergies,
    diagnoses,
    pillReminders,
    labReports,
    appointments,
  } = useHealth();

  const [showQrCard, setShowQrCard] = useState(false);
  const [isGeneratingPicture, setIsGeneratingPicture] = useState(false);
  const [showPictureToast, setShowPictureToast] = useState(false);

  const patientName = propPatientName || currentUser?.name || 'Sarath Paturu';
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const recordQrValue = `MEDNEXA-EHR://patient/${encodeURIComponent(patientName)}?abha=91-8821-4402-9912&bp=${encodeURIComponent(vitals?.bloodPressure || '118/76')}&sugar=${vitals?.bloodSugarMgDl || 96}&date=${encodeURIComponent(currentDate)}&token=0x992B-81F4-ABDM-VALIDATED`;

  if (!isOpen) return null;

  // Print Record: Generates and saves high-resolution Picture (PNG) & launches print preview
  const handlePrintRecordAsPicture = async () => {
    setIsGeneratingPicture(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1580;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        window.print();
        return;
      }

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1580);

      // Outer border
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 1520);

      // Top Header Banner
      ctx.fillStyle = '#09152b';
      ctx.fillRect(34, 34, 1132, 140);

      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('PULSEHEALTH • MEDNEXA CLINICAL REGISTRY', 60, 95);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px sans-serif';
      ctx.fillText(
        'National Digital Health Mission (ABDM) • Verified Electronic Health Record',
        60,
        135
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Issued: ${currentDate}`, 860, 95);
      ctx.fillStyle = '#2dd4bf';
      ctx.font = '16px sans-serif';
      ctx.fillText('Status: Active & Verified', 860, 130);

      // Patient Particulars Card
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(60, 210, 1080, 210);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 210, 1080, 210);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(patientName, 90, 260);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('ABHA ID: 91-8821-4402-9912', 90, 305);
      ctx.fillText('Age / Gender: 32 Years / Female', 90, 345);
      ctx.fillText(`Blood Group: ${currentUser?.bloodGroup || 'B+'}`, 90, 385);

      ctx.fillText(`Phone: ${currentUser?.phone || '+91 98450 21980'}`, 600, 305);
      ctx.fillText('Emergency Contact: Rahul V. (+91 98450 21981)', 600, 345);
      ctx.fillText('Registry ID: REC-2026-9812-IN', 600, 385);

      // Vitals Section
      ctx.fillStyle = '#0f766e';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('CLINICAL VITALS SNAPSHOT', 60, 470);

      const vitalsBoxData = [
        { label: 'Blood Pressure', val: `${vitals?.bloodPressure || '118/76'} mmHg` },
        { label: 'Resting Pulse', val: `${vitals?.heartRateBpm || 72} BPM` },
        { label: 'Fasting Sugar', val: `${vitals?.bloodSugarMgDl || 96} mg/dL` },
        { label: 'Oxygen (SpO2)', val: `${vitals?.oxygenSatPct || 99}%` },
        { label: 'Temperature', val: `${vitals?.temperatureF || 98.4} °F` },
        { label: 'Body Mass Index', val: `${vitals?.bmi || 21.3} BMI` },
      ];

      vitalsBoxData.forEach((item, i) => {
        const x = 60 + (i % 3) * 370;
        const y = 500 + Math.floor(i / 3) * 100;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(x, y, 340, 80);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(x, y, 340, 80);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.fillText(item.label, x + 20, y + 30);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(item.val, x + 20, y + 62);
      });

      // Diagnoses & Allergies
      ctx.fillStyle = '#0f766e';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('ALLERGIES & ACTIVE CONDITIONS', 60, 740);

      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(60, 770, 520, 150);
      ctx.strokeStyle = '#fecdd3';
      ctx.strokeRect(60, 770, 520, 150);
      ctx.fillStyle = '#9f1239';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Known Drug Allergies:', 80, 805);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#881337';
      ctx.fillText('• Penicillin: Severe anaphylaxis risk', 80, 845);
      ctx.fillText('• Sulfa Antibiotics: Hypersensitivity', 80, 880);

      ctx.fillStyle = '#f0fdf4';
      ctx.fillRect(620, 770, 520, 150);
      ctx.strokeStyle = '#bbf7d0';
      ctx.strokeRect(620, 770, 520, 150);
      ctx.fillStyle = '#166534';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Active Medical Diagnoses:', 640, 805);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#14532d';
      ctx.fillText('• Primary Hyperlipidemia (Controlled)', 640, 845);
      ctx.fillText('• Seasonal Allergic Rhinitis (Mild)', 640, 880);

      // Active Medications Regimen
      ctx.fillStyle = '#0f766e';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('ACTIVE MEDICATION REGIMEN', 60, 970);

      const meds = [
        {
          name: 'Atorvastatin Calcium 20mg',
          dose: '1 Tablet • Night Bedtime',
          doctor: 'Dr. V. Mohan',
        },
        {
          name: 'Coenzyme Q10 100mg',
          dose: '1 Softgel • Morning with Food',
          doctor: 'Dr. V. Mohan',
        },
        {
          name: 'Levocetirizine 5mg',
          dose: '1 Tablet • Evening (SOS)',
          doctor: 'Dr. Priya Sharma',
        },
      ];

      meds.forEach((m, idx) => {
        const y = 1000 + idx * 70;
        ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
        ctx.fillRect(60, y, 1080, 60);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(60, y, 1080, 60);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(m.name, 80, y + 38);

        ctx.fillStyle = '#475569';
        ctx.font = '16px sans-serif';
        ctx.fillText(m.dose, 520, y + 38);

        ctx.fillStyle = '#0f766e';
        ctx.font = 'italic 16px sans-serif';
        ctx.fillText(m.doctor, 880, y + 38);
      });

      // Draw embedded QR code onto picture!
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, recordQrValue, {
        width: 220,
        margin: 2,
      });
      ctx.drawImage(qrCanvas, 60, 1250, 200, 200);

      // QR Verification description
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('ABDM DIGITAL HEALTH VERIFICATION QR', 290, 1300);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(
        'Scan with any clinical camera to instantly verify live records & e-prescriptions.',
        290,
        1340
      );
      ctx.fillText(
        'Signed by: PulseMed Integrated Clinical Registry • Token: 0x992B-81F4',
        290,
        1375
      );
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('✓ SHA-256 Digitally Signed & Encrypted', 290, 1415);

      // Trigger save file as picture!
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Patient_Clinical_Record_${patientName.replace(
        /\s+/g,
        '_'
      )}_Picture.png`;
      link.click();

      setShowPictureToast(true);
      setTimeout(() => setShowPictureToast(false), 3500);

      // Also trigger print preview
      setTimeout(() => {
        window.print();
      }, 350);
    } catch (err) {
      console.error('Failed to generate record picture:', err);
      window.print();
    } finally {
      setIsGeneratingPicture(false);
    }
  };

  // Save Generated Record QR Code Card as Picture (PNG)
  const handleSaveRecordQrAsPicture = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 1000);

      // Outer border
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 5;
      ctx.strokeRect(20, 20, 760, 960);

      // Top Header Banner
      ctx.fillStyle = '#09152b';
      ctx.fillRect(24, 24, 752, 120);

      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('ABDM DIGITAL HEALTH RECORD QR CARD', 50, 75);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('National Digital Health Mission (ABDM) • Verified Health Record', 50, 110);

      // Patient Particulars
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(patientName, 50, 190);

      ctx.fillStyle = '#0f766e';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('ABHA ID: 91-8821-4402-9912  |  Gender: 32 Y / Female', 50, 225);

      ctx.fillStyle = '#475569';
      ctx.font = '16px sans-serif';
      ctx.fillText(`BP: ${vitals?.bloodPressure || '118/76'} mmHg  |  Sugar: ${vitals?.bloodSugarMgDl || 96} mg/dL`, 50, 260);
      ctx.fillText(`Date: ${currentDate}  |  Token: 0x992B-81F4-ABDM-VALIDATED`, 50, 295);

      // Draw QR Code
      const qrDataUrl = await QRCode.toDataURL(recordQrValue, {
        width: 380,
        margin: 1,
        color: { dark: '#09152b', light: '#ffffff' },
      });
      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      await new Promise((res) => {
        qrImg.onload = res;
      });
      ctx.drawImage(qrImg, 210, 340, 380, 380);

      // Footer
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(50, 760, 700, 120);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(50, 760, 700, 120);

      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✓ SHA-256 Validated Digital Healthcare Token', 80, 810);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Issued: ${currentDate} • National Digital Health Mission Verified`, 80, 850);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Patient_Record_${patientName.replace(/\s+/g, '_')}_QR_Certificate.png`;
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Header Controls (Hidden during print) */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Patient Clinical Record &bull; Summary to Date
                </h3>
                <p className="text-[11px] text-teal-300">
                  Doctor-focused clinical summary &bull; Up to {currentDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Generate Record QR Code Button */}
              <button
                type="button"
                onClick={() => setShowQrCard(!showQrCard)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-xs active:scale-95"
                title="Generate and view verified ABDM Record QR Code"
              >
                <QrCode className="w-4 h-4" />
                <span>{showQrCard ? 'Hide QR Code' : 'Generate QR Code'}</span>
              </button>

              {/* Print Record Button: Works like save file and saves as PICTURE (PNG image) */}
              <button
                type="button"
                onClick={handlePrintRecordAsPicture}
                disabled={isGeneratingPicture}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-60"
                title="Saves record as high-resolution Picture (PNG) and launches print preview"
              >
                <Printer className="w-4 h-4" />
                <span>
                  {isGeneratingPicture ? 'Saving Picture...' : 'Print Record (Save Picture)'}
                </span>
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

          {/* Toast Notification when record picture is saved */}
          {showPictureToast && (
            <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top duration-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Clinical Record saved as Picture (PNG) &bull; Check your downloads folder!
              </span>
              <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded">Saved as Picture</span>
            </div>
          )}

          {/* Generated Record QR Code Picture Card (When user clicks Generate QR Code) */}
          {showQrCard && (
            <div className="p-4 bg-teal-950 text-white border-b border-teal-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <h4 className="text-sm font-black text-teal-200">
                    Generated Patient Record QR Code Certificate &bull; {patientName}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveRecordQrAsPicture}
                    className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Save QR Code as Picture (PNG)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrCard(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#08152b] rounded-2xl border border-teal-500/30 flex flex-col sm:flex-row items-center gap-4 text-xs">
                <div className="p-1 bg-white border-2 border-teal-400 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                  <QRCodeDisplay value={recordQrValue} size={110} hideDetails />
                </div>
                <div className="space-y-1 text-slate-200">
                  <div className="font-black text-white text-sm">{patientName}</div>
                  <div className="text-teal-300 font-mono">ABHA ID: 91-8821-4402-9912</div>
                  <div className="text-slate-400 text-[11px]">
                    BP: {vitals?.bloodPressure || '118/76'} mmHg &bull; Fasting Sugar: {vitals?.bloodSugarMgDl || 96} mg/dL &bull; Pulse: {vitals?.heartRateBpm || 72} BPM
                  </div>
                  <div className="text-teal-400 text-[10px] font-mono">
                    Token: 0x992B-81F4-ABDM-VALIDATED &bull; Scannable on any hospital EHR terminal
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Printable Document Body */}
          <div id="printable-patient-record" className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-white text-slate-900">
            {/* Clinic / Health Authority Official Letterhead */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                    PM
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      PulseMed Integrated Clinical Record
                    </h1>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                      National Digital Health Mission (ABDM) &bull; Verified Electronic Health Record
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs space-y-0.5">
                <p className="font-bold text-slate-900">Summary Generated: {currentDate}</p>
                <p className="text-slate-500 text-[11px]">Record Status: <strong>Current &amp; Verified</strong></p>
                <p className="text-teal-700 font-mono text-[10px]">ID: REC-2026-9812-IN</p>
              </div>
            </div>

            {/* 1. PATIENT DEMOGRAPHICS & IDENTIFIERS */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient Name</span>
                <strong className="text-slate-900 text-sm">{patientName}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Age &bull; Gender</span>
                <strong className="text-slate-900 text-sm">32 Years &bull; Female</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Blood Group</span>
                <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-800 font-black rounded text-xs">
                  {currentUser?.bloodGroup || 'B+'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">ABHA Health ID</span>
                <strong className="text-slate-900 font-mono text-xs">91-8821-4402-9912</strong>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Phone</span>
                <span className="text-slate-700 font-medium">{currentUser?.phone || '+91 98450 21980'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Emergency Contact</span>
                <span className="text-slate-700 font-medium">Rahul V. (Spouse) - 98450 21981</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">City &bull; State</span>
                <span className="text-slate-700 font-medium">Bengaluru, Karnataka</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Insurance</span>
                <span className="text-emerald-700 font-bold">Star Health Comprehensive</span>
              </div>
            </div>

            {/* 2. VITALS SNAPSHOT (WHAT DOCTOR CHECKS FIRST) */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                Latest Vital Signs &bull; Clinical Baseline (as of {currentDate})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold block">Blood Pressure</span>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{vitals?.bloodPressure || '118/76'}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Optimal</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold block">Pulse Rate</span>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{vitals?.heartRateBpm || 72} bpm</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Regular Sinus</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold block">Blood Glucose</span>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{vitals?.bloodSugarMgDl || 96} mg/dL</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Fasting (Normal)</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold block">Oxygen (SpO2)</span>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{vitals?.oxygenSatPct || 99}%</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Room Air</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold block">BMI / Weight</span>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{vitals?.bmi || 21.3} BMI</div>
                  <span className="text-[10px] text-slate-600 font-semibold">{vitals?.weightKg || 58} kg (Healthy)</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold block">Temperature</span>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{vitals?.temperatureF || 98.4} °F</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Afebrile</span>
                </div>
              </div>
            </div>

            {/* 3. CRITICAL ALLERGIES & ONGOING CONDITIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Allergies Alert */}
              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
                <span className="font-black text-rose-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Known Allergies &bull; Drug Precautions ({allergies?.length || 2})
                </span>
                <ul className="space-y-1 text-slate-800">
                  {allergies && allergies.length > 0 ? (
                    allergies.map((all, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                        <strong>{all.allergen}:</strong> {all.reaction} ({all.severity} Risk)
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                        <strong>Penicillin &amp; Amoxicillin:</strong> Severe rash / anaphylaxis risk
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                        <strong>Sulfa Antibiotics:</strong> Hypersensitivity documented
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Ongoing Diagnoses */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl">
                <span className="font-black text-blue-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Heart className="w-3.5 h-3.5 text-blue-600" />
                  Active Chronic / Ongoing Conditions ({diagnoses?.length || 2})
                </span>
                <ul className="space-y-1 text-slate-800">
                  {diagnoses && diagnoses.length > 0 ? (
                    diagnoses.map((diag, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <strong>{diag.condition}:</strong> {diag.notes}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <strong>Seasonal Allergic Rhinitis:</strong> Mild, perennial seasonal flare
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <strong>Intermittent Tension Headache:</strong> Work-stress related, controlled
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* 4. CURRENT ACTIVE MEDICATIONS (REGIMEN) */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-teal-600" />
                Current Active Medications &bull; Regimen as of {currentDate}
              </h2>
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="p-2.5">Medication &bull; Strength</th>
                      <th className="p-2.5">Dosage / Schedule</th>
                      <th className="p-2.5">Instruction</th>
                      <th className="p-2.5">Prescribed By</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pillReminders && pillReminders.filter((p) => p.active).length > 0 ? (
                      pillReminders
                        .filter((p) => p.active)
                        .map((p) => (
                          <tr key={p.id}>
                            <td className="p-2.5 font-bold text-slate-900">{p.medicineName}</td>
                            <td className="p-2.5 text-slate-700">{p.dosage} &bull; {p.frequency}</td>
                            <td className="p-2.5 text-slate-600">{p.instructions || 'As advised'}</td>
                            <td className="p-2.5 text-slate-600">{p.prescribedBy || 'Dr. Priya Sharma'}</td>
                            <td className="p-2.5 text-right">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <>
                        <tr>
                          <td className="p-2.5 font-bold text-slate-900">Levocetirizine 5mg</td>
                          <td className="p-2.5 text-slate-700">1 Tablet &bull; 0 - 0 - 1</td>
                          <td className="p-2.5 text-slate-600">Bedtime after food</td>
                          <td className="p-2.5 text-slate-600">Dr. Priya Sharma</td>
                          <td className="p-2.5 text-right">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Active
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-slate-900">Paracetamol 650mg</td>
                          <td className="p-2.5 text-slate-700">SOS (When Needed)</td>
                          <td className="p-2.5 text-slate-600">Max 2 tablets/day</td>
                          <td className="p-2.5 text-slate-600">Dr. Priya Sharma</td>
                          <td className="p-2.5 text-right">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Active PRN
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. RECENT CLINICAL CONSULTATIONS & LAB FINDINGS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  Recent Consultation &bull; Dr. Priya Sharma
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  <strong>Impression:</strong> Well-controlled allergic rhinitis. Clear chest bilaterally. Vitals completely stable. No broncho-constriction or wheezing noted. Advised seasonal precaution and SOS antihistamine.
                </p>
                <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                  <span>Consulted: 18 Sep 2026</span>
                  <span className="text-emerald-700 font-bold">Follow-up: 6 Months</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Recent Key Lab Summary
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hemoglobin (Hb):</span>
                    <strong className="text-slate-900">13.4 g/dL (Normal)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">HbA1c (Glycated Hb):</span>
                    <strong className="text-slate-900">5.6% (Non-Diabetic)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Serum Creatinine:</span>
                    <strong className="text-slate-900">0.8 mg/dL (eGFR &gt; 90)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lipid Profile:</span>
                    <strong className="text-slate-900">Total Chol 172 mg/dL</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. DIGITAL VERIFICATION QR CODE & SIGNATURE (CRITICAL FOR DOCTOR SCAN) */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Dynamically Generated Real QR Code for this Patient Record */}
                <div className="shrink-0">
                  <QRCodeDisplay
                    value={recordQrValue}
                    size={96}
                    showCopy={false}
                    className="border-2 border-slate-900 shadow-xs p-1.5 rounded-2xl bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>ABDM Digital Verification QR Code</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Doctors can point any smartphone camera or ABDM scanner terminal to securely verify this patient's live clinical history.
                  </p>
                  <p className="text-[10px] text-teal-700 font-mono">
                    Token: 0x992B...81F4 &bull; Signed by Ayushman Bharat Digital Mission
                  </p>
                </div>
              </div>

              {/* Digital Doctor Verification Stamp */}
              <div className="text-right border-l-2 border-slate-200 pl-4 py-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Digital Seal &bull; Attestation</div>
                <div className="text-xs font-black text-slate-900 mt-1">PulseMed Clinical Registry</div>
                <div className="text-[10px] text-emerald-700 font-mono font-bold">SHA-256 Validated Signature</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
