import { api } from '../api/client.js';
import { escapeHtml, renderSourceLinks } from './dom.js';

const assistantPrompts = [
  'I have fever for 2 days. What should I monitor?',
  'When is cough dangerous?',
  'What food is better for acidity?',
  'How can I reduce stress today?'
];

function addMessage(chatMessages, sender, content, context = {}) {
  const message = document.createElement('div');
  message.className = `chat-message ${sender} ${content?.tone || ''}`;

  if (typeof content === 'string') {
    message.textContent = content;
  } else {
    message.innerHTML = `
      <b>${escapeHtml(content.title)}</b>
      <p>${escapeHtml(content.body)}</p>
      <ul>${content.actions.map((action) => `<li>${escapeHtml(action)}</li>`).join('')}</ul>
      <small>${escapeHtml(context.safetyNotes?.disclaimer || 'General information only.')}</small>
      <div class="source-links">${renderSourceLinks(context.sourceLinks || [])}</div>
    `;
  }

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

export function initChatWidget(context) {
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const quickPrompts = document.getElementById('quickPrompts');
  const botToggle = document.getElementById('botToggle');
  const chatWidget = document.getElementById('chatWidget');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const openChatLink = document.getElementById('openChatLink');

  if (!chatMessages || !chatForm || !chatInput || !quickPrompts) return;

  function openChat() {
    chatWidget?.classList.add('open');
    botToggle?.classList.add('hidden');
    window.setTimeout(() => chatInput.focus(), 120);
  }

  function closeChat() {
    chatWidget?.classList.remove('open');
    botToggle?.classList.remove('hidden');
  }

  async function answerQuestion(question) {
    openChat();
    addMessage(chatMessages, 'patient', question);
    addMessage(chatMessages, 'typing', 'Asking the HealthReco backend...');

    try {
      const data = await api.chat(question);
      chatMessages.querySelector('.typing:last-child')?.remove();
      addMessage(chatMessages, 'assistant', data.reply, data);
    } catch (error) {
      chatMessages.querySelector('.typing:last-child')?.remove();
      addMessage(chatMessages, 'assistant', {
        title: 'Unable to answer right now',
        body: error.message,
        actions: ['Check the backend server', 'Try again', 'Use emergency care for serious symptoms'],
        tone: 'urgent'
      }, context);
    }
  }

  quickPrompts.innerHTML = assistantPrompts
    .map((prompt) => `<button type="button" class="prompt-chip">${escapeHtml(prompt)}</button>`)
    .join('');

  addMessage(chatMessages, 'assistant', {
    title: 'Hi, I am your HealthReco assistant',
    body: 'Ask a common medical question and I will call the backend for general care steps, warning signs, and source links.',
    actions: ['Do not share private identifiers', 'For diagnosis, consult a doctor', 'For emergencies, call local emergency services'],
    tone: 'normal'
  }, context);

  quickPrompts.addEventListener('click', (event) => {
    const prompt = event.target.closest('.prompt-chip')?.textContent;
    if (prompt) answerQuestion(prompt);
  });

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    chatInput.value = '';
    answerQuestion(question);
  });

  botToggle?.addEventListener('click', openChat);
  closeChatBtn?.addEventListener('click', closeChat);
  openChatLink?.addEventListener('click', (event) => {
    event.preventDefault();
    openChat();
  });
}
