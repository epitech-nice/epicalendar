# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the EpiCalendar application.

## Prerequisites

- Kubernetes cluster (v1.19+)
- kubectl configured to communicate with your cluster
- NGINX Ingress Controller installed
- cert-manager installed (for automatic TLS certificates)

## Architecture

The application consists of:
- **MongoDB**: Database (1 replica with persistent storage)
- **Server**: Backend API (2 replicas)
- **Client**: Next.js frontend (2 replicas)
- **Ingress**: Routes traffic to appropriate services

## Files Overview

- `namespace.yaml`: Creates the epicalendar namespace
- `mongodb-pvc.yaml`: Persistent volume claim for MongoDB data
- `mongodb-secret.yaml`: MongoDB credentials
- `app-secret.yaml`: Application secrets (JWT)
- `mongodb-configmap.yaml`: MongoDB configuration
- `mongodb-deployment.yaml`: MongoDB deployment and service
- `server-deployment.yaml`: Backend API deployment and service
- `client-deployment.yaml`: Frontend deployment and service
- `ingress.yaml`: Ingress rules for routing
- `kustomization.yaml`: Kustomize configuration

## Deployment Steps

### 1. Update Configuration

Before deploying, update the following files:

#### `server-deployment.yaml`
```yaml
- name: CLIENT_URL
  value: "https://your-domain.com"  # Replace with your actual domain
```

#### `client-deployment.yaml`
```yaml
- name: NEXT_PUBLIC_API_URL
  value: "https://your-domain.com/api"  # Replace with your actual domain
```

#### `ingress.yaml`
```yaml
tls:
- hosts:
  - your-domain.com  # Replace with your actual domain
rules:
- host: your-domain.com  # Replace with your actual domain
```

### 2. Update Secrets (Production)

For production, update the secrets with secure values:

#### `mongodb-secret.yaml`
```yaml
stringData:
  MONGO_INITDB_ROOT_USERNAME: <secure-username>
  MONGO_INITDB_ROOT_PASSWORD: <secure-password>
  MONGODB_URI: mongodb://<username>:<password>@mongodb-service:27017/epicalendar?authSource=admin
```

#### `app-secret.yaml`
```yaml
stringData:
  JWT_SECRET: <secure-random-string>
  JWT_EXPIRATION: 7d
```

### 3. Deploy to Kubernetes

Apply all manifests using kustomize:

```bash
kubectl apply -k kubernetes/
```

Or apply individually:

```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/mongodb-pvc.yaml
kubectl apply -f kubernetes/mongodb-secret.yaml
kubectl apply -f kubernetes/app-secret.yaml
kubectl apply -f kubernetes/mongodb-configmap.yaml
kubectl apply -f kubernetes/mongodb-deployment.yaml
kubectl apply -f kubernetes/server-deployment.yaml
kubectl apply -f kubernetes/client-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml
```

### 4. Verify Deployment

Check the status of your deployments:

```bash
# Check all resources
kubectl get all -n epicalendar

# Check pods status
kubectl get pods -n epicalendar

# Check services
kubectl get svc -n epicalendar

# Check ingress
kubectl get ingress -n epicalendar

# View logs
kubectl logs -f deployment/server -n epicalendar
kubectl logs -f deployment/client -n epicalendar
kubectl logs -f deployment/mongodb -n epicalendar
```

### 5. Access the Application

Once deployed, access your application at `https://your-domain.com`

## Scaling

Scale deployments as needed:

```bash
# Scale server
kubectl scale deployment server --replicas=3 -n epicalendar

# Scale client
kubectl scale deployment client --replicas=3 -n epicalendar
```

## Updates

To update the application:

```bash
# Update images
kubectl set image deployment/server server=ghcr.io/epitech-nice/epicalendar-server:new-tag -n epicalendar
kubectl set image deployment/client client=ghcr.io/epitech-nice/epicalendar-client:new-tag -n epicalendar

# Or restart to pull latest
kubectl rollout restart deployment/server -n epicalendar
kubectl rollout restart deployment/client -n epicalendar
```

## Troubleshooting

### PersistentVolumeClaim (PVC) Unbound

If you see `pod has unbound immediate PersistentVolumeClaims`:

```bash
# Check PVC status
kubectl get pvc -n epicalendar

# Check available storage classes
kubectl get storageclass

# Describe the PVC to see why it's not binding
kubectl describe pvc mongodb-pvc -n epicalendar
```

