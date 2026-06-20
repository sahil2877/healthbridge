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
        <h2>Appointments</h2>
        <a class="btn btn-primary" routerLink="/appointments/new">+ Book Appointment</a>
      </div>

      <div class="card">
        <div class="form-group" style="max-width:240px; margin-bottom:16px;">
          <label>Filter by status</label>
          <select class="form-control" [(ngModel)]="status" (ngModelChange)="load()">
            <option value="">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="empty" *ngIf="loading">Loading...</div>
        <div class="empty" *ngIf="!loading && appointments.length === 0">
          No appointments found. Click <strong>Book Appointment</strong> to add one.
        </div>

        <div class="table-wrap" *ngIf="!loading && appointments.length > 0">
          <table>
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Reason</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of appointments">
                <td>{{ a.date | date:'medium' }}</td>
                <td><strong>{{ patientName(a) }}</strong></td>
                <td>{{ doctorName(a) }}</td>
                <td>{{ a.reason }}</td>
                <td>
                  <select class="form-control" style="padding:4px 8px; width:auto;"
                          [ngModel]="a.status" (ngModelChange)="changeStatus(a, $event)">
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td style="text-align:right; white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" [routerLink]="['/appointments', a._id, 'edit']">Edit</a>
                  <button class="btn btn-danger btn-sm" *ngIf="canDelete()" (click)="remove(a)">Delete</button>
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

  constructor(private appointmentService: AppointmentService, public auth: AuthService) {}

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

  // patient/doctor come back populated (objects) from the list endpoint
  patientName(a: Appointment): string {
    return typeof a.patient === 'object' ? (a.patient as Patient).name : a.patient;
  }
  doctorName(a: Appointment): string {
    return typeof a.doctor === 'object' ? (a.doctor as User).name : a.doctor;
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
