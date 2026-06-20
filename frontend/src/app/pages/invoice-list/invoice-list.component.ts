import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { AuthService } from '../../services/auth.service';
import { Invoice } from '../../models/invoice.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Billing &amp; Invoices</h2>
        <a class="btn btn-primary" *ngIf="canWrite()" routerLink="/invoices/new">+ New Invoice</a>
      </div>

      <!-- Summary cards -->
      <div class="grid grid-3" style="margin-bottom:20px;">
        <div class="card"><div style="color:var(--muted); font-size:0.85rem;">Total billed</div>
          <div style="font-size:1.4rem; font-weight:800;">₹{{ totalBilled }}</div></div>
        <div class="card"><div style="color:var(--muted); font-size:0.85rem;">Collected</div>
          <div style="font-size:1.4rem; font-weight:800; color:var(--primary);">₹{{ totalCollected }}</div></div>
        <div class="card"><div style="color:var(--muted); font-size:0.85rem;">Outstanding</div>
          <div style="font-size:1.4rem; font-weight:800; color:var(--danger);">₹{{ totalBilled - totalCollected }}</div></div>
      </div>

      <div class="card">
        <div class="form-group" style="max-width:220px; margin-bottom:16px;">
          <label>Filter by status</label>
          <select class="form-control" [(ngModel)]="status" (ngModelChange)="load()">
            <option value="">All</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="empty" *ngIf="loading">Loading...</div>
        <div class="empty" *ngIf="!loading && invoices.length === 0">No invoices found.</div>

        <div class="table-wrap" *ngIf="!loading && invoices.length > 0">
          <table>
            <thead>
              <tr><th>Invoice #</th><th>Date</th><th>Patient</th><th>Total</th><th>Paid</th><th>Status</th><th style="text-align:right;">Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let inv of invoices">
                <td><strong>{{ inv.invoiceNumber }}</strong></td>
                <td>{{ inv.createdAt | date:'mediumDate' }}</td>
                <td>{{ patientName(inv) }}</td>
                <td>₹{{ inv.total }}</td>
                <td>₹{{ inv.amountPaid }}</td>
                <td><span class="badge" [style.background]="statusBg(inv.status)" [style.color]="'#fff'">{{ inv.status }}</span></td>
                <td style="text-align:right; white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" [routerLink]="['/invoices', inv._id]">View</a>
                  <a class="btn btn-ghost btn-sm" *ngIf="canWrite()" [routerLink]="['/invoices', inv._id, 'edit']">Edit</a>
                  <button class="btn btn-danger btn-sm" *ngIf="auth.hasRole('admin')" (click)="remove(inv)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = false;
  error = '';
  status = '';

  constructor(private invoiceService: InvoiceService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.invoiceService.getAll('', this.status).subscribe({
      next: (list) => { this.invoices = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load invoices'; this.loading = false; }
    });
  }

  get totalBilled(): number {
    return this.invoices.reduce((s, i) => s + (i.total || 0), 0);
  }
  get totalCollected(): number {
    return this.invoices.reduce((s, i) => s + (i.amountPaid || 0), 0);
  }

  patientName(inv: Invoice): string {
    return typeof inv.patient === 'object' ? (inv.patient as Patient).name : inv.patient;
  }

  statusBg(status?: string): string {
    if (status === 'paid') return '#0d9488';
    if (status === 'partial') return '#d97706';
    return '#dc2626';
  }

  // Only admin/staff create or edit invoices
  canWrite(): boolean {
    return this.auth.hasRole('admin', 'staff');
  }

  remove(inv: Invoice): void {
    if (!inv._id) return;
    if (!confirm('Delete this invoice?')) return;
    this.invoiceService.delete(inv._id).subscribe({
      next: () => this.invoices = this.invoices.filter((x) => x._id !== inv._id),
      error: (err) => this.error = err?.error?.message || 'Could not delete invoice'
    });
  }
}
