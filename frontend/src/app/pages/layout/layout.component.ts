import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationBellComponent } from '../../shared/notification-bell.component';

// Provider console shell: collapsible sidebar + glassy navbar + <router-outlet/>.
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NotificationBellComponent],
  template: `
    <div class="app">
      <!-- ============ SIDEBAR ============ -->
      <aside class="sidebar" [class.collapsed]="collapsed" [class.mobile-open]="mobileOpen">
        <div class="sidebar-header">
          <div class="logo-icon"><i class="fa-solid fa-heart-pulse"></i></div>
          <div class="logo-text">
            <strong>HealthBridge</strong>
            <small>AI Care Platform</small>
          </div>
        </div>

        <nav class="sidebar-nav" (click)="mobileOpen = false">
          <div class="sidebar-section-label">Main</div>
          <a class="nav-item" routerLink="/dashboard" routerLinkActive="active">
            <i class="fa-solid fa-gauge-high"></i><span>Dashboard</span>
          </a>
          <a class="nav-item" routerLink="/patients" routerLinkActive="active">
            <i class="fa-solid fa-user-injured"></i><span>Patients</span>
          </a>
          <a class="nav-item" routerLink="/appointments" routerLinkActive="active">
            <i class="fa-solid fa-calendar-check"></i><span>Appointments</span>
          </a>
          <a class="nav-item" routerLink="/records" routerLinkActive="active">
            <i class="fa-solid fa-file-medical"></i><span>Clinical Records</span>
          </a>
          <a class="nav-item" routerLink="/prescriptions" routerLinkActive="active">
            <i class="fa-solid fa-prescription-bottle-medical"></i><span>Prescriptions</span>
          </a>
          <a class="nav-item" routerLink="/invoices" routerLinkActive="active">
            <i class="fa-solid fa-credit-card"></i><span>Billing</span>
          </a>

          <div class="sidebar-section-label">Operations</div>
          <a class="nav-item" routerLink="/insurance" routerLinkActive="active">
            <i class="fa-solid fa-shield-heart"></i><span>Insurance</span>
          </a>
          <a class="nav-item" routerLink="/lab-orders" routerLinkActive="active">
            <i class="fa-solid fa-flask-vial"></i><span>Lab Orders</span>
          </a>
          <a class="nav-item" routerLink="/consultations" routerLinkActive="active">
            <i class="fa-solid fa-video"></i><span>Teleconsult</span>
          </a>
          <a class="nav-item" routerLink="/screening" routerLinkActive="active">
            <i class="fa-solid fa-heart-circle-bolt"></i><span>Health Screening</span>
          </a>

          <ng-container *ngIf="auth.hasRole('admin')">
            <div class="sidebar-section-label">System</div>
            <a class="nav-item" routerLink="/users" routerLinkActive="active">
              <i class="fa-solid fa-users-gear"></i><span>User Management</span>
            </a>
            <a class="nav-item" routerLink="/audit" routerLinkActive="active">
              <i class="fa-solid fa-list-check"></i><span>Audit Logs</span>
            </a>
          </ng-container>
        </nav>
      </aside>

      <!-- ============ MAIN ============ -->
      <div class="main">
        <header class="navbar">
          <button class="nav-toggle" (click)="toggleSidebar()" title="Toggle menu">
            <i class="fa-solid fa-bars"></i>
          </button>
          <div class="nav-search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search patients, appointments, records..." />
            <kbd>⌘K</kbd>
          </div>

          <div class="nav-actions">
            <button class="icon-btn" (click)="theme.toggle()" title="Toggle theme">
              <i class="fa-solid" [class.fa-moon]="theme.theme() === 'light'" [class.fa-sun]="theme.theme() === 'dark'"></i>
            </button>

            <app-notification-bell />

            <div style="position:relative;">
              <button class="profile-btn" (click)="profileOpen = !profileOpen">
                <div class="avatar">{{ initials }}</div>
                <div class="profile-btn-info" *ngIf="auth.currentUser() as u">
                  <strong>{{ u.name }}</strong>
                  <small>{{ u.role | titlecase }}</small>
                </div>
                <i class="fa-solid fa-chevron-down" style="font-size:10px;color:var(--muted)"></i>
              </button>
              <div class="dropdown" *ngIf="profileOpen" style="display:block;">
                <div class="dropdown-header">
                  <div class="avatar" style="width:40px;height:40px;">{{ initials }}</div>
                  <div *ngIf="auth.currentUser() as u">
                    <strong style="font-size:13px;display:block">{{ u.name }}</strong>
                    <small style="color:var(--muted);font-size:11px">{{ u.email }}</small>
                  </div>
                </div>
                <a class="dropdown-item" routerLink="/dashboard" (click)="profileOpen = false"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
                <div class="dropdown-item danger" (click)="logout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</div>
              </div>
            </div>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>

      <!-- outside-click catcher for the profile dropdown -->
      <div *ngIf="profileOpen" (click)="profileOpen = false"
           style="position:fixed;inset:0;z-index:80;"></div>
    </div>
  `
})
export class LayoutComponent {
  collapsed = false;
  mobileOpen = false;
  profileOpen = false;

  constructor(public auth: AuthService, public theme: ThemeService, private router: Router) {}

  get initials(): string {
    const name = this.auth.currentUser()?.name || 'U';
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  toggleSidebar(): void {
    // collapse on desktop, slide-in on mobile
    if (window.innerWidth <= 1024) {
      this.mobileOpen = !this.mobileOpen;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  logout(): void {
    this.profileOpen = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
