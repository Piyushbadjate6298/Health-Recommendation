const { issues, safetyNotes, sourceLinks } = require('../data/issues');
const { buildChatReply } = require('../services/chatService');
const { sendJson } = require('../utils/http');

function getIssues(request, response) {
  sendJson(response, 200, { issues, safetyNotes, sourceLinks });
}

function chat(request, response, body) {
  const reply = buildChatReply(String(body.question || ''));
  sendJson(response, 200, { reply, safetyNotes, sourceLinks });
}

module.exports = { getIssues, chat };
