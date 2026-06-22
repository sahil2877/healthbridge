import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HealthScoreService, HealthScore } from '../../services/health-score.service';
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
      <!-- Welcome hero -->
      <div class="welcome-hero">
        <div class="welcome-content">
          <h1>Hi, {{ firstName }} 👋</h1>
          <p>Welcome back to HealthBridge. Book tests, consult doctors, and track your health — all in one place.</p>
          <div class="welcome-hero-actions">
            <a class="btn btn-primary" routerLink="/portal/care"><i class="fa-solid fa-flask-vial"></i> Book a Test</a>
            <a class="btn" routerLink="/portal/consult"><i class="fa-solid fa-video"></i> Consult a Doctor</a>
          </div>
        </div>
      </div>

      <!-- Service tiles -->
      <div class="portal-h">What are you looking for?</div>
      <div class="stat-grid">
        <a class="stat-card" *ngFor="let t of tiles" routerLink="/portal/care" style="text-align:left;">
          <div class="stat-card-top">
            <div class="stat-icon teal" style="font-size:22px;">{{ t.icon }}</div>
          </div>
          <div class="card-title">{{ t.title }}</div>
          <div class="stat-label" style="color:var(--primary);">{{ t.offer }}</div>
        </a>
      </div>

      <!-- Health score -->
      <div class="portal-h">Your HealthScore</div>
      <div class="score-card">
        <div class="score-ring" [style.background]="ringStyle">
          <span>{{ score.score !== null ? score.score : '—' }}</span>
        </div>
        <div style="flex:1; min-width:200px;">
          <div style="font-weight:700;">{{ score.score !== null ? score.label : 'Set up your HealthScore' }}</div>
          <div style="color:var(--muted); font-size:0.9rem; margin:4px 0 10px;">
            {{ score.message }}
          </div>
          <a class="btn btn-primary btn-sm" routerLink="/portal/vitals"><i class="fa-solid fa-heart-pulse"></i> View details</a>
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
          <a class="btn btn-primary btn-sm btn-block" routerLink="/portal/book"
             [queryParams]="{ pkg: p.name, price: p.price }">Book Now</a>
        </div>
      </div>

      <!-- Book by organ -->
      <div class="portal-h">Book Tests by Organ</div>
      <div class="grid grid-4">
        <div class="pkg" *ngFor="let o of organs">
          <div style="font-size:1.8rem;">{{ o.emoji }}</div>
          <div class="name">{{ o.organ }}<div style="font-weight:400; color:var(--muted); font-size:0.82rem;">{{ o.desc }}</div></div>
          <div><span class="price">₹{{ o.price }}</span><span class="mrp">₹{{ o.mrp }}</span></div>
          <a class="btn btn-primary btn-sm btn-block" routerLink="/portal/book"
             [queryParams]="{ pkg: o.organ + ' Health Checkup', price: o.price }">Book Now</a>
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
export class PortalHomeComponent implements OnInit {
  tiles = SERVICE_TILES;
  carePlans = CARE_PLANS;
  popular = LAB_PACKAGES.filter((p) => p.category === 'Popular' || p.category === 'Vitamins').slice(0, 4);
  organs = ORGAN_TESTS;
  journey = CHECKUP_JOURNEY;

  score: HealthScore = { score: null, label: '', message: '', factors: [] };

  constructor(private auth: AuthService, private health: HealthScoreService) {}

  ngOnInit(): void {
    this.score = this.health.compute();
  }

  get firstName(): string {
    const name = this.auth.currentUser()?.name || 'there';
    return name.split(' ')[0];
  }

  // Fill the score ring proportionally (empty when no score yet).
  get ringStyle(): string {
    const pct = this.score.score ?? 0;
    return `conic-gradient(var(--primary) 0 ${pct}%, #e2e8f0 ${pct}% 100%)`;
  }
}
