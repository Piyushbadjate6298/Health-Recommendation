const {
  createPatientRequest,
  getAdviceText,
  listRequests,
  markRequestReviewed,
  saveAdviceText,
  seedPatientRequests
} = require('../services/database');
const { sendJson } = require('../utils/http');

const sampleRequests = [
  {
    id: 'sample-1',
    patient: 'Rahul Patil',
    concern: 'Fever with weakness',
    duration: '2 days',
    urgency: 'Soon',
    details: 'Temperature around 101 F, body pain, no breathing trouble.',
    status: 'Waiting review',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    patient: 'Aarti Sharma',
    concern: 'Cough and cold',
    duration: '1 week',
    urgency: 'Routine',
    details: 'Dry cough, blocked nose, no chest pain.',
    status: 'Waiting review',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-3',
    patient: 'Sameer Khan',
    concern: 'Severe acidity symptoms',
    duration: '3 days',
    urgency: 'Urgent',
    details: 'Burning chest after food and repeated vomiting. Needs clinical review.',
    status: 'Waiting review',
    createdAt: new Date().toISOString()
  }
];

function clean(value, fallback = '') {
  return String(value || fallback).trim().slice(0, 500);
}

async function getRequests(request, response) {
  const requests = await listRequests();
  sendJson(response, 200, { requests });
}

async function createRequest(request, response, body) {
  const patientRequest = {
    id: `req-${Date.now()}`,
    patient: clean(body.patient, 'Patient').slice(0, 60),
    concern: clean(body.concern, 'Health concern').slice(0, 120),
    duration: clean(body.duration, 'Not mentioned').slice(0, 80),
    urgency: ['Routine', 'Soon', 'Urgent'].includes(body.urgency) ? body.urgency : 'Routine',
    details: clean(body.details, 'No details provided.'),
    status: 'Waiting review',
    createdAt: new Date().toISOString()
  };

  await createPatientRequest(patientRequest);

  sendJson(response, 201, { request: patientRequest });
}

async function markReviewed(request, response, id) {
  const requests = await markRequestReviewed(id);
  sendJson(response, 200, { requests });
}

async function seedRequests(request, response) {
  const requests = await seedPatientRequests(sampleRequests);
  sendJson(response, 200, { requests });
}

async function getAdvice(request, response) {
  const advice = await getAdviceText();
  sendJson(response, 200, { advice });
}

async function saveAdvice(request, response, body) {
  const note = clean(body.advice, '').slice(0, 1500);
  await saveAdviceText(note);
  sendJson(response, 200, { advice: note });
}

module.exports = { getRequests, createRequest, markReviewed, seedRequests, getAdvice, saveAdvice };
