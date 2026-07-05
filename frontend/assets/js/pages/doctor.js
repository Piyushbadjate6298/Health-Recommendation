import { api } from '../api/client.js';
import { getUser } from '../modules/session.js';
import { escapeHtml, setStatus } from '../modules/dom.js';

const showDoctor = document.getElementById('showDoctor');
const requestList = document.getElementById('requestList');
const totalPatients = document.getElementById('totalPatients');
const urgentPatients = document.getElementById('urgentPatients');
const routinePatients = document.getElementById('routinePatients');
const seedRequestsBtn = document.getElementById('seedRequestsBtn');
const doctorNote = document.getElementById('doctorNote');
const saveAdviceBtn = document.getElementById('saveAdviceBtn');
const doctorStatus = document.getElementById('doctorStatus');

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function updateStats(requests) {
  const urgentCount = requests.filter((request) => request.urgency === 'Urgent').length;
  totalPatients.textContent = requests.length;
  urgentPatients.textContent = urgentCount;
  routinePatients.textContent = Math.max(requests.length - urgentCount, 0);
}

function renderRequests(requests) {
  updateStats(requests);

  if (!requests.length) {
    requestList.innerHTML = '<p class="empty-state">No patient requests yet. Load sample requests or submit one from the patient dashboard.</p>';
    return;
  }

  requestList.innerHTML = requests
    .map(
      (request) => `
      <article class="request-card" data-id="${escapeHtml(request.id)}">
        <div>
          <div class="request-topline">
            <b>${escapeHtml(request.patient)}</b>
            <span class="urgency ${escapeHtml(request.urgency.toLowerCase())}">${escapeHtml(request.urgency)}</span>
          </div>
          <h3>${escapeHtml(request.concern)}</h3>
          <p>${escapeHtml(request.details)}</p>
          <small>Duration: ${escapeHtml(request.duration)} | Sent: ${formatDate(request.createdAt)}</small>
        </div>
        <button type="button" data-action="review">${request.status === 'Reviewed' ? 'Reviewed' : 'Mark Reviewed'}</button>
      </article>
    `
    )
    .join('');
}

async function loadRequests() {
  const data = await api.getRequests();
  renderRequests(data.requests);
}

async function loadAdvice() {
  const data = await api.getAdvice();
  doctorNote.value = data.advice || '';
}

async function initDoctorDashboard() {
  const user = getUser('doctor');
  if (showDoctor) showDoctor.textContent = escapeHtml(user.name);

  try {
    await Promise.all([loadRequests(), loadAdvice()]);
  } catch (error) {
    requestList.innerHTML = `<p class="empty-state">Could not load backend data: ${escapeHtml(error.message)}</p>`;
  }

  seedRequestsBtn?.addEventListener('click', async () => {
    const data = await api.seedRequests();
    renderRequests(data.requests);
  });

  requestList?.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action="review"]');
    const card = event.target.closest('.request-card');
    if (!button || !card?.dataset?.id) return;

    const data = await api.markReviewed(card.dataset.id);
    renderRequests(data.requests);
  });

  saveAdviceBtn?.addEventListener('click', async () => {
    try {
      await api.saveAdvice(doctorNote.value);
      setStatus(doctorStatus, 'Advice note saved to backend.');
    } catch (error) {
      setStatus(doctorStatus, error.message, true);
    }
  });
}

document.addEventListener('DOMContentLoaded', initDoctorDashboard);
