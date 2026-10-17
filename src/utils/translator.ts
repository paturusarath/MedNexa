/**
 * Comprehensive Multi-Lingual Translation Engine for PulseHealth
 * Supports Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Gujarati, Malayalam, Punjabi, English
 */

export type SupportedLanguage =
  | 'English'
  | 'Telugu'
  | 'Hindi'
  | 'Tamil'
  | 'Kannada'
  | 'Marathi'
  | 'Bengali'
  | 'Gujarati'
  | 'Malayalam'
  | 'Punjabi';

// Exact phrase dictionary for all major UI, medical, and navigation terms
export const TRANSLATION_DICTIONARY: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  // Navigation & Tabs
  'Home': {
    Telugu: 'హోమ్',
    Hindi: 'होम',
    Tamil: 'முகப்பு',
    Kannada: 'ಮುಖಪುಟ',
    Marathi: 'मुख्यपृष्ठ',
    Bengali: 'হোম',
    Gujarati: 'હોમ',
    Malayalam: 'ഹോം',
    Punjabi: 'ਹੋਮ',
  },
  'Pharmacy': {
    Telugu: 'ఫార్మసీ',
    Hindi: 'फार्मेसी',
    Tamil: 'மருந்தகம்',
    Kannada: 'ಔಷಧಾಲಯ',
    Marathi: 'फार्मसी',
    Bengali: 'ফার্মেসি',
    Gujarati: 'ફાર્મસી',
    Malayalam: 'ഫാർമസി',
    Punjabi: 'ਫਾਰਮੇਸੀ',
  },
  'Medicines': {
    Telugu: 'ఔషధాలు',
    Hindi: 'दवाइयां',
    Tamil: 'மருந்துகள்',
    Kannada: 'ಔಷಧಿಗಳು',
    Marathi: 'औषधे',
    Bengali: 'ওষুধ',
    Gujarati: 'દવાઓ',
    Malayalam: 'മരുന്നുകൾ',
    Punjabi: 'ਦਵਾਈਆਂ',
  },
  'Consultation': {
    Telugu: 'సంప్రదింపులు',
    Hindi: 'परामर्श',
    Tamil: 'ஆலோசனை',
    Kannada: 'ಸಮಾಲೋಚನೆ',
    Marathi: 'सल्लामसलत',
    Bengali: 'পরামর্শ',
    Gujarati: 'પરામર્શ',
    Malayalam: 'കൺസൾട്ടേഷൻ',
    Punjabi: 'ਸਲਾਹ',
  },
  'Consult Doctor': {
    Telugu: 'డాక్టర్‌ను సంప్రదించండి',
    Hindi: 'डॉक्टर से परामर्श लें',
    Tamil: 'மருத்துவரை அணுகவும்',
    Kannada: 'ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ',
    Marathi: 'डॉक्टरांचा सल्ला घ्या',
    Bengali: 'ডাক্তারের পরামর্শ নিন',
    Gujarati: 'ડોક્ટરની સલાહ લો',
    Malayalam: 'ഡോക്ടറെ കാണുക',
    Punjabi: 'ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ',
  },
  'Doctors': {
    Telugu: 'వైద్యులు',
    Hindi: 'डॉक्टर',
    Tamil: 'மருத்துவர்கள்',
    Kannada: 'ವೈದ್ಯರು',
    Marathi: 'डॉक्टर',
    Bengali: 'ডাক্তাররা',
    Gujarati: 'ડોક્ટર્સ',
    Malayalam: 'ഡോക്ടർമാർ',
    Punjabi: 'ਡਾਕਟਰ',
  },
  'Account': {
    Telugu: 'ఖాతా',
    Hindi: 'खाता',
    Tamil: 'கணக்கு',
    Kannada: 'ಖಾತೆ',
    Marathi: 'खाते',
    Bengali: 'অ্যাকাউন্ট',
    Gujarati: 'ખાતું',
    Malayalam: 'അക്കൗണ്ട്',
    Punjabi: 'ਖਾਤਾ',
  },
  'My Account': {
    Telugu: 'నా ఖాతా',
    Hindi: 'मेरा खाता',
    Tamil: 'எனது கணக்கு',
    Kannada: 'ನನ್ನ ಖಾತೆ',
    Marathi: 'माझे खाते',
    Bengali: 'আমার অ্যাকাউন্ট',
    Gujarati: 'મારું ખાતું',
    Malayalam: 'എന്റെ അക്കൗണ്ട്',
    Punjabi: 'ਮੇਰਾ ਖਾਤਾ',
  },
  'Portal': {
    Telugu: 'పోర్టల్',
    Hindi: 'पोर्टल',
    Tamil: 'போர்டல்',
    Kannada: 'ಪೋರ್ಟಲ್',
    Marathi: 'पोर्टल',
    Bengali: 'পোর্টাল',
    Gujarati: 'પોર્ટલ',
    Malayalam: 'പോർട്ടൽ',
    Punjabi: 'ਪੋਰਟਲ',
  },
  'Patients': {
    Telugu: 'రోగులు',
    Hindi: 'मरीज',
    Tamil: 'நோயாளிகள்',
    Kannada: 'ರೋಗಿಗಳು',
    Marathi: 'रुग्ण',
    Bengali: 'রোগীরা',
    Gujarati: 'દર્દીઓ',
    Malayalam: 'രോഗികൾ',
    Punjabi: 'ਮਰੀਜ਼',
  },
  'Schedule': {
    Telugu: 'షెడ్యూల్',
    Hindi: 'शेड्यूल',
    Tamil: 'அட்டவணை',
    Kannada: 'ವೇಳಾಪಟ್ಟಿ',
    Marathi: 'वेळापत्रक',
    Bengali: 'সময়সূচী',
    Gujarati: 'સમયપત્રક',
    Malayalam: 'ഷെഡ്യൂൾ',
    Punjabi: 'ਸਮਾਂ-ਸਾਰਣੀ',
  },
  'Inventory': {
    Telugu: 'ఇన్వెంటరీ',
    Hindi: 'इन्वेंटरी',
    Tamil: 'சரக்கு இருப்பு',
    Kannada: 'ದಾಸ್ತಾನು',
    Marathi: 'इन्व्हेंटरी',
    Bengali: 'ইনভেন্টরি',
    Gujarati: 'સ્ટોક',
    Malayalam: 'ഇൻവെന്ററി',
    Punjabi: 'ਇਨਵੈਂਟਰੀ',
  },
  'Orders': {
    Telugu: 'ఆర్డర్‌లు',
    Hindi: 'ऑर्डर्स',
    Tamil: 'ஆர்டர்கள்',
    Kannada: 'ಆದೇಶಗಳು',
    Marathi: 'ऑर्डर्स',
    Bengali: 'অর্ডার',
    Gujarati: 'ઓર્ડર્સ',
    Malayalam: 'ഓർഡറുകൾ',
    Punjabi: 'ਆਰਡਰ',
  },

  // Role Names & Badges
  'Patient Account': {
    Telugu: 'రోగి ఖాతా',
    Hindi: 'रोगी खाता',
    Tamil: 'நோயாளி கணக்கு',
    Kannada: 'ರೋಗಿಯ ಖಾತೆ',
    Marathi: 'रुग्ण खाते',
    Bengali: 'রোগীর অ্যাকাউন্ট',
    Gujarati: 'દર્દી ખાતું',
    Malayalam: 'രോഗി അക്കൗണ്ട്',
    Punjabi: 'ਮਰੀਜ਼ ਖਾਤਾ',
  },
  'Doctor Console': {
    Telugu: 'డాక్టర్ కన్సోల్',
    Hindi: 'डॉक्टर कंसोल',
    Tamil: 'மருத்துவர் பணியகம்',
    Kannada: 'ವೈದ್ಯರ ಕನ್ಸೋಲ್',
    Marathi: 'डॉक्टर कन्सोल',
    Bengali: 'ডাক্তার কনসোল',
    Gujarati: 'ડોક્ટર કન્સોલ',
    Malayalam: 'ഡോക്ടർ കൺസോൾ',
    Punjabi: 'ਡਾਕਟਰ ਕੰਸੋਲ',
  },
  'Pharmacy Dispensing': {
    Telugu: 'ఫార్మసీ పంపిణీ',
    Hindi: 'फार्मेसी वितरण',
    Tamil: 'மருந்தக விநியோகம்',
    Kannada: 'ಔಷಧ ವಿತರಣೆ',
    Marathi: 'फार्मसी वितरण',
    Bengali: 'ফার্মেসি বিতরণ',
    Gujarati: 'ફાર્મસી વિતરણ',
    Malayalam: 'ഫാർമസി വിതരണം',
    Punjabi: 'ਫਾਰਮੇਸੀ ਵੰਡ',
  },
  'Admin Desk': {
    Telugu: 'అడ్మిన్ డెస్క్',
    Hindi: 'व्यवस्थापक डेस्क',
    Tamil: 'நிர்வாக மேசை',
    Kannada: 'ನಿರ್ವಾಹಕ ಡೆಸ್ಕ್',
    Marathi: 'अॅडमिन डेस्क',
    Bengali: 'অ্যাডমিন ডেস্ক',
    Gujarati: 'એડમિન ડેસ્ક',
    Malayalam: 'അഡ്മിൻ ഡെസ്ക്',
    Punjabi: 'ਐਡਮਿਨ ਡੈਸਕ',
  },

  // Common Actions & Buttons
  'General Information': {
    Telugu: 'సాధారణ సమాచారం',
    Hindi: 'सामान्य जानकारी',
    Tamil: 'பொதுவான தகவல்',
    Kannada: 'ಸಾಮಾನ್ಯ ಮಾಹಿತಿ',
    Marathi: 'सामान्य माहिती',
    Bengali: 'সাধারণ তথ্য',
    Gujarati: 'સામાન્ય માહિતી',
    Malayalam: 'പൊതുവിവരങ്ങൾ',
    Punjabi: 'ਆਮ ਜਾਣਕਾਰੀ',
  },
  'Full Name': {
    Telugu: 'పూర్తి పేరు',
    Hindi: 'पूरा नाम',
    Tamil: 'முழு பெயர்',
    Kannada: 'ಪೂರ್ಣ ಹೆಸರು',
    Marathi: 'पूर्ण नाव',
    Bengali: 'পুরো নাম',
    Gujarati: 'પૂરું નામ',
    Malayalam: 'മുഴുവൻ പേര്',
    Punjabi: 'ਪੂਰਾ ਨਾਮ',
  },
  'Email Address': {
    Telugu: 'ఇమెయిల్ చిరునామా',
    Hindi: 'ईमेल पता',
    Tamil: 'மின்னஞ்சல் முகவரி',
    Kannada: 'ಇಮೇಲ್ ವಿಳಾಸ',
    Marathi: 'ईमेल पत्ता',
    Bengali: 'ইমেইল ঠিকানা',
    Gujarati: 'ઇમેઇલ સરનામું',
    Malayalam: 'ഇമെയിൽ വിലാസം',
    Punjabi: 'ਈਮੇਲ ਪਤਾ',
  },
  'Phone Number': {
    Telugu: 'ఫోన్ నంబర్',
    Hindi: 'फ़ोन नंबर',
    Tamil: 'தொலைபேசி எண்',
    Kannada: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
    Marathi: 'फोन नंबर',
    Bengali: 'ফোন নম্বর',
    Gujarati: 'ફોન નંબર',
    Malayalam: 'ഫോൺ നമ്പർ',
    Punjabi: 'ਫ਼ੋਨ ਨੰਬਰ',
  },
  'Mobile Number': {
    Telugu: 'మొబైల్ నంబర్',
    Hindi: 'मोबाइल नंबर',
    Tamil: 'கைபேசி எண்',
    Kannada: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    Marathi: 'मोबाईल नंबर',
    Bengali: 'মোবাইল নম্বর',
    Gujarati: 'મોબાઇલ નંબર',
    Malayalam: 'മൊബൈൽ നമ്പർ',
    Punjabi: 'ਮੋਬਾਈਲ ਨੰਬਰ',
  },
  'Language Selected': {
    Telugu: 'ఎంచుకున్న భాష',
    Hindi: 'चुनी गई भाषा',
    Tamil: 'தேர்ந்தெடுக்கப்பட்ட மொழி',
    Kannada: 'ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆ',
    Marathi: 'निवडलेली भाषा',
    Bengali: 'নির্বাচিত ভাষা',
    Gujarati: 'પસંદ કરેલ ભાષા',
    Malayalam: 'തിരഞ്ഞെടുത്ത ഭാഷ',
    Punjabi: 'ਚੁਣੀ ਗਈ ਭਾਸ਼ਾ',
  },
  'Save Profile Changes': {
    Telugu: 'ప్రొఫైల్ మార్పులను సేవ్ చేయండి',
    Hindi: 'प्रोफ़ाइल परिवर्तन सहेजें',
    Tamil: 'சுயவிவர மாற்றங்களைச் சேமிക്കുക',
    Kannada: 'ಪ್ರೊಫೈಲ್ ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    Marathi: 'प्रोफाइल बदल जतन करा',
    Bengali: 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন',
    Gujarati: 'પ્રોફાઇલ ફેરફારો સાચવો',
    Malayalam: 'പ്രൊഫൈൽ മാറ്റങ്ങൾ സേവ് ചെയ്യുക',
    Punjabi: 'ਪ੍ਰੋਫਾਈਲ ਬਦਲਾਅ ਸੁਰੱਖਿਅਤ ਕਰੋ',
  },
  'Saving Profile Changes...': {
    Telugu: 'ప్రొఫైల్ మార్పులు సేవ్ అవుతున్నాయి...',
    Hindi: 'प्रोफ़ाइल परिवर्तन सहेजे जा रहे हैं...',
    Tamil: 'சேமிக்கப்படுகிறது...',
    Kannada: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    Marathi: 'जतन करत आहे...',
    Bengali: 'সংরক্ষণ করা হচ্ছে...',
    Gujarati: 'સાચવી રહ્યું છે...',
    Malayalam: 'സേവ് ചെയ്യുന്നു...',
    Punjabi: 'ਸੇਵ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
  },
  'Cancel': {
    Telugu: 'రద్దు చేయండి',
    Hindi: 'रद्द करें',
    Tamil: 'ரத்து செய்',
    Kannada: 'ರದ್ದುಮಾಡಿ',
    Marathi: 'रद्द करा',
    Bengali: 'বাতিল',
    Gujarati: 'રદ કરો',
    Malayalam: 'റദ്ദാക്കുക',
    Punjabi: 'ਰੱਦ ਕਰੋ',
  },
  'Save': {
    Telugu: 'సేవ్ చేయండి',
    Hindi: 'सहेजें',
    Tamil: 'சேமி',
    Kannada: 'ಉಳಿಸಿ',
    Marathi: 'जतन करा',
    Bengali: 'সংরক্ষণ',
    Gujarati: 'સાચવો',
    Malayalam: 'സേവ്',
    Punjabi: 'ਸੇਵ ਕਰੋ',
  },
  'Edit': {
    Telugu: 'సవరించండి',
    Hindi: 'संपादित करें',
    Tamil: 'திருத்து',
    Kannada: 'ತಿದ್ದು',
    Marathi: 'संपादित करा',
    Bengali: 'সম্পাদনা',
    Gujarati: 'સંપાદિત કરો',
    Malayalam: 'എഡിറ്റ്',
    Punjabi: 'ਸੰਪਾਦਿਤ ਕਰੋ',
  },
  'Close': {
    Telugu: 'మూసివేయండి',
    Hindi: 'बंद करें',
    Tamil: 'மூடு',
    Kannada: 'ಮುಚ್ಚಿ',
    Marathi: 'बंद करा',
    Bengali: 'বন্ধ করুন',
    Gujarati: 'બંધ કરો',
    Malayalam: 'അടയ്ക്കുക',
    Punjabi: 'ਬੰਦ ਕਰੋ',
  },
  'Logout': {
    Telugu: 'లాగ్ అవుట్',
    Hindi: 'लॉग आउट',
    Tamil: 'வெளியேறு',
    Kannada: 'ಲಾಗ್ ಔಟ್',
    Marathi: 'लॉग आउट',
    Bengali: 'লগ আউট',
    Gujarati: 'લૉગ આઉટ',
    Malayalam: 'ലോഗ് ഔട്ട്',
    Punjabi: 'ਲਾਗ ਆਉਟ',
  },
  'Search': {
    Telugu: 'శోధించండి',
    Hindi: 'खोजें',
    Tamil: 'தேடுக',
    Kannada: 'ಹುಡುಕಿ',
    Marathi: 'शोधा',
    Bengali: 'অনুসন্ধান',
    Gujarati: 'શોધો',
    Malayalam: 'തിരയുക',
    Punjabi: 'ਖੋਜੋ',
  },
  'Upload Photo': {
    Telugu: 'ఫోటో అప్‌లోడ్ చేయండి',
    Hindi: 'फोटो अपलोड करें',
    Tamil: 'புகைப்படம் பதிவேற்றுக',
    Kannada: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    Marathi: 'फोटो अपलोड करा',
    Bengali: 'ছবি আপলোড করুন',
    Gujarati: 'ફોટો અપલોડ કરો',
    Malayalam: 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    Punjabi: 'ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
  },
  'Upload Picture': {
    Telugu: 'చిత్రం అప్‌లోడ్ చేయండి',
    Hindi: 'चित्र अपलोड करें',
    Tamil: 'படம் பதிவேற்றுக',
    Kannada: 'ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    Marathi: 'चित्र अपलोड करा',
    Bengali: 'ছবি আপলোড করুন',
    Gujarati: 'ચિત્ર અપલોડ કરો',
    Malayalam: 'ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
    Punjabi: 'ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ',
  },
  'From your system': {
    Telugu: 'మీ సిస్టమ్ నుండి',
    Hindi: 'अपने सिस्टम से',
    Tamil: 'உங்கள் கணினியிலிருந்து',
    Kannada: 'ನಿಮ್ಮ ಸಿಸ್ಟಮ್‌ನಿಂದ',
    Marathi: 'तुमच्या कॉम्प्युटरवरून',
    Bengali: 'আপনার সিস্টেম থেকে',
    Gujarati: 'તમારા સિસ્ટમમાંથી',
    Malayalam: 'നിങ്ങളുടെ സിസ്റ്റത്തിൽ നിന്ന്',
    Punjabi: 'ਤੁਹਾਡੇ ਸਿਸਟਮ ਤੋਂ',
  },

  // Clinical & Portal Features
  'Find Doctors, Medicines & Healthcare': {
    Telugu: 'వైద్యులు, ఔషధాలు & ఆరోగ్య సంరక్షణను కనుగొనండి',
    Hindi: 'डॉक्टर, दवाइयां और स्वास्थ्य सेवाएं खोजें',
    Tamil: 'மருத்துவர்கள், மருந்துகள் & சுகாதாரத்தைக் கண்டறியவும்',
    Kannada: 'ವೈದ್ಯರು, ಔಷಧಿಗಳು ಮತ್ತು ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ',
    Marathi: 'डॉक्टर, औषधे आणि आरोग्य सेवा शोधा',
    Bengali: 'ডাক্তার, ওষুধ এবং স্বাস্থ্যসেবা খুঁজুন',
    Gujarati: 'ડોકટરો, દવાઓ અને આરોગ્યસંભાળ શોધો',
    Malayalam: 'ഡോക്ടർമാരെയും മരുന്നുകളെയും കണ്ടെത്തുക',
    Punjabi: 'ਡਾਕਟਰ, ਦਵਾਈਆਂ ਅਤੇ ਸਿਹਤ ਸੰਭਾਲ ਲੱਭੋ',
  },
  'Instant Video Consultation': {
    Telugu: 'తక్షణ వీడియో సంప్రదింపులు',
    Hindi: 'त्वरित वीडियो परामर्श',
    Tamil: 'உடனடி வீடியோ ஆலோசனை',
    Kannada: 'ತ್ವರಿತ ವೀಡಿಯೊ ಸಮಾಲೋಚನೆ',
    Marathi: 'झटपट व्हिडिओ सल्लामसलत',
    Bengali: 'তাত্ক্ষণিক ভিডিও পরামর্শ',
    Gujarati: 'ત્વરિત વિડિઓ પરામર્શ',
    Malayalam: 'തൽക്ഷണ വീഡിയോ കൺസൾട്ടേഷൻ',
    Punjabi: 'ਤੁਰੰਤ ਵੀਡੀਓ ਸਲਾਹ',
  },
  'Verified Online Pharmacy': {
    Telugu: 'ధృవీకరించబడిన ఆన్‌లైన్ ఫార్మసీ',
    Hindi: 'सत्यापित ऑनलाइन फ़ार्मेसी',
    Tamil: 'சரிபார்க்கப்பட்ட ஆன்லைன் மருந்தகம்',
    Kannada: 'ಪರಿಶೀಲಿಸಿದ ಆನ್‌ಲೈನ್ ಫಾರ್ಮಸಿ',
    Marathi: 'पडताळलेली ऑनलाइन फार्मसी',
    Bengali: 'যাচাইকৃত অনলাইন ফার্মেসি',
    Gujarati: 'ચકાસાયેલ ઓનલાઇન ફાર્મસી',
    Malayalam: 'സ്ഥിരീകരിച്ച ഓൺലൈൻ ഫാർമസി',
    Punjabi: 'ਪ੍ਰਮਾਣਿਤ ਔਨਲਾਈਨ ਫਾਰਮੇਸੀ',
  },
  'Electronic Health Records': {
    Telugu: 'ఎలక్ట్రానిక్ హెల్త్ రికార్డులు',
    Hindi: 'इलेक्ट्रॉनिक स्वास्थ्य रिकॉर्ड',
    Tamil: 'மின்னணு சுகாதார பதிவுகள்',
    Kannada: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು',
    Marathi: 'इलेक्ट्रॉनिक आरोग्य रेकॉर्ड',
    Bengali: 'ইলেকট্রনিক স্বাস্থ্য রেকর্ড',
    Gujarati: 'ઇલેક્ટ્રોનિક આરોગ્ય રેકોર્ડ્સ',
    Malayalam: 'ഇലക്ട്രോണിക് ഹെൽത്ത് റെക്കോർഡുകൾ',
    Punjabi: 'ਇਲੈਕਟ੍ਰਾਨਿਕ ਸਿਹਤ ਰਿਕਾਰਡ',
  },
  'Chronic Care': {
    Telugu: 'దీర్ఘకాలిక సంరక్షణ',
    Hindi: 'क्रोनिक केयर',
    Tamil: 'நீண்டகால பராமரிப்பு',
    Kannada: 'ದೀರ್ಘಕಾಲದ ಆರೈಕೆ',
    Marathi: 'तीव्र आजार काळजी',
    Bengali: 'দীর্ঘস্থায়ী যত্ন',
    Gujarati: 'ક્રોનિક કેર',
    Malayalam: 'ക്രോണിക് കെയർ',
    Punjabi: 'ਕ੍ਰੋਨਿਕ ਕੇਅਰ',
  },
  'Pill Tracker': {
    Telugu: 'టాబ్లెట్ ట్రాకర్',
    Hindi: 'दवा ट्रैकर',
    Tamil: 'மாத்திரை கண்காணிப்பாளர்',
    Kannada: 'ಮಾತ್ರೆ ಟ್ರ್ಯಾಕರ್',
    Marathi: 'गोळ्यांचा मागोवा',
    Bengali: 'পিল ট্র্যাকার',
    Gujarati: 'ગોળી ટ્રેકર',
    Malayalam: 'ഗുളിക ട്രാക്കർ',
    Punjabi: 'ਗੋਲੀਆਂ ਦਾ ਟਰੈਕਰ',
  },
  'Wellness AI': {
    Telugu: 'వెల్నెస్ AI',
    Hindi: 'वेलनेस एआई',
    Tamil: 'வெல்னஸ் AI',
    Kannada: 'ವೆಲ್ನೆಸ್ ಎಐ',
    Marathi: 'आरोग्य AI',
    Bengali: 'ওয়েলনেস এআই',
    Gujarati: 'વેલનેસ એઆઈ',
    Malayalam: 'വെൽനസ് എഐ',
    Punjabi: 'ਵੈਲਨੈਸ ਏਆਈ',
  },
  'Security & Compliance': {
    Telugu: 'భద్రత & నిబంధనలు',
    Hindi: 'सुरक्षा और अनुपालन',
    Tamil: 'பாதுகாப்பு & இணக்கம்',
    Kannada: 'ಭದ್ರತೆ ಮತ್ತು ಅನುಸರಣೆ',
    Marathi: 'सुरक्षा आणि अनुपालन',
    Bengali: 'নিরাপত্তা ও সম্মতি',
    Gujarati: 'સુરક્ષા અને પાલન',
    Malayalam: 'സുരക്ഷയും അനുസരണവും',
    Punjabi: 'ਸੁਰੱਖਿਆ ਅਤੇ ਪਾਲਣਾ',
  },
  'Book Appointment': {
    Telugu: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    Hindi: 'अपॉइंटमेंट बुक करें',
    Tamil: 'முன்பதிவு செய்க',
    Kannada: 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
    Marathi: 'अपॉइंटमेंट बुक करा',
    Bengali: 'অ্যাপয়েন্টমেন্ট বুক করুন',
    Gujarati: 'એપોઇન્ટમેન્ટ બુક કરો',
    Malayalam: 'അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക',
    Punjabi: 'ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ',
  },
  'Order Medicines': {
    Telugu: 'మందులు ఆర్డర్ చేయండి',
    Hindi: 'दवाइयां ऑर्डर करें',
    Tamil: 'மருந்துகளை ஆர்டர் செய்க',
    Kannada: 'ಔಷಧಿಗಳನ್ನು ಆರ್ಡರ್ ಮಾಡಿ',
    Marathi: 'औषधे ऑर्डर करा',
    Bengali: 'ওষুধ অর্ডার করুন',
    Gujarati: 'દવાઓ ઓર્ડર કરો',
    Malayalam: 'മരുന്നുകൾ ഓർഡർ ചെയ്യുക',
    Punjabi: 'ਦਵਾਈਆਂ ਆਰਡਰ ਕਰੋ',
  },
  'Emergency CDSS': {
    Telugu: 'అత్యవసర ట్రయేజ్ డెస్క్',
    Hindi: 'आपातकालीन ट्राइएज डेस्क',
    Tamil: 'அவசர சிகிச்சை மேசை',
    Kannada: 'ತುರ್ತು ಚಿಕಿತ್ಸಾ ಡೆಸ್ಕ್',
    Marathi: 'तातडीचे ट्राइएज डेस्क',
    Bengali: 'জরুরী ট্রায়াজ ডেস্ক',
    Gujarati: 'ઇમરજન્સી ટ્રાયેજ ડેસ્ક',
    Malayalam: 'അടിയന്തര ട്രയേജ് ഡെസ്ക്',
    Punjabi: 'ਐਮਰਜੈਂਸੀ ਟ੍ਰਾਈਜ ਡੈਸਕ',
  },
  'Write Prescription': {
    Telugu: 'ప్రిస్క్రిప్షన్ రాయండి',
    Hindi: 'प्रिस्क्रिप्शन लिखें',
    Tamil: 'மருந்துச் சீட்டு எழுதுக',
    Kannada: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಬರೆಯಿರಿ',
    Marathi: 'प्रिस्क्रिप्शन लिहा',
    Bengali: 'প্রেসক্রিপশন লিখুন',
    Gujarati: 'પ્રિસ્ક્રિપ્શન લખો',
    Malayalam: 'കുറിപ്പടി എഴുതുക',
    Punjabi: 'ਨੁਸਖ਼ਾ ਲਿਖੋ',
  },
  'Digital Prescriptions': {
    Telugu: 'డిజిటల్ ప్రిస్క్రిప్షన్లు',
    Hindi: 'डिजिटल प्रिस्क्रिप्शन',
    Tamil: 'டிஜிட்டல் மருந்துச் சீட்டுகள்',
    Kannada: 'ಡಿಜಿಟಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ಗಳು',
    Marathi: 'डिजिटल प्रिस्क्रिप्शन',
    Bengali: 'ডিজিটাল প্রেসক্রিপশন',
    Gujarati: 'ડિજિટલ પ્રિસ્ક્રિપ્શન્સ',
    Malayalam: 'ഡിജിറ്റൽ കുറിപ്പടികൾ',
    Punjabi: 'ਡਿਜੀਟਲ ਨੁਸਖ਼ੇ',
  },
  'Active Prescriptions': {
    Telugu: 'యాక్టివ్ ప్రిస్క్రిప్షన్లు',
    Hindi: 'सक्रिय प्रिस्क्रिप्शन',
    Tamil: 'செயலில் உள்ள மருந்துச் சீட்டுகள்',
    Kannada: 'ಸಕ್ರಿಯ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ಗಳು',
    Marathi: 'सक्रिय प्रिस्क्रिप्शन',
    Bengali: 'সক্রিয় প্রেসক্রিপশন',
    Gujarati: 'સક્રિય પ્રિસ્ક્રિપ્શન્સ',
    Malayalam: 'സജീവ കുറിപ്പടികൾ',
    Punjabi: 'ਸਰਗਰਮ ਨੁਸਖ਼ੇ',
  },
  'Quick Actions': {
    Telugu: 'త్వరిత చర్యలు',
    Hindi: 'त्वरित क्रियाएं',
    Tamil: 'விரைவு நடவடிக்கைகள்',
    Kannada: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    Marathi: 'द्रुत कृती',
    Bengali: 'দ্রুত কর্ম',
    Gujarati: 'ઝડપી ક્રિયાઓ',
    Malayalam: 'ദ്രുത പ്രവർത്തനങ്ങൾ',
    Punjabi: 'ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ',
  },
  'Recent Activity': {
    Telugu: 'ఇటీవలి కార్యాచరణ',
    Hindi: 'हाल की गतिविधि',
    Tamil: 'சமீபத்திய செயல்பாடு',
    Kannada: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
    Marathi: 'अलीकडील क्रियाकलाप',
    Bengali: 'সাম্প্রতিক কার্যকলাপ',
    Gujarati: 'તાજેતરની પ્રવૃત્તિ',
    Malayalam: 'സമീപകാല പ്രവർത്തനം',
    Punjabi: 'ਹਾਲੀਆ ਗਤੀਵਿਧੀ',
  },
  'Cart': {
    Telugu: 'కార్ట్',
    Hindi: 'कार्ट',
    Tamil: 'கூடை',
    Kannada: 'ಬುಟ್ಟಿ',
    Marathi: 'कार्ट',
    Bengali: 'কার্ট',
    Gujarati: 'કાર્ટ',
    Malayalam: 'കാർട്ട്',
    Punjabi: 'ਕਾਰਟ',
  },
  'Checkout': {
    Telugu: 'చెక్‌అవుట్',
    Hindi: 'चेकआउट',
    Tamil: 'செக்அவுட்',
    Kannada: 'ಚೆಕ್ಔಟ್',
    Marathi: 'चेकआउट',
    Bengali: 'চেকআউট',
    Gujarati: 'ચેકઆઉટ',
    Malayalam: 'ചെക്ക്ഔട്ട്',
    Punjabi: 'ਚੈੱਕਆਉਟ',
  },
  'Add to Cart': {
    Telugu: 'కార్ట్‌కు జోడించండి',
    Hindi: 'कार्ट में जोड़ें',
    Tamil: 'கூடையில் சேர்க்கவும்',
    Kannada: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    Marathi: 'कार्टमध्ये जोडा',
    Bengali: 'কার্টে যোগ করুন',
    Gujarati: 'કાર્ટમાં ઉમેરો',
    Malayalam: 'കാർട്ടിലേക്ക് ചേർക്കുക',
    Punjabi: 'ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ',
  },
  'Status': {
    Telugu: 'స్థితి',
    Hindi: 'स्थिति',
    Tamil: 'நிலை',
    Kannada: 'ಸ್ಥಿತಿ',
    Marathi: 'स्थिती',
    Bengali: 'অবস্থা',
    Gujarati: 'સ્થિતિ',
    Malayalam: 'നില',
    Punjabi: 'ਸਥਿਤੀ',
  },
  'Active': {
    Telugu: 'క్రియాశీలం',
    Hindi: 'सक्रिय',
    Tamil: 'செயலில்',
    Kannada: 'ಸಕ್ರಿಯ',
    Marathi: 'सक्रिय',
    Bengali: 'সক্রিয়',
    Gujarati: 'સક્રિય',
    Malayalam: 'സജീവം',
    Punjabi: 'ਸਰਗਰਮ',
  },
  'Pending': {
    Telugu: 'పెండింగ్‌లో ఉంది',
    Hindi: 'लंबित',
    Tamil: 'நிலுவையில்',
    Kannada: 'ಬಾಕಿ ಉಳಿದಿದೆ',
    Marathi: 'प्रलंबित',
    Bengali: 'মুলতুবি',
    Gujarati: 'બાકી',
    Malayalam: 'തീർപ്പുകൽപ്പിക്കാത്തത്',
    Punjabi: 'ਬਕਾਇਆ',
  },
  'Completed': {
    Telugu: 'పూర్తయింది',
    Hindi: 'पूर्ण हुआ',
    Tamil: 'முடிந்தது',
    Kannada: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    Marathi: 'पूर्ण झाले',
    Bengali: 'সম্পন্ন',
    Gujarati: 'પૂર્ણ થયું',
    Malayalam: 'പൂർത്തിയായി',
    Punjabi: 'ਪੂਰਾ ਹੋਇਆ',
  },
  'Notifications': {
    Telugu: 'నోటిఫికేషన్‌లు',
    Hindi: 'सूचनाएं',
    Tamil: 'அறிவிப்புகள்',
    Kannada: 'ಅಧಿಸೂಚನೆಗಳು',
    Marathi: 'सूचना',
    Bengali: 'বিজ্ঞপ্তি',
    Gujarati: 'સૂચનાઓ',
    Malayalam: 'അറിയിപ്പുകൾ',
    Punjabi: 'ਸੂਚਨਾਵਾਂ',
  },
  'Print': {
    Telugu: 'ప్రింట్ చేయండి',
    Hindi: 'प्रिंट करें',
    Tamil: 'அச்சிடுக',
    Kannada: 'ಮುದ್ರಿಸಿ',
    Marathi: 'प्रिंट करा',
    Bengali: 'প্রিন্ট করুন',
    Gujarati: 'પ્રિન્ટ કરો',
    Malayalam: 'പ്രിന്റ് ചെയ്യുക',
    Punjabi: 'ਪ੍ਰਿੰਟ ਕਰੋ',
  },
  'Download': {
    Telugu: 'డౌన్‌లోడ్ చేయండి',
    Hindi: 'डाउनलोड करें',
    Tamil: 'பதிவிறக்குக',
    Kannada: 'ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    Marathi: 'डाउनलोड करा',
    Bengali: 'ডাউনলোড করুন',
    Gujarati: 'ડાઉનલોડ કરો',
    Malayalam: 'ഡൗൺലോഡ് ചെയ്യുക',
    Punjabi: 'ਡਾਊਨਲੋਡ ਕਰੋ',
  },
  'View Details': {
    Telugu: 'వివరాలను చూడండి',
    Hindi: 'विवरण देखें',
    Tamil: 'விவரங்களைப் பார்க்கவும்',
    Kannada: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    Marathi: 'तपशील पहा',
    Bengali: 'বিবরণ দেখুন',
    Gujarati: 'વિગતો જુઓ',
    Malayalam: 'വിശദാംശങ്ങൾ കാണുക',
    Punjabi: 'ਵੇਰਵੇ ਦੇਖੋ',
  },
  'Overview': {
    Telugu: 'అవలోకనం',
    Hindi: 'अवलोकन',
    Tamil: 'கண்ணோட்டம்',
    Kannada: 'ಅವಲೋಕನ',
    Marathi: 'आढावा',
    Bengali: 'সংক্ষিপ্ত বিবরণ',
    Gujarati: 'વિહંગાવલોકન',
    Malayalam: 'അവലോകനം',
    Punjabi: 'ਸੰਖੇਪ ਜਾਣਕਾਰੀ',
  },
  'Clinical Dashboard': {
    Telugu: 'క్లినికల్ డ్యాష్‌బోర్డ్',
    Hindi: 'क्लिनिकल डैशबोर्ड',
    Tamil: 'மருத்துவ கட்டுப்பாட்டு பலகை',
    Kannada: 'ಕ್ಲಿನಿಕಲ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    Marathi: 'क्लिनिकल डॅशबोर्ड',
    Bengali: 'ক্লিনিকাল ড্যাশবোর্ড',
    Gujarati: 'ક્લિનિકલ ડેશબોર્ડ',
    Malayalam: 'ക്ലിനിക്കൽ ഡാഷ്‌ബോർഡ്',
    Punjabi: 'ਕਲੀਨਿਕਲ ਡੈਸ਼ਬੋਰਡ',
  },
  'Smart Schedule': {
    Telugu: 'స్మార్ట్ షెడ్యూల్',
    Hindi: 'स्मार्ट शेड्यूल',
    Tamil: 'ஸ்மார்ட் அட்டவணை',
    Kannada: 'ಸ್ಮಾರ್ಟ್ ವೇಳಾಪಟ್ಟಿ',
    Marathi: 'स्मार्ट वेळापत्रक',
    Bengali: 'স্মার্ট সময়সূচী',
    Gujarati: 'સ્માર્ટ શેડ્યૂલ',
    Malayalam: 'സ്മാർട്ട് ഷെഡ്യൂൾ',
    Punjabi: 'ਸਮਾਰਟ ਸਮਾਂ-ਸਾਰਣੀ',
  },
  'Patient CDSS': {
    Telugu: 'రోగి CDSS రికార్డులు',
    Hindi: 'रोगी सीडीएसएस रिकॉर्ड',
    Tamil: 'நோயாளி CDSS பதிவுகள்',
    Kannada: 'ರೋಗಿ ಸಿಡಿಎಸ್‌ಎಸ್ ದಾಖಲೆಗಳು',
    Marathi: 'रुग्ण सीडीएसएस रेकॉर्ड',
    Bengali: 'রোগী সিডিএসএস রেকর্ড',
    Gujarati: 'દર્દી સીડીએસએસ રેકોર્ડ્સ',
    Malayalam: 'രോഗി സിഡിഎസ്എസ് റെക്കോർഡുകൾ',
    Punjabi: 'ਮਰੀਜ਼ ਸੀਡੀਐਸਐਸ ਰਿਕਾਰਡ',
  },
  'Clinical Rx Desk': {
    Telugu: 'క్లినికల్ ప్రిస్క్రిప్షన్ డెస్క్',
    Hindi: 'क्लिनिकल प्रिस्क्रिप्शन डेस्क',
    Tamil: 'மருத்துவ மருந்துச் சீட்டு மேசை',
    Kannada: 'ಕ್ಲಿನಿಕಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಡೆಸ್ಕ್',
    Marathi: 'क्लिनिकल प्रिस्क्रिप्शन डेस्क',
    Bengali: 'ক্লিনিকাল প্রেসক্রিপশন ডেস্ক',
    Gujarati: 'ક્લિનિકલ પ્રિસ્ક્રિપ્શન ડેસ્ક',
    Malayalam: 'ക്ലിനിക്കൽ കുറിപ്പടി ഡെസ്ക്',
    Punjabi: 'ਕਲੀਨਿਕਲ ਨੁਸਖ਼ਾ ਡੈਸਕ',
  },
  'Clinical Tools': {
    Telugu: 'క్లినికల్ సాధనాలు',
    Hindi: 'क्लिनिकल उपकरण',
    Tamil: 'மருத்துவக் கருவிகள்',
    Kannada: 'ಕ್ಲಿನಿಕಲ್ ಉಪಕರಣಗಳು',
    Marathi: 'क्लिनिकल टूल्स',
    Bengali: 'ক্লিনিকাল টুলস',
    Gujarati: 'ક્લિનિકલ ટૂલ્સ',
    Malayalam: 'ക്ലിനിക്കൽ ടൂളുകൾ',
    Punjabi: 'ਕਲੀਨਿਕਲ ਟੂਲ',
  },
  'Dispensing Orders': {
    Telugu: 'మందుల పంపిణీ ఆర్డర్‌లు',
    Hindi: 'दवा वितरण आदेश',
    Tamil: 'மருந்து விநியோக ஆர்டர்கள்',
    Kannada: 'ಔಷಧ ವಿತರಣಾ ಆದೇಶಗಳು',
    Marathi: 'औषध वाटप ऑर्डर्स',
    Bengali: 'ওষুধ বিতরণ অর্ডার',
    Gujarati: 'દવા વિતરણ ઓર્ડર',
    Malayalam: 'മരുന്ന് വിതരണ ഓർഡറുകൾ',
    Punjabi: 'ਦਵਾਈ ਵੰਡ ਦੇ ਆਰਡਰ',
  },
  'Pharmacy Inventory': {
    Telugu: 'ఫార్మసీ ఇన్వెంటరీ',
    Hindi: 'फार्मेसी इन्वेंटरी',
    Tamil: 'மருந்தக சரக்கு இருப்பு',
    Kannada: 'ಔಷಧಾಲಯ ದಾಸ್ತಾನು',
    Marathi: 'फार्मसी इन्व्हेंटरी',
    Bengali: 'ফার্মেসি ইনভেন্টরি',
    Gujarati: 'ફાર્મસી ઇન્વેન્ટરી',
    Malayalam: 'ഫാർമസി ഇൻവെന്ററി',
    Punjabi: 'ਫਾਰਮੇਸੀ ਇਨਵੈਂਟਰੀ',
  },
  'Medicine Returns & Refunds': {
    Telugu: 'మందుల రిటర్న్లు & రీఫండ్లు',
    Hindi: 'दवा वापसी और रिफंड',
    Tamil: 'மருந்து திருப்பங்கள் & பணத்தைத் திரும்பப் பெறுதல்',
    Kannada: 'ಔಷಧಿ ಹಿಂತಿರುಗಿಸುವಿಕೆ ಮತ್ತು ಮರುಪಾವತಿ',
    Marathi: 'औषध परतावा आणि रिफंड',
    Bengali: 'ওষুধ ফেরত এবং ফেরত',
    Gujarati: 'દવા વળતર અને રિફંડ',
    Malayalam: 'മരുന്ന് റിട്ടേണുകളും റീഫണ്ടുകളും',
    Punjabi: 'ਦਵਾਈ ਵਾਪਸੀ ਅਤੇ ਰਿਫੰਡ',
  },
  'Process Return': {
    Telugu: 'రిటర్న్ ప్రాసెస్ చేయండి',
    Hindi: 'वापसी प्रोसेस करें',
    Tamil: 'திருப்பல் செயல்முறை',
    Kannada: 'ಹಿಂತಿರುಗಿಸುವಿಕೆಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ',
    Marathi: 'परतावा प्रक्रिया करा',
    Bengali: 'রিটার্ন প্রক্রিয়া করুন',
    Gujarati: 'વળતર પ્રક્રિયા કરો',
    Malayalam: 'റിട്ടേൺ പ്രോസസ്സ് ചെയ്യുക',
    Punjabi: 'ਵਾਪਸੀ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕਰੋ',
  },
  'Return Medicine': {
    Telugu: 'మందును రిటర్న్ చేయండి',
    Hindi: 'दवा वापस करें',
    Tamil: 'மருந்தை திருப்பித் தருக',
    Kannada: 'ಔಷಧಿಯನ್ನು ಹಿಂತಿರುಗಿಸಿ',
    Marathi: 'औषध परत करा',
    Bengali: 'ওষুধ ফেরত দিন',
    Gujarati: 'દવા પરત કરો',
    Malayalam: 'മരുന്ന് തിരികെ നൽകുക',
    Punjabi: 'ਦਵਾਈ ਵਾਪਸ ਕਰੋ',
  },
  'Available Stock': {
    Telugu: 'అందుబాటులో ఉన్న స్టాక్',
    Hindi: 'उपलब्ध स्टॉक',
    Tamil: 'இருப்பு உள்ளது',
    Kannada: 'ಲಭ್ಯವಿರುವ ದಾಸ್ತಾನು',
    Marathi: 'उपलब्ध साठा',
    Bengali: 'উপলব্ধ স্টক',
    Gujarati: 'ઉપલબ્ધ સ્ટોક',
    Malayalam: 'ലഭ്യമായ സ്റ്റോക്ക്',
    Punjabi: 'ਉਪਲਬਧ ਸਟਾਕ',
  },
  'Batch Number': {
    Telugu: 'బ్యాచ్ నంబర్',
    Hindi: 'बैच नंबर',
    Tamil: 'தொகுதி எண்',
    Kannada: 'ಬ್ಯಾಚ್ ಸಂಖ್ಯೆ',
    Marathi: 'बॅच नंबर',
    Bengali: 'ব্যাচ নম্বর',
    Gujarati: 'બેચ નંબર',
    Malayalam: 'ബാച്ച് നമ്പർ',
    Punjabi: 'ਬੈਚ ਨੰਬਰ',
  },
  'Expiry Date': {
    Telugu: 'గడువు తేదీ',
    Hindi: 'समाप्ति तिथि',
    Tamil: 'காலாவதி தேதி',
    Kannada: 'ಮುಕ್ತಾಯ ದಿನಾಂಕ',
    Marathi: 'कालबाह्यता तारीख',
    Bengali: 'মেয়াদ শেষ হওয়ার তারিখ',
    Gujarati: 'સમાપ્તિ તારીખ',
    Malayalam: 'കാലഹരണ തീയതി',
    Punjabi: 'ਮਿਆਦ ਪੁੱਗਣ ਦੀ ਮਿਤੀ',
  },
  'Expiring Date': {
    Telugu: 'గడువు తేదీ',
    Hindi: 'समाप्ति तिथि',
    Tamil: 'காலாவதி தேதி',
    Kannada: 'ಮುಕ್ತಾಯ ದಿನಾಂಕ',
    Marathi: 'कालबाह्यता तारीख',
    Bengali: 'মেয়াদ শেষ হওয়ার তারিখ',
    Gujarati: 'સમાપ્તિ તારીખ',
    Malayalam: 'കാലഹരണ തീയതി',
    Punjabi: 'ਮਿਆਦ ਪੁੱਗਣ ਦੀ ਮਿਤੀ',
  },
  'Manufacturing Date': {
    Telugu: 'తయారీ తేదీ',
    Hindi: 'निर्माण तिथि',
    Tamil: 'உற்பத்தி தேதி',
    Kannada: 'ಉತ್ಪಾದನಾ ದಿನಾಂಕ',
    Marathi: 'उत्पादन तारीख',
    Bengali: 'উত্পাদন তারিখ',
    Gujarati: 'ઉત્પાદન તારીખ',
    Malayalam: 'നിർമ്മാണ തീയതി',
    Punjabi: 'ਨਿਰਮਾਣ ਮਿਤੀ',
  },
  'Price': {
    Telugu: 'ధర',
    Hindi: 'कीमत',
    Tamil: 'விலை',
    Kannada: 'ಬೆಲೆ',
    Marathi: 'किंमत',
    Bengali: 'দাম',
    Gujarati: 'કિંમત',
    Malayalam: 'വില',
    Punjabi: 'ਕੀਮਤ',
  },
  'Total': {
    Telugu: 'మొత్తం',
    Hindi: 'कुल',
    Tamil: 'மொத்தம்',
    Kannada: 'ಒಟ್ಟು',
    Marathi: 'एकूण',
    Bengali: 'মোট',
    Gujarati: 'કુલ',
    Malayalam: 'ആകെ',
    Punjabi: 'ਕੁੱਲ',
  },
  'Pay Online': {
    Telugu: 'ఆన్‌లైన్‌లో చెల్లించండి',
    Hindi: 'ऑनलाइन भुगतान करें',
    Tamil: 'ஆன்லைனில் பணம் செலுத்துக',
    Kannada: 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಪಾವತಿಸಿ',
    Marathi: 'ऑनलाइन पैसे भरा',
    Bengali: 'অনলাইনে অর্থ প্রদান করুন',
    Gujarati: 'ઓનલાઈન ચૂકવો',
    Malayalam: 'ഓൺലൈനായി അടയ്ക്കുക',
    Punjabi: 'ਔਨਲਾਈਨ ਭੁਗਤਾਨ ਕਰੋ',
  },
  'Cash on Delivery': {
    Telugu: 'క్యాష్ ఆన్ డెలివరీ',
    Hindi: 'कैश ऑन डिलीवरी',
    Tamil: 'பொருளைப் பெற்றுப் பணம் செலுத்துதல்',
    Kannada: 'ವಿತರಣೆಯ ಸಮಯದಲ್ಲಿ ನಗದು',
    Marathi: 'कॅश ऑन डिलिव्हरी',
    Bengali: 'ক্যাশ অন ডেলিভারি',
    Gujarati: 'કેશ ઓન ડિલિવરી',
    Malayalam: 'ക്യാഷ് ഓൺ ഡെലിവറി',
    Punjabi: 'ਕੈਸ਼ ਆਨ ਡਿਲੀਵਰੀ',
  },
  'Consultation Fee': {
    Telugu: 'సంప్రదింపుల ఫీజు',
    Hindi: 'परामर्श शुल्क',
    Tamil: 'ஆலோசனைக் கட்டணம்',
    Kannada: 'ಸಮಾಲೋಚನೆ ಶುಲ್ಕ',
    Marathi: 'सल्लामसलत फी',
    Bengali: 'পরামর্শ ফি',
    Gujarati: 'પરામર્શ ફી',
    Malayalam: 'കൺസൾട്ടേഷൻ ഫീസ്',
    Punjabi: 'ਸਲਾਹ ਫੀਸ',
  },
  'Experience': {
    Telugu: 'అనుభవం',
    Hindi: 'अनुभव',
    Tamil: 'அனுபவம்',
    Kannada: 'ಅನುಭವ',
    Marathi: 'अनुभव',
    Bengali: 'অভিজ্ঞতা',
    Gujarati: 'અનુભવ',
    Malayalam: 'പരിചയം',
    Punjabi: 'ਤਜਰਬਾ',
  },
  'Available Today': {
    Telugu: 'ఈరోజు అందుబాటులో ఉన్నారు',
    Hindi: 'आज उपलब्ध',
    Tamil: 'இன்று கிடைக்கும்',
    Kannada: 'ಇಂದು ಲಭ್ಯವಿದೆ',
    Marathi: 'आज उपलब्ध',
    Bengali: 'আজ উপলব্ধ',
    Gujarati: 'આજે ઉપલબ્ધ',
    Malayalam: 'ഇന്ന് ലഭ്യമാണ്',
    Punjabi: 'ਅੱਜ ਉਪਲਬਧ ਹੈ',
  },
  'Book Video Slot': {
    Telugu: 'వీడియో స్లాట్ బుక్ చేయండి',
    Hindi: 'वीडियो स्लॉट बुक करें',
    Tamil: 'வீடியோ நேர முன்பதிவு',
    Kannada: 'ವೀಡಿಯೊ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿ',
    Marathi: 'व्हिडिओ स्लॉट बुक करा',
    Bengali: 'ভিডিও স্লট বুক করুন',
    Gujarati: 'વિડિઓ સ્લોટ બુક કરો',
    Malayalam: 'വീഡിയോ സ്ലോട്ട് ബുക്ക് ചെയ്യുക',
    Punjabi: 'ਵੀਡੀਓ ਸਲਾਟ ਬੁੱਕ ਕਰੋ',
  },
  'Book In-Clinic Slot': {
    Telugu: 'క్లినిక్ స్లాట్ బుక్ చేయండి',
    Hindi: 'क्लिनिक स्लॉट बुक करें',
    Tamil: 'நேரடி முன்பதிவு செய்க',
    Kannada: 'ಕ್ಲಿನಿಕ್ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿ',
    Marathi: 'क्लिनिक स्लॉट बुक करा',
    Bengali: 'ক্লিনিক স্লট বুক করুন',
    Gujarati: 'ક્લિનિક સ્લોટ બુક કરો',
    Malayalam: 'ക്ലിനിക്ക് സ്ലോട്ട് ബുക്ക് ചെയ്യുക',
    Punjabi: 'ਕਲੀਨਿਕ ਸਲਾਟ ਬੁੱਕ ਕਰੋ',
  },
  'Doctor Registered Mobile Number': {
    Telugu: 'డాక్టర్ రిజిస్టర్డ్ మొబైల్ నంబర్',
    Hindi: 'डॉक्टर पंजीकृत मोबाइल नंबर',
    Tamil: 'மருத்துவர் பதிவு செய்த கைபேசி எண்',
    Kannada: 'ವೈದ್ಯರ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    Marathi: 'डॉक्टर नोंदणीकृत मोबाईल नंबर',
    Bengali: 'ডাক্তারের নিবন্ধিত মোবাইল নম্বর',
    Gujarati: 'ડોક્ટર નોંધાયેલ મોબાઇલ નંબર',
    Malayalam: 'ഡോക്ടറുടെ രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പർ',
    Punjabi: 'ਡਾਕਟਰ ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਨੰਬਰ',
  },
  'Pharmacy Mobile': {
    Telugu: 'ఫార్మసీ మొబైల్ నంబర్',
    Hindi: 'फार्मेसी मोबाइल नंबर',
    Tamil: 'மருந்தக கைபேசி எண்',
    Kannada: 'ಔಷಧಾಲಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    Marathi: 'फार्मसी मोबाईल नंबर',
    Bengali: 'ফার্মেসি মোবাইল নম্বর',
    Gujarati: 'ફાર્મસી મોબાઇલ નંબર',
    Malayalam: 'ഫാർമസി മൊബൈൽ നമ്പർ',
    Punjabi: 'ਫਾਰਮੇਸੀ ਮੋਬਾਈਲ ਨੰਬਰ',
  },
  'Mobile Phone Number': {
    Telugu: 'మొబైల్ ఫోన్ నంబర్',
    Hindi: 'मोबाइल फ़ोन नंबर',
    Tamil: 'கைபேசி எண்',
    Kannada: 'ಮೊಬೈಲ್ ಫೋನ್ ಸಂಖ್ಯೆ',
    Marathi: 'मोबाईल फोन नंबर',
    Bengali: 'মোবাইল ফোন নম্বর',
    Gujarati: 'મોબાઇલ ફોન નંબર',
    Malayalam: 'മൊബൈൽ ഫോൺ നമ്പർ',
    Punjabi: 'ਮੋਬਾਈਲ ਫੋਨ ਨੰਬਰ',
  },
  'Send Mobile OTP Code': {
    Telugu: 'మొబైల్ ఓటీపీ కోడ్ పంపండి',
    Hindi: 'मोबाइल ओटीपी कोड भेजें',
    Tamil: 'OTP குறியீட்டை அனுப்புக',
    Kannada: 'ಮೊಬೈಲ್ ಒಟಿಪಿ ಕೋಡ್ ಕಳುಹಿಸಿ',
    Marathi: 'मोबाईल ओटीपी कोड पाठवा',
    Bengali: 'মোবাইল ওটিপি পাঠান',
    Gujarati: 'મોબાઇલ ઓટીપી કોડ મોકલો',
    Malayalam: 'ഒടിപി കോഡ് അയയ്ക്കുക',
    Punjabi: 'ਮੋਬਾਈਲ ਓਟੀਪੀ ਕੋਡ ਭੇਜੋ',
  },
  'Send Doctor OTP': {
    Telugu: 'డాక్టర్ ఓటీపీ పంపండి',
    Hindi: 'डॉक्टर ओटीपी भेजें',
    Tamil: 'மருத்துவர் OTP அனுப்புக',
    Kannada: 'ವೈದ್ಯರ ಒಟಿಪಿ ಕಳುಹಿಸಿ',
    Marathi: 'डॉक्टर ओटीपी पाठवा',
    Bengali: 'ডাক্তার ওটিপি পাঠান',
    Gujarati: 'ડોક્ટર ઓટીપી મોકલો',
    Malayalam: 'ഡോക്ടർ ഒടിപി അയയ്ക്കുക',
    Punjabi: 'ਡਾਕਟਰ ਓਟੀਪੀ ਭੇਜੋ',
  },
  'Send Chemist OTP': {
    Telugu: 'కెమిస్ట్ ఓటీపీ పంపండి',
    Hindi: 'केमिस्ट ओटीपी भेजें',
    Tamil: 'மருந்தாளர் OTP அனுப்புக',
    Kannada: 'ಕೆಮಿಸ್ಟ್ ಒಟಿಪಿ ಕಳುಹಿಸಿ',
    Marathi: 'केमिस्ट ओटीपी पाठवा',
    Bengali: 'কেমিস্ট ওটিপি পাঠান',
    Gujarati: 'કેમિસ્ટ ઓટીપી મોકલો',
    Malayalam: 'കെമിസ്റ്റ് ഒടിപി അയയ്ക്കുക',
    Punjabi: 'ਕੈਮਿਸਟ ਓਟੀਪੀ ਭੇਜੋ',
  },
  'Enter 6-Digit SMS Code': {
    Telugu: '6-అంకెల SMS కోడ్ నమోదు చేయండి',
    Hindi: '6-अंकीय एसएमएस कोड दर्ज करें',
    Tamil: '6 இலக்க SMS குறியீட்டை உள்ளிடவும்',
    Kannada: '6-ಅಂಕಿಯ SMS ಕೋಡ್ ನಮೂದಿಸಿ',
    Marathi: '६-अंकी एसएमएस कोड टाका',
    Bengali: '৬-সংখ্যার এসএমএস কোড লিখুন',
    Gujarati: '૬-અંકનો SMS કોડ દાખલ કરો',
    Malayalam: '6 അക്ക എസ്എംഎസ് കോഡ് നൽകുക',
    Punjabi: '6-ਅੰਕ ਦਾ SMS ਕੋਡ ਦਰਜ ਕਰੋ',
  },
  'Verify & Access Portal': {
    Telugu: 'ధృవీకరించి పోర్టల్‌ను యాక్సెస్ చేయండి',
    Hindi: 'सत्यापित करें और पोर्टल एक्सेस करें',
    Tamil: 'சரிபார்த்து போர்ட்டலை அணுகவும்',
    Kannada: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ',
    Marathi: 'पडताळणी करा आणि पोर्टल वापरा',
    Bengali: 'যাচাই করুন এবং পোর্টালে প্রবেশ করুন',
    Gujarati: 'ચકાસો અને પોર્ટલ ઍક્સેસ કરો',
    Malayalam: 'സ്ഥിരീകരിച്ച് പോർട്ടൽ കാണുക',
    Punjabi: 'ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਪੋਰਟਲ ਦਾਖਲ ਹੋਵੋ',
  },
  'Change Number': {
    Telugu: 'నంబర్ మార్చండి',
    Hindi: 'नंबर बदलें',
    Tamil: 'எண்ணை மாற்றவும்',
    Kannada: 'ಸಂಖ್ಯೆಯನ್ನು ಬದಲಾಯಿಸಿ',
    Marathi: 'नंबर बदला',
    Bengali: 'নম্বর পরিবর্তন করুন',
    Gujarati: 'નંબર બદલો',
    Malayalam: 'നമ്പർ മാറ്റുക',
    Punjabi: 'ਨੰਬਰ ਬਦਲੋ',
  },
  'Resend Code': {
    Telugu: 'కోడ్‌ను మళ్లీ పంపండి',
    Hindi: 'कोड दोबारा भेजें',
    Tamil: 'குறியீட்டை மீண்டும் அனுப்பு',
    Kannada: 'ಕೋಡ್ ಮರುಕಳುಹಿಸಿ',
    Marathi: 'कोड पुन्हा पाठवा',
    Bengali: 'কোড পুনরায় পাঠান',
    Gujarati: 'કોડ ફરીથી મોકલો',
    Malayalam: 'കോഡ് വീണ്ടും അയയ്ക്കുക',
    Punjabi: 'ਕੋਡ ਦੁਬਾਰਾ ਭੇਜੋ',
  },
  'Profile Updated': {
    Telugu: 'ప్రొఫైల్ అప్‌డేట్ చేయబడింది',
    Hindi: 'प्रोफ़ाइल अपडेट की गई',
    Tamil: 'சுயவிவரம் புதுப்பிக்கப்பட்டது',
    Kannada: 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ',
    Marathi: 'प्रोफाइल अपडेट केली',
    Bengali: 'প্রোফাইল আপডেট হয়েছে',
    Gujarati: 'પ્રોફાઇલ અપડેટ થઈ',
    Malayalam: 'പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്തു',
    Punjabi: 'ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ ਕੀਤੀ ਗਈ',
  },
  'Saved Successfully!': {
    Telugu: 'విజయవంతంగా సేవ్ చేయబడింది!',
    Hindi: 'सफलतापूर्वक सहेजा गया!',
    Tamil: 'வெற்றிகரமாக சேமிக்கப்பட்டது!',
    Kannada: 'ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!',
    Marathi: 'यशस्वीरीत्या जतन केले!',
    Bengali: 'সফলভাবে সংরক্ষিত হয়েছে!',
    Gujarati: 'સફળતાપૂર્વક સાચવવામાં આવ્યું!',
    Malayalam: 'വിജയകരമായി സേവ് ചെയ്തു!',
    Punjabi: 'ਸਫਲਤਾਪੂਰਵਕ ਸੁਰੱਖਿਅਤ ਕੀਤਾ ਗਿਆ!',
  },
  'Select your preferred language for consultation alerts, medicine labels, prescription summaries, and portal interfaces.': {
    Telugu: 'సంప్రదింపు హెచ్చరికలు, ఔషధ లేబుల్‌లు, ప్రిస్క్రిప్షన్ సారాంశాలు మరియు పోర్టల్ ఇంటర్‌ఫేస్‌ల కోసం మీ ప్రాధాన్యత గల భాషను ఎంచుకోండి.',
    Hindi: 'परामर्श अलर्ट, दवा लेबल, प्रिस्क्रिप्शन सारांश और पोर्टल इंटरफेस के लिए अपनी पसंदीदा भाषा चुनें।',
    Tamil: 'ஆலோசனை எச்சரிக்கைகள், மருந்து லேபிள்கள் மற்றும் போர்டல் இடைமுகங்களுக்கான உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்.',
    Kannada: 'ಸಮಾಲೋಚನೆ ಎಚ್ಚರಿಕೆಗಳು, ಔಷಧಿ ಲೇಬಲ್‌ಗಳು ಮತ್ತು ಪೋರ್ಟಲ್ ಇಂಟರ್ಫೇಸ್‌ಗಳಿಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    Marathi: 'सल्लामसलत सूचना, औषध लेबले आणि पोर्टलसाठी तुमची पसंतीची भाषा निवडा.',
    Bengali: 'পরামর্শ সতর্কতা, ওষুধের লেবেল এবং পোর্টাল ইন্টারফেসের জন্য আপনার পছন্দের ভাষা নির্বাচন করুন।',
    Gujarati: 'પરામર્શ ચેતવણીઓ, દવાની લેબલો અને પોર્ટલ માટે તમારી પસંદગીની ભાષા પસંદ કરો.',
    Malayalam: 'കൺസൾട്ടേഷൻ അലേർട്ടുകൾ, മരുന്ന് ലേബലുകൾ എന്നിവയ്‌ക്കായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക.',
    Punjabi: 'ਸਲਾਹ ਚਿਤਾਵਨੀਆਂ, ਦਵਾਈਆਂ ਦੇ ਲੇਬਲਾਂ ਅਤੇ ਪੋਰਟਲ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ।',
  },
  // Additional Universal & Portal-Specific Terms
  'Good Day,': {
    Telugu: 'నమస్కారం,',
    Hindi: 'नमस्ते,',
    Tamil: 'வணக்கம்,',
    Kannada: 'ನಮಸ್ಕಾರ,',
    Marathi: 'नमस्कार,',
    Bengali: 'নমস্কার,',
    Gujarati: 'નમસ્તે,',
    Malayalam: 'നമസ്കാരം,',
    Punjabi: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ,',
  },
  'Start Next Consultation': {
    Telugu: 'తదుపరి సంప్రదింపు ప్రారంభించండి',
    Hindi: 'अगला परामर्श शुरू करें',
    Tamil: 'அடுத்த ஆலோசனையைத் தொடங்குங்கள்',
    Kannada: 'ಮುಂದಿನ ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ',
    Marathi: 'पुढील सल्लामसलत सुरू करा',
    Bengali: 'পরবর্তী পরামর্শ শুরু করুন',
    Gujarati: 'આગળનો પરામર્શ શરૂ કરો',
    Malayalam: 'അടുത്ത കൺസൾട്ടേഷൻ ആരംഭിക്കുക',
    Punjabi: 'ਅਗਲੀ ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ',
  },
  'Write E-Prescription': {
    Telugu: 'ఈ-ప్రిస్క్రిప్షన్ రాయండి',
    Hindi: 'ई-प्रिस्क्रिप्शन लिखें',
    Tamil: 'மின்-மருந்துச் சீட்டு எழுதுங்கள்',
    Kannada: 'ಇ-ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಬರೆಯಿರಿ',
    Marathi: 'ई-प्रिस्क्रिप्शन लिहा',
    Bengali: 'ই-প্রেসক্রিপশন লিখুন',
    Gujarati: 'ઈ-પ્રિસ્ક્રિપ્શન લખો',
    Malayalam: 'ഇ-പ്രിസ്ക്രിപ്ഷൻ എഴുതുക',
    Punjabi: 'ਈ-ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ ਲਿਖੋ',
  },
  'Walk-In Token': {
    Telugu: 'వాక్-ఇన్ టోకెన్',
    Hindi: 'वॉक-इन टोकन',
    Tamil: 'நேரடி டோக்கன்',
    Kannada: 'ವಾಕ್-ಇನ್ ಟೋಕನ್',
    Marathi: 'वॉक-इन टोकन',
    Bengali: 'ওয়াক-ইন টোকেন',
    Gujarati: 'વૉક-ઇન ટોકન',
    Malayalam: 'വാക്ക്-ഇൻ ടോക്കൺ',
    Punjabi: 'ਵਾਕ-ਇਨ ਟੋਕਨ',
  },
  "Today's OPD Queue": {
    Telugu: 'ఈరోజు OPD క్యూ',
    Hindi: 'आज की ओपीडी कतार',
    Tamil: 'இன்றைய OPD வரிசை',
    Kannada: 'ಇಂದಿನ ಒಪಿಡಿ ಸಾಲು',
    Marathi: 'आजची ओपीडी रांग',
    Bengali: 'আজকের ওপিডি সারি',
    Gujarati: 'આજની ઓપીડી લાઇન',
    Malayalam: 'ഇന്നത്തെ ഒപിഡി ക്യൂ',
    Punjabi: 'ਅੱਜ ਦੀ ਓਪੀਡੀ ਕਤਾਰ',
  },
  'Video Encounters': {
    Telugu: 'వీడియో సమావేశాలు',
    Hindi: 'वीडियो मुलाकातें',
    Tamil: 'வீடியோ சந்திப்புகள்',
    Kannada: 'ವೀಡಿಯೊ ಸಮಾಲೋಚನೆಗಳು',
    Marathi: 'व्हिडिओ भेटी',
    Bengali: 'ভিডিও সাক্ষাত',
    Gujarati: 'વિડિઓ મુલાકાતો',
    Malayalam: 'വീഡിയോ കൂടിക്കാഴ്ചകൾ',
    Punjabi: 'ਵੀਡੀਓ ਮੁਲਾਕਾਤਾਂ',
  },
  'Counter POS Billing (GST)': {
    Telugu: 'కౌంటర్ పీఓఎస్ బిల్లింగ్ (జీఎస్టీ)',
    Hindi: 'काउंटर पीओएस बिलिंग (जीएसटी)',
    Tamil: 'கவுண்டர் POS பில்லிங் (GST)',
    Kannada: 'ಕೌಂಟರ್ ಪಿಒಎಸ್ ಬಿಲ್ಲಿಂಗ್ (ಜಿಎಸ್‌ಟಿ)',
    Marathi: 'काउंटर पीओएस बिलिंग (जीएसटी)',
    Bengali: 'কাউন্টার পিওএস বিলিং (জিএসটি)',
    Gujarati: 'કાઉન્ટર POS બિલિંગ (GST)',
    Malayalam: 'കൗണ്ടർ പിഒഎസ് ബില്ലിംഗ് (ജിഎസ്ടി)',
    Punjabi: 'ਕਾਊਂਟਰ ਪੀਓਐਸ ਬਿਲਿੰਗ (ਜੀਐਸਟੀ)',
  },
  'Wholesaler Inward': {
    Telugu: 'హోల్‌సేలర్ ఇన్వర్డ్',
    Hindi: 'थोक विक्रेता आवक',
    Tamil: 'மொத்த விற்பனையாளர் வரவு',
    Kannada: 'ಸಗಟು ವ್ಯಾಪಾರಿ ಒಳಬರುವ ಸರಕು',
    Marathi: 'घाऊक व्यापारी आवक',
    Bengali: 'পাইকারি বিক্রেতা ইনওয়ার্ড',
    Gujarati: 'જથ્થાબંધ વેપારી ઇનવર્ડ',
    Malayalam: 'ഹോൾസെയിലർ ഇൻവേർഡ്',
    Punjabi: 'ਥੋਕ ਵਿਕਰੇਤਾ ਆਮਦ',
  },
  'Medicine Stock': {
    Telugu: 'ఔషధాల నిల్వ',
    Hindi: 'दवाओं का स्टॉक',
    Tamil: 'மருந்து இருப்பு',
    Kannada: 'ಔಷಧಿ ದಾಸ್ತಾನು',
    Marathi: 'औषध साठा',
    Bengali: 'ওষুধের স্টক',
    Gujarati: 'દવાઓનો સ્ટોક',
    Malayalam: 'മരുന്ന് സ്റ്റോക്ക്',
    Punjabi: 'ਦਵਾਈਆਂ ਦਾ ਸਟਾਕ',
  },
  "Today's Dispense Revenue": {
    Telugu: 'ఈరోజు పంపిణీ ఆదాయం',
    Hindi: 'आज का वितरण राजस्व',
    Tamil: 'இன்றைய விற்பனை வருவாய்',
    Kannada: 'ಇಂದಿನ ವಿತರಣಾ ಆದಾಯ',
    Marathi: 'आजचा वितरण महसूल',
    Bengali: 'আজকের বিতরণ রাজস্ব',
    Gujarati: 'આજની વિતરણ આવક',
    Malayalam: 'ഇന്നത്തെ വിൽപ്പന വരുമാനം',
    Punjabi: 'ਅੱਜ ਦੀ ਵੰਡ ਆਮਦਨ',
  },
  'Awaiting Verification': {
    Telugu: 'ధృవీకరణ కోసం వేచి ఉంది',
    Hindi: 'सत्यापन की प्रतीक्षा में',
    Tamil: 'சரிபார்ப்புக்கு காத்திருக்கிறது',
    Kannada: 'ಪರಿಶೀಲನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ',
    Marathi: 'पडताळणी प्रलंबित',
    Bengali: 'যাচাইয়ের অপেক্ষায়',
    Gujarati: 'ચકાસણીની રાહ જુએ છે',
    Malayalam: 'സ്ഥിരീകരണത്തിനായി കാത്തിരിക്കുന്നു',
    Punjabi: 'ਪੁਸ਼ਟੀ ਦੀ ਉਡੀਕ',
  },
  'Active Deliveries': {
    Telugu: 'యాక్టివ్ డెలివరీలు',
    Hindi: 'सक्रिय डिलीवरी',
    Tamil: 'செயலில் உள்ள விநியோகங்கள்',
    Kannada: 'ಸಕ್ರಿಯ ವಿತರಣೆಗಳು',
    Marathi: 'सक्रिय डिलिव्हरी',
    Bengali: 'সক্রিয় ডেলিভারি',
    Gujarati: 'સક્રિય ડિલિવરી',
    Malayalam: 'സജീവ ഡെലിവറികൾ',
    Punjabi: 'ਸਰਗਰਮ ਡਿਲੀਵਰੀ',
  },
  'Under 60 Min Express Delivery': {
    Telugu: '60 నిమిషాల లోపు ఎక్స్‌ప్రెస్ డెలివరీ',
    Hindi: '60 मिनट के भीतर एक्सप्रेस डिलीवरी',
    Tamil: '60 நிமிட விரைவு விநியோகம்',
    Kannada: '60 ನಿಮಿಷಗಳಲ್ಲಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ವಿತರಣೆ',
    Marathi: '६० मिनिटांत एक्सप्रेस डिलिव्हरी',
    Bengali: '৬০ মিনিটের মধ্যে এক্সপ্রেস ডেলিভারি',
    Gujarati: '૬૦ મિનિટમાં એક્સપ્રેસ ડિલિવરી',
    Malayalam: '60 മിനിറ്റിനുള്ളിൽ എക്സ്പ്രസ് ഡെലിവറി',
    Punjabi: '60 ਮਿੰਟਾਂ ਵਿੱਚ ਐਕਸਪ੍ਰੈਸ ਡਿਲੀਵਰੀ',
  },
  'Upload Rx Photo': {
    Telugu: 'ప్రిస్క్రిప్షన్ ఫోటో అప్‌లోడ్ చేయండి',
    Hindi: 'प्रिस्क्रिप्शन फोटो अपलोड करें',
    Tamil: 'மருந்துச் சீட்டு படம் பதிவேற்றவும்',
    Kannada: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    Marathi: 'प्रिस्क्रिप्शन फोटो अपलोड करा',
    Bengali: 'প্রেসক্রিপশন ছবি আপলোড করুন',
    Gujarati: 'પ્રિસ્ક્રિપ્શન ફોટો અપલોડ કરો',
    Malayalam: 'കുറിപ്പടി ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    Punjabi: 'ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
  },
  'SOS (112)': {
    Telugu: 'అత్యవసరం (112)',
    Hindi: 'आपातकालीन (112)',
    Tamil: 'அவசரம் (112)',
    Kannada: 'ತುರ್ತು (112)',
    Marathi: 'आपत्कालीन (112)',
    Bengali: 'জরুরী (112)',
    Gujarati: 'ઇમરજન્સી (112)',
    Malayalam: 'അടിയന്തരം (112)',
    Punjabi: 'ਐਮਰਜੈਂਸੀ (112)',
  },
  'Homepage Color Themes:': {
    Telugu: 'హోమ్‌పేజీ రంగు థీమ్‌లు:',
    Hindi: 'होमपेज रंग थीम:',
    Tamil: 'முகப்பு வண்ண கருப்பொருள்கள்:',
    Kannada: 'ಮುಖಪುಟ ಬಣ್ಣದ ಥೀಮ್‌ಗಳು:',
    Marathi: 'होमपेज रंग थीम:',
    Bengali: 'হোমপেজ রঙের থিম:',
    Gujarati: 'હોમપેજ રંગ થીમ:',
    Malayalam: 'ഹോംപേജ് വർണ്ണ തീമുകൾ:',
    Punjabi: 'ਹੋਮਪੇਜ ਰੰਗ ਥੀਮ:',
  },
  'Upload photo from system': {
    Telugu: 'సిస్టమ్ నుండి ఫోటోను అప్‌లోడ్ చేయండి',
    Hindi: 'सिस्टम से फोटो अपलोड करें',
    Tamil: 'கணினியிலிருந்து புகைப்படம் பதிவேற்றவும்',
    Kannada: 'ಸಿಸ್ಟಮ್‌ನಿಂದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    Marathi: 'सिस्टममधून फोटो अपलोड करा',
    Bengali: 'সিস্টেম থেকে ছবি আপলোড করুন',
    Gujarati: 'સિસ્ટમમાંથી ફોટો અપલોડ કરો',
    Malayalam: 'സിസ്റ്റത്തിൽ നിന്ന് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    Punjabi: 'ਸਿਸਟਮ ਤੋਂ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
  },
  'Patient Health Attributes': {
    Telugu: 'రోగి ఆరోగ్య లక్షణాలు',
    Hindi: 'रोगी स्वास्थ्य विशेषताएँ',
    Tamil: 'நோயாளி சுகாதார பண்புகள்',
    Kannada: 'ರೋಗಿಯ ಆರೋಗ್ಯ ಗುಣಲಕ್ಷಣಗಳು',
    Marathi: 'रुग्ण आरोग्य वैशिष्ट्ये',
    Bengali: 'রোগীর স্বাস্থ্য বৈশিষ্ট্য',
    Gujarati: 'દર્દી આરોગ્ય વિશેષતાઓ',
    Malayalam: 'രോഗിയുടെ ആരോഗ്യ സവിശേഷതകൾ',
    Punjabi: 'ਮਰੀਜ਼ ਸਿਹਤ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
  },
  'Doctor Professional Credentials': {
    Telugu: 'వైద్యుని వృత్తిపరమైన వివరాలు',
    Hindi: 'डॉक्टर व्यावसायिक साख',
    Tamil: 'மருத்துவர் தொழில்சார் சான்றுகள்',
    Kannada: 'ವೈದ್ಯರ ವೃತ್ತಿಪರ ರುಜುವಾತುಗಳು',
    Marathi: 'डॉक्टर व्यावसायिक ओळखपत्रे',
    Bengali: 'ডাক্তারের পেশাদার শংসাপত্র',
    Gujarati: 'ડોક્ટર વ્યાવસાયિક ઓળખપત્રો',
    Malayalam: 'ഡോക്ടറുടെ പ്രൊഫഷണൽ യോഗ്യതകൾ',
    Punjabi: 'ਡਾਕਟਰ ਪੇਸ਼ੇਵਰ ਪ੍ਰਮਾਣ ਪੱਤਰ',
  },
  'Pharmacy Store Details': {
    Telugu: 'ఫార్మసీ స్టోర్ వివరాలు',
    Hindi: 'फार्मेसी स्टोर विवरण',
    Tamil: 'மருந்தக கடை விவரங்கள்',
    Kannada: 'ಔಷಧಾಲಯ ಅಂಗಡಿ ವಿವರಗಳು',
    Marathi: 'फार्मसी स्टोअर तपशील',
    Bengali: 'ফার্মেসি স্টোর বিবরণ',
    Gujarati: 'ફાર્મસી સ્ટોર વિગતો',
    Malayalam: 'ഫാർമസി സ്റ്റോർ വിവരങ്ങൾ',
    Punjabi: 'ਫਾਰਮੇਸੀ ਸਟੋਰ ਵੇਰਵੇ',
  },
  'Emergency SOS': {
    Telugu: 'అత్యవసర SOS',
    Hindi: 'आपातकालीन एसओएस',
    Tamil: 'அவசர SOS',
    Kannada: 'ತುರ್ತು ಎಸ್‌ಒಎಸ್',
    Marathi: 'आपत्कालीन एसओएस',
    Bengali: 'জরুরী এসওএস',
    Gujarati: 'ઇમરજન્સી SOS',
    Malayalam: 'അടിയന്തര SOS',
    Punjabi: 'ਐਮਰਜੈਂਸੀ SOS',
  },
  'Doctor': {
    Telugu: 'డాక్టర్',
    Hindi: 'डॉक्टर',
    Tamil: 'மருத்துவர்',
    Kannada: 'ವೈದ್ಯರು',
    Marathi: 'डॉक्टर',
    Bengali: 'ডাক্তার',
    Gujarati: 'ડોક્ટર',
    Malayalam: 'ഡോക്ടർ',
    Punjabi: 'ਡਾਕਟਰ',
  },
  'Patient': {
    Telugu: 'రోగి',
    Hindi: 'मरीज',
    Tamil: 'நோயாளி',
    Kannada: 'ರೋಗಿ',
    Marathi: 'रुग्ण',
    Bengali: 'রোগী',
    Gujarati: 'દર્દી',
    Malayalam: 'രോഗി',
    Punjabi: 'ਮਰੀਜ਼',
  },
  'Shopkeeper': {
    Telugu: 'దుకాణదారుడు',
    Hindi: 'दुकानदार',
    Tamil: 'கடைக்காரர்',
    Kannada: 'ಅಂಗಡಿಯವನು',
    Marathi: 'दुकानदार',
    Bengali: 'দোকানদার',
    Gujarati: 'દુકાનદાર',
    Malayalam: 'കടയുടമ',
    Punjabi: 'ਦੁਕਾਨਦਾਰ',
  },
  'Admin': {
    Telugu: 'అడ్మిన్',
    Hindi: 'व्यवस्थापक',
    Tamil: 'நிர்வாகி',
    Kannada: 'ನಿರ್ವಾಹಕ',
    Marathi: 'प्रशासक',
    Bengali: 'অ্যাডমিন',
    Gujarati: 'વહીવટકર્તા',
    Malayalam: 'അഡ്മിൻ',
    Punjabi: 'ਪ੍ਰਸ਼ਾਸਕ',
  },
  'Switch Portal': {
    Telugu: 'పోర్టల్ మార్చండి',
    Hindi: 'पोर्टल बदलें',
    Tamil: 'போர்டலை மாற்றவும்',
    Kannada: 'ಪೋರ್ಟಲ್ ಬದಲಾಯಿಸಿ',
    Marathi: 'पोर्टल बदला',
    Bengali: 'পোর্টাল পরিবর্তন করুন',
    Gujarati: 'પોર્ટલ બદલો',
    Malayalam: 'പോർട്ടൽ മാറ്റുക',
    Punjabi: 'ਪੋਰਟਲ ਬਦਲੋ',
  },
  'Sign Out': {
    Telugu: 'సైన్ అవుట్',
    Hindi: 'साइन आउट',
    Tamil: 'வெளியேறு',
    Kannada: 'ಸೈನ್ ಔಟ್',
    Marathi: 'साइन आउट',
    Bengali: 'সাইন আউট',
    Gujarati: 'સાઇન આઉટ',
    Malayalam: 'സൈൻ ഔട്ട്',
    Punjabi: 'ਸਾਈਨ ਆਉਟ',
  },
  'Log Out': {
    Telugu: 'లాగ్ అవుట్',
    Hindi: 'लॉग आउट',
    Tamil: 'வெளியேறு',
    Kannada: 'ಲಾಗ್ ಔಟ್',
    Marathi: 'लॉग आउट',
    Bengali: 'লগ আউট',
    Gujarati: 'લૉગ આઉટ',
    Malayalam: 'ലോഗ് ഔട്ട്',
    Punjabi: 'ਲਾਗ ਆਉਟ',
  },
  'Sign In': {
    Telugu: 'సైన్ ఇన్',
    Hindi: 'साइन इन',
    Tamil: 'உள்நுழைக',
    Kannada: 'ಸೈನ್ ಇನ್',
    Marathi: 'साइन इन',
    Bengali: 'সাইন ইন',
    Gujarati: 'સાઇન ઇન',
    Malayalam: 'സൈൻ ഇൻ',
    Punjabi: 'ਸਾਈਨ ਇਨ',
  },
  'Filter': {
    Telugu: 'ఫిల్టర్',
    Hindi: 'फ़िल्टर',
    Tamil: 'வடிகட்டு',
    Kannada: 'ಫಿಲ್ಟರ್',
    Marathi: 'फिल्टर',
    Bengali: 'ফিল্টার',
    Gujarati: 'ફિલ્ટર',
    Malayalam: 'ഫിൽട്ടർ',
    Punjabi: 'ਫਿਲਟਰ',
  },
  'All': {
    Telugu: 'అన్నీ',
    Hindi: 'सभी',
    Tamil: 'அனைத்தும்',
    Kannada: 'ಎಲ್ಲವೂ',
    Marathi: 'सर्व',
    Bengali: 'সমস্ত',
    Gujarati: 'બધા',
    Malayalam: 'എല്ലാം',
    Punjabi: 'ਸਾਰੇ',
  },
  'Back': {
    Telugu: 'వెనుకకు',
    Hindi: 'पीछे',
    Tamil: 'பின்செல்',
    Kannada: 'ಹಿಂದೆ',
    Marathi: 'मागे',
    Bengali: 'পেছনে',
    Gujarati: 'પાછળ',
    Malayalam: 'തിരികെ',
    Punjabi: 'ਪਿੱਛੇ',
  },
  'Next': {
    Telugu: 'తరువాత',
    Hindi: 'आगे',
    Tamil: 'அடுத்து',
    Kannada: 'ಮುಂದೆ',
    Marathi: 'पुढे',
    Bengali: 'পরবর্তী',
    Gujarati: 'આગળ',
    Malayalam: 'അടുത്തത്',
    Punjabi: 'ਅੱਗੇ',
  },
  'Delivered': {
    Telugu: 'డెలివరీ చేయబడింది',
    Hindi: 'डिलीवर किया गया',
    Tamil: 'விநியோகிக்கப்பட்டது',
    Kannada: 'ವಿತರಿಸಲಾಗಿದೆ',
    Marathi: 'पोहोचवले',
    Bengali: 'বিতরিত',
    Gujarati: 'ડિલિવર થયું',
    Malayalam: 'ഡെലിവർ ചെയ്തു',
    Punjabi: 'ਡਿਲੀਵਰ ਹੋ ਗਿਆ',
  },
  'Inactive': {
    Telugu: 'నిష్క్రియ',
    Hindi: 'निष्क्रिय',
    Tamil: 'செயலற்றது',
    Kannada: 'ನಿಷ್ಕ್ರಿಯ',
    Marathi: 'निष्क्रिय',
    Bengali: 'নিষ্ক্রিয়',
    Gujarati: 'નિષ્ક્રિય',
    Malayalam: 'നിഷ്‌ക്രിയം',
    Punjabi: 'ਨਿਸ਼ਕਿਰਿਆ',
  },
  'Clear All': {
    Telugu: 'అన్నీ క్లియర్ చేయండి',
    Hindi: 'सभी साफ़ करें',
    Tamil: 'அனைத்தையும் அழிக்கவும்',
    Kannada: 'ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ',
    Marathi: 'सर्व साफ करा',
    Bengali: 'সব মুছুন',
    Gujarati: 'બધું સાફ કરો',
    Malayalam: 'എല്ലാം മായ്‌ക്കുക',
    Punjabi: 'ਸਾਰੇ ਸਾਫ਼ ਕਰੋ',
  },
  'Fee': {
    Telugu: 'రుసుము',
    Hindi: 'शुल्क',
    Tamil: 'கட்டணம்',
    Kannada: 'ಶುಲ್ಕ',
    Marathi: 'फी',
    Bengali: 'ফি',
    Gujarati: 'ફી',
    Malayalam: 'ഫീസ്',
    Punjabi: 'ਫੀਸ',
  },
  'Today': {
    Telugu: 'ఈరోజు',
    Hindi: 'आज',
    Tamil: 'இன்று',
    Kannada: 'ಇಂದು',
    Marathi: 'आज',
    Bengali: 'আজ',
    Gujarati: 'આજે',
    Malayalam: 'ഇന്ന്',
    Punjabi: 'ਅੱਜ',
  },
  'Reviews': {
    Telugu: 'సమీక్షలు',
    Hindi: 'समीक्षाएं',
    Tamil: 'மதிப்புரைகள்',
    Kannada: 'ವಿಮರ್ಶೆಗಳು',
    Marathi: 'पुनरावलोकने',
    Bengali: 'পর্যালোচনা',
    Gujarati: 'સમીક્ષાઓ',
    Malayalam: 'അവലോകനങ്ങൾ',
    Punjabi: 'ਸਮੀਖਿਆਵਾਂ',
  },
  'Rating': {
    Telugu: 'రేటింగ్',
    Hindi: 'रेटिंग',
    Tamil: 'மதிப்பீடு',
    Kannada: 'ರೇಟಿಂಗ್',
    Marathi: 'रेटिंग',
    Bengali: 'রেটিং',
    Gujarati: 'રેટિંગ',
    Malayalam: 'റേറ്റിംഗ്',
    Punjabi: 'ਰੇਟਿੰਗ',
  },
  'Experience Years': {
    Telugu: 'అనుభవ సంవత్సరాలు',
    Hindi: 'अनुभव के वर्ष',
    Tamil: 'அனுபவ ஆண்டுகள்',
    Kannada: 'ಅನುಭವದ ವರ್ಷಗಳು',
    Marathi: 'अनुभवाची वर्षे',
    Bengali: 'অভিজ্ঞতার বছর',
    Gujarati: 'અનુભવના વર્ષો',
    Malayalam: 'പരിചയ വർഷങ്ങൾ',
    Punjabi: 'ਤਜਰਬੇ ਦੇ ਸਾਲ',
  },
  'Years': {
    Telugu: 'సంవత్సరాలు',
    Hindi: 'वर्ष',
    Tamil: 'ஆண்டுகள்',
    Kannada: 'ವರ್ಷಗಳು',
    Marathi: 'वर्षे',
    Bengali: 'বছর',
    Gujarati: 'વર્ષો',
    Malayalam: 'വർഷങ്ങൾ',
    Punjabi: 'ਸਾਲ',
  },
  'Instant Video Call': {
    Telugu: 'తక్షణ వీడియో కాల్',
    Hindi: 'त्वरित वीडियो कॉल',
    Tamil: 'உடனடி வீடியோ அழைப்பு',
    Kannada: 'ತ್ವರಿತ ವೀಡಿಯೊ ಕರೆ',
    Marathi: 'झटपट व्हिडिओ कॉल',
    Bengali: 'তাত্ক্ষণিক ভিডিও কল',
    Gujarati: 'ત્વરિત વિડિઓ કૉલ',
    Malayalam: 'തൽക്ഷണ വീഡിയോ കോൾ',
    Punjabi: 'ਤੁਰੰਤ ਵੀਡੀਓ ਕਾਲ',
  },
  'In-Clinic Visit': {
    Telugu: 'క్లినిక్ సందర్శన',
    Hindi: 'क्लिनिक विज़िट',
    Tamil: 'நேரடி வருகை',
    Kannada: 'ಕ್ಲಿನಿಕ್ ಭೇಟಿ',
    Marathi: 'क्लिनिक भेट',
    Bengali: 'ক্লিনিক পরিদর্শন',
    Gujarati: 'ક્લિનિક મુલાકાત',
    Malayalam: 'ക്ലിനിക് സന്ദർശനം',
    Punjabi: 'ਕਲੀਨਿਕ ਫੇਰੀ',
  },
  'Audio Call': {
    Telugu: 'ఆడియో కాల్',
    Hindi: 'ऑडियो कॉल',
    Tamil: 'ஆடியோ அழைப்பு',
    Kannada: 'ಆಡಿಯೊ ಕರೆ',
    Marathi: 'ऑडिओ कॉल',
    Bengali: 'অডিও কল',
    Gujarati: 'ઑડિયો કૉલ',
    Malayalam: 'ഓഡിയോ കോൾ',
    Punjabi: 'ਆਡੀਓ ਕਾਲ',
  },
  'Buy Now': {
    Telugu: 'ఇప్పుడే కొనండి',
    Hindi: 'अभी खरीदें',
    Tamil: 'இப்போது வாங்கவும்',
    Kannada: 'ಈಗ ಖರೀದಿಸಿ',
    Marathi: 'आता खरेदी करा',
    Bengali: 'এখনই কিনুন',
    Gujarati: 'હવે ખરીદો',
    Malayalam: 'ഇപ്പോൾ വാങ്ങുക',
    Punjabi: 'ਹੁਣੇ ਖਰੀਦੋ',
  },
  'Order Now': {
    Telugu: 'ఇప్పుడే ఆర్డర్ చేయండి',
    Hindi: 'अभी ऑर्डर करें',
    Tamil: 'இப்போது ஆர்டர் செய்க',
    Kannada: 'ಈಗ ಆದೇಶಿಸಿ',
    Marathi: 'आता ऑर्डर करा',
    Bengali: 'এখনই অর্ডার করুন',
    Gujarati: 'હવે ઓર્ડર કરો',
    Malayalam: 'ഇപ്പോൾ ഓർഡർ ചെയ്യുക',
    Punjabi: 'ਹੁਣੇ ਆਰਡਰ ਕਰੋ',
  },
  'Pay Now': {
    Telugu: 'ఇప్పుడే చెల్లించండి',
    Hindi: 'अभी भुगतान करें',
    Tamil: 'இப்போது பணம் செலுத்துங்கள்',
    Kannada: 'ಈಗ ಪಾವತಿಸಿ',
    Marathi: 'आता पैसे द्या',
    Bengali: 'এখন পরিশোধ করুন',
    Gujarati: 'હવે ચૂકવો',
    Malayalam: 'ഇപ്പോൾ പണമടയ്ക്കുക',
    Punjabi: 'ਹੁਣੇ ਭੁਗਤਾਨ ਕਰੋ',
  },
  'Payment Successful': {
    Telugu: 'చెల్లింపు విజయవంతమైంది',
    Hindi: 'भुगतान सफल रहा',
    Tamil: 'பணம் செலுத்துதல் வெற்றிகரமானது',
    Kannada: 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ',
    Marathi: 'पेमेंट यशस्वी झाले',
    Bengali: 'পেমেন্ট সফল হয়েছে',
    Gujarati: 'ચુકવણી સફળ રહી',
    Malayalam: 'പേയ്‌മെന്റ് വിജയകരമായി',
    Punjabi: 'ਭੁਗਤਾਨ ਸਫਲ ਰਿਹਾ',
  },
  'Track Order': {
    Telugu: 'ఆర్డర్‌ను ట్రాక్ చేయండి',
    Hindi: 'ऑर्डर ट्रैक करें',
    Tamil: 'ஆர்டரைக் கண்காணிக்கவும்',
    Kannada: 'ಆದೇಶವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    Marathi: 'ऑर्डर ट्रॅक करा',
    Bengali: 'অর্ডার ট্র্যাক করুন',
    Gujarati: 'ઓર્ડર ટ્રેક કરો',
    Malayalam: 'ഓർഡർ ട്രാക്ക് ചെയ്യുക',
    Punjabi: 'ਆਰਡਰ ਟਰੈਕ ਕਰੋ',
  },
  'Return Order': {
    Telugu: 'ఆర్డర్‌ను తిరిగి ఇవ్వండి',
    Hindi: 'ऑर्डर वापस करें',
    Tamil: 'ஆர்டரைத் திருப்புக',
    Kannada: 'ಆದೇಶವನ್ನು ಹಿಂತಿರುಗಿಸಿ',
    Marathi: 'ऑर्डर परत करा',
    Bengali: 'অর্ডার ফেরত দিন',
    Gujarati: 'ઓર્ડર પરત કરો',
    Malayalam: 'ഓർഡർ തിരികെ നൽകുക',
    Punjabi: 'ਆਰਡਰ ਵਾਪਸ ਕਰੋ',
  },
  'Care Hub': {
    Telugu: 'కేర్ హబ్',
    Hindi: 'केयर हब',
    Tamil: 'பராமரிப்பு மையம்',
    Kannada: 'ಕೇರ್ ಹಬ್',
    Marathi: 'केअर हब',
    Bengali: 'কেয়ার হাব',
    Gujarati: 'કેર હબ',
    Malayalam: 'കെയർ ഹബ്ബ്',
    Punjabi: 'ਕੇਅਰ ਹੱਬ',
  },
  'Medimart': {
    Telugu: 'మెడిమార్ట్',
    Hindi: 'मेडीमार्ट',
    Tamil: 'மெடிமார்ட்',
    Kannada: 'ಮೆಡಿಮಾರ್ಟ್',
    Marathi: 'मेडीमार्ट',
    Bengali: 'মেডিমার্ট',
    Gujarati: 'મેડીમાર્ટ',
    Malayalam: 'മെഡിമാർട്ട്',
    Punjabi: 'ਮੈਡੀਮਾਰਟ',
  },
};

