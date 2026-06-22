import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LabService } from '../../services/lab.service';
import { LabPackage } from '../../models/lab.model';
import { TEST_CATEGORIES } from '../../data/catalog';

// Patient portal "Book Tests" — real catalog from the API; booking happens on a dedicated page.
@Component({
  selector: 'app-portal-care',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Book Lab Tests</h1>
          <p>Choose from curated health packages — home sample collection available.</p>
        </div>
      </div>

      <!-- Promo banner -->
      <div class="welcome-hero" style="padding:24px;margin-bottom:22px;">
        <div class="welcome-content">
          <h1 style="font-size:24px;">Up to 70% OFF this week</h1>
          <p>Comprehensive screening packages at the best prices. Book now, pay later.</p>
        </div>
      </div>

      <!-- Category pills -->
      <div class="category-pills">
        <div class="category-pill" [class.active]="active === ''" (click)="setCategory('')">
          <i class="fa-solid fa-layer-group"></i> All
        </div>
        <div class="category-pill" *ngFor="let c of categories" [class.active]="active === c" (click)="setCategory(c)">
          {{ c }}
        </div>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>
      <div class="empty-state" *ngIf="loading"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading catalog...</p></div>

      <div class="empty-state" *ngIf="!loading && packages.length === 0">
        <i class="fa-solid fa-flask-vial"></i><p>No packages in this category yet.</p>
      </div>

      <!-- Test cards -->
      <div class="test-grid" *ngIf="!loading">
        <div class="test-card" *ngFor="let p of packages">
          <div class="test-card-top">
            <div class="test-card-icon"><i class="fa-solid fa-flask-vial"></i></div>
            <span class="test-badge" *ngIf="p.mrp">{{ discount(p) }}% OFF</span>
          </div>
          <h4>{{ p.name }}</h4>
          <p>{{ p.tests }} tests included · home collection · reports in 24–48h</p>
          <div class="test-meta">
            <div><small>Tests</small><strong>{{ p.tests }}</strong></div>
            <div><small>Category</small><strong>{{ p.category || 'General' }}</strong></div>
          </div>
          <div class="test-price">₹{{ p.price }}<small *ngIf="p.mrp">₹{{ p.mrp }}</small></div>
          <div class="test-actions">
            <button class="btn btn-primary btn-block" (click)="book(p)"><i class="fa-solid fa-cart-shopping"></i> Book Now</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PortalCareComponent implements OnInit {
  categories = TEST_CATEGORIES;
  active = '';
  packages: LabPackage[] = [];
  loading = false;
  error = '';

  constructor(private lab: LabService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.lab.getPackages(this.active).subscribe({
      next: (list) => { this.packages = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load catalog'; this.loading = false; }
    });
  }

  setCategory(c: string): void { this.active = c; this.load(); }

  // Percentage discount off MRP, for the "X% OFF" badge.
  discount(p: LabPackage): number {
    if (!p.mrp || p.mrp <= p.price) return 0;
    return Math.round(((p.mrp - p.price) / p.mrp) * 100);
  }

  // Go to the dedicated booking page with the chosen package.
  book(p: LabPackage): void {
    this.router.navigate(['/portal/book'], { queryParams: { pkg: p.name, price: p.price } });
  }
}
