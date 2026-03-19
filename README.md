#  Auto CI/CD Deployment System

An automated CI/CD pipeline project that builds, tests, and deploys applications using modern DevOps tools like GitHub Actions, Docker, and Kubernetes (Minikube).

---

##  Overview

This project demonstrates a complete **end-to-end CI/CD pipeline** where:

- Code pushed to GitHub triggers automation
- Application is built and tested automatically
- Docker image is created and pushed
- Deployment happens on Kubernetes (Minikube)

---

## 🛠️ Tech Stack

- **Version Control:** Git, GitHub
- **CI/CD:** GitHub Actions
- **Containerization:** Docker
- **Orchestration:** Kubernetes (Minikube)
- **Scripting:** Bash / YAML
- **Cloud (optional):** AWS / GCP

---

## ⚙️ Architecture


Developer → GitHub Push → GitHub Actions
→ Build → Test → Docker Image
→ Push to Registry → Deploy to Kubernetes


---

##  Features

- ✅ Automated build on code push
- ✅ Continuous Integration using GitHub Actions
- ✅ Docker image creation & management
- ✅ Kubernetes deployment (Minikube)
- ✅ Scalable microservice-ready architecture
- ✅ Easy to extend with monitoring (Prometheus, Grafana)

---

## 📂 Project Structure


autoci-cd/
│── app/ # Application code

│── Dockerfile # Docker configuration

│── k8s/ # Kubernetes manifests

│── .github/workflows/ # CI/CD pipeline (GitHub Actions)

│── scripts/ # Helper scripts



---

## 🔄 CI/CD Pipeline Flow

1. Developer pushes code to GitHub
2. GitHub Actions workflow triggers
3. Application is built and tested
4. Docker image is created
5. Image is pushed to Docker Hub / Registry
6. Kubernetes deployment is updated automatically

---

## ▶️ How to Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/mohithshuka/autoci-cd.git
cd autoci-cd
2️⃣ Start Minikube
minikube start
3️⃣ Build Docker Image
docker build -t autoci-cd-app .
4️⃣ Deploy to Kubernetes
kubectl apply -f k8s/
5️⃣ Access Application
minikube service <service-name>
