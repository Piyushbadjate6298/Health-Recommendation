const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const mongoose = require('mongoose');
const { handleApi } = require('../backend/src/routes/apiRoutes');

let mongoConnectionPromise;

async function connectMongoDb() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongoConnectionPromise) {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in Vercel environment variables');
    }

    if (mongoUri.includes('YOUR_PASSWORD') || mongoUri.includes('<db_password>')) {
      throw new Error('Replace YOUR_PASSWORD with your real MongoDB Atlas password');
    }

    mongoConnectionPromise = mongoose.connect(mongoUri);
  }

  await mongoConnectionPromise;
}

module.exports = async function handler(request, response) {
  try {
    await connectMongoDb();
    const { pathname } = new URL(request.url, `https://${request.headers.host}`);
    await handleApi(request, response, pathname);
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: error.message || 'Server failed' }));
  }
};
