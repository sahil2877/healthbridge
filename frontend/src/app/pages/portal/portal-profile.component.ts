import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Patient portal profile — account info and quick actions.
@Component({
  selector: 'app-portal-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>My Profile</h1>
          <p>Manage your personal information and account.</p>
        </div>
      </div>

      <div class="card" *ngIf="auth.currentUser() as u" style="padding:0;overflow:hidden;">
        <div class="profile-cover">
          <div class="profile-avatar-lg">{{ initials(u.name) }}</div>
        </div>
        <div class="profile-info-pad">
          <h2>{{ u.name }}</h2>
          <div class="email">{{ u.email }}</div>

          <div class="profile-details">
            <div class="profile-detail">
              <small><i class="fa-solid fa-user"></i> Full name</small>
              <strong>{{ u.name }}</strong>
            </div>
            <div class="profile-detail">
              <small><i class="fa-solid fa-envelope"></i> Email</small>
              <strong>{{ u.email }}</strong>
            </div>
            <div class="profile-detail">
              <small><i class="fa-solid fa-id-badge"></i> Account type</small>
              <strong style="text-transform:capitalize;">{{ u.role }}</strong>
            </div>
            <div class="profile-detail">
              <small><i class="fa-solid fa-shield-halved"></i> Status</small>
              <strong><span class="badge badge-success">Active</span></strong>
            </div>
          </div>

          <button class="btn btn-danger" style="margin-top:20px;" (click)="logout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        </div>
      </div>
    </div>
  `
})
export class PortalProfileComponent {
  constructor(public auth: AuthService, private router: Router) {}

  initials(name: string): string {
    return (name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
