const USER_KEY = 'healthRecoUser';

export function saveUser(user) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(fallbackRole = 'patient') {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY)) || {
      name: fallbackRole === 'doctor' ? 'Doctor' : 'Patient',
      role: fallbackRole
    };
  } catch {
    return {
      name: fallbackRole === 'doctor' ? 'Doctor' : 'Patient',
      role: fallbackRole
    };
  }
}
