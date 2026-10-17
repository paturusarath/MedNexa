import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Heart,
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Stethoscope,
  Copy,
  Printer,
  ChevronRight,
  Sparkles,
  Thermometer,
  Wind,
  Droplet,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const EmergencyTriageCDSSDesk: React.FC = () => {
  const { vitals } = useHealth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'news2' | 'protocols' | 'transfer'>('news2');

  // NEWS-2 Calculator State
  const [patientName, setPatientName] = useState('Sarath Paturu');
  const [respRate, setRespRate] = useState(20);
  const [spO2, setSpO2] = useState(vitals?.oxygenSatPct || 98);
  const [onOxygen, setOnOxygen] = useState(false);
  const [systolicBp, setSystolicBp] = useState(
    parseInt(vitals?.bloodPressure?.split('/')[0] || '120', 10)
  );
  const [pulse, setPulse] = useState(vitals?.heartRateBpm || 76);
  const [consciousness, setConsciousness] = useState<'alert' | 'voice' | 'pain' | 'unresponsive'>(
    'alert'
  );
  const [temp, setTemp] = useState(vitals?.temperatureF || 98.4);

  // Selected Protocol
  const [selectedProtocol, setSelectedProtocol] = useState<'cardiac' | 'anaphylaxis' | 'stemi' | 'hypoglycemia' | 'asthma'>('cardiac');
  const [copiedTransfer, setCopiedTransfer] = useState(false);

  // Calculate NEWS-2 Score
  const calculateNews2 = () => {
    let score = 0;

    // Respiration Rate
    if (respRate <= 8) score += 3;
    else if (respRate >= 9 && respRate <= 11) score += 1;
    else if (respRate >= 12 && respRate <= 20) score += 0;
    else if (respRate >= 21 && respRate <= 24) score += 2;
    else if (respRate >= 25) score += 3;

    // SpO2 Scale 1
    if (spO2 <= 91) score += 3;
    else if (spO2 >= 92 && spO2 <= 93) score += 2;
    else if (spO2 >= 94 && spO2 <= 95) score += 1;
    else score += 0;

    // Air or Oxygen
    if (onOxygen) score += 2;

    // Systolic BP
    if (systolicBp <= 90) score += 3;
    else if (systolicBp >= 91 && systolicBp <= 100) score += 2;
    else if (systolicBp >= 101 && systolicBp <= 110) score += 1;
    else if (systolicBp >= 111 && systolicBp <= 219) score += 0;
    else if (systolicBp >= 220) score += 3;

    // Pulse
    if (pulse <= 40) score += 3;
    else if (pulse >= 41 && pulse <= 50) score += 1;
    else if (pulse >= 51 && pulse <= 90) score += 0;
    else if (pulse >= 91 && pulse <= 110) score += 1;
    else if (pulse >= 111 && pulse <= 130) score += 2;
    else if (pulse >= 131) score += 3;

    // Consciousness (ACVPU)
    if (consciousness !== 'alert') score += 3;

    // Temperature (°F)
    if (temp <= 95.0) score += 3;
    else if (temp >= 95.1 && temp <= 96.8) score += 1;
    else if (temp >= 96.9 && temp <= 100.4) score += 0;
    else if (temp >= 100.5 && temp <= 102.2) score += 1;
    else if (temp >= 102.3) score += 2;

    return score;
  };

  const news2Score = calculateNews2();

  const getRiskDetails = (score: number) => {
    if (score >= 7) {
      return {
        level: 'High Clinical Risk (Critical)',
        color: 'bg-rose-50 text-rose-800 border-rose-300',
        badge: 'bg-rose-600 text-white',
        response:
          'Immediate emergency medical team review. Continuous vital signs monitoring. Urgent escalation to High Dependency Unit (HDU) or Intensive Care Unit (ICU).',
      };
    }
    if (score >= 5) {
      return {
        level: 'Medium Clinical Risk (Urgent)',
        color: 'bg-amber-50 text-amber-800 border-amber-300',
        badge: 'bg-amber-600 text-white',
        response:
          'Urgent review by attending physician within 30 minutes. Increase monitoring frequency to hourly. Ensure acute escalation pathway activated.',
      };
    }
    return {
      level: 'Low Clinical Risk (Stable)',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      badge: 'bg-emerald-600 text-white',
      response:
        'Standard ward or OPD monitoring. Repeat clinical observations every 4 to 6 hours or as indicated by physician.',
    };
  };

  const risk = getRiskDetails(news2Score);

  const transferNoteText = `EMERGENCY CLINICAL HANDOVER & ICU TRANSFER NOTE
========================================================================
Patient Name: ${patientName}  |  Date: ${new Date().toLocaleDateString('en-IN')}
Physician: Dr. V. Mohan, MD (Cardiology & Internal Medicine, NMC-2012-90482)

1. TRIAGE & PHYSIOLOGICAL SEVERITY:
- National Early Warning Score (NEWS-2): ${news2Score} / 20 (${risk.level.toUpperCase()})
- Blood Pressure: ${systolicBp}/80 mmHg
- Heart Rate: ${pulse} BPM
- Respiration Rate: ${respRate} /min
- Oxygen Saturation (SpO2): ${spO2}% (Supplemental O2: ${onOxygen ? 'YES' : 'ROOM AIR'})
- Temperature: ${temp}°F
- Consciousness: ${consciousness.toUpperCase()}

2. CLINICAL ACTION & PROTOCOL EXECUTED:
- Selected Algorithm: ${selectedProtocol.toUpperCase()}
- Clinical Decision: ${risk.response}

3. URGENT RECOMMENDATIONS:
- Immediate ICU bed reservation & continuous arterial telemetry.
- STAT 12-lead ECG, Troponin-I, Arterial Blood Gas (ABG), and Lactate panel.
========================================================================`;

  const handleCopyTransferNote = () => {
    navigator.clipboard.writeText(transferNoteText);
    setCopiedTransfer(true);
    setTimeout(() => setCopiedTransfer(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                Emergency Resuscitation &amp; Clinical Triage Desk (CDSS)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                Doctor Essential
              </span>
            </div>
            <p className="text-xs text-slate-500">
              National Early Warning Score (NEWS-2), acute resuscitation algorithms, and 1-click ICU handover notes
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('news2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'news2' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NEWS-2 Triage
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('protocols')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'protocols' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Acute Protocols
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transfer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'transfer' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ICU Transfer Note
          </button>
        </div>
      </div>

      {/* TAB 1: NEWS-2 TRIAGE CALCULATOR */}
      {activeTab === 'news2' && (
        <div className="space-y-5">
          {/* Top Score Summary Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${risk.color}`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/90 border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                <span className="text-2xl font-black text-slate-900 leading-none">{news2Score}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Score / 20</span>
              </div>
              <div className="space-y-0.5">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${risk.badge}`}>
                  {risk.level}
                </span>
                <p className="text-xs font-semibold leading-relaxed mt-1">{risk.response}</p>
              </div>
            </div>
            <div className="text-xs text-slate-600 font-mono text-right shrink-0">
              <div>Royal College of Physicians (UK)</div>
              <div className="text-[11px] text-slate-500">Standardized Clinical Deterioration Scale</div>
            </div>
          </div>

          {/* Interactive Input Sliders & Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Respiratory Rate */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-indigo-600" />
                  Respiration Rate
                </span>
                <span className="font-mono font-black text-indigo-700 text-sm">{respRate} /min</span>
              </div>
              <input
                type="range"
                min="6"
                max="36"
                value={respRate}
                onChange={(e) => setRespRate(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>&le;8 (3 pts)</span>
                <span className="text-emerald-600 font-bold">12-20 Normal</span>
                <span>&ge;25 (3 pts)</span>
              </div>
            </div>

            {/* 2. SpO2 Oxygen Saturation */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-600" />
                  Oxygen Saturation (SpO2)
                </span>
                <span className="font-mono font-black text-cyan-700 text-sm">{spO2}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="100"
                value={spO2}
                onChange={(e) => setSpO2(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>&le;91% (3 pts)</span>
                <span className="text-emerald-600 font-bold">&ge;96% Target</span>
                <span>100%</span>
              </div>
            </div>

            {/* 3. Supplemental Oxygen */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 text-xs block">Supplemental Oxygen</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOnOxygen(false)}
                  className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    !onOxygen ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  Room Air (0 pts)
                </button>
                <button
                  type="button"
                  onClick={() => setOnOxygen(true)}
                  className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    onOxygen ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  Oxygen Mask (2 pts)
                </button>
              </div>
            </div>

            {/* 4. Systolic BP */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" />
                  Systolic Blood Pressure
                </span>
                <span className="font-mono font-black text-rose-700 text-sm">{systolicBp} mmHg</span>
              </div>
              <input
                type="range"
                min="70"
                max="240"
                value={systolicBp}
                onChange={(e) => setSystolicBp(parseInt(e.target.value, 10))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>&le;90 (3 pts)</span>
                <span className="text-emerald-600 font-bold">111-219 Normal</span>
                <span>&ge;220 (3 pts)</span>
              </div>
            </div>

            {/* 5. Heart Rate / Pulse */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Heart Rate (Pulse)
                </span>
                <span className="font-mono font-black text-amber-700 text-sm">{pulse} BPM</span>
              </div>
              <input
                type="range"
                min="35"
                max="160"
                value={pulse}
                onChange={(e) => setPulse(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>&le;40 (3 pts)</span>
                <span className="text-emerald-600 font-bold">51-90 Normal</span>
                <span>&ge;131 (3 pts)</span>
              </div>
            </div>

            {/* 6. Consciousness (ACVPU) */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 text-xs block">Consciousness (ACVPU)</span>
              <select
                value={consciousness}
                onChange={(e) => setConsciousness(e.target.value as any)}
                className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-indigo-600"
              >
                <option value="alert">Alert (A) - 0 pts</option>
                <option value="voice">Voice Responsive (V) - 3 pts</option>
                <option value="pain">Pain Responsive (P) - 3 pts</option>
                <option value="unresponsive">Unresponsive (U) - 3 pts</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACUTE EMERGENCY PROTOCOLS */}
      {activeTab === 'protocols' && (
        <div className="space-y-4">
          {/* Protocol Selector Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'cardiac', label: 'ACLS Cardiac Arrest' },
              { id: 'anaphylaxis', label: 'Acute Anaphylaxis' },
              { id: 'stemi', label: 'ACS / STEMI Chest Pain' },
              { id: 'hypoglycemia', label: 'Severe Hypoglycemia' },
              { id: 'asthma', label: 'Acute Severe Asthma' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProtocol(p.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedProtocol === p.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Protocol Card */}
          {selectedProtocol === 'cardiac' && (
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                <h3 className="text-sm font-black text-rose-950 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-rose-600" />
                  ACLS Adult Cardiac Arrest Algorithm (2025/2026 Guidelines)
                </h3>
                <span className="text-[11px] font-mono text-rose-800 font-bold">CPR 30:2 &bull; 100-120/min</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-900 block">1. Immediate Chest Compressions</span>
                  <p className="text-slate-600 leading-relaxed">
                    Depth 5-6 cm, full chest recoil, minimal interruptions (&lt;10s). Switch compressors every 2 mins.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-900 block">2. Shockable (VF / pVT)</span>
                  <p className="text-slate-600 leading-relaxed">
                    1 shock (150-200J biphasic). Resume CPR immediately for 2 min. Adrenaline 1mg IV Q3-5min after 2nd shock. Amiodarone 300mg IV after 3rd shock.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-900 block">3. Non-Shockable (Asystole / PEA)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Adrenaline 1mg IV immediately. Search for reversible causes (5 H&apos;s &amp; 5 T&apos;s: Hypoxia, Hypovolemia, Hydrogen ion, Tension pneumothorax, Tamponade).
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedProtocol === 'anaphylaxis' && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Acute Anaphylaxis Emergency Clinical Protocol
                </h3>
                <span className="text-[11px] font-mono text-amber-800 font-bold">First-Line: Adrenaline IM</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">1. Intramuscular Adrenaline</span>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Adrenaline 1:1000:</strong> 0.5 mg (0.5 mL) IM into anterolateral mid-thigh. Repeat at 5-minute intervals if response is suboptimal.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">2. Airway &amp; High-Flow O2</span>
                  <p className="text-slate-600 leading-relaxed">
                    15 L/min via non-rebreather mask. Prepare for early endotracheal intubation if laryngeal edema or stridor present.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">3. IV Fluid Resuscitation &amp; Adjuncts</span>
                  <p className="text-slate-600 leading-relaxed">
                    Rapid crystalloid bolus (1000 mL Normal Saline). IV Hydrocortisone 200mg + IV Chlorpheniramine 10mg slow infusion.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedProtocol === 'stemi' && (
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <h3 className="text-sm font-black text-blue-950 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-600" />
                  ACS / Acute STEMI Emergency Management Desk
                </h3>
                <span className="text-[11px] font-mono text-blue-800 font-bold">Door-to-Balloon &lt;90 Mins</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900 block">1. Antiplatelet Loading</span>
                  <p className="text-slate-600 leading-relaxed">
                    Aspirin 325 mg (chewable non-enteric) + Ticagrelor 180 mg (or Clopidogrel 600 mg oral loading).
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900 block">2. Nitrate &amp; Pain Management</span>
                  <p className="text-slate-600 leading-relaxed">
                    Sublingual Nitroglycerin 0.4 mg Q5min (max 3 doses). Avoid if SBP &lt;90 or phosphodiesterase-5 inhibitor in last 48h.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900 block">3. Statin &amp; Cath Lab Activation</span>
                  <p className="text-slate-600 leading-relaxed">
                    Atorvastatin 80 mg STAT. Alert interventional cardiology team immediately for primary percutaneous coronary intervention (PCI).
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedProtocol === 'hypoglycemia' && (
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                <h3 className="text-sm font-black text-purple-950 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-purple-600" />
                  Severe Hypoglycemia Rescue Protocol (Blood Glucose &lt; 54 mg/dL)
                </h3>
                <span className="text-[11px] font-mono text-purple-800 font-bold">Rule of 15</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1">
                  <span className="font-bold text-purple-900 block">1. IV Dextrose Infusion</span>
                  <p className="text-slate-600 leading-relaxed">
                    25% Dextrose 100 mL IV push (or 50% Dextrose 50 mL) over 1-3 mins. Flush line with saline immediately.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1">
                  <span className="font-bold text-purple-900 block">2. Glucagon IM (No IV Access)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Glucagon 1 mg IM or SC into thigh or deltoid. Repeat in 15 minutes if consciousness not regained.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1">
                  <span className="font-bold text-purple-900 block">3. Serial Re-Evaluation</span>
                  <p className="text-slate-600 leading-relaxed">
                    Re-check capillary blood glucose at 15 minutes. Once alert, provide long-acting oral carbohydrate (toast, milk, biscuits).
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedProtocol === 'asthma' && (
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-teal-200">
                <h3 className="text-sm font-black text-teal-950 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-600" />
                  Acute Severe Bronchospasm &amp; Asthma Exacerbation
                </h3>
                <span className="text-[11px] font-mono text-teal-800 font-bold">Target SpO2 93-95%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-1">
                  <span className="font-bold text-teal-900 block">1. Continuous Bronchodilators</span>
                  <p className="text-slate-600 leading-relaxed">
                    Salbutamol 5 mg + Ipratropium Bromide 0.5 mg driven by 6-8 L/min oxygen nebulizer. Repeat every 20 mins.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-1">
                  <span className="font-bold text-teal-900 block">2. Systemic Corticosteroids</span>
                  <p className="text-slate-600 leading-relaxed">
                    IV Hydrocortisone 100 mg (or Oral Prednisolone 40-50 mg if patient can swallow).
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-1">
                  <span className="font-bold text-teal-900 block">3. IV Magnesium Sulfate</span>
                  <p className="text-slate-600 leading-relaxed">
                    Magnesium Sulfate 2.0 g IV infused over 20 minutes for patients with life-threatening features or FEV1 &lt;50%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 1-CLICK ICU TRANSFER HANDOVER NOTE */}
      {activeTab === 'transfer' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Patient:</span>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="py-1 px-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyTransferNote}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>{copiedTransfer ? 'Copied to Clipboard ✓' : 'Copy Transfer Note'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print ICU Slip</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {transferNoteText}
          </div>
        </div>
      )}
    </div>
  );
};
