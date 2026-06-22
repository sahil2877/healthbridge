import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationBellComponent } from '../../shared/notification-bell.component';

// Patient portal shell: glassy top navbar with horizontal nav-links + content outlet.
@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NotificationBellComponent],
  template: `
    <nav class="navbar portal-nav">
      <a class="nav-logo" routerLink="/portal/home">
        <div class="logo-icon"><i class="fa-solid fa-heart-pulse"></i></div>
        <div class="logo-text">
          HealthBridge
          <small>Patient Portal</small>
        </div>
      </a>

      <div class="nav-menu" [class.open]="menuOpen" (click)="menuOpen = false">
        <a class="nav-link" routerLink="/portal/home" routerLinkActive="active"><i class="fa-solid fa-house"></i> Home</a>
        <a class="nav-link" routerLink="/portal/care" routerLinkActive="active"><i class="fa-solid fa-flask-vial"></i> Book Tests</a>
        <a class="nav-link" routerLink="/portal/orders" routerLinkActive="active"><i class="fa-solid fa-box"></i> My Orders</a>
        <a class="nav-link" routerLink="/portal/appointments" routerLinkActive="active"><i class="fa-solid fa-calendar-check"></i> Appointments</a>
        <a class="nav-link" routerLink="/portal/consult" routerLinkActive="active"><i class="fa-solid fa-video"></i> Consult</a>
        <a class="nav-link" routerLink="/portal/records" routerLinkActive="active"><i class="fa-solid fa-file-medical"></i> My Records</a>
        <a class="nav-link" routerLink="/portal/vitals" routerLinkActive="active"><i class="fa-solid fa-heart"></i> My Health</a>
        <a class="nav-link" routerLink="/portal/profile" routerLinkActive="active"><i class="fa-solid fa-user"></i> Profile</a>
      </div>

      <div class="nav-actions">
        <button class="icon-btn mobile-toggle" (click)="menuOpen = !menuOpen" title="Menu"><i class="fa-solid fa-bars"></i></button>
        <button class="icon-btn" (click)="theme.toggle()" title="Toggle theme">
          <i class="fa-solid" [class.fa-moon]="theme.theme() === 'light'" [class.fa-sun]="theme.theme() === 'dark'"></i>
        </button>

        <app-notification-bell />

        <a class="profile-chip" routerLink="/portal/profile">
          <div class="avatar">{{ initials }}</div>
          <div class="profile-chip-info" *ngIf="auth.currentUser() as u">
            <strong>{{ u.name }}</strong>
            <small>Patient</small>
          </div>
        </a>
        <button class="logout-btn" (click)="logout()">
          <i class="fa-solid fa-right-from-bracket"></i> <span>Logout</span>
        </button>
      </div>
    </nav>

    <main class="portal-main">
      <router-outlet />
    </main>
  `
})
export class PortalLayoutComponent {
  menuOpen = false;

  constructor(public auth: AuthService, public theme: ThemeService, private router: Router) {}

  get initials(): string {
    const name = this.auth.currentUser()?.name || 'U';
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
