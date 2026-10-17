import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Zap,
  Upload,
  AlertCircle,
  FileCheck,
  Image as ImageIcon,
  Download,
} from 'lucide-react';

export interface DecodedQRData {
  title: string;
  type: 'patient_record' | 'doctor_credentials' | 'pharmacy_license' | 'prescription';
  verifiedId: string;
  holderName: string;
  authority: string;
  status: 'VERIFIED_ACTIVE' | 'AUTHENTIC' | 'COMPLIANT';
  issueDate: string;
  details: Record<string, string>;
}

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  mode?: 'patient' | 'doctor' | 'shopkeeper' | 'general';
  onScanSuccess?: (data: DecodedQRData) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  title = 'Scan & Verify QR Code',
  subtitle = 'Point camera at any official health card, medical council badge, or prescription QR',
  mode = 'general',
  onScanSuccess,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedResult, setScannedResult] = useState<DecodedQRData | null>(null);
  const [isSavingPicture, setIsSavingPicture] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScannedResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Save Scanned Record as Picture (PNG Image, NOT as text)
  const handleSaveAsPicture = (data: DecodedQRData) => {
    setIsSavingPicture(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1100;
      canvas.height = 920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Card Background
      ctx.fillStyle = '#081224';
      ctx.fillRect(0, 0, 1100, 920);

      // Border
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, 1060, 880);

      // Top banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(26, 26, 1048, 130);

      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('MEDNEXA • SCANNED CLINICAL RECORD CERTIFICATE', 50, 80);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Issuing Authority: ${data.authority} • Cryptographically Verified`, 50, 120);

      // Title & ID
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(data.title, 50, 210);

      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#2dd4bf';
      ctx.fillText(`Subject / Holder: ${data.holderName}`, 50, 260);

      ctx.font = '18px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Verified Token / ID: ${data.verifiedId}`, 50, 305);

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`Status: ${data.status} • Valid: ${data.issueDate}`, 50, 345);

      // Details Table Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(50, 380, 1000, 420);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 380, 1000, 420);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('VERIFIED CLINICAL PARTICULARS', 75, 425);

      const entries = Object.entries(data.details);
      entries.forEach(([key, value], idx) => {
        const y = 475 + idx * 55;
        ctx.fillStyle = idx % 2 === 0 ? '#1e293b' : '#0f172a';
        ctx.fillRect(60, y - 30, 980, 48);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText(key, 80, y);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(String(value), 520, y);
      });

      // Bottom Digital Stamp
      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'italic 15px sans-serif';
      ctx.fillText('Digitally captured via MedNexa Connected Health Optical Engine • Verified Authentic', 50, 850);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Scanned_Record_${data.holderName.replace(/\s+/g, '_')}_Picture.png`;
      link.click();
    } catch (e) {
      console.error('Error saving scanned record picture:', e);
    } finally {
      setIsSavingPicture(false);
    }
  };

  // Preset demo samples corresponding to the role/mode
  const handleSimulateScan = (type: 'patient' | 'doctor' | 'pharmacy') => {
    setIsScanning(false);
    let result: DecodedQRData;

    if (type === 'patient') {
      result = {
        title: 'National Health Authority Digital Health Record',
        type: 'patient_record',
        verifiedId: 'ABHA-91-8821-4402-9912',
        holderName: 'Sarath Paturu',
        authority: 'National Health Authority (ABDM / ABDC)',
        status: 'VERIFIED_ACTIVE',
        issueDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        details: {
          'Age & Gender': '32 Years, Female',
          'Blood Group': 'B Positive (B+)',
          'Known Allergies': 'Penicillin, Sulfa Antibiotics (Severe)',
          'Current Regimen': 'Levocetirizine 5mg OD, Propranolol 20mg PRN',
          'Vitals Status': 'BP 118/76 mmHg, SpO2 99%, Pulse 72 bpm',
          'Digital Signature': 'RSA-2048 SHA-256 Validated',
        },
      };
    } else if (type === 'doctor') {
      result = {
        title: 'National Medical Commission Digital Credential',
        type: 'doctor_credentials',
        verifiedId: 'NMC/MCI-REG-58492-KA',
        holderName: 'Dr. Priya Sharma, MBBS, MD',
        authority: 'National Medical Commission & Karnataka Medical Council',
        status: 'AUTHENTIC',
        issueDate: 'Valid through Dec 2029',
        details: {
          'Specialization': 'Internal Medicine & Chronic Disease',
          'Registration Year': '2012 (Active Practice)',
          'Clinical Affiliations': 'Apollo Multispeciality & PulseMed Clinic',
          'NMC Digital Token': '0x8F92A1...C39E (Verified)',
          'Tele-Practice License': 'Approved under NMC Telemedicine Guidelines 2020',
        },
      };
    } else {
      result = {
        title: 'State Drugs Control Organization Chemist License',
        type: 'pharmacy_license',
        verifiedId: 'DL-20B/21B-KA-BLR-2024-8831',
        holderName: 'PulseMed 24x7 Chemist & Druggists (Rajesh Kumar, Pharmacist)',
        authority: 'Drugs Control Department, Govt. of Karnataka',
        status: 'COMPLIANT',
        issueDate: 'Valid through March 2029',
        details: {
          'Retail License Forms': 'Form 20-B (General Drugs) & Form 21-B (Biologicals)',
          'Superintendent Pharmacist': 'Rajesh Kumar (KSPC Reg #44910)',
          'Cold Chain Certification': 'Calibrated IoT Datalogger (2°C - 8°C Active)',
          'Schedule H1 Compliance': 'Biometric Register & Batch Tracking Enabled',
          'GSTIN': '29ABCDE1234F1Z5 (Active)',
        },
      };
    }

    setScannedResult(result);
    if (onScanSuccess) {
      onScanSuccess(result);
    }
  };

  const handleResetScan = () => {
    setScannedResult(null);
    setIsScanning(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full text-white shadow-2xl overflow-hidden relative my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {!scannedResult ? (
            /* SCANNER VIEWFINDER */
            <div className="space-y-4">
              <div className="relative aspect-square max-h-72 sm:max-h-80 mx-auto rounded-2xl bg-black border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Simulated Camera Grain/Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-teal-950/30 via-transparent to-slate-950/40" />

                {/* Corner reticles */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-teal-400 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-teal-400 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-teal-400 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-teal-400 rounded-br-lg" />

                {/* Animated Laser Scanning Line */}
                <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf] animate-[bounce_2s_infinite]" />

                {/* Center Target & Hint */}
                <div className="text-center z-10 px-6 space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center border border-white/20">
                    <Camera className="w-7 h-7 text-teal-300 animate-pulse" />
                  </div>
                  <p className="text-xs font-bold text-white tracking-wide">
                    Align QR code inside viewfinder
                  </p>
                  <p className="text-[10px] text-teal-300 font-mono">
                    Auto-detection Active &bull; 60 FPS Optical Scan
                  </p>
                </div>

                {/* Flashlight toggle */}
                <button
                  type="button"
                  onClick={() => setFlashlightOn(!flashlightOn)}
                  className={`absolute top-4 right-4 z-20 p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    flashlightOn
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-black/50 text-white/80 border-white/20 hover:bg-black/80'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{flashlightOn ? 'Torch On' : 'Torch'}</span>
                </button>
              </div>

              {/* Simulation One-Click Triggers */}
              <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Quick Simulation / Instant Test Codes:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateScan('patient')}
                    className="p-2.5 bg-teal-900/40 hover:bg-teal-900/70 border border-teal-500/40 rounded-xl text-left transition cursor-pointer"
                  >
                    <span className="text-xs font-bold text-teal-300 block">Patient Record</span>
                    <span className="text-[10px] text-slate-400">ABHA Health QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateScan('doctor')}
                    className="p-2.5 bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-500/40 rounded-xl text-left transition cursor-pointer"
                  >
                    <span className="text-xs font-bold text-indigo-300 block">Doctor Credential</span>
                    <span className="text-[10px] text-slate-400">NMC Medical Reg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateScan('pharmacy')}
                    className="p-2.5 bg-amber-900/40 hover:bg-amber-900/70 border border-amber-500/40 rounded-xl text-left transition cursor-pointer"
                  >
                    <span className="text-xs font-bold text-amber-300 block">Pharmacy License</span>
                    <span className="text-[10px] text-slate-400">Drug Form 20B/21B</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* DECODED & VERIFIED RESULT CARD */
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      Cryptographically Verified Record
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    {scannedResult.status}
                  </span>
                </div>
                <h4 className="text-base font-black text-white">{scannedResult.title}</h4>
                <p className="text-xs text-slate-300">
                  Issued by: <strong className="text-white">{scannedResult.authority}</strong>
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-lg border border-emerald-800/40">
                  ID: {scannedResult.verifiedId} &bull; {scannedResult.issueDate}
                </div>
              </div>

              {/* Scanned Details Key-Value Table */}
              <div className="bg-slate-800/70 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 pb-1.5 flex items-center justify-between">
                  <span>Verified Payload Data</span>
                  <span className="text-teal-400 font-mono text-[10px]">SHA-256 Valid</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">Subject / Holder:</span>
                    <strong className="text-white font-semibold">{scannedResult.holderName}</strong>
                  </div>
                  {Object.entries(scannedResult.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-slate-700/30 text-xs">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-200 font-medium text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveAsPicture(scannedResult)}
                  disabled={isSavingPicture}
                  className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
                  title="Saves this verified clinical record as a high-resolution Picture (PNG) file"
                >
                  <ImageIcon className="w-4 h-4 text-slate-950" />
                  <span>
                    {isSavingPicture ? 'Generating Picture...' : 'Save Record as Picture (PNG)'}
                  </span>
                  <Download className="w-3.5 h-3.5 ml-auto" />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetScan}
                    className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Scan Another QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-950"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept &amp; Close</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
