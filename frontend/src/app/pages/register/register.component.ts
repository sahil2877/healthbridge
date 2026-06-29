import { Component, OnInit } from '@angular/core';
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
        <p class="auth-sub">Create your patient account</p>

        <!-- Indeterminate top bar while the account is being created -->
        <div class="auth-progress" *ngIf="loading"><span></span></div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" type="text" formControlName="name" placeholder="Rajesh Mehta" />
            <div class="field-error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">
              Name required
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input class="form-control" type="email" formControlName="email" placeholder="you@example.com" />
            <div class="field-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              Valid email required
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password" formControlName="password" placeholder="min 6 chars" />
            <div class="field-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              Min 6 characters
            </div>
          </div>

          <!-- This public page is patient-signup ONLY. Staff, doctor and admin
               accounts are created by an admin from the User Management page —
               never self-registered. Clinical details are captured once here so
               the patient record is complete and never duplicated later. -->
          <ng-container>
            <div class="form-row">
              <div class="form-group">
                <label>Age</label>
                <input class="form-control" type="number" formControlName="age" placeholder="e.g. 28" />
                <div class="field-error" *ngIf="form.get('age')?.touched && form.get('age')?.invalid">
                  Valid age required
                </div>
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select class="form-control" formControlName="gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Phone</label>
                <input class="form-control" type="text" formControlName="phone" placeholder="e.g. 9876543210" />
                <div class="field-error" *ngIf="form.get('phone')?.touched && form.get('phone')?.invalid">
                  Phone required
                </div>
              </div>
              <div class="form-group">
                <label>Blood Group</label>
                <select class="form-control" formControlName="bloodGroup">
                  <option *ngFor="let bg of bloodGroups" [value]="bg">{{ bg }}</option>
                </select>
              </div>
            </div>
          </ng-container>

          <button class="btn btn-primary btn-block" type="submit" [disabled]="loading">
            <i class="fa-solid fa-spinner fa-spin" *ngIf="loading"></i>
            {{ loading ? 'Creating...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-foot">Already have an account? <a routerLink="/login">Sign in</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  loading = false;
  error = '';
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];

  // Public signup is always a patient. Staff/doctor/admin are provisioned by an
  // admin from User Management, so `role` is fixed here and not user-selectable.
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    // Patient clinical details — always required on this page.
    age: [null as number | null, [Validators.required, Validators.min(0), Validators.max(150)]],
    gender: ['Male'],
    phone: ['', Validators.required],
    bloodGroup: ['Unknown']
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    const v = this.form.getRawValue();
    const payload = {
      name: v.name!, email: v.email!, password: v.password!, role: 'patient',
      age: v.age, gender: v.gender!, phone: v.phone!, bloodGroup: v.bloodGroup!
    };

    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/portal/home']),
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
