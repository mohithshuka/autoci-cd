# CI/CD Pipeline with GitHub Actions, ArgoCD & Kubernetes

This project demonstrates a complete CI/CD pipeline for a Node.js application using GitHub Actions, ArgoCD, and Kubernetes.

## 📋 Table of Contents

- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup](#-setup)
- [CI/CD Pipeline](#-cicd-pipeline)
- [ArgoCD Setup](#-argocd-setup)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

## 🏗️ Project Structure

```
automateci-cd/
├── .github/workflows/   # GitHub Actions CI/CD pipelines
│   ├── ci.yml             # CI pipeline (build, test, push image)
│   └── deploy.yml         # CD pipeline (update ArgoCD app)
├── k8s/                   # Kubernetes manifests
│   ├── namespace.yaml     # Namespace definition
│   ├── deployment.yaml    # Deployment with HPA
│   ├── service.yaml       # Service
│   ├── ingress.yaml       # Ingress
│   └── hpa.yaml           # Horizontal Pod Autoscaler
├── src/                   # Node.js application
│   ├── app.js             # Express application
│   ├── package.json       # Dependencies
│   └── Dockerfile         # Docker image definition
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## ✅ Prerequisites

Before you begin, ensure you have the following set up:

- **GitHub Repository**: A GitHub repository for your project
- **Docker Hub Account**: To store Docker images
- **Kubernetes Cluster**: A running Kubernetes cluster
- **ArgoCD**: Installed on your Kubernetes cluster
- **kubectl**: Configured to access your cluster

## 🛠️ Setup

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository settings:

| Secret Name | Description |
|-------------|-------------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub password |
| `KUBE_CONFIG` | Base64 encoded kubeconfig file |
| `ARGOCD_SERVER` | ArgoCD server URL (e.g., `argocd.example.com`) |
| `ARGOCD_USERNAME` | ArgoCD username |
| `ARGOCD_PASSWORD` | ArgoCD password |

### 2. Configure ArgoCD

#### Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

#### Create ArgoCD Application

```bash
kubectl apply -f k8s/argocd-app.yaml
```

## 🔄 CI/CD Pipeline

### CI Pipeline (`.github/workflows/ci.yml`)

This pipeline runs automatically on every push to the `main` branch:

1. **Checkout code** - Fetches the latest code
2. **Login to Docker Hub** - Authenticates with Docker Hub
3. **Build Docker image** - Builds the Docker image from `Dockerfile`
4. **Push Docker image** - Pushes the image to Docker Hub
5. **Update ArgoCD** - Triggers the CD pipeline

### CD Pipeline (`.github/workflows/deploy.yml`)

This pipeline updates the ArgoCD application with the new image tag:

1. **Decode kubeconfig** - Decodes the base64 encoded kubeconfig
2. **Set kubectl context** - Configures kubectl to use your cluster
3. **Update ArgoCD app** - Updates the image tag in the ArgoCD application

## 🧪 Testing

### 1. Trigger the Pipeline

Make a change to your application and push to the `main` branch:

```bash
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

### 2. Monitor the Pipeline

Check the GitHub Actions tab in your repository to monitor the pipeline progress:

```bash
# Monitor CI pipeline
github actions list --repo <owner>/<repo>

# Monitor CD pipeline
github actions list --repo <owner>/<repo>
```

### 3. Verify Deployment

Check the ArgoCD UI or use kubectl to verify the deployment:

```bash
# Check ArgoCD application status
kubectl get argocd -n argocd

# Check deployment
kubectl get deployment -n autoci-app

# Check service
kubectl get service -n autoci-app

# Check ingress
kubectl get ingress -n autoci-app
```

### 4. Test the Application

Access the application using the ingress URL:

```bash
# Get ingress URL
kubectl get ingress -n autoci-app

# Test health endpoint
curl http://<ingress-url>/health

# Test API endpoint
curl http://<ingress-url>/api/orders
```

## 📈 Horizontal Pod Autoscaling (HPA)

The deployment includes HPA to automatically scale the number of pods based on CPU utilization.

### HPA Configuration

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: autoci-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: autoci-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
```

### Test HPA

Generate load to test the HPA:

```bash
# Generate load
while true; do curl http://<ingress-url>/api/orders; done

# Monitor HPA
kubectl get hpa -n autoci-app -w
```

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Pipeline fails on Docker login | Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets |
| ArgoCD app not syncing | Check ArgoCD server URL and credentials |
| Deployment stuck in Pending | Verify node resources and image pull policy |
| HPA not scaling | Check CPU utilization and min/max replicas |

### Debugging

```bash
# Check pipeline logs
github actions logs <run-id>

# Check ArgoCD application
kubectl get argocd -n argocd -o yaml

# Check deployment
kubectl describe deployment autoci-app -n autoci-app

# Check HPA
kubectl describe hpa autoci-app-hpa -n autoci-app
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.