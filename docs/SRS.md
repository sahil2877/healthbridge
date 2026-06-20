# HealthBridge — Software Requirements Specification (SRS)

**Integrated Patient Engagement & Clinical Management Ecosystem**

| | |
|---|---|
| **Product** | HealthBridge |
| **Version** | 1.0 (Design baseline) |
| **Stack** | Angular 17 · Node.js + Express · MongoDB · JWT |
| **Document type** | Software Requirements Specification |
| **Status** | Living document |

---

## 1. Introduction

### 1.1 Purpose
HealthBridge is a unified healthcare ecosystem that connects **patients**, **doctors**, **clinic staff**, and **administrators** on a single platform. It combines a **clinical EMR/EHR** (used by providers) with a **consumer patient portal** (used by patients), a **diagnostics & appointment booking** engine, **teleconsultation**, **AI vision screening**, and **health tracking / engagement** features.

The goal is a product that feels like a real commercial healthcare platform (comparable to Meditab IMS, IntelleChart EHR, and patient-engagement apps) rather than a college project.

### 1.2 Scope
- **Provider side (Clinic OS):** registration, scheduling, EMR, clinical notes, prescriptions, vision screening, billing, insurance, documents, e-signatures, reports, audit, settings.
- **Patient side (Patient Portal):** self-registration, appointment & lab booking, home sample collection, health trackers, health score, diet plans, teleconsult, prescriptions, reports, payments, e-pharmacy, content.
- **Cross-cutting:** authentication, RBAC, notifications, audit logging, analytics.

### 1.3 Design language (from screenshot analysis)
- **Primary palette:** teal/green (`#0d9488`) + clinical blue accents, soft off-white surfaces, rounded 12–16px cards, subtle shadows.
- **Patient app** = mobile-first, bottom-tab navigation, card-driven, friendly illustrations, gamified scoring, prominent CTAs and offers.
- **Provider app** = desktop-first, left sidebar + top bar, data-dense tables, tabbed patient charts.
- **Shared:** rotating/voice search, status chips/badges, stepper journeys, segmented "care plans".

### 1.4 Personas
| Persona | Description | Primary device |
|---------|-------------|----------------|
| **Aarti (Patient)** | Books lab tests, tracks vitals, consults doctors online | Mobile |
| **Dr. Khan (Doctor)** | Reviews charts, writes notes & prescriptions, runs screenings | Desktop/tablet |
| **Ravi (Front-desk Staff)** | Registers patients, schedules, collects payments | Desktop |
| **Admin** | Configures clinic, manages users, views analytics & audit | Desktop |

---

## 2. System Architecture

### 2.1 High-level
```
                 ┌─────────────────────────────────────────────┐
                 │              CLIENT LAYER (Angular)          │
                 │  Patient Portal (mobile-first)               │
                 │  Provider Console (desktop)                  │
                 └───────────────┬─────────────────────────────┘
                                 │  HTTPS / REST (JWT)
                 ┌───────────────▼─────────────────────────────┐
                 │            API GATEWAY (Express)             │
                 │  Routes → Controllers → Services → Models    │
                 │  Middleware: auth · RBAC · validation ·      │
                 │  rate-limit · audit · error · upload         │
                 └───────────────┬─────────────────────────────┘
          ┌──────────────┬───────┴───────┬───────────────┬───────────────┐
          ▼              ▼               ▼               ▼               ▼
     MongoDB        File storage     Integrations    Job queue        Cache
   (Mongoose)      (/uploads, S3)   (pay/SMS/AI)    (reminders)      (Redis*)
```
`*` = future phase.

### 2.2 Architectural principles
- **Layered backend:** Route → Controller → Service → Model (thin controllers, business logic in services).
- **Stateless API:** JWT access tokens + refresh tokens; horizontally scalable.
- **RBAC everywhere:** every protected route declares allowed roles.
- **Separation of portals:** shared API, two Angular app areas (patient vs provider) selected by role after login.
- **Auditability:** every write to clinical/financial data emits an audit log.
- **Config-driven:** clinic settings, fee schedules, test catalogs live in DB, not code.

### 2.3 Technology choices
| Concern | Choice | Reason |
|---------|--------|--------|
| Frontend | Angular 17 standalone | Full framework, routing/DI/forms built-in |
| Backend | Node + Express | Lightweight, fast to build REST APIs |
| DB | MongoDB + Mongoose | Flexible clinical documents, easy refs |
| Auth | JWT + bcrypt | Stateless, industry standard |
| Files | Multer → local `/uploads`, later S3 | Reports, scans, signatures |
| Realtime | Socket.IO (Phase 2) | Notifications, video signaling |
| Payments | Razorpay/Stripe (Phase 2) | Billing & wallet |

---

## 3. Roles & Access Control (RBAC)

### 3.1 Roles
`admin`, `doctor`, `staff`, `patient` (extensible: `lab_technician`, `pharmacist`, `accountant`).

