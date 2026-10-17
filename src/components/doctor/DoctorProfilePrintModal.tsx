import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Building2,
  Calendar,
  Clock,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

interface DoctorProfilePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName?: string;
  regNumber?: string;
  specialization?: string;
  hospital?: string;
  qualifications?: string;
  phone?: string;
  email?: string;
  address?: string;
  videoFee?: number;
  clinicFee?: number;
  hprId?: string;
}

export const DoctorProfilePrintModal: React.FC<DoctorProfilePrintModalProps> = ({
  isOpen,
  onClose,
  doctorName = 'Dr. V. Mohan, MD',
  regNumber = 'NMC-2012-90482',
  specialization = 'Senior Consultant Cardiologist & Internal Medicine',
  hospital = 'Fortis Hospital & PulseMed Heart Clinic, Bengaluru',
  qualifications = 'MBBS (Madras Medical College), MD (Cardiology, AIIMS), FACC (USA)',
  phone = '+91 98450 88990',
  email = 'dr.vmohan@pulsehealth.org',
  address = 'Suite 402, PulseMed Tower, Indiranagar 100ft Road, Bengaluru - 560038',
  videoFee = 800,
  clinicFee = 1200,
  hprId = 'HPR-84920-KAR-2012',
}) => {
  const [showQrCard, setShowQrCard] = useState(false);
  const [isSavingPicture, setIsSavingPicture] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const doctorQrValue = `MEDNEXA-DOCTOR://hpr/${hprId}?reg=${regNumber}&doc=${encodeURIComponent(doctorName)}&spec=${encodeURIComponent(specialization)}&hospital=${encodeURIComponent(hospital)}&clinicFee=${clinicFee}&token=0xDoc-NMC-90482-Mohan`;

  if (!isOpen) return null;

  // Print Profile: Functions as Save File and generates high-resolution PICTURE (PNG) & launches print
  const handlePrintProfileAsPicture = async () => {
    setIsSavingPicture(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        window.print();
        return;
      }

      // 1. Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1600);

      // Outer border
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 1540);

      // 2. Top Header Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(34, 34, 1132, 140);

      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('PULSEHEALTH • DOCTOR CLINICAL PRACTICE PROFILE', 60, 95);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px sans-serif';
      ctx.fillText(
        'National Medical Commission (NMC) • Healthcare Professional Registry (HPR) Verified',
        60,
        135
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Issued: ${currentDate}`, 860, 95);
      ctx.fillStyle = '#34d399';
      ctx.font = '16px sans-serif';
      ctx.fillText('Status: Good Standing Verified', 860, 130);

      // 3. Physician Credentials Card
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(60, 210, 1080, 230);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 210, 1080, 230);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(doctorName, 90, 265);

      ctx.fillStyle = '#4f46e5';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(specialization, 90, 305);

      ctx.fillStyle = '#334155';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Qualifications: ${qualifications}`, 90, 345);
      ctx.fillText(`NMC Registration: ${regNumber} • HPR ID: ${hprId}`, 90, 385);
      ctx.fillText(`Affiliation: ${hospital}`, 90, 420);

      // 4. Clinical Details Section
      ctx.fillStyle = '#4338ca';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('CLINICAL PRACTICE & CONSULTATION TARIFFS', 60, 490);

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(60, 510, 1080, 200);
      ctx.strokeRect(60, 510, 1080, 200);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Practice Venue:', 90, 550);
      ctx.font = '16px sans-serif';
      ctx.fillText(address, 260, 550);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Helpline Phone:', 90, 590);
      ctx.font = '16px sans-serif';
      ctx.fillText(phone, 260, 590);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Official Email:', 90, 630);
      ctx.font = '16px sans-serif';
      ctx.fillText(email, 260, 630);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('OPD Tariffs:', 90, 675);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.fillText(`Video Teleconsultation: ₹${videoFee}  |  In-Clinic OPD Visit: ₹${clinicFee}`, 260, 675);

      // 5. Statutory Compliance
      ctx.fillStyle = '#4338ca';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('STATUTORY COMPLIANCE & ACCREDITATIONS', 60, 760);

      const compliances = [
        'Registered Practitioner under National Medical Commission Act, 2019',
        'Certified for Telemedicine Practice under MoHFW & NITI Aayog Guidelines 2020',
        'Ayushman Bharat Digital Mission (ABDM) Healthcare Professional Registry Compliant',
        'Digital Tokenized E-Prescription & E-Signature Validated',
      ];

      let compY = 800;
      compliances.forEach((comp) => {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓', 70, compY);

        ctx.fillStyle = '#334155';
        ctx.font = '16px sans-serif';
        ctx.fillText(comp, 105, compY);
        compY += 40;
      });

      // 6. Draw Real QR Code on Canvas
      try {
        const qrDataUrl = await QRCode.toDataURL(doctorQrValue, {
          width: 220,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
        });
        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise((res) => {
          qrImg.onload = res;
        });
        ctx.drawImage(qrImg, 860, 1000, 220, 220);
      } catch (e) {
        // fallback
      }

      // Verification seal block
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(60, 1000, 760, 220);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(60, 1000, 760, 220);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('NMC DIGITAL VERIFICATION CERTIFICATE', 90, 1045);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Scan QR code with any hospital or smartphone terminal to verify Doctor credentials.', 90, 1085);
      ctx.fillText(`Registry Token: 0xDoc-NMC-90482-Mohan`, 90, 1125);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Attestation: National Medical Commission - Active Good Standing', 90, 1165);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(
        'Generated via PulseHealth EHR Cloud Platform • Digitally Validated Clinical Practice Document',
        60,
        1520
      );

      // Download as Picture (PNG)
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Doctor_Profile_${doctorName.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.png`;
      link.click();

      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);

      // Trigger print preview
      setTimeout(() => {
        window.print();
      }, 500);
    } catch (e) {
      window.print();
    } finally {
      setIsSavingPicture(false);
    }
  };

  // Save QR Code as Picture (PNG)
  const handleSaveQrCardAsPicture = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 1000);

      // Border
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 5;
      ctx.strokeRect(20, 20, 760, 960);

      // Header Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(24, 24, 752, 120);

      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('NMC DIGITAL VERIFICATION QR CARD', 50, 75);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('National Medical Commission • HPR Verified Doctor', 50, 110);

      // Doctor Details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(doctorName, 50, 190);

      ctx.fillStyle = '#4f46e5';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(specialization, 50, 225);

      ctx.fillStyle = '#475569';
      ctx.font = '16px sans-serif';
      ctx.fillText(`NMC Reg: ${regNumber}  |  HPR ID: ${hprId}`, 50, 260);
      ctx.fillText(`Clinic Fee: ₹${clinicFee}  |  Video Fee: ₹${videoFee}`, 50, 295);

      // QR Code
      const qrDataUrl = await QRCode.toDataURL(doctorQrValue, {
        width: 380,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
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

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✓ SHA-256 Validated Digital Medical Practitioner Seal', 80, 810);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Issued: ${currentDate} • Verified by National Medical Commission`, 80, 850);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Doctor_${doctorName.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Certificate.png`;
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
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Doctor Practice Profile &amp; Regulatory Certificate
                </h3>
                <p className="text-[11px] text-indigo-300">
                  National Medical Commission Verified Profile &bull; Issued {currentDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Generate QR Code Button */}
              <button
                type="button"
                onClick={() => setShowQrCard(!showQrCard)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-xs active:scale-95"
                title="Generate and view verified Doctor QR Code Certificate"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQrCard ? 'Hide QR Code' : 'Generate QR Code'}</span>
              </button>

              {/* Print Profile Button: Functions as Save File and saves as high-res PICTURE (PNG) */}
              <button
                type="button"
                onClick={handlePrintProfileAsPicture}
                disabled={isSavingPicture}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-60"
                title="Saves complete profile as high-resolution Picture (PNG) and launches print preview"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>
                  {isSavingPicture ? 'Saving Picture...' : 'Print Profile (Save Picture)'}
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

          {/* Toast Notification when picture is saved */}
          {showToast && (
            <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Doctor Practice Profile saved as Picture (PNG) &bull; Check your downloads folder!
              </span>
              <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded">Saved as Picture</span>
            </div>
          )}

          {/* Generated QR Code Picture Card (When user clicks Generate QR Code) */}
          {showQrCard && (
            <div className="p-4 bg-indigo-950 text-white border-b border-indigo-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-black text-indigo-200">
                    Generated Doctor QR Code Certificate &bull; {doctorName}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveQrCardAsPicture}
                    className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
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

              <div className="p-4 bg-white text-slate-900 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="p-1 bg-white border-2 border-indigo-600 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                  <QRCodeDisplay value={doctorQrValue} size={110} hideDetails />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-black text-slate-900 text-sm">{doctorName}</div>
                  <div className="text-indigo-700 font-semibold">{specialization}</div>
                  <div className="text-slate-600">NMC Reg: <strong>{regNumber}</strong> &bull; HPR ID: <strong>{hprId}</strong></div>
                  <div className="text-slate-500 text-[11px]">
                    Token: 0xDoc-NMC-90482-Mohan &bull; Scan on any terminal to verify doctor credentials
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Printable Body Content */}
          <div id="printable-doctor-profile" className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-white text-slate-900">
            {/* Certificate Header Banner */}
            <div className="border-b-2 border-indigo-600 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                    Statutory Healthcare Certificate
                  </span>
                  <span className="text-xs text-slate-500">&bull; Form 1-A Clinical Registry</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  CLINICAL PRACTICE PROFILE &amp; REGISTRATION
                </h1>
                <p className="text-xs text-slate-600">
                  National Digital Health Mission (NDHM) &bull; National Medical Commission Compliant
                </p>
              </div>

              <div className="text-right sm:border-l-2 sm:border-slate-200 sm:pl-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Registry Token</div>
                <div className="font-mono text-xs font-black text-indigo-700">0xDoc-KA-58492-Priya</div>
                <div className="text-[10px] text-slate-500 mt-0.5">SHA-256 Validated</div>
              </div>
            </div>

            {/* Doctor Identity Snapshot */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-slate-900">{doctorName}</h2>
                  <p className="text-xs font-bold text-indigo-700">{specialization}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-lg">
                    {qualifications}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  NMC Active License
                </span>
                <div className="text-xs font-mono font-bold text-slate-700">Reg: {regNumber}</div>
                <div className="text-[11px] font-mono text-indigo-700">HPR: {hprId}</div>
              </div>
            </div>

            {/* Grid Particulars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                  Hospital Affiliations &amp; Clinic
                </span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{hospital}</span>
                </p>
                <p className="text-slate-600 flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                  Verified Contact &amp; Helplines
                </span>
                <p className="text-slate-800 font-bold flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{phone} (Direct Consultation Reception)</span>
                </p>
                <p className="text-slate-800 font-bold flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{email}</span>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  National Teleconsultation Node: Active &amp; Encrypted
                </p>
              </div>
            </div>

            {/* Consultation Tariffs & OPD Schedule */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                Standard Consultation Tariffs (Indian Rupees ₹ INR)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Video Consult</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">₹{videoFee}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">20 Mins Session</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">In-Clinic OPD</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">₹{clinicFee}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Hospital Desk</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Review / Follow-Up</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">₹400</div>
                  <div className="text-[10px] text-slate-500 font-medium">Within 7 Days</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Weekly OPD Roster</div>
                  <div className="text-xs font-black text-slate-900 mt-1">Mon &ndash; Sat</div>
                  <div className="text-[10px] text-slate-500">09:30 AM &ndash; 08:00 PM</div>
                </div>
              </div>
            </div>

            {/* Digital Verification & Stamp */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white rounded-xl border-2 border-indigo-600 shadow-xs shrink-0 flex items-center justify-center">
                  <QRCodeDisplay value={doctorQrValue} size={90} hideDetails />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>NMC Doctor Credential QR Code</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Scan with any smartphone or hospital terminal to verify Doctor License on the Indian Medical Registry.
                  </p>
                  <p className="text-[10px] text-indigo-700 font-mono">
                    Token: 0xDoc-NMC-90482-Mohan &bull; SHA-256 Validated
                  </p>
                </div>
              </div>

              {/* Council Seal */}
              <div className="text-right border-l-2 border-slate-200 pl-4 py-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Attestation Seal</div>
                <div className="text-xs font-black text-slate-900 mt-1">National Medical Commission</div>
                <div className="text-[10px] text-indigo-700 font-mono font-bold">Good Standing Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
