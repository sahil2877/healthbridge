# 🏥 HealthBridge — Complete Project Documentation (Hinglish)
### Interview, Viva, Resume & Placement Preparation ke liye

---

> **Document Type:** Comprehensive Project Documentation (Hinglish)  
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

### 1.2 Problem Statement (Problem Kya Hai?)

India aur duniya ke kai hisso mein, healthcare clinics aaj bhi paper-based records ya alag-alag software use karte hain. Ek patient ka medical history, lab reports, prescriptions, appointments, aur billing sab alag-alag jagah pade hote hain — ya toh physical files mein, ya phir disconnected systems mein. Isse kai problems create hoti hain:

- **Patient ka pura medical history** ek jagah nahi dikhta — doctor ko har baar sab scratch se dekhna padta hai
- Doctors ka time waste hota hai purani records aur lab reports dhundhne mein
- Patients ghar se online lab tests book nahi kar sakte, appointments nahi le sakte
- Billing aur insurance claims manual hote hain, errors ka chance rehta hai
- Patients apna health track nahi kar sakte (BP, sugar, weight monitoring)
- **Audit trail** nahi hai — pata nahi chalta kisne kya change kiya aur kab kiya
- Different clinics different software use karte hain — data sharing impossible hai

**HealthBridge yeh sab problems solve karta hai** ek single, unified web platform provide karke jismein:

- **Providers** (doctors, admin, staff) — patients manage karte hain, appointments book karte hain, clinical records (EMR) create karte hain, prescriptions likhte hain, billing handle karte hain, insurance claims process karte hain, health screenings run karte hain, aur analytics dekhte hain — sab ek dashboard mein
- **Patients** ko ek personal portal milta hai jismein woh lab tests book kar sakte hain, apna health vitals track kar sakte hain, prescriptions dekh sakte hain, doctor se teleconsultation le sakte hain, aur apna HealthScore check kar sakte hain

### 1.3 Objective (Uddeshya)

Ek full-stack healthcare management platform banana jo:

1. Poora clinical workflow digitalize kare — patient registration se lekar billing tak
2. Ek consumer-grade patient portal provide kare self-service ke liye (lab booking, health tracking)
3. Role-based access control implement kare 4 roles ke saath (admin, doctor, staff, patient)
4. Data security ensure kare JWT authentication, bcrypt password hashing, aur immutable audit trail se
5. Real-world software engineering skills demonstrate kare placement/internship interviews ke liye

### 1.4 Target Users (Kaun Kaun Use Karega?)

| Role | Kaun Hai Yeh? | Kya Karta Hai? |
|------|---------------|----------------|
| **Admin** | Clinic owner / manager | Users manage karna, analytics dekhna, audit logs access karna, system configure karna |
| **Doctor** | Practicing physician | Patient history dekhna, prescriptions likhna, clinical records banाना, health screenings run karna |
| **Staff** | Front-desk receptionist / billing clerk | Patients register karna, appointments book karna, invoices banाना, insurance handle karna |
| **Patient** | Koi bhi healthcare lene wala | Lab tests book karna, health vitals track karna, prescriptions dekhna, appointments request karna, teleconsultations lena |

### 1.5 Key Features (18 Modules)

| # | Module | Description |
|---|--------|-------------|
| 1 | **Authentication & Authorization** | JWT-based login/register with bcrypt password hashing |
| 2 | **Role-Based Access Control (RBAC)** | 4 roles ke alag-alag permissions — frontend (UI gating) aur backend (API middleware) dono pe enforced |
| 3 | **Patient Management** | Patients register karo with full demographics (name, age, gender, blood group, contact, address) + search functionality |
| 4 | **Appointment Scheduling** | Doctor-patient appointments book karo with date/time, status workflow (requested → scheduled → completed → cancelled) |
| 5 | **Clinical Records (EMR/EHR)** | Har patient visit ka medical record — diagnosis, prescription text, notes, aur document uploads (PDF, images, reports) |
| 6 | **Prescriptions (e-Rx)** | Dynamic medicine builder — drug name, dosage, frequency, duration, instructions + printable prescription view |
| 7 | **Billing & Invoices** | Itemized invoices with line items, tax, discount, payment recording (cash/card/UPI/wallet), status tracking (unpaid/partial/paid), aur printable invoices |
| 8 | **Insurance Management** | Insurance policies capture karo aur claims manage karo (draft → submitted → approved → rejected → paid) with amounts |
| 9 | **Health Screening Engine** | Server-computed BMI, risk score, risk level (Low/Medium/High), aur personalized lifestyle recommendations — vitals input ke basis pe |
| 10 | **Lab Catalog & Booking** | Patient-facing lab test catalog with category filters (Vitamins, Thyroid, Kidney, Liver, Allergy), organ-based booking, aur order status tracking (booked → collected → in_lab → report_ready) |
| 11 | **Teleconsultation** | Video room with unique room IDs; status workflow (requested → in_progress → completed → cancelled); doctor post-call summary |
| 12 | **Notifications System** | In-app notification center — appointment alerts, lab status updates, consultation requests — with read/unread tracking |
| 13 | **HealthScore & Trackers** | Patient-side vitals logging (steps, sugar, weight, BP, medicine, heart rate) — computed HealthScore (0-100) aur personalized advice |
| 14 | **Analytics Dashboard** | Provider-facing KPIs — total patients, doctors, appointments, revenue (billed vs collected), screening risk breakdown, patient trend chart, recent activity |
| 15 | **Audit Logging** | Automatic, tamper-evident trail of every write action — kisne kya kiya, konsa entity change hua, kab, kis IP se — sirf admin dekh sakta hai |
| 16 | **Role-Aware Dual Portal** | Ek hi Angular codebase do alag-alag UI areas serve karta hai: Provider Console (desktop sidebar nav) + Patient Portal (mobile-first portal) |

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

> **Simple mein samjho:** Angular browser mein chalta hai (frontend). Woh Express server se baat karta hai APIs ke through (backend). Express MongoDB se data leta hai aur deta hai (database). Teen layers — Presentation (Frontend), Application (Backend), Data (Database).

### 2.2 Frontend Flow (Angular 17)

```
User browser kholta hai → http://localhost:4200
│
├─ LOGIN NAHI KIYA HAI:
│  ├─ /login → LoginComponent (email + password form)
│  └─ /register → RegisterComponent (name + email + password + role dropdown)
│
└─ LOGIN KE BAAD (JWT localStorage mein store hota hai):
   │
   ├─ Role = admin / doctor / staff:
   │  └─ / → LayoutComponent (sidebar + topbar shell)
   │     ├─ /dashboard → Dashboard (KPIs, charts, stats)
   │     ├─ /patients → Patient List (search ke saath)
   │     │  ├─ /patients/new → Patient Form (naya patient)
   │     │  └─ /patients/:id/edit → Edit Patient
   │     ├─ /appointments → Appointments List
   │     │  ├─ /appointments/new → Book Appointment
   │     │  └─ /appointments/:id/edit → Edit Appointment
   │     ├─ /records → Clinical Records
   │     │  ├─ /records/new → New Record (diagnosis + file upload)
   │     │  └─ /records/:id/edit → Edit Record
   │     ├─ /prescriptions → Prescriptions List
   │     │  ├─ /prescriptions/new → Create Rx (drug builder)
   │     │  ├─ /prescriptions/:id → View Rx (printable)
   │     │  └─ /prescriptions/:id/edit → Edit Rx
   │     ├─ /invoices → Invoices List
   │     │  ├─ /invoices/new → Create Invoice (line items)
   │     │  ├─ /invoices/:id → View Invoice (print)
   │     │  └─ /invoices/:id/edit → Edit Invoice
   │     ├─ /screening → Health Screening (vitals → BMI → risk)
   │     ├─ /lab-orders → Lab Orders Management
   │     ├─ /consultations → Consultations
   │     ├─ /insurance → Insurance (Policies + Claims)
   │     └─ /audit → Audit Logs (admin only)
   │
   └─ Role = patient:
      └─ /portal → PortalLayoutComponent (top bar + content)
         ├─ /portal/home → Home (greeting, HealthScore, services)
         ├─ /portal/care → Care (lab catalog with categories)
         ├─ /portal/book → Book Lab Test
         ├─ /portal/orders → Order Status Tracker
         ├─ /portal/consult → Teleconsult Request
         ├─ /portal/appointments → My Appointments
         ├─ /portal/records → My Records
         ├─ /portal/vitals → Health Trackers (steps, sugar, weight, BP)
         └─ /portal/profile → My Profile
```

### 2.3 Backend Flow (Express.js)

```
Request aata hai http://localhost:5000 pe
│
▼
server.js (entry point — yahan se sab shuru hota hai)
│
├─ 1. .env file load karta hai (MONGO_URI, JWT_SECRET, PORT)
├─ 2. Global middleware apply karta hai:
│     cors() → Angular (port 4200) ko backend se baat karne deta hai
│     express.json() → JSON request body parse karta hai
│     static('/uploads') → uploaded files serve karta hai
│     auditLogger → write actions automatically log karta hai
├─ 3. MongoDB se connect karta hai Mongoose ke through
├─ 4. 13 route modules mount karta hai /api ke under:
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
└─ 5. PORT pe listen shuru karta hai (default 5000)
```

