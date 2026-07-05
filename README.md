# HealthReco - Dynamic Health Recommendation System

HealthReco is now separated into a real frontend and backend structure.

## Folder Structure

```text
frontend/
  index.html
  pages/
    patient.html
    doctor.html
  assets/
    css/
    js/
      api/
      modules/
      pages/

backend/
  src/
    controllers/
    data/
    routes/
    services/
    utils/
    server.js
  data/
    db.json
```

## Features

- Dynamic backend API with Node.js
- Patient and doctor login API
- Backend-powered health issue recommendations
- Backend-powered chatbot responses
- Patient request creation through API
- Doctor dashboard request review
- Doctor advice note persistence
- Modular frontend JavaScript files

## Run Locally

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Useful API Routes

```text
GET    /api/health
POST   /api/auth/login
GET    /api/issues
POST   /api/chat
GET    /api/requests
POST   /api/requests
PATCH  /api/requests/:id/review
POST   /api/requests/seed
GET    /api/advice
POST   /api/advice
```

## Deploy

Deploy as one Node app. The backend serves the frontend automatically.

```bash
npm start
```

For platforms like Render, Railway, or a VPS:

- Build command: none
- Start command: `npm start`
- Port: use the platform `PORT` environment variable or default `5173`

## Medical Safety

This project gives general educational health information only. It is not a diagnosis, prescription, or replacement for a qualified doctor. A production medical chatbot needs clinical review, privacy controls, secure authentication, and audited medical content.
