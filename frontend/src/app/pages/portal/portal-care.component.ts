import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LabService } from '../../services/lab.service';
import { LabPackage } from '../../models/lab.model';
import { TEST_CATEGORIES } from '../../data/catalog';

// Patient portal "Book Tests" — real catalog from the API + booking with home collection.
@Component({
  selector: 'app-portal-care',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header"><h2>Book Lab Tests</h2></div>

      <div class="promo" style="margin-bottom:20px;">
        <div><span class="big">Up to 70% OFF</span><div>on all bookings this week</div></div>
      </div>

      <!-- Category chips -->
      <div class="chips">
        <div class="chip" [class.active]="active === ''" (click)="setCategory('')">All</div>
        <div class="chip" *ngFor="let c of categories" [class.active]="active === c" (click)="setCategory(c)">
          {{ c }}
        </div>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>
      <div class="empty" *ngIf="loading">Loading catalog...</div>

      <!-- Packages grid -->
      <div class="grid grid-4" *ngIf="!loading">
        <div class="pkg" *ngFor="let p of packages">
          <div class="name">{{ p.name }}</div>
          <div class="tests">🧪 {{ p.tests }} tests included</div>
          <div><span class="price">₹{{ p.price }}</span><span class="mrp" *ngIf="p.mrp">₹{{ p.mrp }}</span></div>
          <button class="btn btn-primary btn-sm btn-block" (click)="select(p)">Book Now</button>
        </div>
      </div>

      <!-- Booking form (shows after choosing a package) -->
      <div class="card" *ngIf="selected" style="margin-top:20px; max-width:520px;">
        <h3 style="margin-top:0;">Book: {{ selected.name }} — ₹{{ selected.price }}</h3>
        <div class="alert alert-success" *ngIf="booked">
          ✅ Order placed! Track it under <b>My Orders</b>.
        </div>
        <div *ngIf="!booked">
          <div class="form-group">
            <label>Contact phone *</label>
            <input class="form-control" [(ngModel)]="phone" placeholder="Your phone number" />
          </div>
          <div class="form-group">
            <label>Home collection address *</label>
            <textarea class="form-control" rows="2" [(ngModel)]="address" placeholder="Where should we collect the sample?"></textarea>
          </div>
          <div class="form-group">
            <label>Preferred slot</label>
            <select class="form-control" [(ngModel)]="slot">
              <option>Morning (7-10 AM)</option>
              <option>Late morning (10 AM-1 PM)</option>
              <option>Evening (4-7 PM)</option>
            </select>
          </div>
          <button class="btn btn-primary" [disabled]="placing" (click)="confirm()">
            {{ placing ? 'Placing...' : 'Confirm Booking' }}
          </button>
          <button class="btn btn-ghost" (click)="selected = null">Cancel</button>
        </div>
        <button class="btn btn-primary" *ngIf="booked" (click)="goOrders()">View My Orders</button>
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

  selected: LabPackage | null = null;
  phone = '';
  address = '';
  slot = 'Morning (7-10 AM)';
  placing = false;
  booked = false;

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

  select(p: LabPackage): void {
    this.selected = p;
    this.booked = false;
  }

  confirm(): void {
    if (!this.selected) return;
    if (!this.phone.trim() || !this.address.trim()) {
      this.error = 'Phone and address are required';
      return;
    }
    this.placing = true;
    this.error = '';
    this.lab.createOrder({
      items: [{ name: this.selected.name, price: this.selected.price }],
      contactPhone: this.phone,
      collectionAddress: this.address,
      collectionSlot: this.slot
    }).subscribe({
      next: () => { this.booked = true; this.placing = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not place order'; this.placing = false; }
    });
  }

  goOrders(): void {
    this.router.navigate(['/portal/orders']);
  }
}
