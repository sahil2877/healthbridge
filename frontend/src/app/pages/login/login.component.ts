import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="card auth-card">
        <div class="auth-brand"><span class="logo">🏥 HealthBridge</span></div>
        <p class="auth-sub">Sign in to your account</p>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" type="email" formControlName="email" placeholder="you@hospital.com" />
            <div class="field-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              Valid email required
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password" formControlName="password" placeholder="••••••••" />
            <div class="field-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              Password required
            </div>
          </div>

          <button class="btn btn-primary btn-block" type="submit" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-foot">No account? <a routerLink="/register">Register here</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  // Patients go to the consumer portal; staff/doctor/admin go to the provider console
  private homeRoute(): string {
    return this.auth.hasRole('patient') ? '/portal/home' : '/patients';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => this.router.navigate([this.homeRoute()]),
      error: (err) => {
        this.error = err?.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
