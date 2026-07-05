const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApi } = require('./routes/apiRoutes');

const port = Number(process.env.PORT) || 5173;
const frontendRoot = path.join(__dirname, '..', '..', 'frontend');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8'
};

function resolveFrontendPath(pathname) {
  const routes = {
    '/': 'index.html',
    '/patient': 'pages/patient.html',
    '/patient.html': 'pages/patient.html',
    '/doctor': 'pages/doctor.html',
    '/doctor.html': 'pages/doctor.html'
  };

  const requested = routes[pathname] || pathname.replace(/^[/\\]+/, '');
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, '');
  return path.join(frontendRoot, safePath);
}

function serveFrontend(request, response, pathname) {
  const filePath = resolveFrontendPath(pathname);

  if (!filePath.startsWith(frontendRoot)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream'
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname.startsWith('/api/')) {
    await handleApi(request, response, pathname);
    return;
  }

  serveFrontend(request, response, pathname);
});

server.listen(port, () => {
  console.log(`HealthReco dynamic app running at http://127.0.0.1:${port}`);
});
