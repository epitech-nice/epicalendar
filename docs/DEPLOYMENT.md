# EpiCalendar Deployment Guide

Complete guide for deploying EpiCalendar to a Kubernetes cluster with CI/CD.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Configure GitHub Secrets](#configure-github-secrets)
4. [Deploy to Kubernetes](#deploy-to-kubernetes)
5. [Verify Deployment](#verify-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Local Tools
- Docker Desktop or similar
- kubectl (Kubernetes CLI)
- git
- A text editor

### Infrastructure
- A Kubernetes cluster (options):
  - **Cloud**: GKE (Google), EKS (AWS), AKS (Azure), DigitalOcean
  - **Self-hosted**: k3s, kubeadm, microk8s
  - **Local**: minikube, kind (for testing)

- **NGINX Ingress Controller** installed in your cluster:
  ```bash
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
  ```

- **cert-manager** (optional, for automatic TLS):
  ```bash
  kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
  ```

- A domain name pointing to your cluster's ingress IP

### GitHub Repository
- Repository: `epitech-nice/epicalendar`
- Admin access to configure secrets

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/epitech-nice/epicalendar.git
cd epicalendar
```

### 2. Configure Your Domain

Update the following files with your actual domain:

**kubernetes/server-deployment.yaml:**
```yaml
- name: CLIENT_URL
  value: "https://yourdomain.com"
```

**kubernetes/client-deployment.yaml:**
```yaml
- name: NEXT_PUBLIC_API_URL
  value: "https://yourdomain.com/api"
```

**kubernetes/ingress.yaml:**
```yaml
tls:
- hosts:
  - yourdomain.com
rules:
- host: yourdomain.com
```

### 3. Generate Secure Secrets

```bash
# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET: $JWT_SECRET"

# Generate MongoDB password
MONGO_PASSWORD=$(openssl rand -base64 24)
echo "MONGO_PASSWORD: $MONGO_PASSWORD"
```

**Save these values securely - you'll need them later!**

### 4. Update Kubernetes Secrets

Edit `kubernetes/mongodb-secret.yaml`:
```yaml
stringData:
  MONGO_INITDB_ROOT_USERNAME: admin
  MONGO_INITDB_ROOT_PASSWORD: <your-mongo-password>
  MONGO_INITDB_DATABASE: epicalendar_db
  MONGODB_URI: mongodb://admin:<your-mongo-password>@mongodb-service:27017/epicalendar?authSource=admin
```

Edit `kubernetes/app-secret.yaml`:
```yaml
stringData:
  JWT_SECRET: <your-jwt-secret>
  JWT_EXPIRATION: 7d
```

## Configure GitHub Secrets

### 1. Access GitHub Secrets

1. Go to your repository: `https://github.com/epitech-nice/epicalendar`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 2. Add Required Secrets

#### KUBECONFIG
Get your kubeconfig file:
```bash
# For most clusters
kubectl config view --raw | base64

# For macOS (copies to clipboard)
kubectl config view --raw | base64 | pbcopy

# For Linux (copies to clipboard, if xclip installed)
kubectl config view --raw | base64 -w 0 | xclip -selection clipboard
```

Add as secret named: `KUBECONFIG`

#### MongoDB Secrets
- `MONGO_ROOT_USERNAME`: `admin` (or your chosen username)
- `MONGO_ROOT_PASSWORD`: The password you generated earlier

#### Application Secrets
- `JWT_SECRET`: The JWT secret you generated earlier
- `NEXT_PUBLIC_API_URL`: `https://yourdomain.com/api`

### 3. Verify Secrets

Ensure all secrets are added:
- ✅ KUBECONFIG
- ✅ MONGO_ROOT_USERNAME
- ✅ MONGO_ROOT_PASSWORD
- ✅ JWT_SECRET
- ✅ NEXT_PUBLIC_API_URL

## Deploy to Kubernetes

### 1. Initial Manual Deployment

First deployment should be done manually to verify everything works:

```bash
# Apply all Kubernetes manifests
kubectl apply -k kubernetes/

# Or apply individually
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/mongodb-pvc.yaml
kubectl apply -f kubernetes/mongodb-secret.yaml
kubectl apply -f kubernetes/app-secret.yaml
kubectl apply -f kubernetes/mongodb-deployment.yaml
kubectl apply -f kubernetes/server-deployment.yaml
kubectl apply -f kubernetes/client-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml
```

### 2. Wait for Deployments

```bash
# Watch pods starting
kubectl get pods -n epicalendar -w

# Check deployment status
kubectl rollout status deployment/mongodb -n epicalendar
kubectl rollout status deployment/server -n epicalendar
kubectl rollout status deployment/client -n epicalendar
```

### 3. Get Ingress IP

```bash
kubectl get ingress -n epicalendar
```

### 4. Update DNS

Point your domain to the ingress IP:
- **A Record**: `yourdomain.com` → `<ingress-ip>`
- **CNAME**: `www.yourdomain.com` → `yourdomain.com`

## Verify Deployment

### 1. Check All Resources

```bash
# Get all resources
kubectl get all -n epicalendar

# Check pods
kubectl get pods -n epicalendar

# Check services
kubectl get svc -n epicalendar

# Check ingress
kubectl get ingress -n epicalendar
```

### 2. View Logs

```bash
# Server logs
kubectl logs -f deployment/server -n epicalendar

# Client logs
kubectl logs -f deployment/client -n epicalendar

# MongoDB logs
kubectl logs -f deployment/mongodb -n epicalendar
```

### 3. Test the Application

1. Open your browser: `https://yourdomain.com`
2. Try to register a new account
3. Test login functionality
4. Check the calendar features

## CI/CD Pipeline

### 1. Push to GitHub

Commit your changes:

```bash
git add .
git commit -m "Configure deployment for production"
git push origin main
```

### 2. Monitor Workflow

1. Go to **Actions** tab on GitHub
2. Watch the "CI/CD Pipeline" workflow
3. Verify all jobs complete successfully

### 3. Automatic Deployments

After initial setup, any push to `main` will:
1. Build Docker images
2. Push to GitHub Container Registry
3. Deploy to Kubernetes cluster
4. Restart deployments
5. Verify deployment

## Monitoring and Maintenance

### Check Application Health

```bash
# Get pod status
kubectl get pods -n epicalendar

# Describe a pod
kubectl describe pod <pod-name> -n epicalendar

# View recent events
kubectl get events -n epicalendar --sort-by='.lastTimestamp'
```

### Scaling

```bash
# Scale server
kubectl scale deployment server --replicas=3 -n epicalendar

# Scale client
kubectl scale deployment client --replicas=3 -n epicalendar
```

### Updates

```bash
# Update to specific image tag
kubectl set image deployment/server server=ghcr.io/epitech-nice/epicalendar-server:v1.2.0 -n epicalendar

# Restart deployment (pulls :latest)
kubectl rollout restart deployment/server -n epicalendar
```

### Rollback

```bash
# View rollout history
kubectl rollout history deployment/server -n epicalendar

# Rollback to previous version
kubectl rollout undo deployment/server -n epicalendar

# Rollback to specific revision
kubectl rollout undo deployment/server --to-revision=2 -n epicalendar
```

### Backup MongoDB

```bash
# Create a backup
kubectl exec -n epicalendar deployment/mongodb -- mongodump \
  --uri="mongodb://admin:<password>@localhost:27017/epicalendar?authSource=admin" \
  --out=/tmp/backup

# Copy backup locally
kubectl cp epicalendar/<mongodb-pod>:/tmp/backup ./mongodb-backup
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n epicalendar

# Check logs
kubectl logs <pod-name> -n epicalendar

# Check previous logs (if container restarted)
kubectl logs <pod-name> -n epicalendar --previous
```

### Image Pull Errors

```bash
# Verify images exist
# Visit: https://github.com/epitech-nice/epicalendar/pkgs/container/epicalendar-server

# Check image pull secrets (if using private registry)
kubectl get secrets -n epicalendar
```

### Database Connection Issues

```bash
# Test MongoDB connection
kubectl exec -it deployment/mongodb -n epicalendar -- mongosh \
  "mongodb://admin:<password>@localhost:27017/epicalendar?authSource=admin"

# Check MongoDB logs
kubectl logs deployment/mongodb -n epicalendar
```

### Ingress Issues

```bash
# Check ingress
kubectl describe ingress epicalendar-ingress -n epicalendar

# Check NGINX ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

### SSL/TLS Issues

```bash
# Check certificate
kubectl get certificate -n epicalendar

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager
```

## Advanced Configuration

### Custom Storage Class

If `standard` storage class doesn't exist:

```bash
# List available storage classes
kubectl get storageclass

# Update mongodb-pvc.yaml with your storage class
storageClassName: <your-storage-class>
```

### Resource Limits

Adjust resources in deployment files based on your needs:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Environment-Specific Deployments

Create separate namespaces for staging/production:

```bash
# Deploy to staging
kubectl apply -k kubernetes/ --namespace=epicalendar-staging

# Deploy to production
kubectl apply -k kubernetes/ --namespace=epicalendar-production
```

## Support

For issues or questions:
1. Check logs: `kubectl logs <pod-name> -n epicalendar`
2. Review events: `kubectl get events -n epicalendar`
3. Check GitHub Actions logs
4. Refer to Kubernetes/Docker documentation

## Security Checklist

- ✅ Use strong, randomly generated secrets
- ✅ Never commit secrets to Git
- ✅ Use TLS/SSL for all traffic
- ✅ Keep images updated
- ✅ Regularly backup MongoDB
- ✅ Monitor logs for suspicious activity
- ✅ Use RBAC in Kubernetes
- ✅ Scan images for vulnerabilities

## Next Steps

1. Set up monitoring (Prometheus/Grafana)
2. Configure log aggregation (ELK/Loki)
3. Set up alerts for critical issues
4. Implement automated backups
5. Add staging environment
6. Configure auto-scaling