**Ek typical route handler ke andar kya hota hai:**

```
HTTP Request → Express Router → auth middleware (JWT verify karo)
                                 │
                                 ▼
                            role middleware (allowed roles check karo)
                                 │
                                 ▼
                            Route Handler (business logic)
                              - req.body / req.params / req.query parse
                              - MongoDB query Mongoose models se
                              - Referenced fields populate karo (.populate())
                              - JSON response bhejo
                                 │
                                 ▼
                            HTTP Response (status code + JSON body ke saath)
```

### 2.4 Database Flow (MongoDB + Mongoose)

```
Express Route Handler
      │
      ▼
Mongoose Model (e.g., Patient.findById(...))
      │
      ├─ Schema ke against data validate karta hai
      ├─ Types cast karta hai (String, Number, Date, ObjectId)
      ├─ ref relationships enforce karta hai
      │
      ▼
MongoDB Driver (native)
      │
      ▼
MongoDB Server (mongodb://127.0.0.1:27017/healthbridge)
      │
      ├─ Documents BSON format mein store karta hai
      ├─ Queries execute karta hai indexes ke saath
      └─ Results return karta hai
```

### 2.5 Authentication Flow (Login/Register Kaise Kaam Karta Hai?)

```
REGISTER FLOW:
─────────────
User form bharta hai { name, email, password, role }
  │
  ▼
POST /api/auth/register
  │
  ├─ Check: Kya email already exist karti hai? → Haan → 400 error
  │
  ├─ Salt generate karo (bcrypt.genSalt(10))
  ├─ Password hash karo (bcrypt.hash(password, salt))
  ├─ MongoDB mein User create karo { name, email, password: hashed, role }
  ├─ JWT create karo: jwt.sign({ id, name, role }, JWT_SECRET, { expiresIn: '7d' })
  │
  └─ Return: { token: "<JWT>", user: { id, name, email, role } }
     │
     ▼
  Frontend token ko localStorage mein store karta hai ('hb_token')
  Frontend user ko localStorage mein store karta hai ('hb_user')
  AuthService.currentUser signal update hota hai → UI react karta hai


LOGIN FLOW:
──────────
User form bharta hai { email, password }
  │
  ▼
POST /api/auth/login
  │
  ├─ Email se user dhundo → Nahi mila → 400 "Invalid credentials"
  ├─ Password compare karo: bcrypt.compare(plainPassword, hashedPassword)
  │  → Match nahi hua → 400 "Invalid credentials"
  ├─ JWT create karo (same as register)
  │
  └─ Return: { token: "<JWT>", user: { id, name, email, role } }
     │
     ▼
  Same localStorage + signal update as register


HAR REQUEST KE SAATH:
────────────────────
Angular Auth Interceptor localStorage se token padhta hai
  │
  ▼
Header add karta hai: Authorization: Bearer <JWT>
  │
  ▼
Express auth middleware:
  ├─ Header se token extract karo
  ├─ jwt.verify(token, JWT_SECRET)
  ├─ Valid hai → req.user = { id, name, role } → next()
  └─ Invalid/expired → 401 "Token is not valid"
```

### 2.6 Role-Based Access Control (RBAC) Flow

```
User protected endpoint pe request karta hai
  │
  ▼
auth middleware sabse pehle run hota hai
  │
  ├─ JWT verify karta hai → req.user set karta hai
  └─ next() call karta hai
     │
     ▼
role middleware run hota hai (e.g., role('admin', 'doctor'))
  │
  ├─ Check: Kya allowedRoles.includes(req.user.role)?
  │
  ├─ HAAN → next() → route handler execute hota hai
  │
  └─ NAHI → 403 "Access denied: insufficient permissions"

EXAMPLES:
  DELETE /api/patients/:id → role('admin')
    → Sirf admin delete kar sakta hai patient

  POST /api/prescriptions → role('admin', 'doctor')
    → Sirf admin aur doctor prescription create kar sakte hain

  GET /api/patients/me → KOI role guard nahi
    → Koi bhi logged-in user (including patient) access kar sakta hai

  /portal/* routes → roleGuard('patient')
    → Sirf patient portal dekh sakta hai

  /dashboard → roleGuard('admin', 'doctor', 'staff')
    → Sirf providers console dekh sakte hain
```

### 2.7 Permission Matrix (Kaun Kya Kar Sakta Hai?)

```
┌────────────────────────────────┬───────┬────────┬───────┬─────────┐
│           ACTION               │ Admin │ Doctor │ Staff │ Patient │
├────────────────────────────────┼───────┼────────┼───────┼─────────┤
│ Register/Login                 │  ✅   │   ✅   │  ✅   │   ✅    │
│ Dashboard & Analytics Dekhna   │  ✅   │   ✅   │  ✅   │   ❌    │
│ Users List Dekhna              │  ✅   │   ✅   │  ✅   │   ❌    │
│ Patient Create Karna           │  ✅   │   ✅   │  ✅   │   ❌    │
│ Sab Patients Dekhna            │  ✅   │   ✅   │  ✅   │   ❌    │
│ Patient Edit Karna             │  ✅   │   ✅   │  ✅   │   ❌    │
│ Patient Delete Karna           │  ✅   │   ❌   │  ❌   │   ❌    │
│ Appointment Book Karna (prov)  │  ✅   │   ✅   │  ✅   │   ❌    │
│ Appointment Request Karna (pat)│  ❌   │   ❌   │  ❌   │   ✅    │
│ Apne Appointments Dekhna       │  ✅   │   ✅   │  ✅   │   ✅    │
│ Clinical Record Create Karna   │  ✅   │   ✅   │  ✅   │   ❌    │
│ Documents Upload Karna         │  ✅   │   ✅   │  ✅   │   ❌    │
│ Apne Records Dekhna            │  ✅   │   ✅   │  ✅   │   ✅    │
│ Prescription Create Karna      │  ✅   │   ✅   │   ❌   │   ❌    │
│ Apni Prescriptions Dekhna      │  ✅   │   ✅   │  ✅   │   ✅    │
│ Invoice Create Karna           │  ✅   │   ❌   │  ✅   │   ❌    │
│ Payment Record Karna           │  ✅   │   ❌   │  ✅   │   ❌    │
│ Apne Invoices Dekhna           │  ✅   │   ✅   │  ✅   │   ✅    │
│ Insurance Policies Manage Karna│  ✅   │   ✅   │  ✅   │   ❌    │
│ Insurance Claims Manage Karna  │  ✅   │   ❌   │  ✅   │   ❌    │
│ Health Screening Run Karna     │  ✅   │   ✅   │  ✅   │   ❌    │
│ Screening Results Dekhna       │  ✅   │   ✅   │  ✅   │   ❌    │
│ Lab Orders Status Update Karna │  ✅   │   ✅   │  ✅   │   ❌    │
│ Lab Test Book Karna (patient)  │  ❌   │   ❌   │  ❌   │   ✅    │
│ Apne Lab Orders Dekhna         │  ✅   │   ✅   │  ✅   │   ✅    │
│ Teleconsultation Karna         │  ✅   │   ✅   │  ✅   │   ✅    │
│ Audit Logs Dekhna              │  ✅   │   ❌   │  ❌   │   ❌    │
│ Notifications Receive Karna    │  ✅   │   ✅   │  ✅   │   ✅    │
│ Patient Portal Use Karna       │  ❌   │   ❌   │  ❌   │   ✅    │
│ HealthScore & Trackers Use Karna│  ❌   │   ❌   │  ❌   │   ✅    │
└────────────────────────────────┴───────┴────────┴───────┴─────────┘
```

---

## 3. Technology Stack (Kaunsi Technology Kyun Use Ki?)

### 3.1 Poori Technology Stack

| Layer | Technology | Version | Kyun Use Ki? |
|-------|-----------|---------|-------------|
| **Frontend Framework** | Angular | 17 | Component-based SPA banane ke liye — sab kuch built-in (routing, forms, HTTP) |
| **Frontend Language** | TypeScript | ~5.3 | JavaScript with types — errors compile time pe pakad mein aate hain |
| **Backend Runtime** | Node.js | 18+ | Server-side JavaScript — ek hi language frontend aur backend dono mein |
| **Backend Framework** | Express.js | 5.2 | Lightweight, fast REST API framework |
| **Database** | MongoDB | 7.x | Flexible document DB — healthcare data ke liye perfect (har entity alag shape ki) |
| **ODM Library** | Mongoose | 9.7 | Schema validation, relationships, aur cleaner API deta hai MongoDB ke upar |
| **Authentication** | JWT (jsonwebtoken) | 9.0 | Stateless token-based auth — server pe session store nahi karna padta |
| **Password Hashing** | bcryptjs | 3.0 | Industry-standard one-way hashing with salt — passwords kabhi plain text mein store nahi hote |
| **File Upload** | Multer | 2.2 | Multipart file uploads handle karta hai with type aur size limits |
| **Cross-Origin** | CORS | 2.8 | Angular (port 4200) ko backend (port 5000) se baat karne deta hai |
| **Environment Config** | dotenv | 17.4 | .env file se environment variables load karta hai |
| **Dev Server** | nodemon | 3.1 | Code change hone pe backend auto-restart karta hai |

