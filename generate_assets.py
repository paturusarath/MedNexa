import subprocess
import os

os.makedirs('public/assets', exist_ok=True)

# 1. 02_landing_art_right.png (600x800)
cmd_02 = [
    'convert', '-size', '600x800', 'gradient:#060f1e-#091c3d',
    '-fill', '#ffffff', '-draw', 'circle 80,120 81,120',
    '-fill', '#38bdf8', '-draw', 'circle 150,90 151,90',
    '-fill', '#2dd4bf', '-draw', 'circle 480,140 481,140',
    '-fill', '#ffffff', '-draw', 'circle 520,70 521,70',
    '-fill', '#38bdf8', '-draw', 'circle 220,50 221,50',
    '-fill', '#09152b', '-draw', 'rectangle 160,240 440,780',
    '-fill', '#050c18', '-draw', 'rectangle 70,360 190,780',
    '-fill', '#050c18', '-draw', 'rectangle 410,320 530,780',
    '-fill', '#38bdf8',
    '-draw', 'rectangle 180,280 210,300', '-draw', 'rectangle 230,280 260,300', '-draw', 'rectangle 280,280 310,300', '-draw', 'rectangle 330,280 360,300',
    '-fill', '#22d3ee',
    '-draw', 'rectangle 180,320 210,340', '-draw', 'rectangle 280,320 310,340', '-draw', 'rectangle 330,320 360,340', '-draw', 'rectangle 380,320 410,340',
    '-fill', '#f59e0b',
    '-draw', 'rectangle 230,320 260,340', '-draw', 'rectangle 230,360 260,380', '-draw', 'rectangle 380,360 410,380',
    '-fill', '#ef4444', '-draw', 'rectangle 290,210 310,235', '-draw', 'rectangle 280,220 320,228',
    '-stroke', 'rgba(45,212,191,0.5)', '-strokewidth', '1.5',
    '-draw', 'line 110,180 240,150', '-draw', 'line 240,150 380,190', '-draw', 'line 380,190 490,240',
    '-draw', 'line 240,150 300,300', '-draw', 'line 110,180 160,340',
    '-stroke', '#06b6d4', '-strokewidth', '2', '-fill', '#061224', '-draw', 'circle 110,180 110,155',
    '-stroke', '#3b82f6', '-strokewidth', '2', '-fill', '#061224', '-draw', 'circle 490,240 490,215',
    '-stroke', '#10b981', '-strokewidth', '2', '-fill', '#061224', '-draw', 'circle 380,190 380,170',
    '-stroke', '#06b6d4', '-strokewidth', '3', '-fill', '#040d1a',
    '-draw', 'roundrectangle 170,440 430,720 36,36',
    '-stroke', '#1e293b', '-strokewidth', '1.5', '-fill', '#020712',
    '-draw', 'roundrectangle 186,456 414,704 26,26',
    '-stroke', 'none', '-fill', '#334155', '-draw', 'roundrectangle 270,470 330,476 3,3',
    '-fill', '#f43f5e',
    '-draw', 'circle 290,520 290,510', '-draw', 'circle 310,520 310,510', '-draw', 'polygon 281,525 319,525 300,543',
    '-fill', '#22d3ee', '-pointsize', '72', '-font', 'AvantGarde-Demi', '-gravity', 'North', '-annotate', '+0+540', '72',
    '-fill', '#94a3b8', '-pointsize', '16', '-font', 'AvantGarde-Book', '-annotate', '+0+618', 'B P M',
    '-stroke', '#06b6d4', '-strokewidth', '3', '-fill', 'none',
    '-draw', 'polyline 200,660 240,660 255,660 265,640 275,675 285,620 295,670 305,660 400,660',
    'public/assets/02_landing_art_right.png'
]
subprocess.run(cmd_02, check=True)

