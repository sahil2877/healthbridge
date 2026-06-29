import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../components/skeleton.component';
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
  imports: [CommonModule, FormsModule, RouterLink, SkeletonComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Prescriptions</h1>
          <p>Digital prescriptions and medication history.</p>
        </div>
        <a class="btn btn-primary" *ngIf="canWrite()" routerLink="/prescriptions/new"><i class="fa-solid fa-plus"></i> New Prescription</a>
      </div>

      <div class="card">
        <div class="filter-bar">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search prescriptions..." [(ngModel)]="search" />
          </div>
          <select class="form-control" [(ngModel)]="patientId" (ngModelChange)="load()">
            <option value="">All patients</option>
            <option *ngFor="let p of patients" [value]="p._id">{{ p.name }}</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <app-skeleton *ngIf="loading"></app-skeleton>

        <div class="empty-state" *ngIf="!loading && filtered().length === 0">
          <i class="fa-solid fa-prescription"></i>
          <p>No prescriptions found.</p>
        </div>

        <div class="table-wrap" *ngIf="!loading && filtered().length > 0">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Medicines</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rx of filtered()">
                <td>
                  <div class="patient-cell">
                    <div class="avatar" [style.background]="avatarBg(patientName(rx))">{{ initials(patientName(rx)) }}</div>
                    <div class="patient-cell-info">
                      <p>{{ patientName(rx) }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ doctorName(rx) }}</td>
                <td>{{ rx.createdAt | date:'mediumDate' }}</td>
                <td><i class="fa-solid fa-pills"></i> {{ rx.items.length }} item(s)</td>
                <td><span class="badge" [ngClass]="badgeClass(rx.status)">{{ rx.status }}</span></td>
                <td style="text-align:right; white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" [routerLink]="['/prescriptions', rx._id]"><i class="fa-solid fa-eye"></i> View</a>
                  <a class="btn btn-ghost btn-sm" *ngIf="canWrite()" [routerLink]="['/prescriptions', rx._id, 'edit']"><i class="fa-solid fa-pen"></i> Edit</a>
                  <button class="btn btn-danger btn-sm" *ngIf="canWrite()" (click)="remove(rx)"><i class="fa-solid fa-trash"></i></button>
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
  search = '';

  // --- view helpers ---
  filtered(): Prescription[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.prescriptions;
    return this.prescriptions.filter((rx) =>
      (this.patientName(rx) || '').toLowerCase().includes(q) ||
      (this.doctorName(rx) || '').toLowerCase().includes(q) ||
      (rx.status || '').toLowerCase().includes(q)
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
      case 'completed':
      case 'dispensed':
      case 'fulfilled': return 'badge-success';
      case 'cancelled':
      case 'expired': return 'badge-danger';
      case 'active': return 'badge-primary';
      case 'pending': return 'badge-warning';
      default: return 'badge-info';
    }
  }

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
    const p = rx.patient;
    if (!p) return 'Deleted';
    return typeof p === 'object' ? (p as Patient).name : p;
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