### 3.2 Permission matrix (sample)
| Capability | Admin | Doctor | Staff | Patient |
|------------|:---:|:---:|:---:|:---:|
| Manage users | ✅ | – | – | – |
| Register patient | ✅ | ✅ | ✅ | self |
| View any chart | ✅ | ✅ | ✅ (limited) | own |
| Write clinical note | ✅ | ✅ | – | – |
| Prescribe | – | ✅ | – | – |
| Run vision screening | ✅ | ✅ | ✅ | self (AI) |
| Book appointment/lab | ✅ | ✅ | ✅ | own |
| Delete patient | ✅ | – | – | – |
| Delete appointment/record | ✅ | ✅ | – | – |
| Generate invoice | ✅ | – | ✅ | – |
| View audit logs | ✅ | – | – | – |
| Configure clinic | ✅ | – | – | – |

### 3.3 Implementation
- `auth` middleware verifies JWT → sets `req.user = { id, name, role }`.
- `role(...allowed)` middleware guards routes (already implemented).
- Resource-level checks in services (e.g., a patient may only read **their own** records → compare `req.user.id`).
- Refresh-token rotation + token blacklist (Phase 2).

---

## 4. Functional Modules

> Each module lists **Purpose · Features · Roles · DB Entities · APIs · UI Screens**.

### 4.1 Authentication & Authorization
- **Purpose:** Secure sign-up/sign-in and session management for all roles.
- **Features:** register, login, JWT issue/verify, refresh tokens, password reset (OTP/email), role selection, "remember me", account lockout, optional 2FA (Phase 3).
- **Roles:** all.
- **Entities:** `User`, `RefreshToken`, `OtpToken`.
- **APIs:** `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `GET /auth/me`.
- **UI:** Login, Register, Forgot/Reset password, Role-based redirect.

### 4.2 User & Staff Management
- **Purpose:** Admin manages provider/staff accounts and roles.
- **Features:** list/search users, create staff/doctor, deactivate, assign role & specialty, reset password.
- **Roles:** Admin (full), Doctor/Staff (read for dropdowns).
- **Entities:** `User`, `DoctorProfile`.
- **APIs:** `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `PATCH /users/:id/status`, `GET /users?role=doctor`.
- **UI:** Users list, User form, Doctor profile, Role manager.

### 4.3 Patient Registration & Demographics
- **Purpose:** Capture and maintain the patient master record.
- **Features:** demographics, unique **MRN** (medical record number), contact, address, blood group, emergency contact, allergies, chronic conditions, insurance link, photo, duplicate detection, search by name/phone/MRN.
- **Roles:** Admin/Staff/Doctor (manage), Patient (own profile).
- **Entities:** `Patient`, `Allergy`, `Condition`.
- **APIs:** `POST /patients`, `GET /patients?search=`, `GET /patients/:id`, `PUT /patients/:id`, `DELETE /patients/:id` (admin).
- **UI:** Patient list (search), Patient onboarding form, Patient profile header, Demographics edit.

### 4.4 Patient Portal (consumer)
- **Purpose:** Patient-facing self-service hub (mirrors screenshot app).
- **Features:** personalized dashboard (greeting, location, wallet/cashback), book appointment/lab, doorstep collection, my reports, prescriptions, health trackers, health score, diet plan, teleconsult, e-pharmacy, articles, notifications, profile.
- **Roles:** Patient.
- **Entities:** consumes most collections; `Wallet`, `Article`.
- **APIs:** aggregated `GET /portal/home`, plus module APIs below.
- **UI (bottom-tab):** Home · Care (catalog) · Call (teleconsult) · Vitals (trackers) · Profile.

### 4.5 Appointment Scheduling & Calendar
- **Purpose:** Book and manage in-clinic/teleconsult appointments.
- **Features:** slot booking by doctor/date, status (scheduled/completed/cancelled/no-show), reschedule, recurring, doctor availability/working hours, room/resource assignment, waitlist, reminders, calendar (day/week/month), drag-to-reschedule.
- **Roles:** all (patient books own).
- **Entities:** `Appointment`, `DoctorSchedule`, `Slot`, `Resource`.
- **APIs:** `POST /appointments`, `GET /appointments?status=&patient=&doctor=&date=`, `GET /appointments/:id`, `PUT /appointments/:id`, `DELETE /appointments/:id`, `GET /schedules/:doctorId/availability`.
- **UI:** Appointment list (filters), Booking form (patient+doctor+slot), Calendar view, Doctor availability manager.

