import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../components/skeleton.component';
import { RouterLink } from '@angular/router';
import { LabService } from '../../services/lab.service';
import { LabOrder, LAB_STATUS_STEPS } from '../../models/lab.model';

// Patient portal "My Orders" — lab bookings with a status tracker.
@Component({
  selector: 'app-portal-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>My Orders</h1>
          <p>Track your lab tests from booking to report.</p>
        </div>
        <a class="btn btn-primary" routerLink="/portal/care"><i class="fa-solid fa-plus"></i> Book a test</a>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>
      <app-skeleton *ngIf="loading" type="list"></app-skeleton>
      <div class="empty-state" *ngIf="!loading && orders.length === 0">
        <i class="fa-solid fa-box-open"></i>
        <p>No orders yet. Book a test to get started.</p>
      </div>

      <div class="card" *ngFor="let o of orders" style="margin-bottom:16px;">
        <div class="order-card" style="border:none;padding:0;margin:0;background:transparent;">
          <div class="order-icon"><i class="fa-solid fa-flask-vial"></i></div>
          <div class="order-info">
            <h4>{{ o.orderNumber || 'Order' }}</h4>
            <small>{{ itemNames(o) }}</small>
          </div>
          <div class="order-meta">
            <div class="order-meta-item"><small>Total</small><strong>₹{{ o.total }}</strong></div>
            <div class="order-meta-item"><small>Booked</small><strong>{{ o.createdAt | date:'mediumDate' }}</strong></div>
            <div class="order-meta-item"><small>Slot</small><strong>{{ o.collectionSlot }}</strong></div>
          </div>
          <span class="badge" [ngClass]="statusBadge(o)">{{ statusLabel(o) }}</span>
        </div>

        <!-- Status stepper -->
        <div class="timeline" *ngIf="o.status !== 'cancelled'" style="margin-top:16px;padding-left:4px;">
          <div class="timeline-item" *ngFor="let s of steps; let i = index">
            <div class="timeline-dot" [style.background]="stepIndex(o) >= i ? 'var(--gradient-1)' : 'var(--border)'">
              <i class="fa-solid" [ngClass]="stepIndex(o) >= i ? 'fa-check' : 'fa-circle'"></i>
            </div>
            <div class="timeline-content">
              <p [style.color]="stepIndex(o) >= i ? 'var(--text)' : 'var(--muted)'">{{ s.label }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="o.status === 'report_ready' && o.reportUrl" style="margin-top:12px;">
          <a class="btn btn-primary btn-sm" [href]="o.reportUrl" target="_blank"><i class="fa-solid fa-file-arrow-down"></i> View Report</a>
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

  statusLabel(o: LabOrder): string {
    const s = this.steps.find((x) => x.key === o.status);
    return o.status === 'cancelled' ? 'Cancelled' : (s?.label || 'Booked');
  }
  statusBadge(o: LabOrder): string {
    if (o.status === 'cancelled') return 'badge-danger';
    if (o.status === 'report_ready') return 'badge-success';
    return 'badge-info';
  }
}
