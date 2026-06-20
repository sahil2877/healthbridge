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
        <h2>Clinical Records</h2>
        <a class="btn btn-primary" routerLink="/records/new">+ New Record</a>
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
        <div class="empty" *ngIf="!loading && records.length === 0">
          No records found. Click <strong>New Record</strong> to add one.
        </div>

        <div *ngIf="!loading && records.length > 0">
          <div class="card" *ngFor="let r of records" style="margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:start; gap:12px;">
              <div>
                <strong>{{ patientName(r) }}</strong>
                <span class="badge" style="margin-left:8px;">{{ r.visitDate | date:'mediumDate' }}</span>
                <div style="margin-top:8px;"><b>Diagnosis:</b> {{ r.diagnosis }}</div>
                <div *ngIf="r.prescription"><b>Prescription:</b> {{ r.prescription }}</div>
                <div *ngIf="r.notes"><b>Notes:</b> {{ r.notes }}</div>
                <div style="margin-top:6px; color:var(--muted); font-size:0.85rem;">
                  Doctor: {{ doctorName(r) }}
                </div>

                <!-- Attached documents -->
                <div *ngIf="r.documents?.length" style="margin-top:10px;">
                  <b>Documents:</b>
                  <ul style="margin:6px 0 0; padding-left:18px;">
                    <li *ngFor="let d of r.documents">
                      <a [href]="fileUrl(d.url)" target="_blank">{{ d.originalName }}</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div style="white-space:nowrap; display:flex; flex-direction:column; gap:6px;">
                <a class="btn btn-ghost btn-sm" [routerLink]="['/records', r._id, 'edit']">Edit / Upload</a>
                <button class="btn btn-danger btn-sm" *ngIf="canDelete()" (click)="remove(r)">Delete</button>
              </div>
            </div>
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
