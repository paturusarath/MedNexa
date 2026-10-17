export interface IndianDiseaseAnalysis {
  id: 'diabetes' | 'heart_bp' | 'thyroid' | 'respiratory';
  name: string;
  hindiName: string;
  tagline: string;
  iconName: string;
  badgeColor: string;
  prevalenceInIndia: string;
  rootCausesInIndia: string[];
  keySymptoms: string[];
  idealLabTargets: {
    test: string;
    target: string;
    description: string;
  }[];
  tablets: {
    brandName: string;
    genericComposition: string;
    manufacturer: string;
    dosageForm: string;
    strength: string;
    mrpInINR: number;
    discountPriceInINR: number;
    requiresPrescription: boolean;
    clinicalUse: string;
    frequency: string;
    instructions: string;
  }[];
  doctors: {
    name: string;
    qualifications: string;
    specialization: string;
    hospital: string;
    experienceYears: number;
    feeInINR: number;
    rating: number;
    reviewCount: number;
    avatar: string;
    languages: string[];
    availableToday: boolean;
  }[];
  dietPlan: {
    focus: string;
    morningEmptyStomach: {
      item: string;
      rationale: string;
    };
    meals: {
      meal: string;
      timing: string;
      items: string[];
      tips: string;
    }[];
    foodsToEat: string[];
    foodsToStrictlyAvoid: string[];
  };
  exercisePlan: {
    intensity: string;
    frequency: string;
    keyPranayamas: {
      name: string;
      duration: string;
      benefits: string;
    }[];
    recommendedAsanas: {
      name: string;
      englishName: string;
      action: string;
    }[];
    dailyRoutine: {
      activity: string;
      duration: string;
      timing: string;
    }[];
    precautions: string[];
  };
}

