import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsOverview } from '../../models/analytics.model';
import { Invoice } from '../../models/invoice.model';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

// Provider analytics dashboard — KPIs and dependency-free CSS charts.
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Welcome back, {{ firstName }}</h1>
          <p>Here's what's happening across your facility today.</p>
        </div>
        <div style="display:flex;gap:10px;">
          <a class="btn btn-primary" routerLink="/patients/new"><i class="fa-solid fa-plus"></i> New Patient</a>
        </div>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>
      <div class="empty-state" *ngIf="loading"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading dashboard...</p></div>

      <div *ngIf="data">
        <!-- Stat cards -->
        <div class="stat-grid">
          <a class="stat-card" routerLink="/patients">
            <div class="stat-card-top">
              <div class="stat-icon teal"><i class="fa-solid fa-users"></i></div>
            </div>
            <div class="stat-value">{{ data.counts.patients }}</div>
            <div class="stat-label">Total Patients</div>
          </a>
          <a class="stat-card" routerLink="/appointments">
            <div class="stat-card-top">
              <div class="stat-icon blue"><i class="fa-solid fa-calendar-check"></i></div>
            </div>
            <div class="stat-value">{{ data.counts.appointments }}</div>
            <div class="stat-label">Appointments</div>
          </a>
          <a class="stat-card" routerLink="/prescriptions">
            <div class="stat-card-top">
              <div class="stat-icon pink"><i class="fa-solid fa-prescription-bottle-medical"></i></div>
            </div>
            <div class="stat-value">{{ data.counts.prescriptions }}</div>
            <div class="stat-label">Prescriptions</div>
          </a>
          <a class="stat-card" routerLink="/records">
            <div class="stat-card-top">
              <div class="stat-icon purple"><i class="fa-solid fa-file-medical"></i></div>
            </div>
            <div class="stat-value">{{ data.counts.records }}</div>
            <div class="stat-label">Clinical Records</div>
          </a>
          <a class="stat-card" routerLink="/screening">
            <div class="stat-card-top">
              <div class="stat-icon warm"><i class="fa-solid fa-heart-circle-bolt"></i></div>
            </div>
            <div class="stat-value">{{ data.counts.screenings }}</div>
            <div class="stat-label">Screenings</div>
          </a>
          <a class="stat-card" routerLink="/invoices">
            <div class="stat-card-top">
              <div class="stat-icon success"><i class="fa-solid fa-sack-dollar"></i></div>
              <span class="stat-trend up"><i class="fa-solid fa-arrow-up"></i></span>
            </div>
            <div class="stat-value">₹{{ data.revenue.collected }}</div>
            <div class="stat-label">Revenue collected</div>
          </a>
        </div>

        <!-- Revenue summary -->
        <div class="grid-3">
          <div class="card">
            <div class="card-subtitle">Total billed</div>
            <div class="stat-value" style="margin-top:6px;">₹{{ data.revenue.billed }}</div>
          </div>
          <div class="card">
            <div class="card-subtitle">Collected</div>
            <div class="stat-value" style="margin-top:6px;color:var(--primary);">₹{{ data.revenue.collected }}</div>
          </div>
          <div class="card">
            <div class="card-subtitle">Outstanding</div>
            <div class="stat-value" style="margin-top:6px;color:var(--danger);">₹{{ data.revenue.outstanding }}</div>
          </div>
        </div>

        <!-- Analytics -->
        <div class="grid-3">
          <div class="card">
            <div class="card-header"><div class="card-title">Appointments by status</div></div>
            <div class="empty-state" *ngIf="apptKeys.length === 0"><p>No data</p></div>
            <div class="bar-row" *ngFor="let k of apptKeys">
              <div class="bl">{{ k }}</div>
              <div class="bar-track"><div class="bar-fill"
                   [style.width.%]="pct(data.appointmentsByStatus[k], apptMax)"
                   [style.background]="apptColor(k)"></div></div>
              <div class="bv">{{ data.appointmentsByStatus[k] }}</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">Screening risk levels</div></div>
            <div class="empty-state" *ngIf="riskKeys.length === 0"><p>No data</p></div>
            <div class="bar-row" *ngFor="let k of riskKeys">
              <div class="bl">{{ k }}</div>
              <div class="bar-track"><div class="bar-fill"
                   [style.width.%]="pct(data.screeningByRisk[k], riskMax)"
                   [style.background]="riskColor(k)"></div></div>
              <div class="bv">{{ data.screeningByRisk[k] }}</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">New patients / month</div></div>
            <div class="empty-state" *ngIf="data.patientsTrend.length === 0"><p>No data</p></div>
            <div class="vbars" *ngIf="data.patientsTrend.length > 0">
              <div class="vbar" *ngFor="let t of data.patientsTrend">
                <div class="vv">{{ t.count }}</div>
                <div class="col" [style.height.%]="pct(t.count, trendMax)"></div>
                <div class="vl">{{ t.month }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent activity + invoices -->
        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Recent appointments</div>
              <a class="btn btn-sm btn-ghost" routerLink="/appointments">View all</a>
            </div>
            <div class="empty-state" *ngIf="data.recentAppointments.length === 0"><i class="fa-solid fa-calendar"></i><p>No recent appointments</p></div>
            <div class="timeline" *ngIf="data.recentAppointments.length > 0">
              <div class="timeline-item" *ngFor="let a of data.recentAppointments">
                <div class="timeline-dot" style="background:var(--gradient-2)"><i class="fa-solid fa-calendar-check"></i></div>
                <div class="timeline-content">
                  <p>{{ apptPatient(a) }} → {{ apptDoctor(a) }}</p>
                  <small>{{ a.date | date:'medium' }}</small>
                  <span class="timeline-time"><span class="badge" [ngClass]="apptBadge(a.status)">{{ a.status }}</span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Recent invoices</div>
              <a class="btn btn-sm btn-ghost" routerLink="/invoices">View all</a>
            </div>
            <div class="empty-state" *ngIf="data.recentInvoices.length === 0"><i class="fa-solid fa-receipt"></i><p>No invoices yet</p></div>
            <div class="appt-item" *ngFor="let inv of data.recentInvoices">
              <div class="stat-icon success" style="width:40px;height:40px;font-size:14px;"><i class="fa-solid fa-receipt"></i></div>
              <div class="appt-info">
                <p>{{ invPatient(inv) }}</p>
                <small>₹{{ inv.total }}</small>
              </div>
              <span class="badge" [ngClass]="invBadge(inv.status)">{{ inv.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  data: AnalyticsOverview | null = null;
  loading = false;
  error = '';

  constructor(private analytics: AnalyticsService, private auth: AuthService) {}

  get firstName(): string {
    const name = this.auth.currentUser()?.name || 'Doctor';
    return name.startsWith('Dr') ? name : 'Dr. ' + name.split(' ')[0];
  }

  apptBadge(status: string | undefined): string {
    if (status === 'completed') return 'badge-success';
    if (status === 'cancelled' || status === 'no_show') return 'badge-danger';
    if (status === 'confirmed') return 'badge-primary';
    return 'badge-info';
  }
  invBadge(status: string | undefined): string {
    if (status === 'paid') return 'badge-success';
    if (status === 'overdue') return 'badge-danger';
    return 'badge-warning';
  }

  ngOnInit(): void {
    this.loading = true;
    this.analytics.getOverview().subscribe({
      next: (d) => { this.data = d; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load dashboard'; this.loading = false; }
    });
  }

  get apptKeys(): string[] { return this.data ? Object.keys(this.data.appointmentsByStatus) : []; }
  get riskKeys(): string[] { return this.data ? Object.keys(this.data.screeningByRisk) : []; }

  get apptMax(): number { return Math.max(1, ...this.apptKeys.map((k) => this.data!.appointmentsByStatus[k])); }
  get riskMax(): number { return Math.max(1, ...this.riskKeys.map((k) => this.data!.screeningByRisk[k])); }
  get trendMax(): number { return Math.max(1, ...(this.data?.patientsTrend.map((t) => t.count) || [1])); }

  pct(value: number, max: number): number {
    return max > 0 ? Math.round((value / max) * 100) : 0;
  }

  apptColor(status: string): string {
    if (status === 'completed') return '#0d9488';
    if (status === 'cancelled' || status === 'no_show') return '#dc2626';
    return '#2563eb';
  }
  riskColor(level: string): string {
    if (level === 'High') return '#dc2626';
    if (level === 'Medium') return '#d97706';
    return '#0d9488';
  }

  invPatient(inv: Invoice): string {
    const p = inv.patient;
    if (!p) return '(Deleted)';
    return typeof p === 'object' ? (p as Patient).name : 'Patient';
  }
  apptPatient(a: Appointment): string {
    const p = a.patient;
    if (!p) return '(Deleted)';
    return typeof p === 'object' ? (p as Patient).name : 'Patient';
  }
  apptDoctor(a: Appointment): string {
    return typeof a.doctor === 'object' ? (a.doctor as User).name : 'Doctor';
  }
}
