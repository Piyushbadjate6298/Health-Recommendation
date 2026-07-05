const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'db.json');

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {
    return { requests: [], advice: '', users: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function updateDb(updater) {
  const data = readDb();
  const updated = updater(data) || data;
  writeDb(updated);
  return updated;
}

module.exports = { readDb, writeDb, updateDb };
