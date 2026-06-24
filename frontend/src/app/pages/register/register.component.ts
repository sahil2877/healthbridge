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
        <p class="auth-sub">{{ isPatient ? 'Create your patient account' : 'Create a staff account' }}</p>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" type="text" formControlName="name" [placeholder]="isPatient ? 'Rajesh Mehta' : 'Dr. Asha Mehta'" />
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

          <!-- Patient-only clinical details — captured once at signup so the
               patient record is complete and never duplicated later. -->
          <ng-container *ngIf="isPatient">
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

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['patient', Validators.required],
    // Patient-only fields (validators toggled in ngOnInit based on role)
    age: [null as number | null],
    gender: ['Male'],
    phone: [''],
    bloodGroup: ['Unknown']
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  get isPatient(): boolean {
    return this.form.get('role')?.value === 'patient';
  }

  ngOnInit(): void {
    // Age & phone are required only for patients — wire validators to the role.
    this.applyPatientValidators(this.isPatient);
    this.form.get('role')?.valueChanges.subscribe((role) => {
      this.applyPatientValidators(role === 'patient');
    });
  }

  private applyPatientValidators(on: boolean): void {
    const age = this.form.get('age');
    const phone = this.form.get('phone');
    if (on) {
      age?.setValidators([Validators.required, Validators.min(0), Validators.max(150)]);
      phone?.setValidators([Validators.required]);
    } else {
      age?.clearValidators();
      phone?.clearValidators();
    }
    age?.updateValueAndValidity();
    phone?.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    const v = this.form.getRawValue();
    // Only send patient detail fields for a patient signup
    const payload = this.isPatient
      ? { name: v.name!, email: v.email!, password: v.password!, role: v.role!,
          age: v.age, gender: v.gender!, phone: v.phone!, bloodGroup: v.bloodGroup! }
      : { name: v.name!, email: v.email!, password: v.password!, role: v.role! };

    this.auth.register(payload).subscribe({
      next: () => this.router.navigate([this.auth.hasRole('patient') ? '/portal/home' : '/patients']),
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
