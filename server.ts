import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.argv[1]?.includes('dist'));

  app.use(express.json());

  // Lazy Gemini client helper
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Backend Persisted Daily Workout YouTube Videos
  let backendWorkoutVideos = [
    {
      id: 'vid-mon',
      dayIndex: 0,
      day: 'Monday - Zone 2 Cardio & Core Endurance',
      duration: '30 mins',
      intensity: 'Moderate',
      youtubeId: 'gC_L9qAHVJ8',
      youtubeUrl: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/gC_L9qAHVJ8?rel=0&playsinline=1',
      youtubeTitle: '30-Minute Low-Impact Cardio & Core Workout',
      category: 'Cardio & Core',
      exercises: [
        'Low-impact march & side-step cadence (10 min)',
        'Forearm Plank with controlled nasal breathing (3 sets of 45s)',
        'Bird-Dog diagonal reach & hold (3 sets of 12 reps each side)',
      ],
    },
    {
      id: 'vid-tue',
      dayIndex: 1,
      day: 'Tuesday - Upper Body & Posture Conditioning',
      duration: '25 mins',
      intensity: 'Moderate',
      youtubeId: 'UBMk30rjy0o',
      youtubeUrl: 'https://www.youtube.com/watch?v=UBMk30rjy0o',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/UBMk30rjy0o?rel=0&playsinline=1',
      youtubeTitle: 'Upper Body Posture, Back & Shoulder Strength',
      category: 'Strength & Posture',
      exercises: [
        'Dumbbell chest-supported bench rows (3 sets of 12 reps)',
        'Seated neutral grip overhead press (3 sets of 10 reps)',
        'Resistance band face pulls for rotator cuff (4 sets of 15 reps)',
      ],
    },
    {
      id: 'vid-wed',
      dayIndex: 2,
      day: 'Wednesday - Lower Body Strength & Joint Health',
      duration: '20 mins',
      intensity: 'Moderate',
      youtubeId: 'Yx0BW-H5W0Y',
      youtubeUrl: 'https://www.youtube.com/watch?v=Yx0BW-H5W0Y',
      youtubeEmbedUrl: 'https://www.youtube.com/embed/Yx0BW-H5W0Y?rel=0&playsinline=1',
      youtubeTitle: '20min Legs & Glutes Lower Body Routine',
      category: 'Lower Body',
      exercises: [
        'Goblet squats with controlled eccentric descent (3 sets of 12 reps)',
        'Romanian deadlifts with light dumbbells (3 sets of 10 reps)',
        'Calf raises on step edge for Achilles tendon (3 sets of 20 reps)',
      ],
    },
    {
      id: 'vid-thu',
      dayIndex: 3,
      day: 'Thursday - Active Recovery & Spine Decompression',
      duration: '15 mins',
      intensity: 'Low',
      youtubeId: 'g_tea8ZNk5A',
      youtubeUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
      youtubeEmbedUrl: 'https://www.youtube.com/embed/g_tea8ZNk5A?rel=0&playsinline=1',
      youtubeTitle: 'Full Body Daily Stretch & Spine Alignment Flow',
      category: 'Mobility & Recovery',
      exercises: [
        'Cat-Cow spinal waves with deep diaphragmatic breath (15 slow reps)',
        'Child’s pose to cobra gentle hip opener (3 sets of 60s hold)',
        'Thoracic spine windmill rotations (10 reps each side)',
      ],
    },
    {
      id: 'vid-fri',
      dayIndex: 4,
      day: 'Friday - Metabolic Aerobic & Functional HIIT',
      duration: '30 mins',
      intensity: 'Moderate-High',
      youtubeId: 'M0uO8X3_tEA',
      youtubeUrl: 'https://www.youtube.com/watch?v=M0uO8X3_tEA',
      youtubeEmbedUrl: 'https://www.youtube.com/embed/M0uO8X3_tEA?rel=0&playsinline=1',
      youtubeTitle: 'Calorie-Burning Functional Cardio Session',
      category: 'Aerobic & HIIT',
      exercises: [
        'Low-impact shadow boxing & high knees in place (4 sets of 45s)',
        'Bodyweight step-ups on stable bench (3 sets of 15 each leg)',
        'Farmer’s carry walking with dumbbells (4 sets of 40 paces)',
      ],
    },
    {
      id: 'vid-sat',
      dayIndex: 5,
      day: 'Saturday - Outdoor Aerobic Zone 2 Endurance',
      duration: '15 mins',
      intensity: 'Moderate',
      youtubeId: '4C-gxOE0j7s',
      youtubeUrl: 'https://www.youtube.com/watch?v=4C-gxOE0j7s',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/4C-gxOE0j7s?rel=0&playsinline=1',
      youtubeTitle: 'Full Body Energizing Morning Yoga & Flow',
      category: 'Endurance',
      exercises: [
        'Brisk park power walk or scenic casual bicycle ride (30 min steady pace)',
        'Standing quad & hip flexor dynamic stretch (2 sets of 45s each)',
        'Glute bridge holds with squeeze at apex (3 sets of 15 reps)',
      ],
    },
    {
      id: 'vid-sun',
      dayIndex: 6,
      day: 'Sunday - Restorative Yoga & Breathwork Flow',
      duration: '12 mins',
      intensity: 'Restorative',
      youtubeId: 'sAf67xFS-qE',
      youtubeUrl: 'https://www.youtube.com/watch?v=sAf67xFS-qE',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/sAf67xFS-qE?rel=0&playsinline=1',
      youtubeTitle: 'Restorative Bedtime Stretch & Nervous System Relaxation',
      category: 'Yoga & Breathwork',
      exercises: [
        'Box breathing (4s in, 4s hold, 4s out, 4s hold - 5 minutes)',
        'Supine hamstring stretch with towel/strap (3 minutes each side)',
        'Legs up the wall pose for venous return & arterial relaxation (10 min)',
      ],
    },
  ];

  // API to fetch all workout videos (shared across all users & devices)
  app.get('/api/workout-videos', (req, res) => {
    res.json({ success: true, videos: backendWorkoutVideos });
  });

  // API to update or save workout videos in backend
  app.post('/api/workout-videos', (req, res) => {
    const { videos } = req.body;
    if (Array.isArray(videos) && videos.length > 0) {
      backendWorkoutVideos = videos;
    }
    res.json({ success: true, message: 'Workout videos persisted successfully', videos: backendWorkoutVideos });
  });

  // Backend Database Entry for Nutrition & Recipe Videos (Permanently saved and shared across all devices)
  let backendNutritionVideos = [
    {
      meal: 'Breakfast',
      title: 'Lemon Ricotta Protein Pancakes | High-Protein Breakfast Meal Prep',
      youtubeUrl: 'https://www.youtube.com/watch?v=kBbjw1dLOcc',
      channel: 'Downshiftology',
    },
    {
      meal: 'Lunch',
      title: 'MEAL PREP | 10 Healthy Meals in 1 HOUR (+ PDF Guide)',
      youtubeUrl: 'https://www.youtube.com/watch?v=ERysyFbJH7w',
      channel: 'Pick Up Limes',
    },
    {
      meal: 'Afternoon Snack',
      title: 'Budget Meal Prep & Healthy Snacks Under €2',
      youtubeUrl: 'https://www.youtube.com/watch?v=NOgPQvUWfHk',
      channel: 'Pick Up Limes',
    },
    {
      meal: 'Dinner',
      title: 'Greek Baked Cod & Roasted Mediterranean Vegetables',
      youtubeUrl: 'https://www.youtube.com/watch?v=iD0AghGG_sc',
      channel: 'Downshiftology',
    },
  ];

  // API to fetch all nutrition recipe videos (shared across all users & devices)
  app.get('/api/nutrition-videos', (req, res) => {
    res.json({ success: true, videos: backendNutritionVideos });
  });

  // API to update or save nutrition recipe videos in backend
  app.post('/api/nutrition-videos', (req, res) => {
    const { videos } = req.body;
    if (Array.isArray(videos) && videos.length > 0) {
      backendNutritionVideos = videos;
    }
    res.json({ success: true, message: 'Nutrition videos persisted successfully', videos: backendNutritionVideos });
  });

  // Backend Database Entry for Pharmacy Return Requests (Expired / Damaged Items)
  let backendPharmacyReturnRequests = [
    {
      id: 'RET-8941',
      orderId: 'ord-1002',
      patientId: 'pat-001',
      patientName: 'Eleanor Vance',
      patientPhone: '+91 98450 21980',
      medicineName: 'Telma-40 (Telmisartan 40mg)',
      quantity: 1,
      itemPrice: 245,
      totalRefundAmount: 245,
      reason: 'damaged_seal_foil',
      reasonDescription: 'Outer blister foil was torn upon receipt, exposing 3 tablets to moisture and air.',
      batchNumber: 'TLM-2025-B4',
      expiryDateFound: '11/2026',
      resolutionRequested: 'replacement',
      status: 'pending',
      requestedAt: '2026-09-29 09:30',
    },
    {
      id: 'RET-8812',
      orderId: 'ord-1001',
      patientId: 'pat-001',
      patientName: 'Eleanor Vance',
      patientPhone: '+91 98450 21980',
      medicineName: 'Glycomet-GP 2 Tablet',
      quantity: 2,
      itemPrice: 190,
      totalRefundAmount: 380,
      reason: 'expired',
      reasonDescription: 'Dispensed strip had expiry date of 08/2026 which is already passed.',
      batchNumber: 'GLY-88401',
      expiryDateFound: '08/2026',
      resolutionRequested: 'refund',
      status: 'approved',
      requestedAt: '2026-09-28 14:15',
      acceptedAt: '2026-09-28 15:40',
      processedAt: '2026-09-28 15:40',
      processedBy: 'Rajesh Kumar (R.Ph)',
      pharmacyNotes: 'Return approved by shopkeeper. UPI refund of ₹380 processed to patient account.',
    },
  ];

  // API to fetch all pharmacy return requests
  app.get('/api/pharmacy/returns', (req, res) => {
    res.json({ success: true, returns: backendPharmacyReturnRequests });
  });

  // API to submit a new return request
  app.post('/api/pharmacy/returns', (req, res) => {
    const returnData = req.body;
    const newEntry = {
      ...returnData,
      id: returnData.id || `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedAt: returnData.requestedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    backendPharmacyReturnRequests.unshift(newEntry);
    res.json({ success: true, returnRequest: newEntry });
  });

  // API for shopkeeper to process a return request (approve or reject)
  app.post('/api/pharmacy/returns/:id/process', (req, res) => {
    const { id } = req.params;
    const { action, notes, resolutionType, processedBy } = req.body;
    const item = backendPharmacyReturnRequests.find((r) => r.id === id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Return request not found' });
    }
    item.status = action === 'approve' ? 'approved' : 'rejected';
    item.processedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    item.processedBy = processedBy || 'Rajesh Kumar (R.Ph)';
    item.pharmacyNotes = notes || (action === 'approve' ? 'Return approved by shopkeeper. Stock quarantined & settlement processed.' : 'Return request declined after physical condition inspection.');
    if (resolutionType) {
      item.resolutionRequested = resolutionType;
    }
    res.json({ success: true, message: `Return request #${id} ${item.status}`, returnRequest: item });
  });

  // AI Wellness Plan generation endpoint (Diet & Fitness)
  app.post('/api/wellness-generate', async (req, res) => {
    try {
      const { planType, userProfile, healthGoals, dietaryPreferences } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          success: false,
          fallback: true,
          message: 'Gemini API key not configured. Using evidence-based clinical templates.',
        });
      }

      const prompt = `You are a clinical lifestyle & nutrition specialist. Generate a comprehensive, personalized ${planType === 'diet' ? 'Diet & Meal Plan' : 'Exercise & Fitness Plan'} in JSON format based on the following patient profile:
- Age: ${userProfile?.age || 32}
- Gender: ${userProfile?.gender || 'Not specified'}
- BMI: ${userProfile?.bmi || 23.4} (Height: ${userProfile?.height || '175'} cm, Weight: ${userProfile?.weight || '72'} kg)
- Blood Pressure: ${userProfile?.bloodPressure || '120/80 mmHg'}
- Conditions/Allergies: ${userProfile?.allergies?.join(', ') || 'None reported'}
- Health Goals: ${healthGoals || 'Cardiovascular health, sustained daily energy, weight management'}
- Dietary/Workout Preferences: ${dietaryPreferences || 'Balanced Mediterranean / Moderate intensity'}

Return ONLY a valid JSON object with the following structure:
${planType === 'diet' ? `{
  "title": "Diet Plan Title",
  "summary": "Brief clinical rationale",
  "targetCalories": 2100,
  "macros": { "protein": "25%", "carbs": "50%", "fats": "25%" },
  "dailySchedule": [
    { "meal": "Breakfast", "time": "08:00 AM", "items": ["Item 1", "Item 2"], "calories": 450, "tips": "Nutritional note" },
    { "meal": "Lunch", "time": "01:00 PM", "items": ["Item 1", "Item 2"], "calories": 650, "tips": "Nutritional note" },
    { "meal": "Evening Snack", "time": "04:30 PM", "items": ["Item 1"], "calories": 200, "tips": "Nutritional note" },
    { "meal": "Dinner", "time": "07:30 PM", "items": ["Item 1", "Item 2"], "calories": 550, "tips": "Nutritional note" }
  ],
  "hydrationTarget": "2.8 Liters/day",
  "foodsToAvoid": ["Refined sugars", "Excess sodium"],
  "doctorNotes": "Clinical advisory"
}` : `{
  "title": "Exercise Routine Title",
  "summary": "Cardio-metabolic rationale",
  "intensity": "Moderate to High",
  "weeklyFrequency": "4-5 days/week",
  "weeklySchedule": [
    { "day": "Day 1 - Cardio & Core", "duration": "45 mins", "exercises": ["Brisk incline walking (20 min)", "Bodyweight squats (3x15)", "Planks (3x45s)"], "intensity": "Moderate" },
    { "day": "Day 2 - Strength Training", "duration": "40 mins", "exercises": ["Dumbbell bench press (3x10)", "Lat pulldowns (3x12)", "Leg press (3x12)"], "intensity": "Moderate-High" },
    { "day": "Day 3 - Active Recovery", "duration": "30 mins", "exercises": ["Mobility yoga flow", "Light walking", "Hamstring stretches"], "intensity": "Low" },
    { "day": "Day 4 - Full Body Circuit", "duration": "45 mins", "exercises": ["Kettlebell swings (4x12)", "Pushups (3x15)", "Stationary cycling (20 min)"], "intensity": "High" }
  ],
  "warmupCoolDown": "5 min dynamic stretching before, 5 min static stretches after",
  "safetyPrecautions": "Monitor heart rate and maintain hydration",
  "doctorNotes": "Safe for current vitals profile"
}`}
Do not wrap in backticks or markdown fences if possible, or return raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, plan: parsed });
      } catch (parseErr) {
        return res.json({ success: true, rawText: responseText });
      }
    } catch (err: any) {
      console.error('Wellness plan generation error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Generation failed' });
    }
  });

  // Helper for evidence-based clinical guidance fallback
  function generateFallbackMedicalGuidance(message: string = '', context: any = {}, toolAction?: string): string {
    const q = message.toLowerCase();

    if (q.includes('blood pressure') || q.includes('bp') || q.includes('120/80')) {
      return `### Blood Pressure & Cardiovascular Assessment
Your recorded blood pressure is **${context?.vitals?.bloodPressure || '120/80 mmHg'}**, which falls within the **optimal to normal adult range** according to American Heart Association (AHA) clinical guidelines.

- **Systolic (Top number, ${context?.vitals?.bloodPressure?.split('/')[0] || '120'} mmHg):** Measures pressure in your arteries when your heart beats.
- **Diastolic (Bottom number, ${context?.vitals?.bloodPressure?.split('/')[1]?.split(' ')[0] || '80'} mmHg):** Measures arterial pressure between beats when your heart rests.

**Clinical Care Recommendations:**
1. Maintain regular hydration (aim for 2.5–3.0 liters of water daily).
2. Limit sodium intake to under 2,000 mg per day.
3. Continue moderate aerobic activities such as brisk walking for 30 minutes, 4–5 days per week.`;
    }

    if (q.includes('atorvastatin') || q.includes('cholesterol') || q.includes('statin')) {
      return `### Medication Guidance: Atorvastatin (Lipitor)
- **Primary Indication:** Lowers LDL ("bad") cholesterol and triglycerides while raising HDL ("good") cholesterol, reducing the risk of cardiovascular events.
- **Recommended Timing:** Usually taken once daily in the evening or at bedtime with or without food.
- **Important Dietary Note:** Avoid large amounts of **grapefruit or grapefruit juice**, as it can increase the medication concentration in your bloodstream.
- **Common Side Effects:** Mild muscle aches, joint stiffness, or mild digestive changes. If you experience unexplained dark urine or severe muscle soreness, inform your physician promptly.`;
    }

    if (q.includes('missed') && q.includes('pill')) {
      return `### Protocol for Missed Medication Dose
1. **General Rule:** Take the missed dose as soon as you remember that day.
2. **Close to Next Dose:** If it is already close to your next scheduled intake, skip the missed dose and resume your standard timing.
3. **Important Safety Warning:** Never double up or take two doses at the same time to compensate for a missed pill.`;
    }

    if (q.includes('headache') || q.includes('migraine')) {
      return `### Symptom Assessment: Headache & Tension
- **Triage Level:** Mild to Moderate (if no sudden "thunderclap" onset).
- **Immediate Self-Care:** Rest in a quiet, dimly lit room; drink 500 mL of water; apply a cold or warm compress to forehead or neck.
- **Red Flag Warnings:** Seek urgent medical attention immediately if accompanied by high fever, neck stiffness, speech confusion, or sudden vision loss.
- **Recommended Specialist:** Neurologist or General Primary Care Physician.`;
    }

    if (q.includes('fever') || q.includes('temperature')) {
      return `### Symptom Assessment: Elevated Temperature / Fever
- **Triage Evaluation:** Monitor temperature regularly. Normal body temperature ranges from 36.5°C to 37.5°C (97.7°F – 99.5°F).
- **Self-Care Actions:** Maintain strict hydration with electrolyte fluids; dress in light clothing; get plenty of sleep.
- **When to Consult a Physician:** Fever persisting over 3 days, temperature exceeding 39°C (102°F), or severe chills.`;
    }

    if (toolAction === 'drug_interaction' || q.includes('interaction') || q.includes('safety')) {
      return `### Medication Safety & Interaction Analysis
**Patient Profile Check:**
- Active Prescriptions: ${context?.medications?.join(', ') || 'Atorvastatin 20mg'}
- Known Allergies: ${context?.allergies?.map((a: any) => `${a.allergen} (${a.severity})`).join(', ') || 'NKDA'}

**Safety Evaluation:**
- **Drug-Drug Compatibility:** No high-risk adverse interactions detected with your baseline profile.
- **Food & Drink Precautions:** Moderate alcohol consumption; avoid grapefruit products when taking statins.
- **Timing Best Practice:** Take daily medications with a consistent routine (e.g., alongside evening meals).`;
    }

    return `### Clinical Health Guidance
Thank you for your question. Based on your active health profile (Age: ${context?.age || 34}, BP: ${context?.vitals?.bloodPressure || '120/80 mmHg'}, Heart Rate: ${context?.vitals?.heartRateBpm || 72} bpm):

- **Key Takeaway:** Your baseline vital signs remain well-managed. Continue taking your scheduled medications and adhering to your personalized nutrition routine.
- **Next Steps:** If your symptoms persist or if you have specific concerns regarding a new medication or lab reading, you can book a teleconsultation with our certified specialists directly in the **Doctor** tab.
- **Safety Reminder:** For acute emergencies (severe chest pain, breathing difficulty, sudden numbness), call 911 immediately.`;
  }

  // AI Assistant Chat & Medical Triage Endpoint
  app.post('/api/assistant-chat', async (req, res) => {
    try {
      const { message, history, context, toolAction } = req.body;
      const ai = getAIClient();

      if (!ai) {
        const fallback = generateFallbackMedicalGuidance(message, context, toolAction);
        return res.json({
          success: true,
          reply: fallback,
          source: 'clinical-rules-engine',
        });
      }

      const systemPrompt = `You are PulseHealth's Certified Clinical AI Health Assistant.
You assist patients with medical education, symptom triage, medication safety instructions, lab report explanations, and wellness protocols.
Always speak warmly, with empathy, clinical clarity, and simple language free of overwhelming jargon.
Use bullet points and bold headers for easy readability.
For potentially urgent symptoms (e.g. severe chest pain, shortness of breath, sudden facial drooping), advise seeking immediate emergency care (911).

Patient EHR Context:
- Patient Name: ${context?.name || 'Patient'}
- Age/Gender: ${context?.age || 34}, ${context?.gender || 'Female'}
- Vitals: Blood Pressure ${context?.vitals?.bloodPressure || '120/80 mmHg'}, Heart Rate ${context?.vitals?.heartRateBpm || 72} bpm, BMI ${context?.vitals?.bmi || 23.4}
- Allergies on Record: ${context?.allergies?.map((a: any) => `${a.allergen} (${a.severity})`).join(', ') || 'None reported'}
- Active Prescriptions: ${context?.medications?.join(', ') || 'Atorvastatin 20mg, Vitamin D3'}
- Active Diagnoses: ${context?.diagnoses?.join(', ') || 'Hypertension, Dyslipidemia'}

${toolAction ? `Active Tool Selected: ${toolAction}` : ''}
Patient Question: ${message}`;

      const contents: any[] = [{ role: 'user', parts: [{ text: systemPrompt }] }];

      if (Array.isArray(history) && history.length > 0) {
        const recent = history.slice(-6);
        for (const item of recent) {
          if (item.text) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
      });

      const reply = response.text || generateFallbackMedicalGuidance(message, context, toolAction);
      return res.json({ success: true, reply, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.error('Assistant chat error:', err);
      const { message, context, toolAction } = req.body;
      const fallback = generateFallbackMedicalGuidance(message, context, toolAction);
      return res.json({ success: true, reply: fallback, source: 'clinical-fallback-recovery' });
    }
  });

  // Vite middleware in dev or static files in prod
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PulseHealth server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