### 4.6 Electronic Medical Records (EMR/EHR)
- **Purpose:** Longitudinal clinical record per patient.
- **Features:** encounters/visits, vitals history, problem list, medications, allergies, immunizations, lab results, attached documents, visit timeline, chart tabs.
- **Roles:** Doctor/Admin (write), Staff (limited), Patient (read own summary).
- **Entities:** `Encounter`, `ClinicalRecord`, `Vital`, `Problem`, `Medication`, `Immunization`, `LabResult`, `Document`.
- **APIs:** `GET /patients/:id/chart`, `POST /records`, `GET /records?patient=`, `GET /records/:id`, `PUT /records/:id`, `DELETE /records/:id`, `POST /records/:id/documents`, `GET /patients/:id/vitals`, `POST /vitals`.
- **UI:** Patient chart (tabbed: Summary, Visits, Vitals, Meds, Labs, Documents), Record form, Vitals trend charts.

### 4.7 Clinical Notes (SOAP)
- **Purpose:** Structured visit documentation.
- **Features:** SOAP (Subjective/Objective/Assessment/Plan), templates by specialty, ICD-10 diagnosis codes, smart text/macros, addendums, sign & lock, version history.
- **Roles:** Doctor (author), Admin (read), Patient (visit summary only).
- **Entities:** `ClinicalNote`, `NoteTemplate`, `DiagnosisCode`.
- **APIs:** `POST /notes`, `GET /notes?patient=&encounter=`, `GET /notes/:id`, `PUT /notes/:id`, `POST /notes/:id/sign`, `GET /note-templates`.
- **UI:** SOAP editor, Template picker, ICD-10 search, Signed-note viewer.

### 4.8 Prescription Management (e-Rx)
- **Purpose:** Create, manage, and share prescriptions.
- **Features:** drug catalog + dosage builder, frequency/duration, refills, drug-interaction & allergy alerts, favorites, printable/QR PDF, send to pharmacy, patient view.
- **Roles:** Doctor (prescribe), Patient (view/download), Pharmacist (fulfill — Phase 3).
- **Entities:** `Prescription`, `PrescriptionItem`, `Drug`, `Interaction`.
- **APIs:** `POST /prescriptions`, `GET /prescriptions?patient=`, `GET /prescriptions/:id`, `PUT /prescriptions/:id`, `GET /drugs?search=`, `GET /prescriptions/:id/pdf`.
- **UI:** Rx builder, Drug search, Interaction alert modal, Rx PDF preview, Patient "My Prescriptions".

