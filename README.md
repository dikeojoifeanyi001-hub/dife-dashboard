# DIFE React Dashboard - Updated April 16, 2026

A professional admin dashboard for a logistics intelligence platform. This application connects to a live SaaS API to manage drivers, monitor routes, and track environmental risk scores in real time.

---

## 🚀 Live Demo

* **Dashboard:** https://dife-dashboard.pages.dev
* **Backend API:** https://dife-saas-api-production.up.railway.app

---

## 📋 Features

### 🔐 Authentication

* JWT-based login system
* Protected routes
* Automatic token handling for API requests

### 📊 Dashboard Overview

* Total Drivers
* Total Routes
* High Risk Routes (color-coded)
* Average Risk Score (formatted)

### 🚚 Driver Management

* View drivers in a clean table
* Add new drivers
* Friendly empty states

### 🗺️ Route Management

* Create routes with origin, destination, and driver
* View routes with calculated risk scores
* Color-coded risk levels:

  * Green → Low
  * Orange → Medium
  * Red → High

### ⚠️ Risk Monitoring

* Summary metrics (total, high risk, average)
* Risk-level labels and recommendations:

  * High → Immediate review
  * Medium → Monitor
  * Low → Normal

---

## 🛠️ Tech Stack

* **React 18**
* **Vite**
* **React Router DOM**
* **Axios**
* **Cloudflare Pages** (Deployment)

---

## 📁 Project Structure

```
dife-dashboard/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Drivers.jsx
│   │   ├── Routes.jsx
│   │   └── Risk.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── auth.js
│   └── App.jsx
```

---

## 🔌 API Integration

This dashboard connects to a live backend:

**Base URL:**
https://dife-saas-api-production.up.railway.app/api

### Key Endpoints

* `POST /auth/login` → Authentication
* `GET /drivers` → Fetch drivers
* `POST /drivers` → Create driver
* `GET /routes` → Fetch routes
* `POST /routes` → Create route
* `GET /risk` → Risk analysis

---

## 🎨 UI Highlights

* Clean sidebar layout with active states
* Metric cards with visual hierarchy
* Styled tables with spacing and borders
* Color-coded risk indicators
* Loading and error states
* Empty state messaging

---

## 🧪 Test Access

You can log in using:

* Email: `test@example.com`
* Password: `123456`

Or register via the API.

---

## 📊 Risk Scoring Logic

Risk scores are calculated by the backend:

```
risk_score = min((origin.length + destination.length) × 2.5, 100)
```

| Level  | Score  | Action  |
| ------ | ------ | ------- |
| Low    | 0–40   | Normal  |
| Medium | 41–70  | Monitor |
| High   | 71–100 | Review  |

---

## 🔗 Related Projects

* **DIFE SaaS API (Backend):**
  https://dife-saas-api-production.up.railway.app
  https://github.com/dikeojoifeanyi001-hub/dife-saas-api

* **DIFE Automation System:**
  Coming Soon

---

## 👨‍💻 Author

**D.O.I Henry**
GitHub: https://github.com/dikeojoifeanyi001-hub

---

## 📄 License

MIT License

---

## 🎯 What This Project Demonstrates

* Full-stack integration (frontend + live API)
* Authentication and protected routes
* Clean UI structure and data handling
* Real-world dashboard design patterns
* Deployment and production readiness

---
