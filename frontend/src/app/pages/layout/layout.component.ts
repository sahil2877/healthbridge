import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Shell for the authenticated area: navbar + <router-outlet/>
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="navbar">
      <div class="navbar-inner">
        <a class="brand" routerLink="/patients">🏥 HealthBridge</a>
        <nav>
          <a routerLink="/patients" routerLinkActive="active">Patients</a>
          <a routerLink="/appointments" routerLinkActive="active">Appointments</a>
          <a routerLink="/records" routerLinkActive="active">Records</a>
          <a routerLink="/prescriptions" routerLinkActive="active">Prescriptions</a>
          <a routerLink="/invoices" routerLinkActive="active">Billing</a>
          <a routerLink="/screening" routerLinkActive="active">Screening</a>
          <span class="user-chip" *ngIf="auth.currentUser() as u">
            {{ u.name }} <span class="badge">{{ u.role }}</span>
          </span>
          <button class="btn btn-ghost btn-sm" (click)="logout()">Logout</button>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>
  `
})
export class LayoutComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