### 3.2 Har Technology Kyun Choose Ki? (Detailed)

#### Frontend: Angular 17 — Kyun?
- **React kyun nahi?** Angular ek complete framework hai — routing, forms, HTTP client, guards, interceptors sab built-in aate hain. React mein yeh sab third-party libraries add karni padti hain (React Router, Redux, React Query, etc.). Healthcare jaisi complex forms aur role-based routing wali app ke liye, Angular zyada productive hai.
- **Plain HTML/JS kyun nahi?** Modern SPA (Single Page Application) native app jaisa feel deta hai — page reload nahi hota. Angular ka component model code ko reusable banata hai.
- **Standalone Components:** Angular 17 standalone components support karta hai — ab NgModules ki zaroorat nahi. Cleaner, modern code.

#### Backend: Node.js + Express — Kyun?
- **Node.js kyun?** JavaScript frontend aur backend dono mein — ek language poori stack mein. Fast development, easy debugging, same JSON format har jagah.
- **Express kyun?** Lightweight, minimal framework. REST APIs ke liye perfect. Middleware ecosystem bahut bada hai.
- **Django/Spring Boot kyun nahi?** Woh Python/Java ke heavier frameworks hain. MEAN stack project ke liye Node+Express natural choice hai — fast to build, easy to understand.

#### Database: MongoDB + Mongoose — Kyun?
- **MongoDB kyun?** Healthcare data semi-structured hai — patient record ka shape prescription se bilkul alag hai, aur invoice ka shape lab order se alag hai. MongoDB ka flexible document model iske liye perfect hai. Complex JOINs ki zaroorat nahi.
- **SQL (MySQL/PostgreSQL) kyun nahi?** SQL mein bahut saari tables aur foreign keys chahiye hoti. MongoDB mein hum ya toh related data embed kar sakte hain (jaise invoice items invoice document ke andar) ya reference kar sakte hain (ObjectId refs ke through).
- **Mongoose kyun?** MongoDB ki flexibility ke upar schema validation add karta hai (required fields, enum values, type checking). Relationships manage karta hai (ref + populate). Middleware hooks provide karta hai.

#### Authentication: JWT + bcrypt — Kyun?
- **JWT kyun?** Stateless hai — server ko sessions store nahi karne padte. Token ke andar hi user ki id, name, aur role hota hai. Horizontally scalable — koi bhi server token verify kar sakta hai.
- **bcrypt kyun?** Industry standard password hashing algorithm. Salt use karta hai (random data hashing se pehle) jo rainbow table attacks prevent karta hai. 10 salt rounds = 2^10 iterations — brute-force karna computationally expensive hai.

---

## 4. Folder Structure Analysis

### 4.1 Complete Project Structure

```
healthbridge/
│
├── README.md                          # Project overview, setup instructions
├── .gitignore                         # Git mein exclude hone wali files
│
├── docs/
│   └── SRS.md                         # Software Requirements Specification (65-page)
│
├── backend/                           # Node.js + Express API server
│   ├── package.json                   # Dependencies (express, mongoose, bcryptjs, jwt, multer, cors, dotenv)
│   ├── server.js                      # 🚀 ENTRY POINT: Express app setup, middleware, routes, DB connect
│   ├── .env                           # Environment variables (MONGO_URI, JWT_SECRET, PORT)
│   │
│   ├── config/
│   │   └── db.js                      # MongoDB connection function (Mongoose)
│   │
│   ├── models/                        # Mongoose schemas — 14 files
│   │   ├── User.js                    # name, email, password(hashed), role
│   │   ├── Patient.js                 # patient demographics + blood group
│   │   ├── Appointment.js             # patient+doctor+date+status workflow
│   │   ├── ClinicalRecord.js          # EMR: diagnosis, notes, document uploads
│   │   ├── Prescription.js            # e-Rx: dynamic drug items
│   │   ├── Invoice.js                 # Billing: items[], payments[], tax, discount
│   │   ├── InsurancePolicy.js         # Insurance: payer, policy number, coverage
│   │   ├── Claim.js                   # Insurance claim with approval workflow
│   │   ├── Screening.js               # Health screening: vitals input → auto BMI/risk
│   │   ├── LabPackage.js              # Lab test catalog entry
│   │   ├── LabOrder.js                # Lab booking with status tracker
│   │   ├── Notification.js            # In-app notification for users
│   │   ├── Consultation.js            # Teleconsult: video room + status
│   │   └── AuditLog.js                # Immutable audit trail
│   │
│   ├── routes/                        # API route handlers — 13 files
│   │   ├── auth.js                    # POST /register, POST /login
│   │   ├── users.js                   # GET / (list users by role)
│   │   ├── patients.js                # Patients CRUD + search + self
│   │   ├── appointments.js            # Appointments CRUD + workflow + notifications
│   │   ├── records.js                 # Clinical records CRUD + file upload
│   │   ├── prescriptions.js           # Prescriptions CRUD
│   │   ├── invoices.js                # Invoices CRUD + payment recording
│   │   ├── insurance.js               # Policies (5) + Claims (5)
│   │   ├── lab.js                     # Lab catalog + orders + status
│   │   ├── notifications.js           # Get, mark read, unread count
│   │   ├── consultations.js           # Teleconsult CRUD + status
│   │   ├── analytics.js               # Dashboard KPIs (11 parallel queries)
│   │   ├── audit.js                   # View audit trail (admin)
│   │   └── screening.js               # BMI/risk compute engine
│   │
│   ├── middleware/                     # Request interceptors — 4 files
│   │   ├── auth.js                    # JWT verification
│   │   ├── role.js                    # RBAC guard
│   │   ├── upload.js                  # Multer config (file type + 5MB limit)
│   │   └── auditLogger.js             # Auto-log every write action
│   │
│   ├── utils/                         # Helpers — 2 files
│   │   ├── notify.js                  # Notification creator
│   │   └── selfPatient.js             # Patient User → Patient Record bridge
│   │
│   └── uploads/                       # Uploaded files (served at /uploads URL)
│
├── frontend/                          # Angular 17 application
│   ├── package.json                   # @angular/*, rxjs, tslib
│   ├── angular.json                   # Angular CLI config
│   ├── tsconfig.json                  # TypeScript strict mode config
│   │
│   └── src/
│       ├── index.html                 # Single HTML page — Angular yahan mount hota hai
│       ├── main.ts                    # Bootstrap: AppComponent start karta hai
│       ├── styles.css                 # Global CSS (teal/clinical theme, CSS variables)
│       │
│       └── app/
│           ├── app.component.ts       # Root component (pure app ka shell)
│           ├── app.config.ts          # 🎯 APP CONFIG: Router + HTTP client + interceptor provide karta hai
│           ├── app.routes.ts          # 🗺️ ROUTES: Saare routes, guards ke saath
│           │
│           ├── models/                # TypeScript interfaces — 14 files
│           │   └── *.model.ts         # Har entity ke liye ek interface file
│           │
│           ├── services/              # Business logic + HTTP calls — 15 files
│           │   ├── auth.service.ts     # Login, register, logout, token, currentUser signal
│           │   ├── health-score.service.ts # Vitals tracking + HealthScore computation
│           │   └── *.service.ts        # Ek service har feature module ke liye
│           │
│           ├── guards/                # Route protection — 2 files
│           │   ├── auth.guard.ts       # Login check: nahi toh /login pe redirect
│           │   └── role.guard.ts       # Role check: galat role pe redirect
│           │
│           ├── interceptors/          # HTTP interceptors — 1 file
│           │   └── auth.interceptor.ts # Har request mein JWT token automatically add karta hai
│           │
│           ├── data/                  # Static UI data
│           │   └── catalog.ts          # Lab packages, health trackers, service tiles, organ tests
│           │
│           ├── shared/                # Reusable UI components
│           │   └── notification-bell.component.ts # Notification bell with unread badge
│           │
│           └── pages/                 # 🖥️ Saare page components — feature-wise organized
│               ├── login/             # Login page
│               ├── register/          # Register page (with role dropdown)
│               ├── layout/            # Provider Console layout (sidebar + topbar)
│               ├── dashboard/         # Analytics dashboard (KPI cards, charts)
│               ├── patient-list/ / patient-form/
│               ├── appointment-list/ / appointment-form/
│               ├── record-list/ / record-form/
│               ├── prescription-list/ / prescription-form/ / prescription-view/
│               ├── invoice-list/ / invoice-form/ / invoice-view/
│               ├── screening/         # Health screening (vitals → BMI → risk)
│               ├── lab-orders/        # Lab orders management
│               ├── consultations/     # Consultation list
│               ├── insurance/         # Policies + Claims (PolicyForm, ClaimForm)
│               ├── room/              # Video room for teleconsult
│               ├── audit/             # Audit log viewer (admin only)
│               └── portal/            # 🏠 Patient Portal (9 components)
│                   ├── portal-layout/    # Portal shell
│                   ├── portal-home/      # Greeting + HealthScore + catalog
│                   ├── portal-care/      # Lab catalog with filters
│                   ├── portal-book/      # Lab test booking
│                   ├── portal-orders/     # Order status tracker
│                   ├── portal-consult/    # Teleconsult request
│                   ├── portal-appointments/ # My appointments
│                   ├── portal-records/    # My clinical records
│                   ├── portal-vitals/     # Health trackers (steps, sugar, weight, BP, HR)
│                   └── portal-profile/    # My profile
```

