import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  SERVICE_TILES, CARE_PLANS, LAB_PACKAGES, ORGAN_TESTS, CHECKUP_JOURNEY
} from '../../data/catalog';

// Patient portal home — a desktop dashboard inspired by modern patient apps.
@Component({
  selector: 'app-portal-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <!-- Greeting / hero -->
      <div class="portal-hero">
        <div>
          <div class="hi">Hi, {{ firstName }} 👋</div>
          <div class="loc">📍 Anand, Gujarat</div>
        </div>
        <div class="wallet">👛 Wallet ₹1,000</div>
      </div>

      <!-- Search -->
      <div class="portal-search">
        <span>🔍</span>
        <input type="text" placeholder="Search for tests, packages, doctors..." />
      </div>

      <!-- Cashback banner -->
      <div class="promo">
        <div><span class="big">₹300 Cashback</span><div>in wallet on your first booking</div></div>
        <a class="btn" style="background:#fff; color:var(--primary-dark);" routerLink="/portal/care">Book now</a>
      </div>

      <!-- Service tiles -->
      <div class="portal-h">What are you looking for?</div>
      <div class="grid grid-3">
        <div class="tile" *ngFor="let t of tiles">
          <div class="emoji">{{ t.icon }}</div>
          <div class="t">{{ t.title }}</div>
          <div class="o">{{ t.offer }}</div>
        </div>
      </div>

      <!-- Health score -->
      <div class="portal-h">Your HealthScore</div>
      <div class="score-card">
        <div class="score-ring"><span>72</span></div>
        <div style="flex:1; min-width:200px;">
          <div style="font-weight:700;">Good — but room to improve</div>
          <div style="color:var(--muted); font-size:0.9rem; margin:4px 0 10px;">
            Your score is based on vitals, lifestyle and screening data.
          </div>
          <a class="btn btn-primary btn-sm" routerLink="/portal/vitals">View details</a>
        </div>
      </div>

      <!-- Care plans -->
      <div class="portal-h">Care Plans That Match You<small>Explore trending, seasonal & lifestyle-based checkups</small></div>
      <div class="grid grid-3">
        <div class="seg" *ngFor="let c of carePlans">
          <div class="face">{{ c.emoji }}</div>
          <div class="title">{{ c.title }}</div>
          <div class="sub">{{ c.sub }}</div>
        </div>
      </div>

      <!-- Popular packages -->
      <div class="portal-h">Popular Health Packages</div>
      <div class="grid grid-4">
        <div class="pkg" *ngFor="let p of popular">
          <div class="name">{{ p.name }}</div>
          <div class="tests">🧪 {{ p.tests }} tests included</div>
          <div>
            <span class="price">₹{{ p.price }}</span>
            <span class="mrp">₹{{ p.mrp }}</span>
          </div>
          <a class="btn btn-primary btn-sm btn-block" routerLink="/portal/care">Book Now</a>
        </div>
      </div>

      <!-- Book by organ -->
      <div class="portal-h">Book Tests by Organ</div>
      <div class="grid grid-4">
        <div class="pkg" *ngFor="let o of organs">
          <div style="font-size:1.8rem;">{{ o.emoji }}</div>
          <div class="name">{{ o.organ }}<div style="font-weight:400; color:var(--muted); font-size:0.82rem;">{{ o.desc }}</div></div>
          <div><span class="price">₹{{ o.price }}</span><span class="mrp">₹{{ o.mrp }}</span></div>
          <a class="btn btn-primary btn-sm btn-block" routerLink="/portal/care">Book Now</a>
        </div>
      </div>

      <!-- Checkup journey -->
      <div class="portal-h">Your Health Checkup Journey</div>
      <div class="journey">
        <div class="jstep" *ngFor="let j of journey">
          <div class="dot">{{ j.emoji }}</div>
          <div>
            <div class="jt">{{ j.title }}</div>
            <div class="jd">{{ j.desc }}</div>
          </div>
        </div>
      </div>

      <div style="height:24px;"></div>
    </div>
  `
})
export class PortalHomeComponent {
  tiles = SERVICE_TILES;
  carePlans = CARE_PLANS;
  popular = LAB_PACKAGES.filter((p) => p.category === 'Popular' || p.category === 'Vitamins').slice(0, 4);
  organs = ORGAN_TESTS;
  journey = CHECKUP_JOURNEY;

  constructor(private auth: AuthService) {}

  get firstName(): string {
    const name = this.auth.currentUser()?.name || 'there';
    return name.split(' ')[0];
  }
}