### 4.9 Diagnostics & Lab Booking (screenshot-driven)
- **Purpose:** Catalog of tests/packages with booking + home collection.
- **Features:** test & package catalog (price, MRP, #tests, discount), category chips (Vitamins/Thyroid/Kidney/Liver), organ-based & concern-based browsing, segmented care plans (Women/Men/Elderly), cart, home sample collection scheduling, phlebotomist assignment, **checkup-journey tracker** (Booked → Collected → In Lab → Report Ready), report delivery (WhatsApp/SMS/Email), book-via-prescription.
- **Roles:** Patient (book), Staff/Admin (manage catalog), Lab tech (update status).
- **Entities:** `LabTest`, `LabPackage`, `LabOrder`, `LabResult`, `SampleCollection`, `Cart`.
- **APIs:** `GET /catalog/tests`, `GET /catalog/packages?category=`, `POST /lab-orders`, `GET /lab-orders?patient=`, `PATCH /lab-orders/:id/status`, `POST /lab-orders/:id/result`, `POST /sample-collections`.
- **UI:** Catalog browse (chips, organ, concern cards), Package detail, Cart/checkout, Home-collection scheduler, Order tracker (stepper), My Reports.

### 4.10 Calendar / Resource Management
- **Purpose:** Unified scheduling for doctors, rooms, equipment, collection slots.
- **Features:** multi-resource calendar, working hours, holidays, double-booking prevention, utilization view.
- **Roles:** Admin/Staff.
- **Entities:** `DoctorSchedule`, `Resource`, `Holiday`.
- **APIs:** `GET /calendar?resource=&range=`, `POST /schedules`, `PUT /schedules/:id`.
- **UI:** Master calendar, Resource manager, Working-hours editor.

### 4.11 AI Vision Screening (ophthalmology workflow)
- **Purpose:** Eye/vision assessment with assisted scoring (Meditab/ophthalmology inspiration).
- **Features:** visual acuity test (Snellen), color-vision (Ishihara), eye-image upload, AI risk flag (cataract/diabetic-retinopathy probability — model/stub), refraction entry, screening history, auto-recommendation, referral to specialist.
- **Roles:** Doctor/Staff (clinical), Patient (self-screen basic).
- **Entities:** `VisionScreening`, `EyeImage`, `ScreeningRule`.
- **APIs:** `POST /vision-screenings`, `GET /vision-screenings?patient=`, `GET /vision-screenings/:id`, `POST /vision-screenings/:id/images`, `POST /vision-screenings/analyze`.
- **UI:** Acuity test screen, Ishihara test, Eye-image uploader + result, Screening report, History.
- **Note:** Generalized into a **Health Screening** engine (BMI/risk + vision) — BMI/risk already implemented.

### 4.12 Health Trackers & Vitals (consumer)
- **Purpose:** Patient self-logging of health metrics (from "Vitals" tab).
- **Features:** Step count, blood sugar, weight, blood pressure, heart rate, medicine adherence; trend charts; goals; reminders; sync to chart for doctor view.
- **Roles:** Patient (log), Doctor (view).
- **Entities:** `Vital`, `TrackerLog`, `Goal`, `MedicationReminder`.
- **APIs:** `POST /trackers/:type`, `GET /trackers/:type?range=`, `GET /trackers/summary`.
- **UI:** Trackers list, Quick-log sheets, Trend charts, Goals.

### 4.13 Health Score & AI Diet Plan (engagement)
- **Purpose:** Gamified risk score (HealthKarma-style) + AI diet plan.
- **Features:** questionnaire → composite **HealthScore** (0–100) with category breakdown & tips; trend over time; **7-day smart diet plan** generator; lifestyle nudges.
- **Roles:** Patient.
- **Entities:** `HealthScore`, `Questionnaire`, `DietPlan`.
- **APIs:** `POST /health-score/calculate`, `GET /health-score?patient=`, `POST /diet-plan/generate`, `GET /diet-plan?patient=`.
- **UI:** Score calculator, Score dashboard (gauge), Diet plan view.

### 4.14 Teleconsultation (Call tab)
- **Purpose:** Audio/video consults + chat with doctors.
- **Features:** request consult, doctor availability, video room (WebRTC), in-call notes/Rx, post-call summary, call history, "call to book".
- **Roles:** Patient, Doctor.
- **Entities:** `Consultation`, `CallSession`, `ChatMessage`.
- **APIs:** `POST /consultations`, `GET /consultations?patient=`, `POST /consultations/:id/start`, `POST /consultations/:id/end`, WS signaling.
- **UI:** Consult request, Video room, In-call panel, Consult summary.

### 4.15 Billing & Payments
- **Purpose:** Charge for visits, labs, pharmacy; manage wallet.
- **Features:** itemized invoices, fee schedule, discounts/coupons, taxes, partial payments, **wallet & cashback** (₹300 first booking), payment gateway, refunds, receipts, statements.
- **Roles:** Admin/Staff (manage), Patient (pay/view).
- **Entities:** `Invoice`, `InvoiceItem`, `Payment`, `Wallet`, `Coupon`, `FeeSchedule`.
- **APIs:** `POST /invoices`, `GET /invoices?patient=`, `POST /payments`, `POST /payments/webhook`, `GET /wallet`, `POST /coupons/apply`.
- **UI:** Invoice list, Invoice detail, Checkout/pay, Wallet, Coupon entry, Receipts.

### 4.16 Insurance Management
- **Purpose:** Store policies and process claims.
- **Features:** policy capture, eligibility check, claim creation, status tracking, pre-authorization, payer catalog, document attach.
- **Roles:** Admin/Staff, Patient (view).
- **Entities:** `InsurancePolicy`, `Payer`, `Claim`, `ClaimItem`.
- **APIs:** `POST /insurance/policies`, `GET /insurance/policies?patient=`, `POST /claims`, `GET /claims?patient=`, `PATCH /claims/:id/status`.
- **UI:** Policy form, Policy list, Claim wizard, Claim tracker.

### 4.17 Document Management
- **Purpose:** Central store for reports, scans, consents.
- **Features:** upload (pdf/img/doc, ≤5MB — implemented), tags/categories, link to patient/encounter, preview, version, access control, secure URLs.
- **Roles:** Doctor/Staff/Admin (manage), Patient (own).
- **Entities:** `Document`, `DocumentTag`.
- **APIs:** `POST /records/:id/documents` (implemented), `GET /documents?patient=`, `DELETE /documents/:id`.
- **UI:** Document library, Uploader, Preview, Tag filter.

### 4.18 Digital Signatures & Consent
- **Purpose:** Capture legally-meaningful e-signatures on forms/consents.
- **Features:** consent templates, draw/type signature, multi-party signing, timestamp + IP audit, locked signed PDF, verification hash.
- **Roles:** Patient (sign), Doctor/Staff (request), Admin (templates).
- **Entities:** `ConsentForm`, `SignatureEnvelope`, `Signature`.
- **APIs:** `POST /consents/send`, `GET /consents?patient=`, `POST /consents/:id/sign`, `GET /consents/:id/pdf`.
- **UI:** Consent template manager, Signing pad, Signed-doc viewer.

### 4.19 Notifications
- **Purpose:** Multi-channel alerts (in-app, email, SMS, WhatsApp, push).
- **Features:** appointment & medicine reminders, report-ready, payment, broadcast, preferences, templates, scheduling/queue.
- **Roles:** all (receive), Admin (broadcast/templates).
- **Entities:** `Notification`, `NotificationTemplate`, `NotificationPreference`.
- **APIs:** `GET /notifications`, `PATCH /notifications/:id/read`, `POST /notifications/broadcast`, `PUT /notifications/preferences`.
- **UI:** Notification center, Preferences, Broadcast composer.

### 4.20 Reports & Analytics
- **Purpose:** Operational & clinical dashboards.
- **Features:** KPIs (appointments, revenue, no-shows, new patients), trends, doctor productivity, lab TAT, demographics, exportable CSV/PDF, date filters.
- **Roles:** Admin (full), Doctor (own stats).
- **Entities:** aggregations across collections; `ReportSnapshot`.
- **APIs:** `GET /analytics/overview`, `GET /analytics/revenue`, `GET /analytics/appointments`, `GET /analytics/patients`.
- **UI:** Analytics dashboard (cards + charts), Report builder, Export.

### 4.21 Audit Logs
- **Purpose:** Tamper-evident trail of sensitive actions.
- **Features:** who/what/when/where for every write to clinical/financial data, login history, filter/search, immutable, export.
- **Roles:** Admin.
- **Entities:** `AuditLog`.
- **APIs:** `GET /audit?user=&entity=&range=` (write is automatic via middleware).
- **UI:** Audit explorer (filters, detail drawer).

### 4.22 Settings & Configuration
- **Purpose:** Clinic-level configuration.
- **Features:** clinic profile/branding, working hours, fee schedule, test catalog, templates, roles/permissions, notification settings, integrations keys, localization.
- **Roles:** Admin.
- **Entities:** `ClinicSetting`, `FeeSchedule`, `Catalog`.
- **APIs:** `GET /settings`, `PUT /settings`, `GET /settings/catalog`, `PUT /settings/catalog`.
- **UI:** Settings (tabbed: General, Schedule, Billing, Catalog, Notifications, Integrations).

### 4.23 e-Pharmacy & Supplements (engagement)
- **Purpose:** Order medicines/supplements (from screenshots).
- **Features:** product catalog, cart, order, track, prescription-gated drugs.
- **Roles:** Patient, Pharmacist (Phase 3).
- **Entities:** `Product`, `Order`, `OrderItem`.
- **APIs:** `GET /shop/products`, `POST /shop/orders`, `GET /shop/orders?patient=`.
- **UI:** Shop, Product detail, Cart, Orders.

### 4.24 Content / Articles
- **Purpose:** Health education ("Articles for you").
- **Features:** categorized articles, search, bookmarks.
- **Roles:** Patient (read), Admin (manage).
- **Entities:** `Article`, `Category`.
- **APIs:** `GET /articles?category=`, `GET /articles/:id`.
- **UI:** Article feed, Article detail.

---

## 5. Enterprise / Premium Features (recruiter "wow")
1. **Role-aware dual portal** from one codebase (patient app + clinic console).
2. **Audit trail + immutable logs** (HIPAA-style compliance signal).
3. **AI vision screening & health-risk scoring** (real ML or well-stubbed inference).
4. **Drug-interaction & allergy alerting** engine.
5. **Checkup-journey live tracker** (order status stepper + WhatsApp/SMS delivery).
6. **Wallet, cashback & coupon engine** with payment-gateway integration.
7. **e-Signature consent** with hash verification + locked PDFs.
8. **Real-time notifications & teleconsult** via WebSocket/WebRTC.
9. **Analytics dashboards** with exportable reports.
10. **Internationalization (i18n)** + accessibility (WCAG) + dark mode.
11. **Offline-friendly PWA** patient app with installable home-screen.
12. **FHIR-compatible data export** (interoperability talking point).

---

## 6. Database Schema (MongoDB / Mongoose)

> Conventions: every collection has `_id`, `createdAt`, `updatedAt`. Money in paise (integer). Soft-delete via `isActive`/`deletedAt` where relevant.

### 6.1 Core
```
User { name, email(unique), passwordHash, role[admin|doctor|staff|patient],
       phone, isActive, lastLoginAt }
DoctorProfile { user→User, specialty, qualifications[], licenseNo,
                consultationFee, bio, photoUrl }
Patient { mrn(unique), name, age, gender, phone, email, address, bloodGroup,
          emergencyContact{name,phone}, allergies[], conditions[],
          onboardedBy→User, userAccount→User(optional) }
RefreshToken { user→User, tokenHash, expiresAt, revoked }
```

### 6.2 Scheduling
```
DoctorSchedule { doctor→User, weekday, startTime, endTime, slotMinutes, isOff }
Appointment { patient→Patient, doctor→User, date, reason, notes,
              status[scheduled|completed|cancelled|no_show], type[clinic|tele],
              resource→Resource, bookedBy→User }
Resource { name, type[room|equipment|collection_slot], isActive }
Holiday { date, label }
```

### 6.3 Clinical
```
Encounter { patient→Patient, doctor→User, appointment→Appointment, date, type }
ClinicalRecord { patient→Patient, doctor→User, encounter→Encounter, visitDate,
                 diagnosis, prescription, notes, documents[Document], createdBy→User }
ClinicalNote { encounter→Encounter, patient→Patient, author→User,
               subjective, objective, assessment, plan, icdCodes[], signedAt, locked }
Vital { patient→Patient, recordedBy→User, type[bp|sugar|weight|hr|steps|temp],
        value, unit, recordedAt }
Prescription { patient→Patient, doctor→User, items[PrescriptionItem],
               status[active|completed|cancelled], pdfUrl }
PrescriptionItem { drug→Drug, dosage, frequency, durationDays, instructions, refills }
Drug { name, genericName, form, strength, interactions[] }
VisionScreening { patient→Patient, screenedBy→User,
                  acuityLeft, acuityRight, colorVision, refraction{},
                  eyeImages[EyeImage], aiRiskFlags[], riskLevel, recommendations[] }
Screening { patient→Patient, heightCm, weightKg, systolic, diastolic, smoker,
            diabetic, bmi, bmiCategory, riskScore, riskLevel, recommendations[],
            screenedBy→User }   // implemented
```

### 6.4 Diagnostics
```
LabTest { code, name, category[vitamins|thyroid|kidney|liver|...], price, mrp, sampleType }
LabPackage { name, tests[LabTest], price, mrp, discountPct, segment[women|men|elderly|popular] }
LabOrder { patient→Patient, items[LabTest|LabPackage], total, paymentStatus,
           status[booked|collected|in_lab|report_ready|cancelled], reportUrl }
SampleCollection { order→LabOrder, address, slot, phlebotomist→User, status }
```

### 6.5 Finance
```
Invoice { patient→Patient, items[InvoiceItem], subtotal, tax, discount, total,
          status[draft|unpaid|partial|paid], dueDate }
InvoiceItem { description, qty, unitPrice, amount, sourceType[appointment|lab|pharmacy] }
Payment { invoice→Invoice, patient→Patient, amount, method, gatewayRef, status }
Wallet { patient→Patient, balance, transactions[{type,amount,ref,at}] }
Coupon { code, type[flat|pct], value, minAmount, expiresAt, usageLimit }
```

### 6.6 Insurance
```
Payer { name, code, contact }
InsurancePolicy { patient→Patient, payer→Payer, policyNo, holderName,
                  validFrom, validTo, coverageAmount }
Claim { policy→InsurancePolicy, patient→Patient, items[ClaimItem], amount,
        status[draft|submitted|approved|rejected|paid], preAuthNo }
```

### 6.7 Engagement & platform
```
HealthScore { patient→Patient, score, breakdown{}, answers{}, calculatedAt }
DietPlan { patient→Patient, days[{meals[]}], generatedAt }
TrackerLog { patient→Patient, type, value, loggedAt }   // backed by Vital
Consultation { patient→Patient, doctor→User, mode[video|audio|chat],
               status, startedAt, endedAt, summary }
Document { patient→Patient, encounter→Encounter, fileName, originalName, url,
           tags[], uploadedBy→User }
ConsentForm { title, body, version }
SignatureEnvelope { consent→ConsentForm, patient→Patient, signers[],
                    status, signedPdfUrl, hash }
Notification { user→User, channel, type, title, body, read, sentAt }
NotificationTemplate { key, channel, subject, body }
AuditLog { actor→User, action, entity, entityId, before, after, ip, at }
ClinicSetting { key, value }
Product { name, type[medicine|supplement], price, mrp, rxRequired, stock }
Order { patient→Patient, items[OrderItem], total, status }
Article { title, slug, category, body, coverUrl, publishedAt }
```

### 6.8 Indexing (examples)
`User.email`(unique), `Patient.mrn`(unique), `Patient {name, phone}`(text),
`Appointment {doctor, date}`, `Appointment.status`, `LabOrder {patient, status}`,
`AuditLog {entity, entityId, at}`, `Notification {user, read}`.

---

## 7. Backend Architecture (Node + Express + MongoDB)

### 7.1 Target folder structure
```
backend/
├── src/
│   ├── config/            # db, env, constants
│   ├── models/            # Mongoose schemas (one file per entity)
│   ├── controllers/       # request/response handling (thin)
│   ├── services/          # business logic (reusable, testable)
│   ├── routes/            # express routers (one per module)
│   ├── middleware/        # auth, role, validate, audit, error, upload, rateLimit
│   ├── validators/        # Joi/Zod schemas per endpoint
│   ├── utils/             # token, hashing, pdf, mailer, sms
│   ├── jobs/              # cron/queue: reminders, report delivery
│   ├── integrations/      # payment, whatsapp, ai providers
│   └── app.js             # express app wiring
├── uploads/               # local files (→ S3 later)
├── tests/                 # unit + integration
└── server.js              # bootstrap (connect db, listen)
```
> Current project is the **flat MVP** of this (routes + models + middleware). Phase 2 introduces the controller/service split.

### 7.2 Layering
`Router` (declares path + middleware) → `Controller` (parse req, call service, send res) → `Service` (business rules, transactions, emits audit) → `Model` (data access).

### 7.3 Middleware stack (order)
`cors → json → rateLimit → (route) → auth → role → validate → controller → audit → errorHandler`.

### 7.4 Authentication strategy
- bcrypt password hashing; JWT **access token** (15 min) + **refresh token** (7 days, rotated, stored hashed).
- `Authorization: Bearer <token>` → `auth` middleware verifies and attaches `req.user`.
- Logout revokes refresh token; optional 2FA via OTP.

### 7.5 RBAC implementation
- Coarse: `role('admin','doctor')` middleware on routes (implemented).
- Fine: ownership checks in services (patient sees only own data).
- Central permission map in config for maintainability (Phase 2).

### 7.6 Cross-cutting
- **Validation:** Joi/Zod per endpoint → 422 with field errors.
- **Errors:** central error handler → consistent `{ message, code, details }`.
- **Audit:** `audit()` helper invoked by services on writes.
- **Files:** Multer (type + 5MB limit — implemented) → `/uploads`, served statically; signed URLs later.

---

## 8. Frontend Architecture (Angular 17)

### 8.1 App areas
Two route groups behind one shell, chosen by role after login:
- **/portal** → Patient Portal (mobile-first, bottom tabs).
- **/console** → Provider Console (desktop, sidebar).

### 8.2 Route hierarchy
```
/login, /register, /forgot-password                 (public)

/console (AuthGuard + roleGuard[admin,doctor,staff], ConsoleLayout)
  ├── dashboard
  ├── patients · patients/new · patients/:id (chart) · patients/:id/edit
  ├── appointments · appointments/new · appointments/:id/edit · calendar
  ├── records · records/new · records/:id/edit
  ├── notes/:encounterId
  ├── prescriptions · prescriptions/new
  ├── screening · screening/vision
  ├── labs/orders · labs/catalog
  ├── billing/invoices · billing/payments
  ├── insurance/policies · insurance/claims
  ├── documents
  ├── consents
  ├── reports (analytics)
  ├── audit            (admin)
  └── settings         (admin)

/portal (AuthGuard + roleGuard[patient], PortalLayout — bottom tabs)
  ├── home
  ├── care (catalog) · care/package/:id · care/cart · care/checkout
  ├── appointments · appointments/book
  ├── call (teleconsult)
  ├── vitals (trackers) · vitals/score · vitals/diet-plan
  ├── reports · prescriptions · documents
  ├── wallet · orders
  └── profile
```

### 8.3 Module / folder hierarchy (standalone components + feature folders)
```
frontend/src/app/
├── core/            # singletons: services, guards, interceptors, models
│   ├── services/    # auth, patient, appointment, record, screening, lab,
│   │                #   billing, insurance, notification, user, analytics
│   ├── guards/      # auth.guard, role.guard
│   ├── interceptors/# auth (token), error, loading
│   └── models/      # interfaces
├── shared/          # reusable UI: button, card, table, modal, form-field,
│                    #   badge, stepper, chart, empty-state, file-upload, pipes
├── layouts/         # console-layout (sidebar+topbar), portal-layout (tabs), auth-layout
├── features/
│   ├── auth/        # login, register, forgot/reset
│   ├── patients/    # list, form, chart (+ tabs)
│   ├── appointments/# list, form, calendar
│   ├── emr/         # records, notes, vitals
│   ├── prescriptions/
│   ├── screening/   # bmi/risk, vision
│   ├── labs/        # catalog, cart, orders, tracker
│   ├── billing/     # invoices, payments, wallet
│   ├── insurance/
│   ├── documents/
│   ├── consents/
│   ├── portal/      # home, care, call, vitals, profile
│   ├── reports/
│   ├── audit/
│   └── settings/
├── app.routes.ts
└── app.config.ts    # provideHttpClient(withInterceptors(...)), provideRouter
```

### 8.4 Component hierarchy (example: Patient Chart)
```
PatientChartPage
├── PatientHeaderCard (demographics, MRN, allergies)
├── ChartTabs
│   ├── SummaryTab (problems, meds, recent vitals)
│   ├── VisitsTab → EncounterList → EncounterCard
│   ├── VitalsTab → VitalsChart (shared)
│   ├── MedsTab → PrescriptionList
│   ├── LabsTab → LabResultTable
│   └── DocumentsTab → DocumentLibrary (shared FileUpload)
└── ChartActions (new note, new Rx, book appt)
```

### 8.5 Shared components (design system)
`HbButton, HbCard, HbTable, HbModal, HbBadge, HbStepper, HbChart, HbEmptyState, HbFileUpload, HbSearchBar, HbStatChip, HbTabs, HbConfirmDialog`, plus pipes (`statusColor`, `currency`, `age`) and a global theme (CSS variables — already started).

### 8.6 State & data
- Services + RxJS + Angular **signals** for local reactive state (already used for `currentUser`).
- HTTP interceptor attaches JWT (implemented); error interceptor → toast.
- Optional NgRx/SignalStore in Phase 3 if global state grows.

### 8.7 Layout architecture
- **AuthLayout:** centered card on gradient (implemented for login/register).
- **ConsoleLayout:** fixed left sidebar (modules) + top bar (search, notifications, user) + content outlet.
- **PortalLayout:** top greeting bar + content + bottom tab bar + floating CTA (mirrors screenshots).

---

## 9. Non-Functional Requirements
- **Security:** HTTPS, bcrypt, JWT rotation, RBAC, input validation, rate limiting, helmet headers, secrets in env, least-privilege file URLs, audit logging.
- **Privacy/Compliance:** consent management, audit trail, data-access scoping, export/delete (GDPR-style), HIPAA-aligned practices.
- **Performance:** indexed queries, pagination, lazy-loaded Angular features, debounced search (implemented), caching (Phase 2).
- **Scalability:** stateless API, horizontal scaling, queue for async jobs, object storage for files.
- **Reliability:** central error handling, health-check endpoint, graceful shutdown, backups.
- **Usability/Accessibility:** responsive, WCAG AA, keyboard nav, i18n-ready, dark mode.
- **Observability:** request logging, metrics, error tracking (Sentry — Phase 3).

---

## 10. Integrations
| Type | Provider (example) | Phase |
|------|--------------------|-------|
| Payments/Wallet | Razorpay / Stripe | 2 |
| SMS/WhatsApp | Twilio / Gupshup | 2 |
| Email | SendGrid / SMTP | 1–2 |
| Video | WebRTC + TURN / Twilio Video | 3 |
| AI vision/risk | Python microservice / hosted model | 3 |
| Storage | AWS S3 | 2 |
| e-Sign | Internal (hash) / DocuSign | 2–3 |

---

## 11. Implementation Roadmap

### Phase 1 — MVP (✅ largely built)
Auth (JWT+bcrypt), RBAC middleware, users, patient registration & search, appointments CRUD, clinical records + document upload, health screening (BMI/risk), Angular auth + provider UI for the above, role-gated actions, English-localized.

### Phase 2 — Clinical depth + commerce
SOAP clinical notes + templates + ICD-10; prescriptions (e-Rx + PDF); patient chart (tabbed) & vitals trends; lab catalog + booking + home collection + order tracker; billing/invoices + payment gateway + wallet/coupons; notifications (email/SMS); patient portal home + care tabs; controller/service refactor; refresh tokens; validation layer.

### Phase 3 — Engagement + intelligence
Teleconsultation (WebRTC) + chat; AI vision screening + image analysis; HealthScore + AI diet plan; health trackers + reminders; e-pharmacy; insurance policies & claims; e-signature consents; analytics dashboards; audit explorer; i18n + PWA.

### Phase 4 — Enterprise hardening
Multi-clinic/tenant support; FHIR export; advanced RBAC/permission editor; observability (Sentry/metrics); load testing & caching (Redis); CI/CD + automated tests; mobile wrapper (Capacitor); SLA dashboards.

---

## 12. Premium Features that signal "production-grade"
- Tabbed **longitudinal patient chart** with vitals trend charts.
- **Live order/checkup-journey tracker** with WhatsApp/SMS report delivery.
- **AI vision screening** + **health-risk scoring** with explainable recommendations.
- **Drug-interaction alerts** during prescribing.
- **Wallet + cashback + coupon** commerce engine with real gateway.
- **e-Signature consents** with verifiable hash + locked PDFs.
- **Immutable audit logs** + admin audit explorer.
- **Analytics dashboards** with exports.
- **Dual portal (patient + provider)** from one Angular codebase with role-based routing.
- **PWA install + offline** patient app, dark mode, i18n, WCAG accessibility.

---

## 13. Current Code → Vision Mapping
| SRS module | Status in repo |
|------------|----------------|
| Auth & RBAC | ✅ implemented (JWT, bcrypt, `role` middleware) |
| Users | ✅ `GET /api/users` |
| Patient registration | ✅ CRUD + search |
| Appointments | ✅ CRUD + filters + status |
| EMR records + documents | ✅ records CRUD + multer upload |
| Health screening | ✅ BMI/risk engine (vision = next) |
| Provider UI (Angular) | ✅ patients/appointments/records/screening + role-gated UI |
| Everything else (notes, Rx, labs, billing, insurance, teleconsult, portal, analytics, audit, settings) | ⬜ roadmap Phase 2–4 |

---

*End of SRS v1.0.*
