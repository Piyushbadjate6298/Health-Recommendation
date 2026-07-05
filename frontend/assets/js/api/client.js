async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  login(role, name, password) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role, name, password })
    });
  },

  getIssues() {
    return request('/api/issues');
  },

  chat(question) {
    return request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  },

  getRequests() {
    return request('/api/requests');
  },

  createRequest(payload) {
    return request('/api/requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  seedRequests() {
    return request('/api/requests/seed', { method: 'POST' });
  },

  markReviewed(id) {
    return request(`/api/requests/${encodeURIComponent(id)}/review`, { method: 'PATCH' });
  },

  getAdvice() {
    return request('/api/advice');
  },

  saveAdvice(advice) {
    return request('/api/advice', {
      method: 'POST',
      body: JSON.stringify({ advice })
    });
  }
};
