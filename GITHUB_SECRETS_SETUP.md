# 🔐 GitHub Secrets Setup Guide

## ❗ QUAN TRỌNG: Cấu hình GitHub Secrets

### 🚨 Lỗi hiện tại:
```
Error: Invalid format '/eproject-product'
ERROR: DOCKER_USERNAME secret is not set!
```

### ✅ Cách khắc phục:

## 📋 Bước 1: Tạo Docker Hub Access Token

1. **Đăng nhập Docker Hub**: https://hub.docker.com
2. **Vào Account Settings** → **Security** 
3. **Tạo New Access Token**:
   - **Token Name**: `github-actions-ci`
   - **Permissions**: ✅ Read ✅ Write ✅ Delete
4. **Copy token** (chỉ hiện 1 lần)

## 📋 Bước 2: Thêm GitHub Secrets

Vào repository → **Settings** → **Secrets and variables** → **Actions**

### Click **"New repository secret"** và thêm:

```bash
# Secret 1
Name: DOCKER_USERNAME
Value: your-dockerhub-username    # ❗ Chính xác username trên Docker Hub

# Secret 2  
Name: DOCKER_PASSWORD
Value: dckr_pat_xxxxxxxxxxxxx     # ❗ Access token vừa tạo (NOT password)

# Secret 3
Name: JWT_SECRET  
Value: my-super-secret-jwt-key-2024

# Secret 4
Name: LOGIN_TEST_USER
Value: testuser

# Secret 5
Name: LOGIN_TEST_PASSWORD  
Value: password123
```

## 🔍 Kiểm tra Secrets đã tạo:

Repository → Settings → Secrets → Actions:
```
✅ DOCKER_USERNAME        ***
✅ DOCKER_PASSWORD        ***  
✅ JWT_SECRET             ***
✅ LOGIN_TEST_USER        ***
✅ LOGIN_TEST_PASSWORD    ***
```

## 🚀 Test sau khi setup:

```bash
git add .
git commit -m "test: verify Docker secrets setup"
git push origin main
```

## 📋 Checklist:

- [ ] **Docker Hub account** tạo xong
- [ ] **Access token** tạo với quyền Read/Write/Delete  
- [ ] **DOCKER_USERNAME** = chính xác username Docker Hub
- [ ] **DOCKER_PASSWORD** = access token (không phải password)
- [ ] **Tất cả 5 secrets** đã được thêm vào GitHub
- [ ] **Push code** để test pipeline

## ⚠️ Lưu ý quan trọng:

1. **DOCKER_PASSWORD** phải là **Access Token**, KHÔNG phải password
2. **DOCKER_USERNAME** phải chính xác 100% (case-sensitive)
3. **Secrets không được có space thừa** ở đầu/cuối
4. **Access token chỉ hiện 1 lần** - lưu lại ngay

## 🔧 Troubleshooting:

### Nếu vẫn lỗi:
1. **Xóa và tạo lại** tất cả secrets
2. **Kiểm tra Docker Hub username** chính xác  
3. **Tạo mới access token** với full permissions
4. **Test login local**:
```bash
echo "your-access-token" | docker login -u your-username --password-stdin
```