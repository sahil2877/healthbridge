import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { LabService } from '../../services/lab.service';

// Patient portal "Book a Test" — a dedicated booking page. The selected package
// arrives via query params (pkg, price) from any "Book Now" button.
@Component({
  selector: 'app-portal-book',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Book a Test</h1>
          <p>Confirm your home sample collection details.</p>
        </div>
      </div>

      <div class="card" style="max-width:560px;">
        <div class="alert alert-error" *ngIf="!pkg">
          No package selected. <a routerLink="/portal/care">Browse tests</a> to pick one.
        </div>

        <div *ngIf="pkg">
          <div class="test-card-top" style="margin-bottom:16px;">
            <div>
              <div class="card-title" style="font-size:17px;">{{ pkg }}</div>
              <div class="test-price" style="margin:6px 0 0;">₹{{ price }}</div>
            </div>
            <div class="test-card-icon"><i class="fa-solid fa-flask-vial"></i></div>
          </div>

          <div class="alert alert-success" *ngIf="booked">
            <i class="fa-solid fa-circle-check"></i> Order placed! Track it under <b>My Orders</b>.
          </div>

          <div *ngIf="!booked">
            <div class="alert alert-error" *ngIf="error">{{ error }}</div>
            <div class="form-group">
              <label class="form-label">Contact phone *</label>
              <input class="form-control" [(ngModel)]="phone" placeholder="Your phone number" />
            </div>
            <div class="form-group">
              <label class="form-label">Home collection address *</label>
              <textarea class="form-control" rows="2" [(ngModel)]="address"
                        placeholder="Where should we collect the sample?"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Preferred slot</label>
              <select class="form-control" [(ngModel)]="slot">
                <option>Morning (7-10 AM)</option>
                <option>Late morning (10 AM-1 PM)</option>
                <option>Evening (4-7 PM)</option>
              </select>
            </div>
            <div style="display:flex;gap:10px;margin-top:8px;">
              <button class="btn btn-primary" [disabled]="placing" (click)="confirm()">
                <i class="fa-solid fa-circle-check"></i> {{ placing ? 'Placing...' : 'Confirm Booking' }}
              </button>
              <button class="btn btn-ghost" (click)="back()">Cancel</button>
            </div>
          </div>

          <button class="btn btn-primary" *ngIf="booked" (click)="goOrders()"><i class="fa-solid fa-box"></i> View My Orders</button>
        </div>
      </div>
    </div>
  `
})
export class PortalBookComponent implements OnInit {
  pkg = '';
  price = 0;
  phone = '';
  address = '';
  slot = 'Morning (7-10 AM)';
  placing = false;
  booked = false;
  error = '';

  constructor(private lab: LabService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const q = this.route.snapshot.queryParams;
    this.pkg = q['pkg'] || '';
    this.price = Number(q['price']) || 0;
  }

  confirm(): void {
    if (!this.phone.trim() || !this.address.trim()) {
      this.error = 'Phone and address are required';
      return;
    }
    this.placing = true;
    this.error = '';
    this.lab.createOrder({
      items: [{ name: this.pkg, price: this.price }],
      contactPhone: this.phone,
      collectionAddress: this.address,
      collectionSlot: this.slot
    }).subscribe({
      next: () => { this.booked = true; this.placing = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not place order'; this.placing = false; }
    });
  }

  back(): void { this.router.navigate(['/portal/care']); }
  goOrders(): void { this.router.navigate(['/portal/orders']); }
}
