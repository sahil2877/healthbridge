import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../components/skeleton.component';
import { PrescriptionService } from '../../services/prescription.service';
import { RecordService } from '../../services/record.service';
import { InvoiceService } from '../../services/invoice.service';
import { Prescription } from '../../models/prescription.model';
import { ClinicalRecord } from '../../models/record.model';
import { Invoice } from '../../models/invoice.model';
import { User } from '../../models/user.model';

// Patient portal "My Records" — read-only view of the patient's own prescriptions,
// clinical records and bills, all created by providers in the console and linked
// back to this patient via the /patients/me bridge.
@Component({
  selector: 'app-portal-records',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>My Medical Records</h1>
          <p>All your prescriptions, records and bills in one place.</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="tab === 'rx'" (click)="tab = 'rx'"><i class="fa-solid fa-prescription-bottle-medical"></i> Prescriptions ({{ prescriptions.length }})</button>
        <button class="tab" [class.active]="tab === 'emr'" (click)="tab = 'emr'"><i class="fa-solid fa-file-medical"></i> Medical Records ({{ records.length }})</button>
        <button class="tab" [class.active]="tab === 'bills'" (click)="tab = 'bills'"><i class="fa-solid fa-receipt"></i> Bills ({{ invoices.length }})</button>
      </div>

      <app-skeleton *ngIf="loading" type="list"></app-skeleton>

      <!-- Prescriptions -->
      <div *ngIf="tab === 'rx' && !loading">
        <div class="empty-state" *ngIf="prescriptions.length === 0"><i class="fa-solid fa-prescription-bottle-medical"></i><p>No prescriptions yet.</p></div>
        <div class="card" *ngFor="let p of prescriptions" style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <strong>{{ p.diagnosis || 'Prescription' }}</strong>
            <span style="color:var(--muted); font-size:0.85rem;">Dr. {{ name(p.doctor) }} · {{ p.createdAt | date:'mediumDate' }}</span>
          </div>
          <ul style="margin:10px 0 0; padding-left:18px;">
            <li *ngFor="let it of p.items">
              <b>{{ it.drugName }}</b>
              <span *ngIf="it.dosage"> · {{ it.dosage }}</span>
              <span *ngIf="it.frequency"> · {{ it.frequency }}</span>
              <span *ngIf="it.durationDays"> · {{ it.durationDays }} days</span>
              <span *ngIf="it.instructions" style="color:var(--muted);"> ({{ it.instructions }})</span>
            </li>
          </ul>
          <div *ngIf="p.notes" style="color:var(--muted); font-size:0.85rem; margin-top:8px;">{{ p.notes }}</div>
        </div>
      </div>

      <!-- Clinical records -->
      <div *ngIf="tab === 'emr' && !loading">
        <div class="empty-state" *ngIf="records.length === 0"><i class="fa-solid fa-file-medical"></i><p>No medical records yet.</p></div>
        <div class="card" *ngFor="let r of records" style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <strong>{{ r.diagnosis }}</strong>
            <span style="color:var(--muted); font-size:0.85rem;">Dr. {{ name(r.doctor) }} · {{ r.visitDate || r.createdAt | date:'mediumDate' }}</span>
          </div>
          <div *ngIf="r.notes" style="margin-top:8px; font-size:0.9rem;">{{ r.notes }}</div>
          <div *ngIf="r.documents?.length" style="margin-top:10px; display:flex; flex-wrap:wrap; gap:8px;">
            <a class="btn btn-ghost btn-sm" *ngFor="let d of r.documents" [href]="fileUrl(d.url)" target="_blank">
              📄 {{ d.originalName }}
            </a>
          </div>
        </div>
      </div>

      <!-- Bills -->
      <div *ngIf="tab === 'bills' && !loading">
        <div class="empty-state" *ngIf="invoices.length === 0"><i class="fa-solid fa-receipt"></i><p>No bills yet.</p></div>
        <div class="card" *ngFor="let inv of invoices" style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <div>
              <strong>{{ inv.invoiceNumber }}</strong>
              <span class="badge" style="margin-left:8px;"
                    [ngClass]="inv.status === 'paid' ? 'badge-success' : inv.status === 'partial' ? 'badge-warning' : 'badge-danger'">{{ inv.status }}</span>
              <div style="color:var(--muted); font-size:0.85rem;">{{ inv.createdAt | date:'mediumDate' }}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:800;">₹{{ inv.total }}</div>
              <div style="color:var(--muted); font-size:0.82rem;" *ngIf="inv.status !== 'paid'">
                Paid ₹{{ inv.amountPaid || 0 }} · Due ₹{{ (inv.total || 0) - (inv.amountPaid || 0) }}
              </div>
            </div>
          </div>
          <div style="margin-top:8px; font-size:0.85rem; color:var(--muted);">
            <span *ngFor="let it of inv.items; let last = last">{{ it.description }} (×{{ it.qty }}){{ last ? '' : ', ' }}</span>
          </div>
          <p style="color:var(--muted); font-size:0.8rem; margin:10px 0 0;" *ngIf="inv.status !== 'paid'">
            Please pay at the reception desk during your visit.
          </p>
        </div>
      </div>
    </div>
  `
})
export class PortalRecordsComponent implements OnInit {
  tab: 'rx' | 'emr' | 'bills' = 'rx';
  prescriptions: Prescription[] = [];
  records: ClinicalRecord[] = [];
  invoices: Invoice[] = [];
  loading = false;

  constructor(
    private rx: PrescriptionService,
    private rec: RecordService,
    private inv: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    let pending = 3;
    const done = () => { if (--pending === 0) this.loading = false; };
    this.rx.getAll().subscribe({ next: (l) => { this.prescriptions = l; done(); }, error: done });
    this.rec.getAll().subscribe({ next: (l) => { this.records = l; done(); }, error: done });
    this.inv.getAll().subscribe({ next: (l) => { this.invoices = l; done(); }, error: done });
  }

  name(doctor: string | User | undefined): string {
    return doctor && typeof doctor === 'object' ? (doctor as User).name : '';
  }

  fileUrl(url: string): string {
    return url.startsWith('http') ? url : `${environment.apiBase}${url}`;
  }
}
