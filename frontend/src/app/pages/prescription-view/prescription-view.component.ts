import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../models/prescription.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

// Read-only, print-friendly view of a prescription (use browser print -> Save as PDF)
@Component({
  selector: 'app-prescription-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <!-- Toolbar is hidden when printing (see .no-print) -->
      <div class="page-header no-print">
        <div class="page-title">
          <h1>Prescription</h1>
          <p>Printable prescription sheet</p>
        </div>
        <div style="display:flex; gap:10px;">
          <a class="btn btn-ghost" routerLink="/prescriptions"><i class="fa-solid fa-arrow-left"></i> Back</a>
          <button class="btn btn-primary" (click)="print()" [disabled]="!rx"><i class="fa-solid fa-print"></i> Print / Save PDF</button>
        </div>
      </div>

      <div class="alert alert-error no-print" *ngIf="error">{{ error }}</div>
      <div class="empty-state no-print" *ngIf="loading">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>

      <div class="card rx-sheet" *ngIf="rx">
        <!-- Letterhead -->
        <div class="rx-head">
          <div>
            <div class="rx-brand">🏥 HealthBridge</div>
            <div class="rx-sub">Integrated Patient & Clinical Management</div>
          </div>
          <div style="text-align:right;">
            <div><b>Dr. {{ doctorName }}</b></div>
            <div class="rx-sub">{{ doctorRole }}</div>
            <div class="rx-sub">{{ rx.createdAt | date:'mediumDate' }}</div>
          </div>
        </div>
        <hr />

        <!-- Patient line -->
        <div class="rx-patient">
          <div><b>Patient:</b> {{ patient?.name }} &nbsp; ({{ patient?.gender }}, {{ patient?.age }} yrs)</div>
          <div><b>Phone:</b> {{ patient?.phone }} &nbsp; <span *ngIf="patient?.bloodGroup"><b>Blood:</b> {{ patient?.bloodGroup }}</span></div>
          <div *ngIf="rx.diagnosis"><b>Diagnosis:</b> {{ rx.diagnosis }}</div>
        </div>

        <!-- Rx symbol -->
        <div class="rx-symbol">℞</div>

        <!-- Medicines table -->
        <table class="rx-table">
          <thead>
            <tr><th>#</th><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let it of rx.items; let i = index">
              <td>{{ i + 1 }}</td>
              <td><b>{{ it.drugName }}</b></td>
              <td>{{ it.dosage || '-' }}</td>
              <td>{{ it.frequency || '-' }}</td>
              <td>{{ it.durationDays ? it.durationDays + ' days' : '-' }}</td>
              <td>{{ it.instructions || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="rx-notes" *ngIf="rx.notes"><b>Advice:</b> {{ rx.notes }}</div>

        <!-- Signature -->
        <div class="rx-sign">
          <div>__________________________<br /><span class="rx-sub">Doctor's Signature</span></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rx-sheet { max-width: 800px; margin: 0 auto; }
    .rx-head { display:flex; justify-content:space-between; align-items:flex-start; }
    .rx-brand { font-size: 1.4rem; font-weight: 800; color: var(--primary); }
    .rx-sub { color: var(--muted); font-size: 0.85rem; }
    .rx-patient { margin: 10px 0; line-height: 1.6; }
    .rx-symbol { font-size: 2rem; font-weight: 700; color: var(--primary); margin: 6px 0; }
    .rx-table { width:100%; border-collapse: collapse; margin-bottom: 16px; table-layout: fixed; }
    .rx-table th, .rx-table td {
      border:1px solid var(--border); padding:8px 10px; font-size:0.9rem; text-align:left;
      overflow-wrap: break-word; word-break: break-word; vertical-align: top;
    }
    /* Constrain column widths so long instructions wrap instead of overflowing */
    .rx-table th:nth-child(1), .rx-table td:nth-child(1) { width: 5%; }
    .rx-table th:nth-child(2), .rx-table td:nth-child(2) { width: 20%; }
    .rx-table th:nth-child(3), .rx-table td:nth-child(3) { width: 12%; }
    .rx-table th:nth-child(4), .rx-table td:nth-child(4) { width: 15%; }
    .rx-table th:nth-child(5), .rx-table td:nth-child(5) { width: 13%; }
    .rx-table th:nth-child(6), .rx-table td:nth-child(6) { width: 35%; }
    .rx-notes { margin: 12px 0; }
    .rx-sign { margin-top: 48px; text-align: right; }
  `]
})
export class PrescriptionViewComponent implements OnInit {
  rx: Prescription | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private prescriptionService: PrescriptionService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loading = true;
    this.prescriptionService.getOne(id).subscribe({
      next: (rx) => { this.rx = rx; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load prescription'; this.loading = false; }
    });
  }

  get patient(): Patient | null {
    if (!this.rx || !this.rx.patient) return null;
    return typeof this.rx.patient === 'object' ? (this.rx.patient as Patient) : null;
  }
  get doctorName(): string {
    return this.rx && typeof this.rx.doctor === 'object' ? (this.rx.doctor as User).name : '';
  }
  get doctorRole(): string {
    return this.rx && typeof this.rx.doctor === 'object' ? (this.rx.doctor as User).role : '';
  }

  print(): void {
    window.print();
  }
}
