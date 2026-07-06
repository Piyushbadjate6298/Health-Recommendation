const { createUser } = require('../services/database');
const { sendJson } = require('../utils/http');

function sanitizeName(name, fallback) {
  return String(name || fallback).trim().replace(/\s+/g, ' ').slice(0, 40) || fallback;
}

async function login(request, response, body) {
  const role = body.role === 'doctor' ? 'doctor' : 'patient';
  const user = {
    id: `${role}-${Date.now()}`,
    name: sanitizeName(body.name, role === 'doctor' ? 'Doctor' : 'Patient'),
    role,
    loggedInAt: new Date().toISOString()
  };

  await createUser(user);

  sendJson(response, 200, { user });
}

module.exports = { login };
