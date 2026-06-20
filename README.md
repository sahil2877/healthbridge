# 🏥 HealthBridge

**An integrated patient engagement & clinical management ecosystem — built on the MEAN stack.**

HealthBridge brings a **clinical console** for healthcare providers (EMR, prescriptions, billing, insurance, analytics) and a **consumer patient portal** (lab catalog, health trackers, health score) together on a single platform, secured by JWT authentication and role-based access control.

![Stack](https://img.shields.io/badge/stack-MEAN-0d9488)
![Angular](https://img.shields.io/badge/Angular-17-dd0031)
![Node](https://img.shields.io/badge/Node-Express-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-2563eb)

---

## ✨ Key Features

### Provider Console (Admin · Doctor · Staff)
- **Dashboard** — KPIs, revenue, appointment & screening breakdowns, new-patient trend (charts)
- **Patients** — registration, search, demographics
- **Appointments** — booking, status workflow, doctor & patient assignment, filters
- **Clinical Records (EMR)** — diagnoses, prescriptions, notes + **document upload**
- **Prescriptions (e-Rx)** — dynamic medicine builder + **printable prescription (PDF)**
- **Billing & Invoices** — line items, live totals, **payment recording**, printable invoice
- **Insurance** — policies + claims with a status workflow
- **Health Screening** — server-computed **BMI, risk level & recommendations**
- **Audit Logs** — automatic, tamper-evident trail of every write action (admin)

### Patient Portal (Patient)
- Personalized dashboard — greeting, wallet, **HealthScore**
- **Book lab tests** — catalog with category filters, care plans, book-by-organ
- **My Health** — health trackers (steps, sugar, weight, BP, medicine, heart rate)
- **Checkup journey** stepper & profile

### Platform-wide
- **JWT authentication** (bcrypt-hashed passwords)
- **Role-based access control** — UI gating + enforced on the API
- **Role-aware routing** — patients land on the portal, providers on the console

---

## 🧰 Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Angular 17 (standalone components, reactive forms, signals, RxJS) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Uploads | Multer (type + size limits) |

---

## 🏗️ Architecture

```
┌──────────────────────────────┐      HTTPS / REST (JWT)      ┌──────────────────────────────┐
│   Angular 17 (port 4200)     │  ─────────────────────────► │   Express API (port 5000)    │
│  • Provider Console          │                             │  Routes → Middleware → Models │
│  • Patient Portal            │  ◄───────────────────────── │  auth · role · audit · upload │
└──────────────────────────────┘         JSON                └───────────────┬──────────────┘
                                                                              │ Mongoose
                                                                  ┌───────────▼───────────┐
                                                                  │   MongoDB (local)      │
                                                                  └────────────────────────┘
```

Every request carries a `Authorization: Bearer <token>` header (added by an HTTP interceptor); the API verifies it, attaches the user, then applies role guards and writes an audit entry.

---

## 📁 Project Structure
```
healthbridge/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # User, Patient, Appointment, ClinicalRecord,
│   │                           #   Prescription, Invoice, InsurancePolicy, Claim,
│   │                           #   Screening, AuditLog
│   ├── routes/                 # auth, users, patients, appointments, records,
│   │                           #   prescriptions, invoices, insurance, analytics,
│   │                           #   screening, audit
│   ├── middleware/             # auth (JWT), role (RBAC), upload (multer), auditLogger
│   ├── uploads/                # uploaded documents (served at /uploads)
│   └── server.js               # entry point
├── frontend/
│   └── src/app/
│       ├── models/             # TypeScript interfaces
│       ├── services/           # HttpClient services (one per module)
│       ├── interceptors/       # JWT interceptor
│       ├── guards/             # auth guard
│       ├── pages/              # feature components (console + portal)
│       ├── data/               # static catalog data
│       ├── app.routes.ts       # route hierarchy
│       └── app.config.ts       # providers (router, http + interceptor)
└── docs/SRS.md                 # full Software Requirements Specification
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)
- Angular CLI (`npm install -g @angular/cli`)

### 1) Backend
```bash
cd backend
npm install
# create a .env file (see below)
npm run dev          # http://localhost:5000
```

`backend/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/healthbridge
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
```

### 2) Frontend
```bash
cd frontend
npm install
ng serve             # http://localhost:4200
```

### 3) Try it
1. Open `http://localhost:4200` → **Register**.
2. Pick a role:
   - **Admin / Doctor / Staff** → provider console (dashboard, patients, billing, …)
   - **Patient** → patient portal (lab catalog, trackers, health score)
3. Explore the modules. Role-based buttons appear/disappear based on your role.

---

## 🔐 Roles & Permissions (enforced on the API)
| Action | Admin | Doctor | Staff | Patient |
|--------|:---:|:---:|:---:|:---:|
| Manage patients | ✅ | ✅ | ✅ | own |
| Delete patient | ✅ | – | – | – |
| Prescriptions / records | ✅ | ✅ | – | view |
| Appointments | ✅ | ✅ | ✅ | own |
| Billing & insurance | ✅ | – | ✅ | view |
| Audit logs | ✅ | – | – | – |
| Patient portal | – | – | – | ✅ |

---

## 📚 API Overview
Base URL: `http://localhost:5000/api`

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login` |
| Users | `GET /users?role=` |
| Patients | `GET/POST /patients`, `GET/PUT/DELETE /patients/:id` |
| Appointments | `GET/POST /appointments`, `GET/PUT/DELETE /appointments/:id` |
| Records | `GET/POST /records`, `…/:id`, `POST /records/:id/documents` |
| Prescriptions | `GET/POST /prescriptions`, `…/:id` |
| Invoices | `GET/POST /invoices`, `…/:id`, `POST /invoices/:id/payments` |
| Insurance | `…/insurance/policies`, `…/insurance/claims` |
| Screening | `GET/POST /screening` |
| Analytics | `GET /analytics/overview` |
| Audit | `GET /audit` (admin) |

> See [`docs/SRS.md`](docs/SRS.md) for the full Software Requirements Specification — architecture, data model, all modules and the roadmap.

---

## 🗺️ Roadmap
- **Phase 1 (done):** Auth, RBAC, patients, appointments, records + uploads, screening
- **Phase 2 (done):** Prescriptions, billing, insurance, analytics, audit logs, patient portal
- **Phase 3:** Lab booking backend, teleconsultation, notifications, AI vision screening
- **Phase 4:** Multi-clinic, FHIR export, CI/CD, observability

---

## 📄 License
This project is for educational and portfolio purposes.
