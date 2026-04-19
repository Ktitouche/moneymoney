# Development Guide

## Project Structure

- backend/: API, models, middleware, routes
- frontend/: React app, pages, components, API client
- deployment/: sample Nginx config
- ecosystem.config.js: PM2 process definition

## Prerequisites

- Node.js LTS
- npm
- MongoDB local instance or MongoDB Atlas

## Local Setup

### 1) Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2) Configure backend env

Create backend/.env:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_32_plus_char_random_secret
CORS_ORIGIN=http://localhost:3000
```

### 3) Start services

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm start
```

## Daily Workflow

1. Create branch
2. Implement change
3. Run checks
4. Commit with clear message
5. Push and open PR

## Verification Commands

### Code health

```bash
cd frontend
npm run build
```

### Dependency checks

```bash
cd backend
npm audit --omit=dev
cd ../frontend
npm audit --omit=dev
```

### Backend startup

```bash
cd backend
npm start
```

## Common Issues

### Frontend cannot reach API

- Check REACT_APP_API_URL for production
- Check backend CORS_ORIGIN includes frontend origin
- Check backend is running on expected port

### Auth problems after env changes

- Clear browser cookies
- Ensure JWT_SECRET is unchanged for active sessions (or re-login)
- Ensure NODE_ENV and CORS_ORIGIN are set correctly

### MongoDB connection error

- Verify MONGODB_URI format
- Verify IP/network access on Atlas
- Verify database user credentials

## Security Rules for Developers

- Never commit secrets
- Keep JWT_SECRET only in backend/.env
- Keep frontend env limited to REACT_APP_* public values
- Validate uploads and request payloads on backend routes
