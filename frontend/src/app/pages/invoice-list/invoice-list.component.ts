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
        <div class="page-title">
          <h1>Billing &amp; Invoices</h1>
          <p>Track revenue, manage invoices and process payments.</p>
        </div>
        <a class="btn btn-primary" *ngIf="canWrite()" routerLink="/invoices/new"><i class="fa-solid fa-plus"></i> New Invoice</a>
      </div>

      <!-- Summary KPIs -->
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon success"><i class="fa-solid fa-sack-dollar"></i></div></div>
          <div class="stat-value">₹{{ totalBilled }}</div>
          <div class="stat-label">Total Billed</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon teal"><i class="fa-solid fa-circle-check"></i></div></div>
          <div class="stat-value">₹{{ totalCollected }}</div>
          <div class="stat-label">Collected</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-top"><div class="stat-icon warm"><i class="fa-solid fa-triangle-exclamation"></i></div></div>
          <div class="stat-value">₹{{ totalBilled - totalCollected }}</div>
          <div class="stat-label">Outstanding</div>
        </div>
      </div>

      <div class="card">
        <div class="filter-bar">
          <select class="form-control" [(ngModel)]="status" (ngModelChange)="load()">
            <option value="">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="empty-state" *ngIf="loading">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Loading invoices...</p>
        </div>
        <div class="empty-state" *ngIf="!loading && invoices.length === 0">
          <i class="fa-solid fa-file-invoice-dollar"></i>
          <p>No invoices found.</p>
        </div>

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
                <td><span class="badge" [ngClass]="statusBadge(inv.status)">{{ inv.status }}</span></td>
                <td style="text-align:right; white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" [routerLink]="['/invoices', inv._id]"><i class="fa-solid fa-eye"></i> View</a>
                  <a class="btn btn-ghost btn-sm" *ngIf="canWrite()" [routerLink]="['/invoices', inv._id, 'edit']"><i class="fa-solid fa-pen"></i> Edit</a>
                  <button class="btn btn-danger btn-sm" *ngIf="auth.hasRole('admin')" (click)="remove(inv)"><i class="fa-solid fa-trash"></i></button>
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
    const p = inv.patient;
    if (!p) return 'Deleted';
    return typeof p === 'object' ? (p as Patient).name : p;
  }

  statusBg(status?: string): string {
    if (status === 'paid') return '#0d9488';
    if (status === 'partial') return '#d97706';
    return '#dc2626';
  }

  // Map invoice status to a design-system badge class.
  statusBadge(status?: string): string {
    if (status === 'paid') return 'badge-success';
    if (status === 'partial') return 'badge-warning';
    return 'badge-danger';
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
