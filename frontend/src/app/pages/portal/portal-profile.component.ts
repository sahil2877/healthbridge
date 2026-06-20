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
      <div class="page-header"><h2>My Profile</h2></div>

      <div class="card" *ngIf="auth.currentUser() as u" style="max-width:520px;">
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:18px;">
          <div style="width:64px; height:64px; border-radius:50%; background:var(--primary-light);
                      color:var(--primary-dark); display:grid; place-items:center; font-size:1.6rem; font-weight:800;">
            {{ initial(u.name) }}
          </div>
          <div>
            <div style="font-weight:800; font-size:1.2rem;">{{ u.name }}</div>
            <div style="color:var(--muted);">{{ u.email }}</div>
            <span class="badge" style="margin-top:4px;">{{ u.role }}</span>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <tbody>
              <tr><td><b>Name</b></td><td>{{ u.name }}</td></tr>
              <tr><td><b>Email</b></td><td>{{ u.email }}</td></tr>
              <tr><td><b>Role</b></td><td>{{ u.role }}</td></tr>
              <tr><td><b>Wallet</b></td><td>₹1,000</td></tr>
            </tbody>
          </table>
        </div>

        <button class="btn btn-danger" style="margin-top:18px;" (click)="logout()">Logout</button>
      </div>
    </div>
  `
})
export class PortalProfileComponent {
  constructor(public auth: AuthService, private router: Router) {}

  initial(name: string): string {
    return (name || '?').charAt(0).toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
