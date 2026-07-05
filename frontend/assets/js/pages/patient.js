import { api } from '../api/client.js';
import { getUser } from '../modules/session.js';
import { escapeHtml, setStatus } from '../modules/dom.js';
import { renderIssues, recommendationHtml } from '../modules/issuesView.js';
import { initChatWidget } from '../modules/chatWidget.js';

const issueGrid = document.getElementById('issueGrid');
const resultModal = document.getElementById('resultModal');
const recommendationContainer = document.getElementById('recommendation');
const closeModalBtn = document.getElementById('close-modal-btn');
const searchInput = document.getElementById('searchIssue');
const showPatient = document.getElementById('showPatient');
const openRequestBtn = document.getElementById('openRequestBtn');
const consultForm = document.getElementById('consultForm');
const requestConcern = document.getElementById('requestConcern');
const requestDuration = document.getElementById('requestDuration');
const requestUrgency = document.getElementById('requestUrgency');
const requestDetails = document.getElementById('requestDetails');
const requestStatus = document.getElementById('requestStatus');

let issues = [];
let safetyNotes = {};
let sourceLinks = [];

function closeModal() {
  if (resultModal) resultModal.style.display = 'none';
}

function showRecommendation(issueName) {
  const issue = issues.find((item) => item.name === issueName);
  if (!issue || !recommendationContainer || !resultModal) return;

  recommendationContainer.innerHTML = recommendationHtml(issue, safetyNotes, sourceLinks);
  resultModal.style.display = 'flex';
}

function filterIssues() {
  const query = searchInput?.value.toLowerCase() || '';
  const filtered = issues.filter((issue) => {
    const text = [issue.name, issue.desc, issue.symptoms.join(' '), issue.solution, issue.diet].join(' ').toLowerCase();
    return text.includes(query);
  });
  renderIssues(issueGrid, filtered);
}

async function submitConsultRequest(event) {
  event.preventDefault();
  setStatus(requestStatus, 'Sending request...');

  try {
    await api.createRequest({
      patient: getUser('patient').name,
      concern: requestConcern.value,
      duration: requestDuration.value,
      urgency: requestUrgency.value,
      details: requestDetails.value
    });
    consultForm.reset();
    setStatus(requestStatus, 'Request sent to backend. Open the doctor dashboard to review it.');
  } catch (error) {
    setStatus(requestStatus, error.message, true);
  }
}

function attachEvents() {
  issueGrid?.addEventListener('click', (event) => {
    const card = event.target.closest('.issue-card');
    if (card?.dataset?.issue) showRecommendation(card.dataset.issue);
  });

  closeModalBtn?.addEventListener('click', closeModal);
  resultModal?.addEventListener('click', (event) => {
    if (event.target === resultModal) closeModal();
  });
  searchInput?.addEventListener('input', filterIssues);
  openRequestBtn?.addEventListener('click', () => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' }));
  consultForm?.addEventListener('submit', submitConsultRequest);
}

async function init() {
  const user = getUser('patient');
  if (showPatient) showPatient.textContent = escapeHtml(user.name);

  try {
    const data = await api.getIssues();
    issues = data.issues;
    safetyNotes = data.safetyNotes;
    sourceLinks = data.sourceLinks;
    renderIssues(issueGrid, issues);
    initChatWidget({ safetyNotes, sourceLinks });
  } catch (error) {
    issueGrid.innerHTML = `<p class="empty-state">Could not load health issues: ${escapeHtml(error.message)}</p>`;
  }

  attachEvents();
}

document.addEventListener('DOMContentLoaded', init);
