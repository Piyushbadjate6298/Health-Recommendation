const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
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

async function connectMongoDb() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in backend/.env');
  }

  if (mongoUri.includes('YOUR_PASSWORD') || mongoUri.includes('<db_password>')) {
    throw new Error('Replace YOUR_PASSWORD in backend/.env with your real MongoDB Atlas password');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB Connected');
}

const server = http.createServer(async (request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname.startsWith('/api/')) {
    await handleApi(request, response, pathname);
    return;
  }

  serveFrontend(request, response, pathname);
});

connectMongoDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running at http://127.0.0.1:${port}`);
    });
  })
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
