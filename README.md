# AutoCI-CD — Auto-Scaling CI/CD Deployment System

> A production-grade, fully automated CI/CD pipeline with auto-scaling and real-time monitoring — inspired by how Netflix and Swiggy handle backend deployments at scale.

![CI Pipeline](https://github.com/mohithshuka/autoci-cd/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326CE5?logo=kubernetes)
![Helm](https://img.shields.io/badge/Helm-Deployed-0F1689?logo=helm)
![Grafana](https://img.shields.io/badge/Grafana-Monitored-F46800?logo=grafana)

---

## What This Project Does

Every time code is pushed to GitHub:

```
git push → tests run → Docker image builds → Kubernetes deploys → HPA scales → Grafana monitors
```

**Zero manual steps. Push code → it ships automatically.**

---

## Live Monitoring Dashboards

### Kubernetes API Server — Availability & SLI Metrics
<img width="1874" height="988" alt="Screenshot 2026-03-20 225830" src="https://github.com/user-attachments/assets/6bd0f668-b546-4b56-9066-c71d004a04d5" />


> Real-time availability tracking at **95-98%**, Read SLI requests, error rates and response durations across all Kubernetes components.

---

### Prometheus Overview — Target Discovery & Scrape Health
<img width="1868" height="1002" alt="Screenshot 2026-03-20 230019" src="https://github.com/user-attachments/assets/0e3bd661-d139-403e-b1dc-e03940db9e45" />


> Prometheus scraping **400+ targets** across the cluster with sub-30ms scrape intervals. Live target sync and appended samples counter.

---

### Alertmanager — Alerts & Notification Routing
<img width="1839" height="1007" alt="Screenshot 2026-03-20 225904" src="https://github.com/user-attachments/assets/5bcb41e1-c207-4f5f-9782-a353df95c091" />



> Real-time alert tracking with notification routing to Discord, Email, Jira and Incidentio. Alert receive rate monitored at 0.1 ops/s.

---

## Architecture

```
Developer
    │
    │  git push
    ▼
┌─────────────────────────────────┐
│         GitHub Repository        │
└─────────────────────────────────┘
    │
    │  triggers automatically
    ▼
┌─────────────────────────────────┐
│     GitHub Actions CI Pipeline  │
│                                 │
│  ┌────────────┐  ┌────────────┐ │
│  │ Install &  │─▶│   Build    ││ 
│  │   Test     │  │   Docker   │ │
│  │ (5 tests)  │  │   Image    │ │
│  └────────────┘  └────────────┘ │
└─────────────────────────────────┘
    │
    │  deploy
    ▼
┌─────────────────────────────────┐
│   Kubernetes Cluster (Minikube) │
│                                 │
│  ┌──────────┐  ┌─────────────┐  │
│  │ 2-10     │  │  NodePort   │  │
│  │  Pods    │  │   Service   │  │
│  │  (HPA)   │  │  port 3000  │  │
│  └──────────┘  └─────────────┘  │
└─────────────────────────────────┘
    │                    │
    │  scrapes /metrics  │  traffic
    ▼                    ▼
┌──────────┐      ┌──────────────┐
│Prometheus│─────▶│   Grafana   │
│          │query │  Dashboards  │
└──────────┘      └──────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | Node.js + Express | REST API with 3 endpoints |
| Testing | Jest + Supertest | 5 automated tests |
| Containerization | Docker multi-stage | Production optimized image |
| CI Pipeline | GitHub Actions | Auto test + build on push |
| Orchestration | Kubernetes + Minikube | Container management |
| Auto-scaling | Horizontal Pod Autoscaler | Scale 2 → 10 pods on CPU |
| Package Manager | Helm | Monitoring stack deployment |
| Monitoring | Prometheus | Metrics collection + storage |
| Visualization | Grafana | Real-time dashboards |
| Metrics SDK | prom-client | Express middleware metrics |

---

## API Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/health` | App health check | `{status, uptime, timestamp}` |
| GET | `/api/orders` | Food delivery orders | Array of 3 orders |
| GET | `/api/stream` | Streaming catalog | Array of 3 shows |
| GET | `/metrics` | Prometheus scrape | Text/plain metrics |

---

## Project Structure

```
autoci-cd/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions — test + build
├── k8s/
│   ├── deployment.yaml         # Kubernetes deployment + service
│   └── hpa.yaml                # Auto-scaler (2 to 10 pods)
├── src/
│   └── app.js                  # Express API + Prometheus metrics
├── tests/
│   └── app.test.js             # Jest test suite (5 tests)
├── docs/
│   ├── grafana-kubernetes.png  # Dashboard screenshots
│   ├── grafana-prometheus.png
│   └── grafana-alertmanager.png
├── Dockerfile                  # Multi-stage production build
├── .gitignore
└── package.json
```

---

## Getting Started

### Prerequisites

```bash
node --version    # v18+
docker --version  # any
minikube version  # any
helm version      # any
```

### 1. Clone and install

```bash
git clone https://github.com/mohithshuka/autoci-cd.git
cd autoci-cd
npm install
```

### 2. Run tests

```bash
npm test
# 5 tests pass in ~2s
```

### 3. Start locally

```bash
npm start
curl http://localhost:3000/health
```

### 4. Deploy to Kubernetes

```bash
# Start cluster
minikube start --cpus=2 --memory=3500 --driver=docker
minikube addons enable metrics-server

# Build image inside Minikube
minikube image build -t autoci-app:latest .

# Deploy
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/hpa.yaml

# Get URL
minikube service autoci-app-service --url
```

### 5. Install monitoring

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace --skip-crds=false

# Access Grafana
kubectl --namespace monitoring port-forward svc/monitoring-grafana 3001:80
# Open http://localhost:3001  |  admin / your-password
```

---

## CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────┐
│           GitHub Actions ci.yml              │
│                                              │
│  on: push to main                            │
│                                              │
│  job 1: Install and Test                     │
│    ├── actions/checkout@v3                   │
│    ├── actions/setup-node@v3 (Node 18)       │
│    ├── npm ci                                │
│    └── npm test → 5 tests must pass          │
│                                              │
│  job 2: Build Docker Image (needs: test)     │
│    ├── actions/checkout@v3                   │
│    ├── docker build -t autoci-app:SHA .      │
│    └── docker images autoci-app              │
└─────────────────────────────────────────────┘
```

---

## Auto-Scaling in Action

The HPA monitors CPU across all pods every 15 seconds:

```bash
# Watch scaling happen live
kubectl get hpa -w

# NAME             TARGETS   MINPODS   MAXPODS   REPLICAS
# autoci-app-hpa   0%/50%    2         10        2
# autoci-app-hpa   68%/50%   2         10        4   ← scaling up!
# autoci-app-hpa   82%/50%   2         10        7   ← more pods!
# autoci-app-hpa   12%/50%   2         10        2   ← scaled back down
```

| Setting | Value |
|---------|-------|
| Min replicas | 2 |
| Max replicas | 10 |
| Scale up trigger | CPU > 50% |
| Scale down | Automatic |

---

## Startup Commands (after PC restart)

```bash
# 1. Start cluster
minikube start --cpus=2 --memory=3500 --driver=docker

# 2. Redeploy app
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/hpa.yaml

# 3. Start Grafana
kubectl --namespace monitoring port-forward svc/monitoring-grafana 3001:80
```

---

## Key Learnings

- Multi-stage Docker builds keep production images lean
- Kubernetes liveness and readiness probes prevent bad traffic routing
- HPA requires `metrics-server` addon to read CPU data
- `prom-client` middleware instruments every HTTP request automatically
- GitHub Actions `needs:` keyword gates Docker builds behind passing tests.
- Helm charts deploy entire monitoring stacks with a single command.

---

## Author

**Mohith shuka**
GitHub: [@mohithshuka](https://github.com/mohithshuka)

---

## License

MIT
