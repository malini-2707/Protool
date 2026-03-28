#!/bin/bash

# Smart Agro Inventory / ProTool EC2 Setup Script
# Ubuntu 22.04 / 24.04 LTS

echo "🚀 Starting ProTool / Smart Agro Environment Setup..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Install Puppeteer/WhatsApp-web.js Dependencies (Chromium Headless)
echo "📦 Installing Chromium dependencies for WhatsApp bot..."
sudo apt install -y libnss3 libatk-bridge2.0-0 libxss1 libasound2 libpangocairo-1.0-0 libatk1.0-0 libcups2 libdrm2 libgbm1 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2

# Setup Nginx directory permissions
sudo chown -R $USER:$USER /var/www/html

echo "✅ Environment Ready!"
echo "Next steps:"
echo "1. Clone your repository"
echo "2. Setup .env files"
echo "3. Run 'npm install' and 'npm run build'"
echo "4. Configure Nginx and PM2"
