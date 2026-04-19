# Deployment Guide (VPS / Hostinger)

This guide deploys:
- React frontend static build behind Nginx
- Node backend managed by PM2
- HTTPS with Let's Encrypt

## 1) Server Preparation

Install base packages:

```bash
sudo apt-get update
sudo apt-get install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

## 2) Deploy Project

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone YOUR_REPO_URL moneymoney
cd moneymoney
```

## 3) Backend Setup

```bash
cd /var/www/moneymoney/backend
npm install --omit=dev
mkdir -p uploads
```

Create backend/.env:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_32_plus_char_random_secret
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

## 4) Frontend Setup

```bash
cd /var/www/moneymoney/frontend
npm install
```

Set production vars in frontend/.env.production:

```env
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_META_PIXEL_ID=YOUR_META_PIXEL_ID
REACT_APP_META_CURRENCY=DZD
```

Build frontend:

```bash
npm run build
```

## 5) Start Backend with PM2

From project root:

```bash
cd /var/www/moneymoney
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Check process:

```bash
pm2 status
pm2 logs moneymoney-api
```

## 6) Configure Nginx

Use deployment/nginx.conf.example as base.

Main checks:
- root points to frontend/build
- /api/ proxies to 127.0.0.1:5000/api/
- /uploads/ proxies to 127.0.0.1:5000/uploads/

Enable and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 7) HTTPS

Install certbot and issue certs:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot renew --dry-run
```

## 8) Post-Deploy Checks

### App checks

- Open https://your-domain.com
- Verify product listing
- Verify login flow
- Verify checkout path

### Server checks

```bash
pm2 status
sudo systemctl status nginx
```

### Security checks

```bash
cd /var/www/moneymoney/backend && npm audit --omit=dev
cd /var/www/moneymoney/frontend && npm audit --omit=dev
```

## 9) Update / Redeploy

```bash
cd /var/www/moneymoney
git pull

cd backend
npm install --omit=dev

cd ../frontend
npm install
npm run build

cd ..
pm2 restart moneymoney-api
sudo systemctl reload nginx
```

## 10) Rollback Plan

If a deploy fails:

1. Restore previous commit/tag
2. Rebuild frontend
3. Restart PM2 process
4. Reload Nginx
5. Confirm with smoke tests
