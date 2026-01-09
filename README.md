<h1 align=center>ShortLink</h1>

<div align=center>

![Node.js](https://img.shields.io/badge/node.js-339933.svg?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge\&logo=express\&logoColor=white)
![Redis](https://img.shields.io/badge/redis-DC382D.svg?style=for-the-badge\&logo=redis\&logoColor=white)
![Docker](https://img.shields.io/badge/docker-2496ED.svg?style=for-the-badge\&logo=docker\&logoColor=white)
![NGINX](https://img.shields.io/badge/nginx-009639.svg?style=for-the-badge\&logo=nginx\&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-7B42BC.svg?style=for-the-badge\&logo=terraform\&logoColor=white)
![AWS](https://img.shields.io/badge/aws-232F3E.svg?style=for-the-badge\&logo=amazon-aws\&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-2088FF.svg?style=for-the-badge\&logo=github-actions\&logoColor=white)
</div>

## Overview

**ShortLink** is a production-grade URL shortener designed with scalability, reliability, and operational discipline in mind. It demonstrates how a seemingly simple service can be built using real-world backend and infrastructure practices: caching, reverse proxies, containerization, CI/CD, and cloud provisioning.

The project is intentionally opinionated. It favors clarity, debuggability, and production readiness over minimalism, making it suitable both as a reference architecture and as a foundation for real deployments.

---
## 💼 Business Case

### The Problem
Enterprise organizations often rely on third-party URL shorteners (like Bitly), which introduces three risks:
1.  **Data Leakage:** Click analytics and traffic patterns are exposed to a third party.
2.  **Vendor Lock-in:** Migrating thousands of active short links is difficult and costly.
3.  **Cost at Scale:** SaaS pricing often penalizes high-volume usage (e.g., millions of redirects).

### The Solution: ShortLink
ShortLink provides a **self-hosted, sovereign infrastructure** alternative.
* **Ownership:** You own the data and the domain.
* **Performance:** Redis caching ensures <10ms redirect latency, faster than most SaaS APIs.
* **Predictable Pricing:** Fixed infrastructure costs regardless of click volume.
---

## Core Features

* URL shortening with deterministic or generated aliases
* High-performance redirect handling using Redis caching
* Rate limiting and abuse protection
* Reverse proxy setup with NGINX
* Fully containerized local and production environments
* Infrastructure-as-Code for cloud provisioning
* CI/CD-ready repository structure

---

## High-Level Architecture

At a high level, ShortLink follows a layered architecture:

1. **Client** sends requests to shorten or resolve URLs
2. **AWS Application Load Balancer (ALB)** handles incoming HTTPS traffic
3. **NGINX** runs as an instance-level reverse proxy and security layer
4. **Express (Node.js)** handles API logic and redirects
5. **Redis** provides low-latency shared storage for URL mappings and rate limits
6. **Docker** packages services consistently across environments
7. **AWS (via Terraform)** provisions production infrastructure

This separation ensures each layer can scale, fail, or evolve independently.

---

## Tech Stack

### Application Layer

![Node.js](https://img.shields.io/badge/node.js-339933.svg?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge\&logo=express\&logoColor=white)

* Node.js runtime
* Express.js web framework

### Caching & Data

![Redis](https://img.shields.io/badge/redis-DC382D.svg?style=for-the-badge\&logo=redis\&logoColor=white)

* Redis for URL storage and rate limiting

### Containerization & Networking

![Docker](https://img.shields.io/badge/docker-2496ED.svg?style=for-the-badge\&logo=docker\&logoColor=white)
![NGINX](https://img.shields.io/badge/nginx-009639.svg?style=for-the-badge\&logo=nginx\&logoColor=white)

* Docker for reproducible environments
* NGINX as reverse proxy and traffic gatekeeper

### Infrastructure & Automation

![Terraform](https://img.shields.io/badge/terraform-7B42BC.svg?style=for-the-badge&logo=terraform&logoColor=white)
![AWS](https://img.shields.io/badge/aws-232F3E.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-2088FF.svg?style=for-the-badge&logo=github-actions&logoColor=white)

* **Terraform:** Infrastructure-as-Code for the AWS environment.
* **AWS:** Primary cloud provider (EC2, ALB, ElastiCache).
* **Cloudflare:** DNS management, SSL offloading, and DDoS protection.
* **Vercel:** Serverless hosting for the "Edge" deployment branch.
* **GitHub Actions:** CI/CD pipelines for automated testing and deployment.

---

## 🏗️ Deployment & Architecture

This project is engineered to support two distinct deployment models, demonstrating versatility between **Enterprise Control** and **Serverless Efficiency**.

| Mode | Technology Stack | Cost | Use Case |
| :--- | :--- | :--- | :--- |
| **Enterprise (AWS)** | EC2, ALB, Auto Scaling, Redis, Terraform | ~$82/mo | **High Availability / Data Sovereignty:** For organizations requiring full infrastructure control and strict SLAs. |
| **Serverless (Vercel)** | Vercel Functions, Upstash Redis | **$0/mo** | **Portfolio / Startup:** Zero-maintenance scaling for lean deployments. *(Live Demo runs here)* |

## ⏱️ Engineering Effort (Man Hours)

A breakdown of the **~54 hours** invested in this project:

| Phase | Time | Focus Areas |
| :--- | :--- | :--- |
| **Architecture & Design** | 10h | System design, failure mode analysis, AWS topology planning. |
| **Backend Development** | 15h | Node.js API, Redis integration, rate limiting logic, unit testing. |
| **DevOps & IaC** | 20h | Terraform provisioning, ASG configuration, zero-downtime deployment strategies. |
| **CI/CD & Observability** | 4h | GitHub Actions pipelines, Grafana/Prometheus dashboards. |
| **Documentation** | 5h | Technical writing, architectural diagrams, API specs. |

**Total Investment:** ~54 Engineering Hours

---

## Quick Start

### Local Development (Node.js)

```bash
# Clone the repo
git clone https://github.com/fajlur79/ShortLink.git && cd ShortLink
# Install dependencies
npm install

# Start Redis (must be running locally)
redis-server

# Start the application
npm run dev
```

The service will be available at `http://localhost:3000` by default.

---

### Docker (Recommended)

```bash
# Build and start all services
docker compose -f docker-compose.local.yml --build -d
```

This starts:

* Express application
* Redis
* NGINX reverse proxy

All services are wired together using Docker networking.


***Note on Redis***

For local development, Redis runs as a Docker container via
docker-compose to avoid external cloud dependencies.

In production, Redis is provided by AWS ElastiCache and does not
run on EC2 instances. All application instances connect to the
centralized Redis store using the REDIS_URL environment variable.

for more details [here](docs/DevOps.md#redis-local-vs-production)

---
## Documentation Index

Detailed documentation is split by responsibility:

* [DevOps & Infrastructure](docs/DevOps.md)
* [How It Works](docs/Workflow.md)
* [API Documentation](docs/API.md)
* [Contributing Guide](CONTRIBUTING.md)
* [Security Policy](SECURITY.md)

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
---
## 👤 Author

**Fajlur**
- Email: fajlur939@proton.me
- GitHub: [@fajlur79](https://github.com/fajlur79)
- X(twitter): [@Fajlur](https://x.com/fajlur_)
