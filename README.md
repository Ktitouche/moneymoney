# MoneyMoney E-commerce

Production-ready MERN e-commerce project with:
- React frontend
- Express + MongoDB backend
- JWT cookie auth + CSRF protection
- Product/category/order admin workflows

## Documentation Map

- DEVELOPMENT.md: local setup, daily workflow, troubleshooting
- DEPLOYMENT.md: VPS/Hostinger production deployment and operations

## Quick Start

### 1) Install dependencies

From project root:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment

Backend env file:

- Create/update backend/.env
- Required variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_32_plus_char_random_secret
CORS_ORIGIN=http://localhost:3000
```

Frontend production env file:

- Update frontend/.env.production

```env
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_META_PIXEL_ID=YOUR_META_PIXEL_ID
REACT_APP_META_CURRENCY=DZD
```

### 3) Run locally

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

### 4) Validate before release

```bash
cd frontend && npm run build
cd ../backend && npm audit --omit=dev
cd ../frontend && npm audit --omit=dev
```

## Current Health Snapshot

Latest verification in this workspace:
- Frontend production build: success
- Backend startup: success
- Backend production audit: 0 vulnerabilities
- Frontend production audit: 0 vulnerabilities

## Notes

- Keep backend secrets only in backend/.env
- Do not place secrets in frontend env files (they are public at build time)
