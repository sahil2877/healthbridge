import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsOverview } from '../../models/analytics.model';
import { Invoice } from '../../models/invoice.model';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

// Provider analytics dashboard — KPIs and dependency-free CSS charts.
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header"><h2>Dashboard</h2></div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>
      <div class="empty" *ngIf="loading">Loading dashboard...</div>

      <div *ngIf="data">
        <!-- KPI cards -->
        <div class="kpi-grid" style="margin-bottom:22px;">
          <a class="kpi" routerLink="/patients" style="text-decoration:none; color:inherit;">
            <div class="icon">👥</div><div class="label">Patients</div><div class="value">{{ data.counts.patients }}</div>
          </a>
          <a class="kpi" routerLink="/appointments" style="text-decoration:none; color:inherit;">
            <div class="icon">📅</div><div class="label">Appointments</div><div class="value">{{ data.counts.appointments }}</div>
          </a>
          <a class="kpi" routerLink="/prescriptions" style="text-decoration:none; color:inherit;">
            <div class="icon">💊</div><div class="label">Prescriptions</div><div class="value">{{ data.counts.prescriptions }}</div>
          </a>
          <a class="kpi" routerLink="/records" style="text-decoration:none; color:inherit;">
            <div class="icon">📋</div><div class="label">Records</div><div class="value">{{ data.counts.records }}</div>
          </a>
          <a class="kpi" routerLink="/screening" style="text-decoration:none; color:inherit;">
            <div class="icon">🩺</div><div class="label">Screenings</div><div class="value">{{ data.counts.screenings }}</div>
          </a>
        </div>

        <!-- Revenue -->
        <div class="portal-h">Revenue</div>
        <div class="kpi-grid" style="margin-bottom:22px;">
          <div class="kpi"><div class="label">Total billed</div><div class="value">₹{{ data.revenue.billed }}</div></div>
          <div class="kpi"><div class="label">Collected</div><div class="value" style="color:var(--primary);">₹{{ data.revenue.collected }}</div></div>
          <div class="kpi"><div class="label">Outstanding</div><div class="value" style="color:var(--danger);">₹{{ data.revenue.outstanding }}</div></div>
        </div>

        <div class="grid grid-3" style="margin-bottom:22px;">
          <!-- Appointments by status -->
          <div class="card">
            <h3 style="margin-top:0;">Appointments by status</h3>
            <div class="empty" *ngIf="apptKeys.length === 0">No data</div>
            <div class="bar-row" *ngFor="let k of apptKeys">
              <div class="bl">{{ k }}</div>
              <div class="bar-track"><div class="bar-fill"
                   [style.width.%]="pct(data.appointmentsByStatus[k], apptMax)"
                   [style.background]="apptColor(k)"></div></div>
              <div class="bv">{{ data.appointmentsByStatus[k] }}</div>
            </div>
          </div>

          <!-- Screening by risk -->
          <div class="card">
            <h3 style="margin-top:0;">Screening risk levels</h3>
            <div class="empty" *ngIf="riskKeys.length === 0">No data</div>
            <div class="bar-row" *ngFor="let k of riskKeys">
              <div class="bl">{{ k }}</div>
              <div class="bar-track"><div class="bar-fill"
                   [style.width.%]="pct(data.screeningByRisk[k], riskMax)"
                   [style.background]="riskColor(k)"></div></div>
              <div class="bv">{{ data.screeningByRisk[k] }}</div>
            </div>
          </div>

          <!-- Patients trend -->
          <div class="card">
            <h3 style="margin-top:0;">New patients / month</h3>
            <div class="empty" *ngIf="data.patientsTrend.length === 0">No data</div>
            <div class="vbars" *ngIf="data.patientsTrend.length > 0">
              <div class="vbar" *ngFor="let t of data.patientsTrend">
                <div class="vv">{{ t.count }}</div>
                <div class="col" [style.height.%]="pct(t.count, trendMax)"></div>
                <div class="vl">{{ t.month }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent activity -->
        <div class="grid grid-3">
          <div class="card">
            <h3 style="margin-top:0;">Recent invoices</h3>
            <div class="empty" *ngIf="data.recentInvoices.length === 0">None</div>
            <div *ngFor="let inv of data.recentInvoices"
                 style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
              <span>{{ invPatient(inv) }}</span>
              <span><b>₹{{ inv.total }}</b> <span class="badge">{{ inv.status }}</span></span>
            </div>
          </div>
          <div class="card" style="grid-column: span 2;">
            <h3 style="margin-top:0;">Recent appointments</h3>
            <div class="empty" *ngIf="data.recentAppointments.length === 0">None</div>
            <div *ngFor="let a of data.recentAppointments"
                 style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
              <span>{{ apptPatient(a) }} → {{ apptDoctor(a) }}</span>
              <span>{{ a.date | date:'short' }} <span class="badge">{{ a.status }}</span></span>
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

  constructor(private analytics: AnalyticsService) {}

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
    return typeof inv.patient === 'object' ? (inv.patient as Patient).name : 'Patient';
  }
  apptPatient(a: Appointment): string {
    return typeof a.patient === 'object' ? (a.patient as Patient).name : 'Patient';
  }
  apptDoctor(a: Appointment): string {
    return typeof a.doctor === 'object' ? (a.doctor as User).name : 'Doctor';
  }
}
