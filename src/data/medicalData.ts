// medicalData.ts
export interface MedicalCondition {
  keywords: string[];
  title: string;
  cause: string;
  home: string;
  otc: string;
  danger: string;
  urgency: 'low' | 'medium' | 'high';
}

export const medicalData: MedicalCondition[] = [
  {
    keywords: ["fever", "temperature", "high temperature", "burning", "hot"],
    title: "Fever",
    cause: "Usually viral or bacterial infection, sometimes due to heat exhaustion or inflammatory conditions.",
    home: "Rest, drink warm fluids, sponge with lukewarm water, wear light clothing.",
    otc: "Paracetamol (500mg) every 6-8 hrs if needed, maximum 4g per day.",
    danger: "If >102°F for 3+ days, with severe headache, or difficulty breathing → consult doctor immediately.",
    urgency: 'medium'
  },
  {
    keywords: ["cough", "cold", "sneeze", "runny nose", "blocked nose"],
    title: "Common Cold / Cough",
    cause: "Viral infection of upper respiratory tract.",
    home: "Steam inhalation 3x daily, warm salt water gargle, honey with ginger, adequate rest.",
    otc: "Cough syrup (dextromethorphan), paracetamol if fever, nasal decongestants.",
    danger: "If lasts >10 days, blood in phlegm, or breathing difficulty → seek medical attention.",
    urgency: 'low'
  },
  {
    keywords: ["headache", "migraine", "head pain", "tension"],
    title: "Headache",
    cause: "Stress, dehydration, eye strain, migraine, tension, sinusitis.",
    home: "Rest in dark quiet room, drink water, apply cold pack, gentle neck stretches.",
    otc: "Paracetamol or Ibuprofen (400mg), avoid overuse.",
    danger: "Sudden severe headache, with vision loss, confusion, or neck stiffness → emergency care needed.",
    urgency: 'low'
  },
  {
    keywords: ["stomach pain", "diarrhea", "loose motion", "upset stomach", "gastro"],
    title: "Stomach Issues",
    cause: "Food poisoning, viral/bacterial infection, indigestion, stress.",
    home: "ORS solution frequently, BRAT diet (banana, rice, applesauce, toast), probiotics.",
    otc: "ORS sachets, zinc supplements, probiotics, antacids.",
    danger: "If blood in stool, severe dehydration, or persists >2 days → consult doctor.",
    urgency: 'medium'
  },
  {
    keywords: ["vomit", "nausea", "throwing up", "morning sickness"],
    title: "Vomiting",
    cause: "Food infection, motion sickness, pregnancy, gastritis.",
    home: "Small sips of ORS/water, rest stomach, ginger tea, avoid solid food initially.",
    otc: "ORS, Domperidone 10mg (only if previously advised), ginger tablets.",
    danger: "If continuous, with severe abdominal pain, or blood in vomit → immediate medical attention.",
    urgency: 'medium'
  },
  {
    keywords: ["sore throat", "throat pain", "difficulty swallowing", "tonsils"],
    title: "Sore Throat",
    cause: "Viral/bacterial infection, allergy, acid reflux, pollution.",
    home: "Warm salt water gargle 4-5 times/day, warm fluids, honey-lemon tea.",
    otc: "Paracetamol, throat lozenges, benzocaine spray.",
    danger: "If white patches, severe swelling, high fever, or difficulty breathing → doctor visit urgent.",
    urgency: 'low'
  },
  {
    keywords: ["skin rash", "itching", "allergy", "hives", "eczema"],
    title: "Skin Rash / Allergy",
    cause: "Allergic reaction, irritation, infection, eczema, heat rash.",
    home: "Cool compress, calamine lotion, avoid scratching, oatmeal bath.",
    otc: "Antihistamine tablets (cetirizine 10mg), hydrocortisone cream 1%.",
    danger: "If spreading rapidly, facial/lip swelling, or breathing difficulty → emergency care.",
    urgency: 'medium'
  },
  {
    keywords: ["fatigue", "tired", "weak", "exhausted", "no energy"],
    title: "Fatigue",
    cause: "Lack of sleep, anemia, thyroid issues, overwork, depression.",
    home: "8 hours sleep, balanced diet, hydration, light exercise, stress management.",
    otc: "Multivitamin supplements, iron supplements (if anemic), B12.",
    danger: "If persistent >2 weeks with weight loss or other symptoms → blood tests needed.",
    urgency: 'low'
  },
  {
    keywords: ["back pain", "lower back", "spine pain", "backache"],
    title: "Back Pain",
    cause: "Muscle strain, poor posture, disc problems, arthritis.",
    home: "Hot/cold compress alternating, gentle stretching, proper posture, yoga.",
    otc: "Paracetamol, muscle relaxants, topical pain relief gel.",
    danger: "If with numbness, weakness in legs, or bladder issues → urgent medical care.",
    urgency: 'low'
  },
  {
    keywords: ["tooth pain", "toothache", "dental pain", "cavity"],
    title: "Toothache",
    cause: "Cavity, infection, gum disease, tooth fracture.",
    home: "Clove oil application, warm salt water rinse, cold compress externally.",
    otc: "Paracetamol, benzocaine dental gel, antiseptic mouthwash.",
    danger: "If facial swelling, fever, or severe pain → dentist/doctor immediately.",
    urgency: 'medium'
  },
  {
    keywords: ["chest pain", "heart", "chest tightness", "breathing problem"],
    title: "Chest Pain",
    cause: "Muscle strain, acid reflux, anxiety, heart issues, lung problems.",
    home: "Rest, sit upright, deep breathing, antacids if heartburn.",
    otc: "Antacids for heartburn, paracetamol for muscle pain.",
    danger: "If crushing pain, radiating to arm/jaw, with sweating → call emergency immediately!",
    urgency: 'high'
  },
  {
    keywords: ["anxiety", "panic", "stress", "worried", "nervous"],
    title: "Anxiety / Stress",
    cause: "Life stress, work pressure, health concerns, genetic factors.",
    home: "Deep breathing exercises, meditation, regular exercise, adequate sleep.",
    otc: "Herbal teas (chamomile), magnesium supplements, avoid caffeine.",
    danger: "If affecting daily life, with chest pain or suicidal thoughts → seek help urgently.",
    urgency: 'medium'
  },
  {
    keywords: ["insomnia", "can't sleep", "sleep problem", "sleepless"],
    title: "Insomnia",
    cause: "Stress, anxiety, caffeine, irregular schedule, medical conditions.",
    home: "Sleep hygiene, no screens before bed, warm milk, regular schedule.",
    otc: "Melatonin 3mg, herbal sleep aids, avoid sleeping pills without prescription.",
    danger: "If chronic (>1 month) affecting daily function → consult doctor.",
    urgency: 'low'
  },
  {
    keywords: ["constipation", "can't pass stool", "hard stool", "bowel problem"],
    title: "Constipation",
    cause: "Low fiber diet, dehydration, lack of exercise, medications.",
    home: "Increase fiber, drink 8-10 glasses water, exercise, prune juice.",
    otc: "Isabgol husk, lactulose syrup, glycerin suppositories.",
    danger: "If with severe pain, blood, or >1 week → medical evaluation needed.",
    urgency: 'low'
  },
  {
    keywords: ["acidity", "heartburn", "acid reflux", "GERD", "burning chest"],
    title: "Acidity / Heartburn",
    cause: "Spicy food, overeating, lying down after meals, obesity.",
    home: "Small frequent meals, avoid spicy/fatty foods, elevate head while sleeping.",
    otc: "Antacids (ENO, Gelusil), omeprazole 20mg (short term).",
    danger: "If with chest pain, difficulty swallowing, or weight loss → doctor consultation.",
    urgency: 'low'
  },
  {
    keywords: ["ear pain", "earache", "ear infection", "blocked ear"],
    title: "Ear Pain",
    cause: "Infection, wax buildup, water trapped, referred pain from throat.",
    home: "Warm compress, keep ear dry, garlic oil drops (if no perforation).",
    otc: "Paracetamol, ear wax softening drops.",
    danger: "If discharge, hearing loss, or severe pain → ENT specialist needed.",
    urgency: 'medium'
  },
  {
    keywords: ["eye pain", "eye strain", "red eyes", "itchy eyes"],
    title: "Eye Problems",
    cause: "Strain from screens, infection, allergy, dry eyes.",
    home: "20-20-20 rule for screens, cold compress, adequate sleep.",
    otc: "Artificial tears, antihistamine eye drops for allergy.",
    danger: "If vision changes, severe pain, or discharge → ophthalmologist urgently.",
    urgency: 'medium'
  },
  {
    keywords: ["joint pain", "arthritis", "knee pain", "swollen joints"],
    title: "Joint Pain",
    cause: "Arthritis, injury, overuse, gout, infection.",
    home: "Rest, ice application, gentle exercises, weight management.",
    otc: "Ibuprofen gel, glucosamine supplements, hot/cold therapy.",
    danger: "If sudden severe pain, redness, fever → could be infection, see doctor.",
    urgency: 'low'
  },
  {
    keywords: ["urinary problem", "UTI", "burning urination", "frequent urination"],
    title: "Urinary Issues",
    cause: "UTI, dehydration, kidney stones, diabetes.",
    home: "Drink plenty of water, cranberry juice, proper hygiene.",
    otc: "Urinary alkalizers, cranberry supplements.",
    danger: "If blood in urine, fever, or severe back pain → immediate medical care.",
    urgency: 'medium'
  },
  {
    keywords: ["dizziness", "vertigo", "lightheaded", "balance problem"],
    title: "Dizziness",
    cause: "Inner ear problems, dehydration, low blood pressure, anemia.",
    home: "Sit/lie down immediately, hydrate, avoid sudden movements.",
    otc: "Antihistamines for vertigo, rehydration salts.",
    danger: "If with chest pain, speech problems, or weakness → emergency care.",
    urgency: 'medium'
  },
  {
    keywords: ["nosebleed", "bleeding nose", "epistaxis"],
    title: "Nosebleed",
    cause: "Dry air, picking nose, injury, high blood pressure.",
    home: "Lean forward, pinch nose for 10 mins, ice on bridge of nose.",
    otc: "Saline nasal spray, petroleum jelly for dryness.",
    danger: "If >20 minutes, frequent episodes, or after injury → seek medical help.",
    urgency: 'low'
  },
  {
    keywords: ["allergic reaction", "swelling", "difficulty breathing", "anaphylaxis"],
    title: "Allergic Reaction",
    cause: "Food, medication, insect stings, environmental allergens.",
    home: "Remove allergen, antihistamines, cool compress.",
    otc: "Cetirizine 10mg, loratadine 10mg immediately.",
    danger: "If throat swelling, breathing difficulty → use EpiPen if available, call emergency!",
    urgency: 'high'
  },
  {
    keywords: ["burns", "burn injury", "hot water burn", "sunburn"],
    title: "Burns",
    cause: "Heat, chemicals, electricity, sun exposure.",
    home: "Cool water for 20 mins, aloe vera gel, keep clean and dry.",
    otc: "Silver sulfadiazine cream, pain relievers, burn gel.",
    danger: "If large area, deep burn, or on face/joints → hospital immediately.",
    urgency: 'high'
  },
  {
    keywords: ["cut", "wound", "bleeding", "injury", "laceration"],
    title: "Cuts and Wounds",
    cause: "Sharp objects, accidents, falls.",
    home: "Clean with water, apply pressure to stop bleeding, bandage.",
    otc: "Antiseptic solution, adhesive bandages, antibiotic ointment.",
    danger: "If deep, gaping, won't stop bleeding, or signs of infection → medical attention.",
    urgency: 'medium'
  },
  {
    keywords: ["high blood pressure", "hypertension", "BP high"],
    title: "High Blood Pressure",
    cause: "Stress, obesity, high salt intake, genetics, kidney disease.",
    home: "Reduce salt, exercise, stress management, weight loss.",
    otc: "Monitor BP regularly, garlic supplements (consult doctor first).",
    danger: "If >180/120, with headache or chest pain → emergency care immediately.",
    urgency: 'high'
  },
  {
    keywords: ["diabetes", "high sugar", "blood sugar", "glucose"],
    title: "Diabetes Management",
    cause: "Insulin resistance, pancreatic issues, genetics, lifestyle.",
    home: "Regular monitoring, diet control, exercise, medication compliance.",
    otc: "Glucose monitoring strips, sugar-free alternatives.",
    danger: "If very high/low sugar, confusion, or unconsciousness → emergency care.",
    urgency: 'high'
  },
  {
    keywords: ["asthma", "wheezing", "breathing difficulty", "inhaler"],
    title: "Asthma",
    cause: "Allergens, exercise, cold air, stress, respiratory infections.",
    home: "Avoid triggers, use inhaler as prescribed, breathing exercises.",
    otc: "Keep rescue inhaler handy, avoid OTC without doctor advice.",
    danger: "If inhaler not helping, blue lips, can't speak → emergency immediately.",
    urgency: 'high'
  },
  {
    keywords: ["covid", "coronavirus", "covid symptoms", "positive covid"],
    title: "COVID-19",
    cause: "SARS-CoV-2 virus infection.",
    home: "Isolate, rest, hydrate, monitor oxygen, paracetamol for fever.",
    otc: "Paracetamol, vitamin C/D/Zinc, pulse oximeter for monitoring.",
    danger: "If oxygen <94%, breathing difficulty, persistent chest pain → hospital urgently.",
    urgency: 'high'
  },
  {
    keywords: ["pregnancy", "pregnant", "morning sickness", "prenatal"],
    title: "Pregnancy Concerns",
    cause: "Various pregnancy-related symptoms and concerns.",
    home: "Regular prenatal visits, balanced diet, gentle exercise, adequate rest.",
    otc: "Prenatal vitamins, folic acid, iron supplements as prescribed.",
    danger: "If bleeding, severe pain, no fetal movement → immediate medical care.",
    urgency: 'high'
  },
  {
    keywords: ["depression", "sad", "hopeless", "mental health"],
    title: "Depression",
    cause: "Chemical imbalance, life events, genetics, medical conditions.",
    home: "Talk to someone, regular exercise, sunlight exposure, routine.",
    otc: "St. John's Wort (with caution), omega-3 supplements.",
    danger: "If suicidal thoughts or self-harm → crisis hotline or emergency immediately.",
    urgency: 'high'
  }
];

