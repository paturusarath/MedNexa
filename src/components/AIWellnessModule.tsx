import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  Dumbbell,
  Sparkles,
  Flame,
  Droplets,
  Heart,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Calendar,
  RotateCw,
  Apple,
  Fish,
  Coffee,
  Sun,
  Moon,
  Footprints,
  TrendingUp,
  Shield,
  ShieldAlert,
  Info,
  Timer,
  Zap,
  Play,
  Video,
  Film,
  ExternalLink,
  X,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { WellnessPlan } from '../types';

const DEFAULT_7_DAY_SCHEDULE = [
  {
    day: 'Monday - Zone 2 Cardio & Core Endurance',
    duration: '30 mins',
    intensity: 'Moderate',
    youtubeUrl: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
    youtubeTitle: '30-Minute Low-Impact Cardio & Core Workout',
    exercises: [
      'Low-impact march & side-step cadence (10 min)',
      'Forearm Plank with controlled nasal breathing (3 sets of 45s)',
      'Bird-Dog diagonal reach & hold (3 sets of 12 reps each side)',
    ],
  },
  {
    day: 'Tuesday - Upper Body & Posture Conditioning',
    duration: '25 mins',
    intensity: 'Moderate',
    youtubeUrl: 'https://www.youtube.com/watch?v=UBMk30rjy0o',
    youtubeTitle: 'Upper Body Posture, Back & Shoulder Strength',
    exercises: [
      'Dumbbell chest-supported bench rows (3 sets of 12 reps)',
      'Seated neutral grip overhead press (3 sets of 10 reps)',
      'Resistance band face pulls for rotator cuff (4 sets of 15 reps)',
    ],
  },
  {
    day: 'Wednesday - Lower Body Strength & Joint Health',
    duration: '20 mins',
    intensity: 'Moderate',
    youtubeUrl: 'https://www.youtube.com/watch?v=kzdvdn_U7yY',
    youtubeTitle: 'Joint-Friendly Lower Body & Brisk Walking Cardio',
    exercises: [
      'Goblet squats with controlled eccentric descent (3 sets of 12 reps)',
      'Romanian deadlifts with light dumbbells (3 sets of 10 reps)',
      'Calf raises on step edge for Achilles tendon (3 sets of 20 reps)',
    ],
  },
  {
    day: 'Thursday - Active Recovery & Spine Decompression',
    duration: '15 mins',
    intensity: 'Low',
    youtubeUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
    youtubeTitle: 'Full Body Daily Stretch & Spine Alignment Flow',
    exercises: [
      'Cat-Cow spinal waves with deep diaphragmatic breath (15 slow reps)',
      'Child’s pose to cobra gentle hip opener (3 sets of 60s hold)',
      'Thoracic spine windmill rotations (10 reps each side)',
    ],
  },
  {
    day: 'Friday - Metabolic Aerobic & Functional HIIT',
    duration: '30 mins',
    intensity: 'Moderate-High',
    youtubeUrl: 'https://www.youtube.com/watch?v=M0uO8X3_tEA',
    youtubeTitle: 'Calorie-Burning Functional Cardio Session',
    exercises: [
      'Low-impact shadow boxing & high knees in place (4 sets of 45s)',
      'Bodyweight step-ups on stable bench (3 sets of 15 each leg)',
      'Farmer’s carry walking with dumbbells (4 sets of 40 paces)',
    ],
  },
  {
    day: 'Saturday - Outdoor Aerobic Zone 2 Endurance',
    duration: '15 mins',
    intensity: 'Moderate',
    youtubeUrl: 'https://www.youtube.com/watch?v=4C-gxOE0j7s',
    youtubeTitle: 'Full Body Energizing Morning Yoga & Flow',
    exercises: [
      'Brisk park power walk or scenic casual bicycle ride (30 min steady pace)',
      'Standing quad & hip flexor dynamic stretch (2 sets of 45s each)',
      'Glute bridge holds with squeeze at apex (3 sets of 15 reps)',
    ],
  },
  {
    day: 'Sunday - Restorative Yoga & Breathwork Flow',
    duration: '12 mins',
    intensity: 'Restorative',
    youtubeUrl: 'https://www.youtube.com/watch?v=sAf67xFS-qE',
    youtubeTitle: 'Restorative Bedtime Stretch & Nervous System Relaxation',
    exercises: [
      'Box breathing (4s in, 4s hold, 4s out, 4s hold - 5 minutes)',
      'Supine hamstring stretch with towel/strap (3 minutes each side)',
      'Legs up the wall pose for venous return & arterial relaxation (10 min)',
    ],
  },
];

