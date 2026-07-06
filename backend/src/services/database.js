const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    patient: { type: String, required: true },
    concern: { type: String, required: true },
    duration: { type: String, required: true },
    urgency: { type: String, enum: ['Routine', 'Soon', 'Urgent'], default: 'Routine' },
    details: { type: String, required: true },
    status: { type: String, default: 'Waiting review' },
    createdAt: { type: String, required: true },
    reviewedAt: { type: String }
  },
  { versionKey: false }
);

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor'], required: true },
    loggedInAt: { type: String, required: true }
  },
  { versionKey: false }
);

const adviceSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'doctor-advice' },
    text: { type: String, default: '' }
  },
  { versionKey: false }
);

const PatientRequest = mongoose.model('PatientRequest', requestSchema);
const User = mongoose.model('User', userSchema);
const Advice = mongoose.model('Advice', adviceSchema);

function withoutMongoId(document) {
  const data = document.toObject ? document.toObject() : document;
  delete data._id;
  return data;
}

async function listRequests(limit = 50) {
  const requests = await PatientRequest.find().sort({ createdAt: -1 }).limit(limit).lean();
  return requests.map(withoutMongoId);
}

async function createPatientRequest(patientRequest) {
  const created = await PatientRequest.create(patientRequest);
  return withoutMongoId(created);
}

async function markRequestReviewed(id) {
  await PatientRequest.updateOne(
    { id },
    { $set: { status: 'Reviewed', reviewedAt: new Date().toISOString() } }
  );
  return listRequests();
}

async function seedPatientRequests(sampleRequests) {
  await PatientRequest.deleteMany({ id: /^sample-/ });
  await PatientRequest.insertMany(sampleRequests, { ordered: false });
  return listRequests();
}

async function getAdviceText() {
  const advice = await Advice.findOne({ key: 'doctor-advice' }).lean();
  return advice ? advice.text : '';
}

async function saveAdviceText(text) {
  await Advice.updateOne({ key: 'doctor-advice' }, { $set: { text } }, { upsert: true });
  return text;
}

async function createUser(user) {
  const created = await User.create(user);
  await trimUsers();
  return withoutMongoId(created);
}

async function trimUsers(limit = 50) {
  const extraUsers = await User.find().sort({ loggedInAt: -1 }).skip(limit).select('_id').lean();
  if (extraUsers.length > 0) {
    await User.deleteMany({ _id: { $in: extraUsers.map((user) => user._id) } });
  }
}

module.exports = {
  createPatientRequest,
  createUser,
  getAdviceText,
  listRequests,
  markRequestReviewed,
  saveAdviceText,
  seedPatientRequests
};