### 4.2 Important Files — Explanation

#### Backend Ke Important Files

| File | Kyun Important Hai? |
|------|-------------------|
| `server.js` | Entry point — middleware, routes, aur database connection sab yahan se wire up hote hain |
| `config/db.js` | MongoDB connection via Mongoose. Agar yeh fail hua toh server exit — database ke bina koi point nahi |
| `middleware/auth.js` | Security ka dil. Har protected request yahan se guzarti hai. JWT verify karta hai. |
| `middleware/role.js` | RBAC enforcement. Sirf 4 lines of logic, lekin poori system secure kar deti hain |
| `middleware/auditLogger.js` | Automatic compliance trail. Peeche se silently kaam karta hai — kabhi user experience affect nahi karta |
| `middleware/upload.js` | File upload configuration. Kahan save hogi, kis naam se, konse types allowed hain, kitna max size |
| `routes/screening.js` | Contains the `evaluate()` function — BMI calculate karta hai, risk score compute karta hai, recommendations generate karta hai |

#### Frontend Ke Important Files

| File | Kyun Important Hai? |
|------|-------------------|
| `app.config.ts` | Application bootstrap. Router aur HTTP client with interceptor provide karta hai |
| `app.routes.ts` | Poora route map. Public routes, provider routes (with guards), patient portal routes, fallback |
| `auth.service.ts` | Authentication logic — login, register, logout, token management, reactive `currentUser` signal |
| `auth.interceptor.ts` | Har outgoing request mein JWT token automatically attach karta hai. Iske bina har service ko manually header add karna padta |
| `auth.guard.ts` | Unauthenticated users ko /login pe redirect karta hai |
| `role.guard.ts` | Galat role wale users ko sahi jagah redirect karta hai |
| `health-score.service.ts` | Patient ke health vitals se real HealthScore compute karta hai (0-100) |
| `data/catalog.ts` | Lab test packages (8 packages with prices), health trackers, organ tests, care plans |

---

## 5. Database Documentation

### 5.1 Saare Collections (14 Total)

#### 1. `users` — System mein login karne wale log
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Haan | User ka poora naam |
| `email` | String | Haan (unique) | Login ke liye email |
| `password` | String | Haan | bcrypt-hashed password (kabhi plain text nahi) |
| `role` | String | Haan | `admin`, `doctor`, `staff`, `patient` mein se ek |
| `createdAt` | Date | Auto | Kab create hua |
| `updatedAt` | Date | Auto | Kab update hua |

#### 2. `patients` — Clinic ke patients
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Haan | Patient ka naam |
| `age` | Number | Optional | Umra |
| `gender` | String | Optional | `Male`, `Female`, `Other` |
| `phone` | String | Optional | Phone number |
| `email` | String | Optional | Email |
| `address` | String | Optional | Pata |
| `bloodGroup` | String | Optional | `A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`, `Unknown` |
| `user` | ObjectId → User | Optional | Patient ke user account se link (portal ke liye) |
| `onboardedBy` | ObjectId → User | Optional | Kis staff ne register kiya |

#### 3. `appointments` — Doctor-patient appointments
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Haan | Konsa patient |
| `doctor` | ObjectId → User | Haan | Konsa doctor |
| `date` | Date | Haan | Appointment ki date aur time |
| `reason` | String | Haan | Kyun aana hai (e.g., "Fever checkup") |
| `notes` | String | Optional | Doctor ke notes |
| `status` | String | Haan | `requested`, `scheduled`, `completed`, `cancelled` |
| `bookedBy` | ObjectId → User | Optional | Kisne book kiya |

#### 4. `clinicalrecords` — Patient visit ke medical records
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Haan | Konsa patient |
| `doctor` | ObjectId → User | Haan | Konsa doctor |
| `visitDate` | Date | Haan | Kab visit hua |
| `diagnosis` | String | Haan | Bimari ka diagnosis |
| `prescription` | String | Optional | Dawai ka details (text) |
| `notes` | String | Optional | Extra clinical notes |
| `documents` | Array | Optional | Uploaded files: `[{fileName, originalName, url, uploadedAt}]` |
| `createdBy` | ObjectId → User | Optional | Kisne create kiya |

#### 5. `prescriptions` — Doctor ki likhi hui prescriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Haan | Kis patient ke liye |
| `doctor` | ObjectId → User | Haan | Kis doctor ne likhi |
| `diagnosis` | String | Optional | Kis bimari ke liye |
| `items` | Array | Haan | Dawaiyan: `[{drugName, dosage, frequency, durationDays, instructions}]` |
| `notes` | String | Optional | Advice/follow-up |
| `status` | String | Haan | `active`, `completed`, `cancelled` |
| `createdBy` | ObjectId → User | Optional | Kisne create kiya |

#### 6. `invoices` — Patient ke bills
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `invoiceNumber` | String | Haan (unique) | Auto-generated: `INV-<timestamp>` |
| `patient` | ObjectId → Patient | Haan | Kis patient ka bill |
| `items` | Array | Haan | Line items: `[{description, qty, unitPrice, amount, sourceType}]` |
| `payments` | Array | Optional | Payments: `[{amount, method, reference, paidAt, recordedBy}]` |
| `subtotal` | Number | Auto | Sab items ka sum |
| `tax` | Number | Haan | Tax amount |
| `discount` | Number | Haan | Chhoot |
| `total` | Number | Auto | subtotal + tax - discount |
| `amountPaid` | Number | Auto | Sab payments ka sum |
| `status` | String | Auto | `unpaid`, `partial`, `paid` |
| `dueDate` | Date | Optional | Last date |
| `notes` | String | Optional | Extra notes |
| `createdBy` | ObjectId → User | Optional | Kisne banaya |

#### 7. `insurancepolicies` — Patient ki insurance policies
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Haan | Policy holder |
| `payerName` | String | Haan | Insurance company ka naam |
| `policyNumber` | String | Haan | Policy number |
| `holderName` | String | Optional | Policy kis ke naam pe |
| `coverageAmount` | Number | Optional | Kitni coverage (₹) |
| `validFrom` | Date | Optional | Kab se valid |
| `validTo` | Date | Optional | Kab tak valid |
| `notes` | String | Optional | Extra notes |
| `createdBy` | ObjectId → User | Optional | Kisne create kiya |

#### 8. `claims` — Insurance claims
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `claimNumber` | String | Haan (unique) | Auto-generated: `CLM-<timestamp>` |
| `policy` | ObjectId → Policy | Haan | Kis policy ke against |
| `patient` | ObjectId → Patient | Haan | Kis patient ka claim |
| `invoice` | ObjectId → Invoice | Optional | Kis bill se linked |
| `amountClaimed` | Number | Haan | Kitna claim kiya |
| `amountApproved` | Number | Optional | Kitna approve hua |
| `preAuthNo` | String | Optional | Pre-authorization number |
| `notes` | String | Optional | Notes |
| `status` | String | Haan | `draft`, `submitted`, `approved`, `rejected`, `paid` |
| `createdBy` | ObjectId → User | Optional | Kisne create kiya |

#### 9. `screenings` — Health screening results
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient` | ObjectId → Patient | Haan | Kis patient ki screening |
| `heightCm` | Number | Haan | Height (cm mein) |
| `weightKg` | Number | Haan | Weight (kg mein) |
| `systolic` | Number | Optional | Upper BP |
| `diastolic` | Number | Optional | Lower BP |
| `smoker` | Boolean | Optional | Smoking karta hai? |
| `diabetic` | Boolean | Optional | Diabetic hai? |
| `bmi` | Number | Auto | Computed: weight / height² |
| `bmiCategory` | String | Auto | `Underweight`, `Normal`, `Overweight`, `Obese` |
| `riskScore` | Number | Auto | Computed risk score |
| `riskLevel` | String | Auto | `Low`, `Medium`, `High` |
| `recommendations` | Array | Auto | Lifestyle advice |
| `screenedBy` | ObjectId → User | Optional | Kisne screening ki |

#### 10-14 — Lab Packages, Lab Orders, Notifications, Consultations, Audit Logs
*(Baaki collections upar wale jaisi hi hain — details English document mein milengi)*

### 5.2 Entity Relationship Diagram (Text Format)

```
┌──────────┐         ┌───────────────┐
│   User   │         │   Patient     │  ← Patient central entity hai
│          │────────►│               │    (sabse zyada referenced)
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
     ├───►│doctor   │  │doctor     │ │doctor      │ │items[]   │ │heightCm    │
     │    │date     │  │visitDate  │ │items[]     │ │payments[]│ │bmi (auto)  │
     │    │status   │  │documents[]│ │status      │ │total     │ │riskLevel   │
     │    └─────────┘  └───────────┘ └────────────┘ └──────────┘ └────────────┘
     │
     │    ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
     │    │Insurance │  │  Claim   │  │ Consultation │  │  LabOrder    │
     ├───►│Policy    │◄─│policy    │  │              │  │              │
     │    │patient   │  │patient   │  │requestedBy   │  │bookedBy      │
     │    └──────────┘  └──────────┘  │doctor        │  │items[]       │
     │                                └──────────────┘  └──────────────┘
     │
     │    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │    │ Notification │  │  AuditLog    │  │ LabPackage   │
     └───►│ user         │  │ actor {id,   │  │ (standalone) │
          │ type, title  │  │  name, role} │  │ name, price  │
          └──────────────┘  └──────────────┘  └──────────────┘
