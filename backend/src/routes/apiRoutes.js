const { login } = require('../controllers/authController');
const { getIssues, chat } = require('../controllers/healthController');
const {
  getRequests,
  createRequest,
  markReviewed,
  seedRequests,
  getAdvice,
  saveAdvice
} = require('../controllers/requestController');
const { parseBody, notFound } = require('../utils/http');

async function handleApi(request, response, pathname) {
  try {
    if (request.method === 'GET' && pathname === '/api/health') {
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ status: 'ok', service: 'HealthReco API' }));
      return true;
    }

    if (request.method === 'POST' && pathname === '/api/auth/login') {
      login(request, response, await parseBody(request));
      return true;
    }

    if (request.method === 'GET' && pathname === '/api/issues') {
      getIssues(request, response);
      return true;
    }

    if (request.method === 'POST' && pathname === '/api/chat') {
      chat(request, response, await parseBody(request));
      return true;
    }

    if (request.method === 'GET' && pathname === '/api/requests') {
      getRequests(request, response);
      return true;
    }

    if (request.method === 'POST' && pathname === '/api/requests') {
      createRequest(request, response, await parseBody(request));
      return true;
    }

    if (request.method === 'POST' && pathname === '/api/requests/seed') {
      seedRequests(request, response);
      return true;
    }

    if (request.method === 'PATCH' && pathname.startsWith('/api/requests/') && pathname.endsWith('/review')) {
      const id = pathname.split('/')[3];
      markReviewed(request, response, id);
      return true;
    }

    if (request.method === 'GET' && pathname === '/api/advice') {
      getAdvice(request, response);
      return true;
    }

    if (request.method === 'POST' && pathname === '/api/advice') {
      saveAdvice(request, response, await parseBody(request));
      return true;
    }

    notFound(response);
    return true;
  } catch (error) {
    response.writeHead(error.message === 'Payload too large' ? 413 : 400, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    response.end(JSON.stringify({ error: error.message || 'Request failed' }));
    return true;
  }
}

module.exports = { handleApi };
