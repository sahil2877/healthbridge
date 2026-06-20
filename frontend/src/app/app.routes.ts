import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { PatientListComponent } from './pages/patient-list/patient-list.component';
import { PatientFormComponent } from './pages/patient-form/patient-form.component';
import { AppointmentListComponent } from './pages/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './pages/appointment-form/appointment-form.component';
import { RecordListComponent } from './pages/record-list/record-list.component';
import { RecordFormComponent } from './pages/record-form/record-form.component';
import { PrescriptionListComponent } from './pages/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from './pages/prescription-form/prescription-form.component';
import { PrescriptionViewComponent } from './pages/prescription-view/prescription-view.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './pages/invoice-form/invoice-form.component';
import { InvoiceViewComponent } from './pages/invoice-view/invoice-view.component';
import { ScreeningComponent } from './pages/screening/screening.component';
import { PortalLayoutComponent } from './pages/portal/portal-layout.component';
import { PortalHomeComponent } from './pages/portal/portal-home.component';
import { PortalCareComponent } from './pages/portal/portal-care.component';
import { PortalVitalsComponent } from './pages/portal/portal-vitals.component';
import { PortalProfileComponent } from './pages/portal/portal-profile.component';

export const routes: Routes = [
  // public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Patient portal (consumer area) — desktop web layout
  {
    path: 'portal',
    component: PortalLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: PortalHomeComponent },
      { path: 'care', component: PortalCareComponent },
      { path: 'vitals', component: PortalVitalsComponent },
      { path: 'profile', component: PortalProfileComponent }
    ]
  },

  // protected area (navbar shell + children) — locked by authGuard
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: DashboardComponent },

      { path: 'patients', component: PatientListComponent },
      { path: 'patients/new', component: PatientFormComponent },
      { path: 'patients/:id/edit', component: PatientFormComponent },

      { path: 'appointments', component: AppointmentListComponent },
      { path: 'appointments/new', component: AppointmentFormComponent },
      { path: 'appointments/:id/edit', component: AppointmentFormComponent },

      { path: 'records', component: RecordListComponent },
      { path: 'records/new', component: RecordFormComponent },
      { path: 'records/:id/edit', component: RecordFormComponent },

      { path: 'prescriptions', component: PrescriptionListComponent },
      { path: 'prescriptions/new', component: PrescriptionFormComponent },
      { path: 'prescriptions/:id', component: PrescriptionViewComponent },
      { path: 'prescriptions/:id/edit', component: PrescriptionFormComponent },

      { path: 'invoices', component: InvoiceListComponent },
      { path: 'invoices/new', component: InvoiceFormComponent },
      { path: 'invoices/:id', component: InvoiceViewComponent },
      { path: 'invoices/:id/edit', component: InvoiceFormComponent },

      { path: 'screening', component: ScreeningComponent }
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];
