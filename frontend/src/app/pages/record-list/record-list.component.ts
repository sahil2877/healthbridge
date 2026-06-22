import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { ClinicalRecord } from '../../models/record.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Clinical Records</h1>
          <p>Patient medical records and visit documentation.</p>
        </div>
        <a class="btn btn-primary" routerLink="/records/new"><i class="fa-solid fa-plus"></i> New Record</a>
      </div>

      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search records..." [(ngModel)]="search" />
        </div>
        <select class="form-control" [(ngModel)]="patientId" (ngModelChange)="load()">
          <option value="">All patients</option>
          <option *ngFor="let p of patients" [value]="p._id">{{ p.name }}</option>
        </select>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <div class="empty-state" *ngIf="loading">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Loading records...</p>
      </div>

      <div class="empty-state" *ngIf="!loading && filtered().length === 0">
        <i class="fa-solid fa-folder-open"></i>
        <p>No records found. Click <strong>New Record</strong> to add one.</p>
      </div>

      <div class="grid-3" *ngIf="!loading && filtered().length > 0">
        <div class="card" *ngFor="let r of filtered()">
          <div class="card-header">
            <div class="patient-cell">
              <div class="avatar" [style.background]="avatarBg(patientName(r))">{{ initials(patientName(r)) }}</div>
              <div class="patient-cell-info">
                <p>{{ patientName(r) }}</p>
                <small>{{ r.visitDate | date:'mediumDate' }}</small>
              </div>
            </div>
            <span class="badge badge-info"><i class="fa-solid fa-stethoscope"></i></span>
          </div>

          <div style="margin-top:6px;"><b>Diagnosis:</b> {{ r.diagnosis }}</div>
          <div *ngIf="r.prescription" style="margin-top:4px;"><b>Prescription:</b> {{ r.prescription }}</div>
          <div *ngIf="r.notes" style="margin-top:4px;"><b>Notes:</b> {{ r.notes }}</div>
          <div style="margin-top:8px; color:var(--muted); font-size:13px;">
            <i class="fa-solid fa-user-doctor"></i> {{ doctorName(r) }}
          </div>

          <!-- Attached documents -->
          <div *ngIf="r.documents?.length" style="margin-top:10px;">
            <b>Documents:</b>
            <ul style="margin:6px 0 0; padding-left:18px;">
              <li *ngFor="let d of r.documents">
                <a [href]="fileUrl(d.url)" target="_blank"><i class="fa-solid fa-paperclip"></i> {{ d.originalName }}</a>
              </li>
            </ul>
          </div>

          <div style="display:flex; gap:8px; margin-top:14px;">
            <a class="btn btn-ghost btn-sm" [routerLink]="['/records', r._id, 'edit']"><i class="fa-solid fa-pen"></i> Edit / Upload</a>
            <button class="btn btn-danger btn-sm" *ngIf="canDelete()" (click)="remove(r)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecordListComponent implements OnInit {
  records: ClinicalRecord[] = [];
  patients: Patient[] = [];
  loading = false;
  error = '';
  patientId = '';
  search = '';

  // --- view helpers ---
  filtered(): ClinicalRecord[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.records;
    return this.records.filter((r) =>
      (this.patientName(r) || '').toLowerCase().includes(q) ||
      (r.diagnosis || '').toLowerCase().includes(q) ||
      (this.doctorName(r) || '').toLowerCase().includes(q)
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

  constructor(
    private recordService: RecordService,
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
    this.recordService.getAll(this.patientId).subscribe({
      next: (list) => { this.records = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load records'; this.loading = false; }
    });
  }

  patientName(r: ClinicalRecord): string {
    return typeof r.patient === 'object' ? (r.patient as Patient).name : r.patient;
  }
  doctorName(r: ClinicalRecord): string {
    return typeof r.doctor === 'object' ? (r.doctor as User).name : r.doctor;
  }

  // Documents are served from the backend host (port 5000), not the Angular host
  fileUrl(url: string): string {
    return `http://localhost:5000${url}`;
  }

  canDelete(): boolean {
    return this.auth.hasRole('admin', 'doctor');
  }

  remove(r: ClinicalRecord): void {
    if (!r._id) return;
    if (!confirm('Delete this record?')) return;
    this.recordService.delete(r._id).subscribe({
      next: () => this.records = this.records.filter((x) => x._id !== r._id),
      error: (err) => this.error = err?.error?.message || 'Could not delete record'
    });
  }
}