// Build reverse dictionary to recover original English phrases from any language
const REVERSE_DICTIONARY: Record<string, string> = {};
for (const [englishKey, translations] of Object.entries(TRANSLATION_DICTIONARY)) {
  REVERSE_DICTIONARY[englishKey.toLowerCase()] = englishKey;
  for (const translated of Object.values(translations)) {
    if (translated) {
      REVERSE_DICTIONARY[translated.trim().toLowerCase()] = englishKey;
    }
  }
}

// Pre-sorted list of dictionary phrases by descending character length for sub-string matching
const SORTED_PHRASE_KEYS = Object.keys(TRANSLATION_DICTIONARY).sort((a, b) => b.length - a.length);

/**
 * Returns translated string for a given text and target language
 */
export function translateText(text: string, targetLanguage: string): string {
  if (!text || targetLanguage === 'English') return text;

  const lang = targetLanguage as SupportedLanguage;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Preserve leading & trailing whitespace
  const leading = text.match(/^\s*/)?.[0] || '';
  const trailing = text.match(/\s*$/)?.[0] || '';

  // 1. Direct exact phrase match
  if (TRANSLATION_DICTIONARY[trimmed]?.[lang]) {
    return leading + TRANSLATION_DICTIONARY[trimmed]![lang]! + trailing;
  }

  // 2. Check case-insensitive exact match
  const lower = trimmed.toLowerCase();
  if (REVERSE_DICTIONARY[lower]) {
    const origKey = REVERSE_DICTIONARY[lower];
    if (TRANSLATION_DICTIONARY[origKey]?.[lang]) {
      return leading + TRANSLATION_DICTIONARY[origKey]![lang]! + trailing;
    }
  }

  // 3. Dynamic patterns: Greeting + Name (e.g., "Good Day, Dr. V. Mohan!" or "Good Day, Sarath Paturu!")
  const greetingMatch = trimmed.match(/^(Good Day,|Welcome,|Hello,|Hi!|Welcome back,)\s+(.+)$/i);
  if (greetingMatch) {
    const greetingWord = greetingMatch[1];
    const personName = greetingMatch[2];
    const translatedGreeting = TRANSLATION_DICTIONARY[greetingWord]?.[lang] || greetingWord;
    return leading + `${translatedGreeting} ${personName}` + trailing;
  }

  // 4. Pattern: Term with number count (e.g. "Active (3)", "Waiting (12)", "Pending (5)")
  const countMatch = trimmed.match(/^([A-Za-z\s]+)\s*(\(\d+\))$/);
  if (countMatch) {
    const word = countMatch[1].trim();
    const count = countMatch[2];
    const trans = TRANSLATION_DICTIONARY[word]?.[lang];
    if (trans) {
      return leading + `${trans} ${count}` + trailing;
    }
  }

  // 5. Pattern: Label with colon (e.g. "Status: Active", "Total: ₹500", "Consultation Fee: ₹800")
  if (trimmed.includes(':')) {
    const colonIndex = trimmed.indexOf(':');
    const labelPart = trimmed.slice(0, colonIndex).trim();
    const valuePart = trimmed.slice(colonIndex + 1).trim();
    const transLabel = TRANSLATION_DICTIONARY[labelPart]?.[lang] || labelPart;
    const transValue = TRANSLATION_DICTIONARY[valuePart]?.[lang] || valuePart;
    return leading + `${transLabel}: ${transValue}` + trailing;
  }

  // 6. Pattern: Number + Unit (e.g. "12 Patients", "3 Orders", "5 Items", "24 Consultations")
  const numUnitMatch = trimmed.match(/^(\d+)\s+([A-Za-z\s]+)$/);
  if (numUnitMatch) {
    const num = numUnitMatch[1];
    const unit = numUnitMatch[2].trim();
    const transUnit = TRANSLATION_DICTIONARY[unit]?.[lang];
    if (transUnit) {
      return leading + `${num} ${transUnit}` + trailing;
    }
  }

  // 7. Pattern: Currency + Amount + Unit (e.g. "₹800 Fee", "₹1,200 Total")
  const curUnitMatch = trimmed.match(/^(₹|Rs\.?|\$)\s*([\d,]+)\s+([A-Za-z\s]+)$/);
  if (curUnitMatch) {
    const symbol = curUnitMatch[1];
    const amt = curUnitMatch[2];
    const word = curUnitMatch[3].trim();
    const transWord = TRANSLATION_DICTIONARY[word]?.[lang];
    if (transWord) {
      return leading + `${symbol}${amt} ${transWord}` + trailing;
    }
  }

  // 8. Multi-token / sentence replacement using sorted phrase keys
  let processed = trimmed;
  let replacedAny = false;
  for (const phraseKey of SORTED_PHRASE_KEYS) {
    if (phraseKey.length < 3) continue;
    const transPhrase = TRANSLATION_DICTIONARY[phraseKey]?.[lang];
    if (!transPhrase) continue;

    // Use boundary check if purely alphanumeric
    const isAlpha = /^[a-zA-Z\s]+$/.test(phraseKey);
    if (isAlpha) {
      const regex = new RegExp(`\\b${phraseKey}\\b`, 'gi');
      if (regex.test(processed)) {
        processed = processed.replace(regex, transPhrase);
        replacedAny = true;
      }
    } else {
      if (processed.includes(phraseKey)) {
        processed = processed.split(phraseKey).join(transPhrase);
        replacedAny = true;
      }
    }
  }

  if (replacedAny) {
    return leading + processed + trailing;
  }

  return text;
}