```

### 5.3 Key Relationships

| Relationship | Type | Kaise Kaam Karta Hai? |
|-------------|------|----------------------|
| User → Patient | One-to-One (optional) | Patient user account ek clinical Patient record se link hota hai |
| Patient → Appointments | One-to-Many | Ek patient ke kai appointments ho sakte hain |
| Patient → ClinicalRecords | One-to-Many | Ek patient ke kai visit records |
| Patient → Prescriptions | One-to-Many | Ek patient ke kai prescriptions |
| Patient → Invoices | One-to-Many | Ek patient ke kai bills |
| Patient → Screenings | One-to-Many | Ek patient ki kai screenings |
| InsurancePolicy → Claims | One-to-Many | Ek policy ke against kai claims |
| User → Notifications | One-to-Many | Ek user ko kai notifications |

---

## 6. API Documentation

### 6.1 Complete API Reference

**Base URL:** `http://localhost:5000/api`

#### Authentication (Public — Bina Login Ke)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/auth/register` | Naya user register karo | `{name, email, password, role}` | `{token, user: {id, name, email, role}}` |
| POST | `/auth/login` | Login karo | `{email, password}` | `{token, user: {id, name, email, role}}` |

#### Patients

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/patients/me` | patient | Apna khud ka clinical record |
| POST | `/patients` | admin, doctor, staff | Naya patient register |
| GET | `/patients` | admin, doctor, staff | Search ke saath patient list |
| GET | `/patients/:id` | admin, doctor, staff | Ek patient ka details |
| PUT | `/patients/:id` | admin, doctor, staff | Patient update |
| DELETE | `/patients/:id` | admin | Patient delete |

#### Appointments

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/appointments` | all | Book (provider) ya request (patient) |
| GET | `/appointments` | all (scoped) | List with filters (?status=&patient=&doctor=) |
| GET | `/appointments/:id` | all (scoped) | Ek appointment |
| PUT | `/appointments/:id` | all (scoped) | Update/cancel (patient sirf cancel kar sakta) |
| DELETE | `/appointments/:id` | admin, doctor | Delete |

#### Clinical Records

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/records` | admin, doctor, staff | Naya record |
| GET | `/records` | all (scoped) | List (?patient=id) |
| GET | `/records/:id` | all (scoped) | Ek record |
| PUT | `/records/:id` | admin, doctor, staff | Update |
| DELETE | `/records/:id` | admin, doctor | Delete |
| POST | `/records/:id/documents` | admin, doctor, staff | File upload (max 5 files, 5MB each) |

#### Prescriptions

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/prescriptions` | admin, doctor | Naya prescription (drug builder) |
| GET | `/prescriptions` | all (scoped) | List (?patient=id) |
| GET | `/prescriptions/:id` | all (scoped) | Ek prescription (printable view) |
| PUT | `/prescriptions/:id` | admin, doctor | Update |
| DELETE | `/prescriptions/:id` | admin, doctor | Delete |

#### Invoices

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/invoices` | admin, staff | Naya invoice (line items builder) |
| GET | `/invoices` | all (scoped) | List (?patient=&status=) |
| GET | `/invoices/:id` | all (scoped) | Ek invoice (printable) |
| PUT | `/invoices/:id` | admin, staff | Update items/tax/discount |
| DELETE | `/invoices/:id` | admin | Delete |
| POST | `/invoices/:id/payments` | admin, staff | Payment record karo |

#### Insurance

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/insurance/policies` | admin, staff | Naya policy |
| GET | `/insurance/policies` | admin, doctor, staff | List (?patient=) |
| PUT/DELETE | `.../:id` | admin, staff / admin | Update / Delete |
| POST | `/insurance/claims` | admin, staff | Naya claim |
| GET | `/insurance/claims` | admin, doctor, staff | List (?patient=&status=) |
| PUT/DELETE | `.../:id` | admin, staff / admin | Update / Delete |

#### Lab

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/lab/packages` | all | Catalog browse (?category=) |
| POST | `/lab/orders` | all | Lab test book karo |
| GET | `/lab/orders` | all (scoped) | List (?status=) |
| GET | `/lab/orders/:id` | all (scoped) | Ek order |
| PATCH | `/lab/orders/:id/status` | admin, doctor, staff | Status update + report |

#### Other Modules

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Notifications | 4 | GET /, GET /unread-count, PATCH /:id/read, PATCH /read-all |
| Consultations | 6 | GET /doctors, POST /, GET /, GET /:id, PATCH /:id/status, PUT /:id |
| Analytics | 1 | GET /overview → KPIs, revenue, trends |
| Audit | 1 | GET /?entity=&action=&limit= (admin only) |
| Screening | 3 | POST /, GET /, GET /:id (BMI + risk compute) |
| Users | 1 | GET /?role=doctor (doctor dropdown ke liye) |

### 6.2 API Summary

| Category | Endpoints |
|----------|-----------|
| Auth | 2 |
| Users | 1 |
| Patients | 6 |
| Appointments | 5 |
| Clinical Records | 6 |
| Prescriptions | 5 |
| Invoices | 6 |
| Insurance | 10 |
| Lab | 5 |
| Notifications | 4 |
| Consultations | 6 |
| Analytics | 1 |
| Audit | 1 |
| Screening | 3 |
| **TOTAL** | **61 API Endpoints** |

---

## 7. Feature-by-Feature Explanation

### Feature 1: Authentication & Authorization
**Kya Karta Hai:** User login/register kar sakte hain. JWT token milta hai jo aage ke sab requests mein use hota hai.

**Kaise Kaam Karta Hai:**
1. Register form mein name, email, password, role bharte hain
2. Backend check karta hai ki email pehle se toh nahi hai
3. Password bcrypt se hash hota hai (10 salt rounds)
4. JWT create hota hai jisme `{id, name, role}` hota hai
5. Token localStorage mein store hota hai
6. Har request mein auth interceptor automatically token bhejta hai

**Files:** `routes/auth.js`, `models/User.js`, `middleware/auth.js`, `services/auth.service.ts`, `interceptors/auth.interceptor.ts`, `pages/login/`, `pages/register/`

**APIs:** `POST /api/auth/register`, `POST /api/auth/login`

---

### Feature 3: Patient Management
**Kya Karta Hai:** Patient register karo, search karo, edit karo, delete karo.

**Kaise Kaam Karta Hai:**
1. Provider patient onboarding form bharta hai (name, age, gender, phone, email, address, blood group)
2. `POST /api/patients` patient create karta hai
3. Patient list `GET /api/patients?search=name` se filter hoti hai
4. Search MongoDB regex use karta hai — name ya phone pe case-insensitive match

**Files:** `routes/patients.js`, `models/Patient.js`, `services/patient.service.ts`, `pages/patient-list/`, `pages/patient-form/`

---

### Feature 9: Health Screening Engine (BMI + Risk Calculator)
**Kya Karta Hai:** Patient ke vitals (height, weight, BP, smoker, diabetic) dalo aur server automatically BMI, risk score, risk level, aur personalized recommendations compute karta hai.

**Kaise Kaam Karta Hai (Math):**
1. **BMI:** `weight / (height/100)²` — round to 1 decimal
2. **BMI Category:** <18.5 → Underweight, 18.5-25 → Normal, 25-30 → Overweight, >30 → Obese
3. **Risk Score (additive):**
   - Weight: Overweight +1, Obese +2, Underweight +1
   - BP: ≥140/90 +2, ≥130/85 +1
   - Smoker: +2, Diabetic: +2
4. **Risk Level:** 0-1 → Low, 2-3 → Medium, 4+ → High
5. **Recommendations:** Har risk factor ke liye ek personalized recommendation generate hoti hai

**Files:** `routes/screening.js` (isme `evaluate()` function hai), `models/Screening.js`, `services/screening.service.ts`, `pages/screening/`

---

### Feature 13: HealthScore & Health Trackers
**Kya Karta Hai:** Patient apne daily health vitals log karta hai (steps, sugar, weight, BP, medicine, heart rate) aur usse ek composite HealthScore (0-100) milta hai personalized advice ke saath.

**Kaise Kaam Karta Hai:**
1. Patient Vitals tab mein readings enter karta hai
2. Data localStorage mein per-user store hota hai (client-side feature)
3. Har vital ka 0-100 sub-score compute hota hai:
   - Steps: ≥8000 → 100, ≥5000 → 80, ≥2000 → 60, <2000 → 35
   - Sugar: 70-99 → 100, 100-125 → 75, 126-199 → 45
   - BMI-based (weight se): 18.5-24.9 → 100, 25-29.9 → 75
4. Overall HealthScore = sab sub-scores ka average
5. Labels: ≥85 → Excellent, ≥70 → Good, ≥50 → Fair, <50 → Needs attention

**Files:** `services/health-score.service.ts`, `data/catalog.ts` (HEALTH_TRACKERS), `pages/portal/portal-home/`, `pages/portal/portal-vitals/`

**Note:** Yeh purely client-side feature hai — no backend API calls, no database storage.

---

### Feature 15: Audit Logging
**Kya Karta Hai:** Har write action (create, update, delete) automatically record hota hai — kisne kiya, kya kiya, kab kiya, kis IP se.

**Kaise Kaam Karta Hai:**
1. `auditLogger.js` middleware har request pe run hota hai
2. Agar method write method hai (POST/PUT/PATCH/DELETE) → response finish hone pe log create karta hai
3. Sirf successful (status < 400) aur authenticated requests log hote hain
4. Actor ki info snapshot hoti hai (id, name, role) — agar user baad mein rename/delete ho tab bhi history accurate rehti hai
5. Request bodies intentionally store nahi hote (PHI/passwords leak prevention)
6. Audit failures silently ignore hote hain — user experience kabhi affect nahi hota

**Files:** `middleware/auditLogger.js`, `routes/audit.js`, `models/AuditLog.js`

**Yehi HIPAA-style compliance ka signal hai — interview mein impress karega!**

---

## 8. Complete User Flow

### 8.1 Admin User — Ek Din Ki Journey

```
1. Browser khola → Login page → Admin email + password → Sign In
2. Role guard ne 'admin' detect kiya → Dashboard pe land hua
3. DASHBOARD: Total patients (342), appointments (89), revenue (₹4.2L billed, ₹3.1L collected)
4. PATIENTS: Sidebar se Patients click kiya → Search "Sharma" → Mrs. Sharma mili
5. APPOINTMENTS: Appointments click kiya → Ek cancelled appointment delete kiya
6. RECORDS: Mrs. Sharma ke records dekhe → Uploaded X-ray report dekh li
7. PRESCRIPTIONS: Dr. Khan ki likhi prescription dekhi — 4 drugs with dosages
8. INVOICES: Ek unpaid invoice pe ₹500 UPI payment record kiya → Auto "paid" status
9. INSURANCE: Patient ke liye naya policy banaya → Claim file kiya
10. SCREENING: Patient ke vitals dale → BMI 28.5 (Overweight), Risk: Medium nikla
11. LAB ORDERS: Ek order ka status "report_ready" kiya → Patient ko notification gaya
12. AUDIT: Audit tab click kiya → Saare actions ka log dikha — kisne kab kya kiya
13. LOGOUT: User menu → Logout → Token clear → Login page pe wapas
```

### 8.4 Patient User — Ek Din Ki Journey

```
1. Browser khola → Register kiya → Role "Patient" select kiya
2. PORTAL HOME: Greeting "Hello, Sahil!" → HealthScore: 72/100 (Good)
3. CARE: Lab catalog browse kiya → "Thyroid" filter lagaya → "Thyroid Profile — ₹399"
4. BOOK: Ek package select kiya → Address fill kiya → Time slot select kiya → Book Now!
5. ORDERS: Order tracker dekha: ✓ Booked → ✓ Collected → ◉ In Lab → ○ Report Ready
6. CONSULT: Dr. Khan select kiya → "Thyroid results discuss karne hain" → Request bheja
7. APPOINTMENTS: Follow-up appointment request kiya → Status: "requested"
8. RECORDS: Apne purane visit records dekhe → Reports download kiye
9. VITALS: Aaj ki readings log ki — Steps: 7200, Sugar: 95, Weight: 72kg, BP: 122/82
   → HealthScore update hua: ab 78/100 (Good)