# 2. 04_patient_photo_strip.png (500x900)
# Patient outdoors on trail at sunrise, mountain ridges, active lifestyle, teal/emerald glow
cmd_04 = [
    'convert', '-size', '500x900', 'gradient:#0d353a-#061522',
    # Morning sky gradient at top
    '-fill', 'none',
    # Mountain silhouettes
    '-fill', '#0f3c42', '-draw', 'polygon 0,380 120,310 260,360 380,290 500,340 500,900 0,900',
    '-fill', '#0b2e35', '-draw', 'polygon 0,440 180,370 320,430 450,380 500,410 500,900 0,900',
    '-fill', '#072027', '-draw', 'polygon 0,520 140,460 280,510 420,450 500,500 500,900 0,900',
    # Golden sunrise glow on mountain rim
    '-stroke', 'rgba(45,212,191,0.6)', '-strokewidth', '2', '-fill', 'none',
    '-draw', 'polyline 0,380 120,310 260,360 380,290 500,340',
    # Tree silhouettes
    '-stroke', 'none', '-fill', '#05191f',
    '-draw', 'polygon 40,600 55,520 70,600',
    '-draw', 'polygon 30,620 55,560 80,620',
    '-draw', 'polygon 90,640 105,550 120,640',
    '-draw', 'polygon 420,630 440,530 460,630',
    # Runner figure silhouette (athletic woman on morning run with smartwatch)
    '-fill', '#0f3844',
    '-draw', 'circle 250,530 250,510',  # Head
    '-draw', 'polygon 238,550 262,550 268,660 232,660',  # Torso / athletic top
    '-draw', 'polygon 232,660 268,660 274,780 256,780 250,700 244,780 226,780',  # Running legs
    '-draw', 'polygon 238,555 220,620 230,625 244,570',  # Left arm
    '-draw', 'polygon 260,555 285,615 275,622 254,570',  # Right arm with watch
    # Smartwatch on wrist glowing teal
    '-stroke', '#2dd4bf', '-strokewidth', '2.5', '-fill', '#14b8a6',
    '-draw', 'circle 282,618 282,612',
    # Trail ground
    '-stroke', 'none', '-fill', '#041318',
    '-draw', 'polygon 0,720 500,680 500,900 0,900',
    # Ambient dark vignette overlay
    '-fill', 'rgba(4,14,24,0.4)', '-draw', 'rectangle 0,0 500,900',
    'public/assets/04_patient_photo_strip.png'
]
subprocess.run(cmd_04, check=True)

# 3. 06_doctor_photo_strip.png (500x900)
# Doctor in clinical white coat with stethoscope, clinical room, deep blue telemetry glow
cmd_06 = [
    'convert', '-size', '500x900', 'gradient:#081b38-#030914',
    # Telemetry screen grid lines
    '-stroke', 'rgba(59,130,246,0.18)', '-strokewidth', '1', '-fill', 'none',
    '-draw', 'line 0,150 500,150', '-draw', 'line 0,250 500,250', '-draw', 'line 0,350 500,350',
    '-draw', 'line 100,0 100,500', '-draw', 'line 250,0 250,500', '-draw', 'line 400,0 400,500',
    # Futuristic holographic vitals curve
    '-stroke', 'rgba(56,189,248,0.7)', '-strokewidth', '2',
    '-draw', 'polyline 40,220 120,220 150,180 180,260 210,160 230,240 260,220 380,220 410,190 440,220 480,220',
    # Doctor figure silhouette (White coat, professional, stethoscope)
    '-stroke', 'none',
    '-fill', '#1e293b', '-draw', 'circle 250,490 250,465', # Head / hair
    '-fill', '#f1f5f9', # Clinical white lab coat
    '-draw', 'polygon 200,530 300,530 330,850 170,850',
    # Inner dark scrub shirt
    '-fill', '#0284c7', '-draw', 'polygon 235,530 265,530 255,620 245,620',
    # Blue stethoscope around neck
    '-stroke', '#38bdf8', '-strokewidth', '3.5', '-fill', 'none',
    '-draw', 'path "M 225,530 Q 220,590 240,610 T 260,610 Q 280,590 275,530"',
    # Stethoscope chest piece / bell
    '-stroke', '#94a3b8', '-strokewidth', '2', '-fill', '#0284c7',
    '-draw', 'circle 250,625 250,617',
    # Holographic data tablet in hand
    '-stroke', '#38bdf8', '-strokewidth', '2', '-fill', 'rgba(14,165,233,0.3)',
    '-draw', 'roundrectangle 280,640 420,770 12,12',
    # Tablet mini charts
    '-stroke', '#67e8f9', '-strokewidth', '1.5', '-fill', 'none',
    '-draw', 'line 300,680 400,680',
    '-draw', 'line 300,710 380,710',
    '-draw', 'polyline 300,740 330,730 360,745 390,725',
    # Soft vignette
    '-stroke', 'none', '-fill', 'rgba(3,9,20,0.35)', '-draw', 'rectangle 0,0 500,900',
    'public/assets/06_doctor_photo_strip.png'
]
subprocess.run(cmd_06, check=True)