// Global WeakMap to store pristine original English strings for every DOM node
const originalTextMap = new WeakMap<Node, string>();
const originalPlaceholderMap = new WeakMap<Element, string>();
const originalTitleMap = new WeakMap<Element, string>();
const originalAriaMap = new WeakMap<Element, string>();

/**
 * Traverses DOM tree and translates text nodes, placeholders, titles, and labels
 */
export function applyDOMTranslation(container: HTMLElement | Document = document, targetLanguage: string): void {
  if (typeof document === 'undefined') return;

  const isEnglish = targetLanguage === 'English' || !targetLanguage;
  const lang = targetLanguage as SupportedLanguage;

  const rootElement = container instanceof Document ? document.body : container;
  if (!rootElement) return;

  // Walk text nodes
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parentTag = node.parentElement?.tagName;
        if (
          parentTag === 'SCRIPT' ||
          parentTag === 'STYLE' ||
          parentTag === 'NOSCRIPT' ||
          parentTag === 'CODE' ||
          parentTag === 'PRE'
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        const val = node.nodeValue?.trim();
        if (!val || /^\d+$/.test(val) || /^[\s\d:;.,+\-–—()%/\\|₹$#*]+$/.test(val)) {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let currentNode = walker.nextNode();
  while (currentNode) {
    const rawVal = currentNode.nodeValue || '';

    if (!originalTextMap.has(currentNode)) {
      // Check if current text is already a translated string (reverse lookup)
      const trimmedLower = rawVal.trim().toLowerCase();
      const detectedEnglish = REVERSE_DICTIONARY[trimmedLower];
      originalTextMap.set(currentNode, detectedEnglish || rawVal);
    }

    const original = originalTextMap.get(currentNode) || rawVal;

    if (isEnglish) {
      if (currentNode.nodeValue !== original) {
        currentNode.nodeValue = original;
      }
    } else {
      const translated = translateText(original, lang);
      if (translated !== currentNode.nodeValue) {
        currentNode.nodeValue = translated;
      }
    }

    currentNode = walker.nextNode();
  }

  // Also translate input placeholders
  const inputs = rootElement.querySelectorAll('input[placeholder], textarea[placeholder]');
  inputs.forEach((el) => {
    const input = el as HTMLInputElement | HTMLTextAreaElement;
    if (!originalPlaceholderMap.has(input)) {
      const trimmedLower = input.placeholder.trim().toLowerCase();
      const detectedEnglish = REVERSE_DICTIONARY[trimmedLower];
      originalPlaceholderMap.set(input, detectedEnglish || input.placeholder);
    }
    const origPlaceholder = originalPlaceholderMap.get(input) || input.placeholder;
    if (isEnglish) {
      if (input.placeholder !== origPlaceholder) {
        input.placeholder = origPlaceholder;
      }
    } else {
      const translated = translateText(origPlaceholder, lang);
      if (input.placeholder !== translated) {
        input.placeholder = translated;
      }
    }
  });

  // Also translate button/element titles
  const titled = rootElement.querySelectorAll('[title]');
  titled.forEach((el) => {
    const elem = el as HTMLElement;
    if (!originalTitleMap.has(elem)) {
      const trimmedLower = elem.title.trim().toLowerCase();
      const detectedEnglish = REVERSE_DICTIONARY[trimmedLower];
      originalTitleMap.set(elem, detectedEnglish || elem.title);
    }
    const origTitle = originalTitleMap.get(elem) || elem.title;
    if (isEnglish) {
      if (elem.title !== origTitle) elem.title = origTitle;
    } else {
      const translated = translateText(origTitle, lang);
      if (elem.title !== translated) elem.title = translated;
    }
  });

  // Also translate aria-labels
  const labeled = rootElement.querySelectorAll('[aria-label]');
  labeled.forEach((el) => {
    const elem = el as HTMLElement;
    const currentAria = elem.getAttribute('aria-label') || '';
    if (!currentAria) return;
    if (!originalAriaMap.has(elem)) {
      const trimmedLower = currentAria.trim().toLowerCase();
      const detectedEnglish = REVERSE_DICTIONARY[trimmedLower];
      originalAriaMap.set(elem, detectedEnglish || currentAria);
    }
    const origAria = originalAriaMap.get(elem) || currentAria;
    if (isEnglish) {
      if (elem.getAttribute('aria-label') !== origAria) {
        elem.setAttribute('aria-label', origAria);
      }
    } else {
      const translated = translateText(origAria, lang);
      if (elem.getAttribute('aria-label') !== translated) {
        elem.setAttribute('aria-label', translated);
      }
    }
  });
}