**Solutions:**

1. **Delete and recreate the PVC** (⚠️ This will delete MongoDB data!)
   ```bash
   # Scale down MongoDB to 0 replicas first
   kubectl scale deployment mongodb --replicas=0 -n epicalendar

   # Delete the PVC
   kubectl delete pvc mongodb-pvc -n epicalendar

   # Reapply with the new storage class
   kubectl apply -f kubernetes/mongodb-pvc.yaml

   # Scale MongoDB back up
   kubectl scale deployment mongodb --replicas=1 -n epicalendar
   ```

2. **Use the default storage class** (if available)
   ```bash
   # Check which storage class is default
   kubectl get storageclass
   ```
   - Remove `storageClassName` from `mongodb-pvc.yaml` to use the default
   - Or update it to match an available storage class name

2. **For local development/testing (hostPath)**
   Create a simple PersistentVolume manually:
   ```yaml
   apiVersion: v1
   kind: PersistentVolume
   metadata:
     name: mongodb-pv
   spec:
     capacity:
       storage: 10Gi
     accessModes:
       - ReadWriteOnce
     hostPath:
       path: /data/mongodb
       type: DirectoryOrCreate
   ```
   Apply: `kubectl apply -f mongodb-pv.yaml`

3. **For cloud providers:**
   - **GKE**: Use `storageClassName: standard-rw` or `premium-rw`
   - **EKS**: Use `storageClassName: gp2` or `gp3`
   - **AKS**: Use `storageClassName: managed` or `managed-premium`
   - **DigitalOcean**: Use `storageClassName: do-block-storage`

4. **Install a storage provisioner** (for bare-metal/self-hosted)
   ```bash
   # Example: Local Path Provisioner
   kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml
   
   # Then update mongodb-pvc.yaml to use 'local-path'
   ```

### ImagePullBackOff Error

If you see `ImagePullBackOff` or `ErrImagePull` errors:

```bash
# Check pod events
kubectl describe pod <pod-name> -n epicalendar
```

**Common causes:**
1. **Missing image pull secret for private registry (ghcr.io)**
   - The CI/CD pipeline automatically creates `ghcr-secret` 
   - Manually create if needed:
   ```bash
   kubectl create secret docker-registry ghcr-secret \
     --docker-server=ghcr.io \
     --docker-username=<github-username> \
     --docker-password=<github-token> \
     --docker-email=<email> \
     --namespace=epicalendar
   ```

2. **Image doesn't exist or wrong tag**
   - Verify image exists: `docker pull ghcr.io/epitech-nice/epicalendar-server:latest`
   - Check available tags on GitHub Container Registry

3. **Registry authentication issues**
   - Ensure GitHub token has `read:packages` permission
   - For GitHub Actions, `GITHUB_TOKEN` is provided automatically

### Check pod logs
```bash
kubectl logs <pod-name> -n epicalendar
kubectl logs <pod-name> -n epicalendar --previous  # Previous container logs
```

### Rollout timeout

If deployment rollout times out:

```bash
# Check rollout status
kubectl rollout status deployment/server -n epicalendar
kubectl rollout status deployment/client -n epicalendar

# Check why pods are failing
kubectl get pods -n epicalendar
kubectl describe pod <failing-pod> -n epicalendar

# Rollback if needed
kubectl rollout undo deployment/server -n epicalendar
```

### Describe resources
```bash
kubectl describe pod <pod-name> -n epicalendar
kubectl describe deployment <deployment-name> -n epicalendar
```

### Execute commands in pods
```bash
kubectl exec -it <pod-name> -n epicalendar -- /bin/sh
```

### Check events
```bash
kubectl get events -n epicalendar --sort-by='.lastTimestamp'
```

## Cleanup

To remove all resources:

```bash
kubectl delete namespace epicalendar
```

Or individually:

```bash
kubectl delete -k kubernetes/
```

## Notes

- **Storage Requirements**: 
  - PersistentVolume storage class needs to be configured for your cluster
  - Default `storageClassName` is commented out in `mongodb-pvc.yaml`
  - Update based on your cluster provider (see Troubleshooting section)
  - For testing: consider using hostPath PV or local-path-provisioner
- Resource limits are conservative. Adjust based on your workload.
- Health checks are configured for server and client with appropriate delays.
- TLS is managed by cert-manager with Let's Encrypt.