export const INDIAN_CHRONIC_CARE_DATA: IndianDiseaseAnalysis[] = [
  {
    id: 'diabetes',
    name: 'Diabetes Mellitus (Type 2)',
    hindiName: 'मधुमेह / शुगर की बीमारी',
    tagline: 'Leading metabolic challenge in India affecting over 101 million citizens',
    iconName: 'Activity',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    prevalenceInIndia: 'Over 101 million people in India are diagnosed with diabetes, with an additional 136 million in the pre-diabetic stage (ICMR-INDIAB study). High carbohydrate diets (polished white rice, refined maida) paired with genetic susceptibility to abdominal adiposity make early management critical.',
    rootCausesInIndia: [
      'High Glycemic Index Diet: Heavy reliance on polished white rice, maida rotis, and sugary tea.',
      'Genetic "Thin-Fat" Phenotype: Higher body fat percentage despite normal or borderline BMI.',
      'Sedentary Urban Lifestyle: Reduced daily physical exertion and prolonged desk jobs.',
      'Stress & Irregular Sleep: Elevates cortisol which directly blocks insulin action.',
    ],
    keySymptoms: [
      'Frequent urination, especially waking up multiple times at night (polyuria)',
      'Excessive unquenchable thirst and dry mouth (polydipsia)',
      'Sudden unexplained fatigue or post-lunch sleepiness',
      'Slow healing of skin scratches, cuts, or diabetic foot cracks',
      'Tingling or numbness in feet and hands (diabetic neuropathy)',
    ],
    idealLabTargets: [
      { test: 'Fasting Blood Glucose (FBS)', target: '70 - 99 mg/dL', description: 'After 8-10 hours overnight fasting' },
      { test: 'Post-Prandial Blood Glucose (PPBS)', target: '< 140 mg/dL', description: 'Exactly 2 hours after a standard meal' },
      { test: 'HbA1c (Glycated Hemoglobin)', target: '< 6.5% (or < 7.0% for seniors)', description: '3-month average blood glucose control' },
      { test: 'Serum Creatinine & eGFR', target: 'eGFR > 90 mL/min', description: 'Essential to monitor diabetic kidney health' },
    ],
    tablets: [
      {
        brandName: 'Glycomet-GP 2 Tablet',
        genericComposition: 'Metformin 500mg + Glimepiride 2mg',
        manufacturer: 'USV Private Limited (India)',
        dosageForm: 'Tablet (Strip of 15)',
        strength: '500mg / 2mg',
        mrpInINR: 142,
        discountPriceInINR: 118,
        requiresPrescription: true,
        clinicalUse: 'Dual-action biguanide + sulfonylurea enhancing insulin sensitivity and pancreatic release',
        frequency: 'Once or twice daily with food',
        instructions: 'Take immediately with or after breakfast. Never skip meals while taking this tablet.',
      },
      {
        brandName: 'Janumet 50/500 Tablet',
        genericComposition: 'Sitagliptin 50mg + Metformin 500mg',
        manufacturer: 'Sun Pharma / MSD India',
        dosageForm: 'Tablet (Strip of 15)',
        strength: '50mg / 500mg',
        mrpInINR: 420,
        discountPriceInINR: 365,
        requiresPrescription: true,
        clinicalUse: 'DPP-4 inhibitor combination regulating post-meal glycemic surges without hypoglycemic crashes',
        frequency: 'Twice daily with meals',
        instructions: 'Swallow whole with water. Do not crush or chew.',
      },
      {
        brandName: 'Jardiance 10mg Tablet',
        genericComposition: 'Empagliflozin 10mg',
        manufacturer: 'Boehringer Ingelheim / Lupin India',
        dosageForm: 'Tablet (Strip of 10)',
        strength: '10mg',
        mrpInINR: 580,
        discountPriceInINR: 510,
        requiresPrescription: true,
        clinicalUse: 'SGLT-2 inhibitor that removes excess glucose via urine while providing proven heart & kidney protection',
        frequency: 'Once daily in the morning',
        instructions: 'Drink at least 2.5 liters of water daily to maintain proper hydration.',
      },
      {
        brandName: 'Galvus Met 50/500 Tablet',
        genericComposition: 'Vildagliptin 50mg + Metformin 500mg',
        manufacturer: 'Novartis / Abbott India',
        dosageForm: 'Tablet (Strip of 10)',
        strength: '50mg / 500mg',
        mrpInINR: 320,
        discountPriceInINR: 285,
        requiresPrescription: true,
        clinicalUse: 'Incretin enhancer preventing liver glucose overproduction and stabilizing day-long levels',
        frequency: 'Twice daily after meals',
        instructions: 'Best taken after breakfast and dinner.',
      },
    ],
    doctors: [
      {
        name: 'Dr. V. Mohan',
        qualifications: 'MD, FRCP, Ph.D., D.Sc., FNA',
        specialization: 'Senior Diabetologist & Endocrinologist',
        hospital: "Dr. Mohan's Diabetes Specialities Centre, Chennai",
        experienceYears: 38,
        feeInINR: 1000,
        rating: 4.9,
        reviewCount: 420,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Tamil', 'Hindi'],
        availableToday: true,
      },
      {
        name: 'Dr. Rajesh Khadgawat',
        qualifications: 'MBBS, MD (Medicine), DM (Endocrinology - AIIMS New Delhi)',
        specialization: 'Professor of Endocrinology & Metabolic Medicine',
        hospital: 'AIIMS & Apex Endocrine Clinic, New Delhi',
        experienceYears: 24,
        feeInINR: 850,
        rating: 4.9,
        reviewCount: 290,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi'],
        availableToday: true,
      },
      {
        name: 'Dr. Sunita Sharma',
        qualifications: 'MBBS, MD, Fellow of Indian College of Physicians (FICP)',
        specialization: 'Consultant Diabetologist & General Physician',
        hospital: 'Manipal Hospital, Bengaluru & Online Telehealth Wing',
        experienceYears: 16,
        feeInINR: 650,
        rating: 4.8,
        reviewCount: 185,
        avatar: 'https://images.unsplash.com/photo-1594824813571-638f026385a3?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi', 'Kannada'],
        availableToday: true,
      },
    ],
    dietPlan: {
      focus: 'High fiber, complex low-glycemic millets, vegetable proteins, and natural insulin sensitizers',
      morningEmptyStomach: {
        item: 'Methi (Fenugreek) Water + Cinnamon stick infusion',
        rationale: 'Soak 1 tsp methi seeds overnight in 1 glass water. Drink on empty stomach. Galactomannan soluble fiber delays glucose absorption and lowers fasting sugars.',
      },
      meals: [
        {
          meal: 'Breakfast',
          timing: '08:30 AM',
          items: ['2 Ragi or Oats vegetable cheelas with mint-coriander chutney', '1 cup boiled sprouted moong dal', 'Sugar-free green tea or masala chai with no sugar'],
          tips: 'Millets contain resistant starch that prevents rapid sugar spikes.',
        },
        {
          meal: 'Lunch',
          timing: '01:00 PM',
          items: ['2 Jowar or multigrain phulkas (no maida)', '1 katori Palak/Methi dal with pinch of jeera', '1 bowl Karela (bitter gourd) or Lauki sabzi', 'Fresh cucumber and tomato salad (eat salad first)'],
          tips: 'Eating raw salad before carbohydrates cuts post-prandial glucose surge by 30%.',
        },
        {
          meal: 'Evening Snack',
          timing: '05:00 PM',
          items: ['1 small bowl roasted chana (gram)', 'Handful of roasted makhana (fox nuts)', 'Warm cinnamon-clove water'],
          tips: 'Avoid biscuits, rusks, and samosas which contain hidden refined palm oil.',
        },
        {
          meal: 'Dinner (Light)',
          timing: '07:45 PM',
          items: ['1 bowl vegetable oats khichdi with plenty of bottle gourd and french beans', '1 small bowl low-fat curd', 'Warm vegetable clear soup'],
          tips: 'Finish dinner at least 2.5 hours before sleeping to prevent morning dawn phenomenon.',
        },
      ],
      foodsToEat: [
        'Karela (bitter gourd), Lauki (bottle gourd), Torai (ridge gourd)',
        'Ragi, Jowar, Bajra millets, and steel-cut oats',
        'Sprouted Moong, Chana, Dalchini (cinnamon), Jamun seed powder',
        'Leafy greens (Palak, Methi, Sarson, Moringa / drumstick leaves)',
      ],
      foodsToStrictlyAvoid: [
        'White polished rice, refined maida rotis and naans',
        'Indian sweets (mithai, jalebi, gulab jamun, halwa)',
        'Packaged fruit juices, cold drinks, sodas, sweetened lassi',
        'Deep-fried snacks (samosas, kachoris, bhujia, pakodas)',
        'Potatoes, sweet potatoes, and white bread',
      ],
    },
    exercisePlan: {
      intensity: 'Moderate Aerobic & Pancreatic Yoga (Zone 2)',
      frequency: '5 to 6 days per week (minimum 150 mins weekly)',
      keyPranayamas: [
        { name: 'Kapalbhati Pranayama', duration: '5 - 10 mins (gentle)', benefits: 'Stimulates abdominal organs and improves pancreatic micro-circulation.' },
        { name: 'Anulom Vilom (Alternate Nostril)', duration: '10 mins', benefits: 'Reduces sympathetic cortisol surges that spike blood sugar.' },
      ],
      recommendedAsanas: [
        { name: 'Mandukasana', englishName: 'Frog Pose', action: 'Presses fists against the navel while bending forward; direct stimulation of pancreas.' },
        { name: 'Ardha Matsyendrasana', englishName: 'Half Spinal Twist', action: 'Twists the torso, massaging liver and spleen to enhance glucose clearance.' },
        { name: 'Pawanmuktasana', englishName: 'Wind Relieving Pose', action: 'Relieves abdominal tension and optimizes gut microbiome motility.' },
        { name: 'Surya Namaskar', englishName: 'Sun Salutations', action: '5 to 8 rounds performed slowly to engage full-body skeletal muscles.' },
      ],
      dailyRoutine: [
        { activity: 'Post-Meal Brisk Walk (Shatapawali)', duration: '15 mins', timing: 'Immediately 10-15 mins after lunch and dinner' },
        { activity: 'Morning Yoga & Pranayama', duration: '25 mins', timing: '06:30 AM on empty stomach' },
        { activity: 'Light Resistance Band Muscle Work', duration: '20 mins', timing: '3 days per week (Mon, Wed, Fri)' },
      ],
      precautions: [
        'Always check blood sugar if feeling shaky or dizzy (carry glucose tablet or candy for hypoglycemia).',
        'Wear supportive, cushioned footwear to prevent diabetic foot blisters.',
      ],
    },
  },
  {
    id: 'heart_bp',
    name: 'Heart Disease & High Blood Pressure (Hypertension)',
    hindiName: 'हृदय रोग एवं उच्च रक्तचाप (बीपी)',
    tagline: 'Leading cause of mortality in India, accounting for 28% of all national deaths',
    iconName: 'Heart',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    prevalenceInIndia: 'Hypertension affects over 1 in every 3 Indian adults (more than 300 million people). Indians develop coronary artery disease on average 10 years earlier than people in western countries, compounded by narrow coronary artery diameters, high trans-fat cooking oils, and excess dietary salt (>10g/day).',
    rootCausesInIndia: [
      'High Dietary Sodium: Widespread daily intake of pickles (achaar), papad, namkeen, and salted curries.',
      'Reheated Cooking Oils: Trans-fats generated from repetitive deep frying oxidize arterial walls.',
      'Metabolic Dyslipidemia: Abnormally high small-dense LDL and high triglycerides with low HDL.',
      'Chronic Mental Stress: Long commutes, work pressure, and sleep deprivation elevate vascular tone.',
    ],
    keySymptoms: [
      'Occipital morning headaches at the back of the skull',
      'Shortness of breath or tightness when climbing stairs or walking briskly',
      'Sudden palpitations, fluttering heart sensation, or dizziness',
      'Swelling in ankles and feet towards the evening (pedal edema)',
      'Pressure or heaviness across the chest radiating to left shoulder or jaw',
    ],
    idealLabTargets: [
      { test: 'Resting Blood Pressure', target: '< 120/80 mmHg (Stage 1 HTN: > 130/80)', description: 'Measured seated after 5 mins calm rest' },
      { test: 'Total Cholesterol', target: '< 180 mg/dL', description: 'Overall circulating sterol count' },
      { test: 'LDL (Bad Cholesterol)', target: '< 70 mg/dL (< 55 mg/dL for cardiac patients)', description: 'Primary culprit for arterial plaque deposition' },
      { test: 'Serum Triglycerides', target: '< 150 mg/dL (optimally < 100 mg/dL)', description: 'Direct reflection of dietary sugars and refined carbs' },
    ],
    tablets: [
      {
        brandName: 'Telma 40 Tablet',
        genericComposition: 'Telmisartan 40mg',
        manufacturer: 'Glenmark Pharmaceuticals India',
        dosageForm: 'Tablet (Strip of 15)',
        strength: '40mg',
        mrpInINR: 145,
        discountPriceInINR: 122,
        requiresPrescription: true,
        clinicalUse: 'Long-acting 24-hour Angiotensin II Receptor Blocker (ARB) relaxing arterial walls',
        frequency: 'Once daily at fixed time',
        instructions: 'Take consistently every morning with water. Maintains blood pressure for full 24 hours.',
      },
      {
        brandName: 'Amlong 5mg Tablet',
        genericComposition: 'Amlodipine Besylate 5mg',
        manufacturer: 'Micro Labs Limited India',
        dosageForm: 'Tablet (Strip of 15)',
        strength: '5mg',
        mrpInINR: 78,
        discountPriceInINR: 62,
        requiresPrescription: true,
        clinicalUse: 'Calcium channel blocker reducing peripheral vascular resistance and cardiac workload',
        frequency: 'Once daily',
        instructions: 'Can be taken with or without food. Report any mild ankle swelling to your doctor.',
      },
      {
        brandName: 'Atorva 20mg Tablet',
        genericComposition: 'Atorvastatin Calcium 20mg',
        manufacturer: 'Zydus Healthcare India',
        dosageForm: 'Tablet (Strip of 15)',
        strength: '20mg',
        mrpInINR: 195,
        discountPriceInINR: 162,
        requiresPrescription: true,
        clinicalUse: 'HMG-CoA reductase inhibitor drastically lowering LDL cholesterol and stabilizing arterial plaques',
        frequency: 'Once daily at bedtime',
        instructions: 'Take after dinner or before sleeping when hepatic cholesterol synthesis is peak.',
      },
      {
        brandName: 'Ecosprin 75 Tablet',
        genericComposition: 'Enteric Coated Aspirin 75mg',
        manufacturer: 'USV Private Limited India',
        dosageForm: 'Tablet (Strip of 14)',
        strength: '75mg',
        mrpInINR: 18,
        discountPriceInINR: 15,
        requiresPrescription: true,
        clinicalUse: 'Low-dose antiplatelet cardioprotective agent preventing coronary arterial clot formation',
        frequency: 'Once daily after meals',
        instructions: 'Always take with food or milk to protect gastric stomach lining.',
      },
    ],
    doctors: [
      {
        name: 'Dr. Naresh Trehan',
        qualifications: 'MBBS, MS, FRACS, FACS',
        specialization: 'Chairman & Chief Cardiac Surgeon',
        hospital: 'Medanta - The Medicity, Gurugram & New Delhi',
        experienceYears: 42,
        feeInINR: 1200,
        rating: 4.9,
        reviewCount: 540,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi', 'Punjabi'],
        availableToday: true,
      },
      {
        name: 'Dr. Arvind K. Sharma',
        qualifications: 'MBBS, MD (Medicine), DM (Cardiology - AIIMS)',
        specialization: 'Senior Interventional Cardiologist & Hypertension Expert',
        hospital: 'Apollo Hospitals & Heart Institute, New Delhi',
        experienceYears: 22,
        feeInINR: 900,
        rating: 4.9,
        reviewCount: 310,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi'],
        availableToday: true,
      },
      {
        name: 'Dr. S. K. Gupta',
        qualifications: 'MBBS, MD, DM (Cardiology - PGI Chandigarh)',
        specialization: 'Consultant Cardiologist & Preventive Heart Care',
        hospital: 'Narayana Health City, Bengaluru',
        experienceYears: 18,
        feeInINR: 800,
        rating: 4.8,
        reviewCount: 220,
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi', 'Bengali'],
        availableToday: true,
      },
    ],
    dietPlan: {
      focus: 'Indian DASH Diet: Restricting sodium to < 3g/day, boosting potassium, magnesium, garlic, and omega-3s',
      morningEmptyStomach: {
        item: '1-2 crushed cloves of Raw Garlic (Lehsun) + Lukewarm Water',
        rationale: 'Garlic contains allicin, a natural bioactive compound that stimulates nitric oxide release, actively dilating stiffened arteries and lowering systolic BP by 8-10 mmHg.',
      },
      meals: [
        {
          meal: 'Breakfast',
          timing: '08:30 AM',
          items: ['Steel-cut oats porridge with crushed flaxseeds and 4-5 walnuts', 'Fresh homemade amla (Indian gooseberry) juice (low sodium)', '1 bowl boiled egg whites or steamed paneer'],
          tips: 'Flaxseeds provide alpha-linolenic acid (ALA) which lowers arterial stiffness.',
        },
        {
          meal: 'Lunch',
          timing: '01:00 PM',
          items: ['2 multigrain rotis made with minimal or zero added salt', '1 katori Arhar/Toor dal with boiled tomatoes and garlic tadka', 'Steamed Palak (spinach) or French beans sabzi', '1 bowl fresh curd / plain chaas seasoned with roasted jeera (no rock salt)'],
          tips: 'Potassium in spinach and curd helps the kidneys flush out excess sodium.',
        },
        {
          meal: 'Evening Snack',
          timing: '05:00 PM',
          items: ['1 whole fresh Pomegranate (anar) or apple', 'Handful of unsalted roasted makhana (fox nuts)', 'Cup of Hibiscus or chamomile tea'],
          tips: 'Pomegranate polyphenols prevent oxidation of LDL cholesterol.',
        },
        {
          meal: 'Dinner',
          timing: '07:30 PM',
          items: ['1 bowl clear bottle gourd & tomato soup with black pepper', '1 whole wheat phulka with cooked Torai/Tinda/Lauki', 'Steamed fish or grilled paneer with lemon'],
          tips: 'Keep dinner light and strictly avoid salty snacks before bed.',
        },
      ],
      foodsToEat: [
        'Fresh garlic (Lehsun), Amla, Pomegranate, Beetroot juice',
        'Flaxseeds (Alsi), Walnuts, Chia seeds, unpolished oats',
        'Potassium-rich greens: Spinach (Palak), Bathua, Drumstick leaves',
        'Low-sodium rock salt (Sendha namak) used strictly in moderation',
      ],
      foodsToStrictlyAvoid: [
        'Commercial pickles (achaar), papad, chutneys with excess salt',
        'Namkeen (sev, bhujia, mathri, salted peanuts, chips)',
        'Dalda, hydrogenated vegetable vanaspati, reused frying oil',
        'Processed butter, processed cheese slices, canned soups',
        'Energy drinks and high-sodium effervescent pain tablets',
      ],
    },
    exercisePlan: {
      intensity: 'Zone 2 Rhythmic Aerobic & Autonomic Calming Pranayama',
      frequency: 'Daily 35 to 45 minutes walking; 15 minutes breathing',
      keyPranayamas: [
        { name: 'Anulom Vilom Pranayama', duration: '15 mins', benefits: 'Scientifically proven to activate parasympathetic vagal tone and lower heart rate & BP.' },
        { name: 'Bhramari Pranayama (Humming Bee)', duration: '5 mins', benefits: 'Soothes emotional anxiety and relieves intracranial tension.' },
        { name: 'Shavasana with Diaphragmatic Breath', duration: '10 mins', benefits: 'Induces full-body muscular vasodilation.' },
      ],
      recommendedAsanas: [
        { name: 'Tadasana', englishName: 'Mountain Pose', action: 'Promotes deep steady breathing and alignment without cardiac strain.' },
        { name: 'Vrikshasana', englishName: 'Tree Pose', action: 'Builds neuromuscular balance and mental equanimity.' },
        { name: 'Virasana', englishName: 'Hero Pose', action: 'Improves pelvic circulation and steady calm breathing.' },
      ],
      dailyRoutine: [
        { activity: 'Brisk Walking in Nature', duration: '35 mins', timing: '06:30 AM or 06:00 PM at moderate conversational pace' },
        { activity: 'Evening Calming Pranayama & Shavasana', duration: '15 mins', timing: 'Before dinner or before sleeping' },
      ],
      precautions: [
        'Never perform heavy breath-holding (Kumbhaka) or intense inversion headstands (Shirshasana) with high BP.',
        'Avoid sudden extreme heavy lifting or sprinting; warm up for 5 mins before walking.',
      ],
    },
  },
  {
    id: 'thyroid',
    name: 'Thyroid Disorders (Hypothyroidism & Hyperthyroidism)',
    hindiName: 'थायरॉयड विकार (हाइपो / हाइपर थायरॉयड)',
    tagline: 'Affecting over 42 million Indians, especially 3x more prevalent in women',
    iconName: 'Sparkles',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    prevalenceInIndia: 'An estimated 42 million people in India suffer from thyroid dysfunctions. Hypothyroidism (underactive thyroid) is the most widespread, driven by autoimmune Hashimoto’s thyroiditis, micronutrient deficiencies (selenium, zinc, vitamin D3), and hormonal transitions like pregnancy and menopause.',
    rootCausesInIndia: [
      'Suboptimal Trace Minerals: Low dietary Selenium and Zinc required to convert inactive T4 into active T3 hormone.',
      'Autoimmune Hashimoto’s Disease: Immune antibodies mistakenly attack thyroid follicles.',
      'High Goitrogen Intake: Consuming large amounts of raw cruciferous vegetables (raw cabbage, cauliflower) without cooking.',
      'Chronic Stress & Cortisol: High cortisol disrupts the hypothalamic-pituitary-thyroid (HPT) axis.',
    ],
    keySymptoms: [
      'Unexplained weight gain or extreme difficulty losing weight despite low food intake',
      'Persistent sluggishness, fatigue, morning brain fog, and muscle aches',
      'Extreme sensitivity to cold weather or chilled AC rooms',
      'Excessive hair thinning, dry skin, brittle nails, and puffy face under the eyes',
      'Irregular or heavy menstrual cycles in women and mood swings',
    ],
    idealLabTargets: [
      { test: 'Serum TSH (Thyroid Stimulating Hormone)', target: '0.5 - 4.5 mIU/L (Optimal: 1.0 - 2.5 mIU/L)', description: 'Primary marker: High TSH indicates Hypothyroidism; Low indicates Hyperthyroidism' },
      { test: 'Free T4 (Thyroxine)', target: '0.8 - 1.8 ng/dL', description: 'Active circulating unbound thyroid storage hormone' },
      { test: 'Free T3 (Triiodothyronine)', target: '2.3 - 4.2 pg/mL', description: 'Directly powers cellular metabolic rate' },
      { test: 'Anti-TPO Antibodies', target: '< 34 IU/mL', description: 'Tests for autoimmune Hashimoto thyroiditis' },
    ],
    tablets: [
      {
        brandName: 'Thyronorm 50 mcg / 100 mcg Tablet',
        genericComposition: 'Levothyroxine Sodium 50mcg / 100mcg',
        manufacturer: 'Abbott India Limited',
        dosageForm: 'Tablet (Bottle of 100)',
        strength: '50mcg / 100mcg',
        mrpInINR: 198,
        discountPriceInINR: 168,
        requiresPrescription: true,
        clinicalUse: 'Synthetic T4 replacement hormone restoring cellular metabolic rate and vitality in Hypothyroidism',
        frequency: 'Once daily on empty stomach',
        instructions: 'CRITICAL: Take with plain water first thing in the morning. Wait 45 minutes before tea, coffee, milk, or breakfast.',
      },
      {
        brandName: 'Eltroxin 50 mcg Tablet',
        genericComposition: 'Levothyroxine Sodium 50mcg',
        manufacturer: 'GlaxoSmithKline (GSK) Pharmaceuticals India',
        dosageForm: 'Tablet (Bottle of 120)',
        strength: '50mcg',
        mrpInINR: 210,
        discountPriceInINR: 175,
        requiresPrescription: true,
        clinicalUse: 'Trusted bioequivalent levothyroxine hormone replacement for underactive thyroid and goiter',
        frequency: 'Once daily in early morning',
        instructions: 'Never take with calcium or iron tablets; keep at least a 4-hour gap between them.',
      },
      {
        brandName: 'Neomercazole 5mg Tablet',
        genericComposition: 'Carbimazole 5mg',
        manufacturer: 'Abbott India Limited',
        dosageForm: 'Tablet (Strip of 100)',
        strength: '5mg',
        mrpInINR: 295,
        discountPriceInINR: 250,
        requiresPrescription: true,
        clinicalUse: 'Antithyroid medicine used in Hyperthyroidism (overactive thyroid) to decrease excessive hormone synthesis',
        frequency: 'As prescribed by endocrinologist',
        instructions: 'Take regularly at evenly spaced intervals with food.',
      },
    ],
    doctors: [
      {
        name: 'Dr. Ananya Roy',
        qualifications: 'MBBS, MD, DNB (Endocrinology & Thyroidology - CMC Vellore)',
        specialization: 'Senior Consultant Thyroidologist & Endocrinologist',
        hospital: 'Fortis Memorial Research Institute & Apollo Clinics',
        experienceYears: 19,
        feeInINR: 750,
        rating: 4.9,
        reviewCount: 260,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi', 'Bengali', 'Tamil'],
        availableToday: true,
      },
      {
        name: 'Dr. K. V. S. Hari Kumar',
        qualifications: 'MBBS, MD (Medicine), DM (Endocrinology - Army Hospital R&R)',
        specialization: 'Consultant Endocrinologist & Metabolic Researcher',
        hospital: 'Apollo Hospitals & Endocrine Care Center, Hyderabad',
        experienceYears: 21,
        feeInINR: 800,
        rating: 4.8,
        reviewCount: 310,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi', 'Telugu'],
        availableToday: true,
      },
    ],
    dietPlan: {
      focus: 'Selenium, Zinc, Tyrosine, and Iodine rich foods with strict avoidance of raw goitrogens',
      morningEmptyStomach: {
        item: 'Thyronorm / Eltroxin with 1 Glass Warm Water',
        rationale: 'Thyroxine requires high gastric acidity for 100% absorption. Coffee, tea, calcium, or food taken within 45 minutes can reduce absorption by up to 50%.',
      },
      meals: [
        {
          meal: 'Breakfast',
          timing: '09:00 AM (45 mins after medicine)',
          items: ['2 Besan / Moong dal vegetable cheelas', 'Handful of roasted pumpkin seeds (Zinc) and 2 Brazil nuts or walnuts (Selenium)', '1 cup boiled egg or steamed paneer'],
          tips: 'Zinc and selenium act as enzymatic cofactors for the deiodinase enzyme that activates T4 to T3.',
        },
        {
          meal: 'Lunch',
          timing: '01:30 PM',
          items: ['1 cup brown rice or 2 Jowar rotis', '1 bowl Drumstick (Moringa) and tomato sambar / dal', 'Sautéed well-cooked Bhindi (okra) or bottle gourd', '1 cup curd seasoned with roasted jeera'],
          tips: 'Drumstick (Moringa) is an Indian superfood packed with bioavailable minerals that stimulate thyroid hormone synthesis.',
        },
        {
          meal: 'Evening Snack',
          timing: '05:30 PM',
          items: ['Handful of roasted sunflower seeds and almonds', 'Fresh tender coconut water', 'Herbal ginger-coriander seed tea'],
          tips: 'Coriander seed (dhaniya) water has been traditionally revered in Ayurveda for balancing thyroid swelling.',
        },
        {
          meal: 'Dinner',
          timing: '08:00 PM',
          items: ['Warm Moong dal vegetable soup with carrots and beans', '1 whole wheat phulka with cooked Lauki or grilled paneer', 'Small portion of boiled sweet potato'],
          tips: 'Always cook all cruciferous vegetables thoroughly to deactivate goitrogens.',
        },
      ],
      foodsToEat: [
        'Roasted pumpkin seeds (rich in Zinc), Walnuts & Brazil nuts (Selenium)',
        'Moringa (drumstick leaves and pods), fresh coconut, carrots',
        'Well-cooked eggs, paneer, and iodized sea/rock salt',
        'Coriander seed (dhaniya) water and ginger tea',
      ],
      foodsToStrictlyAvoid: [
        'RAW cruciferous vegetables: Raw cabbage, raw cauliflower, raw broccoli, raw radish',
        'Excessive unfermented soy products (soya chunks, soy milk)',
        'Gluten-heavy ultra-processed bakery biscuits and white breads',
        'Taking thyroid medication with tea, coffee, milk, or calcium tablets',
      ],
    },
    exercisePlan: {
      intensity: 'Neck-Stimulating Thyroid Yoga & Metabolism Boosting Cardio',
      frequency: '5 days per week, 30-40 minutes',
      keyPranayamas: [
        { name: 'Ujjayi Pranayama (Ocean Breath)', duration: '8 mins', benefits: 'Gentle throat constriction stimulates the thyroid gland reflex and warms the body.' },
        { name: 'Surya Bhedana Pranayama', duration: '5 mins', benefits: 'Activates solar pingala nadi, elevating low sluggish basal metabolic rate.' },
      ],
      recommendedAsanas: [
        { name: 'Sarvangasana', englishName: 'Shoulder Stand', action: 'Inverts blood flow to flood the thyroid and parathyroid glands with oxygenated blood.' },
        { name: 'Matsyasana', englishName: 'Fish Pose', action: 'Expands the cervical neck region, stretching thyroid follicles and relieving neck stiffness.' },
        { name: 'Halasana', englishName: 'Plow Pose', action: 'Compresses thyroid tissue to stimulate secretion upon release.' },
        { name: 'Bhujangasana', englishName: 'Cobra Pose', action: 'Arches the spine and opens the anterior neck and chest.' },
      ],
      dailyRoutine: [
        { activity: 'Thyroid Specific Yoga Asanas', duration: '20 mins', timing: '07:00 AM on empty stomach' },
        { activity: 'Brisk Cardio (Cycling or Fast Walk)', duration: '20 mins', timing: '05:30 PM to burn calories and boost energy' },
      ],
      precautions: [
        'If you have cervical spondylitis or high BP, avoid full Sarvangasana; substitute with gentle neck rotations and Setu Bandhasana (Bridge Pose).',
      ],
    },
  },
  {
    id: 'respiratory',
    name: 'Respiratory Diseases (Asthma, COPD & Pollution Wheezing)',
    hindiName: 'श्वसन रोग (अस्थमा, दमा, फेफड़ों की बीमारी)',
    tagline: 'Severe health crisis in India, driven by high AQI smog and bronchial hyper-reactivity',
    iconName: 'Wind',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    prevalenceInIndia: 'India accounts for roughly 42% of global asthma-related deaths despite having around 12% of the world’s asthma patients. Seasonal stubble burning, vehicular smog, industrial emissions, and temperature inversions during winter drive severe acute exacerbations.',
    rootCausesInIndia: [
      'Hazardous Air Pollution (PM2.5 & PM10): Toxic particulates trigger profound bronchial inflammation.',
      'Seasonal Inversion & Smog: Winter cold air traps ground pollutants, triggering airway spasms.',
      'Indoor Air Pollutants: Agarbatti (incense) smoke, mosquito coils, and cooking fumes from chulhas.',
      'Untreated Allergic Rhinitis: Progresses downward into bronchial hyperactivity and chronic wheezing.',
    ],
    keySymptoms: [
      'Audible wheezing or whistling sound in the chest during exhalation',
      'Persistent nighttime or early morning dry hacking cough',
      'Tight chest feeling like a heavy band is wrapped around the ribcage',
      'Breathlessness when walking in cold air or climbing a single flight of stairs',
      'Excess thick white or clear mucus clearing in the throat',
    ],
    idealLabTargets: [
      { test: 'Peak Expiratory Flow Rate (PEFR)', target: '> 80% of Personal Best', description: 'Monitored with a home peak flow meter before and after inhaler' },
      { test: 'Spirometry FEV1 / FVC Ratio', target: '> 0.75 (> 75%)', description: 'Gold standard test diagnosing airway obstruction and reversibility' },
      { test: 'Resting Pulse Oximetry (SpO2)', target: '96% - 99%', description: 'Blood oxygen saturation on room air' },
      { test: 'Absolute Eosinophil Count (AEC)', target: '< 350 cells/mcL', description: 'Elevated AEC indicates allergic / eosinophilic asthma' },
    ],
    tablets: [
      {
        brandName: 'Asthalin 100 mcg Inhaler',
        genericComposition: 'Salbutamol / Albuterol 100mcg (CFC-free)',
        manufacturer: 'Cipla Limited India',
        dosageForm: 'Inhaler (200 Metered Doses)',
        strength: '100mcg per puff',
        mrpInINR: 180,
        discountPriceInINR: 155,
        requiresPrescription: true,
        clinicalUse: 'Fast-acting rescue bronchodilator relaxing airway smooth muscles within 3 to 5 minutes',
        frequency: '1-2 puffs as needed for sudden wheezing',
        instructions: 'Shake well before puffing. Keep accessible at all times in case of sudden attack.',
      },
      {
        brandName: 'Budecort 200 Inhaler',
        genericComposition: 'Budesonide 200mcg',
        manufacturer: 'Cipla Limited India',
        dosageForm: 'Inhaler (200 Metered Doses)',
        strength: '200mcg',
        mrpInINR: 425,
        discountPriceInINR: 360,
        requiresPrescription: true,
        clinicalUse: 'Inhaled corticosteroid maintenance preventer reducing underlying airway swelling and mucus',
        frequency: '1-2 puffs twice daily (Morning & Night)',
        instructions: 'CRITICAL: Always rinse mouth and gargle with warm water after inhalation to prevent oral thrush/hoarseness.',
      },
      {
        brandName: 'Foracort 200 Inhaler',
        genericComposition: 'Formoterol 6mcg + Budesonide 200mcg',
        manufacturer: 'Cipla Limited India',
        dosageForm: 'Inhaler (120 Doses with Dose Counter)',
        strength: '6mcg / 200mcg',
        mrpInINR: 495,
        discountPriceInINR: 420,
        requiresPrescription: true,
        clinicalUse: 'LABA + Steroid combination delivering 12-hour continuous bronchodilation and anti-inflammatory control',
        frequency: '1 puff twice daily',
        instructions: 'Use spacer device if advised for maximum lung deposition.',
      },
      {
        brandName: 'Montair-LC Tablet',
        genericComposition: 'Montelukast 10mg + Levocetirizine 5mg',
        manufacturer: 'Cipla Limited India',
        dosageForm: 'Tablet (Strip of 10)',
        strength: '10mg / 5mg',
        mrpInINR: 210,
        discountPriceInINR: 178,
        requiresPrescription: true,
        clinicalUse: 'Dual leukotriene receptor blocker + antihistamine preventing nighttime allergic wheeze and cough',
        frequency: 'Once daily at night',
        instructions: 'Take after dinner before sleeping to prevent morning wheezing.',
      },
    ],
    doctors: [
      {
        name: 'Dr. Vivek Nangia',
        qualifications: 'MBBS, MD, DM (Pulmonary Medicine - AIIMS), FCCP (USA)',
        specialization: 'Director & Head of Pulmonology & Critical Care',
        hospital: 'Max Super Speciality Hospital, New Delhi',
        experienceYears: 26,
        feeInINR: 950,
        rating: 4.9,
        reviewCount: 380,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi'],
        availableToday: true,
      },
      {
        name: 'Dr. Preeti Deshmukh',
        qualifications: 'MBBS, MD (Chest Diseases & Pulmonology - KEM Mumbai)',
        specialization: 'Senior Pulmonologist, Asthma & COPD Specialist',
        hospital: 'Manipal Hospitals, Bengaluru & Mumbai',
        experienceYears: 17,
        feeInINR: 750,
        rating: 4.8,
        reviewCount: 240,
        avatar: 'https://images.unsplash.com/photo-1594824813571-638f026385a3?w=200&auto=format&fit=crop&q=80',
        languages: ['English', 'Hindi', 'Marathi'],
        availableToday: true,
      },
    ],
    dietPlan: {
      focus: 'Warm mucus-clearing spices, anti-inflammatory herbs (Tulsi, Haldi, Adrak), and avoiding cold foods',
      morningEmptyStomach: {
        item: 'Warm Herbal Kadha (Tulsi + Adrak + Kali Mirch + Honey)',
        rationale: 'Crush 5-6 fresh Tulsi leaves, 1 inch ginger, 2 black peppercorns, and 1 clove in 1.5 cups water. Boil down to 1 cup, strain, and add 1 tsp raw honey. Acts as a natural bronchodilator and immune enhancer.',
      },
      meals: [
        {
          meal: 'Breakfast',
          timing: '08:30 AM',
          items: ['Warm vegetable Dalia (broken wheat) or soft warm Idli with hot Sambar (with pinch of hing)', 'Warm ginger-lemon tea with a drop of honey', '4-5 soaked Munakka (black raisins)'],
          tips: 'Warm foods relax the bronchial tree; never drink ice-cold water or smoothies in the morning.',
        },
        {
          meal: 'Lunch',
          timing: '01:00 PM',
          items: ['2 warm whole wheat phulkas with a drop of pure desi ghee', '1 katori warm Moong/Masoor dal with cumin and garlic', 'Cooked Lauki or Torai sabzi with turmeric', 'Warm tomato-pepper Rasam soup'],
          tips: 'Turmeric (Curcumin) is a potent inhibitor of NF-kB, lowering airway inflammation.',
        },
        {
          meal: 'Evening Snack',
          timing: '05:00 PM',
          items: ['Roasted chana (gram) or warm roasted makhana', 'Warm Adrak-Tulsi tea', '1 small boiled egg or warm roasted peanuts'],
          tips: 'Avoid deep-fried samosas or cold refrigerated items.',
        },
        {
          meal: 'Dinner (Light)',
          timing: '07:30 PM',
          items: ['1 bowl warm vegetable lentil soup with black pepper', '1 soft phulka with cooked tender vegetables', 'No curd/yogurt or cold cucumber at night'],
          tips: 'Curd eaten at night can increase phlegm (Kapha dosha) and provoke midnight wheezing.',
        },
      ],
      foodsToEat: [
        'Fresh Tulsi, Ginger (Adrak), Black pepper, Cloves, Pure honey',
        'Warm Golden Turmeric Milk (Haldi doodh) with pinch of black pepper at bedtime',
        'Warm Rasam, garlic soups, stewed apples, soaked Munakka raisins',
        'Warm water sips throughout the day to liquefy bronchial mucus',
      ],
      foodsToStrictlyAvoid: [
        'Ice-cold drinks, refrigerated water, ice creams, chilled shakes',
        'Curd / yogurt / lassi taken after sunset or at dinner',
        'Foods containing artificial sulfites, food colors, and preservatives',
        'Deep-fried oily foods that cause gastric reflux (GERD triggers asthma cough)',
        'Direct exposure to agarbatti (incense) or mosquito coil smoke inside bedrooms',
      ],
    },
    exercisePlan: {
      intensity: 'Diaphragmatic Breathing, Airway Yoga & Indoor Aerobics',
      frequency: 'Daily 20-30 minutes; Avoid outdoor exercise during high AQI smog',
      keyPranayamas: [
        { name: 'Pursed-Lip Breathing Technique', duration: '5 mins (3-4 times daily)', benefits: 'Slows down breathing, keeps airways open longer, and expels trapped stale carbon dioxide.' },
        { name: 'Bhramari Pranayama (Humming Bee)', duration: '8 mins', benefits: 'Nasal vibration produces endogenous Nitric Oxide (NO), a natural bronchodilator.' },
        { name: 'Anulom Vilom (Gentle)', duration: '10 mins', benefits: 'Balances autonomic tone without hyperventilating lung alveoli.' },
      ],
      recommendedAsanas: [
        { name: 'Bhujangasana', englishName: 'Cobra Pose', action: 'Expands the anterior chest wall and opens bronchial airways for deeper tidal breathing.' },
        { name: 'Matsyasana', englishName: 'Fish Pose', action: 'Stretches the intercostal ribcage muscles and improves thoracic lung volume.' },
        { name: 'Ustrasana (Gentle)', englishName: 'Camel Pose', action: 'Full frontal chest expansion allowing deeper diaphragmatic descent.' },
        { name: 'Marjariasana', englishName: 'Cat-Cow Stretch', action: 'Synchronizes breathing with spinal mobilization.' },
      ],
      dailyRoutine: [
        { activity: 'Morning Breathing & Chest Yoga', duration: '20 mins', timing: '07:30 AM inside a clean, well-ventilated room' },
        { activity: 'Indoor Brisk Walking or Stationary Pedal', duration: '20 mins', timing: 'Late afternoon (avoid early morning cold fog)' },
      ],
      precautions: [
        'NEVER jog or exercise outdoors on days when the Air Quality Index (AQI) is above 150.',
        'Always take your prescribed preventer inhaler as directed, even on days you feel completely fine.',
        'Always keep your Asthalin rescue inhaler within arm’s reach during any exercise.',
      ],
    },
  },
];
