# 🚀 Deployment Guide - Mechanic On Demand

Complete deployment guide for various environments and platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Production Setup](#production-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB available space
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows 10+

### Software Dependencies
- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Docker 20.10** or higher
- **Docker Compose 2.0** or higher

## 💻 Local Development

### 1. Environment Setup

```bash
# Clone repository
git clone https://github.com/yourusername/mechanic-on-demand.git
cd mechanic-on-demand

# Create environment file
cp .env.example .env
```

### 2. Database Setup

```bash
# Start MySQL service
sudo systemctl start mysql

# Create database
mysql -u root -p
CREATE DATABASE mechanic_on_demand;
CREATE USER 'mechanic_user'@'localhost' IDENTIFIED BY 'mechanic_pass';
GRANT ALL PRIVILEGES ON mechanic_on_demand.* TO 'mechanic_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Backend Setup

```bash
cd backend

# Update application.yml
vim src/main/resources/application.yml

# Build and run
mvn clean install
mvn spring-boot:run
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 5. Verification

- Backend: http://localhost:8080/api/actuator/health
- Frontend: http://localhost:3000
- Database: Connect to localhost:3306

## 🐳 Docker Deployment

### Quick Start

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Manual Docker Setup

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Docker Commands Reference

```bash
# Stop all services
docker-compose down

# Remove volumes (data loss!)
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Scale services
docker-compose up -d --scale backend=2

# View service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. EC2 Setup

```bash
# Launch EC2 instance (t3.medium recommended)
# Security groups: 80, 443, 22, 8080, 3306

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu
```

#### 2. RDS Setup

```bash
# Create RDS MySQL instance
# Security group: Allow 3306 from EC2 security group
# Note down endpoint, username, password
```

#### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/mechanic-on-demand.git
cd mechanic-on-demand

# Update docker-compose.yml for RDS
vim docker-compose.yml

# Update backend configuration
vim backend/src/main/resources/application-docker.yml

# Deploy
docker-compose up -d
```

#### 4. Load Balancer Setup

```bash
# Create Application Load Balancer
# Target groups: Frontend (80), Backend (8080)
# Health checks: /health for backend, / for frontend
```

### Heroku Deployment

#### 1. Backend Deployment

```bash
cd backend

# Create Heroku app
heroku create mechanic-backend

# Add MySQL addon
heroku addons:create cleardb:ignite

# Get database URL
heroku config:get CLEARDB_DATABASE_URL

# Set environment variables
heroku config:set SPRING_PROFILES_ACTIVE=heroku
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### 2. Frontend Deployment

```bash
cd frontend

# Create Heroku app
heroku create mechanic-frontend

# Set buildpack
heroku buildpacks:set mars/create-react-app

# Set environment variables
heroku config:set REACT_APP_API_URL=https://mechanic-backend.herokuapp.com/api

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Google Cloud Platform

#### 1. Cloud Run Deployment

```bash
# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sql-component.googleapis.com

# Create Cloud SQL instance
gcloud sql instances create mechanic-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create mechanic_on_demand --instance=mechanic-db

# Build and deploy backend
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/mechanic-backend
gcloud run deploy mechanic-backend \
  --image gcr.io/PROJECT_ID/mechanic-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Build and deploy frontend
cd frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/mechanic-frontend
gcloud run deploy mechanic-frontend \
  --image gcr.io/PROJECT_ID/mechanic-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🏭 Production Setup

### 1. Environment Configuration

```bash
# Production environment variables
export SPRING_PROFILES_ACTIVE=production
export DB_HOST=your-db-host
export DB_USERNAME=your-db-user
export DB_PASSWORD=your-db-password
export JWT_SECRET=your-strong-secret-key
export REDIS_URL=your-redis-url
```

### 2. SSL Certificate Setup

```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Nginx Configuration

```nginx
# /etc/nginx/sites-available/mechanic-on-demand
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://localhost:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Database Optimization

```sql
-- MySQL production settings
-- /etc/mysql/mysql.conf.d/mysqld.cnf

[mysqld]
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
max_connections = 200
query_cache_size = 64M
query_cache_type = 1

-- Create indexes for better performance
CREATE INDEX idx_user_city ON users(city);
CREATE INDEX idx_user_pincode ON users(pincode);
CREATE INDEX idx_mechanic_skills ON mechanics(skills);
CREATE INDEX idx_booking_status ON bookings(status);
CREATE INDEX idx_booking_created ON bookings(created_at);
```

### 5. Application Performance

```yaml
# application-production.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  jpa:
    show-sql: false
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true

server:
  tomcat:
    max-threads: 200
    min-spare-threads: 10
    max-connections: 8192
```

## 📊 Monitoring & Maintenance

### 1. Health Checks

```bash
# Backend health check
curl -f http://localhost:8080/api/actuator/health

# Frontend health check
curl -f http://localhost:3000/

# Database health check
mysqladmin ping -h localhost -u root -p
```

### 2. Log Management

```bash
# Application logs
tail -f /var/log/mechanic-on-demand/application.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Docker logs
docker-compose logs -f --tail=100
```

### 3. Backup Strategy

```bash
#!/bin/bash
# backup.sh - Database backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="mechanic_on_demand"

# Create backup directory
mkdir -p $BACKUP_DIR

# MySQL backup
mysqldump -u root -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### 4. Monitoring Setup

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# System monitoring
htop                    # CPU and memory usage
iotop                   # Disk I/O
nethogs                 # Network usage
df -h                   # Disk space
free -h                 # Memory usage

# Application monitoring
docker stats            # Container resource usage
docker-compose top      # Process list
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check MySQL status
sudo systemctl status mysql

# Check connection
mysql -u root -p -h localhost

# Check firewall
sudo ufw status
sudo ufw allow 3306

# Check configuration
grep -n "bind-address" /etc/mysql/mysql.conf.d/mysqld.cnf
```

#### 2. Backend Not Starting

```bash
# Check Java version
java -version

# Check port availability
netstat -tulpn | grep 8080

# Check application logs
docker-compose logs backend

# Check configuration
cat backend/src/main/resources/application.yml
```

#### 3. Frontend Build Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version
npm --version
```

#### 4. WebSocket Connection Issues

```bash
# Check WebSocket endpoint
curl -i -N -H "Connection: Upgrade" \
     -H "Upgrade: websocket" \
     -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
     -H "Sec-WebSocket-Version: 13" \
     http://localhost:8080/ws

# Check proxy configuration
nginx -t
sudo systemctl reload nginx
```

### Performance Issues

#### 1. Slow Database Queries

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;

-- Analyze query performance
EXPLAIN SELECT * FROM bookings WHERE status = 'PENDING';
```

#### 2. High Memory Usage

```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Optimize JVM settings
export JAVA_OPTS="-Xms512m -Xmx2g -XX:+UseG1GC"

# Optimize MySQL
# Adjust innodb_buffer_pool_size in my.cnf
```

#### 3. High CPU Usage

```bash
# Check CPU usage
top -o %CPU
htop

# Profile Java application
jstack <java-pid>
jstat -gc <java-pid> 5s

# Check for infinite loops in logs
grep -i "error\|exception" /var/log/application.log
```

### Recovery Procedures

#### 1. Database Recovery

```bash
# Restore from backup
gunzip backup_20231201_120000.sql.gz
mysql -u root -p mechanic_on_demand < backup_20231201_120000.sql

# Check data integrity
mysqlcheck -u root -p --check --all-databases
```

#### 2. Application Recovery

```bash
# Restart services
docker-compose restart

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check service health
docker-compose ps
docker-compose logs
```

### Maintenance Tasks

#### Weekly Tasks
- [ ] Check disk space usage
- [ ] Review application logs
- [ ] Update system packages
- [ ] Backup database
- [ ] Monitor performance metrics

#### Monthly Tasks
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup verification
- [ ] SSL certificate renewal check

#### Quarterly Tasks
- [ ] Major version updates
- [ ] Security penetration testing
- [ ] Disaster recovery testing
- [ ] Performance benchmarking
- [ ] Infrastructure review

---

**For additional support, contact our DevOps team or create an issue on GitHub.**