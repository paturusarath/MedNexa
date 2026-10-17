import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Stethoscope,
  Heart,
  Activity,
  AlertTriangle,
  Syringe,
  ChevronRight,
  RefreshCw,
  Printer,
  Brain,
  Download,
  Share2,
  Info,
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

type ClinicalToolTab = 'soap_notes' | 'risk_scores' | 'differential_matrix' | 'preventive_care';

interface SOAPTemplate {
  id: string;
  name: string;
  icd10: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const PRESET_SOAP_TEMPLATES: SOAPTemplate[] = [
  {
    id: 'htn',
    name: 'Essential Hypertension (OPD Follow-up)',
    icd10: 'I10 (Essential Hypertension)',
    subjective:
      'Patient reports compliance with antihypertensive regimen. Denies chest pain, orthopnea, palpitations, or visual blur. Occasional mild morning occipital heaviness after poor sleep.',
    objective:
      'Vitals: BP 138/86 mmHg (Sitting, Right Arm), Pulse 74 bpm (Regular, Good volume), SpO2 98% on room air, BMI 26.2 kg/m². CVS: S1 S2 heard, no murmurs. Chest: Clear bilaterally, vesicular breath sounds. Extremities: No pedal edema.',
    assessment:
      'Essential Hypertension, Grade 1 (controlled to borderline). No clinical evidence of target organ damage (TOD). Cardiovascular risk: Moderate.',
    plan:
      '1. Continue Telmisartan 40mg PO OD after morning breakfast.\n2. Dietary sodium restriction (< 2g/day table salt). Avoid papad, pickles, and processed snacks.\n3. Aerobic exercise: 30 minutes brisk walking at least 5 days/week.\n4. Home BP monitoring: Log morning & evening BP in MedNexa app 2x/week.\n5. Follow-up with repeat Serum Creatinine, Electrolytes & Urine Microalbumin in 90 days.',
  },
  {
    id: 't2dm',
    name: 'Type 2 Diabetes Mellitus (Glycemic Review)',
    icd10: 'E11.9 (Type 2 Diabetes without complications)',
    subjective:
      'Patient on dual oral hypoglycemic therapy (Metformin + SGLT2i). No documented hypoglycemic episodes (shivering, diaphoresis, dizziness). Reports stable appetite, no polyuria or nocturia.',
    objective:
      'Vitals: BP 128/82 mmHg, Pulse 76 bpm, BMI 27.4 kg/m². Fasting Blood Glucose (Glucometer): 132 mg/dL. Recent HbA1c: 7.2% (Target < 7.0%). Feet Examination: Monofilament 10g sensory test intact, dorsalis pedis pulsations palpable bilaterally, no calluses or ulcerations.',
    assessment:
      'Type 2 Diabetes Mellitus with sub-optimal glycemic control. Diabetic microvascular screening negative for peripheral neuropathy or active diabetic foot.',
    plan:
      '1. Continue Metformin 500mg SR BD after meals + Dapagliflozin 10mg OD morning.\n2. Medical Nutrition Therapy: Low glycemic index meals, portion-controlled carbohydrates, no added sugars.\n3. Eye Care: Annual dilated fundus examination scheduled.\n4. Repeat HbA1c, Lipid Profile, and urine ACR in 3 months.\n5. Advised on recognizing hypoglycemia symptoms and keeping glucose candy available.',
  },
  {
    id: 'asthma',
    name: 'Bronchial Asthma / COPD Exacerbation',
    icd10: 'J45.909 (Unspecified Asthma, uncomplicated)',
    subjective:
      'Presents with recurrent wheeze, nocturnal cough, and chest tightness over past 4 days triggered by seasonal temperature drop and dust exposure. Using SABA inhaler 3-4 times/week.',
    objective:
      'Vitals: Resp Rate 20/min, SpO2 96% on room air, Pulse 86 bpm, Afebrile (98.4°F). Chest: Bilateral expiratory polyphonic rhonchi audible on auscultation, no subcostal retractions, vesicular sounds preserved.',
    assessment:
      'Bronchial Asthma, partially controlled with mild acute exacerbation. No signs of respiratory exhaustion or impending respiratory failure.',
    plan:
      '1. Initiate Budesonide + Formoterol (200/6 mcg) dry powder inhaler 1 puff BD with spacer.\n2. Levosalbutamol inhaler (50 mcg) 2 puffs SOS for breakthrough breathlessness.\n3. Short course Montelukast 10mg PO at bedtime for 14 days.\n4. Avoid outdoor exposure during high AQI mornings; use N95 mask in traffic.\n5. Peak Expiratory Flow (PEFR) diary review in 2 weeks.',
  },
  {
    id: 'gerd',
    name: 'Gastroesophageal Reflux & Dyspepsia',
    icd10: 'K21.9 (GERD without esophagitis)',
    subjective:
      'Complains of retrosternal burning sensation (heartburn) and acid regurgitation, predominantly 45-60 minutes post-dinner and on reclining. Denies dysphagia, weight loss, hematemesis, or melena (no red flags).',
    objective:
      'Vitals: BP 120/78 mmHg, Pulse 72 bpm, SpO2 99%. Abdomen: Soft, non-tender, mild epigastric discomfort on deep palpation, no hepatosplenomegaly, bowel sounds active.',
    assessment:
      'Gastroesophageal Reflux Disease (GERD) with non-ulcer dyspepsia. Absence of alarm symptoms.',
    plan:
      '1. Pantoprazole 40mg + Domperidone 30mg SR PO once daily 30 minutes before breakfast for 3 weeks.\n2. Antacid gel (Megaldrate + Simethicone) 10ml PO SOS post-meals.\n3. Lifestyle: Elevate head of bed by 6 inches, avoid eating within 3 hours of sleep, reduce coffee/tea and oily spicy curries.\n4. Review after 3 weeks; if symptoms persist or dysphagia develops, consider Upper GI Endoscopy.',
  },
  {
    id: 'fever',
    name: 'Acute Febrile Illness (Dengue / Viral Triage)',
    icd10: 'R50.9 (Fever, unspecified) / A90 (Dengue Fever)',
    subjective:
      'Acute onset high fever (102°F) with severe retro-orbital headache, generalized myalgia ("break-bone pain"), and mild nausea for 3 days. Denies cough, breathlessness, dysuria, bleeding gums, or petechiae.',
    objective:
      'Vitals: Temp 101.4°F, BP 114/76 mmHg, Pulse 92 bpm, SpO2 98%. General: Flushed facies, no petechiae or rash, Tourniquet test negative. Abdomen: Soft, no tender hepatomegaly, no free fluid clinically.',
    assessment:
      'Acute Febrile Illness, probable Viral etiology (Dengue fever / Chikungunya in differential). No clinical warning signs of plasma leakage or shock at present.',
    plan:
      '1. Tab Paracetamol 650mg PO QDS / SOS for fever > 100°F (Max 2.6g/day). Strict avoidance of NSAIDs (Ibuprofen, Mefenamic acid, Aspirin).\n2. Oral Hydration: Minimum 2.5 - 3 Liters fluid daily (ORS, coconut water, soup, dal water).\n3. STAT Lab investigations: CBC with Platelet count, Dengue NS1 Antigen, Peripheral smear for Malaria, SGOT/SGPT.\n4. RED FLAG WARNING: Immediate emergency room reporting if persistent vomiting, abdominal pain, mucosal bleed, extreme lethargy, or reduced urine output.',
  },
];

export const DoctorClinicalToolsDesk: React.FC = () => {
  const { addNotification } = useHealth();
  const [activeTab, setActiveTab] = useState<ClinicalToolTab>('soap_notes');

  // SOAP State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('htn');
  const currentTemplate = PRESET_SOAP_TEMPLATES.find((t) => t.id === selectedTemplateId) || PRESET_SOAP_TEMPLATES[0];
  const [patientName, setPatientName] = useState('Sarath Paturu');
  const [subjectiveText, setSubjectiveText] = useState(currentTemplate.subjective);
  const [objectiveText, setObjectiveText] = useState(currentTemplate.objective);
  const [assessmentText, setAssessmentText] = useState(currentTemplate.assessment);
  const [planText, setPlanText] = useState(currentTemplate.plan);
  const [soapCopied, setSoapCopied] = useState(false);

  // Sync state when template changes
  const handleSelectTemplate = (tmpl: SOAPTemplate) => {
    setSelectedTemplateId(tmpl.id);
    setSubjectiveText(tmpl.subjective);
    setObjectiveText(tmpl.objective);
    setAssessmentText(tmpl.assessment);
    setPlanText(tmpl.plan);
    setSoapCopied(false);
  };

  const handleCopySOAP = () => {
    const fullNote = `CLINICAL SOAP CONSULTATION RECORD
PATIENT: ${patientName} | DATE: ${new Date().toLocaleDateString('en-IN')}
DOCTOR: Dr. V. Mohan, MD | NMC-2012-90482

[S - SUBJECTIVE]
${subjectiveText}

[O - OBJECTIVE]
${objectiveText}

[A - ASSESSMENT & ICD-10]
${assessmentText}

[P - PLAN & MANAGEMENT]
${planText}
------------------------------------------------------------
Digitally authenticated via MedNexa Clinical Decision Platform`;

    navigator.clipboard.writeText(fullNote);
    setSoapCopied(true);
    setTimeout(() => setSoapCopied(false), 2500);
    addNotification('SOAP Note Copied', `Structured note for ${patientName} copied to clipboard.`, 'system', 'doctor');
  };

  // RISK CALCULATORS STATE
  // CHA2DS2-VASc
  const [chaAge, setChaAge] = useState<number>(68);
  const [chaFemale, setChaFemale] = useState<boolean>(true);
  const [chaCHF, setChaCHF] = useState<boolean>(false);
  const [chaHTN, setChaHTN] = useState<boolean>(true);
  const [chaStroke, setChaStroke] = useState<boolean>(false);
  const [chaVasc, setChaVasc] = useState<boolean>(true);
  const [chaDM, setChaDM] = useState<boolean>(false);

  const calculateCHADSVASC = () => {
    let score = 0;
    if (chaCHF) score += 1;
    if (chaHTN) score += 1;
    if (chaAge >= 75) score += 2;
    else if (chaAge >= 65) score += 1;
    if (chaDM) score += 1;
    if (chaStroke) score += 2;
    if (chaVasc) score += 1;
    if (chaFemale) score += 1;
    return score;
  };

  const chaScore = calculateCHADSVASC();
  const getCHADSRisk = (score: number, isFemale: boolean) => {
    const threshold = isFemale ? 2 : 1;
    if (score === 0 || (isFemale && score === 1)) {
      return {
        risk: 'Low Stroke Risk (< 1.3% / year)',
        recommendation: 'No Anticoagulation or Antiplatelet required per ACC/AHA/ESC guidelines.',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    } else if (score === threshold) {
      return {
        risk: 'Moderate Stroke Risk (1.5% - 2.8% / year)',
        recommendation: 'Oral Anticoagulation (DOAC e.g. Apixaban / Rivaroxaban) should be considered based on clinical judgment.',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    } else {
      return {
        risk: `High Stroke Risk (${Math.min(score * 2.2, 15.2).toFixed(1)}% / year)`,
        recommendation: 'Oral Anticoagulation (DOAC preferred over Warfarin) strongly recommended unless contraindicated.',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
      };
    }
  };

  // eGFR / CKD-EPI Calculator State
  const [egfrAge, setEgfrAge] = useState<number>(58);
  const [egfrGender, setEgfrGender] = useState<'male' | 'female'>('male');
  const [egfrCr, setEgfrCr] = useState<number>(1.4);

  // Simplified CKD-EPI formula approximation
  const calculateEGFR = () => {
    const cr = Math.max(egfrCr, 0.4);
    const k = egfrGender === 'female' ? 0.7 : 0.9;
    const a = egfrGender === 'female' ? -0.241 : -0.302;
    const genderCoeff = egfrGender === 'female' ? 1.012 : 1.0;
    const val = 142 * Math.pow(Math.min(cr / k, 1), a) * Math.pow(Math.max(cr / k, 1), -1.2) * Math.pow(0.9938, egfrAge) * genderCoeff;
    return Math.round(val);
  };

  const egfr = calculateEGFR();
  const getCkdStage = (val: number) => {
    if (val >= 90) return { stage: 'Stage G1 (Normal Kidney Function)', desc: 'GFR ≥ 90 mL/min/1.73m²', drugDose: 'Standard full doses. Monitor hydration.' };
    if (val >= 60) return { stage: 'Stage G2 (Mildly Decreased)', desc: 'GFR 60-89 mL/min/1.73m²', drugDose: 'Generally standard doses. Caution with NSAIDs.' };
    if (val >= 45) return { stage: 'Stage G3a (Mild to Moderate Reduction)', desc: 'GFR 45-59 mL/min/1.73m²', drugDose: 'Dose reduce Metformin (max 1000mg/day). Avoid SGLT2i initiation if GFR < 20.' };
    if (val >= 30) return { stage: 'Stage G3b (Moderate to Severe Reduction)', desc: 'GFR 30-44 mL/min/1.73m²', drugDose: 'Withhold Metformin if GFR < 30. Dose adjust Enoxaparin & Ciprofloxacin.' };
    if (val >= 15) return { stage: 'Stage G4 (Severe Kidney Impairment)', desc: 'GFR 15-29 mL/min/1.73m²', drugDose: 'Renal consultation mandatory. Extreme drug clearance caution.' };
    return { stage: 'Stage G5 (Kidney Failure / End Stage)', desc: 'GFR < 15 mL/min/1.73m²', drugDose: 'Dialysis required. Strict renal-adjusted pharmacotherapy.' };
  };

  // ASCVD 10-Yr Risk
  const [ascvdAge, setAscvdAge] = useState<number>(55);
  const [ascvdSystolic, setAscvdSystolic] = useState<number>(142);
  const [ascvdChol, setAscvdChol] = useState<number>(215);
  const [ascvdHdl, setAscvdHdl] = useState<number>(42);
  const [ascvdSmoker, setAscvdSmoker] = useState<boolean>(false);
  const [ascvdDiabetic, setAscvdDiabetic] = useState<boolean>(true);

  const calculateASCVD = () => {
    let base = 3.5;
    if (ascvdAge > 60) base += 4.5;
    else if (ascvdAge > 50) base += 2.5;
    if (ascvdSystolic > 140) base += 3.0;
    if (ascvdChol > 200) base += 2.0;
    if (ascvdHdl < 40) base += 1.5;
    if (ascvdSmoker) base += 4.0;
    if (ascvdDiabetic) base += 3.5;
    return Math.min(Math.round(base * 1.2), 35);
  };
  const ascvdRiskPct = calculateASCVD();

  // Differential Matrix State
  const [selectedSyndrome, setSelectedSyndrome] = useState<'chest_pain' | 'dyspnea' | 'fever_platelets' | 'headache' | 'jaundice'>('chest_pain');

  const SYNDROMES_DATA = {
    chest_pain: {
      title: 'Acute Non-Traumatic Chest Pain',
      redFlags: [
        'Acute Coronary Syndrome (STEMI / NSTEMI)',
        'Acute Aortic Dissection (Tearing pain to back)',
        'Pulmonary Embolism (Sudden pleuritic pain + hypoxia)',
        'Tension Pneumothorax (Absent breath sounds)',
        'Esophageal Rupture / Boerhaave Syndrome',
      ],
      differentials: [
        'Musculoskeletal Costochondritis (Tietze syndrome)',
        'Gastroesophageal Reflux (GERD / Esophageal spasm)',
        'Acute Pericarditis (Relieved by leaning forward)',
        'Anxiety / Panic Attack with hyperventilation',
      ],
      workup: [
        '12-Lead ECG within 10 minutes of arrival (Compare with prior)',
        'High-Sensitivity Cardiac Troponin-I / Trop-T STAT',
        'Chest X-Ray PA view (Check mediastinal width & pneumothorax)',
        'Point-of-Care Echocardiography (Regional wall motion abnormalities)',
      ],
    },
    dyspnea: {
      title: 'Acute Breathlessness / Dyspnea',
      redFlags: [
        'Acute Heart Failure / Cardiogenic Pulmonary Edema',
        'Massive Pulmonary Embolism with right heart strain',
        'Acute Severe Asthma / Status Asthmaticus',
        'Anaphylaxis with stridor and laryngeal edema',
        'Foreign body aspiration or Upper Airway Obstruction',
      ],
      differentials: [
        'Acute Bronchitis or Pneumonia (Bacterial / Viral)',
        'COPD Exacerbation with CO2 retention',
        'Severe Metabolic Acidosis (Kussmaul breathing / DKA)',
        'Severe Anemia (Hb < 6.5 g/dL)',
      ],
      workup: [
        'Arterial Blood Gas (ABG) & Lactate STAT',
        'NT-proBNP / BNP quantitative level',
        'Point-of-Care Lung Ultrasound (POCUS B-lines vs consolidation)',
        'Chest Radiograph & D-Dimer test if Wells score moderate/high',
      ],
    },
    fever_platelets: {
      title: 'Acute Febrile Illness with Thrombocytopenia',
      redFlags: [
        'Severe Dengue with Plasma Leakage / Dengue Shock Syndrome',
        'Malarial Sepsis (P. falciparum cerebral malaria / ARDS)',
        'Scrub Typhus with Multi-Organ Dysfunction (MODS)',
        'Thrombotic Thrombocytopenic Purpura (TTP) / HUS',
        'Meningococcemia with purpura fulminans',
      ],
      differentials: [
        'Classic Dengue Fever without warning signs',
        'Viral hepatitis / Epstein-Barr Virus (EBV)',
        'Enteric (Typhoid) fever with bone marrow suppression',
        'Drug-induced immune thrombocytopenia (DITP)',
      ],
      workup: [
        'Dengue NS1 Antigen + IgM/IgG ELISA STAT',
        'Peripheral blood smear for Malarial Parasite (MP) & QBC',
        'Scrub Typhus IgM antibodies (Weil-Felix / ELISA)',
        'Coagulation Screen: PT / INR, aPTT, Serum Fibrinogen',
      ],
    },
    headache: {
      title: 'Severe / Thunderclap Headache',
      redFlags: [
        'Subarachnoid Hemorrhage (SAH - "Worst headache of life")',
        'Acute Bacterial or Tubercular Meningitis / Encephalitis',
        'Cerebral Venous Sinus Thrombosis (CVST)',
        'Acute Angle-Closure Glaucoma (Eye pain + fixed dilated pupil)',
        'Temporal Arteritis / Giant Cell Arteritis (Age > 50, jaw claudication)',
      ],
      differentials: [
        'Acute Migraine with or without aura',
        'Tension-type Headache',
        'Acute Sinusitis (Frontal / Maxillary tenderness)',
        'Cervicogenic headache',
      ],
      workup: [
        'Non-Contrast CT Brain STAT (Rule out acute hemorrhage)',
        'Lumbar Puncture (If CT normal and SAH/meningitis suspected)',
        'Fundoscopy for Papilledema (Check raised ICP)',
        'ESR & CRP (If temporal arteritis suspected in elderly)',
      ],
    },
    jaundice: {
      title: 'Acute Jaundice & Hepato-Biliary Dysfunction',
      redFlags: [
        'Acute Liver Failure (Encephalopathy + Coagulopathy INR > 1.5)',
        'Acute Ascending Cholangitis (Charcot triad: Fever + Jaundice + RUQ pain)',
        'Fulminant Viral Hepatitis (Hepatitis B / E in pregnancy)',
        'Budd-Chiari Syndrome (Hepatic vein thrombosis)',
      ],
      differentials: [
        'Choledocholithiasis (Common bile duct stone)',
        'Alcoholic Hepatitis / Acute-on-Chronic Liver Failure',
        'Drug-Induced Liver Injury (DILI - Paracetamol, ATT, CAM)',
        'Hemolytic Jaundice (G6PD deficiency, autoimmune hemolysis)',
      ],
      workup: [
        'Ultrasound Whole Abdomen (Biliary ductal dilatation & stone check)',
        'Liver Function Test (Direct vs Indirect Bilirubin, SGOT/SGPT, ALP, GGT)',
        'Prothrombin Time (PT/INR) to assess synthetic function',
        'Viral Hepatitis Serology (HBsAg, Anti-HCV, IgM Anti-HAV, IgM Anti-HEV)',
      ],
    },
  };

  const activeSyndromeData = SYNDROMES_DATA[selectedSyndrome];

  // Adult Immunization Protocol
  const [immAge, setImmAge] = useState<number>(55);
  const [immDiabetic, setImmDiabetic] = useState<boolean>(true);
  const [immCardiac, setImmCardiac] = useState<boolean>(true);
  const [immCopd, setImmCopd] = useState<boolean>(false);

  return (
    <div id="clinical-tools-suite" className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Desk Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Doctor's Clinical Practice &amp; Decision Intelligence Suite
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                Evidence-Based
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Beyond Rx interactions: Structured SOAP clinical notes, cardio-renal risk scoring, emergency differential triage, and adult immunization
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('soap_notes')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'soap_notes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>SOAP Note Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('risk_scores')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'risk_scores'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>Cardio-Renal Scores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('differential_matrix')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'differential_matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Differential &amp; Red Flags</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preventive_care')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preventive_care'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Syringe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Adult Vaccines</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RAPID SOAP NOTE GENERATOR */}
      {activeTab === 'soap_notes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Disease Clinical Protocol:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SOAP_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedTemplateId === tmpl.id
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tmpl.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Patient Name"
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 w-36"
              />
              <button
                type="button"
                onClick={handleCopySOAP}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                {soapCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{soapCopied ? 'Copied to Clipboard!' : 'Copy SOAP Note'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Subjective */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">S</span>
                  <span>Subjective (History &amp; Symptoms)</span>
                </span>
                <span className="text-[10px] text-slate-400">Patient reported</span>
              </div>
              <textarea
                rows={3}
                value={subjectiveText}
                onChange={(e) => setSubjectiveText(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-indigo-600 leading-relaxed"
              />
            </div>

            {/* Objective */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">O</span>
                  <span>Objective (Vitals &amp; Physical Exam)</span>
                </span>
                <span className="text-[10px] text-slate-400">Clinical signs</span>
              </div>
              <textarea
                rows={3}
                value={objectiveText}
                onChange={(e) => setObjectiveText(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-indigo-600 leading-relaxed"
              />
            </div>

            {/* Assessment */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px]">A</span>
                  <span>Assessment &amp; ICD-10 Code</span>
                </span>
                <span className="text-[10px] text-amber-700 font-bold">{currentTemplate.icd10}</span>
              </div>
              <textarea
                rows={3}
                value={assessmentText}
                onChange={(e) => setAssessmentText(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-indigo-600 leading-relaxed"
              />
            </div>

            {/* Plan */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">P</span>
                  <span>Plan &amp; Management Guidelines</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Rx &bull; Lifestyle</span>
              </div>
              <textarea
                rows={3}
                value={planText}
                onChange={(e) => setPlanText(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-indigo-600 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL RISK & CARDIO-RENAL CALCULATORS */}
      {activeTab === 'risk_scores' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
          {/* CALCULATOR 1: CHA2DS2-VASc SCORE */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span className="font-black text-slate-900 text-sm">CHA₂DS₂-VASc AFib Stroke Risk Score</span>
              </div>
              <span className="font-mono text-base font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200">
                Score: {chaScore} / 9
              </span>
            </div>

            <p className="text-slate-500 text-[11px]">
              Calculates annual ischemic stroke risk in non-valvular Atrial Fibrillation and guides oral anticoagulation therapy.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chaCHF}
                  onChange={(e) => setChaCHF(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>C: Heart Failure (+1)</span>
              </label>

              <label className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chaHTN}
                  onChange={(e) => setChaHTN(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>H: Hypertension (+1)</span>
              </label>

              <label className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chaDM}
                  onChange={(e) => setChaDM(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>D: Diabetes (+1)</span>
              </label>

              <label className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chaStroke}
                  onChange={(e) => setChaStroke(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>S₂: Prior Stroke/TIA (+2)</span>
              </label>

              <label className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chaVasc}
                  onChange={(e) => setChaVasc(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>V: Vascular Disease (+1)</span>
              </label>

              <label className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chaFemale}
                  onChange={(e) => setChaFemale(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Sc: Female Sex (+1)</span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-slate-600 font-bold">Age Category:</span>
              <select
                value={chaAge}
                onChange={(e) => setChaAge(Number(e.target.value))}
                className="py-1 px-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              >
                <option value={55}>&lt; 65 Years (0 pts)</option>
                <option value={68}>65 - 74 Years (+1 pt)</option>
                <option value={78}>≥ 75 Years (+2 pts)</option>
              </select>
            </div>

            {/* Recommendation Result */}
            {(() => {
              const res = getCHADSRisk(chaScore, chaFemale);
              return (
                <div className={`p-3 rounded-xl border space-y-1 ${res.color}`}>
                  <div className="font-bold flex items-center justify-between">
                    <span>Clinical Risk: {res.risk}</span>
                    <span className="text-[10px] uppercase font-black">ACC / ESC Guideline</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{res.recommendation}</p>
                </div>
              );
            })()}
          </div>

          {/* CALCULATOR 2: eGFR & CKD STAGING WITH RENAL DRUG DOSING */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span className="font-black text-slate-900 text-sm">eGFR (CKD-EPI) &amp; Renal Dosing</span>
              </div>
              <span className="font-mono text-base font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200">
                {egfr} mL/min/1.73m²
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Age (Years)</label>
                <input
                  type="number"
                  value={egfrAge}
                  onChange={(e) => setEgfrAge(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Biological Sex</label>
                <select
                  value={egfrGender}
                  onChange={(e) => setEgfrGender(e.target.value as any)}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Serum Cr (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={egfrCr}
                  onChange={(e) => setEgfrCr(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg font-bold text-xs"
                />
              </div>
            </div>

            {/* Staging & Renal Drug Guidance */}
            {(() => {
              const ckd = getCkdStage(egfr);
              return (
                <div className="space-y-2">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-0.5">
                    <span className="font-bold text-slate-900 block">{ckd.stage}</span>
                    <span className="text-[11px] text-slate-500">{ckd.desc}</span>
                  </div>

                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-0.5">
                    <span className="font-bold block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Renal Pharmacotherapy Adjustments:</span>
                    </span>
                    <p className="text-[11px] leading-relaxed">{ckd.drugDose}</p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* CALCULATOR 3: 10-YEAR ASCVD CARDIOVASCULAR RISK */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span className="font-black text-slate-900 text-sm">ASCVD 10-Year Cardiovascular Event Risk (ACC/AHA)</span>
              </div>
              <span className="font-mono text-base font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                10-Yr Risk: ~{ascvdRiskPct}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Age</label>
                <input
                  type="number"
                  value={ascvdAge}
                  onChange={(e) => setAscvdAge(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={ascvdSystolic}
                  onChange={(e) => setAscvdSystolic(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Total Chol (mg/dL)</label>
                <input
                  type="number"
                  value={ascvdChol}
                  onChange={(e) => setAscvdChol(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">HDL Chol (mg/dL)</label>
                <input
                  type="number"
                  value={ascvdHdl}
                  onChange={(e) => setAscvdHdl(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div className="flex items-center pt-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ascvdSmoker}
                    onChange={(e) => setAscvdSmoker(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Active Smoker</span>
                </label>
              </div>

              <div className="flex items-center pt-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ascvdDiabetic}
                    onChange={(e) => setAscvdDiabetic(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Diabetic</span>
                </label>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 block">
                  {ascvdRiskPct >= 20 ? 'High Risk Tier (≥ 20%)' : ascvdRiskPct >= 7.5 ? 'Intermediate Risk Tier (7.5% - 19.9%)' : 'Borderline / Low Risk (< 7.5%)'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {ascvdRiskPct >= 20
                    ? 'Statin Therapy: High-intensity Statin (Atorvastatin 40-80mg or Rosuvastatin 20-40mg) strongly indicated + strict BP target < 130/80.'
                    : ascvdRiskPct >= 7.5
                    ? 'Statin Therapy: Moderate-intensity Statin (Atorvastatin 20mg or Rosuvastatin 10mg) recommended to lower LDL-C by 30-49%.'
                    : 'Lifestyle optimization: Heart-healthy Mediterranean / DASH diet, regular aerobic exercise, repeat assessment in 4 years.'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                AHA Statin Guideline
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIFFERENTIAL DIAGNOSIS & RED FLAGS MATRIX */}
      {activeTab === 'differential_matrix' && (
        <div className="space-y-4 text-xs">
          {/* Syndrome Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-700 shrink-0">Presenting Syndrome:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedSyndrome('chest_pain')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedSyndrome === 'chest_pain' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Chest Pain
              </button>
              <button
                type="button"
                onClick={() => setSelectedSyndrome('dyspnea')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedSyndrome === 'dyspnea' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Breathlessness (Dyspnea)
              </button>
              <button
                type="button"
                onClick={() => setSelectedSyndrome('fever_platelets')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedSyndrome === 'fever_platelets' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Fever + Low Platelets
              </button>
              <button
                type="button"
                onClick={() => setSelectedSyndrome('headache')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedSyndrome === 'headache' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Thunderclap Headache
              </button>
              <button
                type="button"
                onClick={() => setSelectedSyndrome('jaundice')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedSyndrome === 'jaundice' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Acute Jaundice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Red Flags: Must-Not-Miss */}
            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-2">
              <div className="flex items-center gap-1.5 font-black text-rose-950">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Life-Threatening Red Flags</span>
              </div>
              <p className="text-[11px] text-rose-800">
                Rule out these fatal etiologies immediately:
              </p>
              <ul className="space-y-1.5 pt-1">
                {activeSyndromeData.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] font-bold text-rose-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common OPD Differentials */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 font-black text-slate-900">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Common OPD Differentials</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Benign or frequent presentations:
              </p>
              <ul className="space-y-1.5 pt-1">
                {activeSyndromeData.differentials.map((diff, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Essential Bedside Workup */}
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
              <div className="flex items-center gap-1.5 font-black text-blue-950">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Emergency 1st-Line Workup</span>
              </div>
              <p className="text-[11px] text-blue-800">
                Stat bedside protocol:
              </p>
              <ul className="space-y-1.5 pt-1">
                {activeSyndromeData.workup.map((wk, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] font-semibold text-blue-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADULT PREVENTIVE IMMUNIZATION ADVISOR */}
      {activeTab === 'preventive_care' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Patient Age</label>
              <input
                type="number"
                value={immAge}
                onChange={(e) => setImmAge(Number(e.target.value))}
                className="w-24 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div className="flex items-center gap-4 pt-3">
              <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={immDiabetic}
                  onChange={(e) => setImmDiabetic(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Diabetic</span>
              </label>

              <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={immCardiac}
                  onChange={(e) => setImmCardiac(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Cardiovascular Disease</span>
              </label>

              <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={immCopd}
                  onChange={(e) => setImmCopd(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>COPD / Asthma</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Vaccine 1: Influenza */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">Influenza (Annual Flu)</span>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded">High Priority</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Quadrivalent inactivated vaccine advised annually before monsoon/winter for all adults with cardiac, diabetic, or lung conditions.
              </p>
            </div>

            {/* Vaccine 2: Pneumococcal */}
            <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950">Pneumococcal (PCV20)</span>
                <span className="text-[10px] font-black uppercase text-indigo-800 bg-indigo-200 px-1.5 py-0.5 rounded">
                  {immAge >= 65 || immDiabetic || immCardiac ? 'Recommended' : 'Optional'}
                </span>
              </div>
              <p className="text-[11px] text-indigo-800">
                Single dose PCV20 protects against invasive pneumococcal disease &amp; pneumonia. Indicated for Age ≥ 65 or high-risk comorbidities.
              </p>
            </div>

            {/* Vaccine 3: Shingrix (Herpes Zoster) */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950">Shingrix (Shingles)</span>
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">
                  {immAge >= 50 ? 'Indicated' : 'Not yet'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                2-dose series (0 and 2-6 months) for adults aged 50+ to prevent painful post-herpetic neuralgia and reactivation of varicella-zoster.
              </p>
            </div>

            {/* Vaccine 4: Hepatitis B */}
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950">Hepatitis B (Recombinant)</span>
                <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-200 px-1.5 py-0.5 rounded">
                  {immDiabetic ? 'Recommended' : 'Standard'}
                </span>
              </div>
              <p className="text-[11px] text-blue-800">
                3-dose schedule (0, 1, 6 months). Strongly recommended by CDC &amp; Indian clinical guidelines for all diabetic adults aged &lt; 60.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
