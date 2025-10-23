# 🐳 Docker CI/CD Setup Guide

## 📋 Overview
This project implements a complete CI/CD pipeline that:
1. **Tests** the auth and product services
2. **Builds** Docker images for all 4 microservices
3. **Pushes** images to Docker Hub automatically

## 🔧 Prerequisites Setup

### 1. Docker Hub Account
- Create account at [hub.docker.com](https://hub.docker.com)
- Create a new Access Token:
  - Go to Account Settings → Security → New Access Token
  - Name: `github-actions-token`
  - Permissions: Read, Write, Delete

### 2. GitHub Secrets Configuration
Add these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-access-token
JWT_SECRET=your-jwt-secret-key
LOGIN_TEST_USER=testuser
LOGIN_TEST_PASSWORD=password123
```

## 🏗️ Docker Images Structure

The CI/CD pipeline will create these Docker images:

| Service | Port | Docker Image Name |
|---------|------|------------------|
| Auth Service | 3000 | `your-username/microservices-auth` |
| Product Service | 3001 | `your-username/microservices-product` |
| Order Service | 3002 | `your-username/microservices-order` |
| API Gateway | 8080 | `your-username/microservices-api-gateway` |

## 🚀 CI/CD Pipeline Flow

### Stage 1: Testing
- ✅ Run auth service tests (3 test cases)
- ✅ Run product service tests (3 test cases)
- ✅ Only proceed if all tests pass

### Stage 2: Docker Build & Push (Only on main branch)
- 🔨 Build Docker images for all 4 services in parallel
- 📤 Push images to Docker Hub with multiple tags:
  - `latest` (for main branch)
  - `main-<commit-sha>` (specific commit)
  - `main` (branch name)

## 🏷️ Image Tagging Strategy

Each image gets multiple tags for flexibility:
- `latest`: Always points to the latest main branch build
- `main-abc123`: Specific commit SHA for rollbacks
- `main`: Latest from main branch

## 📦 Dockerfile Optimizations

All Dockerfiles use:
- **Multi-stage builds** ready (Node.js 18 Alpine)
- **Production dependencies only** (`npm ci --only=production`)
- **Proper port exposure** per service
- **Efficient layer caching**

## 🔄 Usage Examples

### Pull and run images:
```bash
# Pull latest auth service
docker pull your-username/microservices-auth:latest

# Run auth service
docker run -p 3000:3000 -e JWT_SECRET=your-secret your-username/microservices-auth:latest

# Pull specific commit
docker pull your-username/microservices-auth:main-abc123
```

### Local development:
```bash
# Build locally
docker build -t auth-local ./auth

# Run with docker-compose (coming next)
docker-compose up
```

## 🚨 Troubleshooting

### Common Issues:
1. **Docker Hub authentication fails**
   - Check DOCKER_USERNAME and DOCKER_PASSWORD secrets
   - Verify access token has correct permissions

2. **Build fails for a service**
   - Check Dockerfile syntax
   - Ensure package.json exists in service directory

3. **Tests fail before build**
   - Verify JWT_SECRET is set
   - Check test user credentials

## 🔜 Next Steps
1. Create docker-compose files for different environments
2. Add health checks to all services
3. Implement deployment to staging/production
4. Add image security scanning