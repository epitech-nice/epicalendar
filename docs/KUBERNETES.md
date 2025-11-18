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

### Check pod logs
```bash
kubectl logs <pod-name> -n epicalendar
kubectl logs <pod-name> -n epicalendar --previous  # Previous container logs
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

- PersistentVolume storage class is set to `standard`. Adjust based on your cluster.
- Resource limits are conservative. Adjust based on your workload.
- Health checks are configured for server and client with appropriate delays.
- TLS is managed by cert-manager with Let's Encrypt.