const DEFAULT_7_DAY_DIET_SCHEDULE = [
  {
    day: 'Monday - High-Protein Energizing Kickstart',
    focus: 'Lean Protein & Anti-inflammatory Greens',
    targetCalories: 2050,
    macros: { protein: '25%', carbs: '45%', fats: '30%' },
    hydrationTarget: '2.8 Liters/day',
    meals: [
      {
        meal: 'Breakfast',
        time: '08:00 AM',
        calories: 420,
        image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&auto=format&fit=crop&q=80',
        items: ['Lemon ricotta protein pancakes with blueberries', 'Greek yogurt (0% fat)', 'Green tea with lemon slice'],
        tips: 'Rich in soluble beta-glucan fiber and leucine for muscle preservation and cholesterol control.',
        youtubeUrl: 'https://www.youtube.com/watch?v=kBbjw1dLOcc',
        youtubeTitle: 'Lemon Ricotta Protein Pancakes',
      },
      {
        meal: 'Lunch',
        time: '01:00 PM',
        calories: 620,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
        items: ['Grilled wild salmon over baby spinach & quinoa salad', 'Extra virgin olive oil & lemon vinaigrette', 'Steamed asparagus spears'],
        tips: 'High in bioavailable Omega-3 EPA/DHA to combat vascular inflammation and arterial stiffness.',
        youtubeUrl: 'https://www.youtube.com/watch?v=ERysyFbJH7w',
        youtubeTitle: '10 Healthy Meals in 1 Hour Prep',
      },
      {
        meal: 'Afternoon Snack',
        time: '04:30 PM',
        calories: 210,
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80',
        items: ['Handful of raw almonds (15 pcs)', '1 Sliced crisp organic Honeycrisp apple'],
        tips: 'Polyphenols and dietary fiber maintain sustained glycemic index without insulin spikes.',
        youtubeUrl: 'https://www.youtube.com/watch?v=NOgPQvUWfHk',
        youtubeTitle: 'Budget Healthy Snacks & Energy Bites',
      },
      {
        meal: 'Dinner',
        time: '07:30 PM',
        calories: 540,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        items: ['Greek baked cod with garlic & fresh herbs', 'Brown jasmine rice (1/2 cup)', 'Roasted zucchini & cherry tomato medley'],
        tips: 'Lean white fish protein is easily digested for nocturnal metabolic rest and recovery.',
        youtubeUrl: 'https://www.youtube.com/watch?v=iD0AghGG_sc',
        youtubeTitle: 'Greek Baked Cod & Roasted Vegetables',
      },
    ],
  },
  {
    day: 'Tuesday - Heart-Healthy Mediterranean Harvest',
    focus: 'Monounsaturated Fats & Antioxidants',
    targetCalories: 2000,
    macros: { protein: '24%', carbs: '46%', fats: '30%' },
    hydrationTarget: '2.7 Liters/day',
    meals: [
      {
        meal: 'Breakfast',
        time: '08:00 AM',
        calories: 440,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
        items: ['Smashed Hass avocado on toasted whole grain sourdough', '2 Soft-poached cage-free eggs', 'Himalayan pink salt & red pepper flakes'],
        tips: 'Oleic acid and lutein support endothelial lining health and ocular longevity.',
        youtubeUrl: 'https://www.youtube.com/watch?v=ESKcDFjTLoM',
        youtubeTitle: 'Poached Eggs & Healthy Avocado Toast',
      },
      {
        meal: 'Lunch',
        time: '01:00 PM',
        calories: 590,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
        items: ['Mediterranean chickpea, cucumber & Kalamata olive bowl', 'Crumbled goat feta cheese (30g)', 'Warm whole wheat pita wedges with tahini'],
        tips: 'Rich in dietary potassium and resistant starches which nurture healthy gut microbiome.',
        youtubeUrl: 'https://www.youtube.com/watch?v=uEqv98IOrHw',
        youtubeTitle: 'Mediterranean Chickpea & Grain Bowl',
      },
      {
        meal: 'Afternoon Snack',
        time: '04:30 PM',
        calories: 190,
        image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
        items: ['Lightly roasted walnuts (12 halves)', 'Cup of warm unsweetened chamomile tea'],
        tips: 'Alpha-linolenic acid (ALA) in walnuts supports cerebrovascular perfusion.',
        youtubeUrl: 'https://www.youtube.com/watch?v=lQU8pi0COAs',
        youtubeTitle: 'Easy Healthy Roasted Snacks',
      },
      {
        meal: 'Dinner',
        time: '07:30 PM',
        calories: 560,
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
        items: ['Herbed lemon grilled chicken breast (180g)', 'Oven-roasted sweet potato cubes with rosemary', 'Steamed green beans with toasted sesame'],
        tips: 'Complex carbohydrates replenish depleted liver glycogen stores without nocturnal insulin surges.',
        youtubeUrl: 'https://www.youtube.com/watch?v=wiqjtX6kKUQ',
        youtubeTitle: 'High Protein Lemon Chicken & Sweet Potato',
      },
    ],
  },
  {
    day: 'Wednesday - Plant-Powered Fiber & Gut Restoration',
    focus: 'Prebiotics, Soluble Fiber & Plant Sterols',
    targetCalories: 2100,
    macros: { protein: '22%', carbs: '50%', fats: '28%' },
    hydrationTarget: '3.0 Liters/day',
    meals: [
      {
        meal: 'Breakfast',
        time: '08:00 AM',
        calories: 410,
        image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&auto=format&fit=crop&q=80',
        items: ['Steel-cut oats slow cooked with chia seeds & Ceylon cinnamon', 'Handful of fresh organic raspberries', '1 Spoonful of organic almond butter'],
        tips: '14g of prebiotic fiber feeds Bifidobacteria, aiding short-chain fatty acid (SCFA) synthesis.',
        youtubeUrl: 'https://www.youtube.com/watch?v=eG0nCX1coFU',
        youtubeTitle: 'Healthy Superfood Oatmeal & Chia Prep',
      },
      {
        meal: 'Lunch',
        time: '01:00 PM',
        calories: 630,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
        items: ['Slow-simmered red lentil & baby spinach dal', 'Organic brown basmati rice (3/4 cup)', 'Fresh cucumber tomato mint kachumber'],
        tips: 'Curcumin combined with lentil zinc accelerates soft-tissue anti-inflammatory pathways.',
        youtubeUrl: 'https://www.youtube.com/watch?v=ERysyFbJH7w',
        youtubeTitle: 'Nutritious Red Lentil & Spinach Stew',
      },
      {
        meal: 'Afternoon Snack',
        time: '04:30 PM',
        calories: 220,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        items: ['Creamy roasted red pepper hummus (3 tbsp)', 'Sliced rainbow bell peppers, celery & baby carrots'],
        tips: 'Carotenoids and vitamin C strengthen microvascular capillary integrity.',
        youtubeUrl: 'https://www.youtube.com/watch?v=UwSSdtdPTSA',
        youtubeTitle: 'Fresh Veggies & Homemade Creamy Hummus',
      },
      {
        meal: 'Dinner',
        time: '07:30 PM',
        calories: 550,
        image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
        items: ['Baked bell peppers stuffed with black beans, corn & tricolor quinoa', 'Sliced ripe Hass avocado (1/4 fruit)', 'Fresh lime and cilantro drizzle'],
        tips: 'Magnesium-dense black beans and avocado help relax smooth arterial muscle tissue.',
        youtubeUrl: 'https://www.youtube.com/watch?v=bfa9DEe5akU',
        youtubeTitle: 'Healthy Stuffed Quinoa & Black Bean Peppers',
      },
    ],
  },
  {
    day: 'Thursday - Clean Lean Fuel & Cellular Repair',
    focus: 'Amino Acid Matrix & Microvascular Protection',
    targetCalories: 2020,
    macros: { protein: '28%', carbs: '42%', fats: '30%' },
    hydrationTarget: '2.8 Liters/day',
    meals: [
      {
        meal: 'Breakfast',
        time: '08:00 AM',
        calories: 390,
        image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format&fit=crop&q=80',
        items: ['Spinach, mushroom & egg white frittata', 'Slice of toasted multi-grain sprouted bread', '1 Fresh navel orange'],
        tips: 'Choline from pasture-raised eggs assists healthy liver lipid clearance and homocysteine balance.',
        youtubeUrl: 'https://www.youtube.com/watch?v=8CqwjlaKqns',
        youtubeTitle: 'Quick Spinach & Vegetable Frittata',
      },
      {
        meal: 'Lunch',
        time: '01:00 PM',
        calories: 610,
        image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&auto=format&fit=crop&q=80',
        items: ['Herb-roasted turkey breast medallions (160g)', 'Steamed farro & baby kale salad with pomegranate seeds', 'Walnut oil and balsamic glaze'],
        tips: 'Tryptophan and high bioavailable protein support daytime neurotransmitter balance.',
        youtubeUrl: 'https://www.youtube.com/watch?v=wiqjtX6kKUQ',
        youtubeTitle: 'High Protein Roasted Turkey & Ancient Grains',
      },
      {
        meal: 'Afternoon Snack',
        time: '04:30 PM',
        calories: 240,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
        items: ['Plain Icelandic skyr or Greek yogurt (1 cup)', 'Organic wild blueberries & chia seed sprinkle'],
        tips: 'Anthocyanins from wild blueberries provide powerful nitric oxide vasodilation protection.',
        youtubeUrl: 'https://www.youtube.com/watch?v=NOgPQvUWfHk',
        youtubeTitle: 'High-Protein Skyr Parfait & Berries',
      },
      {
        meal: 'Dinner',
        time: '07:30 PM',
        calories: 530,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
        items: ['Pan-seared rainbow trout or wild salmon fillet', 'Charred lemon broccolini with garlic flakes', 'Steamed wild grain pilaf (1/2 cup)'],
        tips: 'Natural astaxanthin in pink fish functions as a deep cellular lipid membrane antioxidant.',
        youtubeUrl: 'https://www.youtube.com/watch?v=iD0AghGG_sc',
        youtubeTitle: 'Crispy Pan-Seared Trout with Garlic Broccolini',
      },
    ],
  },
  {
    day: 'Friday - Metabolic Reset & Vibrant Greens',
    focus: 'Sulfur-Rich Cruciferous & Electrolyte Balance',
    targetCalories: 2080,
    macros: { protein: '25%', carbs: '45%', fats: '30%' },
    hydrationTarget: '2.9 Liters/day',
    meals: [
      {
        meal: 'Breakfast',
        time: '08:00 AM',
        calories: 400,
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80',
        items: ['Creamy matcha & spinach superfood smoothie bowl', 'Topped with golden kiwi, hemp hearts & shredded coconut', 'Unsweetened green tea'],
        tips: 'EGCG catechins promote peripheral fat oxidation and endothelial elasticity.',
        youtubeUrl: 'https://www.youtube.com/watch?v=wiqjtX6kKUQ',
        youtubeTitle: 'Vibrant Green Superfood Smoothie Bowl',
      },
      {
        meal: 'Lunch',
        time: '01:00 PM',
        calories: 600,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        items: ['Crispy organic pan-tossed tofu cubes (150g)', 'Japanese buckwheat soba noodles with shredded red cabbage', 'Sesame ginger tamari dressing'],
        tips: 'Isoflavones and buckwheat rutin strengthen capillary walls against micro-tears.',
        youtubeUrl: 'https://www.youtube.com/watch?v=uEqv98IOrHw',
        youtubeTitle: 'Sesame Ginger Tofu & Buckwheat Soba',
      },
      {
        meal: 'Afternoon Snack',
        time: '04:30 PM',
        calories: 210,
        image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
        items: ['Roasted pepitas (pumpkin seeds) with sea salt (30g)', '1 Square 85% dark organic dark chocolate'],
        tips: 'High zinc and cocoa flavanols stimulate nitric oxide production in arterial walls.',
        youtubeUrl: 'https://www.youtube.com/watch?v=lQU8pi0COAs',
        youtubeTitle: 'Healthy Dark Chocolate & Seed Bites',
      },
      {
        meal: 'Dinner',
        time: '07:30 PM',
        calories: 520,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
        items: ['Hearty Tuscan white bean & vegetable minestrone soup', 'Artisan whole wheat seeded sourdough toast (1 slice)', 'Drizzle of cold-pressed extra virgin olive oil'],
        tips: 'Slow-simmered lycopene in cooked tomatoes provides profound cardiovascular protection.',
        youtubeUrl: 'https://www.youtube.com/watch?v=C-PfiXkydl8',
        youtubeTitle: 'Tuscan White Bean & Vegetable Minestrone',
      },
    ],
  },
  {
    day: 'Saturday - Weekend Vitality & Lean Grilling',
    focus: 'Outdoor Lean Grilling & Colorful Phyto-Nutrients',
    targetCalories: 2150,
    macros: { protein: '26%', carbs: '44%', fats: '30%' },
    hydrationTarget: '3.0 Liters/day',
    meals: [
      {
        meal: 'Breakfast',
        time: '08:30 AM',
        calories: 460,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
        items: ['Warm sprouted corn tortillas with 2 sunny-side eggs', 'Fresh tomato jalapeño pico de gallo', 'Refried organic pinto beans (light olive oil)'],
        tips: 'High bioavailable lutein and capsaicin boost morning metabolic basal expenditure.',
        youtubeUrl: 'https://www.youtube.com/watch?v=ESKcDFjTLoM',
        youtubeTitle: 'Weekend Healthy Mexican Breakfast Rancheros',
      },
      {
        meal: 'Lunch',
        time: '01:30 PM',
        calories: 580,
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
        items: ['Char-grilled eggplant, zucchini & sweet bell pepper whole wheat wrap', 'Organic soft goat cheese & basil pesto spread', 'Side mixed green salad'],
        tips: 'Dietary anthocyanins from eggplant skin provide cardioprotective phenolic acids.',
        youtubeUrl: 'https://www.youtube.com/watch?v=ERysyFbJH7w',
        youtubeTitle: 'Grilled Mediterranean Veggie Wraps',
      },
      {
        meal: 'Afternoon Snack',
        time: '04:30 PM',
        calories: 180,
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
        items: ['Fresh watermelon cubes with lime & fresh mint', 'Electrolyte-rich pure coconut water (200ml)'],
        tips: 'Citrulline in watermelon directly supports systemic arterial dilation and blood flow.',
        youtubeUrl: 'https://www.youtube.com/watch?v=UwSSdtdPTSA',
        youtubeTitle: 'Hydrating Electrolyte Fruit Bowls',
      },
      {
        meal: 'Dinner',
        time: '07:30 PM',
        calories: 570,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
        items: ['Rosemary garlic chicken & vegetable skewers (2 skewers, 190g chicken)', 'Mediterranean pearl couscous with pine nuts', 'Cucumber yogurt tzatziki sauce'],
        tips: 'High branch-chain amino acids (BCAAs) with probiotic tzatziki for weekend recovery.',
        youtubeUrl: 'https://www.youtube.com/watch?v=wiqjtX6kKUQ',
        youtubeTitle: 'Healthy Grilled Herb Chicken Skewers',
      },
    ],
  },
  {
    day: 'Sunday - Restorative Digestion & Weekly Meal Prep Flow',
    focus: 'Easy-to-Digest Comfort & Anti-Inflammatory Spices',
    targetCalories: 1980,
    macros: { protein: '24%', carbs: '46%', fats: '30%' },
    hydrationTarget: '2.8 Liters/day',
    meals: [
      {
        meal: 'Breakfast',
        time: '08:30 AM',
        calories: 430,
        image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&auto=format&fit=crop&q=80',
        items: ['Golden turmeric & cardamon rolled oats with grated honeycrisp apple', 'Crushed toasted walnuts & pumpkin seed garnish', 'Warm golden milk (almond milk base)'],
        tips: 'Turmeric curcumin and piperine calm gastrointestinal mucosa before the new work week.',
        youtubeUrl: 'https://www.youtube.com/watch?v=eG0nCX1coFU',
        youtubeTitle: 'Warm Golden Turmeric Spiced Oatmeal',
      },
      {
        meal: 'Lunch',
        time: '01:00 PM',
        calories: 610,
        image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
        items: ['Roasted butternut squash & wild rice grain bowl', 'Steamed French lentils & tender baby arugula', 'Tahini lemon maple drizzle with pomegranate jewels'],
        tips: 'Beta-carotene and folate ensure healthy red blood cell production and homocysteine clearance.',
        youtubeUrl: 'https://www.youtube.com/watch?v=uEqv98IOrHw',
        youtubeTitle: 'Butternut Squash & Wild Rice Meal Prep',
      },
      {
        meal: 'Afternoon Snack',
        time: '04:30 PM',
        calories: 200,
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80',
        items: ['Organic celery sticks with creamy almond butter (2 tbsp)', 'Light pinch of coarse sea salt & raw cacao nibs'],
        tips: 'Phthalides in fresh celery aid in relaxing vascular muscles surrounding arteries.',
        youtubeUrl: 'https://www.youtube.com/watch?v=NOgPQvUWfHk',
        youtubeTitle: 'Crisp Celery & Almond Butter Energy Sticks',
      },
      {
        meal: 'Dinner',
        time: '07:00 PM',
        calories: 520,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
        items: ['Lean turkey sausage & Tuscan curly kale soup with sweet potato cubes', 'Artisan whole rye bread slice', 'Herbal ginger mint tea'],
        tips: 'Light, warm soup eases digestion and stabilizes cortisol for deep, restorative REM sleep.',
        youtubeUrl: 'https://www.youtube.com/watch?v=Joxg3-wz3sE',
        youtubeTitle: 'Healthy Zuppa Toscana with Kale & Sweet Potato',
      },
    ],
  },
];