export const getBotResponse = (input: string): {
  message: string;
  urgency: 'low' | 'medium' | 'high';
  suggestions?: string[];
} => {
  const lower = input.toLowerCase();
  
  // Check for emergency keywords first
  const emergencyKeywords = ['emergency', 'urgent', 'severe', 'ambulance', 'can\'t breathe', 'chest pain', 'unconscious'];
  if (emergencyKeywords.some(keyword => lower.includes(keyword))) {
    return {
      message: "🚨 **EMERGENCY DETECTED** 🚨\n\nBased on your symptoms, you need immediate medical attention!\n\n📞 Call emergency services (108/102) immediately\n🏥 Go to the nearest emergency room\n\nWhile waiting:\n• Stay calm and sit upright if breathing is difficult\n• Loosen any tight clothing\n• If prescribed, use emergency medications\n• Have someone stay with you",
      urgency: 'high',
      suggestions: ['Call Ambulance', 'Find Nearest Hospital', 'Emergency Contacts']
    };
  }

  // Try to find a matching condition
  for (const condition of medicalData) {
    if (condition.keywords.some(k => lower.includes(k))) {
      let message = `🩺 **${condition.title}**\n\n`;
      message += `📌 **Probable Cause:** ${condition.cause}\n\n`;
      message += `🏠 **Home Remedies:** ${condition.home}\n\n`;
      message += `💊 **Over-the-Counter:** ${condition.otc}\n\n`;
      message += `⚠️ **Warning Signs:** ${condition.danger}\n\n`;
      
      if (condition.urgency === 'high') {
        message += `🔴 **This requires urgent attention!**`;
      } else if (condition.urgency === 'medium') {
        message += `🟡 **Monitor closely and seek medical help if symptoms worsen.**`;
      } else {
        message += `🟢 **This is usually manageable at home, but consult a doctor if it persists.**`;
      }

      const suggestions = [];
      if (condition.urgency === 'high') {
        suggestions.push('Book Emergency Appointment');
      } else {
        suggestions.push('Book Regular Appointment');
      }
      suggestions.push('Find Nearby Pharmacy', 'Talk to Doctor');

      return {
        message,
        urgency: condition.urgency,
        suggestions
      };
    }
  }

  // Default response for unrecognized symptoms
  return {
    message: `❓ I couldn't identify specific symptoms from your description.\n\n**Please provide more details about:**\n• What symptoms are you experiencing?\n• How long have you had these symptoms?\n• Any other relevant information?\n\n**Common issues I can help with:**\n• Fever, cough, cold\n• Headache, body pain\n• Stomach issues, nausea\n• Skin problems, allergies\n• And many more...\n\n⚠️ **Important:** For accurate diagnosis, please consult a qualified doctor. I'm here to provide general guidance only.`,
    urgency: 'low',
    suggestions: ['Book Appointment', 'Symptom Checker', 'Find Doctor']
  };
};

// Additional helper function for quick symptom categories
export const symptomCategories = [
  { icon: '🤒', label: 'Fever & Flu', keywords: ['fever', 'cold', 'flu'] },
  { icon: '🤕', label: 'Pain & Aches', keywords: ['pain', 'ache', 'hurt'] },
  { icon: '🤧', label: 'Respiratory', keywords: ['cough', 'breathing', 'asthma'] },
  { icon: '🤢', label: 'Digestive', keywords: ['stomach', 'vomit', 'diarrhea'] },
  { icon: '🧠', label: 'Mental Health', keywords: ['anxiety', 'depression', 'stress'] },
  { icon: '❤️', label: 'Heart & BP', keywords: ['heart', 'chest', 'pressure'] },
  { icon: '🦴', label: 'Bones & Joints', keywords: ['joint', 'arthritis', 'back'] },
  { icon: '👁️', label: 'Eyes & Ears', keywords: ['eye', 'ear', 'vision'] },
  { icon: '🩹', label: 'Injuries', keywords: ['cut', 'burn', 'wound'] },
  { icon: '💊', label: 'Chronic Conditions', keywords: ['diabetes', 'hypertension', 'asthma'] }
];