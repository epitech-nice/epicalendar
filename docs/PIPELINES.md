# GitHub Actions CI/CD

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)

Main pipeline that builds, tests, and deploys the application.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
1. **build-and-push-server**: Builds and pushes server Docker image to GitHub Container Registry
2. **build-and-push-client**: Builds and pushes client Docker image to GitHub Container Registry
3. **deploy**: Deploys to Kubernetes cluster (only on push to main branch)

### 2. PR Checks (`pr-checks.yml`)

Validates pull requests before merging.

**Triggers:**
- Pull requests to `main` or `develop` branches

**Jobs:**
1. **lint-and-test**: Runs linting and builds for both server and client
2. **docker-build-test**: Tests Docker builds without pushing

## Setup Instructions

### 1. GitHub Container Registry

The workflows use GitHub Container Registry (GHCR) to store Docker images. No additional setup is needed as the `GITHUB_TOKEN` is automatically provided.

To make your images public (optional):
1. Go to your repository on GitHub
2. Navigate to Packages
3. Select your package
4. Click "Package settings"
5. Change visibility to "Public"

### 2. Required Secrets

Configure the following secrets in your GitHub repository:

#### Repository Settings → Secrets and variables → Actions → New repository secret

**Kubernetes Configuration:**
- `KUBECONFIG`: Base64-encoded kubeconfig file
  ```bash
  cat ~/.kube/config | base64 | pbcopy  # macOS
  cat ~/.kube/config | base64 -w 0      # Linux
  ```

**MongoDB Secrets:**
- `MONGO_ROOT_USERNAME`: MongoDB root username (e.g., `mongo`)
- `MONGO_ROOT_PASSWORD`: MongoDB root password (secure random string)

**Application Secrets:**
- `JWT_SECRET`: JWT secret key (secure random string)
- `NEXT_PUBLIC_API_URL`: Public API URL (e.g., `https://your-domain.com/api`)

### 3. Generate Secure Secrets

Use these commands to generate secure secrets:

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate MongoDB password
openssl rand -base64 24
```

### 4. Prepare Kubeconfig

Get your kubeconfig file:

```bash
# Copy kubeconfig and encode it
kubectl config view --raw | base64 | pbcopy  # macOS
kubectl config view --raw | base64 -w 0      # Linux
```

Then paste the output as the `KUBECONFIG` secret in GitHub.

### 5. Configure Remote Host

Make sure your Kubernetes cluster is accessible:

1. **Using kubectl from CI:**
   - The workflow uses the KUBECONFIG secret to authenticate
   - Ensure your cluster API is accessible from GitHub Actions runners
   - You may need to whitelist GitHub Actions IP ranges if using firewall

2. **Alternative: Using SSH tunnel:**
   If your cluster is behind a firewall, you can use a bastion host:
   
   Add these secrets:
   - `SSH_PRIVATE_KEY`: SSH private key to access bastion
   - `SSH_HOST`: Bastion host address
   - `SSH_USER`: SSH username
   - `SSH_PORT`: SSH port (default: 22)

## Workflow Behavior

### Push to `main`
1. Builds and pushes Docker images with `latest` tag
2. Deploys to production Kubernetes cluster
3. Restarts deployments to pull latest images
4. Verifies deployment success

### Push to `develop`
1. Builds and pushes Docker images with `develop` tag
2. No automatic deployment (can be added if needed)

### Pull Requests
1. Runs linting and tests
2. Tests Docker builds
3. Does not push images or deploy

## Image Tags

The workflows automatically tag images with:
- `latest`: For main branch
- `develop`: For develop branch
- `pr-{number}`: For pull requests
- `{branch}-{sha}`: For specific commits
- `{version}`: For semver tags (if using releases)

## Monitoring Deployments

View workflow runs:
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select the workflow run to view logs

Check deployment status:
```bash
kubectl get pods -n epicalendar
kubectl rollout status deployment/server -n epicalendar
kubectl rollout status deployment/client -n epicalendar
```

## Rollback

If a deployment fails, rollback to previous version:

```bash
kubectl rollout undo deployment/server -n epicalendar
kubectl rollout undo deployment/client -n epicalendar
```

## Manual Trigger

You can manually trigger the workflow:
1. Go to Actions tab
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Troubleshooting

### Build Failures
- Check Docker build logs in the Actions tab
- Verify Dockerfile.prod exists and is correct
- Check that all dependencies are properly specified

### Deployment Failures
- Verify KUBECONFIG secret is correct
- Check that all required secrets are set
- Ensure cluster is accessible from GitHub Actions
- Review deployment logs: `kubectl describe deployment <name> -n epicalendar`

### Image Pull Errors
- Verify images were pushed successfully
- Check image tags match deployment manifests
- Ensure GITHUB_TOKEN has package write permissions

## Environment-Specific Deployments

To deploy to different environments (staging, production):

1. Create environment-specific secrets in GitHub
2. Update workflow to use environment-specific secrets
3. Create separate Kubernetes namespaces for each environment

Example:
```yaml
deploy-staging:
  runs-on: ubuntu-latest
  environment: staging
  steps:
    - name: Deploy to Staging
      run: kubectl apply -k kubernetes/ --namespace=epicalendar-staging
```

## Best Practices

1. **Never commit secrets** to the repository
2. **Use environment secrets** for production credentials
3. **Test in staging** before deploying to production
4. **Monitor deployments** and set up alerts
5. **Use semantic versioning** for releases
6. **Review logs** regularly for issues
7. **Keep dependencies updated** for security
