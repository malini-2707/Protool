# AWS Deployment Guide

This guide provides step-by-step instructions for deploying ProTool on AWS infrastructure.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AWS Route 53  │    │   AWS CloudFront│    │   AWS S3       │
│   (DNS)         │────│   (CDN)         │────│   (Static)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   AWS EC2       │
                       │   (Backend)     │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   AWS RDS       │
                       │   (PostgreSQL)  │
                       └─────────────────┘
```

## 📋 Prerequisites

- AWS account with appropriate permissions
- Domain name (optional)
- SSL certificate (optional but recommended)
- Basic knowledge of AWS services and Linux command line

## 🚀 Step 1: Set Up AWS RDS (PostgreSQL)

### 1.1 Create RDS Instance

1. Navigate to AWS RDS console
2. Click "Create database"
3. Choose "Standard Create" and "PostgreSQL"
4. Configure settings:
   - **Engine version**: PostgreSQL 14.x or later
   - **Template**: Free tier (for development) or Production
   - **DB instance identifier**: `protool-db`
   - **Master username**: `protool_admin`
   - **Password**: Generate a strong password
   - **Instance size**: `db.t3.micro` (free tier) or appropriate size

5. Configure connectivity:
   - **VPC security group**: Create new security group
   - **Public access**: Yes (for EC2 access)
   - **VPC**: Default VPC

6. Create the database

### 1.2 Configure Security Group

1. Go to VPC → Security Groups
2. Find the RDS security group
3. Add inbound rule:
   - Type: PostgreSQL
   - Protocol: TCP
   - Port: 5432
   - Source: Custom (EC2 security group)

## 🖥️ Step 2: Set Up AWS EC2 (Backend)

### 2.1 Launch EC2 Instance

1. Navigate to AWS EC2 console
2. Click "Launch Instances"
3. Configure:
   - **Name**: `protool-backend`
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance type**: `t2.micro` (free tier) or `t3.small`
   - **Key pair**: Create or use existing key pair
   - **Security group**: Create new security group with:
     - SSH (port 22) from your IP
     - HTTP (port 80) from anywhere
     - HTTPS (port 443) from anywhere

4. Launch instance

### 2.2 Configure EC2 Instance

SSH into your EC2 instance:

```bash
ssh -i your-key-pair.pem ubuntu@your-ec2-public-ip
```

Update system and install dependencies:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

### 2.3 Deploy Backend Code

```bash
# Clone repository
git clone <your-repository-url>
cd protool/backend

# Install dependencies
npm install --production

# Set up environment variables
cp .env.example .env
sudo nano .env
```

Update `.env` file:

```env
DATABASE_URL="postgresql://protool_admin:YOUR_PASSWORD@YOUR_RDS_ENDPOINT:5432/protool_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=production
FRONTEND_URL="https://your-domain.com"
```

### 2.4 Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### 2.5 Start Backend with PM2

```bash
# Start application
pm2 start index.js --name "protool-backend"

# Save PM2 configuration
pm2 startup
pm2 save
```

## 🌐 Step 3: Set Up AWS S3 (Frontend Static Files)

### 3.1 Create S3 Bucket

1. Navigate to AWS S3 console
2. Click "Create bucket"
3. Configure:
   - **Bucket name**: `your-domain.com` (or unique name)
   - **Region**: Same as EC2 instance
   - **Block public access**: Uncheck "Block all public access"
   - **ACLs**: Enable

4. Create bucket

### 3.2 Configure Bucket for Static Website

1. Select your bucket
2. Go to "Properties" → "Static website hosting"
3. Enable static website hosting
4. Index document: `index.html`
5. Error document: `index.html`

### 3.3 Set Bucket Policy

Go to "Permissions" → "Bucket policy" and add:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

## 📦 Step 4: Build and Deploy Frontend

### 4.1 Build Frontend

On your local machine or EC2 instance:

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
echo "VITE_API_URL=https://your-api-domain.com/api" > .env

# Build for production
npm run build
```

### 4.2 Upload to S3

```bash
# Install AWS CLI if not already installed
sudo apt install awscli -y

# Configure AWS CLI
aws configure

# Sync build files to S3
aws s3 sync dist/ s3://your-bucket-name --delete
```

## 🔧 Step 5: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/protool
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (if using Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend static files from S3
    location / {
        proxy_pass https://your-bucket-name.s3.amazonaws.com;
        proxy_set_header Host your-bucket-name.s3.amazonaws.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/protool /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Step 6: Set Up SSL Certificate (Optional but Recommended)

### 6.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 6.3 Set Up Auto-Renewal

```bash
sudo crontab -e
```

Add the following line:

```
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🌍 Step 7: Configure Route 53 (Optional)

If you have a custom domain:

1. Go to AWS Route 53 console
2. Create a hosted zone for your domain
3. Create A records:
   - `your-domain.com` → EC2 public IP
   - `www.your-domain.com` → EC2 public IP
4. Update your domain's nameservers to Route 53 nameservers

## 🔍 Step 8: Monitor and Maintain

### 8.1 Set Up CloudWatch Monitoring

1. Go to AWS CloudWatch console
2. Create custom metrics for:
   - EC2 CPU utilization
   - RDS connections
   - Application errors

### 8.2 Set Up Alarms

Create CloudWatch alarms for:
- High CPU usage (>80%)
- Memory usage
- Application errors

### 8.3 Backup Strategy

- Enable automated backups for RDS
- Regular snapshots of EC2 instance
- Backup S3 bucket to another region

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check RDS security group settings
   - Verify DATABASE_URL format
   - Ensure RDS is in same VPC as EC2

2. **Nginx 502 Bad Gateway**
   - Check if backend is running: `pm2 status`
   - Verify backend is listening on port 5000
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

3. **CORS Issues**
   - Verify FRONTEND_URL in backend .env
   - Check CORS configuration in backend

4. **Static Files Not Loading**
   - Verify S3 bucket policy
   - Check CloudFront configuration (if using)
   - Ensure files are properly uploaded

### Useful Commands

```bash
# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs protool-backend

# Restart backend
pm2 restart protool-backend

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Test backend locally
curl http://localhost:5000/api/health
```

## 💰 Cost Optimization

- Use EC2 T3 instances for better price-performance
- Enable RDS Reserved Instances for long-term projects
- Use CloudFront for CDN to reduce S3 costs
- Set up lifecycle policies for S3 backups
- Monitor and right-size resources based on usage

## 🔐 Security Best Practices

- Regularly update EC2 instances
- Use IAM roles instead of access keys when possible
- Enable VPC Flow Logs
- Use AWS WAF for additional protection
- Regular security audits and penetration testing
- Enable AWS Config for compliance monitoring

This deployment guide provides a production-ready setup for ProTool on AWS infrastructure. Adjust the instance sizes and configurations based on your specific requirements and expected traffic.
