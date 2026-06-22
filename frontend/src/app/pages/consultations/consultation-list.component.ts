import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultationService } from '../../services/consultation.service';
import { AuthService } from '../../services/auth.service';
import { Consultation } from '../../models/consultation.model';
import { User } from '../../models/user.model';

// Provider-side teleconsultation list — join the call, end it, add a summary.
@Component({
  selector: 'app-consultation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Teleconsultation</h1>
          <p>HD video consultations with patients.</p>
        </div>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <div class="empty-state" *ngIf="loading">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Loading consultations...</p>
      </div>

      <div class="empty-state" *ngIf="!loading && consults.length === 0">
        <i class="fa-solid fa-video"></i>
        <p>No consultations yet.</p>
      </div>

      <div class="doctor-grid" *ngIf="!loading && consults.length > 0">
        <div class="teleconsult-card" *ngFor="let c of consults">
          <div class="tc-patient">
            <div class="avatar" style="background:var(--gradient-2)">{{ initials(c) }}</div>
            <div>
              <h4>{{ requesterName(c) }}</h4>
              <small><span class="badge" [class]="'badge ' + statusBadge(c.status)">{{ c.status }}</span></small>
            </div>
          </div>

          <div class="tc-details">
            <div><span>Reason</span><span>{{ c.reason || 'No reason given' }}</span></div>
            <div><span>Requested</span><span>{{ c.createdAt | date:'short' }}</span></div>
          </div>

          <div class="tc-actions">
            <button class="btn btn-primary btn-sm" (click)="join(c)"
                    *ngIf="c.status !== 'completed' && c.status !== 'cancelled'">
              <i class="fa-solid fa-video"></i> Join
            </button>
            <button class="btn btn-ghost btn-sm" (click)="end(c)"
                    *ngIf="c.status === 'in_progress'">
              <i class="fa-solid fa-phone-slash"></i> End
            </button>
          </div>

          <!-- Post-call summary -->
          <div *ngIf="c.status === 'completed' || c.status === 'in_progress'" style="margin-top:14px;">
            <div class="form-group" style="margin:0;">
              <label class="form-label">Doctor's summary</label>
              <div style="display:flex; gap:8px;">
                <input class="form-control" [(ngModel)]="c.summary" placeholder="Notes / advice after the call" />
                <button class="btn btn-ghost btn-sm" (click)="saveSummary(c)">
                  <i class="fa-solid fa-floppy-disk"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConsultationListComponent implements OnInit {
  consults: Consultation[] = [];
  loading = false;
  error = '';

  constructor(private service: ConsultationService, public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (list) => { this.consults = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load consultations'; this.loading = false; }
    });
  }

  requesterName(c: Consultation): string {
    return typeof c.requestedBy === 'object' ? (c.requestedBy as User).name : 'Patient';
  }
  statusBg(status?: string): string {
    if (status === 'in_progress') return '#0d9488';
    if (status === 'completed') return '#64748b';
    if (status === 'cancelled') return '#dc2626';
    return '#2563eb';
  }

  // Avatar initials from the requester's name.
  initials(c: Consultation): string {
    const name = this.requesterName(c);
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  // Maps a consultation status to a design-system badge class.
  statusBadge(status?: string): string {
    if (status === 'in_progress') return 'badge-success';
    if (status === 'completed') return 'badge-info';
    if (status === 'cancelled') return 'badge-danger';
    return 'badge-warning';
  }

  join(c: Consultation): void {
    this.router.navigate(['/room', c._id]);
  }

  end(c: Consultation): void {
    if (!c._id) return;
    this.service.setStatus(c._id, 'completed').subscribe({
      next: (updated) => c.status = updated.status,
      error: (err) => this.error = err?.error?.message || 'Could not end consultation'
    });
  }

  saveSummary(c: Consultation): void {
    if (!c._id) return;
    this.service.saveSummary(c._id, c.summary || '').subscribe({
      error: (err) => this.error = err?.error?.message || 'Could not save summary'
    });
  }
}