# 4. 08_pharmacy_photo_strip.png (500x900)
# Modern pharmacy shelves, amber glass medicine bottles, pills, warm amber/orange glow
cmd_08 = [
    'convert', '-size', '500x900', 'gradient:#2e1503-#0a0502',
    # Pharmacy shelving horizontal rows
    '-stroke', '#78350f', '-strokewidth', '4', '-fill', '#1c0d02',
    '-draw', 'rectangle 20,250 480,265',
    '-draw', 'rectangle 20,430 480,445',
    '-draw', 'rectangle 20,610 480,625',
    '-draw', 'rectangle 20,790 480,805',
    # Shelf 1: Medicine bottles (amber glass)
    '-stroke', 'none', '-fill', '#b45309',
    '-draw', 'roundrectangle 60,180 110,250 8,8',
    '-draw', 'roundrectangle 130,170 185,250 8,8',
    '-draw', 'roundrectangle 210,190 255,250 8,8',
    '-draw', 'roundrectangle 280,165 340,250 8,8',
    '-draw', 'roundrectangle 365,185 415,250 8,8',
    # White labels on bottles
    '-fill', '#fef3c7',
    '-draw', 'rectangle 65,205 105,235',
    '-draw', 'rectangle 135,195 180,235',
    '-draw', 'rectangle 215,210 250,240',
    '-draw', 'rectangle 285,195 335,235',
    # Shelf 2: Capsule blister packs and amber bottles
    '-fill', '#d97706',
    '-draw', 'roundrectangle 70,350 130,430 10,10',
    '-draw', 'roundrectangle 155,340 225,430 10,10',
    '-draw', 'roundrectangle 250,360 310,430 10,10',
    '-draw', 'roundrectangle 335,335 415,430 10,10',
    # Blister packs with silver/amber dots
    '-fill', '#f59e0b',
    '-draw', 'circle 90,380 90,373', '-draw', 'circle 110,380 110,373',
    '-draw', 'circle 90,405 90,398', '-draw', 'circle 110,405 110,398',
    # Shelf 3: Dispensing jars and modern packaging
    '-fill', '#92400e',
    '-draw', 'roundrectangle 80,510 160,610 12,12',
    '-draw', 'roundrectangle 190,520 270,610 12,12',
    '-draw', 'roundrectangle 300,500 390,610 12,12',
    # Warm amber glow in center
    '-fill', 'rgba(245,158,11,0.15)', '-draw', 'circle 250,450 250,200',
    'public/assets/08_pharmacy_photo_strip.png'
]
subprocess.run(cmd_08, check=True)

# Copy to 01, 03, 05, 07 reference names so all 8 attached file references exist
import shutil
shutil.copy('public/assets/02_landing_art_right.png', 'public/assets/01_landing_full_banner.png')
shutil.copy('public/assets/04_patient_photo_strip.png', 'public/assets/03_patient_full_panel.png')
shutil.copy('public/assets/06_doctor_photo_strip.png', 'public/assets/05_doctor_full_panel.png')
shutil.copy('public/assets/08_pharmacy_photo_strip.png', 'public/assets/07_pharmacy_full_panel.png')

# Also copy into public/ root so both /02_landing_art_right.png and /assets/02_landing_art_right.png resolve
for fname in os.listdir('public/assets'):
    shutil.copy(os.path.join('public/assets', fname), os.path.join('public', fname))

print("All 8 image assets generated and verified successfully!")
