const sourceLinks = [
  { label: 'WHO health topics', url: 'https://www.who.int/health-topics' },
  { label: 'CDC health topics', url: 'https://www.cdc.gov/health-topics.html' },
  { label: 'MedlinePlus', url: 'https://medlineplus.gov/healthtopics.html' }
];

const safetyNotes = {
  disclaimer: 'This is general educational information, not a diagnosis or prescription.',
  emergency: 'Seek urgent local medical care now for chest pain, severe breathing trouble, fainting, seizures, severe bleeding, stroke signs, severe allergic swelling, or self-harm thoughts.',
  privacy: 'Avoid sharing full personal identifiers in a demo chatbot. A production version needs secure backend storage and privacy controls.'
};

const issues = [
  {
    name: 'Fever',
    icon: 'FE',
    desc: 'High temperature, chills, body pain, weakness, or sweating.',
    symptoms: ['Temperature above normal', 'Chills or sweating', 'Body ache', 'Tiredness'],
    solution: 'Rest, drink fluids, wear light clothing, and monitor temperature. Use fever medicine only as directed on the label or by a clinician.',
    diet: 'Water, ORS if dehydrated, soup, dal-rice, banana, curd rice, and easy-to-digest meals.',
    warning: 'Get medical help for fever above 103 F, fever lasting more than 3 days, stiff neck, confusion, rash, dehydration, breathing trouble, or fever in infants.',
    prevention: 'Hand hygiene, safe food and water, vaccination when appropriate, and avoiding close contact during infections.'
  },
  {
    name: 'Cough',
    icon: 'CO',
    desc: 'Dry or wet cough, throat irritation, mucus, or chest discomfort.',
    symptoms: ['Dry throat', 'Mucus', 'Runny nose', 'Chest irritation'],
    solution: 'Drink warm fluids, rest your voice, avoid smoke and dust, and consider honey for adults and children over 1 year.',
    diet: 'Warm water, ginger tea, soup, soft foods, and enough fluids.',
    warning: 'Seek care for shortness of breath, chest pain, coughing blood, high fever, wheezing, blue lips, or cough lasting more than 2 to 3 weeks.',
    prevention: 'Cover coughs, wash hands, improve ventilation, avoid smoke, and stay home when contagious.'
  },
  {
    name: 'Headache',
    icon: 'HD',
    desc: 'Head pain linked with stress, dehydration, sleep loss, screens, or migraine.',
    symptoms: ['Pressure or throbbing pain', 'Light sensitivity', 'Nausea', 'Neck strain'],
    solution: 'Hydrate, rest in a quiet room, reduce screen brightness, eat if you skipped meals, and track triggers.',
    diet: 'Water, balanced meals, nuts, fruit, and avoiding excess caffeine or skipped meals.',
    warning: 'Urgent care is needed for sudden worst headache, headache after injury, fever with stiff neck, weakness, fainting, vision changes, or repeated vomiting.',
    prevention: 'Regular sleep, hydration, posture breaks, stress management, and trigger tracking.'
  },
  {
    name: 'Stomach Pain',
    icon: 'SP',
    desc: 'Cramps, gas, indigestion, nausea, loose motion, or abdominal discomfort.',
    symptoms: ['Cramps', 'Bloating', 'Nausea', 'Loose stools'],
    solution: 'Eat light, sip fluids, avoid oily food, rest, and watch whether pain is worsening or localized.',
    diet: 'ORS, plain water, rice, banana, toast, curd rice, khichdi, and small frequent meals.',
    warning: 'Seek care for severe or right-lower abdominal pain, blood in stool, black stool, persistent vomiting, dehydration, pregnancy, fever, or pain lasting more than 24 hours.',
    prevention: 'Hand hygiene, safe food, clean water, slow eating, and avoiding known trigger foods.'
  },
  {
    name: 'Weakness',
    icon: 'WK',
    desc: 'Low energy, fatigue, dizziness, poor sleep, or body heaviness.',
    symptoms: ['Tiredness', 'Low stamina', 'Dizziness', 'Poor concentration'],
    solution: 'Sleep adequately, hydrate, eat balanced meals, avoid overwork, and track associated symptoms.',
    diet: 'Dal, eggs or paneer, sprouts, milk, fruits, dates, green vegetables, and enough water.',
    warning: 'Consult a clinician for fainting, chest pain, shortness of breath, sudden weakness on one side, unexplained weight loss, paleness, or persistent fatigue.',
    prevention: 'Regular meals, sleep routine, hydration, movement, and routine checkups when fatigue persists.'
  },
  {
    name: 'Cold',
    icon: 'CL',
    desc: 'Runny nose, sneezing, blocked nose, sore throat, or mild cough.',
    symptoms: ['Sneezing', 'Blocked nose', 'Sore throat', 'Mild cough'],
    solution: 'Rest, drink warm fluids, use saline nasal rinse if suitable, and avoid spreading infection.',
    diet: 'Soup, warm water, vitamin C rich fruits, light meals, and fluids.',
    warning: 'See a doctor for breathing difficulty, high fever, symptoms beyond 10 days, ear pain, severe sinus pain, or worsening after initial improvement.',
    prevention: 'Hand hygiene, masks when ill, ventilation, and avoiding close contact with sick people.'
  },
  {
    name: 'Skin Allergy',
    icon: 'AL',
    desc: 'Rash, itching, redness, swelling, hives, or irritation after exposure.',
    symptoms: ['Itching', 'Red patches', 'Hives', 'Swelling'],
    solution: 'Avoid the suspected trigger, do not scratch, wash gently with clean water, and use a cool compress.',
    diet: 'Water, fresh simple meals, and avoiding a suspected food trigger until reviewed.',
    warning: 'Emergency care is needed for face, lip, or tongue swelling; breathing difficulty; dizziness; widespread fast-spreading rash; or allergy after a new medicine.',
    prevention: 'Patch test new products, track triggers, avoid known allergens, and discuss repeated reactions with a clinician.'
  },
  {
    name: 'Acidity',
    icon: 'AC',
    desc: 'Burning chest, sour burps, bloating, heaviness, or reflux after meals.',
    symptoms: ['Burning sensation', 'Sour taste', 'Burping', 'Bloating'],
    solution: 'Eat smaller meals, avoid lying down for 2 to 3 hours after food, reduce spicy/fried foods, and elevate the head during sleep if reflux occurs.',
    diet: 'Banana, oats, curd, plain rice, vegetables, water, and less oily food.',
    warning: 'Urgent care may be needed for severe chest pain, sweating, pain radiating to arm or jaw, black stool, vomiting blood, trouble swallowing, or weight loss.',
    prevention: 'Meal timing, weight management if needed, avoiding tobacco, limiting alcohol, and identifying trigger foods.'
  },
  {
    name: 'Stress',
    icon: 'ST',
    desc: 'Anxiety, overthinking, sleep issues, irritability, or difficulty focusing.',
    symptoms: ['Racing thoughts', 'Poor sleep', 'Tension', 'Low mood'],
    solution: 'Try slow breathing, a short walk, reducing caffeine, journaling, and talking with a trusted person.',
    diet: 'Water, fruit, nuts, balanced meals, and lighter caffeine intake.',
    warning: 'Seek professional help if stress affects daily life, causes panic attacks, substance misuse, self-harm thoughts, or feeling unsafe.',
    prevention: 'Sleep schedule, movement, social support, realistic workload, and counseling when stress is persistent.'
  }
];

module.exports = { issues, safetyNotes, sourceLinks };
