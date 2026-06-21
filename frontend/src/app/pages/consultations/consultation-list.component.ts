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
      <div class="page-header"><h2>Teleconsultations</h2></div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>
      <div class="empty" *ngIf="loading">Loading...</div>
      <div class="empty" *ngIf="!loading && consults.length === 0">No consultations yet.</div>

      <div class="card" *ngFor="let c of consults" style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>
            <strong>{{ requesterName(c) }}</strong>
            <span class="badge" [style.background]="statusBg(c.status)" [style.color]="'#fff'" style="margin-left:8px;">{{ c.status }}</span>
            <div style="color:var(--muted); font-size:0.85rem; margin-top:4px;">
              {{ c.reason || 'No reason given' }} · {{ c.createdAt | date:'short' }}
            </div>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn btn-primary btn-sm" (click)="join(c)"
                    *ngIf="c.status !== 'completed' && c.status !== 'cancelled'">🎥 Join</button>
            <button class="btn btn-ghost btn-sm" (click)="end(c)"
                    *ngIf="c.status === 'in_progress'">End</button>
          </div>
        </div>

        <!-- Post-call summary -->
        <div *ngIf="c.status === 'completed' || c.status === 'in_progress'" style="margin-top:12px;">
          <div class="form-group" style="margin:0;">
            <label>Doctor's summary</label>
            <div style="display:flex; gap:8px;">
              <input class="form-control" [(ngModel)]="c.summary" placeholder="Notes / advice after the call" />
              <button class="btn btn-ghost btn-sm" (click)="saveSummary(c)">Save</button>
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
