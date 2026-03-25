#!/bin/bash

# ProTool EC2 Setup Script
# Ubuntu 22.04 LTS

echo "🚀 Starting ProTool Environment Setup..."

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

# Setup Nginx directory permissions
sudo chown -R $USER:$USER /var/www/html

echo "✅ Environment Ready!"
echo "Next steps:"
echo "1. Clone your repository"
echo "2. Install dependencies for backend and frontend"
echo "3. Configure Nginx"
