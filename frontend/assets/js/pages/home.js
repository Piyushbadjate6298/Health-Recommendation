import { api } from '../api/client.js';
import { saveUser } from '../modules/session.js';

const patientLoginForm = document.getElementById('patientLoginForm');
const doctorLoginForm = document.getElementById('doctorLoginForm');

async function handleLogin(event, role) {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.querySelector('input[type="text"], input[autocomplete="name"]')?.value || role;
  const password = form.querySelector('input[type="password"]')?.value || '';
  const button = form.querySelector('button');

  button.disabled = true;
  button.textContent = 'Logging in...';

  try {
    const data = await api.login(role, name, password);
    saveUser(data.user);
    window.location.href = role === 'doctor' ? '/doctor' : '/patient';
  } catch (error) {
    alert(error.message);
    button.disabled = false;
    button.textContent = role === 'doctor' ? 'Login as Doctor' : 'Login as Patient';
  }
}

patientLoginForm?.addEventListener('submit', (event) => handleLogin(event, 'patient'));
doctorLoginForm?.addEventListener('submit', (event) => handleLogin(event, 'doctor'));
