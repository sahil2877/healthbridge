import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Desktop web layout for the patient portal: top navbar + content outlet
// (consistent with the provider console — no mobile bottom tabs).
@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="navbar">
      <div class="navbar-inner">
        <a class="brand" routerLink="/portal/home">🏥 HealthBridge</a>
        <nav>
          <a routerLink="/portal/home" routerLinkActive="active">Home</a>
          <a routerLink="/portal/care" routerLinkActive="active">Book Tests</a>
          <a routerLink="/portal/orders" routerLinkActive="active">My Orders</a>
          <a routerLink="/portal/vitals" routerLinkActive="active">My Health</a>
          <a routerLink="/portal/profile" routerLinkActive="active">Profile</a>
          <span class="user-chip" *ngIf="auth.currentUser() as u">{{ u.name }}</span>
          <button class="btn btn-ghost btn-sm" (click)="logout()">Logout</button>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>
  `
})
export class PortalLayoutComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
