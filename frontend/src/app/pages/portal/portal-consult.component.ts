import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultationService } from '../../services/consultation.service';
import { Consultation } from '../../models/consultation.model';
import { User } from '../../models/user.model';

// Patient portal "Consult" — request a video consultation and join existing ones.
@Component({
  selector: 'app-portal-consult',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Consult a Doctor</h1>
          <p>Connect with specialists via secure video consultation.</p>
        </div>
      </div>

      <!-- Request a new consultation -->
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><div class="card-title">Request a video consultation</div></div>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="requested"><i class="fa-solid fa-circle-check"></i> Request sent! Join from the list below when ready.</div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Choose a doctor *</label>
            <select class="form-control" [(ngModel)]="doctorId">
              <option value="">-- Select doctor --</option>
              <option *ngFor="let d of doctors" [value]="d._id">{{ d.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Reason</label>
            <input class="form-control" [(ngModel)]="reason" placeholder="e.g. Fever and cough for 3 days" />
          </div>
        </div>
        <button class="btn btn-primary" [disabled]="requesting" (click)="submit()">
          <i class="fa-solid fa-video"></i> {{ requesting ? 'Requesting...' : 'Request Consultation' }}
        </button>
      </div>

      <!-- My consultations -->
      <div class="portal-h">My Consultations</div>
      <div class="empty-state" *ngIf="consults.length === 0"><i class="fa-solid fa-video-slash"></i><p>No consultations yet.</p></div>

      <div class="doctor-grid">
        <div class="teleconsult-card" *ngFor="let c of consults">
          <div class="tc-patient">
            <div class="avatar" style="background:var(--gradient-purple);">{{ initials(doctorName(c)) }}</div>
            <div>
              <h4>Dr. {{ doctorName(c) }}</h4>
              <small>{{ c.createdAt | date:'medium' }}</small>
            </div>
            <span class="badge" [ngClass]="statusBadge(c.status)" style="margin-left:auto;">{{ c.status }}</span>
          </div>
          <div class="tc-details">
            <div><span>Reason</span><span>{{ c.reason || '—' }}</span></div>
            <div *ngIf="c.summary"><span>Doctor's note</span><span>{{ c.summary }}</span></div>
          </div>
          <div class="tc-actions">
            <button class="btn btn-primary btn-block" (click)="join(c)"
                    *ngIf="c.status !== 'completed' && c.status !== 'cancelled'"><i class="fa-solid fa-video"></i> Join Call</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PortalConsultComponent implements OnInit {
  doctors: any[] = [];
  consults: Consultation[] = [];
  doctorId = '';
  reason = '';
  requesting = false;
  requested = false;
  error = '';

  constructor(private service: ConsultationService, private router: Router) {}

  ngOnInit(): void {
    this.service.getDoctors().subscribe({ next: (list) => this.doctors = list });
    this.loadConsults();
  }

  loadConsults(): void {
    this.service.getAll().subscribe({
      next: (list) => this.consults = list,
      error: (err) => this.error = err?.error?.message || 'Could not load consultations'
    });
  }

  doctorName(c: Consultation): string {
    return typeof c.doctor === 'object' ? (c.doctor as User).name : '';
  }

  initials(name: string): string {
    return (name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  statusBadge(status?: string): string {
    if (status === 'completed') return 'badge-success';
    if (status === 'cancelled') return 'badge-danger';
    if (status === 'active' || status === 'ongoing') return 'badge-primary';
    return 'badge-info';
  }

  submit(): void {
    if (!this.doctorId) { this.error = 'Please choose a doctor'; return; }
    this.requesting = true;
    this.error = '';
    this.service.request({ doctor: this.doctorId, reason: this.reason }).subscribe({
      next: () => { this.requested = true; this.requesting = false; this.reason = ''; this.doctorId = ''; this.loadConsults(); },
      error: (err) => { this.error = err?.error?.message || 'Could not request consultation'; this.requesting = false; }
    });
  }

  join(c: Consultation): void {
    this.router.navigate(['/room', c._id]);
  }
}
