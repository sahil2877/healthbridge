import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { Prescription } from '../../models/prescription.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Prescriptions</h2>
        <a class="btn btn-primary" *ngIf="canWrite()" routerLink="/prescriptions/new">+ New Prescription</a>
      </div>

      <div class="card">
        <div class="form-group" style="max-width:280px; margin-bottom:16px;">
          <label>Filter by patient</label>
          <select class="form-control" [(ngModel)]="patientId" (ngModelChange)="load()">
            <option value="">All patients</option>
            <option *ngFor="let p of patients" [value]="p._id">{{ p.name }}</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="empty" *ngIf="loading">Loading...</div>
        <div class="empty" *ngIf="!loading && prescriptions.length === 0">
          No prescriptions found.
        </div>

        <div class="table-wrap" *ngIf="!loading && prescriptions.length > 0">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Medicines</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rx of prescriptions">
                <td>{{ rx.createdAt | date:'mediumDate' }}</td>
                <td><strong>{{ patientName(rx) }}</strong></td>
                <td>{{ doctorName(rx) }}</td>
                <td>{{ rx.items.length }} item(s)</td>
                <td><span class="badge">{{ rx.status }}</span></td>
                <td style="text-align:right; white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" [routerLink]="['/prescriptions', rx._id]">View</a>
                  <a class="btn btn-ghost btn-sm" *ngIf="canWrite()" [routerLink]="['/prescriptions', rx._id, 'edit']">Edit</a>
                  <button class="btn btn-danger btn-sm" *ngIf="canWrite()" (click)="remove(rx)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  patients: Patient[] = [];
  loading = false;
  error = '';
  patientId = '';

  constructor(
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.patientService.getAll().subscribe({ next: (list) => this.patients = list });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.prescriptionService.getAll(this.patientId).subscribe({
      next: (list) => { this.prescriptions = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load prescriptions'; this.loading = false; }
    });
  }

  patientName(rx: Prescription): string {
    return typeof rx.patient === 'object' ? (rx.patient as Patient).name : rx.patient;
  }
  doctorName(rx: Prescription): string {
    return typeof rx.doctor === 'object' ? (rx.doctor as User).name : rx.doctor;
  }

  // Only doctors/admins can create or modify prescriptions
  canWrite(): boolean {
    return this.auth.hasRole('admin', 'doctor');
  }

  remove(rx: Prescription): void {
    if (!rx._id) return;
    if (!confirm('Delete this prescription?')) return;
    this.prescriptionService.delete(rx._id).subscribe({
      next: () => this.prescriptions = this.prescriptions.filter((x) => x._id !== rx._id),
      error: (err) => this.error = err?.error?.message || 'Could not delete prescription'
    });
  }
}
