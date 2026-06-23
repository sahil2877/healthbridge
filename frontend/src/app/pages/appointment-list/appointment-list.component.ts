import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Appointments</h1>
          <p>Schedule and manage patient appointments.</p>
        </div>
        <a class="btn btn-primary" routerLink="/appointments/new"><i class="fa-solid fa-plus"></i> Book Appointment</a>
      </div>

      <div class="card">
        <div class="filter-bar">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search appointments..." [(ngModel)]="search" />
          </div>
          <select class="form-control" [(ngModel)]="status" (ngModelChange)="load()">
            <option value="">All Status</option>
            <option value="requested">Requested</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="empty-state" *ngIf="loading">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Loading appointments...</p>
        </div>

        <div class="empty-state" *ngIf="!loading && filtered().length === 0">
          <i class="fa-solid fa-calendar-xmark"></i>
          <p>No appointments found. Click <strong>Book Appointment</strong> to add one.</p>
        </div>

        <div class="table-wrap" *ngIf="!loading && filtered().length > 0">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date &amp; Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of filtered()">
                <td>
                  <div class="patient-cell">
                    <div class="avatar" [style.background]="avatarBg(patientName(a))">{{ initials(patientName(a)) }}</div>
                    <div class="patient-cell-info">
                      <p>{{ patientName(a) }}</p>
                      <small *ngIf="a.status === 'requested'">New request</small>
                    </div>
                  </div>
                </td>
                <td>{{ doctorName(a) }}</td>
                <td>{{ a.date | date:'medium' }}</td>
                <td>{{ a.reason }}</td>
                <td><span class="badge" [ngClass]="badgeClass(a.status)">{{ a.status }}</span></td>
                <td style="text-align:right; white-space:nowrap;">
                  <ng-container *ngIf="a.status === 'requested'">
                    <button class="btn btn-primary btn-sm" (click)="changeStatus(a, 'scheduled')"><i class="fa-solid fa-check"></i> Confirm</button>
                    <button class="btn btn-ghost btn-sm" (click)="changeStatus(a, 'cancelled')"><i class="fa-solid fa-xmark"></i> Decline</button>
                  </ng-container>
                  <a class="btn btn-ghost btn-sm" [routerLink]="['/appointments', a._id, 'edit']"><i class="fa-solid fa-pen"></i> Edit</a>
                  <button class="btn btn-danger btn-sm" *ngIf="canDelete()" (click)="remove(a)"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  error = '';
  status = '';
  search = '';

  constructor(private appointmentService: AppointmentService, public auth: AuthService) {}

  // --- view helpers ---
  filtered(): Appointment[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.appointments;
    return this.appointments.filter((a) =>
      (this.patientName(a) || '').toLowerCase().includes(q) ||
      (this.doctorName(a) || '').toLowerCase().includes(q) ||
      (a.reason || '').toLowerCase().includes(q)
    );
  }

  initials(name: string): string {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }

  avatarBg(name: string): string {
    const grads = ['var(--gradient-1)', 'var(--gradient-2)', 'var(--gradient-purple)', 'var(--gradient-warm)', 'var(--gradient-success)'];
    let sum = 0;
    for (let i = 0; i < (name || '').length; i++) sum += name.charCodeAt(i);
    return grads[sum % grads.length];
  }

  badgeClass(status: string | undefined): string {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'cancelled':
      case 'no_show': return 'badge-danger';
      case 'confirmed': return 'badge-primary';
      case 'requested': return 'badge-warning';
      case 'scheduled':
      case 'pending':
      default: return 'badge-info';
    }
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.appointmentService.getAll(this.status).subscribe({
      next: (list) => { this.appointments = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load appointments'; this.loading = false; }
    });
  }

  // patient/doctor come back populated (objects) from the list endpoint.
  // When the patient was deleted, the populated field is null — show a placeholder.
  patientName(a: Appointment): string {
    const p = a.patient;
    if (!p) return '(Deleted Patient)';
    return typeof p === 'object' ? p.name : p;
  }
  doctorName(a: Appointment): string {
    const d = a.doctor;
    if (!d) return '(Unknown)';
    return typeof d === 'object' ? d.name : d;
  }

  changeStatus(a: Appointment, status: string): void {
    if (!a._id || a.status === status) return;
    this.appointmentService.update(a._id, { status: status as Appointment['status'] }).subscribe({
      next: () => a.status = status as Appointment['status'],
      error: (err) => this.error = err?.error?.message || 'Could not update status'
    });
  }

  canDelete(): boolean {
    return this.auth.hasRole('admin', 'doctor');
  }

  remove(a: Appointment): void {
    if (!a._id) return;
    if (!confirm('Delete this appointment?')) return;
    this.appointmentService.delete(a._id).subscribe({
      next: () => this.appointments = this.appointments.filter((x) => x._id !== a._id),
      error: (err) => this.error = err?.error?.message || 'Could not delete appointment'
    });
  }
}
