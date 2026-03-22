# Healthcare Analytics Platform

A full-stack healthcare analytics application for managing patients, tracking treatments over time, role-based access, and visualizing clinical trends.

This repository is a monorepo with a React frontend and an Express + MySQL backend.

## Project Structure

- `healthcare-frontend/` - React web app (dashboard, analytics, patients, admin, login)
- `healthcare-backend/` - Node.js API server with MySQL queries
- `COMPLETION_CHECKLIST.md` - completion checklist
- `IMPLEMENTATION_SUMMARY.md` - detailed implementation notes

## Tech Stack

### Frontend
- React 18
- React Router
- Material UI (`@mui/material`, `@mui/icons-material`, `@mui/lab`)
- Emotion (`@emotion/react`, `@emotion/styled`)
- Chart.js + `react-chartjs-2`
- CRA tooling (`react-scripts`)

### Backend
- Node.js
- Express
- MySQL (`mysql2`)
- CORS

### Database
- MySQL database: `healthcare_temporal`
- Main tables used by API:
  - `Patient`
  - `Treatment_History`
  - `Diagnosis_History`
  - `Doctor`
  - `Users`
  - `Access_Log`

## Features

- Login with role-based behavior
- Dashboard metrics and charts
- Patient list and patient profile view
- Treatment timeline/history per patient
- Disease analytics
- Admin view with access logs
- Add patient API flow

## API Endpoints (Current)

Base URL (local): `http://localhost:5000`

- `GET /patients` - list all patients
- `POST /patients` - add a new patient
- `GET /treatments/:patientId` - treatment history for a patient (requires role header)
- `GET /active-treatments/:date` - active treatments by date
- `GET /analytics/diseases` - disease distribution summary
- `GET /dashboard/stats` - dashboard totals
- `POST /login` - login by username/password
- `GET /logs` - access logs

Role-protected route currently checks request header:
- `role: Admin` or `role: Doctor`

## Local Development Setup

## 1) Clone and enter project

```bash
git clone <your-repo-url>
cd healthcare
```

## 2) Backend setup

```bash
cd healthcare-backend
npm install
npm run start
```

If `npm run start` is missing in your backend, you can run:

```bash
node server.js
```

Backend runs on port `5000`.

## 3) Frontend setup

Open a new terminal:

```bash
cd healthcare-frontend
npm install
npm start
```

Frontend runs on port `3000` by default.

## Database Configuration

Current backend connection is defined in `healthcare-backend/server.js` with local credentials.

```js
host: "localhost"
user: "root"
password: "123"
database: "healthcare_temporal"
```

Before deploying, move these values to environment variables and remove hardcoded secrets.

## Deployment Notes

You can deploy from this single monorepo to two services:

- Frontend service from `healthcare-frontend/`
- Backend service from `healthcare-backend/`

Typical platform pairing:
- Frontend: Vercel or Netlify
- Backend: Render or Railway

Important deployment tasks:
- Set backend DB credentials via environment variables
- Set frontend API base URL to deployed backend URL
- Restrict backend CORS to your frontend domain

## Scripts

### Frontend (`healthcare-frontend/package.json`)
- `npm start`
- `npm run build`
- `npm test`

### Backend (`healthcare-backend/package.json`)
- Currently only default `test` script is defined
- Start backend with `node server.js` unless you add a `start` script

## Future Improvements

- Add environment-variable based config (`.env`) for backend
- Add authentication tokens instead of plain role header
- Add input validation and centralized error handling
- Add tests for API and React components
- Add CI workflow for lint/test/build
