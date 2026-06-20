import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="card auth-card">
        <div class="auth-brand"><span class="logo">🏥 HealthBridge</span></div>
        <p class="auth-sub">Create a staff account</p>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" type="text" formControlName="name" placeholder="Dr. Asha Mehta" />
            <div class="field-error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">
              Name required
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input class="form-control" type="email" formControlName="email" placeholder="you@hospital.com" />
            <div class="field-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              Valid email required
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Password</label>
              <input class="form-control" type="password" formControlName="password" placeholder="min 6 chars" />
              <div class="field-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
                Min 6 characters
              </div>
            </div>
            <div class="form-group">
              <label>Role</label>
              <select class="form-control" formControlName="role">
                <option value="patient">Patient</option>
                <option value="staff">Staff</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary btn-block" type="submit" [disabled]="loading">
            {{ loading ? 'Creating...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-foot">Already have an account? <a routerLink="/login">Sign in</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  loading = false;
  error = '';

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['staff', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.register(this.form.getRawValue() as { name: string; email: string; password: string; role: string }).subscribe({
      next: () => this.router.navigate([this.auth.hasRole('patient') ? '/portal/home' : '/patients']),
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
