import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LabService } from '../../services/lab.service';
import { LabOrder, LAB_STATUS_STEPS } from '../../models/lab.model';

// Patient portal "My Orders" — lab bookings with a status tracker.
@Component({
  selector: 'app-portal-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>My Lab Orders</h2>
        <a class="btn btn-primary" routerLink="/portal/care">+ Book a test</a>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>
      <div class="empty" *ngIf="loading">Loading...</div>
      <div class="empty" *ngIf="!loading && orders.length === 0">
        No orders yet. Book a test to get started.
      </div>

      <div class="card" *ngFor="let o of orders" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <div>
            <strong>{{ o.orderNumber }}</strong> — {{ itemNames(o) }}
            <div style="color:var(--muted); font-size:0.85rem;">
              ₹{{ o.total }} · {{ o.createdAt | date:'mediumDate' }} · {{ o.collectionSlot }}
            </div>
          </div>
          <span class="badge" *ngIf="o.status === 'cancelled'" [style.background]="'#dc2626'" [style.color]="'#fff'">Cancelled</span>
        </div>

        <!-- Status stepper -->
        <div class="journey" *ngIf="o.status !== 'cancelled'" style="margin-top:14px; background:#f6fbfb;">
          <div class="jstep" *ngFor="let s of steps; let i = index">
            <div class="dot">{{ stepIndex(o) >= i ? '✅' : '⬜' }}</div>
            <div>
              <div class="jt" [style.color]="stepIndex(o) >= i ? 'var(--primary-dark)' : 'var(--muted)'">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <div *ngIf="o.status === 'report_ready' && o.reportUrl" style="margin-top:12px;">
          <a class="btn btn-primary btn-sm" [href]="o.reportUrl" target="_blank">📄 View Report</a>
        </div>
      </div>
    </div>
  `
})
export class PortalOrdersComponent implements OnInit {
  orders: LabOrder[] = [];
  steps = LAB_STATUS_STEPS;
  loading = false;
  error = '';

  constructor(private lab: LabService) {}

  ngOnInit(): void {
    this.loading = true;
    this.lab.getOrders().subscribe({
      next: (list) => { this.orders = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load orders'; this.loading = false; }
    });
  }

  itemNames(o: LabOrder): string {
    return o.items.map((i) => i.name).join(', ');
  }

  // Index of the order's current status within the step list
  stepIndex(o: LabOrder): number {
    return this.steps.findIndex((s) => s.key === o.status);
  }
}
