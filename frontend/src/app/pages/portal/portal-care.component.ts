import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabPackage, LAB_PACKAGES, TEST_CATEGORIES } from '../../data/catalog';

// Patient portal "Book Tests" — browse the lab catalog with category filter chips.
@Component({
  selector: 'app-portal-care',
  standalone: true,
  imports: [CommonModule],
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

      <!-- Packages grid -->
      <div class="grid grid-4">
        <div class="pkg" *ngFor="let p of filtered">
          <div class="name">{{ p.name }}</div>
          <div class="tests">🧪 {{ p.tests }} tests included</div>
          <div><span class="price">₹{{ p.price }}</span><span class="mrp">₹{{ p.mrp }}</span></div>
          <button class="btn btn-primary btn-sm btn-block" (click)="book(p)">Book Now</button>
        </div>
      </div>

      <div class="alert alert-success" *ngIf="booked" style="margin-top:18px;">
        ✅ "{{ booked }}" added. A health advisor will call you to confirm the booking.
      </div>
    </div>
  `
})
export class PortalCareComponent {
  categories = TEST_CATEGORIES;
  active = '';
  booked = '';

  get filtered(): LabPackage[] {
    return this.active ? LAB_PACKAGES.filter((p) => p.category === this.active) : LAB_PACKAGES;
  }

  setCategory(c: string): void {
    this.active = c;
  }

  // Booking flow is a Phase-2 backend; for now we acknowledge the selection.
  book(p: LabPackage): void {
    this.booked = p.name;
  }
}
