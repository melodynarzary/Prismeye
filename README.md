<div align="center">

#  PrismEye

### Real-Time Cybersecurity Tool for Detecting Cyber Attacks

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python)
![XGBoost](https://img.shields.io/badge/XGBoost-ML-FF6600?style=for-the-badge)

**A hybrid intrusion detection system that detects 10 types of cyber attacks in real time using rule-based detection and machine learning.**

</div>

---

## About

PrismEye is a self-hosted cybersecurity tool built for developers to monitor their web applications for cyber attacks in real time. It sits in front of your existing application, inspects every incoming HTTP request, and displays detected threats on a live dashboard with AI-powered remediation suggestions.

Built as a Major Project for MCA 4th Semester at **Assam Don Bosco University** during internship at **Trusnetix Technologies Pvt. Ltd., Guwahati**.

---

## Features

- 🛡️ **Rule-Based Detection** — 90+ regex rules detecting 9 attack types
- 🤖 **ML-Powered DDoS Detection** — XGBoost model trained on CIC-DDoS2019
- 📊 **Real-Time Dashboard** — Live threat feed powered by Socket.io
- 🔔 **Alert Popup** — Instant notifications when an attack is detected
- 💡 **AI Remediation** — Security suggestions via Google Gemini API
- 🌐 **Language Agnostic** — Works with any backend framework
- 🔒 **Self Hosted** — Your data stays on your server

---

## Attack Types Detected

| # | Attack Type | Detection Method |
|---|---|---|
| 1 | SQL Injection | Rule-Based |
| 2 | Cross-Site Scripting (XSS) | Rule-Based |
| 3 | Server-Side Request Forgery (SSRF) | Rule-Based |
| 4 | Command Injection | Rule-Based |
| 5 | Path Traversal | Rule-Based |
| 6 | Local File Inclusion (LFI) | Rule-Based |
| 7 | NoSQL Injection | Rule-Based |
| 8 | XML External Entity (XXE) | Rule-Based |
| 9 | CRLF Injection | Rule-Based |
| 10 | DDoS Attack | ML — XGBoost |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js, Socket.io |
| Frontend | Next.js, Material UI |
| ML Service | Python, XGBoost, Flask |
| Dataset | CIC-DDoS2019 |
| AI Suggestions | Google Gemini API |

---

## Requirements

- Node.js v18 or higher
- Python 3.8 or higher
- Git

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/melodynarzary/Prismeye.git
cd Prismeye
```

### 2. Install backend dependencies

```bash
cd prismeyebackend
npm install
```

### 3. Install ML dependencies (one time only)

```bash
cd ml
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd ../prismeyefrontend
npm install
```

### 5. Configure environment variables

Create `.env` inside `prismeyebackend/`

```env
PORT=5000
TARGET_URL=http://localhost:8080
SERVER_NAME=my-server
APP_NAME=My Web App
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prismeye
JWT_SECRET=your_long_random_secret_here
NODE_ENV=development
```

Create `.env` inside `prismeyefrontend/`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NODE_ENV=development
```

### 6. Start PrismEye

**Terminal 1 — Backend (ML service starts automatically on port 5001)**

```bash
cd prismeyebackend
npm run dev
```

**Terminal 2 — Frontend Dashboard**

```bash
cd prismeyefrontend
npm run dev
```

### 7. Open the Dashboard

```
http://localhost:3000/register
```

Create your account on first run, then use `/login` for all future visits.

---

## ML Model Results

Trained on CIC-DDoS2019 dataset using XGBoost binary classifier.

| Metric | Score |
|---|---|
| Accuracy | 92% |
| Precision | 99% |
| Recall | 89% |
| F1-Score | 94% |

---

## Academic Details

- **Project:** MCA Major Project — 4th Semester
- **University:** Assam Don Bosco University, Guwahati
- **Internship:** Trusnetix Technologies Pvt. Ltd., Guwahati
- **Batch:** 2024–2026

---

<div align="center">
Built by <a href="https://github.com/melodynarzary">Melody Queen Narzary</a>
</div>