export const AIWellnessModule: React.FC = () => {
  const { wellnessPlans, vitals, allergies } = useHealth();

  const [activeTab, setActiveTab] = useState<'diet' | 'exercise'>('diet');

  // Interactive completed tracking states for daily motivation
  const [completedMeals, setCompletedMeals] = useState<string[]>(['0-Breakfast']);
  const [completedExercises, setCompletedExercises] = useState<string[]>([
    'Treadmill Incline 6% at 3.6 mph (20 min)',
  ]);
  const [loggedGlasses, setLoggedGlasses] = useState<number>(7);

  // Today's day of the week calculation (Monday = 0, ..., Sunday = 6)
  const todayDayIndex = (new Date().getDay() + 6) % 7;
  const todayWeekdayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  // Automatically show today's workout and diet on load
  const [activeDayTab, setActiveDayTab] = useState<number>(todayDayIndex);
  const [activeDietDayTab, setActiveDietDayTab] = useState<number>(todayDayIndex);

  // Modals for Workout YouTube Video
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    url: string;
    day: string;
  } | null>(null);

  // Custom Nutrition & Recipe YouTube Videos Map (Backed by /api/nutrition-videos)
  const [customMealVideos, setCustomMealVideos] = useState<Record<string, { title: string; url: string }>>({
    'Breakfast': {
      title: 'Lemon Ricotta Protein Pancakes | High-Protein Breakfast Meal Prep',
      url: 'https://www.youtube.com/watch?v=kBbjw1dLOcc',
    },
    'Lunch': {
      title: 'MEAL PREP | 10 Healthy Meals in 1 HOUR (+ PDF Guide)',
      url: 'https://www.youtube.com/watch?v=ERysyFbJH7w',
    },
    'Afternoon Snack': {
      title: 'Budget Meal Prep & Healthy Snacks Under €2',
      url: 'https://www.youtube.com/watch?v=NOgPQvUWfHk',
    },
    'Dinner': {
      title: 'Greek Baked Cod & Roasted Mediterranean Vegetables',
      url: 'https://www.youtube.com/watch?v=iD0AghGG_sc',
    },
  });

  // Backend Persisted Workout Videos State
  const [backendVideos, setBackendVideos] = useState<any[]>(DEFAULT_7_DAY_SCHEDULE);

  // Helper to extract YouTube video ID and build working embed URL
  const getEmbedUrl = (url: string) => {
    try {
      if (!url) return 'https://www.youtube.com/embed/gC_L9qAHVJ8?rel=0&playsinline=1';
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
      }
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1`
        : url;
    } catch {
      return url;
    }
  };

  // Load persisted videos from backend API on mount (Ensures videos are available across devices)
  useEffect(() => {
    fetch('/api/workout-videos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
          setBackendVideos(data.videos);
        }
      })
      .catch((err) => {
        console.warn('Using default workout schedule fallback:', err);
      });

    fetch('/api/nutrition-videos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
          const map: Record<string, { title: string; url: string }> = {};
          data.videos.forEach((v: any) => {
            map[v.meal] = { title: v.title, url: v.youtubeUrl };
          });
          setCustomMealVideos((prev) => ({ ...prev, ...map }));
        }
      })
      .catch((err) => {
        console.warn('Using default nutrition videos fallback:', err);
      });
  }, []);

  const dietPlans = wellnessPlans.filter((p) => p.type === 'diet');
  const exercisePlans = wellnessPlans.filter((p) => p.type === 'exercise');
  const activeDietPlan = dietPlans[0];
  const activeExercisePlan = exercisePlans[0];

  const toggleMealCompleted = (mealName: string) => {
    setCompletedMeals((prev) =>
      prev.includes(mealName) ? prev.filter((m) => m !== mealName) : [...prev, mealName]
    );
  };

  const toggleExerciseCompleted = (exName: string) => {
    setCompletedExercises((prev) =>
      prev.includes(exName) ? prev.filter((e) => e !== exName) : [...prev, exName]
    );
  };

  // Helper icons for meal types
  const getMealIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('breakfast')) return <Sun className="w-5 h-5 text-amber-500" />;
    if (lower.includes('lunch')) return <Apple className="w-5 h-5 text-emerald-500" />;
    if (lower.includes('snack')) return <Coffee className="w-5 h-5 text-orange-400" />;
    if (lower.includes('dinner')) return <Moon className="w-5 h-5 text-indigo-500" />;
    return <Utensils className="w-5 h-5 text-teal-600" />;
  };

  // Appetizing high resolution meal pictures
  const getMealPhoto = (meal: any) => {
    if (meal.image) return meal.image;
    const lower = (meal.meal || '').toLowerCase();
    if (lower.includes('breakfast')) {
      return 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&auto=format&fit=crop&q=80';
    }
    if (lower.includes('lunch')) {
      return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80';
    }
    if (lower.includes('snack')) {
      return 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80';
    }
    if (lower.includes('dinner')) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80';
  };

  // Helper for Verified Clinical Nutrition & Recipe YouTube Videos
  const getMealVideo = (mealName: string) => {
    const custom = customMealVideos[mealName];
    if (custom) return custom;

    const lower = (mealName || '').toLowerCase();
    for (const [key, val] of Object.entries(customMealVideos)) {
      if (lower.includes(key.toLowerCase())) {
        return val;
      }
    }

    if (lower.includes('breakfast')) {
      return {
        title: 'Lemon Ricotta Protein Pancakes | High-Protein Breakfast Meal Prep',
        url: 'https://www.youtube.com/watch?v=kBbjw1dLOcc',
      };
    }
    if (lower.includes('lunch')) {
      return {
        title: 'MEAL PREP | 10 Healthy Meals in 1 HOUR (+ PDF Guide)',
        url: 'https://www.youtube.com/watch?v=ERysyFbJH7w',
      };
    }
    if (lower.includes('snack')) {
      return {
        title: 'Budget Meal Prep & Healthy Snacks Under €2',
        url: 'https://www.youtube.com/watch?v=NOgPQvUWfHk',
      };
    }
    return {
      title: 'Greek Baked Cod & Roasted Mediterranean Vegetables',
      url: 'https://www.youtube.com/watch?v=iD0AghGG_sc',
    };
  };

  return (
    <div id="ai-wellness-section" className="space-y-5">
      {/* Visual Header Banner on White Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-white text-slate-900 p-6 sm:p-7 shadow-xs border border-slate-200/90">
        {/* Soft atmospheric gradient accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-100/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-28 w-36 h-36 rounded-full bg-teal-100/40 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold tracking-wide text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Personalized AI Clinical Guidance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <span>Diet &amp; Workout Blueprint</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Tailored specifically to your biomarker metrics (BP {vitals.bloodPressure}, BMI {vitals.bmi}),
              designed for heart health and sustained all-day vitality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* Visual Pill Segmented Tabs */}
            <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <button
                type="button"
                id="tab-diet-plan-btn"
                onClick={() => setActiveTab('diet')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'diet'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Utensils className={`w-4 h-4 ${activeTab === 'diet' ? 'text-white' : 'text-amber-600'}`} />
                <span>Nutrition &amp; Meals</span>
              </button>

              <button
                type="button"
                id="tab-exercise-plan-btn"
                onClick={() => setActiveTab('exercise')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'exercise'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md scale-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Dumbbell className={`w-4 h-4 ${activeTab === 'exercise' ? 'text-white' : 'text-teal-600'}`} />
                <span>Daily Workouts</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW: DIET & NUTRITION */}
      {activeTab === 'diet' && activeDietPlan && (() => {
        const plan = activeDietPlan;
        const data = plan.planData || {};
        const weeklySchedule = data.weeklySchedule || DEFAULT_7_DAY_DIET_SCHEDULE;
        const activeDietDay = weeklySchedule[activeDietDayTab] || weeklySchedule[0] || {};
        const isTodayDietActive = activeDietDayTab === todayDayIndex;
        const schedule = activeDietDay.meals || data.dailySchedule || [];
        const targetCal = activeDietDay.targetCalories || data.targetCalories || 2050;
        const proteinPct = parseInt(activeDietDay.macros?.protein || data.macros?.protein || '25', 10);
        const carbsPct = parseInt(activeDietDay.macros?.carbs || data.macros?.carbs || '45', 10);
        const fatsPct = parseInt(activeDietDay.macros?.fats || data.macros?.fats || '30', 10);
        const hydration = activeDietDay.hydrationTarget || data.hydrationTarget || '2.8 Liters/day';

        // Calculate progress of completed meals for current active day
        const completedCount = schedule.filter((m: any) =>
          completedMeals.includes(`${activeDietDayTab}-${m.meal}`) || (activeDietDayTab === todayDayIndex && completedMeals.includes(m.meal))
        ).length;
        const progressPercent = schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 25;

        return (
          <div key={plan.id} className="space-y-5">
            {/* Visual Snapshot & Macronutrient Dashboard Cards - Option 3: Photo & Card Snapshot Style */}
            {(() => {
              // Find next upcoming meal or fallback to first meal
              const nextMeal = schedule.find((m: any) => {
                const k = `${activeDietDayTab}-${m.meal}`;
                return !completedMeals.includes(k) && !(activeDietDayTab === todayDayIndex && completedMeals.includes(m.meal));
              }) || schedule[0];
              const nextMealKey = nextMeal ? `${activeDietDayTab}-${nextMeal.meal}` : '';
              const isNextMealEaten = nextMeal && (
                completedMeals.includes(nextMealKey) ||
                (activeDietDayTab === todayDayIndex && completedMeals.includes(nextMeal.meal))
              );

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* CARD 1: Energy Target - Visual Fuel & Food Snapshot */}
                  <div className="relative overflow-hidden bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-amber-300 hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <Flame className="w-4.5 h-4.5 fill-amber-500 text-amber-500 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Energy Target</span>
                            <span className="text-[10px] text-slate-400 font-medium">Daily Caloric Fuel</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
                          {targetCal} kcal
                        </span>
                      </div>

                      {/* Photo Snapshot Banner with Burn Fuel Tag */}
                      <div className="relative mt-3 h-20 rounded-2xl overflow-hidden border border-amber-200/80 shadow-inner group">
                        <img
                          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=450&auto=format&fit=crop&q=80"
                          alt="Energy Nutrition"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent flex flex-col justify-between p-2.5 text-white">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-amber-300" /> Metabolic Burn
                            </span>
                            <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                              ~{Math.round(targetCal / (schedule.length || 4))} kcal / meal
                            </span>
                          </div>
                          <div>
                            <span className="text-xl font-black text-white">{targetCal} <span className="text-xs font-bold text-amber-300">kcal/day</span></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" /> Vascular Health
                      </span>
                      <span className="font-bold text-amber-700">100% Calibrated</span>
                    </div>
                  </div>

                  {/* CARD 2: Macro Balance - Visual Food Photo Avatars */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-teal-300 hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <Utensils className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Macro Balance</span>
                            <span className="text-[10px] text-slate-400 font-medium">Nutrient Distribution</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/70">
                          Optimal
                        </span>
                      </div>

                      {/* 3 Visual Food Snapshot Mini Cards */}
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {/* Protein */}
                        <div className="bg-teal-50/60 border border-teal-200/70 rounded-2xl p-1.5 flex flex-col items-center text-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-400 shadow-xs mb-1">
                            <img
                              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=100&auto=format&fit=crop&q=80"
                              alt="Protein"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-black text-teal-900">{proteinPct}%</span>
                          <span className="text-[10px] font-bold text-teal-700">Protein</span>
                        </div>

                        {/* Carbs */}
                        <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-1.5 flex flex-col items-center text-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shadow-xs mb-1">
                            <img
                              src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop&q=80"
                              alt="Carbohydrates"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-black text-amber-900">{carbsPct}%</span>
                          <span className="text-[10px] font-bold text-amber-700">Carbs</span>
                        </div>

                        {/* Healthy Fats */}
                        <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-2xl p-1.5 flex flex-col items-center text-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-400 shadow-xs mb-1">
                            <img
                              src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=100&auto=format&fit=crop&q=80"
                              alt="Healthy Fats"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-black text-indigo-900">{fatsPct}%</span>
                          <span className="text-[10px] font-bold text-indigo-700">Fats</span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Segmented Bar */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex h-2.5 w-full rounded-full overflow-hidden shadow-inner gap-0.5 bg-slate-100">
                        <div style={{ width: `${proteinPct}%` }} className="bg-teal-600 rounded-l-full" title={`Protein: ${proteinPct}%`} />
                        <div style={{ width: `${carbsPct}%` }} className="bg-amber-500" title={`Carbs: ${carbsPct}%`} />
                        <div style={{ width: `${fatsPct}%` }} className="bg-indigo-500 rounded-r-full" title={`Healthy Fats: ${fatsPct}%`} />
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Daily Hydration - Interactive Glasses & Water Logger */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-blue-300 hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Droplets className="w-4.5 h-4.5 fill-blue-500" />
                          </div>
                          <div>
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Hydration</span>
                            <span className="text-[10px] text-slate-400 font-medium">Daily Water Tracker</span>
                          </div>
                        </div>

                        {/* Quick Stepper Buttons */}
                        <div className="flex items-center gap-1 bg-blue-50 p-0.5 rounded-xl border border-blue-200">
                          <button
                            type="button"
                            onClick={() => setLoggedGlasses((g) => Math.max(0, g - 1))}
                            className="w-6 h-6 rounded-lg bg-white text-blue-700 hover:bg-blue-100 flex items-center justify-center font-bold text-xs transition cursor-pointer shadow-2xs"
                            title="Decrease 1 glass"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[11px] font-black text-blue-900 px-1.5">{loggedGlasses}/11</span>
                          <button
                            type="button"
                            onClick={() => setLoggedGlasses((g) => Math.min(11, g + 1))}
                            className="w-6 h-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center font-bold text-xs transition cursor-pointer shadow-2xs"
                            title="Drink 1 glass"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-900">{((loggedGlasses * 250) / 1000).toFixed(1)}L</span>
                          <span className="text-xs font-bold text-blue-600">/ {hydration}</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          {Math.round((loggedGlasses / 11) * 100)}% Goal
                        </span>
                      </div>

                      {/* Interactive 11 Glasses Visual Row */}
                      <div className="grid grid-cols-11 gap-1 mt-3">
                        {[...Array(11)].map((_, i) => {
                          const isFilled = i < loggedGlasses;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setLoggedGlasses(i + 1 === loggedGlasses ? i : i + 1)}
                              className={`h-7 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                                isFilled
                                  ? 'bg-blue-500 text-white shadow-xs scale-100'
                                  : 'bg-blue-50/70 hover:bg-blue-100/70 text-blue-300 border border-blue-200/50'
                              }`}
                              title={`Glass ${i + 1} of 11 (Tap to toggle)`}
                            >
                              <Droplets className={`w-3 h-3 ${isFilled ? 'fill-white' : ''}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-700">
                      <span className="text-[10px] text-slate-400">Tap droplet to log</span>
                      <span className="font-bold text-[11px]">{11 - loggedGlasses > 0 ? `${11 - loggedGlasses} glasses left` : 'Goal Reached! 💧'}</span>
                    </div>
                  </div>

                  {/* CARD 4: Day Progress & Next Meal Snapshot */}
                  <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 p-5 rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col justify-between group hover:border-emerald-400 hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                            {completedCount}/{schedule.length}
                          </div>
                          <div>
                            <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider block">Day Progress</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">{progressPercent}% Meals Completed</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/50">
                          {progressPercent === 100 ? 'All Done 🌟' : `${schedule.length - completedCount} Left`}
                        </span>
                      </div>

                      {/* Visual Photo Card of Next Upcoming Meal with 1-Tap Action */}
                      {nextMeal && (
                        <div className="relative mt-3 h-20 rounded-2xl overflow-hidden border border-emerald-200 shadow-inner group">
                          <img
                            src={getMealPhoto(nextMeal)}
                            alt={nextMeal.meal}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-2.5 justify-between">
                            <div className="min-w-0 pr-2">
                              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wide flex items-center gap-1">
                                {getMealIcon(nextMeal.meal)} {nextMeal.meal} &bull; {nextMeal.time}
                              </span>
                              <span className="text-xs font-bold text-white block truncate">
                                {nextMeal.items?.[0] || 'Scheduled fresh meal'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMealCompleted(nextMealKey);
                              }}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shrink-0 shadow-sm active:scale-95 ${
                                isNextMealEaten
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300'
                              }`}
                              title={isNextMealEaten ? 'Marked as eaten' : 'Tap to mark eaten'}
                            >
                              <CheckCircle className="w-3.5 h-3.5 fill-current" />
                              <span>{isNextMealEaten ? 'Eaten ✓' : 'Eat'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4 Mini Meal Completion Stamp Dots */}
                    <div className="mt-3 pt-2 border-t border-emerald-100/70 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {schedule.map((m: any, idx: number) => {
                          const k = `${activeDietDayTab}-${m.meal}`;
                          const done = completedMeals.includes(k) || (activeDietDayTab === todayDayIndex && completedMeals.includes(m.meal));
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleMealCompleted(k)}
                              className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center transition cursor-pointer ${
                                done
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                              title={`${m.meal} - ${done ? 'Completed' : 'Pending'}`}
                            >
                              {done ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-[10px] font-bold text-emerald-700">
                        {progressPercent === 100 ? 'All 4 Target Met' : 'Tap to toggle'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Unified 7-Day Weekly Nutrition & Diet Plan Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      7-Day Weekly Nutrition &amp; Diet Plan
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Daily Program
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {plan.title} &bull; Clinical daily meal rotation by {plan.assignedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Jump to Today Button */}
                  <button
                    type="button"
                    id="jump-to-today-diet-btn"
                    onClick={() => setActiveDietDayTab(todayDayIndex)}
                    className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Today ({todayWeekdayName.substring(0, 3)})</span>
                  </button>

                  <span className="text-xs font-semibold text-slate-500 hidden md:inline">
                    Tap day pill to preview
                  </span>
                </div>
              </div>

              {/* Interactive Day Tabs for All 7 Days */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {weeklySchedule.map((dayPlan: any, idx: number) => {
                  const isActive = activeDietDayTab === idx;
                  const isToday = idx === todayDayIndex;
                  const dayName = dayPlan.day.split(' - ')[0] || dayPlan.day;
                  const dayFocus = dayPlan.focus || dayPlan.day.split(' - ')[1] || 'Nutrition';
                  return (
                    <button
                      key={idx}
                      type="button"
                      id={`diet-day-tab-${idx}`}
                      onClick={() => setActiveDietDayTab(idx)}
                      className={`px-4 py-2.5 rounded-2xl text-left border transition shrink-0 relative cursor-pointer ${
                        isActive
                          ? 'bg-teal-700 border-teal-700 text-white shadow-md'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs">{dayName}</span>
                        {isToday && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider flex items-center gap-1 ${
                              isActive
                                ? 'bg-emerald-400 text-slate-950 font-bold'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                            Today
                          </span>
                        )}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                          }`}
                        >
                          {dayPlan.targetCalories || 2050} kcal
                        </span>
                      </div>
                      <span
                        className={`text-[11px] block truncate max-w-[155px] mt-1 ${
                          isActive ? 'text-teal-100 font-medium' : 'text-slate-500'
                        }`}
                      >
                        {dayFocus}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Day Meals Container */}
              <div className="bg-slate-50/70 rounded-3xl p-5 sm:p-6 border border-slate-200/90 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-teal-700 text-white shadow-2xs">
                        {activeDietDay.day?.split(' - ')[0] || 'Scheduled Daily Diet'}
                      </span>
                      {isTodayDietActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          Today's Scheduled Meals
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-700">
                        Target: {targetCal} kcal
                      </span>
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="text-xs font-semibold text-teal-800">
                        Focus: {activeDietDay.focus || 'Cardio Nutrition'}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 mt-1.5 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-teal-600" />
                      {activeDietDay.day?.split(' - ')[1] || activeDietDay.day || "Today's Meal & Nutrition Timing"}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                    <a
                      href={schedule[0]?.youtubeUrl || customMealVideos['Breakfast']?.url || 'https://www.youtube.com/watch?v=kBbjw1dLOcc'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs transition active:scale-95 no-underline"
                      title="Open verified recipe video directly on YouTube"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                      <span>Open on YouTube</span>
                    </a>

                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full hidden lg:inline-block border border-teal-200/50">
                      Tap card when eaten
                    </span>
                  </div>
                </div>

                {/* 4 Meal Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
                  {schedule.map((meal: any, idx: number) => {
                    const mealKey = `${activeDietDayTab}-${meal.meal}`;
                    const isEaten = completedMeals.includes(mealKey) || (activeDietDayTab === todayDayIndex && completedMeals.includes(meal.meal));
                    return (
                      <div
                        key={idx}
                        id={`meal-card-${activeDietDayTab}-${idx}`}
                        onClick={() => toggleMealCompleted(mealKey)}
                        className={`cursor-pointer rounded-3xl p-4 sm:p-5 transition-all duration-300 border flex flex-col justify-between relative overflow-hidden group ${
                          isEaten
                            ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                            : 'bg-white border-slate-200/90 hover:border-teal-400 hover:shadow-lg'
                        }`}
                      >
                        {/* Checked badge */}
                        {isEaten && (
                          <div className="absolute top-4 right-4 z-20 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                            <CheckCircle className="w-5 h-5 fill-emerald-600 text-white" />
                          </div>
                        )}

                        <div className="space-y-4">
                          {/* Realistic Meal Photo Banner with Zoom on Hover */}
                          <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden shadow-inner group-hover:shadow-md transition">
                            <img
                              src={getMealPhoto(meal)}
                              alt={meal.meal}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Timing Pill on Image */}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>{meal.time}</span>
                            </div>

                            {/* Calories Pill on Image */}
                            <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-xl text-xs shadow-md">
                              {meal.calories} kcal
                            </div>

                            {/* Meal Title overlay */}
                            <div className="absolute bottom-3 left-3.5 text-white">
                              <span className="text-xl font-black tracking-tight drop-shadow-md flex items-center gap-2">
                                {getMealIcon(meal.meal)}
                                {meal.meal}
                              </span>
                            </div>
                          </div>

                          {/* Food items count & status */}
                          <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/60">
                              {meal.items?.length || 0} Nutrition Items
                            </span>
                            <span className={`text-xs font-semibold ${isEaten ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {isEaten ? 'Eaten & Tracked ✓' : 'Tap card when eaten'}
                            </span>
                          </div>

                          {/* Prominent Food Items with Increased Text Size */}
                          <ul className="space-y-2.5 pt-1 px-1">
                            {meal.items?.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0 group-hover:scale-125 transition" />
                                <span
                                  className={`text-sm sm:text-base font-semibold leading-snug ${
                                    isEaten ? 'line-through text-slate-400' : 'text-slate-800'
                                  }`}
                                >
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Nutrition tip footer with larger text */}
                        {meal.tips && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-teal-950 font-medium flex items-start gap-2 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{meal.tips}</span>
                          </div>
                        )}

                        {/* Simple Direct YouTube Link */}
                        <div
                          className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={meal.youtubeUrl || getMealVideo(meal.meal).url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 shadow-2xs transition active:scale-95 no-underline"
                            title="Open verified recipe video directly on YouTube"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                            <span>Open on YouTube</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clinical Guidelines & Foods to Avoid Quick Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-rose-50/70 border border-rose-200/60 rounded-2xl flex items-start gap-3 text-xs text-rose-950">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-900 font-bold mb-1 text-sm">Recommended Foods to Avoid:</strong>
                      <p className="text-xs text-rose-800 leading-relaxed">
                        {Array.isArray(data.foodsToAvoid)
                          ? data.foodsToAvoid.join(' • ')
                          : 'Trans fats, deep fried oils, high-sodium deli meats'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50/70 border border-teal-200/60 rounded-2xl flex items-start gap-3 text-xs text-teal-950">
                    <Heart className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-teal-900 font-bold mb-1 text-sm">Doctor's Clinical Rationale:</strong>
                      <p className="text-xs text-teal-800 leading-relaxed">
                        {data.doctorNotes ||
                          'Adhering to fiber and omega-3 targets helps lower circulating triglycerides and non-HDL particles.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* VIEW: EXERCISE & WORKOUT (DAILY 7-DAY SCHEDULE) */}
      {activeTab === 'exercise' && activeExercisePlan && (() => {
        const plan = activeExercisePlan;
        const data = plan.planData || {};
        // Guarantee full 7-day daily schedule from backend videos
        const schedule =
          backendVideos && backendVideos.length >= 7
            ? backendVideos
            : data.weeklySchedule && data.weeklySchedule.length >= 7
            ? data.weeklySchedule
            : DEFAULT_7_DAY_SCHEDULE;
        const activeDay = schedule[activeDayTab] || schedule[0] || {};
        const isTodayActive = activeDayTab === todayDayIndex;
        const totalExercises = schedule.reduce(
          (sum: number, d: any) => sum + (d.exercises?.length || 0),
          0
        );

        const todayExercises = activeDay.exercises || [];
        const completedTodaySets = todayExercises.filter((ex: string) => completedExercises.includes(ex)).length;
        const todaySetsPercent = todayExercises.length > 0 ? Math.round((completedTodaySets / todayExercises.length) * 100) : 0;
        const nextExercise = todayExercises.find((ex: string) => !completedExercises.includes(ex)) || todayExercises[0];
        const isNextExDone = nextExercise && completedExercises.includes(nextExercise);

        return (
          <div key={plan.id} className="space-y-5">
            {/* Visual Workout Metrics Strip - Option 3: Photo & Card Snapshot Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CARD 1: Intensity Target - Zone 2 Cardio & Heart Rate Snapshot */}
              <div className="relative overflow-hidden bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-teal-300 hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        <Activity className="w-4.5 h-4.5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Intensity Target</span>
                        <span className="text-[10px] text-slate-400 font-medium">Cardiovascular Zone</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/70">
                      Zone 2
                    </span>
                  </div>

                  {/* Photo Snapshot Banner with Cardio Rate */}
                  <div className="relative mt-3 h-20 rounded-2xl overflow-hidden border border-teal-200/80 shadow-inner group">
                    <img
                      src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=450&auto=format&fit=crop&q=80"
                      alt="Cardio Runner"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent flex flex-col justify-between p-2.5 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> 115 - 135 BPM
                        </span>
                        <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                          Fat Burn Focus
                        </span>
                      </div>
                      <div>
                        <span className="text-xl font-black text-white">Zone 2 Daily</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Zone Visual Indicator */}
                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1">
                    <span className="h-2 flex-1 rounded-full bg-slate-200" title="Zone 1: Warmup" />
                    <span className="h-2 flex-1 rounded-full bg-teal-500 ring-2 ring-teal-300 shadow-xs" title="Zone 2: Optimal Endurance (Active)" />
                    <span className="h-2 flex-1 rounded-full bg-emerald-300" title="Zone 3: Aerobic" />
                    <span className="h-2 flex-1 rounded-full bg-amber-300" title="Zone 4: Threshold" />
                    <span className="h-2 flex-1 rounded-full bg-rose-300" title="Zone 5: Peak" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-teal-800 font-bold">
                    <span>Mitochondrial Oxidation</span>
                    <span>Zone 2 Active ✓</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: Daily Schedule - Interactive 7-Day Calendar & Focus Photo */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-indigo-300 hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Daily Schedule</span>
                        <span className="text-[10px] text-slate-400 font-medium">7 Days Program</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                      {activeDay.duration || '35 mins'}
                    </span>
                  </div>

                  {/* Interactive 7-Day Pill Selector */}
                  <div className="grid grid-cols-7 gap-1 mt-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
                      const isToday = idx === todayDayIndex;
                      const isSelected = idx === activeDayTab;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveDayTab(idx)}
                          className={`py-1.5 rounded-xl text-[10px] font-black transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-300'
                              : isToday
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-black'
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                          title={`Switch to ${dayName}`}
                        >
                          <span>{dayName.slice(0, 1)}</span>
                          {isToday && <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Day Focus Photo Snapshot Banner */}
                <div className="relative mt-2.5 h-16 rounded-2xl overflow-hidden border border-indigo-200/70 shadow-inner group">
                  <img
                    src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=450&auto=format&fit=crop&q=80"
                    alt="Workout Routine"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent flex items-center px-3 justify-between text-white">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-300 uppercase block">Selected Routine</span>
                      <span className="text-xs font-black truncate max-w-[160px] block">
                        {activeDay.day?.split(' - ')[1] || activeDay.day || 'Daily Routine'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      {activeDayTab === todayDayIndex ? 'Today ⚡' : 'Scheduled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 3: Sets Completed & Next Exercise Snapshot */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 p-5 rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col justify-between group hover:border-emerald-400 hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        {completedTodaySets}/{todayExercises.length}
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider block">Daily Sets</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">{todaySetsPercent}% Sets Logged</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/50">
                      {todaySetsPercent === 100 ? 'All Sets Done 🌟' : `${todayExercises.length - completedTodaySets} Left`}
                    </span>
                  </div>

                  {/* Visual Photo Card of Next Upcoming Exercise with 1-Tap Complete */}
                  {nextExercise && (
                    <div className="relative mt-3 h-20 rounded-2xl overflow-hidden border border-emerald-200 shadow-inner group">
                      <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=450&auto=format&fit=crop&q=80"
                        alt="Next Exercise"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-2.5 justify-between">
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-black text-amber-300 uppercase tracking-wide flex items-center gap-1">
                            <Dumbbell className="w-3 h-3" /> Next Movement
                          </span>
                          <span className="text-xs font-bold text-white block truncate">
                            {nextExercise}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExerciseCompleted(nextExercise);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shrink-0 shadow-sm active:scale-95 ${
                            isNextExDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300'
                          }`}
                          title={isNextExDone ? 'Marked done' : 'Tap to mark done'}
                        >
                          <CheckCircle className="w-3.5 h-3.5 fill-current" />
                          <span>{isNextExDone ? 'Done ✓' : 'Mark'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Exercise Set Stamp Indicators */}
                <div className="mt-3 pt-2 border-t border-emerald-100/70 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {todayExercises.map((ex: string, idx: number) => {
                      const isDone = completedExercises.includes(ex);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleExerciseCompleted(ex)}
                          className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center transition cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          title={`${ex} - ${isDone ? 'Completed' : 'Pending'}`}
                        >
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">
                    {todaySetsPercent === 100 ? 'All Sets Complete' : 'Tap to toggle set'}
                  </span>
                </div>
              </div>

              {/* CARD 4: Warmup & Cool Down - Dual Photo Snapshots */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group hover:border-amber-300 hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Timer className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Pre &amp; Post Flow</span>
                        <span className="text-[10px] text-slate-400 font-medium">Mobility &amp; Recovery</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60">
                      13 Min Flow
                    </span>
                  </div>

                  {/* Dual Visual Photo Mini-Cards */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {/* Dynamic Warmup */}
                    <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-2 flex flex-col items-center text-center">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400 shadow-xs mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&auto=format&fit=crop&q=80"
                          alt="Warmup"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> 5 Min
                      </span>
                      <span className="text-[10px] font-bold text-amber-800">Dynamic Stretch</span>
                    </div>

                    {/* Static Cool Down */}
                    <div className="bg-teal-50/70 border border-teal-200/70 rounded-2xl p-2 flex flex-col items-center text-center">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-teal-400 shadow-xs mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&auto=format&fit=crop&q=80"
                          alt="Cool Down"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-black text-teal-950 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-teal-600 fill-teal-600" /> 8 Min
                      </span>
                      <span className="text-[10px] font-bold text-teal-800">Static Recovery</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-600" /> Injury Protection
                  </span>
                  <span className="font-bold text-amber-700">Pre &amp; Post Active</span>
                </div>
              </div>
            </div>

            {/* Day-by-Day Daily Interactive Routine Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Footprints className="w-5 h-5 text-teal-600" />
                      Daily 7-Day Workout Routine &amp; Exercises
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Daily Program
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {plan.title} &bull; Automatically highlights today ({todayWeekdayName})
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Jump to Today Button */}
                  <button
                    type="button"
                    id="jump-to-today-workout-btn"
                    onClick={() => setActiveDayTab(todayDayIndex)}
                    className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Today ({todayWeekdayName.substring(0, 3)})</span>
                  </button>

                  <span className="text-xs font-semibold text-slate-500 hidden md:inline">
                    Tap day pill to preview
                  </span>
                </div>
              </div>

              {/* Interactive Day Tabs for All 7 Days */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {schedule.map((day: any, idx: number) => {
                  const isActive = activeDayTab === idx;
                  const isToday = idx === todayDayIndex;
                  const dayName = day.day.split(' - ')[0] || day.day;
                  const dayFocus = day.day.split(' - ')[1] || 'Workout';
                  return (
                    <button
                      key={idx}
                      type="button"
                      id={`workout-day-tab-${idx}`}
                      onClick={() => setActiveDayTab(idx)}
                      className={`px-4 py-2.5 rounded-2xl text-left border transition shrink-0 relative cursor-pointer ${
                        isActive
                          ? 'bg-teal-700 border-teal-700 text-white shadow-md'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs">{dayName}</span>
                        {isToday && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider flex items-center gap-1 ${
                              isActive
                                ? 'bg-emerald-400 text-slate-950 font-bold'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                            Today
                          </span>
                        )}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                          }`}
                        >
                          {day.duration}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] block truncate max-w-[150px] mt-1 ${
                          isActive ? 'text-teal-100 font-medium' : 'text-slate-500'
                        }`}
                      >
                        {dayFocus}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Day Exercise Cards with Video & Animation Links */}
              {activeDay && (
                <div className="bg-slate-50/70 rounded-3xl p-5 sm:p-6 border border-slate-200/90 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-black bg-teal-700 text-white shadow-2xs">
                          {activeDay.day?.split(' - ')[0] || 'Scheduled Daily Routine'}
                        </span>
                        {isTodayActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            Today's Scheduled Workout
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-700">
                          Duration: {activeDay.duration}
                        </span>
                        <span className="text-xs text-slate-400">&bull;</span>
                        <span className="text-xs font-semibold text-teal-800">
                          Intensity: {activeDay.intensity}
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-slate-900 mt-1.5">
                        {activeDay.day?.split(' - ')[1] || activeDay.day}
                      </h4>
                    </div>

                    {/* YouTube Workout Video Action */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveVideoModal({
                            title: activeDay.youtubeTitle || activeDay.day,
                            url: activeDay.youtubeUrl || 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
                            day: activeDay.day,
                          })
                        }
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
                        title="Play full video exercise routine"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Play Routine Video</span>
                      </button>

                      {activeDay.youtubeUrl && (
                        <a
                          href={activeDay.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs transition active:scale-95"
                          title="Open verified YouTube video in new tab or YouTube app"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                          <span>Open on YouTube</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Exercises Checklist */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Prescribed Exercises ({activeDay.exercises?.length || 0} sets)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Tap card to check off sets
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                      {activeDay.exercises?.map((ex: string, i: number) => {
                        const isDone = completedExercises.includes(ex);
                        return (
                          <div
                            key={i}
                            id={`exercise-item-${i}`}
                            className={`rounded-2xl p-4 border text-xs flex flex-col justify-between transition-all duration-200 group ${
                              isDone
                                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs'
                                : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-md text-slate-800'
                            }`}
                          >
                            <div
                              onClick={() => toggleExerciseCompleted(ex)}
                              className="cursor-pointer flex items-start gap-3"
                            >
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-black transition ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-slate-300 text-slate-400 group-hover:border-teal-500 group-hover:text-teal-600'
                                }`}
                              >
                                {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                              </div>
                              <div className="space-y-1">
                                <span
                                  className={`font-black text-sm block leading-snug ${
                                    isDone ? 'line-through text-slate-400' : 'text-slate-900'
                                  }`}
                                >
                                  {ex}
                                </span>
                                <span className="text-[11px] text-slate-500 block">
                                  {isDone ? 'Completed ✓' : 'Tap to mark done'}
                                </span>
                              </div>
                            </div>

                            {/* Quick action link for YouTube video */}
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveVideoModal({
                                    title: `${ex} - Video Guide`,
                                    url: activeDay.youtubeUrl || 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
                                    day: activeDay.day,
                                  });
                                }}
                                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Watch Routine</span>
                              </button>

                              {activeDay.youtubeUrl && (
                                <a
                                  href={activeDay.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                                  title="Open verified YouTube tutorial"
                                >
                                  <Play className="w-3 h-3 fill-red-600" />
                                  <span>YouTube &rarr;</span>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Safety precaution notice */}
                  {data.safetyPrecautions && (
                    <div className="pt-3 border-t border-slate-200/80 flex items-start gap-2.5 text-xs text-amber-900 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/70">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Clinical Safety Alert:</strong> {data.safetyPrecautions}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}
      {/* YOUTUBE VIDEO WORKOUT MODAL WITH EMBEDDED PLAYER & DIRECT BACKEND-VERIFIED LINK */}
      <AnimatePresence>
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white truncate max-w-md">
                      {activeVideoModal.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {activeVideoModal.day} &bull; Backend-Verified YouTube Routine
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Responsive Embedded YouTube Video Player */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-800">
                  <iframe
                    src={getEmbedUrl(activeVideoModal.url)}
                    title={activeVideoModal.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* Direct High-Reliability Action Bar (solves "Video unavailable" error across all browsers and devices) */}
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-red-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                    <span>Having trouble with third-party player? Open directly on YouTube:</span>
                  </div>
                  <a
                    href={activeVideoModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 no-underline"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Directly on YouTube &rarr;</span>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Permanent link saved in backend:</span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono truncate max-w-[180px] sm:max-w-[240px]">
                      {activeVideoModal.url}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={activeVideoModal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-2 shadow-xs transition active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setActiveVideoModal(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
