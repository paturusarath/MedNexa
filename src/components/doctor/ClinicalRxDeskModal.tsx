import React, { useState } from 'react';
import {
  X,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Pill,
  Activity,
  Heart,
  Baby,
  Zap,
  Info,
  Layers,
  ArrowRight,
  Stethoscope,
  Sparkles
} from 'lucide-react';

interface ClinicalRxDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalRxDeskModal: React.FC<ClinicalRxDeskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'interactions' | 'renal' | 'pediatric' | 'emergency'>('interactions');

  // Drug Interaction State
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>(['Metformin 500mg', 'IV Iodinated Contrast']);

  // Renal Calc State
  const [age, setAge] = useState<number>(58);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(68);
  const [serumCr, setSerumCr] = useState<number>(1.6);

  // Pediatric Calc State
  const [childWeight, setChildWeight] = useState<number>(14);

  if (!isOpen) return null;

  // Calculate CrCl (Cockcroft-Gault)
  // CrCl = [(140 - age) * weight] / (72 * serumCr) * (0.85 if female)
  const calcCrCl = () => {
    if (!serumCr || serumCr <= 0) return 90;
    const base = ((140 - age) * weight) / (72 * serumCr);
    return gender === 'female' ? Math.round(base * 0.85) : Math.round(base);
  };

  const crCl = calcCrCl();

  const getCkdStage = (val: number) => {
    if (val >= 90) return { stage: 'Stage 1 (Normal / G1)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 60) return { stage: 'Stage 2 (Mild Decrease / G2)', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    if (val >= 45) return { stage: 'Stage 3a (Mild-Moderate / G3a)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val >= 30) return { stage: 'Stage 3b (Moderate-Severe / G3b)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    if (val >= 15) return { stage: 'Stage 4 (Severe / G4)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    return { stage: 'Stage 5 (Kidney Failure / G5)', color: 'text-rose-950 bg-rose-100 border-rose-300' };
  };

  const ckdInfo = getCkdStage(crCl);

  const availableCommonDrugs = [
    'Metformin 500mg',
    'IV Iodinated Contrast',
    'Warfarin 5mg',
    'Aspirin 75mg',
    'Enalapril 5mg (ACEi)',
    'Spironolactone 25mg',
    'Clopidogrel 75mg',
    'Omeprazole 20mg',
    'Ciprofloxacin 500mg',
    'Theophylline 300mg',
    'Methotrexate 15mg',
    'Atorvastatin 20mg',
  ];

  const toggleDrug = (drug: string) => {
    if (selectedDrugs.includes(drug)) {
      setSelectedDrugs(selectedDrugs.filter((d) => d !== drug));
    } else {
      if (selectedDrugs.length < 4) {
        setSelectedDrugs([...selectedDrugs, drug]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Doctor Clinical Rx &amp; Drug Safety Desk
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  Evidence-Based Clinical Aid
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Multi-drug interaction check &bull; Cockcroft-Gault Renal Dosing &bull; Pediatric mg/kg calculator
              </p>
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

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('interactions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'interactions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Drug Interactions ({selectedDrugs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('renal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'renal'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Renal eGFR &amp; Dosing Adjuster</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pediatric')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pediatric'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Pediatric mg/kg Dosing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emergency')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'emergency'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Emergency Resuscitation Protocols</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50 flex-1">
          {/* TAB 1: DRUG INTERACTIONS */}
          {activeTab === 'interactions' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Select 2 to 4 Medications to Screen for Interactions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableCommonDrugs.map((drug) => {
                    const isSelected = selectedDrugs.includes(drug);
                    return (
                      <button
                        key={drug}
                        type="button"
                        onClick={() => toggleDrug(drug)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <Pill className="w-3 h-3" />
                        <span>{drug}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interaction Findings */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Clinical Interaction Findings &bull; Pharmacological Analysis
                </h4>

                {selectedDrugs.includes('Metformin 500mg') && selectedDrugs.includes('IV Iodinated Contrast') && (
                  <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-black uppercase">
                        Severe Risk &bull; Contraindicated Timing
                      </span>
                      <span className="text-xs font-bold text-rose-900">Metformin + IV Contrast</span>
                    </div>
                    <p className="text-xs text-rose-950 font-semibold leading-relaxed">
                      IV iodinated contrast media can precipitate acute contrast-induced nephropathy (CIN), leading to severe lactic acidosis accumulation of metformin.
                    </p>
                    <div className="p-2.5 bg-white/80 rounded-xl border border-rose-200 text-[11px] text-slate-800 space-y-0.5">
                      <strong>Clinical Mitigation Action:</strong> Withhold Metformin 48 hours prior to procedure (or immediately upon contrast admission) and restart only 48 hours post-procedure after confirming normal serum creatinine.
                    </div>
                  </div>
                )}

                {selectedDrugs.includes('Warfarin 5mg') && selectedDrugs.includes('Aspirin 75mg') && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-black uppercase">
                        Major Risk &bull; Increased Bleeding
                      </span>
                      <span className="text-xs font-bold text-amber-900">Warfarin + Aspirin</span>
                    </div>
                    <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                      Synergistic antiplatelet plus anticoagulant action drastically increases major gastrointestinal and intracranial bleeding risk.
                    </p>
                    <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-slate-800 space-y-0.5">
                      <strong>Clinical Mitigation Action:</strong> Add gastroprotective PPI (e.g. Pantoprazole 40mg OD). Monitor INR weekly (target 2.0 - 2.5). Reserve combination strictly for mechanical heart valves or recent stent implantation.
                    </div>
                  </div>
                )}

                {selectedDrugs.includes('Clopidogrel 75mg') && selectedDrugs.includes('Omeprazole 20mg') && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-black uppercase">
                        Moderate Risk &bull; CYP2C19 Inhibition
                      </span>
                      <span className="text-xs font-bold text-amber-900">Clopidogrel + Omeprazole</span>
                    </div>
                    <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                      Omeprazole strongly inhibits CYP2C19, preventing bio-activation of Clopidogrel and reducing its antiplatelet efficacy.
                    </p>
                    <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-slate-800 space-y-0.5">
                      <strong>Clinical Mitigation Action:</strong> Switch PPI to <strong>Pantoprazole 40mg</strong> or <strong>Rabeprazole 20mg</strong> which exhibit minimal CYP2C19 inhibition.
                    </div>
                  </div>
                )}

                {selectedDrugs.includes('Enalapril 5mg (ACEi)') && selectedDrugs.includes('Spironolactone 25mg') && (
                  <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-600 text-white rounded text-[10px] font-black uppercase">
                        Major Risk &bull; Severe Hyperkalemia
                      </span>
                      <span className="text-xs font-bold text-orange-900">ACEi + Spironolactone</span>
                    </div>
                    <p className="text-xs text-orange-950 font-semibold leading-relaxed">
                      Both agents diminish potassium excretion, especially in elderly or diabetic nephropathy patients, risking fatal cardiac arrhythmias.
                    </p>
                    <div className="p-2.5 bg-white/80 rounded-xl border border-orange-200 text-[11px] text-slate-800 space-y-0.5">
                      <strong>Clinical Mitigation Action:</strong> Check baseline serum potassium and creatinine within 1 week of co-initiation. Advise patient to avoid potassium salt substitutes.
                    </div>
                  </div>
                )}

                {/* Default Clean message if no major clash in selection */}
                {selectedDrugs.length < 2 && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                    Please select at least 2 medications above to run the differential interaction matrix.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RENAL eGFR & CrCl CALCULATOR */}
          {activeTab === 'renal' && (
            <div className="space-y-5">
              {/* Parameter Inputs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white cursor-pointer"
                  >
                    <option value="male">Male (Standard)</option>
                    <option value="female">Female (&times; 0.85)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Serum Creatinine (mg/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={serumCr}
                    onChange={(e) => setSerumCr(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Calculated Result Cockpit */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Cockcroft-Gault Creatinine Clearance</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">{crCl}</span>
                      <span className="text-xs font-bold text-slate-500">mL/min</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-black ${ckdInfo.color}`}>
                    {ckdInfo.stage}
                  </div>
                </div>

                {/* Instant Dosage Adjustments for Key Drugs */}
                <div>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2">
                    Automatic Drug Dose Adjustments for CrCl {crCl} mL/min:
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="p-2.5">Medication</th>
                          <th className="p-2.5">Standard Regimen</th>
                          <th className="p-2.5">Adjusted Regimen for CrCl {crCl}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2.5 font-bold text-slate-900">Augmentin (Amox-Clav)</td>
                          <td className="p-2.5 text-slate-600">625mg TDS (TID)</td>
                          <td className="p-2.5 font-bold text-indigo-700">
                            {crCl < 30 ? '625mg OD to BD max (reduce frequency)' : '625mg BD or TDS standard'}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-slate-900">Levofloxacin</td>
                          <td className="p-2.5 text-slate-600">500mg OD</td>
                          <td className="p-2.5 font-bold text-indigo-700">
                            {crCl < 50 ? '500mg initial, then 250mg every 24-48 hrs' : '500mg OD standard'}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-slate-900">Metformin</td>
                          <td className="p-2.5 text-slate-600">500mg - 1000mg BD</td>
                          <td className="p-2.5 font-bold text-rose-700">
                            {crCl < 30
                              ? 'CONTRAINDICATED (Stop Metformin)'
                              : crCl < 45
                              ? 'Max 1000mg/day total (Reduce dose 50%)'
                              : 'Standard dosing safe (Monitor annually)'}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-slate-900">Gabapentin</td>
                          <td className="p-2.5 text-slate-600">300mg TDS</td>
                          <td className="p-2.5 font-bold text-indigo-700">
                            {crCl < 30 ? '300mg OD or alt days' : crCl < 60 ? '300mg BD max' : '300mg TDS'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PEDIATRIC DOSING CALCULATOR */}
          {activeTab === 'pediatric' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="font-bold text-slate-900 block text-xs">Enter Child Weight (kg):</label>
                    <span className="text-[11px] text-slate-500">Formulations auto-adjust per Indian IAP guidelines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={childWeight}
                      onChange={(e) => setChildWeight(Math.max(2, Number(e.target.value)))}
                      className="w-24 p-2 bg-slate-50 border-2 border-blue-500 rounded-xl font-black text-center text-slate-900 text-lg"
                    />
                    <span className="text-xs font-bold text-slate-600">kg</span>
                  </div>
                </div>
              </div>

              {/* Drug Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Paracetamol Syrup */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-sm">Paracetamol Syrup</strong>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">15 mg/kg</span>
                  </div>
                  <div className="text-slate-600 text-xs">
                    Target Dose: <strong className="text-slate-900 font-mono">{(childWeight * 15).toFixed(0)} mg</strong> per dose
                  </div>
                  <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-950 font-bold">
                    Syrup Calpol 250mg/5mL: Give {((childWeight * 15) / 50).toFixed(1)} mL every 6 hours SOS
                  </div>
                </div>

                {/* Amoxicillin Syrup */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-sm">Amoxicillin Syrup</strong>
                    <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-bold">40 mg/kg/day</span>
                  </div>
                  <div className="text-slate-600 text-xs">
                    Daily Total: <strong className="text-slate-900 font-mono">{(childWeight * 40).toFixed(0)} mg/day</strong> (Divided TID)
                  </div>
                  <div className="p-2.5 bg-teal-50/70 rounded-xl border border-teal-100 text-teal-950 font-bold">
                    Dry Syrup 125mg/5mL: Give {(((childWeight * 40) / 3) / 25).toFixed(1)} mL TDS for 5&ndash;7 days
                  </div>
                </div>

                {/* Cetirizine Syrup */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-sm">Cetirizine Syrup (Allergies)</strong>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">0.25 mg/kg/day</span>
                  </div>
                  <div className="text-slate-600 text-xs">
                    Daily Target: <strong className="text-slate-900 font-mono">{(childWeight * 0.25).toFixed(1)} mg</strong> OD
                  </div>
                  <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-indigo-950 font-bold">
                    Syrup 5mg/5mL: Give {((childWeight * 0.25) / 1).toFixed(1)} mL at bedtime (OD)
                  </div>
                </div>

                {/* ORS Rehydration */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-sm">WHO Reduced Osmolarity ORS</strong>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Plan B</span>
                  </div>
                  <div className="text-slate-600 text-xs">
                    4-Hour Rehydration Deficit: <strong className="text-slate-900 font-mono">{(childWeight * 75).toFixed(0)} mL</strong>
                  </div>
                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-emerald-950 font-bold">
                    Give {(childWeight * 75).toFixed(0)} mL over 4 hours, plus 10 mL/kg after every loose stool
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EMERGENCY RESUSCITATION PROTOCOLS */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2 text-xs">
                <span className="font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-rose-600" />
                  Acute Anaphylaxis Protocol (Immediate Action)
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  <strong>Adrenaline (Epinephrine) 1:1,000 (1 mg/mL):</strong> Inject <strong>0.5 mL (0.5 mg) IM</strong> into anterolateral thigh immediately. Repeat every 5&ndash;15 minutes if no response. High-flow 100% Oxygen + IV normal saline bolus (1000 mL).
                </p>
                <div className="text-[11px] text-rose-800 font-mono pt-1">
                  Secondary: IV Hydrocortisone 200mg + IV Chlorpheniramine 10mg.
                </div>
              </div>

              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2 text-xs">
                <span className="font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-700" />
                  Severe Hypoglycemia (Blood Glucose &lt; 54 mg/dL with altered sensorium)
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Administer <strong>100 mL of 20% or 25% Dextrose IV bolus</strong> over 3&ndash;5 minutes (or 50 mL of 50% Dextrose). Follow with 10% Dextrose infusion at 100 mL/hr. Re-check capillary blood glucose in 15 minutes.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl space-y-2 text-xs">
                <span className="font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-blue-700" />
                  Acute Coronary Syndrome (ACS) Immediate Loading Protocol
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  <strong>Aspirin 300mg (chewed) + Clopidogrel 300mg (or Ticagrelor 180mg) + Atorvastatin 80mg</strong> loading dose immediately. Sublingual Nitroglycerin 0.5mg if SBP &gt; 100 mmHg. Immediate 12-lead ECG and transfer to cath lab.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Calibrated with Indian Pharmacopeia &amp; NMC Clinical Practice Guidelines</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close Clinical Desk
          </button>
        </div>
      </div>
    </div>
  );
};
