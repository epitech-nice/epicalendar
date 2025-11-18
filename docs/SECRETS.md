# GitHub Actions Secrets Setup

## Overview

This document explains how to configure all required secrets for the CI/CD pipeline in GitHub Actions.

## Navigate to Repository Settings

1. Go to your GitHub repository: `https://github.com/epitech-nice/epicalendar`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following

## Required Secrets

### 1. NEXT_PUBLIC_API_URL

- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** Your production API URL (e.g., `https://api.yourdomain.com` or `http://your-server-ip:5000`)
- **Used for:** Building the Next.js client with the correct API endpoint

### 2. KUBECONFIG

- **Name:** `KUBECONFIG`
- **Value:** Base64-encoded Kubernetes config file
- **Used for:** Authenticating with your Kubernetes cluster
- **How to get it:**
  ```bash
  cat ~/.kube/config | base64
  ```
  Copy the entire base64 output

### 3. MONGO_ROOT_USERNAME

- **Name:** `MONGO_ROOT_USERNAME`
- **Value:** MongoDB root username (e.g., `admin`)
- **Used for:** MongoDB authentication in Kubernetes

### 4. MONGO_ROOT_PASSWORD

- **Name:** `MONGO_ROOT_PASSWORD`
- **Value:** Strong password for MongoDB root user
- **Used for:** MongoDB authentication in Kubernetes
- **Example:** Generate a strong password like `$(openssl rand -base64 32)`

### 5. JWT_SECRET

- **Name:** `JWT_SECRET`
- **Value:** Secret key for JWT token signing
- **Used for:** Authentication token generation/validation
- **Example:** Generate a strong secret like `$(openssl rand -base64 64)`

## Automatic Secret (No Setup Needed)

### GITHUB_TOKEN

- **Already provided** by GitHub Actions automatically
- **Used for:** Authenticating to GitHub Container Registry (ghcr.io)
- No action required

## Quick Setup Commands

Generate secure values for secrets:

```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate MONGO_ROOT_PASSWORD
openssl rand -base64 32

# Get base64-encoded kubeconfig
cat ~/.kube/config | base64
```

## Setup Checklist

- [ ] `NEXT_PUBLIC_API_URL` - Your production API URL
- [ ] `KUBECONFIG` - Base64-encoded Kubernetes config
- [ ] `MONGO_ROOT_USERNAME` - MongoDB admin username
- [ ] `MONGO_ROOT_PASSWORD` - MongoDB admin password
- [ ] `JWT_SECRET` - JWT signing secret

## Verification

Once all secrets are configured, your pipeline will automatically:

1. Build Docker images for server and client
2. Push images to GitHub Container Registry (ghcr.io)
3. Deploy to your Kubernetes cluster on every push to the `main` branch

You can verify the secrets are properly set by:

1. Going to **Settings** → **Secrets and variables** → **Actions**
2. Checking that all 5 required secrets are listed
3. Running the pipeline and checking for authentication errors