10. LOGOUT: Session end → Token clear → Login page pe wapas
```

---

## 9. Security Implementation

### 9.1 Authentication (Pehchaan)

| Security Measure | Implementation | Kyun Secure Hai? |
|-----------------|----------------|-----------------|
| JWT Token | `jwt.sign({ id, name, role }, JWT_SECRET, { expiresIn: '7d' })` | Stateless — server pe kuch store nahi. Token 7 din mein expire ho jata hai |
| Token Header Mein | `Authorization: Bearer <token>` | Standard practice. Token kabhi URL mein nahi (URLs log ho jati hain) |
| Token Verification | Har protected route pe `auth` middleware JWT verify karta hai | Koi bhi tampered ya expired token 401 dega |

### 9.2 Password Handling

| Security Measure | Implementation | Kyun Secure Hai? |
|-----------------|----------------|-----------------|
| Hashing | `bcrypt.hash(password, salt)` | Database compromise hone pe bhi passwords read nahi ho sakte |
| Salt | `bcrypt.genSalt(10)` — 1024 iterations | Har password ka unique random salt — rainbow table attack impossible |
| Comparison | `bcrypt.compare(plain, hashed)` | Timing-attack safe comparison |
| Minimum Length | Frontend: `Validators.minLength(6)` | Weak passwords prevent hote hain |
| Password Never Returned | Users query: `.select('name email role')` | API kabhi password hash expose nahi karti |

### 9.3 Authorization (Permission)

| Security Measure | Implementation | Kyun Secure Hai? |
|-----------------|----------------|-----------------|
| RBAC Middleware | `role('admin', 'doctor')` on routes | Centralized — audit karna easy hai |
| Frontend Guard | `roleGuard('patient')` on portal routes | Unauthorized pages pe navigate bhi nahi kar sakte |
| UI Gating | `authService.hasRole('admin')` in templates | Unauthorized buttons dikhte hi nahi |
| Data Scoping | Patients sirf apna data dekh sakte hain | API level pe `filter.bookedBy = req.user.id` |

### 9.4 File Upload Security

| Security Measure | Implementation | Kyun Secure Hai? |
|-----------------|----------------|-----------------|
| Type Filter | Sirf `pdf|jpg|jpeg|png|doc|docx` allowed | Executable files upload nahi ho sakte |
| Size Limit | 5 MB per file | Disk-filling attack prevent |
| Max Files | 5 files per upload | Ek request mein seemit files |
| Unique Filenames | `timestamp + random + extension` | Path traversal prevent, collisions nahi |

---

## 10. Interview Preparation — 50 Questions & Answers

### Technical Questions (15 Qs — Important)

**Q1: Tumhara project kya hai?**
A: HealthBridge ek full-stack healthcare management platform hai MEAN stack pe. Do parts hain: Provider Console (doctors/admin/staff ke liye — patients, appointments, records, prescriptions, billing, insurance, screening manage karne ke liye) aur Patient Portal (patients ke liye — lab tests book karna, health track karna, teleconsultation lena). JWT authentication, 4 roles ka RBAC, aur automatic audit trail implemented hai.

**Q2: MEAN stack kya hai?**
A: MongoDB (NoSQL database) + Express.js (backend web framework) + Angular (frontend framework) + Node.js (JavaScript runtime). Sabse badi advantage — JavaScript/TypeScript poori stack mein ek hi language.

**Q3: JWT authentication kaise kaam karta hai tumhare project mein?**
A: Register/login pe backend JWT create karta hai jisme user ka id, name, role hota hai. Token localStorage mein store hota hai. Angular HTTP interceptor har request mein automatically `Bearer <token>` header add karta hai. Backend ka `auth` middleware `jwt.verify()` se token verify karta hai. Valid → `req.user` set, Invalid → 401 error.

**Q4: RBAC kaise implement kiya?**
A: 4 roles hain: admin, doctor, staff, patient. Teen levels pe enforcement:
1. Route level: Angular route guards (`roleGuard('patient')`)
2. UI level: `authService.hasRole('admin')` — buttons conditionally show/hide
3. API level: `role('admin', 'doctor')` middleware route pe
4. Data scoping: Patients sirf apna data dekh sakte hain — `filter.bookedBy = req.user.id`

**Q5: MongoDB kyun choose kiya, SQL kyun nahi?**
A: Healthcare data semi-structured hai — prescription document ka shape invoice se bilkul alag hai. MongoDB flexible document model iske liye perfect hai. Mongoose schema validation add karta hai. SQL mein 20+ tables aur complex JOINs chahiye hote.

**Q6: Health screening risk calculator kaise kaam karta hai?**
A: Server-side computation hai. Input: height, weight, systolic/diastolic BP, smoker flag, diabetic flag. Pehle BMI = weight/(height/100)². Phir category: Underweight/Normal/Overweight/Obese. Risk score additive model se: Overweight +1, Obese +2, High BP +2, Smoker +2, Diabetic +2. Total: 0-1 Low, 2-3 Medium, 4+ High. Har risk factor ke liye personalized recommendations generate hoti hain.

**Q7: Audit logging system samjhao.**
A: `auditLogger` middleware har write request (POST/PUT/PATCH/DELETE) automatically log karta hai. Response finish hone ke baad silently record karta hai — who (actor snapshot: id, name, role), what action, which entity, which specific record, HTTP method + path, status code, IP, timestamp. Request bodies intentionally store nahi hote (sensitive data). Audit log append-only hai — immutable trail. Sirf admin dekh sakta hai.

**Q8: Invoice calculation kaise handle karte ho?**
A: `recalc()` function hai jo har save se pehle sab money fields recompute karta hai: item.amount = qty × unitPrice, subtotal = sum of items, total = subtotal + tax - discount, amountPaid = sum of payments. Status auto-compute: 0 paid → unpaid, < total → partial, ≥ total → paid. Single source of truth approach — inconsistency impossible hai.

**Q9: File uploads kaise handle karte ho?**
A: Multer middleware with disk storage. Files `/uploads/` folder mein unique names ke saath save hoti hain. Type filter: sirf pdf/jpg/png/doc allowed. Size limit: 5MB per file. Max 5 files per upload. Files clinical records ke documents array mein attached hoti hain.

**Q10: HealthScore kaise compute hota hai?**
A: Client-side feature hai Angular Signals pe. Patient 6 vitals log karta hai (steps, sugar, weight, BP, medicine, heart rate). Har vital ka clinical ranges ke against 0-100 sub-score compute hota hai. Overall HealthScore = average of sub-scores. Labels: ≥85 Excellent, ≥70 Good, ≥50 Fair. Data localStorage mein persist hota hai.

**Q11: HTTP interceptor kya hai?**
A: Angular mein HTTP interceptor HttpClient aur network ke beech mein baithta hai. Mera `auth.interceptor.ts` har outgoing request mein localStorage se JWT token padhkar `Authorization: Bearer <token>` header add karta hai. Isse kisi bhi service ko manually token nahi add karna padta.

**Q12: Angular Guards explain karo.**
A: Do guards hain. `authGuard` check karta hai ki user logged in hai (token exists). Nahi toh `/login` pe redirect. `roleGuard` allowed roles check karta hai. Patient provider route access karne ki koshish kare toh `/portal/home` pe redirect. Provider portal try kare toh `/login` pe. Route activate hone se pehle guard run hota hai.

**Q13: Patient vs provider appointment booking mein kya difference hai?**
A: Provider directly `scheduled` status ke saath appointment book kar sakta hai — koi bhi patient, koi bhi doctor assign kar sakta hai. Patient sirf `request` kar sakta hai — status `requested` se start hota hai aur clinic ko confirm karna padta hai. Patient automatically `getOrCreateSelfPatient()` ke through apne Patient record se link ho jata hai — kisi aur patient ke liye book nahi kar sakta.

**Q14: Mongoose `.populate()` kya karta hai?**
A: `.populate()` Mongoose ka reference resolution hai. Jab document mein ObjectId reference store hota hai (e.g., `patient: ObjectId`), `.populate('patient', 'name phone age')` us ID ko actual referenced document se replace kar deta hai sirf specified fields ke saath. Ye SQL JOIN jaisa hi hai, lekin application layer pe hota hai.

**Q15: Backend mein errors kaise handle karte ho?**
A: Har route handler try-catch mein wrap hai. Error pe appropriate HTTP status code: 400 (bad request), 401 (auth fail), 403 (forbidden), 404 (not found), 500 (server error). Error messages user-friendly hain lekin sensitive info leak nahi karte. Audit logger errors ko skip karta hai (status ≥ 400).

### HR / General Questions (Key Ones)

**Q16: Apne baare mein aur project ke baare mein batao.**
A: Sir, main B.Tech Computer Engineering ka student hoon aur maine HealthBridge project banaya hai — ek full-stack healthcare management platform. Isme do parts hain — ek doctor/staff ke liye clinical console (patients, appointments, EMR, prescriptions, billing) aur ek patient portal (lab booking, health tracking, teleconsultation). Maine MEAN stack use kiya — MongoDB, Express, Angular 17, Node.js. JWT authentication, 4 roles ka RBAC, 14 database collections, 61 API endpoints, aur 18 features implement kiye hain. Poora project scratch se maine khud banaya hai — architecture design se lekar code aur documentation tak.

**Q17: Sabse challenging part kya tha?**
A: Proper role-based access control teen levels pe implement karna — route (Angular guards), UI (conditional rendering), aur API (middleware + data scoping). Ye ensure karna ki ek patient kabhi bhi kisi aur patient ka data na dekh sake, chahe woh directly API call kare. Dusra challenge tha invoice calculation engine — paanch money fields (subtotal, total, tax, amountPaid, status) ko consistently sync rakhna.

**Q18: Is project se kya seekha?**
A: Full-stack architecture design karna, database schema design (kab embed karna hai, kab reference), security importance (JWT, bcrypt, RBAC), Angular concepts (signals, guards, interceptors, reactive forms), audit trail ka importance compliance ke liye, aur different user roles ke liye different UI design karna.

**Q19: Ye project dubara banane mile toh kya change karoge?**
A: Backend mein TypeScript use karunga, routes ko controller-service-model layers mein split karunga, proper pagination add karunga, unit/integration tests likhunga, refresh token rotation implement karunga, real-time notifications ke liye WebSocket lagunga, aur API base URL environment-based configuration se karunga.

**Q20: Ye college project hai ya real product?**
A: Ye educational/portfolio project hai jo production-grade software engineering demonstrate karta hai. Real clinic mein deploy nahi hai, lekin jo features aur security measures implement kiye hain — JWT auth, RBAC, audit logging, file upload security, password hashing — woh sab real healthcare software ke standards pe hain.

**Q21: Project deploy kaise karoge?**
A: Frontend: `ng build` karke static files Netlify/Vercel ya AWS S3 + CloudFront pe host karenge. Backend: AWS EC2 pe Node.js with PM2 process manager. Database: MongoDB Atlas (managed cloud). HTTPS: Let's Encrypt. CI/CD: GitHub Actions for automated build + deploy.

---

## 11. Resume Description

### 1-Line
> Built HealthBridge — a full-stack healthcare management platform (MEAN stack) with 18 features, 61 APIs, RBAC for 4 roles, JWT auth, and an automated audit trail system.

### 2-Line
> Developed HealthBridge, a comprehensive clinical management ecosystem using Angular 17, Node.js, Express, and MongoDB. Implemented dual portals (Provider Console + Patient Portal), role-based access control for 4 user roles, e-prescriptions, billing, insurance claims, health screening engine, lab booking, teleconsultation, and a tamper-evident audit system.

### 4-Line (Detailed)
> **HealthBridge — Integrated Patient Engagement & Clinical Management Ecosystem**
> - Built a full-stack MEAN application with 14 MongoDB collections, 61 REST API endpoints, and 30+ Angular 17 standalone components.
> - Implemented JWT authentication with bcrypt password hashing and 3-layer role-based access control (Admin, Doctor, Staff, Patient) enforced at route, UI, and API levels.
> - Key features: Patient EMR with document uploads, e-Prescriptions, itemized billing with payment tracking, insurance claims workflow, health screening engine (BMI + risk scoring), lab catalog & booking, teleconsultation with video rooms, HealthScore & trackers, analytics dashboard, and an automatic immutable audit trail.
> - Tech: Angular 17 (standalone components, signals, guards, interceptors), Node.js + Express, MongoDB + Mongoose, JWT + bcrypt, Multer file uploads.

### ATS Keywords (Resume Mein Lagane Ke Liye)
```
Full-Stack Development | MEAN Stack | Angular 17 | Node.js | Express.js | MongoDB | Mongoose | TypeScript | JavaScript | REST API | JWT Authentication | bcrypt | Role-Based Access Control (RBAC) | Healthcare IT | EMR/EHR | Patient Portal | Clinical Management System | Prescription Management | Billing System | Insurance Claims | Health Screening | Lab Management | Teleconsultation | Audit Logging | Angular Signals | Angular Guards | Angular Interceptors | Reactive Forms | File Upload (Multer) | Database Design | API Design
```

---

## 12. Elevator Pitch

### 30-Second (Lift Pitch)

"HealthBridge ek full-stack healthcare management platform hai jo maine MEAN stack pe banaya hai — MongoDB, Express, Angular 17, aur Node.js. Iske do sides hain: ek clinical console jahan doctors aur staff patients, appointments, prescriptions, billing, aur insurance manage karte hain, aur ek patient portal jahan patients lab tests book kar sakte hain, apna health track kar sakte hain, aur doctors se online consult kar sakte hain. Maine role-based access control 4 roles ke liye, JWT authentication encrypted passwords ke saath, 61 API endpoints, aur ek automatic audit trail implement kiya hai jo system mein har change record karta hai. Ye modern medical clinic ka complete digital workflow cover karta hai."

### 1-Minute

"Sir, mera project HealthBridge hai — ek integrated patient engagement aur clinical management ecosystem. Problem yeh thi ki kai clinics aaj bhi paper records ya disconnected software use karte hain, jiski wajah se doctors ko patient history dhundhne mein time lagta hai aur patients apna health manage nahi kar paate.

Maine isko MEAN stack pe banaya: MongoDB database ke liye, Express aur Node.js backend API ke liye, aur Angular 17 frontend ke liye. Application mein do alag-alag interfaces hain: Provider Console doctors, admin, aur staff ke liye — jisme patient registration, appointment scheduling, electronic medical records with document uploads, e-prescriptions with dynamic drug builder, itemized billing with payment tracking, insurance policies and claims, aur ek health screening engine jo BMI aur cardiovascular risk compute karta hai.

Patient Portal mein patients lab tests book kar sakte hain catalog se, apne health vitals jaise steps, blood sugar, blood pressure track kar sakte hain, aur ek composite HealthScore dekh sakte hain. Woh teleconsultations bhi request kar sakte hain.

Security ke liye maine JWT authentication with bcrypt password hashing, teen-layer role-based access control — route, UI, aur API level pe enforced — aur automatic audit trail implement kiya hai jo har write action record karta hai. Poora system 14 database collections, 61 API endpoints ke saath hai, aur maine scratch se banaya hai."

---

## 13. Project Challenges

### Challenge 1: Real RBAC Beyond Middleware
**Problem:** Zyadatar tutorials mein RBAC sirf middleware hota hai, lekin real RBAC ke teen layers chahiye — routing (page pe ja hi nahi sakte), UI (buttons dikhte nahi), aur API (backend enforcement). Plus, patients ko sirf apna data dekhna chahiye.

**Solution:** Teen-layer approach. Angular route guards role check karte hain, `hasRole()` templates mein conditionally UI render karta hai, backend `role()` middleware unauthorized access block karta hai, aur data scoping (patients ke liye `filter.bookedBy = req.user.id`) ensure karta hai ki patient sirf apna data dekhe. `getOrCreateSelfPatient()` utility User account ko Patient record se bridge karta hai.

### Challenge 2: Invoice Money Consistency
**Problem:** Invoice mein paanch interdependent money fields hain — agar ek bhi galat hua toh poora invoice wrong.

**Solution:** `recalc()` function jo har save se pehle SAB fields ko unke source data se recompute karta hai. Single source of truth — inconsistency impossible.

### Challenge 3: Patient-User Bridge
**Problem:** Patient register karta hai as User, lekin clinical data ke liye Patient record bhi chahiye.

**Solution:** Three-step `getOrCreateSelfPatient()` utility — pehle linked Patient dhundhta hai, phir same email wala Patient dhundhta hai aur link karta hai, nahi toh naya minimal Patient record create karta hai.

### Challenge 4: Audit Logging Without Breaking Requests
**Problem:** Audit log fail ho toh actual request break nahi honi chahiye.

**Solution:** Response finish hone ke BAAD log create hota hai (client ko response mil chuka hota hai). `.catch(() => {})` se errors silently ignore — user experience kabhi affect nahi hota.

### Learning Outcomes
1. **Layers mein socho:** Security defense in depth chahiye — route, UI, API teeno levels pe
2. **Single source of truth:** Computed values ke liye ek recalc function inconsistencies prevent karta hai
3. **Fail gracefully:** Audit logging aur notifications kabhi main flow break nahi karne chahiye
4. **Denormalize for history:** Audit log mein actor snapshot lo taaki history accurate rahe
5. **Roles ke liye shuru se design karo:** Baad mein RBAC retrofit karna painful hai

---

## 14. Future Enhancements

### Scalability Improvements
- Backend TypeScript mein migrate karna
- Routes → controller → service layers mein split
- Pagination add karna sab list endpoints pe
- Database indexes add karna
- Redis caching for frequently-read data
- Rate limiting middleware
- Refresh token rotation

### Additional Features (Phase 3-4)
- SOAP Clinical Notes with ICD-10 codes
- Drug interaction alerts during prescribing
- AI vision screening (eye image analysis)
- AI diet plan generator
- Payment gateway integration (Razorpay/Stripe)
- SMS/WhatsApp notifications
- E-pharmacy with prescription verification
- Digital signatures with hash verification
- FHIR export for healthcare interoperability
- Mobile app via Capacitor

---

## 15. Viva Preparation Notes

### 15.1 Important Concepts (Yaad Rakhne Ke Liye)

| Concept | Kya Bolna Hai? |
|---------|---------------|
| **MEAN Stack** | MongoDB + Express + Angular + Node.js. End-to-end JavaScript. |
| **JWT** | JSON Web Token — user info (id, name, role) signed token mein. Stateless — server pe kuch store nahi karna padta. 7 din mein expire. |
| **bcrypt** | One-way password hashing with salt. 10 salt rounds = 1024 iterations. DB leak hone pe bhi passwords safe. |
| **RBAC** | Teen levels: Angular guards (route), UI gating (conditional rendering), Express middleware (API). 4 roles: admin, doctor, staff, patient. |
| **Mongoose** | MongoDB ODM. Schema validation, ref + populate for relationships. |
| **Audit Trail** | Har write action automatically log. Actor snapshot (not just reference). Immutable — history accurate. |
| **BMI** | weight(kg) / height(m)². Categories: <18.5 Underweight, 18.5-25 Normal, 25-30 Overweight, >30 Obese. |
| **Middleware** | Express functions: req, res, next. Pipeline order: cors → json → audit → auth → role → handler. |

### 15.2 Frequently Asked Viva Questions

1. "MongoDB kyun choose kiya?" → Healthcare data semi-structured hai, flexible document model fit karta hai
2. "Authentication kaise kaam karta hai?" → JWT — login pe token milta hai, har request mein interceptor bhejta hai
3. "Database relationships explain karo." → Patient central entity hai, ObjectId refs + Mongoose populate
4. "Security features kya implement kiye?" → JWT, bcrypt, RBAC, file restrictions, CORS, audit trail, .env secrets
5. "Screening risk calculator kaise kaam karta hai?" → Server-side: BMI compute → additive risk score → Low/Medium/High

### 15.3 Quick Revision Sheet

```
🏥 HEALTHBRIDGE — QUICK FACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stack:       Angular 17 + Node.js/Express + MongoDB
Auth:        JWT (jsonwebtoken) + bcrypt (bcryptjs)
ODM:         Mongoose 9.7

