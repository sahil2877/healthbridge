import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabService } from '../../services/lab.service';
import { LabOrder } from '../../models/lab.model';
import { User } from '../../models/user.model';

// Provider-side lab order management — update status and attach reports.
@Component({
  selector: 'app-lab-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header"><h2>Lab Orders</h2></div>

      <div class="card">
        <div class="form-group" style="max-width:220px; margin-bottom:16px;">
          <label>Filter by status</label>
          <select class="form-control" [(ngModel)]="status" (ngModelChange)="load()">
            <option value="">All</option>
            <option value="booked">Booked</option>
            <option value="collected">Collected</option>
            <option value="in_lab">In Lab</option>
            <option value="report_ready">Report Ready</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="empty" *ngIf="loading">Loading...</div>
        <div class="empty" *ngIf="!loading && orders.length === 0">No orders found.</div>

        <div class="table-wrap" *ngIf="!loading && orders.length > 0">
          <table>
            <thead>
              <tr><th>Order #</th><th>Booked by</th><th>Items</th><th>Total</th><th>Slot</th><th>Status</th><th>Report URL</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of orders">
                <td><strong>{{ o.orderNumber }}</strong></td>
                <td>{{ bookedBy(o) }}<div style="color:var(--muted); font-size:0.8rem;">{{ o.contactPhone }}</div></td>
                <td>{{ itemNames(o) }}</td>
                <td>₹{{ o.total }}</td>
                <td style="font-size:0.82rem;">{{ o.collectionSlot }}</td>
                <td>
                  <select class="form-control" style="padding:4px 8px; width:auto;"
                          [ngModel]="o.status" (ngModelChange)="changeStatus(o, $event)">
                    <option value="booked">Booked</option>
                    <option value="collected">Collected</option>
                    <option value="in_lab">In Lab</option>
                    <option value="report_ready">Report Ready</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <div style="display:flex; gap:6px;">
                    <input class="form-control" style="padding:4px 8px; width:150px;" [(ngModel)]="o.reportUrl"
                           placeholder="report link" />
                    <button class="btn btn-ghost btn-sm" (click)="saveReport(o)">Save</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class LabOrdersComponent implements OnInit {
  orders: LabOrder[] = [];
  loading = false;
  error = '';
  status = '';

  constructor(private lab: LabService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.lab.getOrders(this.status).subscribe({
      next: (list) => { this.orders = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load orders'; this.loading = false; }
    });
  }

  bookedBy(o: LabOrder): string {
    if (o.contactName) return o.contactName;
    return typeof o.bookedBy === 'object' ? (o.bookedBy as User).name : 'User';
  }
  itemNames(o: LabOrder): string {
    return o.items.map((i) => i.name).join(', ');
  }

  changeStatus(o: LabOrder, status: string): void {
    if (!o._id) return;
    this.lab.updateStatus(o._id, { status }).subscribe({
      next: () => o.status = status as LabOrder['status'],
      error: (err) => this.error = err?.error?.message || 'Could not update status'
    });
  }

  saveReport(o: LabOrder): void {
    if (!o._id) return;
    this.lab.updateStatus(o._id, { reportUrl: o.reportUrl }).subscribe({
      next: () => {},
      error: (err) => this.error = err?.error?.message || 'Could not save report URL'
    });
  }
}
