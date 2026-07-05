const { updateDb } = require('../services/database');
const { sendJson } = require('../utils/http');

function sanitizeName(name, fallback) {
  return String(name || fallback).trim().replace(/\s+/g, ' ').slice(0, 40) || fallback;
}

function login(request, response, body) {
  const role = body.role === 'doctor' ? 'doctor' : 'patient';
  const user = {
    id: `${role}-${Date.now()}`,
    name: sanitizeName(body.name, role === 'doctor' ? 'Doctor' : 'Patient'),
    role,
    loggedInAt: new Date().toISOString()
  };

  updateDb((db) => {
    db.users = [user, ...(db.users || [])].slice(0, 50);
    return db;
  });

  sendJson(response, 200, { user });
}

module.exports = { login };
