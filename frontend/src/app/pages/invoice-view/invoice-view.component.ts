import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { AuthService } from '../../services/auth.service';
import { Invoice } from '../../models/invoice.model';
import { Patient } from '../../models/patient.model';

// Printable invoice with a "record payment" panel.
@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header no-print">
        <div class="page-title">
          <h1>Invoice</h1>
          <p>Printable tax invoice</p>
        </div>
        <div style="display:flex; gap:10px;">
          <a class="btn btn-ghost" routerLink="/invoices"><i class="fa-solid fa-arrow-left"></i> Back</a>
          <button class="btn btn-primary" (click)="print()" [disabled]="!inv"><i class="fa-solid fa-print"></i> Print / Save PDF</button>
        </div>
      </div>

      <div class="alert alert-error no-print" *ngIf="error">{{ error }}</div>
      <div class="empty-state no-print" *ngIf="loading">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>

      <div class="card rx-sheet" *ngIf="inv">
        <div class="rx-head">
          <div>
            <div class="rx-brand">🏥 HealthBridge</div>
            <div class="rx-sub">Tax Invoice</div>
          </div>
          <div style="text-align:right;">
            <div><b>{{ inv.invoiceNumber }}</b></div>
            <div class="rx-sub">{{ inv.createdAt | date:'mediumDate' }}</div>
            <span class="badge" [style.background]="statusBg(inv.status)" [style.color]="'#fff'">{{ inv.status }}</span>
          </div>
        </div>
        <hr />

        <div class="rx-patient">
          <div><b>Bill to:</b> {{ patient?.name }} ({{ patient?.gender }}, {{ patient?.age }} yrs)</div>
          <div><b>Phone:</b> {{ patient?.phone }}</div>
          <div *ngIf="patient?.address"><b>Address:</b> {{ patient?.address }}</div>
        </div>

        <table class="rx-table">
          <thead>
            <tr><th>#</th><th>Description</th><th>Qty</th><th>Unit ₹</th><th style="text-align:right;">Amount ₹</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let it of inv.items; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ it.description }}</td>
              <td>{{ it.qty }}</td>
              <td>{{ it.unitPrice }}</td>
              <td style="text-align:right;">{{ it.amount }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div style="max-width:300px; margin-left:auto;">
          <div style="display:flex; justify-content:space-between;"><span>Subtotal</span><span>₹{{ inv.subtotal }}</span></div>
          <div style="display:flex; justify-content:space-between;"><span>Tax</span><span>+ ₹{{ inv.tax }}</span></div>
          <div style="display:flex; justify-content:space-between;"><span>Discount</span><span>- ₹{{ inv.discount }}</span></div>
          <hr />
          <div style="display:flex; justify-content:space-between; font-size:1.1rem;"><b>Total</b><b>₹{{ inv.total }}</b></div>
          <div style="display:flex; justify-content:space-between; color:var(--primary);"><span>Paid</span><span>₹{{ inv.amountPaid }}</span></div>
          <div style="display:flex; justify-content:space-between; color:var(--danger);"><b>Balance</b><b>₹{{ balance }}</b></div>
        </div>

        <div class="rx-notes" *ngIf="inv.notes"><b>Notes:</b> {{ inv.notes }}</div>

        <!-- Payment history -->
        <div *ngIf="inv.payments?.length" style="margin-top:16px;">
          <b>Payment history</b>
          <ul style="margin:6px 0 0; padding-left:18px;">
            <li *ngFor="let p of inv.payments">
              ₹{{ p.amount }} via {{ p.method }} <span *ngIf="p.reference">({{ p.reference }})</span>
              — {{ p.paidAt | date:'short' }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Record payment (hidden in print) -->
      <div class="card no-print" *ngIf="inv && inv.status !== 'paid' && canPay()" style="margin-top:16px; max-width:480px;">
        <h3 style="margin-top:0;">Record Payment</h3>
        <div class="alert alert-error" *ngIf="payError">{{ payError }}</div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Amount (₹)</label>
            <input class="form-control" type="number" [(ngModel)]="payAmount" [placeholder]="balance" />
          </div>
          <div class="form-group">
            <label class="form-label">Method</label>
            <select class="form-control" [(ngModel)]="payMethod">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Reference (optional)</label>
          <input class="form-control" type="text" [(ngModel)]="payRef" placeholder="Txn ID / note" />
        </div>
        <button class="btn btn-primary" [disabled]="paying" (click)="recordPayment()">
          <i class="fa-solid" [class.fa-spinner]="paying" [class.fa-spin]="paying" [class.fa-money-bill-wave]="!paying"></i>
          {{ paying ? 'Saving...' : 'Record Payment' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .rx-sheet { max-width: 800px; margin: 0 auto; }
    .rx-head { display:flex; justify-content:space-between; align-items:flex-start; }
    .rx-brand { font-size: 1.4rem; font-weight: 800; color: var(--primary); }
    .rx-sub { color: var(--muted); font-size: 0.85rem; }
    .rx-patient { margin: 10px 0; line-height: 1.6; }
    .rx-table { width:100%; border-collapse: collapse; margin: 12px 0; }
    .rx-table th, .rx-table td { border:1px solid var(--border); padding:8px 10px; font-size:0.9rem; text-align:left; }
    .rx-notes { margin: 14px 0; }
  `]
})
export class InvoiceViewComponent implements OnInit {
  inv: Invoice | null = null;
  loading = false;
  error = '';

  payAmount: number | null = null;
  payMethod = 'cash';
  payRef = '';
  paying = false;
  payError = '';

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.load(id);
  }

  load(id: string): void {
    this.loading = true;
    this.invoiceService.getOne(id).subscribe({
      next: (inv) => { this.inv = inv; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load invoice'; this.loading = false; }
    });
  }

  get patient(): Patient | null {
    if (!this.inv || !this.inv.patient) return null;
    return typeof this.inv.patient === 'object' ? (this.inv.patient as Patient) : null;
  }
  get balance(): number {
    return this.inv ? (this.inv.total || 0) - (this.inv.amountPaid || 0) : 0;
  }

  statusBg(status?: string): string {
    if (status === 'paid') return '#0d9488';
    if (status === 'partial') return '#d97706';
    return '#dc2626';
  }

  canPay(): boolean {
    return this.auth.hasRole('admin', 'staff');
  }

  recordPayment(): void {
    if (!this.inv?._id || !this.payAmount || this.payAmount <= 0) {
      this.payError = 'Enter a valid amount';
      return;
    }
    this.paying = true;
    this.payError = '';
    this.invoiceService.addPayment(this.inv._id, {
      amount: this.payAmount, method: this.payMethod as any, reference: this.payRef
    }).subscribe({
      next: (updated) => { this.inv = updated; this.payAmount = null; this.payRef = ''; this.paying = false; },
      error: (err) => { this.payError = err?.error?.message || 'Could not record payment'; this.paying = false; }
    });
  }

  print(): void { window.print(); }
}
