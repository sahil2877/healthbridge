import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../components/skeleton.component';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { ConsultationService } from '../../services/consultation.service';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';

// Patient portal "Appointments" — request an in-person visit with a doctor and view
// your own appointments. A patient cannot self-confirm a slot: the request lands in
// the provider console as "requested", the doctor is notified, and the clinic then
// confirms or declines it (the patient gets a notification of the decision).
@Component({
  selector: 'app-portal-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>My Appointments</h1>
          <p>Request a visit and track your upcoming and past appointments.</p>
        </div>
      </div>

      <!-- Request a new appointment -->
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><div class="card-title">Request an appointment</div></div>
        <p style="color:var(--muted); font-size:12px; margin:-8px 0 16px;">
          Pick a doctor and your preferred time. The clinic will confirm or suggest another slot —
          you'll be notified once it's confirmed.
        </p>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="booked">
          <i class="fa-solid fa-circle-check"></i> Request sent! It's pending confirmation from the clinic.
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Choose a doctor *</label>
            <select class="form-control" [(ngModel)]="doctorId">
              <option value="">-- Select doctor --</option>
              <option *ngFor="let d of doctors" [value]="d._id">Dr. {{ d.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred date &amp; time *</label>
            <input class="form-control" type="datetime-local" [(ngModel)]="date" />
          </div>
          <div class="form-group">
            <label class="form-label">Reason *</label>
            <input class="form-control" [(ngModel)]="reason" placeholder="e.g. Fever and cough for 3 days" />
          </div>
        </div>
        <button class="btn btn-primary" [disabled]="booking" (click)="submit()">
          <i class="fa-solid fa-calendar-plus"></i> {{ booking ? 'Sending...' : 'Request Appointment' }}
        </button>
      </div>

      <!-- My appointments -->
      <div class="portal-h">Upcoming &amp; Past</div>
      <div class="empty-state" *ngIf="!loading && appointments.length === 0"><i class="fa-solid fa-calendar"></i><p>No appointments yet.</p></div>
      <app-skeleton *ngIf="loading" type="list"></app-skeleton>

      <div class="appt-card" *ngFor="let a of appointments">
        <div class="doctor-avatar" [style.background]="'var(--gradient-2)'">{{ initials(doctorName(a)) }}</div>
        <div class="appt-info">
          <h4>Dr. {{ doctorName(a) }}</h4>
          <div class="meta">
            <span><i class="fa-solid fa-calendar"></i> {{ a.date | date:'medium' }}</span>
            <span><i class="fa-solid fa-notes-medical"></i> {{ a.reason }}</span>
          </div>
          <div *ngIf="a.status === 'requested'" style="color:var(--warning); font-size:12px; margin-top:6px;">
            <i class="fa-solid fa-clock"></i> Waiting for the clinic to confirm this slot.
          </div>
          <div *ngIf="a.notes" style="color:var(--muted); font-size:12px; margin-top:4px;">
            <b>Doctor's note:</b> {{ a.notes }}
          </div>
        </div>
        <div class="appt-actions">
          <span class="badge" [ngClass]="statusBadge(a.status)">{{ statusLabel(a.status) }}</span>
          <button class="btn btn-ghost btn-sm" (click)="cancel(a)"
                  *ngIf="a.status === 'requested' || a.status === 'scheduled'"><i class="fa-solid fa-xmark"></i> Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class PortalAppointmentsComponent implements OnInit {
  doctors: any[] = [];
  appointments: Appointment[] = [];
  doctorId = '';
  date = '';
  reason = '';
  booking = false;
  booked = false;
  loading = false;
  error = '';

  constructor(private appts: AppointmentService, private consult: ConsultationService) {}

  ngOnInit(): void {
    this.consult.getDoctors().subscribe({ next: (list) => this.doctors = list });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.appts.getAll().subscribe({
      next: (list) => { this.appointments = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load appointments'; this.loading = false; }
    });
  }

  doctorName(a: Appointment): string {
    return typeof a.doctor === 'object' ? (a.doctor as User).name : '';
  }

  initials(name: string): string {
    return (name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  statusBadge(status?: string): string {
    const map: Record<string, string> = {
      requested: 'badge-warning',
      scheduled: 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-danger'
    };
    return map[status || ''] || 'badge-info';
  }

  // Patient-friendly status wording (the API's "scheduled" reads as "confirmed").
  statusLabel(status?: string): string {
    const map: Record<string, string> = {
      requested: 'Pending',
      scheduled: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return map[status || ''] || status || '';
  }

  statusColor(status?: string): string {
    const map: Record<string, string> = {
      requested: '#d97706',
      scheduled: '#0d9488',
      completed: '#16a34a',
      cancelled: '#dc2626'
    };
    return map[status || ''] || '#64748b';
  }

  submit(): void {
    if (!this.doctorId || !this.date || !this.reason.trim()) {
      this.error = 'Doctor, date and reason are required';
      return;
    }
    this.booking = true;
    this.error = '';
    this.appts.book({ doctor: this.doctorId, date: new Date(this.date).toISOString(), reason: this.reason }).subscribe({
      next: () => {
        this.booked = true; this.booking = false;
        this.doctorId = ''; this.date = ''; this.reason = '';
        this.load();
      },
      error: (err) => { this.error = err?.error?.message || 'Could not book appointment'; this.booking = false; }
    });
  }

  cancel(a: Appointment): void {
    if (!a._id) return;
    const msg = a.status === 'requested' ? 'Withdraw this appointment request?' : 'Cancel this appointment?';
    if (!confirm(msg)) return;
    this.appts.update(a._id, { status: 'cancelled' }).subscribe({
      next: () => this.load(),
      error: (err) => this.error = err?.error?.message || 'Could not cancel'
    });
  }
}
