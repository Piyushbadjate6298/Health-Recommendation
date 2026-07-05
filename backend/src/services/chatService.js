const { issues, safetyNotes } = require('../data/issues');

const emergencyTerms = [
  'chest pain',
  'breathing difficulty',
  'shortness of breath',
  'fainting',
  'confusion',
  'blue lips',
  'seizure',
  'severe bleeding',
  'suicide',
  'self harm',
  'stroke',
  'face drooping',
  'vomiting blood',
  'black stool'
];

function findIssueFromText(text) {
  const normalized = text.toLowerCase();
  return issues.find((issue) => {
    const searchable = [issue.name, issue.desc, issue.symptoms.join(' '), issue.solution, issue.diet, issue.warning]
      .join(' ')
      .toLowerCase();
    return normalized.includes(issue.name.toLowerCase()) || searchable.split(/[^a-z]+/).some((word) => word.length > 4 && normalized.includes(word));
  });
}

function getIntent(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes('diet') || normalized.includes('food') || normalized.includes('eat')) return 'diet';
  if (normalized.includes('danger') || normalized.includes('warning') || normalized.includes('doctor') || normalized.includes('serious')) return 'warning';
  if (normalized.includes('prevent') || normalized.includes('avoid')) return 'prevention';
  if (normalized.includes('symptom') || normalized.includes('feel')) return 'symptoms';
  return 'care';
}

function hasEmergencyText(text) {
  const normalized = text.toLowerCase();
  return emergencyTerms.some((term) => normalized.includes(term));
}

function buildChatReply(question) {
  if (!question || !question.trim()) {
    return {
      title: 'Please ask a health question',
      body: 'Tell me the main symptom, duration, age group, and any warning signs.',
      actions: ['Ask one symptom at a time', 'Avoid sharing private identifiers', 'Use emergency care for severe symptoms'],
      tone: 'normal'
    };
  }

  if (hasEmergencyText(question)) {
    return {
      title: 'Please seek urgent medical help now',
      body: safetyNotes.emergency,
      actions: ['Call local emergency services', 'Do not wait for chatbot advice', 'Stay with a trusted person if possible'],
      tone: 'urgent'
    };
  }

  const issue = findIssueFromText(question);
  const intent = getIntent(question);

  if (!issue) {
    return {
      title: 'Tell me a little more',
      body: 'I can guide common issues like fever, cough, headache, stomach pain, weakness, cold, allergy, acidity, and stress.',
      actions: ['Mention duration and severity', 'Mention any warning signs', 'Use a qualified doctor for diagnosis or medicines'],
      tone: 'normal'
    };
  }

  const replies = {
    diet: `For ${issue.name.toLowerCase()}, these food choices may be gentler: ${issue.diet}`,
    warning: `For ${issue.name.toLowerCase()}, do not ignore these warning signs: ${issue.warning}`,
    symptoms: `${issue.name} can include: ${issue.symptoms.join(', ')}.`,
    prevention: `To reduce repeat ${issue.name.toLowerCase()} problems: ${issue.prevention}`,
    care: `For mild ${issue.name.toLowerCase()}, start with: ${issue.solution}`
  };

  return {
    title: `${issue.name} guidance`,
    body: replies[intent],
    actions: ['Track symptoms and duration', 'Avoid self-medicating with prescription drugs', 'Consult a doctor if severe, unusual, or not improving'],
    tone: 'normal'
  };
}

module.exports = { buildChatReply };
