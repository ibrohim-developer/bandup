#!/bin/bash
set -e

# ============================================
# BandUp Droplet Setup Script
# Run this on your DigitalOcean Droplet as root
# Usage: bash setup.sh YOUR_GITHUB_REPO_URL YOUR_DOMAIN
# Example: bash setup.sh https://github.com/username/bandup.git bandup.uz
# ============================================

REPO_URL=${1:?"Usage: bash setup.sh GITHUB_REPO_URL DOMAIN"}
DOMAIN=${2:?"Usage: bash setup.sh GITHUB_REPO_URL DOMAIN"}
APP_DIR="/var/www/bandup"

echo "=== Updating system ==="
apt update && apt upgrade -y

echo "=== Installing Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "=== Installing pnpm, PM2 ==="
npm install -g pnpm pm2

echo "=== Installing Nginx ==="
apt install -y nginx

echo "=== Cloning repository ==="
mkdir -p /var/www
if [ -d "$APP_DIR" ]; then
  echo "Directory $APP_DIR already exists, pulling latest..."
  cd "$APP_DIR" && git pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

echo "=== Installing frontend dependencies ==="
cd "$APP_DIR/frontend"
pnpm install

echo "=== Installing backend dependencies ==="
cd "$APP_DIR/backend"
npm install

echo "=== Building frontend ==="
cd "$APP_DIR/frontend"

if [ ! -f .env.local ]; then
  echo ""
  echo "!!! IMPORTANT !!!"
  echo "Create your .env.local file before building:"
  echo "  nano $APP_DIR/frontend/.env.local"
  echo "Then re-run this script or manually run: cd $APP_DIR/frontend && pnpm build"
  echo ""
  exit 1
fi

pnpm build

echo "=== Setting up PM2 ==="
cd "$APP_DIR"
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

echo "=== Configuring Nginx ==="
cat > /etc/nginx/sites-available/bandup <<NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Strapi Admin & API
    location /strapi/ {
        rewrite ^/strapi/(.*) /\$1 break;
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/bandup /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "=== Setting up SSL ==="
apt install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" -d "www.${DOMAIN}" --non-interactive --agree-tos --email admin@${DOMAIN} || {
  echo "SSL setup failed - make sure DNS is pointing to this server first."
  echo "You can run this later: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
}

echo ""
echo "=== SETUP COMPLETE ==="
echo "Frontend: https://${DOMAIN}"
echo "Strapi:   https://${DOMAIN}/strapi/admin"
echo ""
echo "Useful commands:"
echo "  pm2 status          # Check app status"
echo "  pm2 logs            # View logs"
echo "  pm2 restart all     # Restart apps"
echo ""