Database:    healthbridge (MongoDB)
Collections: 14
API Routes:  13 modules, 61 endpoints
Base URL:    http://localhost:5000/api

Roles:       admin, doctor, staff, patient

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

MIDDLEWARE ORDER:
  cors → json → auditLogger → auth → role → handler
```

---

## 16. Cheat Sheet

### Architecture Summary

```
Browser (Angular 17, :4200) → Express API (Node.js, :5000) → MongoDB (:27017)
  │                                │
  └─ JWT Bearer token ─────────────┘
  └─ auth + role middleware ───────┘
  └─ 13 route modules ─────────────┘
  └─ Mongoose ODM ─────────────────┘
```

### Database Summary (Key Collections)

```
users              → name, email(unique), password(hashed), role
patients           → name, age, gender, phone, email, bloodGroup
appointments       → patient, doctor, date, status
clinicalrecords    → patient, doctor, diagnosis, documents[]
prescriptions      → patient, doctor, items[{drug,dosage,...}]
invoices           → invoiceNumber, items[], payments[], total, status
screenings         → patient, heightCm, weightKg, bmi(auto), riskLevel(auto)
notifications      → user, type, title, body, read
auditlogs          → actor{id,name,role}, action, entity, at
```

### APIs Summary

| Module | Endpoints | Highlights |
|--------|-----------|-----------|
| Auth | 2 | Register + Login |
| Patients | 6 | CRUD + search + self-patient |
| Appointments | 5 | CRUD + status workflow + notifications |
| Records | 6 | CRUD + document upload |
| Prescriptions | 5 | Drug builder items |
| Invoices | 6 | Payment recording + auto-status |
| Insurance | 10 | Policies + Claims workflow |
| Lab | 5 | Catalog + orders + status tracker |
| Notifications | 4 | Unread count, mark read |
| Consultations | 6 | Video room, status, summary |
| Analytics | 1 | KPIs, revenue, trends |
| Audit | 1 | View trail (admin) |
| Screening | 3 | BMI + risk compute |
| **Total** | **61** | |

### Features Summary

```
✅ Authentication          → JWT + bcrypt, 7-day expiry
✅ RBAC                   → 4 roles, 3-layer enforcement
✅ Patient Management     → CRUD + search
✅ Appointments           → Book/request, confirm/decline
✅ Clinical Records       → EMR + file uploads
✅ Prescriptions          → Drug builder, printable
✅ Billing & Invoices     → Items, tax, payments, auto-status
✅ Insurance              → Policies + claims workflow
✅ Health Screening       → BMI + risk + recommendations
✅ Lab Catalog & Booking  → Categories, organ, status tracker
✅ Teleconsultation       → Video rooms, post-call summary
✅ Notifications          → Bell, unread badge, alerts
✅ HealthScore            → 6 vitals → 0-100 score
✅ Analytics Dashboard    → KPIs, revenue, trends
✅ Audit Logging          → Automatic, immutable
✅ Dual Portal            → Console + Portal, ek codebase
```

---

## 📄 Appendix: Useful Commands

```bash
# MongoDB start karo (Windows)
mongod

# Backend start karo (backend/ folder se)
npm run dev          # nodemon — auto-restart on changes

# Frontend start karo (frontend/ folder se)
ng serve             # http://localhost:4200

# Lab packages seed karo (backend/ folder se)
node seed/seedLabPackages.js

# MongoDB data check karo
mongosh
use healthbridge
show collections
db.users.find().pretty()
```

---

> **HealthBridge Project Documentation — Hinglish Version**  
> *Interview aur viva ke liye poori taiyari. All the best! 🚀*

---

*Yeh document cover karta hai poora HealthBridge project — 16 sections, 50+ interview Q&As, resume descriptions, elevator pitches, aur quick-reference cheat sheets. Architecture diagram, RBAC flow, aur screening algorithm sabse zyada practice karo — yahi interviewers ko impress karega.*
