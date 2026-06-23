# 🏥 HealthBridge — Complete Project Documentation
### For Interview, Viva, Resume & Placement Preparation

---

> **Document Type:** Comprehensive Project Documentation  
> **Project:** HealthBridge — Integrated Patient Engagement & Clinical Management Ecosystem  
> **Stack:** MEAN (MongoDB + Express + Angular 17 + Node.js)  
> **Author:** Sahilmiya Belim  
> **Prepared for:** B.Tech Computer Engineering — Interview & Viva Preparation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Folder Structure Analysis](#4-folder-structure-analysis)
5. [Database Documentation](#5-database-documentation)
6. [API Documentation](#6-api-documentation)
7. [Feature-by-Feature Explanation](#7-feature-by-feature-explanation)
8. [Complete User Flow](#8-complete-user-flow)
9. [Security Implementation](#9-security-implementation)
10. [Interview Preparation — 50 Questions & Answers](#10-interview-preparation--50-questions--answers)
11. [Resume Description](#11-resume-description)
12. [Elevator Pitch](#12-elevator-pitch)
13. [Project Challenges](#13-project-challenges)
14. [Future Enhancements](#14-future-enhancements)
15. [Viva Preparation Notes](#15-viva-preparation-notes)
16. [Cheat Sheet](#16-cheat-sheet)

---

## 1. Project Overview

### 1.1 Project Name

**HealthBridge — Integrated Patient Engagement & Clinical Management Ecosystem**

### 1.2 Problem Statement

In India and many parts of the world, healthcare clinics still use paper-based records or disconnected software. A patient's medical history, lab reports, prescriptions, appointments, and billing are scattered across different systems — or worse, in physical files. This creates several problems:

- **No single view** of a patient's complete medical history
- Doctors waste time searching for previous records and lab reports
- Patients cannot book lab tests or appointments online from home
- Billing and insurance claims are manual, error-prone processes
- No digital health tracking for patients to monitor their own vitals (BP, sugar, weight)
- No audit trail — you can't track who changed what and when
- Different clinics use different software, creating data silos

**HealthBridge solves all of this** by providing a single, unified web platform where:

- **Providers** (doctors, admin, staff) manage patients, appointments, clinical records (EMR), prescriptions, billing, insurance claims, screenings, and analytics — all in one dashboard
- **Patients** get a personal portal to book lab tests, track their health vitals, view prescriptions, book teleconsultations, and check their HealthScore

### 1.3 Objective

To build a full-stack healthcare management platform that:

1. Digitalizes the entire clinical workflow — from patient registration to billing
2. Provides a consumer-grade patient portal for self-service (lab booking, health tracking)
3. Implements role-based access control (admin, doctor, staff, patient)
4. Ensures data security with JWT authentication, bcrypt password hashing, and an immutable audit trail
5. Demonstrates real-world software engineering skills for placement/internship interviews

### 1.4 Target Users

| Role | Who They Are | What They Do |
|------|-------------|--------------|
| **Admin** | Clinic owner / manager | Manage users, view analytics, access audit logs, configure system |
| **Doctor** | Practicing physician | View patient history, write prescriptions, create clinical records, run health screenings |
| **Staff** | Front-desk receptionist / billing clerk | Register patients, book appointments, create invoices, manage insurance |
| **Patient** | Anyone receiving healthcare | Book lab tests, track health vitals, view prescriptions, request appointments, do teleconsultations |

### 1.5 Key Features (18 Modules)

| # | Module | Description |
|---|--------|-------------|
| 1 | **Authentication & Authorization** | JWT-based login/register with bcrypt password hashing |
| 2 | **Role-Based Access Control (RBAC)** | 4 roles with different permissions; enforced on both frontend (UI gating) and backend (API middleware) |
| 3 | **Patient Management** | Register patients with demographics (name, age, gender, blood group, contact, address) + search functionality |
| 4 | **Appointment Scheduling** | Book appointments with doctor assignment, date/time, status workflow (requested → scheduled → completed → cancelled) |
| 5 | **Clinical Records (EMR/EHR)** | Create and manage medical records per patient visit — diagnosis, prescription text, notes, and document uploads (PDFs, images, reports) |
| 6 | **Prescriptions (e-Rx)** | Dynamic medicine builder (drug name, dosage, frequency, duration, instructions) with printable/viewable prescriptions |
| 7 | **Billing & Invoices** | Itemized invoices with line items, tax, discount, payment recording (cash/card/UPI/wallet), status tracking (unpaid/partial/paid), and printable invoices |
| 8 | **Insurance Management** | Capture insurance policies and manage claims (draft → submitted → approved → rejected → paid) with amounts |
| 9 | **Health Screening Engine** | Server-computed BMI, risk score, risk level (Low/Medium/High), and personalized lifestyle recommendations based on vitals input |
| 10 | **Lab Catalog & Booking** | Patient-facing lab test catalog with category filters (Vitamins, Thyroid, Kidney, Liver, Allergy), organ-based booking, and order status tracking (booked → collected → in_lab → report_ready) |
| 11 | **Teleconsultation** | Video room with unique room IDs; status workflow (requested → in_progress → completed → cancelled); doctor post-call summary |
| 12 | **Notifications System** | In-app notification center — appointment alerts, lab status updates, consultation requests — with read/unread tracking |
| 13 | **HealthScore & Trackers** | Patient-side vitals logging (steps, sugar, weight, BP, medicine, heart rate) with a computed HealthScore (0-100) and personalized advice |
| 14 | **Analytics Dashboard** | Provider-facing KPIs — total patients, doctors, appointments, revenue (billed vs collected), screening risk breakdown, patient trend chart, recent activity |
| 15 | **Audit Logging** | Automatic, tamper-evident trail of every write action (who did what, on which entity, when, from which IP) — viewable only by admin |
| 16 | **Role-Aware Dual Portal** | Single Angular codebase serves two UI areas: Provider Console (desktop sidebar nav) + Patient Portal (bottom-tab mobile-first) |

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER (Browser)                     │
│                                                                  │
│  ┌─────────────────────┐          ┌─────────────────────────┐    │
│  │  Provider Console   │          │    Patient Portal       │    │
│  │  (Angular 17)       │          │    (Angular 17)         │    │
│  │  ├─ Dashboard       │          │    ├─ Home (HealthScore)│    │
│  │  ├─ Patients        │          │    ├─ Care (Lab Catalog)│    │
│  │  ├─ Appointments    │          │    ├─ Book (Lab Order)  │    │
│  │  ├─ Records (EMR)   │          │    ├─ Consult (Video)   │    │
│  │  ├─ Prescriptions   │          │    ├─ Appointments      │    │
│  │  ├─ Invoices        │          │    ├─ Records           │    │
│  │  ├─ Insurance       │          │    ├─ Vitals (Trackers) │    │
│  │  ├─ Screening       │          │    └─ Profile           │    │
│  │  ├─ Lab Orders      │          │                         │    │
│  │  ├─ Consultations   │          │                         │    │
│  │  ├─ Audit Logs      │          │                         │    │
│  │  └─ Notifications   │          │                         │    │
│  └──────────┬──────────┘          └────────────┬────────────┘    │
│             │                                  │                  │
│             │     Auth Interceptor adds         │                  │
│             │     "Bearer <JWT>" to every       │                  │
│             │     outgoing HTTP request         │                  │
└─────────────┼──────────────────────────────────┼──────────────────┘
              │                                  │
              │       HTTPS / REST (JSON)         │
              ▼                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SERVER LAYER (Express + Node.js)               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                  MIDDLEWARE PIPELINE                      │    │
│  │  cors → JSON parser → auditLogger → [route matched]      │    │
│  │     → auth (JWT verify) → role (RBAC check)              │    │
│  │     → route handler → response                           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌───────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐       │
│  │  /api     │  │  /api    │  │  /api     │  │  /api    │  ...  │
│  │  /auth    │  │  /patients│  │  /records │  │  /invoices│       │
│  └─────┬─────┘  └────┬─────┘  └─────┬─────┘  └────┬─────┘       │
│        │             │              │              │              │
│        ▼             ▼              ▼              ▼              │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   MONGOOSE ODM LAYER                      │    │
│  │  (14 Models: User, Patient, Appointment, Record,         │    │
│  │   Prescription, Invoice, InsurancePolicy, Claim,         │    │
│  │   Screening, LabPackage, LabOrder, Notification,         │    │
│  │   Consultation, AuditLog)                                 │    │
│  └──────────────────────────┬───────────────────────────────┘    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ Mongoose (ODM)
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (MongoDB)                       │
│                                                                  │
│  Database: healthbridge                                          │
│  Collections: users, patients, appointments, clinicalrecords,    │
│    prescriptions, invoices, insurancepolicies, claims,           │
│    screenings, labpackages, laborders, notifications,            │
│    consultations, auditlogs                                      │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Frontend Flow (Angular 17)

```
User opens browser → http://localhost:4200
│
├─ NOT LOGGED IN:
│  ├─ /login → LoginComponent (email + password form)
│  └─ /register → RegisterComponent (name + email + password + role dropdown)
│
└─ AFTER LOGIN (JWT stored in localStorage):
   │
   ├─ Role = admin / doctor / staff:
   │  └─ / → LayoutComponent (sidebar + topbar shell)
   │     ├─ /dashboard → DashboardComponent (KPIs, charts, trends)
   │     ├─ /patients → PatientListComponent (searchable table)
   │     │  ├─ /patients/new → PatientFormComponent (onboarding form)
   │     │  └─ /patients/:id/edit → PatientFormComponent (edit mode)
   │     ├─ /appointments → AppointmentListComponent (filters by status)
   │     │  ├─ /appointments/new → AppointmentFormComponent
   │     │  └─ /appointments/:id/edit → AppointmentFormComponent
   │     ├─ /records → RecordListComponent (filter by patient)
   │     │  ├─ /records/new → RecordFormComponent (diagnosis + upload)
   │     │  └─ /records/:id/edit → RecordFormComponent
   │     ├─ /prescriptions → PrescriptionListComponent
   │     │  ├─ /prescriptions/new → PrescriptionFormComponent (drug builder)
   │     │  ├─ /prescriptions/:id → PrescriptionViewComponent (printable)
   │     │  └─ /prescriptions/:id/edit → PrescriptionFormComponent
   │     ├─ /invoices → InvoiceListComponent
   │     │  ├─ /invoices/new → InvoiceFormComponent (line items builder)
   │     │  ├─ /invoices/:id → InvoiceViewComponent (print view)
   │     │  └─ /invoices/:id/edit → InvoiceFormComponent
   │     ├─ /screening → ScreeningComponent (vitals input + result)
   │     ├─ /lab-orders → LabOrdersComponent (manage orders)
   │     ├─ /consultations → ConsultationListComponent
   │     ├─ /insurance → InsuranceComponent (policies + claims tabs)
   │     │  ├─ .../policies/new → PolicyFormComponent
   │     │  └─ .../claims/new → ClaimFormComponent
   │     └─ /audit → AuditComponent (admin-only log viewer)
   │
   └─ Role = patient:
      └─ /portal → PortalLayoutComponent (top bar + content area)
         ├─ /portal/home → PortalHomeComponent (greeting, HealthScore, catalog tiles)
         ├─ /portal/care → PortalCareComponent (lab catalog with category chips)
         ├─ /portal/book → PortalBookComponent (book lab test, collection slot)
         ├─ /portal/orders → PortalOrdersComponent (order status tracker)
         ├─ /portal/consult → PortalConsultComponent (teleconsult request)
         ├─ /portal/appointments → PortalAppointmentsComponent (own appointments)
         ├─ /portal/records → PortalRecordsComponent (own clinical records)
         ├─ /portal/vitals → PortalVitalsComponent (health trackers: steps, sugar, weight, BP, HR)
         └─ /portal/profile → PortalProfileComponent (view/edit profile)
```

### 2.3 Backend Flow (Express.js)

```
Request arrives at http://localhost:5000
│
▼
server.js (entry point)
│
├─ 1. Load .env (MONGO_URI, JWT_SECRET, PORT)
├─ 2. Apply global middleware:
│     cors() → allows cross-origin requests from Angular (port 4200)
│     express.json() → parses JSON request body
│     static('/uploads') → serves uploaded documents
│     auditLogger → records write actions automatically
├─ 3. Connect to MongoDB via Mongoose
├─ 4. Mount 13 route modules under /api:
│     /auth → routes/auth.js
│     /users → routes/users.js
│     /patients → routes/patients.js
│     /appointments → routes/appointments.js
│     /records → routes/records.js
│     /prescriptions → routes/prescriptions.js
│     /invoices → routes/invoices.js
│     /insurance → routes/insurance.js
│     /lab → routes/lab.js
│     /notifications → routes/notifications.js
│     /consultations → routes/consultations.js
│     /analytics → routes/analytics.js
│     /audit → routes/audit.js
│     /screening → routes/screening.js
└─ 5. Start listening on PORT (default 5000)
```

**Inside a typical route handler:**

```
HTTP Request → Express Router → auth middleware (verify JWT)
                                 │
                                 ▼
                            role middleware (check allowed roles)
                                 │
                                 ▼
                            Route Handler (business logic)
                              - Parse req.body / req.params / req.query
                              - Query MongoDB via Mongoose models
                              - Populate referenced fields (.populate())
                              - Return JSON response
                                 │
                                 ▼
                            HTTP Response (with status code + JSON body)
```

### 2.4 Database Flow (MongoDB + Mongoose)

```
Express Route Handler
      │
      ▼
Mongoose Model (e.g., Patient.findById(...))
      │
      ├─ Validates data against Schema (name required, enum checks, etc.)
      ├─ Casts types (String, Number, Date, ObjectId, Boolean)
      ├─ Enforces ref relationships (populated on read)
      │
      ▼
MongoDB Driver (native)
      │
      ▼
MongoDB Server (mongodb://127.0.0.1:27017/healthbridge)
      │
      ├─ Stores documents in BSON format (binary JSON)
      ├─ Executes queries with indexes
      ├─ Returns results
      │
      ▼
Response flows back: MongoDB → Mongoose → Route Handler → HTTP JSON Response
```

### 2.5 API Communication Flow

```
┌──────────────┐                              ┌──────────────┐
│  Angular 17   │     HTTP Request              │  Express API │
│  (port 4200)  │ ──────────────────────────►  │  (port 5000) │
│              │                                │              │
│  1. Service   │  POST /api/auth/login         │  Middleware: │
│     calls     │  { email, password }          │  - cors      │
│     http      │                                │  - json      │
│     .post()   │  ◄────────────────────────── │  - audit     │
│              │  { token, user: { id, name,   │              │
│  2. Intercept-│    email, role } }           │  Route:      │
│     or adds   │                                │  - auth JWT  │
│     Bearer    │  Next request:                │  - role RBAC │
│     token     │  GET /api/patients            │  - handler   │
│              │  Authorization: Bearer <JWT>   │              │
│  3. Component │ ──────────────────────────►  │  Mongoose →  │
│     subscribes│                                │  MongoDB     │
│     to data   │  ◄────────────────────────── │              │
│              │  [ { name, age, ... }, ...]   │  JSON res    │
└──────────────┘                              └──────────────┘
```

### 2.6 Authentication Flow

```
REGISTER FLOW:
─────────────
User fills form { name, email, password, role }
  │
  ▼
POST /api/auth/register
  │
  ├─ Check: Does email already exist? → Yes → Return 400 error
  │
  ├─ Generate salt (bcrypt.genSalt(10))
  ├─ Hash password (bcrypt.hash(password, salt))
  ├─ Create User in MongoDB { name, email, password: hashed, role }
  ├─ Create JWT: jwt.sign({ id, name, role }, JWT_SECRET, { expiresIn: '7d' })
  │
  └─ Return: { token: "<JWT>", user: { id, name, email, role } }
     │
     ▼
  Frontend stores token in localStorage ('hb_token')
  Frontend stores user in localStorage ('hb_user')
  AuthService.currentUser signal updated → UI reacts


LOGIN FLOW:
──────────
User fills form { email, password }
  │
  ▼
POST /api/auth/login
  │
  ├─ Find user by email → Not found → Return 400 "Invalid credentials"
  ├─ Compare password: bcrypt.compare(plainPassword, hashedPassword)
  │  → No match → Return 400 "Invalid credentials"
  ├─ Create JWT (same as above)
  │
  └─ Return: { token: "<JWT>", user: { id, name, email, role } }
     │
     ▼
  Same localStorage + signal update as register


EVERY SUBSEQUENT REQUEST:
─────────────────────────
Angular Auth Interceptor reads token from localStorage
  │
  ▼
Adds header: Authorization: Bearer <JWT>
  │
  ▼
Express auth middleware:
  ├─ Read header, extract token
  ├─ jwt.verify(token, JWT_SECRET)
  ├─ If valid → req.user = { id, name, role } → next()
  └─ If invalid/expired → 401 "Token is not valid"
```

### 2.7 Role-Based Access Control (RBAC) Flow

```
User makes request to a protected endpoint
  │
  ▼
auth middleware runs first
  │
  ├─ Verifies JWT → sets req.user = { id, name, role }
  └─ Calls next()
     │
     ▼
role middleware runs next (e.g., role('admin', 'doctor'))
  │
  ├─ Checks: allowedRoles.includes(req.user.role)?
  │
  ├─ YES → next() → route handler executes
  │
  └─ NO → 403 "Access denied: insufficient permissions"

EXAMPLES:
  DELETE /api/patients/:id → role('admin')
    → Only admin can delete patients

  POST /api/prescriptions → role('admin', 'doctor')
    → Only admin and doctor can create prescriptions

  GET /api/patients/me → NO role guard
    → Any logged-in user (including patient) can access

  /portal/* routes → roleGuard('patient')
    → Only patients see the patient portal

  /dashboard route → roleGuard('admin', 'doctor', 'staff')
    → Only providers see the console
```

### 2.8 Permission Matrix (Who Can Do What)

```
┌────────────────────────────────┬───────┬────────┬───────┬─────────┐
│           ACTION               │ Admin │ Doctor │ Staff │ Patient │
├────────────────────────────────┼───────┼────────┼───────┼─────────┤
│ Register/Login                 │  ✅   │   ✅   │  ✅   │   ✅    │
│ View Dashboard & Analytics     │  ✅   │   ✅   │  ✅   │   ❌    │
│ Manage Users (list)            │  ✅   │   ✅   │  ✅   │   ❌    │
│ Create Patient                 │  ✅   │   ✅   │  ✅   │   ❌    │
│ View All Patients              │  ✅   │   ✅   │  ✅   │   ❌    │
│ Edit Patient                   │  ✅   │   ✅   │  ✅   │   ❌    │
│ Delete Patient                 │  ✅   │   ❌   │  ❌   │   ❌    │
│ Book Appointment (provider)    │  ✅   │   ✅   │  ✅   │   ❌    │
│ Request Appointment (patient)  │  ❌   │   ❌   │  ❌   │   ✅    │
│ View Own Appointments          │  ✅   │   ✅   │  ✅   │   ✅    │
│ Create Clinical Record         │  ✅   │   ✅   │  ✅   │   ❌    │
│ Upload Documents               │  ✅   │   ✅   │  ✅   │   ❌    │
│ View Own Records               │  ✅   │   ✅   │  ✅   │   ✅    │
│ Create Prescription            │  ✅   │   ✅   │   ❌   │   ❌    │
│ View Own Prescriptions         │  ✅   │   ✅   │  ✅   │   ✅    │
│ Create Invoice                 │  ✅   │   ❌   │  ✅   │   ❌    │
│ Record Payment                 │  ✅   │   ❌   │  ✅   │   ❌    │
│ View Own Invoices              │  ✅   │   ✅   │  ✅   │   ✅    │
│ Manage Insurance Policies      │  ✅   │   ✅   │  ✅   │   ❌    │
│ Manage Insurance Claims        │  ✅   │   ❌   │  ✅   │   ❌    │
│ Run Health Screening           │  ✅   │   ✅   │  ✅   │   ❌    │
│ View Screening Results         │  ✅   │   ✅   │  ✅   │   ❌    │
│ Manage Lab Orders (status)     │  ✅   │   ✅   │  ✅   │   ❌    │
│ Book Lab Test (patient)        │  ❌   │   ❌   │  ❌   │   ✅    │
│ View Own Lab Orders            │  ✅   │   ✅   │  ✅   │   ✅    │
│ Teleconsultation               │  ✅   │   ✅   │  ✅   │   ✅    │
│ View Audit Logs                │  ✅   │   ❌   │  ❌   │   ❌    │
│ Receive Notifications          │  ✅   │   ✅   │  ✅   │   ✅    │
│ Use Patient Portal             │  ❌   │   ❌   │  ❌   │   ✅    │
│ Use HealthScore & Trackers     │  ❌   │   ❌   │  ❌   │   ✅    │
└────────────────────────────────┴───────┴────────┴───────┴─────────┘
```

---

## 3. Technology Stack

### 3.1 Complete Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | Angular | 17 | Build single-page application (SPA) with component-based architecture |
| **Frontend Language** | TypeScript | ~5.3 | Type-safe JavaScript, better IDE support, catches errors at compile time |
| **Backend Runtime** | Node.js | 18+ | JavaScript runtime for server-side execution |
| **Backend Framework** | Express.js | 5.2 | Lightweight web framework for building REST APIs |
| **Database** | MongoDB | 7.x | NoSQL document database — flexible schema for healthcare data |
| **ODM Library** | Mongoose | 9.7 | Object Data Modeling — defines schemas, validates data, manages relationships |
| **Authentication** | JWT (jsonwebtoken) | 9.0 | Stateless token-based authentication — no server-side session storage |
| **Password Hashing** | bcryptjs | 3.0 | Industry-standard password hashing with salt — never stores plain-text passwords |
| **File Upload** | Multer | 2.2 | Handles multipart/form-data file uploads with type and size limits |
| **Cross-Origin** | CORS | 2.8 | Allows Angular (port 4200) to call the backend API (port 5000) |
| **Environment Config** | dotenv | 17.4 | Loads environment variables from .env file (MONGO_URI, JWT_SECRET, PORT) |
| **Dev Server** | nodemon | 3.1 | Auto-restarts the backend server on file changes during development |
| **Frontend Dev Server** | Angular CLI | 17 | Development server with hot-reload, build tooling, and scaffolding |
| **HTTP Client** | Angular HttpClient | - | Built-in Angular service for making HTTP requests with Observable-based API |
| **Reactive State** | Angular Signals | - | Fine-grained reactivity — used for currentUser and health vitals state |
| **Forms** | Angular Reactive Forms | - | Model-driven forms with built-in validation (Validators.required, etc.) |
| **Routing** | Angular Router | - | Client-side routing with guards (authGuard, roleGuard) and lazy loading |
| **Styling** | CSS3 | - | Custom CSS with CSS variables for theming (teal/green clinical palette) |

### 3.2 Why Each Technology Was Chosen

#### Frontend: Angular 17
- **Why not React?** Angular provides everything out-of-the-box: routing, forms, HTTP client, guards, interceptors. React requires adding many third-party libraries. For a full-stack healthcare project with complex forms and role-based routing, Angular's batteries-included approach is more productive.
- **Why not plain HTML/JS?** A modern SPA (Single Page Application) feels like a native app — no page reloads. Angular's component model makes the code reusable and maintainable.
- **Standalone components:** Angular 17 supports standalone components (no NgModules needed) — cleaner, modern code.

#### Backend: Node.js + Express
- **Why Node.js?** JavaScript on both frontend and backend = one language across the stack. This means faster development, easier debugging, and the same JSON format throughout.
- **Why Express?** Lightweight, minimal, unopinionated. It doesn't force a specific project structure. Perfect for REST APIs. Huge ecosystem of middleware.
- **Why not Django/Spring Boot?** Those are heavier frameworks in Python/Java. For a MEAN stack project, Node+Express is the natural choice — fast to build, easy to understand for beginners.

#### Database: MongoDB + Mongoose
- **Why MongoDB?** Healthcare data is semi-structured — a patient record has different fields than a prescription or an invoice. MongoDB's flexible document model fits this perfectly. No need for complex JOINs across 20+ tables.
- **Why not SQL (MySQL/PostgreSQL)?** SQL would require many tables with foreign keys. MongoDB lets you embed related data (e.g., invoice items inside the invoice document) or reference other collections (ObjectId refs with `.populate()`).
- **Why Mongoose?** Adds schema validation (required fields, enum values, type checking) on top of MongoDB's flexibility. Manages relationships (ref + populate). Middleware hooks.

#### Authentication: JWT + bcrypt
- **Why JWT?** Stateless — the server doesn't need to store sessions. The token contains the user's id, name, and role. Horizontally scalable (any server can verify the token).
- **Why bcrypt?** Industry standard for password hashing. Uses salt (random data added before hashing) to prevent rainbow table attacks. 10 salt rounds = 2^10 iterations — computationally expensive to brute-force.

---

## 4. Folder Structure Analysis

### 4.1 Complete Project Structure

```
healthbridge/
│
├── README.md                          # Project overview, setup instructions, API summary
├── .gitignore                         # Files/folders excluded from git
│
├── docs/
│   └── SRS.md                         # Software Requirements Specification (65-page detailed document)
│
├── backend/                           # Node.js + Express API server
│   ├── package.json                   # Backend dependencies (express, mongoose, bcryptjs, jwt, multer, cors, dotenv)
│   ├── package-lock.json              # Exact dependency versions locked
│   ├── server.js                      # 🚀 ENTRY POINT: Express app setup, middleware, route mounting, DB connect, listen
│   ├── .env                           # Environment variables (MONGO_URI, JWT_SECRET, PORT) — NOT committed to git
│   │
│   ├── config/
│   │   └── db.js                      # MongoDB connection function using Mongoose — connects & handles errors
│   │
│   ├── models/                        # Mongoose schemas (database layer) — 14 files
│   │   ├── User.js                    # name, email (unique), password (hashed), role (admin|doctor|staff|patient)
│   │   ├── Patient.js                 # name, age, gender, phone, email, address, bloodGroup, user(ref), onboardedBy(ref)
│   │   ├── Appointment.js             # patient(ref), doctor(ref), date, reason, notes, status, bookedBy(ref)
│   │   ├── ClinicalRecord.js          # patient(ref), doctor(ref), visitDate, diagnosis, prescription, notes, documents[], createdBy(ref)
│   │   ├── Prescription.js            # patient(ref), doctor(ref), diagnosis, items[{drugName, dosage, frequency, durationDays, instructions}], notes, status, createdBy(ref)
│   │   ├── Invoice.js                 # invoiceNumber, patient(ref), items[], payments[], subtotal, tax, discount, total, amountPaid, status, dueDate, createdBy(ref)
│   │   ├── InsurancePolicy.js         # patient(ref), payerName, policyNumber, holderName, coverageAmount, validFrom, validTo, notes, createdBy(ref)
│   │   ├── Claim.js                   # claimNumber, policy(ref), patient(ref), invoice(ref), amountClaimed, amountApproved, preAuthNo, notes, status, createdBy(ref)
│   │   ├── Screening.js               # patient(ref), heightCm, weightKg, systolic, diastolic, smoker, diabetic, bmi, bmiCategory, riskScore, riskLevel, recommendations[], screenedBy(ref)
│   │   ├── LabPackage.js              # name, tests, price, mrp, category, isActive
│   │   ├── LabOrder.js                # orderNumber, bookedBy(ref), patient(ref), contactName, contactPhone, items[], total, collectionAddress, collectionSlot, status, reportUrl
│   │   ├── Notification.js            # user(ref), type, title, body, link, read
│   │   ├── Consultation.js            # requestedBy(ref), doctor(ref), patient(ref), reason, roomId, status, summary, startedAt, endedAt
│   │   └── AuditLog.js                # actor{id, name, role}, action, entity, entityId, method, path, statusCode, ip, at
│   │
│   ├── routes/                        # API route handlers — 13 files
│   │   ├── auth.js                    # POST /register, POST /login
│   │   ├── users.js                   # GET / (list users, filter by role)
│   │   ├── patients.js                # GET /me, POST /, GET /?search=, GET /:id, PUT /:id, DELETE /:id
│   │   ├── appointments.js            # POST /, GET /?status=&patient=&doctor=, GET /:id, PUT /:id, DELETE /:id
│   │   ├── records.js                 # POST /, GET /?patient=, GET /:id, PUT /:id, DELETE /:id, POST /:id/documents
│   │   ├── prescriptions.js           # POST /, GET /?patient=, GET /:id, PUT /:id, DELETE /:id
│   │   ├── invoices.js                # POST /, GET /?patient=&status=, GET /:id, PUT /:id, DELETE /:id, POST /:id/payments
│   │   ├── insurance.js               # Policies CRUD + Claims CRUD
│   │   ├── lab.js                     # GET /packages?category=, POST /orders, GET /orders?status=, GET /orders/:id, PATCH /orders/:id/status
│   │   ├── notifications.js           # GET /, GET /unread-count, PATCH /:id/read, PATCH /read-all
│   │   ├── consultations.js           # GET /doctors, POST /, GET /, GET /:id, PATCH /:id/status, PUT /:id
│   │   ├── analytics.js               # GET /overview (KPIs, revenue, trends, recent activity)
│   │   ├── audit.js                   # GET /?entity=&action=&limit= (admin only)
│   │   └── screening.js               # POST / (compute BMI/risk), GET /?patient=, GET /:id
│   │
│   ├── middleware/                     # Request interceptors — 4 files
│   │   ├── auth.js                    # JWT verification: extracts Bearer token, verifies, sets req.user
│   │   ├── role.js                    # RBAC guard: checks req.user.role against allowed roles
│   │   ├── upload.js                  # Multer config: file destination, naming, type filter (pdf/jpg/png/doc), 5MB limit
│   │   └── auditLogger.js             # Auto-logs every successful write request (POST/PUT/PATCH/DELETE) to AuditLog
│   │
│   ├── utils/                         # Utility helpers — 2 files
│   │   ├── notify.js                  # Creates Notification documents — fires on appointments, lab status, consultations
│   │   └── selfPatient.js             # Resolves/creates the Patient record for a logged-in patient user (bridge between User and Patient)
│   │
│   ├── seed/
│   │   └── seedLabPackages.js         # Seeds the lab catalog with initial data
│   │
│   └── uploads/                       # Uploaded documents stored here (served at /uploads URL)
│       └── .gitkeep                   # Keeps the empty folder in git
│
├── frontend/                          # Angular 17 application
│   ├── package.json                   # Frontend dependencies (@angular/*, rxjs, tslib, zone.js)
│   ├── angular.json                   # Angular CLI project configuration
│   ├── tsconfig.json                  # TypeScript configuration (strict mode)
│   ├── tsconfig.app.json              # App-specific TypeScript settings
│   ├── tsconfig.spec.json             # Test-specific TypeScript settings
│   ├── .editorconfig                  # Consistent code formatting across editors
│   │
│   └── src/
│       ├── index.html                 # Single HTML page — the Angular app mounts here
│       ├── main.ts                    # Bootstrap entry point: bootstraps AppComponent
│       ├── styles.css                 # Global CSS styles (teal/clinical theme, CSS variables)
│       ├── favicon.ico                # Browser tab icon
│       │
│       └── app/
│           ├── app.component.ts       # Root component (shell for the entire app)
│           ├── app.config.ts          # 🎯 APP CONFIG: provides router + HTTP client with auth interceptor
│           ├── app.routes.ts          # 🗺️ ROUTE DEFINITIONS: all routes, guards, lazy loading
│           │
│           ├── models/                # TypeScript interfaces — 14 files
│           │   ├── user.model.ts       # User, AuthResponse interfaces
│           │   ├── patient.model.ts    # Patient interface
│           │   ├── appointment.model.ts# Appointment interface
│           │   ├── record.model.ts     # ClinicalRecord interface
│           │   ├── prescription.model.ts# Prescription interface
│           │   ├── invoice.model.ts    # Invoice, InvoiceItem, Payment interfaces
│           │   ├── insurance.model.ts  # InsurancePolicy, Claim interfaces
│           │   ├── lab.model.ts        # LabPackage, LabOrder interfaces
│           │   ├── screening.model.ts  # Screening interface
│           │   ├── notification.model.ts# Notification interface
│           │   ├── consultation.model.ts# Consultation interface
│           │   ├── analytics.model.ts  # AnalyticsOverview interface
│           │   └── audit.model.ts      # AuditLog interface
│           │
│           ├── services/              # HTTP + business logic services — 15 files
│           │   ├── auth.service.ts     # Login, register, logout, token management, currentUser signal
│           │   ├── user.service.ts     # Get users list (for doctor dropdowns)
│           │   ├── patient.service.ts  # Patient CRUD + search
│           │   ├── appointment.service.ts # Appointment CRUD + filtering
│           │   ├── record.service.ts   # Clinical record CRUD + document upload
│           │   ├── prescription.service.ts # Prescription CRUD
│           │   ├── invoice.service.ts  # Invoice CRUD + payment recording
│           │   ├── insurance.service.ts # Policy + Claim CRUD
│           │   ├── lab.service.ts      # Lab catalog + order management
│           │   ├── screening.service.ts # Screening CRUD
│           │   ├── consultation.service.ts # Consultation + video room management
│           │   ├── notification.service.ts # Notifications + unread count
│           │   ├── analytics.service.ts # Dashboard overview data
│           │   ├── audit.service.ts    # Audit log queries
│           │   ├── health-score.service.ts # Vitals tracking + HealthScore computation
│           │   └── theme.service.ts    # Dark/light theme toggle
│           │
│           ├── guards/                # Route protection — 2 files
│           │   ├── auth.guard.ts       # Redirects to /login if not logged in
│           │   └── role.guard.ts       # Redirects based on role (patient → /portal, provider → /dashboard, unauthorized → /login)
│           │
│           ├── interceptors/          # HTTP interceptors — 1 file
│           │   └── auth.interceptor.ts # Adds "Authorization: Bearer <token>" header to every outgoing request
│           │
│           ├── data/                  # Static data for UI
│           │   └── catalog.ts          # Lab packages catalog, categories, health trackers, organ tests, service tiles, care plans, checkup journey steps
│           │
│           ├── shared/                # Reusable UI components
│           │   └── notification-bell.component.ts # Notification bell with unread count badge + dropdown list
│           │
│           └── pages/                 # 🖥️ All page components — organized by feature
│               ├── login/             # Login page (email + password)
│               ├── register/          # Register page (name + email + password + role)
│               ├── layout/            # Provider Console layout (sidebar navigation + top bar + router outlet)
│               ├── dashboard/         # Analytics dashboard (KPI cards, charts, revenue, trends, recent activity)
│               ├── patient-list/      # Patients table with search
│               ├── patient-form/      # Patient onboarding/edit form (demographics, blood group, contact)
│               ├── appointment-list/  # Appointments table with filters (status, patient, doctor)
│               ├── appointment-form/  # Appointment booking form (patient, doctor, date, reason)
│               ├── record-list/       # Clinical records table with filters
│               ├── record-form/       # Clinical record form (diagnosis, prescription text, notes + document upload)
│               ├── prescription-list/ # Prescriptions table with filters
│               ├── prescription-form/ # Prescription builder (dynamic drug lines: name, dosage, frequency, duration, instructions)
│               ├── prescription-view/ # Printable prescription detail view
│               ├── invoice-list/      # Invoices table with status badges
│               ├── invoice-form/      # Invoice builder (dynamic line items + tax/discount)
│               ├── invoice-view/      # Printable invoice detail with payment history
│               ├── screening/         # Health screening form (vitals input: height, weight, BP, smoker, diabetic) + computed results
│               ├── lab-orders/        # Lab orders management (view all, update status)
│               ├── consultations/     # Consultation list (view all for providers, own for patients)
│               ├── insurance/         # Insurance policies + claims (PolicyForm, ClaimForm components)
│               ├── room/              # Embedded video room for teleconsultation
│               ├── audit/             # Audit log viewer (admin only — filters by entity and action)
│               └── portal/            # 🏠 Patient Portal (9 components)
│                   ├── portal-layout/    # Portal shell (top bar + content area)
│                   ├── portal-home/      # Greeting + HealthScore + service tiles + catalog preview
│                   ├── portal-care/      # Lab catalog with category chips + organ-based browsing
│                   ├── portal-book/      # Lab test booking with collection slot picker
│                   ├── portal-orders/     # Order status tracker (stepper: booked → collected → in_lab → report_ready)
│                   ├── portal-consult/    # Request teleconsultation with doctor
│                   ├── portal-appointments/# View own appointments, request new
│                   ├── portal-records/    # View own clinical records
│                   ├── portal-vitals/     # Health trackers (steps, sugar, weight, BP, medicine, heart rate) + input
│                   └── portal-profile/    # View/edit own patient profile
```

### 4.2 Explanation of Key Files

#### Backend Key Files

| File | Why It's Important |
|------|-------------------|
| `server.js` | The entry point — wires up middleware, routes, and the database connection. Everything starts here. |
| `config/db.js` | MongoDB connection using Mongoose. If this fails, the server exits — no point running without the database. |
| `middleware/auth.js` | The heart of security. Every protected request passes through this. It verifies the JWT token and attaches `req.user`. Without this, there's no authentication. |
| `middleware/role.js` | RBAC enforcement. Takes allowed roles as parameters and blocks unauthorized access. Simple but powerful — 4 lines of logic that secure the entire system. |
| `middleware/auditLogger.js` | Automatic compliance trail. Listens for the response `finish` event and logs every write action. Runs silently — failures never break the request. |
| `middleware/upload.js` | Multer configuration. Controls where files go, how they're named, what types are allowed (pdf/jpg/png/doc), and the max size (5MB). |
| `utils/notify.js` | Notification helper. Called whenever something happens (appointment booked, lab status changed, consultation requested). Creates a Notification document silently. |
| `utils/selfPatient.js` | Bridge between a patient's User account and their clinical Patient record. When a patient logs in, this resolves or creates their linked Patient record. |

#### Frontend Key Files

| File | Why It's Important |
|------|-------------------|
| `app.config.ts` | Application bootstrap configuration. Provides the router and HTTP client with the auth interceptor. |
| `app.routes.ts` | Complete route map. Defines public routes (/login, /register), provider routes (with auth+role guards), patient portal routes, and the fallback. |
| `auth.service.ts` | Authentication business logic. Manages login/register API calls, localStorage persistence, and the reactive `currentUser` signal that the entire app reads. |
| `auth.interceptor.ts` | HTTP interceptor. Automatically attaches the JWT token to every outgoing request. Without this, every service call would need to manually add the header. |
| `auth.guard.ts` | Route guard. Blocks unauthenticated users from protected routes and redirects to login. |
| `role.guard.ts` | Role guard. Routes patients to the portal, providers to the console. Blocks wrong-role access. |
| `health-score.service.ts` | Computes a real HealthScore from patient vitals. Tracks 6 metrics (steps, sugar, weight, BP, medicine, heart rate), scores each, averages them. |
| `data/catalog.ts` | Lab test catalog (8 packages with prices), health tracker definitions, organ-based tests, care plans, and the checkup journey stepper data. |

---

## 5. Database Documentation

### 5.1 All Collections (14 Total)

#### 1. `users`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Full name of the user |
| `email` | String | Yes (unique) | Email address — used for login |
| `password` | String | Yes | bcrypt-hashed password (never stored in plain text) |
| `role` | String | Yes | One of: `admin`, `doctor`, `staff`, `patient` |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

#### 2. `patients`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Patient's full name |
| `age` | Number | No | Patient's age |
| `gender` | String | No | `Male`, `Female`, `Other` |
| `phone` | String | No | Contact phone number |
| `email` | String | No | Email address |
| `address` | String | No | Physical address |
| `bloodGroup` | String | No | `A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`, `Unknown` |
| `user` | ObjectId → User | No | Links to the user account (for patient portal) |
| `onboardedBy` | ObjectId → User | No | Who registered this patient |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 3. `appointments`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Yes | Which patient |
| `doctor` | ObjectId → User | Yes | Which doctor |
| `date` | Date | Yes | Appointment date and time |
| `reason` | String | Yes | Reason for visit (e.g., "Fever checkup") |
| `notes` | String | No | Doctor's notes |
| `status` | String | Yes | `requested`, `scheduled`, `completed`, `cancelled` |
| `bookedBy` | ObjectId → User | No | Who booked the appointment |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 4. `clinicalrecords`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Yes | Which patient |
| `doctor` | ObjectId → User | Yes | Which doctor |
| `visitDate` | Date | Yes | When the visit happened |
| `diagnosis` | String | Yes | Illness/diagnosis |
| `prescription` | String | No | Medication details (text) |
| `notes` | String | No | Extra clinical notes |
| `documents` | Array | No | Uploaded files: `[{fileName, originalName, url, uploadedAt}]` |
| `createdBy` | ObjectId → User | No | Who created the record |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 5. `prescriptions`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Yes | Which patient |
| `doctor` | ObjectId → User | Yes | Which doctor prescribed |
| `diagnosis` | String | No | Contextual diagnosis |
| `items` | Array | Yes | Medications: `[{drugName, dosage, frequency, durationDays, instructions}]` |
| `notes` | String | No | Advice/follow-up |
| `status` | String | Yes | `active`, `completed`, `cancelled` |
| `createdBy` | ObjectId → User | No | Who created the prescription |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 6. `invoices`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `invoiceNumber` | String | Yes (unique) | Auto-generated: `INV-<timestamp>` |
| `patient` | ObjectId → Patient | Yes | Which patient |
| `items` | Array | Yes | Line items: `[{description, qty, unitPrice, amount, sourceType}]` |
| `payments` | Array | No | Recorded payments: `[{amount, method, reference, paidAt, recordedBy}]` |
| `subtotal` | Number | Yes | Sum of all item amounts |
| `tax` | Number | Yes | Tax amount |
| `discount` | Number | Yes | Discount amount |
| `total` | Number | Yes | subtotal + tax - discount |
| `amountPaid` | Number | Yes | Sum of all payment amounts |
| `status` | String | Yes | `unpaid`, `partial`, `paid` (auto-computed) |
| `dueDate` | Date | No | Payment due date |
| `notes` | String | No | Additional notes |
| `createdBy` | ObjectId → User | No | Who created the invoice |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 7. `insurancepolicies`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Yes | Policy holder |
| `payerName` | String | Yes | Insurance company name |
| `policyNumber` | String | Yes | Policy number |
| `holderName` | String | No | Name on the policy |
| `coverageAmount` | Number | No | Total coverage (₹) |
| `validFrom` | Date | No | Policy start date |
| `validTo` | Date | No | Policy end date |
| `notes` | String | No | Additional notes |
| `createdBy` | ObjectId → User | No | Who created the policy |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 8. `claims`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `claimNumber` | String | Yes (unique) | Auto-generated: `CLM-<timestamp>` |
| `policy` | ObjectId → Policy | Yes | Linked insurance policy |
| `patient` | ObjectId → Patient | Yes | Patient filing the claim |
| `invoice` | ObjectId → Invoice | No | Linked invoice |
| `amountClaimed` | Number | Yes | Amount being claimed |
| `amountApproved` | Number | No | Approved amount |
| `preAuthNo` | String | No | Pre-authorization number |
| `notes` | String | No | Notes |
| `status` | String | Yes | `draft`, `submitted`, `approved`, `rejected`, `paid` |
| `createdBy` | ObjectId → User | No | Who created the claim |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 9. `screenings`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Yes | Screened patient |
| `heightCm` | Number | Yes | Height in centimeters |
| `weightKg` | Number | Yes | Weight in kilograms |
| `systolic` | Number | No | Upper BP reading |
| `diastolic` | Number | No | Lower BP reading |
| `smoker` | Boolean | No | Smoking status |
| `diabetic` | Boolean | No | Diabetes status |
| `bmi` | Number | Auto | Computed: weight / height² |
| `bmiCategory` | String | Auto | `Underweight`, `Normal`, `Overweight`, `Obese` |
| `riskScore` | Number | Auto | Computed risk score |
| `riskLevel` | String | Auto | `Low`, `Medium`, `High` |
| `recommendations` | Array | Auto | Lifestyle recommendations |
| `screenedBy` | ObjectId → User | No | Who performed screening |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 10. `labpackages`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Package name |
| `tests` | Number | No | Number of tests included |
| `price` | Number | Yes | Offer price (₹) |
| `mrp` | Number | No | Original/strikethrough price |
| `category` | String | No | `Popular`, `Vitamins`, `Thyroid`, `Kidney`, `Liver`, `Allergy` |
| `isActive` | Boolean | No | Whether visible in catalog |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 11. `laborders`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderNumber` | String | Yes (unique) | Auto-generated: `LAB-<timestamp>` |
| `bookedBy` | ObjectId → User | Yes | Who placed the order |
| `patient` | ObjectId → Patient | No | Clinical patient link (provider booking) |
| `contactName` | String | No | Contact person name |
| `contactPhone` | String | No | Contact phone number |
| `items` | Array | Yes | Ordered tests: `[{name, price}]` |
| `total` | Number | Auto | Sum of item prices |
| `collectionAddress` | String | No | Home collection address |
| `collectionSlot` | String | No | Preferred time slot |
| `status` | String | Yes | `booked`, `collected`, `in_lab`, `report_ready`, `cancelled` |
| `reportUrl` | String | No | URL to the uploaded report |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 12. `notifications`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user` | ObjectId → User | Yes | Recipient user |
| `type` | String | No | `appointment`, `lab`, `invoice`, `consult`, `info` |
| `title` | String | Yes | Notification title |
| `body` | String | No | Notification message |
| `link` | String | No | In-app route to open on click |
| `read` | Boolean | No | Whether read (default: false) |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 13. `consultations`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requestedBy` | ObjectId → User | Yes | Who requested (usually patient) |
| `doctor` | ObjectId → User | Yes | Assigned doctor |
| `patient` | ObjectId → Patient | No | Clinical patient link |
| `reason` | String | No | Reason for consultation |
| `roomId` | String | Yes | Unique video room identifier |
| `status` | String | Yes | `requested`, `in_progress`, `completed`, `cancelled` |
| `summary` | String | No | Doctor's post-call notes |
| `startedAt` | Date | No | When call started |
| `endedAt` | Date | No | When call ended |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

#### 14. `auditlogs`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actor` | Object | No | `{id (ref→User), name, role}` — snapshot of who performed the action |
| `action` | String | No | `create`, `update`, `delete` |
| `entity` | String | No | Which collection: `patients`, `appointments`, `invoices`, etc. |
| `entityId` | String | No | MongoDB ObjectId of the affected document |
| `method` | String | No | HTTP method: `POST`, `PUT`, `PATCH`, `DELETE` |
| `path` | String | No | API path: e.g., `/api/patients/abc123` |
| `statusCode` | Number | No | HTTP response status code |
| `ip` | String | No | IP address of the requester |
| `at` | Date | Yes | When the action happened |

### 5.2 Entity Relationship Diagram (Text Format)

```
┌──────────┐         ┌───────────────┐
│   User   │         │   Patient     │
│          │────────►│               │
│ _id      │  user   │ _id           │
│ name     │ (opt)   │ name          │
│ email    │         │ age, gender   │
│ password │◄────────│ phone, email  │
│ role     │onboarded│ bloodGroup    │
└────┬─────┘   By    │ user (→User)  │
     │               └───────┬───────┘
     │                       │
     │         ┌─────────────┼─────────────┬──────────────┬──────────────┐
     │         │             │             │              │              │
     │    ┌────▼────┐  ┌─────▼─────┐ ┌─────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
     │    │Appoint- │  │Clinical   │ │Prescrip-   │ │Invoice   │ │Screening   │
     │    │ment     │  │Record     │ │tion        │ │          │ │            │
     │    │         │  │           │ │            │ │          │ │            │
     ├───►│patient  │  │patient    │ │patient     │ │patient   │ │patient     │
     │    │doctor   │  │doctor     │ │doctor      │ │items[]   │ │heightCm    │
     │    │date     │  │visitDate  │ │items[]     │ │payments[]│ │weightKg    │
     │    │status   │  │diagnosis  │ │status      │ │total     │ │bmi (auto)  │
     │    │bookedBy │  │documents[]│ │createdBy   │ │status    │ │riskLevel   │
     │    └─────────┘  │createdBy  │ └────────────┘ │createdBy │ │screenedBy  │
     │                 └───────────┘                └──────────┘ └────────────┘
     │
     │    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
     │    │InsurancePolicy│   │    Claim     │    │ Consultation │
     │    │              │    │              │    │              │
     │    │patient       │◄───│policy        │    │requestedBy   │
     ├───►│payerName     │    │patient       │    │doctor        │
     │    │policyNumber  │    │amountClaimed │    │patient (opt) │
     │    │coverageAmt   │    │status        │    │roomId        │
     │    │createdBy     │    │createdBy     │    │status        │
     │    └──────────────┘    └──────────────┘    └──────────────┘
     │
     │    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
     │    │  LabOrder    │    │ Notification │    │  AuditLog    │
     ├───►│              │    │              │    │              │
     │    │bookedBy      │    │user          │    │actor {id,    │
     │    │patient (opt) │    │type          │    │  name, role} │
     │    │items[]       │    │title         │    │action        │
     │    │total         │    │body          │    │entity        │
     │    │status        │    │read          │    │entityId      │
     │    └──────────────┘    └──────────────┘    └──────────────┘
     │
     │    ┌──────────────┐
     │    │ LabPackage   │ (standalone — no refs)
     │    │              │
     │    │ name         │
     │    │ tests        │
     │    │ price        │
     │    │ category     │
     │    └──────────────┘
```

### 5.3 Key Relationships

| Relationship | Type | How It Works |
|-------------|------|--------------|
| User → Patient | One-to-One (optional) | A patient user account can be linked to one clinical Patient record via `patient.user` |
| User → Patient (onboardedBy) | One-to-Many | A staff/doctor/admin can register many patients |
| Patient → Appointment | One-to-Many | One patient can have many appointments |
| User (Doctor) → Appointment | One-to-Many | One doctor can have many appointments |
| Patient → ClinicalRecord | One-to-Many | One patient can have many visit records |
| Patient → Prescription | One-to-Many | One patient can have many prescriptions |
| Patient → Invoice | One-to-Many | One patient can have many invoices |
| Patient → Screening | One-to-Many | One patient can have many screenings |
| Patient → InsurancePolicy | One-to-Many | One patient can have multiple insurance policies |
| InsurancePolicy → Claim | One-to-Many | One policy can have many claims |
| User → Notification | One-to-Many | One user receives many notifications |
| LabPackage → (no relations) | Standalone | Catalog entries — no relational links |

---

## 6. API Documentation

### 6.1 Complete API Reference

**Base URL:** `http://localhost:5000/api`

#### Authentication (Public)

| Method | Endpoint | Auth | Roles | Description | Request Body | Response |
|--------|----------|------|-------|-------------|-------------|----------|
| POST | `/auth/register` | None | All | Register new user | `{name, email, password, role}` | `{token, user: {id, name, email, role}}` |
| POST | `/auth/login` | None | All | Login | `{email, password}` | `{token, user: {id, name, email, role}}` |

#### Users

| Method | Endpoint | Auth | Roles | Description | Query Params | Response |
|--------|----------|------|-------|-------------|-------------|----------|
| GET | `/users` | JWT | admin, doctor, staff | List users | `?role=doctor` | `[{_id, name, email, role}]` |

#### Patients

| Method | Endpoint | Auth | Roles | Description | Query/Body | Response |
|--------|----------|------|-------|-------------|-----------|----------|
| GET | `/patients/me` | JWT | patient | Get own clinical record | — | `{Patient object}` |
| POST | `/patients` | JWT | admin, doctor, staff | Register patient | `{name, age, gender, phone, email, address, bloodGroup}` | `{Patient object}` (201) |
| GET | `/patients` | JWT | admin, doctor, staff | List/search patients | `?search=name_or_phone` | `[{Patient objects}]` |
| GET | `/patients/:id` | JWT | admin, doctor, staff | Get one patient | — | `{Patient object}` |
| PUT | `/patients/:id` | JWT | admin, doctor, staff | Update patient | Updated fields | `{Patient object}` |
| DELETE | `/patients/:id` | JWT | admin | Delete patient | — | `{message: "Patient deleted"}` |

#### Appointments

| Method | Endpoint | Auth | Roles | Description | Query/Body | Response |
|--------|----------|------|-------|-------------|-----------|----------|
| POST | `/appointments` | JWT | all | Book/request appointment | `{patient, doctor, date, reason, notes}` | `{Appointment}` (201) |
| GET | `/appointments` | JWT | all (scoped) | List appointments | `?status=&patient=&doctor=` | `[{Appointment}]` with populated patient + doctor |
| GET | `/appointments/:id` | JWT | all (scoped) | Get one appointment | — | `{Appointment}` |
| PUT | `/appointments/:id` | JWT | all (scoped) | Update/cancel appointment | Updated fields | `{Appointment}` |
| DELETE | `/appointments/:id` | JWT | admin, doctor | Delete appointment | — | `{message: "Appointment deleted"}` |

**Note for patient role:** Patients can only create `requested` status appointments (not self-confirmed `scheduled`). They can only cancel (not edit) their own appointments.

#### Clinical Records

| Method | Endpoint | Auth | Roles | Description | Query/Body | Response |
|--------|----------|------|-------|-------------|-----------|----------|
| POST | `/records` | JWT | admin, doctor, staff | Create record | `{patient, doctor, visitDate, diagnosis, prescription, notes}` | `{Record}` (201) |
| GET | `/records` | JWT | all (scoped) | List records | `?patient=<id>` | `[{Record}]` with populated patient + doctor |
| GET | `/records/:id` | JWT | all (scoped) | Get one record | — | `{Record}` |
| PUT | `/records/:id` | JWT | admin, doctor, staff | Update record | Updated fields | `{Record}` |
| DELETE | `/records/:id` | JWT | admin, doctor | Delete record | — | `{message: "Record deleted"}` |
| POST | `/records/:id/documents` | JWT | admin, doctor, staff | Upload files | `multipart/form-data` with field "files" (max 5) | `{Record with updated documents}` |

#### Prescriptions

| Method | Endpoint | Auth | Roles | Description | Query/Body | Response |
|--------|----------|------|-------|-------------|-----------|----------|
| POST | `/prescriptions` | JWT | admin, doctor | Create prescription | `{patient, doctor, diagnosis, items[], notes}` | `{Prescription}` (201) |
| GET | `/prescriptions` | JWT | all (scoped) | List prescriptions | `?patient=<id>` | `[{Prescription}]` with populated patient + doctor |
| GET | `/prescriptions/:id` | JWT | all (scoped) | Get one prescription | — | `{Prescription}` |
| PUT | `/prescriptions/:id` | JWT | admin, doctor | Update prescription | Updated fields | `{Prescription}` |
| DELETE | `/prescriptions/:id` | JWT | admin, doctor | Delete prescription | — | `{message: "Prescription deleted"}` |

#### Invoices

| Method | Endpoint | Auth | Roles | Description | Query/Body | Response |
|--------|----------|------|-------|-------------|-----------|----------|
| POST | `/invoices` | JWT | admin, staff | Create invoice | `{patient, items[{description, qty, unitPrice}], tax, discount, dueDate, notes}` | `{Invoice}` (201) |
| GET | `/invoices` | JWT | all (scoped) | List invoices | `?patient=&status=` | `[{Invoice}]` with populated patient |
| GET | `/invoices/:id` | JWT | all (scoped) | Get one invoice | — | `{Invoice}` |
| PUT | `/invoices/:id` | JWT | admin, staff | Update invoice | `{items, tax, discount, dueDate, notes}` | `{Invoice}` |
| DELETE | `/invoices/:id` | JWT | admin | Delete invoice | — | `{message: "Invoice deleted"}` |
| POST | `/invoices/:id/payments` | JWT | admin, staff | Record payment | `{amount, method, reference}` | `{Invoice with updated payments}` |

#### Insurance

| Method | Endpoint | Auth | Roles | Description | Query/Body | Response |
|--------|----------|------|-------|-------------|-----------|----------|
| POST | `/insurance/policies` | JWT | admin, staff | Create policy | `{patient, payerName, policyNumber, holderName, coverageAmount, validFrom, validTo, notes}` | `{Policy}` (201) |
| GET | `/insurance/policies` | JWT | admin, doctor, staff | List policies | `?patient=<id>` | `[{Policy}]` |
| GET | `/insurance/policies/:id` | JWT | admin, doctor, staff | Get one policy | — | `{Policy}` |
| PUT | `/insurance/policies/:id` | JWT | admin, staff | Update policy | Updated fields | `{Policy}` |
| DELETE | `/insurance/policies/:id` | JWT | admin | Delete policy | — | `{message: "Policy deleted"}` |
| POST | `/insurance/claims` | JWT | admin, staff | Create claim | `{policy, patient, invoice, amountClaimed, preAuthNo, notes, status}` | `{Claim}` (201) |
| GET | `/insurance/claims` | JWT | admin, doctor, staff | List claims | `?patient=&status=` | `[{Claim}]` |
| GET | `/insurance/claims/:id` | JWT | admin, doctor, staff | Get one claim | — | `{Claim}` |
| PUT | `/insurance/claims/:id` | JWT | admin, staff | Update claim | Updated fields | `{Claim}` |
| DELETE | `/insurance/claims/:id` | JWT | admin | Delete claim | — | `{message: "Claim deleted"}` |

#### Lab

| Method | Endpoint | Auth | Roles | Description | Query/Body | Response |
|--------|----------|------|-------|-------------|-----------|----------|
| GET | `/lab/packages` | JWT | all | Browse catalog | `?category=Vitamins` | `[{LabPackage}]` |
| POST | `/lab/orders` | JWT | all | Place lab order | `{items[{name, price}], patient, contactName, contactPhone, collectionAddress, collectionSlot}` | `{LabOrder}` (201) |
| GET | `/lab/orders` | JWT | all (scoped) | List orders | `?status=booked` | `[{LabOrder}]` |
| GET | `/lab/orders/:id` | JWT | all (scoped) | Get one order | — | `{LabOrder}` |
| PATCH | `/lab/orders/:id/status` | JWT | admin, doctor, staff | Update status | `{status, reportUrl}` | `{LabOrder}` |

#### Notifications

| Method | Endpoint | Auth | Roles | Description | Body | Response |
|--------|----------|------|-------|-------------|------|----------|
| GET | `/notifications` | JWT | all | Get own notifications | — | `[{Notification}]` (newest first, limit 50) |
| GET | `/notifications/unread-count` | JWT | all | Get unread count | — | `{count: number}` |
| PATCH | `/notifications/:id/read` | JWT | all | Mark one as read | — | `{Notification}` |
| PATCH | `/notifications/read-all` | JWT | all | Mark all as read | — | `{message: "All marked as read"}` |

#### Consultations

| Method | Endpoint | Auth | Roles | Description | Body | Response |
|--------|----------|------|-------|-------------|------|----------|
| GET | `/consultations/doctors` | JWT | all | List available doctors | — | `[{_id, name, email}]` |
| POST | `/consultations` | JWT | all | Request consultation | `{doctor, reason, patient}` | `{Consultation}` (201) |
| GET | `/consultations` | JWT | all (scoped) | List consultations | — | `[{Consultation}]` |
| GET | `/consultations/:id` | JWT | all (scoped) | Get one consultation | — | `{Consultation}` |
| PATCH | `/consultations/:id/status` | JWT | all | Update status | `{status}` | `{Consultation}` |
| PUT | `/consultations/:id` | JWT | admin, doctor | Add summary | `{summary}` | `{Consultation}` |

#### Analytics

| Method | Endpoint | Auth | Roles | Description | Response |
|--------|----------|------|-------|-------------|----------|
| GET | `/analytics/overview` | JWT | admin, doctor, staff | Dashboard KPIs | `{counts, appointmentsByStatus, screeningByRisk, revenue{billed, collected, outstanding}, patientsTrend[], recentInvoices[], recentAppointments[]}` |

#### Audit

| Method | Endpoint | Auth | Roles | Description | Query Params | Response |
|--------|----------|------|-------|-------------|-------------|----------|
| GET | `/audit` | JWT | admin | View audit trail | `?entity=patients&action=update&limit=50` | `[{AuditLog}]` |

#### Screening

| Method | Endpoint | Auth | Roles | Description | Body | Response |
|--------|----------|------|-------|-------------|------|----------|
| POST | `/screening` | JWT | admin, doctor, staff | Run screening | `{patient, heightCm, weightKg, systolic, diastolic, smoker, diabetic}` | `{Screening}` (201) with computed bmi, bmiCategory, riskScore, riskLevel, recommendations |
| GET | `/screening` | JWT | admin, doctor, staff | List screenings | `?patient=<id>` | `[{Screening}]` |
| GET | `/screening/:id` | JWT | admin, doctor, staff | Get one screening | — | `{Screening}` |

### 6.2 API Summary (Counts)

| Category | Endpoints |
|----------|-----------|
| Auth | 2 endpoints |
| Users | 1 endpoint |
| Patients | 6 endpoints |
| Appointments | 5 endpoints |
| Clinical Records | 6 endpoints |
| Prescriptions | 5 endpoints |
| Invoices | 6 endpoints |
| Insurance | 10 endpoints (5 policies + 5 claims) |
| Lab | 5 endpoints |
| Notifications | 4 endpoints |
| Consultations | 6 endpoints |
| Analytics | 1 endpoint |
| Audit | 1 endpoint |
| Screening | 3 endpoints |
| **TOTAL** | **61 API endpoints** |

---

## 7. Feature-by-Feature Explanation

### Feature 1: Authentication & Authorization

**What it does:** Allows users to create accounts and log in. Issues a JWT token used for all subsequent requests.

**How it works:**
1. User submits name, email, password, and role via the Register form
2. Backend checks if email already exists → returns error if duplicate
3. Password is hashed with bcrypt (10 salt rounds) before storing
4. A JWT is created containing `{id, name, role}` and signed with JWT_SECRET
5. Token and user info returned to frontend, stored in localStorage
6. On every subsequent request, the auth interceptor adds the Bearer token
7. On login, the same flow minus the user creation step

**Files involved:**
- Backend: `routes/auth.js`, `models/User.js`, `middleware/auth.js`
- Frontend: `services/auth.service.ts`, `interceptors/auth.interceptor.ts`, `pages/login/login.component.ts`, `pages/register/register.component.ts`

**APIs called:** `POST /api/auth/register`, `POST /api/auth/login`

**Database collections:** `users`

---

### Feature 2: Role-Based Access Control (RBAC)

**What it does:** Restricts what different roles can see and do. Admin can do everything; doctor can treat patients; staff handles admin tasks; patients can only see their own data and use the portal.

**How it works:**
1. After JWT verification, `auth` middleware sets `req.user = { id, name, role }`
2. `role(...allowedRoles)` middleware checks if `req.user.role` is in the allowed list
3. On the frontend, `role.guard.ts` checks the user's role before allowing route access
4. Components use `authService.hasRole(...)` to conditionally show/hide UI elements
5. Route handlers also scope data — e.g., patients only see appointments where `bookedBy === their user ID`

**Files involved:**
- Backend: `middleware/auth.js`, `middleware/role.js`, all route files (each declares required roles)
- Frontend: `guards/auth.guard.ts`, `guards/role.guard.ts`, `services/auth.service.ts` (hasRole method), `app.routes.ts` (route-level guard declarations)

**APIs called:** N/A (middleware intercepts every request)

**Database collections:** `users` (role field)

---

### Feature 3: Patient Management

**What it does:** Register new patients with full demographics, search existing patients, edit patient details, delete patients (admin only).

**How it works:**
1. Provider fills the patient onboarding form (name, age, gender, phone, email, address, blood group)
2. Form submits to `POST /api/patients` which creates the Patient document
3. Patient list page calls `GET /api/patients` with optional `?search=` query
4. Search uses MongoDB regex — matches against name or phone case-insensitively
5. Edit loads existing data via `GET /api/patients/:id`, then submits via `PUT /api/patients/:id`
6. Delete is admin-only via `role('admin')` guard

**Files involved:**
- Backend: `routes/patients.js`, `models/Patient.js`
- Frontend: `services/patient.service.ts`, `pages/patient-list/patient-list.component.ts`, `pages/patient-form/patient-form.component.ts`, `models/patient.model.ts`

**APIs called:** `GET /api/patients/me`, `POST /api/patients`, `GET /api/patients?search=`, `GET /api/patients/:id`, `PUT /api/patients/:id`, `DELETE /api/patients/:id`

**Database collections:** `patients`

---

### Feature 4: Appointment Scheduling

**What it does:** Book appointments between patients and doctors with date/time, reason, and status tracking.

**How it works:**
1. Provider selects patient, doctor, date, and reason → creates an appointment with status `scheduled`
2. Patient can only `request` — the appointment starts as `requested` and the clinic must confirm
3. Doctor gets a notification when an appointment is booked/requested
4. Status workflow: `requested → scheduled → completed → cancelled`
5. Patient gets notified when the clinic confirms or declines their request
6. List view supports filtering by status, patient, and doctor
7. Frontend populates doctor dropdown by calling `GET /api/users?role=doctor`

**Files involved:**
- Backend: `routes/appointments.js`, `models/Appointment.js`, `utils/notify.js`
- Frontend: `services/appointment.service.ts`, `services/user.service.ts`, `pages/appointment-list/appointment-list.component.ts`, `pages/appointment-form/appointment-form.component.ts`, `models/appointment.model.ts`

**APIs called:** `POST /api/appointments`, `GET /api/appointments?status=&patient=&doctor=`, `GET /api/appointments/:id`, `PUT /api/appointments/:id`, `DELETE /api/appointments/:id`, `GET /api/users?role=doctor`

**Database collections:** `appointments`, `users` (doctor list), `patients`, `notifications`

---

### Feature 5: Clinical Records (EMR/EHR)

**What it does:** Create and manage electronic medical records for patient visits. Includes diagnosis, prescription notes, clinical notes, and document uploads.

**How it works:**
1. Provider fills a form with patient, doctor, visit date, diagnosis, prescription text, and notes
2. Record is created via `POST /api/records`
3. Documents (PDFs, images, reports) can be uploaded via the file upload component
4. Upload uses Multer middleware — files stored in `/uploads/` folder with unique names
5. File restrictions: only pdf/jpg/jpeg/png/doc/docx, max 5MB per file, max 5 files per upload
6. Documents are stored as an array inside the record: `[{fileName, originalName, url, uploadedAt}]`
7. Patients can view their own records (scoped by `getOrCreateSelfPatient`)

**Files involved:**
- Backend: `routes/records.js`, `models/ClinicalRecord.js`, `middleware/upload.js`
- Frontend: `services/record.service.ts`, `pages/record-list/record-list.component.ts`, `pages/record-form/record-form.component.ts`, `models/record.model.ts`

**APIs called:** `POST /api/records`, `GET /api/records?patient=`, `GET /api/records/:id`, `PUT /api/records/:id`, `DELETE /api/records/:id`, `POST /api/records/:id/documents`

**Database collections:** `clinicalrecords`

---

### Feature 6: Prescriptions (e-Rx)

**What it does:** Doctors create digital prescriptions with multiple medications, each specifying drug name, dosage, frequency, duration, and special instructions.

**How it works:**
1. Doctor selects a patient, optionally enters a diagnosis context
2. Adds one or more medication lines dynamically (add/remove drugs)
3. Each drug line: drug name, dosage (e.g., "500mg"), frequency (e.g., "1-0-1" or "Twice a day"), duration in days, instructions (e.g., "After food")
4. Prescription can be viewed in a printable format
5. Status can be: active, completed, or cancelled
6. Patients can view their own prescriptions

**Files involved:**
- Backend: `routes/prescriptions.js`, `models/Prescription.js`
- Frontend: `services/prescription.service.ts`, `pages/prescription-list/prescription-list.component.ts`, `pages/prescription-form/prescription-form.component.ts`, `pages/prescription-view/prescription-view.component.ts`, `models/prescription.model.ts`

**APIs called:** `POST /api/prescriptions`, `GET /api/prescriptions?patient=`, `GET /api/prescriptions/:id`, `PUT /api/prescriptions/:id`, `DELETE /api/prescriptions/:id`

**Database collections:** `prescriptions`

---

### Feature 7: Billing & Invoices

**What it does:** Create itemized invoices, calculate totals with tax and discount, record payments, track paid/unpaid status.

**How it works:**
1. Staff/admin selects a patient and adds line items (description, quantity, unit price)
2. System computes: `item amount = qty × unit price`, `subtotal = sum of items`, `total = subtotal + tax - discount`
3. Invoice number auto-generated: `INV-<timestamp last 6 digits>`
4. Payments recorded via dedicated endpoint with method (cash/card/UPI/wallet), amount, and reference
5. Status auto-computed: `unpaid` (0 paid), `partial` (< total), `paid` (≥ total)
6. All money fields recomputed on every save (recalc function)
7. Printable invoice view with patient details, items table, subtotal/tax/discount/total breakdown, and payment history

**Files involved:**
- Backend: `routes/invoices.js`, `models/Invoice.js`
- Frontend: `services/invoice.service.ts`, `pages/invoice-list/invoice-list.component.ts`, `pages/invoice-form/invoice-form.component.ts`, `pages/invoice-view/invoice-view.component.ts`, `models/invoice.model.ts`

**APIs called:** `POST /api/invoices`, `GET /api/invoices?patient=&status=`, `GET /api/invoices/:id`, `PUT /api/invoices/:id`, `DELETE /api/invoices/:id`, `POST /api/invoices/:id/payments`

**Database collections:** `invoices`

---

### Feature 8: Insurance Management

**What it does:** Capture patient insurance policies and manage claims against those policies with approval workflow.

**How it works:**
1. Staff/admin creates an insurance policy for a patient (payer, policy number, coverage amount, validity dates)
2. Claims can be filed against a policy — linking to patient and optionally an invoice
3. Claim number auto-generated: `CLM-<timestamp last 6 digits>`
4. Claim status workflow: `draft → submitted → approved → rejected → paid`
5. Amount approved can differ from amount claimed (partial approval)
6. Claims track pre-authorization numbers

**Files involved:**
- Backend: `routes/insurance.js`, `models/InsurancePolicy.js`, `models/Claim.js`
- Frontend: `services/insurance.service.ts`, `pages/insurance/insurance.component.ts`, `pages/insurance/policy-form.component.ts`, `pages/insurance/claim-form.component.ts`, `models/insurance.model.ts`

**APIs called:** All 10 insurance endpoints (5 policies + 5 claims)

**Database collections:** `insurancepolicies`, `claims`

---

### Feature 9: Health Screening Engine

**What it does:** Input patient vitals (height, weight, BP, lifestyle flags) and get automatically computed BMI, BMI category, risk score, risk level, and personalized lifestyle recommendations.

**How it works (the math):**

1. **BMI Calculation:**
   - `heightM = heightCm / 100`
   - `bmi = weightKg / (heightM × heightM)` (rounded to 1 decimal)
   - Category: `< 18.5` → Underweight, `< 25` → Normal, `< 30` → Overweight, `≥ 30` → Obese

2. **Risk Scoring (additive model):**
   - Overweight: +1, Obese: +2, Underweight: +1
   - High BP (≥140/90): +2, Elevated BP (≥130/85): +1
   - Smoker: +2, Diabetic: +2
   - `0-1` → Low risk, `2-3` → Medium risk, `4+` → High risk

3. **Recommendations generated** for each risk factor detected (e.g., "Consult a dietitian", "Monitor blood pressure", "Consider smoking cessation program")

4. All computation happens server-side — the client only sends raw vitals

**Files involved:**
- Backend: `routes/screening.js` (contains the `evaluate()` function with all computation logic), `models/Screening.js`
- Frontend: `services/screening.service.ts`, `pages/screening/screening.component.ts`, `models/screening.model.ts`

**APIs called:** `POST /api/screening`, `GET /api/screening?patient=`, `GET /api/screening/:id`

**Database collections:** `screenings`

---

### Feature 10: Lab Catalog & Booking

**What it does:** Patients can browse a catalog of lab test packages, filter by category, book tests, and track order status.

**How it works:**
1. Catalog is loaded from `/api/lab/packages` (backend) and static `catalog.ts` data (frontend)
2. Category chips (Popular, Vitamins, Thyroid, Kidney, Liver, Allergy) filter the catalog
3. Patients can browse by organ (Bone, Stomach, Heart, Kidney), care plans (Women/Men/Elderly)
4. Booking collects contact info, collection address, and preferred time slot
5. Order number auto-generated: `LAB-<timestamp>`
6. Order status tracker: `booked → collected → in_lab → report_ready → cancelled`
7. Staff can update order status and attach report URL
8. Patient gets notified on status changes

**Files involved:**
- Backend: `routes/lab.js`, `models/LabOrder.js`, `models/LabPackage.js`
- Frontend: `services/lab.service.ts`, `data/catalog.ts`, `pages/lab-orders/lab-orders.component.ts`, `pages/portal/portal-care.component.ts`, `pages/portal/portal-book.component.ts`, `pages/portal/portal-orders.component.ts`

**APIs called:** `GET /api/lab/packages?category=`, `POST /api/lab/orders`, `GET /api/lab/orders?status=`, `GET /api/lab/orders/:id`, `PATCH /api/lab/orders/:id/status`

**Database collections:** `labpackages`, `laborders`, `notifications`

---

### Feature 11: Teleconsultation

**What it does:** Patients can request video consultations with doctors. Creates a unique video room, tracks status, and allows doctors to add post-call summaries.

**How it works:**
1. Patient selects a doctor and provides a reason
2. System generates a unique room ID: `healthbridge-<timestamp base36>-<random string>`
3. Consultation status: `requested → in_progress → completed → cancelled`
4. Doctor gets notified about the request
5. Doctor can join the video room at `/room/:id`
6. Call start/end times are tracked (startedAt, endedAt)
7. After the call, doctor can add a summary
8. Role-scoped listing: patients see their own, doctors see theirs, admin/staff see all

**Files involved:**
- Backend: `routes/consultations.js`, `models/Consultation.js`
- Frontend: `services/consultation.service.ts`, `pages/consultations/consultation-list.component.ts`, `pages/room/video-room.component.ts`, `pages/portal/portal-consult.component.ts`, `models/consultation.model.ts`

**APIs called:** `GET /api/consultations/doctors`, `POST /api/consultations`, `GET /api/consultations`, `GET /api/consultations/:id`, `PATCH /api/consultations/:id/status`, `PUT /api/consultations/:id`

**Database collections:** `consultations`, `notifications`, `users` (doctor list)

---

### Feature 12: Notifications System

**What it does:** In-app notification center showing appointment alerts, lab status updates, and consultation requests. Tracks read/unread state.

**How it works:**
1. Backend `notify.js` utility creates Notification documents silently
2. Notifications are triggered by: appointment booking, appointment confirmation/decline, lab status change, consultation request
3. Frontend notification bell shows unread count badge
4. Dropdown shows recent notifications with links to relevant pages
5. Mark-as-read and mark-all-read functionality
6. Each notification is scoped to a specific user

**Files involved:**
- Backend: `routes/notifications.js`, `models/Notification.js`, `utils/notify.js`
- Frontend: `services/notification.service.ts`, `shared/notification-bell.component.ts`, `models/notification.model.ts`

**APIs called:** `GET /api/notifications`, `GET /api/notifications/unread-count`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`

**Database collections:** `notifications`

---

### Feature 13: HealthScore & Health Trackers

**What it does:** Patients log daily health vitals (steps, blood sugar, weight, BP, medicine adherence, heart rate) and get a composite HealthScore (0-100) with personalized advice.

**How it works:**
1. Patient inputs vitals in the Vitals tab of the portal
2. Data is stored per-user in localStorage (not sent to backend — client-side feature)
3. HealthScore is computed client-side:
   - Each measurable vital gets a 0-100 sub-score based on clinical ranges
   - Steps: ≥8000 → 100, ≥5000 → 80, ≥2000 → 60, <2000 → 35
   - Blood sugar: 70-99 → 100, 100-125 → 75, 126-199 → 45, ≥200 → 20
   - Weight: BMI 18.5-24.9 → 100, 25-29.9 → 75, 30-34.9 → 50, <18.5 or ≥35 → 30
   - BP, heart rate similarly scored against normal ranges
   - Overall HealthScore = average of all sub-scores
   - Label: ≥85→Excellent, ≥70→Good, ≥50→Fair, <50→Needs attention
   - Personalized message and contributing factors displayed

**Files involved:**
- Frontend: `services/health-score.service.ts`, `data/catalog.ts` (HEALTH_TRACKERS), `pages/portal/portal-home.component.ts`, `pages/portal/portal-vitals.component.ts`
- Backend: None (purely client-side feature)

**APIs called:** None

**Database collections:** None (uses localStorage)

---

### Feature 14: Analytics Dashboard

**What it does:** Shows provider-facing KPIs — total counts, revenue breakdown, appointment status distribution, screening risk distribution, patient trend over time, and recent activity.

**How it works:**
1. Single endpoint `GET /api/analytics/overview` uses `Promise.all()` to run 11 database queries in parallel
2. Queries: count documents, aggregate by status/risk/revenue, sort recent entries
3. Revenue computed: billed (sum of all invoice totals), collected (sum of all payment amounts), outstanding (billed - collected)
4. Patient trend: groups patients by month of creation, sorted chronologically
5. Recent invoices and appointments: last 5 entries with populated references
6. Dashboard component renders KPI cards, charts, and lists

**Files involved:**
- Backend: `routes/analytics.js`
- Frontend: `services/analytics.service.ts`, `pages/dashboard/dashboard.component.ts`, `models/analytics.model.ts`

**APIs called:** `GET /api/analytics/overview`

**Database collections:** `patients`, `users`, `appointments`, `prescriptions`, `invoices`, `screenings`, `clinicalrecords`

---

### Feature 15: Audit Logging

**What it does:** Automatically records every write action (create, update, delete) with who did it, what entity was affected, when, and from which IP address.

**How it works:**
1. `auditLogger.js` middleware runs on every request
2. It checks if the request method is a write method (POST, PUT, PATCH, DELETE)
3. It listens for the response `finish` event
4. Only logs successful (status < 400) and authenticated requests
5. Actor info is captured as a snapshot (id, name, role) — denormalized so the trail stays accurate even if the user is later renamed or deleted
6. Request bodies are intentionally NOT stored (may contain PHI/passwords)
7. Audit failures never break the main request — caught silently
8. Admin can view the audit log with filters by entity and action

**Files involved:**
- Backend: `middleware/auditLogger.js`, `routes/audit.js`, `models/AuditLog.js`
- Frontend: `services/audit.service.ts`, `pages/audit/audit.component.ts`, `models/audit.model.ts`

**APIs called:** `GET /api/audit?entity=&action=&limit=` (reading), logging is automatic

**Database collections:** `auditlogs`

---

### Feature 16: Dual Portal System

**What it does:** Single Angular codebase serves two completely different UI areas based on user role — Provider Console for clinic staff and Patient Portal for consumers.

**How it works:**
1. After login, role-based routing is determined by `role.guard.ts`
2. Provider Console route (`/`): wrapped in `LayoutComponent` with sidebar navigation + top bar; guarded for admin/doctor/staff
3. Patient Portal route (`/portal`): wrapped in `PortalLayoutComponent` with top greeting bar + content area; guarded for patient role only
4. Provider sidebar shows: Dashboard, Patients, Appointments, Records, Prescriptions, Invoices, Screening, Lab Orders, Consultations, Insurance, Audit
5. Portal shows: Home (HealthScore), Care (Lab Catalog), Book, Orders, Consult, Appointments, Records, Vitals (Trackers), Profile
6. Both areas share the same services, interceptors, and models — just different UI components

**Files involved:**
- Frontend: `app.routes.ts` (route hierarchy), `guards/role.guard.ts`, `app.config.ts`, `pages/layout/layout.component.ts`, `pages/portal/portal-layout.component.ts`, all portal page components (9 files)

---

## 8. Complete User Flow

### 8.1 Admin User — Complete Day

```
1. Open browser → http://localhost:4200
2. See login page → Enter admin email + password → Click Sign In
3. Backend verifies credentials → Returns JWT token → Frontend stores in localStorage
4. Role guard detects 'admin' role → Routes to Provider Console (/dashboard)
5. DASHBOARD: See KPIs — total patients (342), appointments (89), revenue (₹4.2L billed, ₹3.1L collected)
6. PATIENTS: Click "Patients" in sidebar → See searchable patient list
   → Search "Sharma" → Find Mrs. Sharma → Click to view details
7. APPOINTMENTS: Click "Appointments" → See all appointments → Filter by "scheduled"
   → Doctor asks admin to delete a cancelled appointment → Click delete on the appointment
8. RECORDS: Click "Records" → Filter by patient → See Mrs. Sharma's visit history
   → Click a record to view diagnosis + uploaded reports
9. PRESCRIPTIONS: Click "Prescriptions" → See all prescriptions by Dr. Khan
   → View a prescription → See all 4 drugs with dosages
10. INVOICES: Click "Invoices" → See all invoices → Click an unpaid one
    → Record a payment (₹500 via UPI) → Invoice status auto-updates to "paid"
11. INSURANCE: Click "Insurance" → Create new policy for patient → Add coverage details
    → File a claim against that policy → Set status to "submitted"
12. SCREENING: Click "Screening" → Select patient → Enter vitals
    → System computes BMI: 28.5 (Overweight), Risk: Medium, Recommendations: "Reduce salt intake, exercise regularly"
13. LAB ORDERS: View all lab orders → Update one to "report_ready" → Patient gets notified
14. AUDIT: Click "Audit" (admin only) → See all actions logged — who created which patient, who deleted which appointment, from which IP
15. LOGOUT: Click user menu → Logout → Token cleared → Redirected to login
```

### 8.2 Doctor User — Complete Day

```
1. Login as doctor → Role guard routes to Provider Console
2. DASHBOARD: See today's appointments, patient count, revenue overview
3. APPOINTMENTS: See appointments assigned to you → Patient requested a slot
   → Click "Confirm" → Status changes from "requested" to "scheduled" → Patient notified
4. PATIENTS: Search patient → View demographics → Check blood group, age, contact
5. RECORDS: Create new clinical record for today's visit
   → Fill diagnosis: "Acute Bronchitis" → Add prescription notes → Add clinical notes
   → Upload chest X-ray PDF (2.3 MB) → Record created with attached document
6. PRESCRIPTIONS: Create new prescription for the patient
   → Drug 1: Azithromycin 500mg, 1-0-1, 5 days, After food
   → Drug 2: Cetirizine 10mg, 0-0-1, 7 days, At bedtime
   → Drug 3: Paracetamol 650mg, 1-0-1, 3 days, After food (SOS)
   → Click "Create Prescription" → View printable version
7. SCREENING: Run health screening for patient
   → Height: 170cm, Weight: 82kg → BMI: 28.4 (Overweight)
   → BP: 138/88 (elevated) → Risk: Medium
   → Recommendations generated automatically
8. CONSULTATIONS: Patient requested teleconsult → Click "Start" → Video room opens
   → Conduct video call → Add post-call summary: "Advised to continue medication, review in 2 weeks"
9. LOGOUT: End of shift → Logout
```

### 8.3 Staff User — Complete Day

```
1. Login as staff → Role guard routes to Provider Console
2. PATIENTS: Register new walk-in patient
   → Fill name, age, gender, phone, address, blood group → Click "Register Patient"
3. APPOINTMENTS: Book appointment for the new patient
   → Select patient, select Dr. Khan, pick date/time, enter reason: "Annual checkup"
   → Appointment created with "scheduled" status → Doctor notified
4. INVOICES: Create invoice for the patient's consultation
   → Line 1: "Consultation Fee" × 1 × ₹500 = ₹500
   → Line 2: "Blood Test (CBC)" × 1 × ₹300 = ₹300
   → Subtotal: ₹800, Tax: ₹0, Discount: ₹50 (staff can give discount)
   → Total: ₹750 → Patient pays ₹500 cash → Record payment
   → Invoice status: "partial" (₹500 paid of ₹750)
5. INSURANCE: Create insurance policy for patient
   → Payer: "Star Health Insurance", Policy No: SHI-2024-12345, Coverage: ₹5,00,000
   → File claim for the invoice: Amount claimed ₹750
6. LAB ORDERS: Patient wants lab test → Book from lab catalog
   → "Thyroid Profile Total" — ₹399 → Order created → Update status as samples arrive
7. LOGOUT: End of shift → Logout
```

### 8.4 Patient User — Complete Day

```
1. Open browser → Register new account → Select role "Patient"
   → Fill name, email, password → Click "Create Account"
2. Logged in → Role guard detects 'patient' → Routes to Patient Portal (/portal/home)
3. HOME: See greeting "Hello, Sahil!" → See HealthScore gauge: 72/100 (Good)
   → See service tiles: Blood Tests (up to 79% off), X-Rays, Doctor Consult
4. CARE: Click "Care" tab → Browse lab catalog
   → Filter by "Thyroid" → See "Thyroid Profile Total — ₹399 (MRP ₹900)"
   → Filter by "Kidney" → See "KFT — ₹504 (MRP ₹1681)"
   → Browse by organ: Select Heart → "Cardiac Risk Assessment — ₹899"
5. BOOK: Click "Book" tab → Select a package → Fill contact details
   → Enter collection address and preferred time slot → Click "Book Now"
   → Order created with number "LAB-482917" → Status: "booked"
6. ORDERS: Click "Orders" tab → See order tracker stepper
   → ✓ Booked → ✓ Collected → ◉ In Lab → ○ Report Ready
   → Real-time status updates as clinic processes the sample
7. CONSULT: Click "Consult" tab → Select Dr. Khan from doctor list
   → Enter reason: "Need to discuss my thyroid results" → Click "Request Consultation"
   → Waiting for doctor → Doctor accepts → Video room opens → Have consultation
8. APPOINTMENTS: Click "Appointments" → Request new appointment
   → Select doctor, date, reason: "Follow-up checkup" → Status: "requested"
   → Later: Clinic confirms → Status changes to "scheduled" → Patient notified
9. RECORDS: Click "Records" → View past visit records → See diagnosis, prescriptions
   → Download uploaded reports (X-ray PDF, lab reports)
10. VITALS: Click "Vitals" tab → Log today's readings
    → Steps: 7200 → Sugar: 95 mg/dL → Weight: 72 kg → BP: 122/82 → Heart Rate: 72 bpm
    → HealthScore updates automatically → Now 78/100 (Good)
11. PROFILE: Click "Profile" tab → View demographics → Edit contact info
12. LOGOUT: Click logout → Session cleared → Back to login page
```

---

## 9. Security Implementation

### 9.1 Authentication

| Security Measure | Implementation | Why It's Secure |
|-----------------|----------------|-----------------|
| JWT Token | `jwt.sign({ id, name, role }, JWT_SECRET, { expiresIn: '7d' })` | Stateless — no session stored on server. Token expires automatically. |
| Token in Header | `Authorization: Bearer <token>` | Standard practice. Token never in URL (URLs get logged). |
| Token Verification | Every protected route verifies JWT via `auth` middleware | Any tampered or expired token is rejected with 401. |

### 9.2 Password Handling

| Security Measure | Implementation | Why It's Secure |
|-----------------|----------------|-----------------|
| Hashing (never plain text) | `bcrypt.hash(password, salt)` | Even if database is compromised, passwords cannot be read. |
| Salt | `bcrypt.genSalt(10)` → 2^10 = 1024 iterations | Each password gets a unique random salt. Prevents rainbow table attacks. |
| Comparison | `bcrypt.compare(plainPassword, hashedPassword)` | Timing-attack safe comparison. |
| Minimum Length | Frontend validation: `Validators.minLength(6)` | Prevents weak passwords. |
| Password never returned | User queries use `.select('name email role')` — excludes password field | API never exposes password hashes. |

### 9.3 Authorization

| Security Measure | Implementation | Why It's Secure |
|-----------------|----------------|-----------------|
| RBAC Middleware | `role('admin', 'doctor')` on routes | Centralized, declarative — easy to audit. |
| Frontend Guard | `roleGuard('patient')` on routes | Cannot even navigate to unauthorized pages. |
| UI Gating | `authService.hasRole('admin')` in templates | Unauthorized buttons are hidden, not just disabled. |
| Data Scoping | Patients only see `filter.bookedBy = req.user.id` / `filter.patient = self._id` | Even if they bypass the frontend guard, the API returns only their data. |

### 9.4 File Upload Security

| Security Measure | Implementation | Why It's Secure |
|-----------------|----------------|-----------------|
| File Type Filter | `fileFilter`: only `pdf|jpg|jpeg|png|doc|docx` | Prevents executable uploads. |
| Size Limit | `limits: { fileSize: 5 * 1024 * 1024 }` (5 MB) | Prevents disk-filling DoS attacks. |
| Max Files | `upload.array('files', 5)` | Limits number of files per upload. |
| Unique Filenames | `Date.now() + '-' + random number + extension` | Prevents filename collisions and path traversal. |
| No original names | Files saved with generated names, original names stored separately | Prevents malicious filename injection. |

### 9.5 Additional Security

| Security Measure | Implementation | Why It's Secure |
|-----------------|----------------|-----------------|
| CORS | `app.use(cors())` | Allows only configured origins (by default, restricts cross-origin requests). |
| Audit Trail | Immutable audit log of all writes | Deters insider threats; provides forensic capability. |
| No request body logging | Audit logger explicitly excludes request bodies | Prevents logging of passwords, PHI (Protected Health Information). |
| Generic error messages | Login returns "Invalid credentials" — never specifies whether email or password was wrong | Prevents user enumeration attacks. |
| Secrets in .env | `JWT_SECRET`, `MONGO_URI` loaded from environment variables | Secrets never committed to git. |

---

## 10. Interview Preparation — 50 Questions & Answers

### Technical Questions (15 Qs)

**Q1: What is your project about?**
A: HealthBridge is a full-stack healthcare management platform built on the MEAN stack. It has two parts: a Provider Console for doctors/admin/staff to manage patients, appointments, clinical records, prescriptions, billing, insurance, and health screenings; and a Patient Portal where patients can book lab tests, track health vitals, request teleconsultations, and view their medical history. It implements JWT authentication, role-based access control with 4 roles, and an automatic audit trail.

**Q2: What is the MEAN stack?**
A: MEAN stands for MongoDB, Express.js, Angular, and Node.js. MongoDB is the NoSQL database. Express.js is the backend web framework. Angular is the frontend framework. Node.js is the JavaScript runtime. The key advantage is using JavaScript/TypeScript across the entire stack — one language for frontend and backend.

**Q3: How does JWT authentication work in your project?**
A: When a user registers or logs in, the backend creates a JWT containing the user's id, name, and role, signed with a secret key. This token is sent to the frontend and stored in localStorage. On every subsequent request, an Angular HTTP interceptor automatically attaches the token as a `Bearer` header. The backend's `auth` middleware verifies the token using `jwt.verify()`. If valid, the user info is attached to `req.user`; if invalid or expired, a 401 error is returned.

**Q4: Explain your RBAC implementation.**
A: I have 4 roles: admin, doctor, staff, patient. Each API route declares which roles can access it using the `role()` middleware. For example, `router.delete('/:id', role('admin'), handler)` means only admins can delete. On the frontend, `roleGuard` prevents unauthorized navigation, and `authService.hasRole()` conditionally shows/hides UI elements. Data-level scoping ensures patients only see their own records — we compare `req.user.id` with the resource owner.

**Q5: Why did you choose MongoDB over SQL?**
A: Healthcare data is semi-structured — a patient record, prescription, invoice, and lab order all have different fields. MongoDB's flexible document model handles this naturally without requiring complex JOINs across 20+ tables. We use Mongoose for schema validation (required fields, enums) and reference management (ObjectId refs with `.populate()`), which gives us structure where needed and flexibility where useful.

**Q6: How does your health screening risk calculator work?**
A: It's a server-side computation. Input: height, weight, systolic/diastolic BP, smoker flag, diabetic flag. First, BMI = weight(kg) / height(m)². BMI categorized as Underweight/Normal/Overweight/Obese. Then an additive risk score: Overweight +1, Obese +2, Underweight +1, High BP +2, Elevated BP +1, Smoker +2, Diabetic +2. Final score maps to risk level: 0-1 = Low, 2-3 = Medium, 4+ = High. Personalized recommendations are generated for each detected risk factor.

**Q7: Explain your audit logging system.**
A: Every write request (POST, PUT, PATCH, DELETE) is automatically logged by the `auditLogger` middleware. It listens for the response `finish` event, then records: who (actor snapshot with id, name, role), what action (create/update/delete), which entity (patients, invoices, etc.), which specific record (entityId), which HTTP method and path, the response status code, the IP address, and the timestamp. Request bodies are NOT stored to protect sensitive data. The audit log is append-only (no updates/deletes) — creating a tamper-evident trail. Admin-only access for viewing.

**Q8: How does your invoice calculation work?**
A: Invoices have a `recalc()` function that recomputes all money fields: each item's amount = qty × unitPrice, subtotal = sum of all items, total = subtotal + tax - discount, amountPaid = sum of all payments. Status is auto-derived: if amountPaid ≤ 0 → unpaid, if < total → partial, if ≥ total → paid. This function runs before every save to ensure consistency.

**Q9: How do you handle file uploads?**
A: Using Multer middleware configured with disk storage. Files go to the `/uploads/` folder with unique names (timestamp + random number + original extension). File type filter accepts only pdf, jpg, jpeg, png, doc, docx. Size limit is 5MB per file. Maximum 5 files per upload. Uploaded files are attached to clinical records as a documents array.

**Q10: How does your patient portal HealthScore work?**
A: It's a client-side feature using Angular Signals. Patients log 6 health metrics: steps, blood sugar, weight, blood pressure, medicine adherence, and heart rate. Each gets a 0-100 sub-score based on clinical ranges (e.g., ≥8000 steps = 100, 2000-5000 = 60). The overall HealthScore is the average of all sub-scores. Personalized labels: ≥85 = Excellent, ≥70 = Good, ≥50 = Fair, <50 = Needs attention. Data persists in localStorage.

**Q11: What is an HTTP interceptor and how do you use it?**
A: An HTTP interceptor in Angular sits between the HttpClient and the network. Every outgoing request passes through it. My `auth.interceptor.ts` reads the JWT token from `AuthService`, and if it exists, clones the request with the `Authorization: Bearer <token>` header added. This means no service needs to manually attach the token — it happens automatically for every request.

**Q12: Explain Angular Guards in your project.**
A: I have two guards: `authGuard` checks if the user is logged in (token exists in localStorage). If not, it redirects to `/login`. `roleGuard` takes allowed roles as parameters. If the current user's role is in the allowed list, access is granted. If the user is a patient accessing a provider route, they're redirected to `/portal/home`. If a provider tries to access the portal, they're sent to `/login`. Guards run before the route activates.

**Q13: How does the appointment booking flow differ for patients vs providers?**
A: Providers (admin/doctor/staff) can create appointments with status `scheduled` directly — they can also assign any patient and any doctor. Patients can only `request` appointments — the status starts as `requested` and the clinic must confirm or decline. Patients are also automatically linked to their Patient record via `getOrCreateSelfPatient()`. They cannot choose a different patient or self-confirm.

**Q14: What is `.populate()` in Mongoose and how do you use it?**
A: `.populate()` is Mongoose's way of resolving references. When a document stores an ObjectId reference to another collection (e.g., `patient: ObjectId`), `.populate('patient', 'name phone age')` replaces the ID with the actual document from the referenced collection, including only the specified fields. This is similar to a SQL JOIN but done at the application layer. I use it extensively — appointments populate patient and doctor, records populate patient and doctor, invoices populate patient.

**Q15: How do you handle errors in your backend?**
A: Every route handler is wrapped in try-catch. On error, we return appropriate HTTP status codes: 400 for bad requests (validation issues), 401 for authentication failures, 403 for authorization failures, 404 for not found, 500 for server errors. Error messages are user-friendly but don't leak sensitive information. The audit logger skips errors (status ≥ 400) and authentication failures (no req.user).

### Architecture Questions (10 Qs)

**Q16: Draw and explain your system architecture.**
A: [Draw the diagram from Section 2.1 and explain each layer.]

Three layers:
1. **Presentation Layer (Angular):** Runs in the browser on port 4200. Two UI areas — Provider Console and Patient Portal. Communicates with backend via REST APIs using JSON.
2. **Application Layer (Express + Node.js):** Runs on port 5000. Middleware pipeline (cors → json → audit → auth → role → handler). 13 route modules, each handling a resource. Mongoose ODM for database interaction.
3. **Data Layer (MongoDB):** Runs on port 27017. 14 collections. Document-based storage with schema validation.

**Q17: How would you scale this application?**
A:
- Stateless API (JWT) means any server can handle any request — deploy multiple Express instances behind a load balancer
- MongoDB replication: primary + secondaries for read scaling
- Move file storage to AWS S3 with signed URLs
- Add Redis caching for frequently-read data (lab catalog, doctor list)
- Implement pagination for list endpoints (currently returns all results)
- Use a message queue (RabbitMQ/SQS) for notifications and audit logging
- Implement Angular lazy loading for route modules
- Add rate limiting middleware to prevent API abuse

**Q18: Explain the MVC pattern in your project.**
A: My project follows a simplified MVC:
- **Model:** Mongoose schemas (`models/` folder) — define data structure and validation
- **View:** Angular components (`pages/` folder) — render the UI
- **Controller:** Express route handlers (`routes/` folder) — process requests, interact with models, return responses

Note: Currently routes combine controller logic. In production, you'd split routes (URL mapping) from controllers (business logic) from services (reusable logic). The SRS document defines this as a Phase 2 refactor.

**Q19: Why did you choose Angular over React?**
A: Angular is a complete framework — it includes routing, HTTP client, form handling, guards, interceptors, and dependency injection out of the box. For a complex project with role-based routing, many forms, and multiple user interfaces, this is very productive. React would require adding React Router, Redux/Zustand, React Query, and other libraries. Angular's TypeScript-first approach also provides better tooling and compile-time error checking.

**Q20: How does data flow from the database to the UI?**
A: User clicks a button → Component calls a service method → Service uses Angular HttpClient to make HTTP request → Auth interceptor adds JWT header → Request reaches Express → Middleware verifies JWT and checks roles → Route handler runs → Mongoose queries MongoDB → Result returned as JSON → Response reaches Angular service → Service returns Observable → Component subscribes → Template renders data using Angular's change detection.

**Q21: What design patterns did you use?**
A:
- **Singleton:** Angular services are singletons (providedIn: 'root') — one instance shared across the app
- **Middleware Chain (Chain of Responsibility):** Express middleware pipeline — each middleware processes and passes to the next
- **Observer:** Angular's HttpClient returns Observables; components subscribe to data streams
- **Guard:** Route guards protect routes based on authentication and role
- **Interceptor:** HTTP interceptors modify requests/responses transparently
- **Repository:** Mongoose models abstract database operations behind a clean API

**Q22: How do you manage state in Angular?**
A: I use Angular Signals for reactive state — `currentUser` signal in AuthService and `vitals` signal in HealthScoreService. When the signal value changes, any component reading it automatically re-renders. For server state, services fetch data via HttpClient and components store it locally. For complex global state, you could add NgRx or SignalStore in a production app.

### Database Questions (5 Qs)

**Q23: Explain your database schema design.**
A: 14 MongoDB collections. Core entities: User (authentication), Patient (demographics). Clinical entities: Appointment, ClinicalRecord, Prescription, Screening. Financial entities: Invoice, InsurancePolicy, Claim. Operational: LabPackage, LabOrder, Consultation, Notification, AuditLog. Relationships use ObjectId refs with Mongoose `.populate()`. The design prioritizes embedding where data is always read together (invoice items inside invoice) and referencing where data is shared across collections (patient referenced by appointments, records, prescriptions, invoices, etc.).

**Q24: What is the difference between embedding and referencing in MongoDB?**
A:
- **Embedding:** Nested documents inside a parent document (e.g., invoice items are embedded inside the invoice). Good for data that's always accessed together, has a one-to-many relationship with bounded growth, and doesn't need independent querying.
- **Referencing:** Storing ObjectId and using `.populate()` (e.g., appointment references patient by ID). Good for shared entities, unbounded arrays, and when you need to query the sub-document independently.
- In my project: items, payments, and documents are embedded; patient, doctor, and user references are ObjectId links.

**Q25: How would you optimize database queries in your project?**
A:
- Add indexes on frequently queried fields: `Patient { name: 'text', phone: 'text' }` (already using regex, but text index is faster), `Appointment { doctor: 1, date: 1 }`, `Invoice { patient: 1, status: 1 }`
- Add pagination to list endpoints (`.skip()` and `.limit()`)
- Use `.select()` to return only needed fields
- Use `.lean()` for read-only queries (returns plain JS objects, faster)
- Implement MongoDB aggregation pipeline with `$lookup` instead of multiple `.populate()` calls for complex queries
- Add Redis caching for frequently accessed data

**Q26: Why is the AuditLog actor denormalized?**
A: The actor in AuditLog stores `{id, name, role}` as a snapshot at the time of the action. This is intentional denormalization. If we only stored the user ID and populated it, the audit trail would change if the user is renamed or deleted later. By snapshotting the actor data, the audit log remains historically accurate — it shows exactly who performed the action at that time, with their name and role as they were then.

**Q27: Explain Mongoose schema validation.**
A: Mongoose schemas define validation rules: `required: true` ensures a field is present, `enum: [...]` restricts values to a predefined set, `unique: true` prevents duplicates, `default: value` sets a fallback value, and `type` enforces the data type (String, Number, Date, Boolean, ObjectId). This validation runs at the application layer before data reaches MongoDB, providing a first line of defense against invalid data.

### HR / General Questions (15 Qs)

**Q28: Tell me about yourself and your project.**
A: I'm a B.Tech Computer Engineering student, and I built HealthBridge — a full-stack healthcare management platform. It's a complete clinical system where doctors can manage patients, create prescriptions, run health screenings, and handle billing, while patients get a personal portal to book lab tests, track their health, and consult doctors online. I built it using the MEAN stack — MongoDB, Express, Angular 17, and Node.js — with JWT authentication and role-based access control for 4 different user roles. The project has 14 database collections, 61 API endpoints, and 18 features covering the full clinical workflow. I built it from scratch, wrote every line of code myself, and it represents my understanding of full-stack web development.

**Q29: What was your role in this project?**
A: I was the sole developer. I designed the architecture, chose the technology stack, wrote all the backend code (14 models, 13 route modules, 4 middleware, 2 utilities), all the frontend code (14 services, 30+ components, guards, interceptors), designed the database schema, implemented all 18 features, and created the complete documentation.

**Q30: What was the most challenging part?**
A: The most challenging part was implementing proper role-based access control at three levels — route (Angular guards), UI (conditional rendering), and API (middleware + data scoping). Making sure a patient can never access another patient's data, even by manipulating API calls directly, required careful design. Another challenge was the invoice calculation engine — ensuring all money fields (subtotal, tax, discount, total, amountPaid, status) stay consistent when items or payments change.

**Q31: What did you learn from this project?**
A: I learned:
- How to design a full-stack application architecture from scratch
- The importance of security (JWT, bcrypt, RBAC, input validation)
- MongoDB schema design — when to embed vs reference
- Angular concepts: standalone components, signals, guards, interceptors, reactive forms
- How to build a RESTful API with proper error handling
- The value of an audit trail for compliance
- How to think about user workflows — different roles need different interfaces

**Q32: If you had to do it again, what would you change?**
A:
- Refactor backend into controller-service-model layers for cleaner separation of concerns
- Add TypeScript to the backend (currently JavaScript)
- Implement proper pagination from the start
- Add unit tests and integration tests
- Use environment-based configuration for the API base URL (currently hardcoded)
- Add refresh token rotation for better security
- Implement WebSocket for real-time notifications instead of polling

**Q33: How did you test your project?**
A: Currently, I tested manually by running all the user flows — registering as each role, creating patients, booking appointments, creating records, generating invoices, running screenings, etc. For production, I would add: unit tests (Jest for backend, Jasmine/Karma for Angular), integration tests (Supertest for API endpoints), and end-to-end tests (Cypress or Playwright).

**Q34: How do you keep your code organized?**
A: Backend: separate folders for config, models, routes, middleware, utils. One file per model, one file per route module. Frontend: separate folders for models, services, guards, interceptors, pages, shared. One folder per feature page. Services follow the same naming convention across the entire app (e.g., patient.service.ts, appointment.service.ts, etc.). This makes the codebase predictable and easy to navigate.

**Q35: What is the biggest feature you are proud of?**
A: The Health Screening engine. It takes raw vitals input and computes BMI, categorizes it, calculates a risk score using an additive model considering weight, blood pressure, smoking, and diabetes, then generates personalized lifestyle recommendations. The entire computation happens server-side with a clear, well-documented algorithm. It shows I can implement real clinical logic, not just CRUD operations.

**Q36: Is this a college project or a real product?**
A: This is an educational/portfolio project that demonstrates production-grade software engineering. While it's not deployed in a real clinic, it implements features and security measures that real healthcare software requires — JWT authentication, role-based access, audit logging, file upload security, password hashing. The architecture and code quality are at a level suitable for a real product.

**Q37: How long did it take to build?**
A: The project was built in phases. Phase 1 covered authentication, RBAC, patients, appointments, records with document upload, and screening. Phase 2 added prescriptions, billing, insurance, analytics, audit logs, and the complete patient portal. Each phase represents focused development effort with testing and documentation.

**Q38: How would you deploy this project?**
A:
- Frontend: Build Angular app → host on Netlify/Vercel or AWS S3 + CloudFront CDN
- Backend: Deploy on AWS EC2/ECS or a VPS running Node.js with PM2 process manager
- Database: MongoDB Atlas (managed cloud MongoDB)
- Environment: Use proper secret management (AWS Secrets Manager or environment variables)
- Domain: Point a domain name with HTTPS (Let's Encrypt or AWS Certificate Manager)
- CI/CD: GitHub Actions for automated build + deploy on push

**Q39: What's your understanding of HIPAA compliance?**
A: HIPAA (Health Insurance Portability and Accountability Act) is a US law that sets standards for protecting sensitive patient health information. Key requirements include: access controls (our RBAC), audit controls (our AuditLog), authentication (our JWT), encryption in transit (HTTPS), and integrity controls. HealthBridge implements several HIPAA-aligned practices: immutable audit trail, role-based access, password hashing, file type/size restrictions, and no logging of sensitive data. For full compliance, we'd need to add: encryption at rest, automatic logoff, emergency access procedures, and a Business Associate Agreement (BAA) with cloud providers.

**Q40: How do you handle mobile responsiveness?**
A: The Patient Portal is designed mobile-first with a layout that works well on smaller screens. The Provider Console uses a sidebar layout suitable for desktop/tablet use. In production, the patient portal could be wrapped with Capacitor to create native iOS/Android apps from the same Angular codebase.

**Q41: Why should we hire you?**
A: I've demonstrated through this project that I can design, build, and document a complete full-stack application independently. I understand not just how to write code, but why certain architectural decisions matter — security, scalability, maintainability. I chose technologies based on requirements, not trends. I implemented real features (not just CRUD) like a health risk calculator and audit trail. I think about the bigger picture: user roles, data privacy, compliance. I'm ready to contribute to a real development team from day one.

**Q42: Where do you see this project going in the future?**
A: Phase 3 would add: AI-powered vision screening (image analysis for cataract/diabetic retinopathy detection), WebRTC-based video consultation with chat, an AI diet plan generator, e-pharmacy integration, and push notifications. Phase 4 would focus on: multi-clinic/tenant support, FHIR standard data export for healthcare interoperability, CI/CD pipeline, comprehensive test suite, and a mobile app using Capacitor.

### Stack-Specific Questions (8 Qs)

**Q43: Why MEAN and not MERN (React)?**
A: Angular provides everything built-in (routing, forms, HTTP, guards, interceptors) which is productive for a complex, form-heavy healthcare application. React requires adding many third-party libraries. For a placement project showing full-stack skills, Angular's comprehensive framework demonstrates understanding of enterprise-level frontend architecture.

**Q44: Why Express and not Fastify or NestJS?**
A: Express is the most popular Node.js framework, with the largest ecosystem and the most learning resources. For a B.Tech project, it's important to learn industry-standard tools. NestJS would add unnecessary complexity for this scope (decorators, modules, providers). Fastify is great for performance but has a smaller community.

**Q45: Why bcryptjs and not bcrypt?**
A: `bcryptjs` is a pure JavaScript implementation that works cross-platform without native compilation. The native `bcrypt` package requires Python and C++ build tools on Windows. For ease of development across different machines, `bcryptjs` is more portable. The security is identical — both implement the same bcrypt algorithm.

**Q46: What is the difference between NoSQL and SQL databases?**
A:
- **SQL (MySQL, PostgreSQL):** Table-based, fixed schema, uses JOINs for relationships, ACID transactions, good for structured data with complex relationships. Schema must be defined upfront.
- **NoSQL (MongoDB):** Document-based, flexible schema, uses embedding/referencing for relationships, horizontally scalable, good for semi-structured data and rapid iteration. Schema can evolve.
- For HealthBridge, MongoDB fits because healthcare data varies by type — a lab order looks very different from a prescription, and embedding items inside parent documents (invoice items) is natural.

**Q47: What is an Observable in Angular?**
A: An Observable is a stream of data that can be observed over time. Angular's HttpClient returns Observables for HTTP requests. You subscribe to them to get the data when it arrives. Key concepts: Observables are lazy (no request until subscribed), can emit multiple values (unlike Promises which resolve once), can be cancelled (unsubscribed), and have powerful operators (map, filter, tap, catchError) for transforming data streams.

**Q48: Explain Angular Signals.**
A: Signals are Angular's new reactive primitive. A signal is a wrapper around a value that notifies interested consumers when the value changes. I use `signal<User | null>(null)` to store the current user. When `currentUser.set(newUser)` is called, any component reading `currentUser()` automatically re-renders. Key advantages over traditional change detection: fine-grained updates (only affected parts re-render), no need for manual subscription management, and better performance.

**Q49: What is middleware in Express?**
A: Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the next middleware function (`next`). They execute in order and can: modify req/res, end the request-response cycle, or call the next middleware. My project has these middleware: `cors()` (cross-origin), `express.json()` (parse body), `express.static()` (serve files), `auth` (JWT verify), `role(...)` (RBAC check), `auditLogger` (auto-log writes), and `upload` (file handling).

**Q50: How would you add real-time features to this project?**
A: I would use Socket.IO for real-time communication. Use cases: real-time notifications (instead of polling), live order status updates (lab tracker), chat during teleconsultation, and WebRTC signaling for video calls. Socket.IO works with Express — you attach it to the same HTTP server. Authentication would use the same JWT token passed as a handshake parameter. This is already planned in the SRS for Phase 3.

---

## 11. Resume Description

### 1-Line Description
> Built HealthBridge — a full-stack healthcare management platform (MEAN stack) with 18 features, 61 APIs, RBAC for 4 roles, JWT auth, and an automated audit trail system.

### 2-Line Description
> Developed HealthBridge, a comprehensive clinical management ecosystem using Angular 17, Node.js, Express, and MongoDB. Implemented dual portals (Provider Console + Patient Portal), role-based access control for 4 user roles, e-prescriptions, billing, insurance claims, health screening engine, lab booking, teleconsultation, and a tamper-evident audit system.

### 4-Line Description
> **HealthBridge — Integrated Patient Engagement & Clinical Management Ecosystem**
> - Built a full-stack MEAN application with 14 MongoDB collections, 61 REST API endpoints, and 30+ Angular 17 standalone components.
> - Implemented JWT authentication with bcrypt password hashing and 3-layer role-based access control (Admin, Doctor, Staff, Patient) enforced at route, UI, and API levels.
> - Key features: Patient EMR with document uploads, e-Prescriptions (dynamic drug builder), itemized billing with payment tracking, insurance claims workflow, health screening engine (BMI + risk scoring), lab catalog & booking with status tracking, teleconsultation with video rooms, HealthScore & health trackers, analytics dashboard, and an automatic immutable audit trail.
> - Tech: Angular 17 (standalone components, signals, guards, interceptors), Node.js + Express, MongoDB + Mongoose, JWT + bcrypt, Multer file uploads.

### ATS-Friendly Keywords
```
Full-Stack Development | MEAN Stack | Angular 17 | Node.js | Express.js | MongoDB | Mongoose | TypeScript | JavaScript | REST API | JWT Authentication | bcrypt | Role-Based Access Control (RBAC) | Healthcare IT | EMR/EHR | Patient Portal | Clinical Management System | Prescription Management | Billing System | Insurance Claims | Health Screening | Lab Management | Teleconsultation | Audit Logging | Angular Signals | Angular Guards | Angular Interceptors | Reactive Forms | HTTP Client | File Upload (Multer) | Database Design | Schema Design | API Design | Error Handling | Cross-Origin Resource Sharing (CORS) | Git Version Control
```

---

## 12. Elevator Pitch

### 30-Second Explanation (Elevator Pitch)

"HealthBridge is a full-stack healthcare management platform I built using the MEAN stack — MongoDB, Express, Angular 17, and Node.js. It has two sides: a clinical console where doctors and staff manage patients, appointments, prescriptions, billing, and insurance, and a patient portal where patients can book lab tests, track their health vitals, and consult doctors online. I implemented role-based access control for 4 roles, JWT authentication with encrypted passwords, 61 API endpoints, and an automatic audit trail that records every change in the system. It covers the complete workflow of a modern medical clinic."

### 1-Minute Explanation

"My project is called HealthBridge — it's an integrated patient engagement and clinical management ecosystem. The problem it solves is that many clinics still use paper records or disconnected software, making it hard for doctors to access patient history and for patients to manage their own health.

I built it using the MEAN stack: MongoDB for the database, Express and Node.js for the backend API, and Angular 17 for the frontend. The application has two separate interfaces: a Provider Console for doctors, admin, and staff — which includes modules for patient registration, appointment scheduling, electronic medical records with document uploads, e-prescriptions with a dynamic drug builder, itemized billing with payment tracking, insurance policies and claims, and a health screening engine that computes BMI and cardiovascular risk.

The Patient Portal lets patients book lab tests from a catalog, track their health vitals like steps, blood sugar, and blood pressure — and get a composite HealthScore. They can also request teleconsultations with doctors and view their own medical records.

On the security side, I implemented JWT authentication with bcrypt password hashing, three-layer role-based access control enforced at the route, UI, and API levels, and an automatic audit trail that records every write action with who did it, what they changed, and when — creating a tamper-evident compliance log. The whole system has 14 database collections, 61 API endpoints, and was built entirely by me from scratch."

### 3-Minute Explanation (Full Project Walkthrough)

"Let me walk you through my project HealthBridge in detail.

**The Problem:**
Healthcare in India and many countries still relies on paper-based records or fragmented software. A patient's medical history, lab reports, prescriptions, and billing are scattered across different systems. HealthBridge solves this by bringing everything onto a single platform.

**Architecture Overview:**
I used the MEAN stack — MongoDB, Express.js, Angular 17, and Node.js. Why this stack? MongoDB's flexible document model handles diverse healthcare data well — a prescription document looks very different from an invoice document. Express gives me a lightweight, fast REST API. Angular 17 provides a complete frontend framework with everything I need built in — routing, forms, HTTP client, guards, and interceptors. And Node.js means JavaScript across the whole stack.

**The Two Portals:**
The application has two separate interfaces. The Provider Console is for clinic staff — it has a sidebar navigation and modules for patient registration with search, appointment scheduling with status workflows, electronic medical records where doctors can attach uploaded documents, e-prescriptions where you can dynamically add multiple drugs with dosage, frequency, and instructions, and view a printable prescription. There's also itemized billing with tax and discount calculations, payment recording via cash, card, or UPI, insurance policies and claims with approval workflows, and a health screening engine.

The health screening is particularly interesting — you input vitals like height, weight, blood pressure, smoking status, and diabetes status, and the server computes BMI, categorizes it, calculates an additive risk score, determines a risk level from Low to High, and generates personalized lifestyle recommendations automatically.

The Patient Portal is the consumer-facing side — patients see a dashboard with their HealthScore, they can browse a lab test catalog filtered by category or organ, book tests with home collection scheduling, track their order status through a stepper from 'booked' to 'report ready', request teleconsultations with doctors via video rooms, log daily health vitals like steps, sugar, weight, blood pressure, and heart rate to compute a HealthScore from 0 to 100 with personalized advice, and view their own medical history.

**Security Implementation:**
Security was a top priority. I implemented JWT authentication — when a user logs in, the server creates a signed token containing their ID, name, and role. This token expires after 7 days. Every subsequent request automatically carries this token via an Angular HTTP interceptor. The backend's auth middleware verifies it on every protected route. Passwords are never stored in plain text — they're hashed with bcrypt using 10 salt rounds.

The role-based access control works at three levels: Angular route guards prevent unauthorized navigation, the `hasRole()` method conditionally shows or hides UI elements, and the backend `role()` middleware blocks unauthorized API access. Additionally, data is scoped — patients can only ever see their own records. The API checks the logged-in user's ID against the resource owner before returning data.

I also built an automatic audit logging system. Every write action — creating a patient, updating a record, deleting an appointment — is automatically recorded with who did it, what entity was affected, which HTTP method was used, the response status, the IP address, and the exact timestamp. The actor's name and role are snapshotted so the trail stays accurate even if the user is later renamed. This creates a tamper-evident compliance trail similar to what real healthcare systems require.

**Scale and Complexity:**
The system has 14 database collections, 61 API endpoints across 13 route modules, and 30+ Angular components. I built everything from scratch — designed the architecture, wrote all the code, created the documentation. The project demonstrates my understanding of full-stack development, database design, security principles, and user experience design for different roles."

---

## 13. Project Challenges

### Challenge 1: Implementing Proper RBAC Beyond Middleware
**Problem:** Most tutorials show RBAC as just middleware checking roles, but real RBAC needs three layers: routing (can't even navigate to the page), UI (unauthorized buttons hidden), and API (backend enforcement). Plus, within the API, patients should only see their own data — not just be blocked from endpoints.

**Solution:** 
- Angular route guards check role before route activation
- `AuthService.hasRole()` used in templates with `*ngIf` to conditionally render UI
- Backend `role()` middleware blocks unauthorized endpoints
- Data scoping in route handlers: patients get `filter.bookedBy = req.user.id` or `filter.patient = self._id`
- The `getOrCreateSelfPatient()` utility bridges the gap between a User account and a Patient record

### Challenge 2: Invoice Money Field Consistency
**Problem:** An invoice has five interdependent money fields: subtotal (sum of items), total (subtotal + tax - discount), amountPaid (sum of payments), and status (derived from comparing total and amountPaid). If these get out of sync, the invoice shows wrong data.

**Solution:** Created a `recalc()` function that recomputes ALL fields from their source data every time an invoice is saved. Items' amounts are computed from qty × unitPrice, subtotal from items, total from subtotal + tax - discount, amountPaid from payments, and status from the comparison. This function runs before every save, ensuring consistency. The function is the single source of truth for all money calculations.

### Challenge 3: Patient-User Bridge (Self-Patient)
**Problem:** When a patient registers as a User (for login), they need a linked Patient record (for clinical data). But a provider might have already created a Patient record with the same email. Or the patient might be brand new with no Patient record at all.

**Solution:** The `getOrCreateSelfPatient()` utility implements a three-step resolution:
1. Find a Patient already linked via the `user` field → return it
2. Find a Patient with the same email (probably onboarded by a provider) → link it by setting `patient.user = user.id` → return it
3. Neither exists → create a minimal Patient record from the User's info → return it
This ensures every patient user always has a Patient record, enabling seamless access to their clinical data.

### Challenge 4: Automated Audit Logging Without Breaking Requests
**Problem:** We need to log every write action automatically, but if the audit logging fails (e.g., database is briefly unavailable), we can't let it break the actual request. Patients don't care about audit logs — they care about their appointment being booked.

**Solution:** The `auditLogger` middleware listens for the response `finish` event (after the client has already received the response). The `AuditLog.create()` call is wrapped in `.catch(() => {})` — any error is silently swallowed. This means the audit log is best-effort: it works 99.9% of the time, but a logging failure never affects the user experience. Additionally, request bodies are intentionally NOT stored to avoid logging sensitive data (passwords, PHI).

### Challenge 5: Dual UI from One Codebase
**Problem:** Providers need a desktop sidebar-navigation interface. Patients need a mobile-first portal interface. These are completely different layouts, navigations, and feature sets — but they share services, models, guards, and the same backend API.

**Solution:** Angular's route hierarchy with role guards. The route config defines two top-level groups: `path: ''` (provider console) with `LayoutComponent` + sidebar, guarded by `roleGuard('admin', 'doctor', 'staff')`, and `path: 'portal'` (patient portal) with `PortalLayoutComponent`, guarded by `roleGuard('patient')`. The role guard redirects users to the correct area after login. Both areas share the same services (which call the same API), models (TypeScript interfaces), and interceptors.

### Learning Outcomes
1. **Think in layers:** Security needs defense in depth — guard the route, hide the UI, and enforce on the backend
2. **Single source of truth:** For computed values (like invoice totals), a single recalc function prevents inconsistencies
3. **Fail gracefully:** Audit logging and notifications should never break the main user flow
4. **Denormalize for history:** Snapshot actor data in audit logs so history stays accurate
5. **Design for roles from the start:** Retrofitting RBAC is painful — design it into the architecture early

---

## 14. Future Enhancements

### 14.1 Scalability Improvements

| Improvement | Description | Priority |
|-------------|-------------|----------|
| Backend Refactor | Split routes into controller-service-model layers for cleaner separation | High |
| TypeScript Backend | Migrate backend from JavaScript to TypeScript for type safety | High |
| Pagination | Add `.skip()` and `.limit()` to all list endpoints | High |
| Database Indexing | Add indexes on frequently queried fields (patient name, appointment date, invoice status) | High |
| Redis Caching | Cache lab catalog, doctor list, and dashboard data | Medium |
| Rate Limiting | Add rate limiting middleware to prevent API abuse | Medium |
| Refresh Tokens | Implement refresh token rotation for longer sessions without re-login | Medium |

### 14.2 Additional Features (Phase 3-4)

| Feature | Description |
|---------|-------------|
| SOAP Clinical Notes | Structured Subjective/Objective/Assessment/Plan notes with ICD-10 codes |
| Drug Interaction Alerts | Check for drug-drug interactions when prescribing |
| AI Vision Screening | Eye image analysis for cataract/diabetic retinopathy detection |
| AI Diet Plan Generator | Personalized 7-day meal plans based on health profile |
| Payment Gateway | Integrate Razorpay/Stripe for real payments |
| SMS/WhatsApp Notifications | Multi-channel notification delivery (Twilio/Gupshup) |
| E-Pharmacy | Medicine ordering with prescription verification |
| Digital Signatures | e-Sign consent forms with hash verification |
| FHIR Export | Export patient data in standard FHIR format for interoperability |
| Mobile App | Wrap Angular app with Capacitor for iOS/Android |

### 14.3 Production-Level Upgrades

| Upgrade | Description |
|---------|-------------|
| HTTPS | Add SSL/TLS certificate for encrypted data in transit |
| Helmet.js | Add security headers (CSP, X-Frame-Options, etc.) |
| Input Validation Library | Use Joi/Zod for request body validation with detailed error messages |
| Centralized Error Handling | Create a global error handler middleware with consistent error format |
| CI/CD Pipeline | GitHub Actions for automated testing, building, and deployment |
| Docker | Containerize the application with Docker + Docker Compose |
| Monitoring | Add Sentry for error tracking, Prometheus + Grafana for metrics |
| Unit Tests | Jest for backend, Jasmine/Karma for Angular |
| E2E Tests | Cypress or Playwright for end-to-end testing |
| Environment Configs | Separate dev/staging/production configurations |
| Logging | Proper logging library (Winston/Pino) with log levels and rotation |

---

## 15. Viva Preparation Notes

### 15.1 Important Concepts to Remember

| Concept | What to Say |
|---------|-------------|
| **MEAN Stack** | MongoDB (NoSQL database) + Express (Node.js web framework) + Angular (frontend framework) + Node.js (JavaScript runtime). End-to-end JavaScript. |
| **JWT (JSON Web Token)** | A compact, URL-safe token that contains user info (id, name, role). Signed server-side, verified on every request. Stateless — no session storage needed. Expires in 7 days. |
| **bcrypt Hashing** | One-way password hashing algorithm. Uses salt (random data) to prevent rainbow table attacks. 10 salt rounds = 1024 iterations. Even if DB is leaked, passwords can't be reversed. |
| **RBAC** | Role-Based Access Control. Three levels: route guards (Angular), UI gating (conditional rendering), API middleware (Express). Roles: admin, doctor, staff, patient. |
| **Mongoose ODM** | Object Data Mapper for MongoDB. Provides schema validation, reference management (ref + populate), middleware, and a cleaner API than raw MongoDB driver. |
| **Angular Standalone Components** | Components that don't need NgModules. Simpler, more modern. Used throughout HealthBridge. |
| **Angular Signals** | Reactive state primitive. `signal(value)` creates reactive wrapper. Calling `signal()` reads value. `signal.set(newVal)` updates. Fine-grained reactivity — only affected components re-render. |
| **HTTP Interceptors** | Angular feature that intercepts all HTTP requests/responses. I use it to auto-attach the JWT token to every request. |
| **Route Guards** | Angular feature that controls navigation. `canActivate` runs before route loads. I use `authGuard` (logged in?) and `roleGuard` (right role?). |
| **Middleware** | Express functions with access to req, res, next. Execute in pipeline order. Can modify request, end response, or pass to next middleware. |
| **Audit Trail** | Immutable log of who did what and when. Security + compliance. Actors are snapshotted (not just referenced) so history stays accurate. |
| **MongoDB Embedding vs Referencing** | Embed when data is always accessed together (invoice items inside invoice). Reference when data is shared (patient referenced by many collections). |
| **BMI Calculation** | weight(kg) / height(m)². Categories: <18.5 Underweight, 18.5-25 Normal, 25-30 Overweight, >30 Obese. |
| **CORS** | Cross-Origin Resource Sharing. Allows Angular (port 4200) to call Express (port 5000). Without it, browser blocks the request. |

### 15.2 Frequently Asked Viva Questions

1. **"Why did you choose MongoDB?"** → Healthcare data is semi-structured. Flexible document model fits different entity types. Mongoose adds schema validation and reference management.

2. **"How does authentication work?"** → User logs in → Server verifies email+password (bcrypt.compare) → Creates JWT with user id, name, role → Frontend stores in localStorage → Every request: interceptor adds Bearer token → Backend auth middleware verifies JWT → Sets req.user → Role middleware checks permissions.

3. **"Explain your database relationships."** → Patient is the central entity — referenced by Appointments, Records, Prescriptions, Invoices, Screenings, Insurance Policies. User (doctor) is referenced by Appointments, Records, Prescriptions. Relationships use ObjectId refs resolved with Mongoose .populate().

4. **"How do you handle errors?"** → Try-catch in every route handler. Return appropriate HTTP status codes. Backend audit logger skips errors. Frontend services handle errors with RxJS catchError.

5. **"What security features did you implement?"** → JWT auth, bcrypt password hashing, RBAC at 3 levels, file type+size restrictions, CORS, audit trail, generic error messages (prevent enumeration), secrets in .env, passwords never in API responses.

6. **"How does the screening risk calculator work?"** → Server-side function. Computes BMI from height and weight. Adds risk points for: weight category, blood pressure, smoking, diabetes. Maps total to Low/Medium/High. Generates recommendations for each risk factor.

7. **"What are Angular Services?"** → Singletons (providedIn: 'root'). Used for business logic, HTTP calls, and shared state. Injected via dependency injection into components. My project has 15 services — one per feature module.

8. **"How does the patient portal differ from the provider console?"** → Different layouts (portal vs sidebar), different navigation, different features. Provider console has clinical modules. Patient portal has lab booking, health trackers, and teleconsult. Both share the same services and backend APIs.

9. **"What would you improve?"** → Add TypeScript to backend, add tests, refactor to controller-service layers, add pagination, implement refresh tokens, add real-time notifications via WebSocket.

10. **"Explain your project in 2 minutes."** → Use the 1-minute elevator pitch from Section 12.

### 15.3 Quick Revision Sheet

```
🏥 HEALTHBRIDGE — QUICK FACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stack:       Angular 17 + Node.js/Express + MongoDB
Language:    TypeScript (FE) + JavaScript (BE)
Auth:        JWT (jsonwebtoken) + bcrypt (bcryptjs)
ODM:         Mongoose 9.7
File Upload: Multer 2.2

Database:    healthbridge (MongoDB)
Collections: 14 (users, patients, appointments, clinicalrecords,
             prescriptions, invoices, insurancepolicies, claims,
             screenings, labpackages, laborders, notifications,
             consultations, auditlogs)

API Routes:  13 modules, 61 endpoints
Base URL:    http://localhost:5000/api

Roles:       admin, doctor, staff, patient

Frontend:    Provider Console (sidebar) + Patient Portal
Components:  30+ standalone components
Services:    15 services
Guards:      authGuard, roleGuard
Interceptor: authInterceptor (adds JWT)

HEALTH SCREENING MATH:
  BMI = weight/(height/100)²
  Risk score = weight(1-2) + BP(1-2) + smoker(2) + diabetic(2)
  Low(0-1) / Medium(2-3) / High(4+)

INVOICE CALCULATION:
  item.amount = qty * unitPrice
  subtotal = Σ items
  total = subtotal + tax - discount
  amountPaid = Σ payments
  status: unpaid(0) / partial(<total) / paid(≥total)

KEY MIDDLEWARE ORDER:
  cors → json → auditLogger → auth → role → handler
```

---

## 16. Cheat Sheet

### 16.1 Architecture Summary

```
Browser (Angular 17, port 4200)
  │
  │ HTTP + JWT Bearer token
  ▼
Express API (Node.js, port 5000)
  │ cors → json → auditLogger → routes
  │
  ├── /api/auth → register, login
  ├── /api/users → list (doctor dropdown)
  ├── /api/patients → CRUD + search + self
  ├── /api/appointments → CRUD + status workflow
  ├── /api/records → CRUD + file upload
  ├── /api/prescriptions → CRUD (drug builder)
  ├── /api/invoices → CRUD + payments
  ├── /api/insurance → policies + claims
  ├── /api/lab → packages + orders
  ├── /api/notifications → read/unread
  ├── /api/consultations → video rooms
  ├── /api/analytics → dashboard KPIs
  ├── /api/audit → view trail (admin)
  └── /api/screening → BMI + risk compute
  │
  │ Mongoose ODM
  ▼
MongoDB (27017) → healthbridge database → 14 collections
```

### 16.2 Database Summary

```
users              → { name, email(unique), password(hashed), role }
patients           → { name, age, gender, phone, email, address, bloodGroup }
appointments       → { patient→Patient, doctor→User, date, status }
clinicalrecords    → { patient→Patient, doctor→User, diagnosis, documents[] }
prescriptions      → { patient→Patient, doctor→User, items[{drug,...}] }
invoices           → { invoiceNumber, patient, items[], payments[], total, status }
insurancepolicies  → { patient, payerName, policyNumber, coverageAmount }
claims             → { claimNumber, policy→Policy, patient, amountClaimed, status }
screenings         → { patient, heightCm, weightKg, bmi(auto), riskLevel(auto) }
labpackages        → { name, tests, price, mrp, category }
laborders          → { orderNumber, bookedBy, items[], total, status }
notifications      → { user→User, type, title, body, read }
consultations      → { requestedBy, doctor, roomId, status, summary }
auditlogs          → { actor{id,name,role}, action, entity, entityId, ip, at }
```

### 16.3 APIs Summary

| Module | Endpoints | Key Feature |
|--------|-----------|-------------|
| Auth | 2 | Register + Login with JWT |
| Users | 1 | List users (doctor dropdown) |
| Patients | 6 | CRUD + search + self-patient resolution |
| Appointments | 5 | Book/request + status workflow + notifications |
| Records | 6 | CRUD + document upload (Multer, 5MB, pdf/jpg/png/doc) |
| Prescriptions | 5 | CRUD with dynamic drug builder items |
| Invoices | 6 | CRUD + payment recording + auto-status |
| Insurance | 10 | Policies (5) + Claims (5) with approval workflow |
| Lab | 5 | Catalog browsing + order booking + status tracking |
| Notifications | 4 | Get own, unread count, mark read, mark all read |
| Consultations | 6 | Doctor list + request + video room + summary |
| Analytics | 1 | Dashboard KPIs: counts, revenue, trends, recent |
| Audit | 1 | View trail (admin only, filterable) |
| Screening | 3 | Compute BMI + risk + recommendations server-side |
| **Total** | **61** | |

### 16.4 Features Summary

```
✅ Authentication          → JWT + bcrypt, 7-day expiry
✅ RBAC                   → 4 roles, 3-layer enforcement
✅ Patient Management     → CRUD + search (name/phone regex)
✅ Appointments           → Book/request, confirm/decline, notifications
✅ Clinical Records       → EMR with document uploads (Multer)
✅ Prescriptions          → Dynamic drug builder, printable view
✅ Billing & Invoices     → Itemized, tax/discount, payments, auto-status
✅ Insurance              → Policies + claims workflow
✅ Health Screening       → Server-side BMI + risk + recommendations
✅ Lab Catalog & Booking  → Category filters, organ browsing, status tracker
✅ Teleconsultation       → Video rooms, status workflow, post-call summary
✅ Notifications          → In-app bell, unread count, auto-alerts
✅ HealthScore & Trackers → 6 vitals, composite score 0-100, localStorage
✅ Analytics Dashboard    → KPIs, revenue, trends, recent activity
✅ Audit Logging          → Automatic, immutable, snapshotted actors
✅ Dual Portal            → Provider Console + Patient Portal, one codebase
```

---

## 📄 Appendix: Useful Commands

```bash
# Start MongoDB (Windows)
mongod

# Start Backend (from backend/ folder)
npm run dev          # Runs with nodemon (auto-restart on changes)

# Start Frontend (from frontend/ folder)
ng serve             # Opens at http://localhost:4200

# Seed Lab Packages (from backend/ folder)
node seed/seedLabPackages.js

# Check MongoDB data
mongosh
use healthbridge
show collections
db.users.find().pretty()
db.patients.countDocuments()
```

---

> **End of HealthBridge Project Documentation**  
> *Built with ❤️ for interview and viva preparation. Good luck! 🚀*

---

*This document covers the complete HealthBridge project with 16 sections, 50 interview Q&As, resume descriptions, elevator pitches, and quick-reference cheat sheets. Practice explaining the architecture diagram, the RBAC flow, and the screening algorithm — these are most likely to impress interviewers.*
