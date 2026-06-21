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
      <div class="page-header"><h2>Doctor Consultation</h2></div>

      <!-- Request a new consultation -->
      <div class="card" style="margin-bottom:20px; max-width:560px;">
        <h3 style="margin-top:0;">Request a video consultation</h3>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="requested">✅ Request sent! Join from the list below when ready.</div>

        <div class="form-group">
          <label>Choose a doctor *</label>
          <select class="form-control" [(ngModel)]="doctorId">
            <option value="">-- Select doctor --</option>
            <option *ngFor="let d of doctors" [value]="d._id">{{ d.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Reason</label>
          <input class="form-control" [(ngModel)]="reason" placeholder="e.g. Fever and cough for 3 days" />
        </div>
        <button class="btn btn-primary" [disabled]="requesting" (click)="submit()">
          {{ requesting ? 'Requesting...' : 'Request Consultation' }}
        </button>
      </div>

      <!-- My consultations -->
      <div class="portal-h">My Consultations</div>
      <div class="empty" *ngIf="consults.length === 0">No consultations yet.</div>
      <div class="card" *ngFor="let c of consults" style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <strong>Dr. {{ doctorName(c) }}</strong>
            <span class="badge" style="margin-left:8px;">{{ c.status }}</span>
            <div style="color:var(--muted); font-size:0.85rem;">{{ c.reason }} · {{ c.createdAt | date:'short' }}</div>
          </div>
          <button class="btn btn-primary btn-sm" (click)="join(c)"
                  *ngIf="c.status !== 'completed' && c.status !== 'cancelled'">🎥 Join Call</button>
        </div>
        <div *ngIf="c.summary" style="margin-top:8px; color:var(--muted); font-size:0.85rem;">
          <b>Doctor's note:</b> {{ c.summary }}
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
