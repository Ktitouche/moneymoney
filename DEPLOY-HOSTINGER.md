# Deployment Guide for Hostinger (Production)

This guide deploys:
- Frontend (React build) behind Nginx
- Backend (Node.js API) with PM2
- HTTPS with Let's Encrypt
- MongoDB Atlas (recommended)

Recommended Hostinger plan: VPS (KVM).

## 1) Prepare VPS

Connect via SSH:

```bash
ssh root@YOUR_VPS_IP
```

Create a deployment user (optional but recommended):

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

Install Node.js LTS, PM2, Nginx, Git:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2
```

## 2) Clone Project

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone YOUR_REPO_URL moneymoney
cd moneymoney
```

## 3) Backend Setup

Install dependencies:

```bash
cd /var/www/moneymoney/backend
npm install --omit=dev
mkdir -p uploads
```

Create production environment file:

```bash
nano .env
```

Use this template:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_LONG_RANDOM_SECRET_AT_LEAST_32_CHARS
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

Important:
- Use MongoDB Atlas URI with strong password.
- JWT_SECRET should be random and long.
- CORS_ORIGIN must match your real frontend domains.

## 4) Frontend Setup

Install and build:

```bash
cd /var/www/moneymoney/frontend
npm install
```

Create frontend env for build:

```bash
nano .env.production
```

Add:

```env
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_META_PIXEL_ID=YOUR_PIXEL_ID_IF_USED
REACT_APP_META_CURRENCY=DZD
```

Build frontend:

```bash
npm run build
```

## 5) Run Backend with PM2

From project root:

```bash
cd /var/www/moneymoney
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Follow the command PM2 prints for startup persistence.

Check status/logs:

```bash
pm2 status
pm2 logs moneymoney-api
```

## 6) Configure Nginx

Create Nginx site:

```bash
sudo nano /etc/nginx/sites-available/moneymoney
```

Use this config:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/moneymoney/frontend/build;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5000/uploads/;
        proxy_set_header Host $host;
    }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/moneymoney /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7) Enable HTTPS (Let's Encrypt)

Install Certbot:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

Issue certificates:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Test auto-renew:

```bash
sudo certbot renew --dry-run
```

## 8) DNS on Hostinger

In Hostinger DNS Zone:
- A record: @ -> YOUR_VPS_IP
- A record: www -> YOUR_VPS_IP

Wait DNS propagation, then run certbot if not already done.

## 9) Security Checklist Before Go-Live

- Backend audit:

```bash
cd /var/www/moneymoney/backend
npm audit --omit=dev
```

- Frontend runtime audit:

```bash
cd /var/www/moneymoney/frontend
npm audit --omit=dev
```

- Confirm CORS_ORIGIN uses only production domains.
- Confirm NODE_ENV=production.
- Confirm JWT_SECRET length >= 32.
- Confirm HTTPS is active and valid.

## 10) Update / Redeploy

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

## 11) Troubleshooting

API down:

```bash
pm2 logs moneymoney-api
sudo journalctl -u nginx -f
```

502 Bad Gateway:
- Check backend running on port 5000.
- Check .env values and MongoDB connectivity.

CORS errors:
- Verify CORS_ORIGIN exactly matches frontend URL (including https).

Cookie/session issues:
- Ensure frontend uses https URL for REACT_APP_API_URL.
- Ensure NODE_ENV=production so secure cookies apply correctly.

Done. Your app is production-ready on Hostinger VPS.
