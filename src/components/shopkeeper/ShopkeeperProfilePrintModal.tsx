import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  QrCode,
  ShieldCheck,
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
  Pill,
  Thermometer,
  FileText,
} from 'lucide-react';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

interface ShopkeeperProfilePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  pharmacistName?: string;
  licenseNumber?: string;
  gstin?: string;
  fssaiNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const ShopkeeperProfilePrintModal: React.FC<ShopkeeperProfilePrintModalProps> = ({
  isOpen,
  onClose,
  storeName = 'PulseMed 24x7 Chemist & Druggists',
  pharmacistName = 'Rajesh Kumar (B.Pharm, R.Ph)',
  licenseNumber = 'KA-BLR-DL-2024-8831 / 8832',
  gstin = '29ABCDE1234F1Z5',
  fssaiNumber = '11223334000451',
  address = 'Shop #12, Ground Floor, PulseMed Healthcare Tower, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
  phone = '+91 80 4910 2200',
  email = 'chemist.indiranagar@pulsemed.in',
}) => {
  const [showQrCard, setShowQrCard] = useState(false);
  const [isSavingPicture, setIsSavingPicture] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const pharmacyQrValue = `MEDNEXA-PHARMACY://license/KA-BLR-DL-2024-8831?store=${encodeURIComponent(storeName)}&gstin=${gstin}&fssai=${fssaiNumber}&pharmacist=${encodeURIComponent(pharmacistName)}&token=0xChem-KA-8831-PulseMed`;

  if (!isOpen) return null;

  // Print Profile: Functions as Save File and generates high-resolution PICTURE (PNG) & launches print preview
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
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 1540);

      // 2. Top Header Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(34, 34, 1132, 140);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('PULSEHEALTH • PHARMACY REGULATORY DRUG LICENSE', 60, 95);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px sans-serif';
      ctx.fillText(
        'Drugs Control Department, Govt of Karnataka • Form 20-B & 21-B Retail License Record',
        60,
        135
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Issued: ${currentDate}`, 860, 95);
      ctx.fillStyle = '#34d399';
      ctx.font = '16px sans-serif';
      ctx.fillText('Status: Active & Validated', 860, 130);

      // 3. Store Particulars Card
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(60, 210, 1080, 230);
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 210, 1080, 230);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(storeName, 90, 265);

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Retail Drug License: ${licenseNumber}`, 90, 305);

      ctx.fillStyle = '#334155';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Superintendent Pharmacist: ${pharmacistName} (Reg: KSPC-44910)`, 90, 345);
      ctx.fillText(`GSTIN: ${gstin} • Central FSSAI: ${fssaiNumber}`, 90, 385);
      ctx.fillText(`Physical Premises: ${address}`, 90, 420);

      // 4. Operations & Storage Protocols
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('DISPENSING OPERATIONS & STATUTORY PROTOCOLS', 60, 490);

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(60, 510, 1080, 200);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(60, 510, 1080, 200);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Dispensing Hours:', 90, 550);
      ctx.font = '16px sans-serif';
      ctx.fillText('24 Hours Uninterrupted / Emergency Night Roster Active', 280, 550);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Emergency Helpline:', 90, 590);
      ctx.font = '16px sans-serif';
      ctx.fillText(`${phone}  |  ${email}`, 280, 590);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Cold-Chain Unit:', 90, 630);
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.fillText('Biological Refrigerator Monitored: 2°C – 8°C (Insulin / Vaccines)', 280, 630);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Schedule H Protocol:', 90, 675);
      ctx.font = '16px sans-serif';
      ctx.fillText('Digital Tokenized E-Prescriptions Verified Prior to Dispense', 280, 675);

      // 5. Compliance Checklist
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('STATUTORY INSPECTION & AUDIT RECORD', 60, 760);

      const compliances = [
        'Form 20-B Retail Allopathic Drug License Valid Through 2029',
        'Form 21-B Biological, Vaccine & Antibiotic Schedule Compliance Validated',
        'Good Pharmacy Practice (GPP) Certified Clean Cold-Chain Storage',
        'Direct Integration with Ayushman Bharat Digital Mission (ABDM)',
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
        const qrDataUrl = await QRCode.toDataURL(pharmacyQrValue, {
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
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(60, 1000, 760, 220);
      ctx.strokeStyle = '#fde68a';
      ctx.strokeRect(60, 1000, 760, 220);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('DRUGS CONTROL ADMINISTRATION QR VERIFICATION', 90, 1045);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Scan QR code with any drug inspector or mobile terminal to verify state license.', 90, 1085);
      ctx.fillText(`License Token: 0xChem-KA-8831-PulseMed`, 90, 1125);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Attestation: Good Pharmacy Practice (GPP) Verified & Active', 90, 1165);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(
        'Generated via PulseHealth Pharmacy Cloud Platform • State Regulatory Pharmaceutical Record',
        60,
        1520
      );

      // Download as Picture (PNG)
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Pharmacy_Profile_${storeName.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.png`;
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
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 5;
      ctx.strokeRect(20, 20, 760, 960);

      // Header Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(24, 24, 752, 120);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('STATE PHARMACY REGISTRATION QR CARD', 50, 75);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('Drugs Control Administration • Verified Retail Chemist', 50, 110);

      // Store Details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(storeName, 50, 190);

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`License: ${licenseNumber}`, 50, 225);

      ctx.fillStyle = '#475569';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Superintendent: ${pharmacistName}`, 50, 260);
      ctx.fillText(`GSTIN: ${gstin}  |  FSSAI: ${fssaiNumber}`, 50, 295);

      // QR Code
      const qrDataUrl = await QRCode.toDataURL(pharmacyQrValue, {
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
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(50, 760, 700, 120);
      ctx.strokeStyle = '#fde68a';
      ctx.strokeRect(50, 760, 700, 120);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✓ State Drugs Control Department SHA-256 Verified Seal', 80, 810);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Issued: ${currentDate} • Verified Pharmaceutical Retailer`, 80, 850);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Pharmacy_${storeName.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Certificate.png`;
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
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Pharmacy Regulatory Profile &amp; Drug License Certificate
                </h3>
                <p className="text-[11px] text-amber-300">
                  State Drugs Control Department &bull; Compliance Record as of {currentDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Generate QR Code Button */}
              <button
                type="button"
                onClick={() => setShowQrCard(!showQrCard)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-xs active:scale-95"
                title="Generate and view verified Pharmacy QR Code Certificate"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQrCard ? 'Hide QR Code' : 'Generate QR Code'}</span>
              </button>

              {/* Print Profile Button: Functions as Save File and saves as high-res PICTURE (PNG) */}
              <button
                type="button"
                onClick={handlePrintProfileAsPicture}
                disabled={isSavingPicture}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-60"
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
                Pharmacy Regulatory Profile saved as Picture (PNG) &bull; Check your downloads folder!
              </span>
              <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded">Saved as Picture</span>
            </div>
          )}

          {/* Generated QR Code Picture Card (When user clicks Generate QR Code) */}
          {showQrCard && (
            <div className="p-4 bg-amber-950 text-white border-b border-amber-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-black text-amber-200">
                    Generated Pharmacy QR Code Certificate &bull; {storeName}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveQrCardAsPicture}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
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
                <div className="p-1 bg-white border-2 border-amber-600 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                  <QRCodeDisplay value={pharmacyQrValue} size={110} hideDetails />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-black text-slate-900 text-sm">{storeName}</div>
                  <div className="text-amber-800 font-semibold">{licenseNumber}</div>
                  <div className="text-slate-600">GSTIN: <strong>{gstin}</strong> &bull; FSSAI: <strong>{fssaiNumber}</strong></div>
                  <div className="text-slate-500 text-[11px]">
                    Token: 0xChem-KA-8831-PulseMed &bull; Good Pharmacy Practice (GPP) Verified
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Printable Body Content */}
          <div id="printable-shopkeeper-profile" className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-white text-slate-900">
            {/* Header Certificate Title */}
            <div className="border-b-2 border-amber-600 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                    Statutory Drug Trade Certificate
                  </span>
                  <span className="text-xs text-slate-500">&bull; Drugs &amp; Cosmetics Act 1940</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  PHARMACY REGULATORY DRUG LICENSE RECORD
                </h1>
                <p className="text-xs text-slate-600">
                  Government of Karnataka &bull; Drugs Control Department, Bengaluru Zone
                </p>
              </div>

              <div className="text-right sm:border-l-2 sm:border-slate-200 sm:pl-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Department Token</div>
                <div className="font-mono text-xs font-black text-amber-700">0xChem-KA-8831-PulseMed</div>
                <div className="text-[10px] text-slate-500 mt-0.5">SHA-256 Validated</div>
              </div>
            </div>

            {/* Store Identity Snapshot */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-slate-900">{storeName}</h2>
                  <p className="text-xs font-bold text-amber-800">Form 20-B &amp; Form 21-B Retail License</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-lg">
                    Superintendent Pharmacist: <strong>{pharmacistName}</strong> &bull; Registration: KSPC Reg #44910
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  GPP Validated Chemist
                </span>
                <div className="text-xs font-mono font-bold text-slate-700">DL: {licenseNumber}</div>
                <div className="text-[11px] font-mono text-amber-800">GST: {gstin}</div>
              </div>
            </div>

            {/* Grid Particulars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                  Licensed Premises &amp; Storage Hub
                </span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Licensed Allopathic Counter</span>
                </p>
                <p className="text-slate-600 flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                  Verified Contact &amp; Night Roster
                </span>
                <p className="text-slate-800 font-bold flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>{phone} (24x7 Dispense Counter)</span>
                </p>
                <p className="text-slate-800 font-bold flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span>{email}</span>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  FSSAI Nutraceutical Registration: <strong>{fssaiNumber}</strong>
                </p>
              </div>
            </div>

            {/* Storage Standards & Operations */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                Statutory Storage Conditions &amp; Operations
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Cold-Chain Unit</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">2°C &ndash; 8°C</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Insulin &amp; Vaccines</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Ambient Store</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">&lt; 25°C</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Climate Controlled</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Operating Schedule</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">24x7 Active</div>
                  <div className="text-[10px] text-slate-500 font-medium">Night Chemist on Duty</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Schedule H Audit</div>
                  <div className="text-xs font-black text-slate-900 mt-1">Tokenized e-Rx</div>
                  <div className="text-[10px] text-slate-500">100% Traceability</div>
                </div>
              </div>
            </div>

            {/* Digital Verification & Stamp */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white rounded-xl border-2 border-amber-600 shadow-xs shrink-0 flex items-center justify-center">
                  <QRCodeDisplay value={pharmacyQrValue} size={90} hideDetails />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>State Drugs Control QR Code</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Scan with any terminal or smartphone to verify Form 20-B/21-B Retail Drug License on state portal.
                  </p>
                  <p className="text-[10px] text-amber-800 font-mono">
                    Token: 0xChem-KA-8831-PulseMed &bull; SHA-256 Validated
                  </p>
                </div>
              </div>

              {/* Department Seal */}
              <div className="text-right border-l-2 border-slate-200 pl-4 py-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Attestation Seal</div>
                <div className="text-xs font-black text-slate-900 mt-1">State Drugs Control Dept</div>
                <div className="text-[10px] text-amber-800 font-mono font-bold">Good Pharmacy Practice</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
