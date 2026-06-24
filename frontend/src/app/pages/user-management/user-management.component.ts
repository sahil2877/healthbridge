import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

// Admin-only User Management — list, create, edit, reset password and delete users.
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>User Management</h1>
          <p>Manage staff, doctors, admins and patient accounts.</p>
        </div>
        <button class="btn btn-primary" (click)="openCreate()"><i class="fa-solid fa-user-plus"></i> Add User</button>
      </div>

      <div class="card">
        <div class="filter-bar">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search by name or email..." [(ngModel)]="search" [ngModelOptions]="{standalone:true}" />
          </div>
          <select class="form-control" [(ngModel)]="roleFilter" [ngModelOptions]="{standalone:true}">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="staff">Staff</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="empty-state" *ngIf="loading">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Loading users...</p>
        </div>
        <div class="empty-state" *ngIf="!loading && filtered().length === 0">
          <i class="fa-solid fa-users"></i>
          <p>No users found.</p>
        </div>

        <div class="table-wrap" *ngIf="!loading && filtered().length > 0">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of filtered()">
                <td>
                  <div class="patient-cell">
                    <div class="avatar" [style.background]="avatarBg(u.name)">{{ initials(u.name) }}</div>
                    <div class="patient-cell-info">
                      <p>{{ u.name }} <span *ngIf="isSelf(u)" class="badge badge-primary" style="margin-left:6px;">You</span></p>
                      <small>{{ u.email }}</small>
                    </div>
                  </div>
                </td>
                <td><span class="badge" [ngClass]="roleBadge(u.role)">{{ u.role | titlecase }}</span></td>
                <td>{{ u.createdAt ? (u.createdAt | date:'mediumDate') : '-' }}</td>
                <td style="text-align:right; white-space:nowrap;">
                  <button class="btn btn-ghost btn-sm" (click)="openEdit(u)"><i class="fa-solid fa-pen"></i> Edit</button>
                  <button class="btn btn-ghost btn-sm" (click)="openPassword(u)"><i class="fa-solid fa-key"></i></button>
                  <button class="btn btn-danger btn-sm" *ngIf="!isSelf(u)" (click)="remove(u)"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== Create / Edit modal ===== -->
    <div class="modal-backdrop" *ngIf="formOpen" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">{{ editId ? 'Edit User' : 'Add User' }}</div>
          <button class="modal-close" (click)="closeForm()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="alert alert-error" *ngIf="formError">{{ formError }}</div>

        <form [formGroup]="form" (ngSubmit)="saveForm()">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input class="form-control" type="text" formControlName="name" placeholder="e.g. Dr. Asha Mehta" />
            <div class="field-error" *ngIf="fInvalid('name')">Name required</div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input class="form-control" type="email" formControlName="email" placeholder="user@example.com" />
              <div class="field-error" *ngIf="fInvalid('email')">Valid email required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Role *</label>
              <select class="form-control" formControlName="role">
                <option value="patient">Patient</option>
                <option value="staff">Staff</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <!-- Password only on create -->
          <div class="form-group" *ngIf="!editId">
            <label class="form-label">Password *</label>
            <input class="form-control" type="password" formControlName="password" placeholder="min 6 characters" />
            <div class="field-error" *ngIf="fInvalid('password')">Min 6 characters</div>
          </div>

          <!-- Patient clinical details only on create + role=patient -->
          <ng-container *ngIf="!editId && isPatientRole">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Age *</label>
                <input class="form-control" type="number" formControlName="age" placeholder="e.g. 28" />
                <div class="field-error" *ngIf="fInvalid('age')">Valid age required</div>
              </div>
              <div class="form-group">
                <label class="form-label">Gender</label>
                <select class="form-control" formControlName="gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Phone *</label>
                <input class="form-control" type="text" formControlName="phone" placeholder="e.g. 9876543210" />
                <div class="field-error" *ngIf="fInvalid('phone')">Phone required</div>
              </div>
              <div class="form-group">
                <label class="form-label">Blood Group</label>
                <select class="form-control" formControlName="bloodGroup">
                  <option *ngFor="let bg of bloodGroups" [value]="bg">{{ bg }}</option>
                </select>
              </div>
            </div>
          </ng-container>

          <div class="modal-footer">
            <button class="btn btn-ghost" type="button" (click)="closeForm()">Cancel</button>
            <button class="btn btn-primary" type="submit" [disabled]="saving">
              <i class="fa-solid" [class.fa-spinner]="saving" [class.fa-spin]="saving" [class.fa-floppy-disk]="!saving"></i>
              {{ saving ? 'Saving...' : (editId ? 'Update User' : 'Create User') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ===== Reset password modal ===== -->
    <div class="modal-backdrop" *ngIf="pwOpen" (click)="closePassword()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">Reset Password</div>
          <button class="modal-close" (click)="closePassword()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <p style="color:var(--muted); margin-top:0;">Set a new password for <strong>{{ pwUser?.name }}</strong>.</p>
        <div class="alert alert-error" *ngIf="pwError">{{ pwError }}</div>

        <div class="form-group">
          <label class="form-label">New Password *</label>
          <input class="form-control" type="password" [(ngModel)]="newPassword" [ngModelOptions]="{standalone:true}" placeholder="min 6 characters" />
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" type="button" (click)="closePassword()">Cancel</button>
          <button class="btn btn-primary" (click)="savePassword()" [disabled]="pwSaving">
            <i class="fa-solid" [class.fa-spinner]="pwSaving" [class.fa-spin]="pwSaving" [class.fa-key]="!pwSaving"></i>
            {{ pwSaving ? 'Saving...' : 'Update Password' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  search = '';
  roleFilter = '';
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];

  // create/edit modal
  formOpen = false;
  editId: string | null = null;
  saving = false;
  formError = '';

  // reset-password modal
  pwOpen = false;
  pwUser: User | null = null;
  newPassword = '';
  pwSaving = false;
  pwError = '';

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['staff', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    age: [null as number | null],
    gender: ['Male'],
    phone: [''],
    bloodGroup: ['Unknown']
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public auth: AuthService
  ) {}

  get isPatientRole(): boolean {
    return this.form.get('role')?.value === 'patient';
  }

  ngOnInit(): void {
    // Patient-detail validators follow the selected role (create mode only).
    this.form.get('role')?.valueChanges.subscribe(() => this.applyPatientValidators());
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.userService.getAll().subscribe({
      next: (list) => { this.users = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load users'; this.loading = false; }
    });
  }

  // --- list helpers ---
  uid(u: User): string {
    return u._id || u.id;
  }
  isSelf(u: User): boolean {
    return this.uid(u) === this.auth.currentUser()?.id;
  }
  filtered(): User[] {
    const q = this.search.trim().toLowerCase();
    return this.users.filter((u) =>
      (!this.roleFilter || u.role === this.roleFilter) &&
      (!q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
    );
  }
  initials(name: string): string {
    return (name || '?').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  }
  avatarBg(name: string): string {
    const grads = ['var(--gradient-1)', 'var(--gradient-2)', 'var(--gradient-purple)', 'var(--gradient-warm)', 'var(--gradient-success)'];
    let sum = 0;
    for (let i = 0; i < (name || '').length; i++) sum += name.charCodeAt(i);
    return grads[sum % grads.length];
  }
  roleBadge(role: string): string {
    switch (role) {
      case 'admin': return 'badge-danger';
      case 'doctor': return 'badge-primary';
      case 'staff': return 'badge-info';
      default: return 'badge-success'; // patient
    }
  }

  // --- create / edit ---
  private applyPatientValidators(): void {
    const age = this.form.get('age');
    const phone = this.form.get('phone');
    if (!this.editId && this.isPatientRole) {
      age?.setValidators([Validators.required, Validators.min(0), Validators.max(150)]);
      phone?.setValidators([Validators.required]);
    } else {
      age?.clearValidators();
      phone?.clearValidators();
    }
    age?.updateValueAndValidity();
    phone?.updateValueAndValidity();
  }

  openCreate(): void {
    this.editId = null;
    this.formError = '';
    this.form.reset({ name: '', email: '', role: 'staff', password: '', age: null, gender: 'Male', phone: '', bloodGroup: 'Unknown' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.applyPatientValidators();
    this.formOpen = true;
  }

  openEdit(u: User): void {
    this.editId = this.uid(u);
    this.formError = '';
    this.form.reset({ name: u.name, email: u.email, role: u.role, password: '', age: null, gender: 'Male', phone: '', bloodGroup: 'Unknown' });
    // No password in edit mode — drop its validator so the form can submit.
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.applyPatientValidators();
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
  }

  fInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.touched && c.invalid;
  }

  saveForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.formError = '';
    const v = this.form.getRawValue();

    if (this.editId) {
      this.userService.update(this.editId, { name: v.name!, email: v.email!, role: v.role! }).subscribe({
        next: () => { this.saving = false; this.formOpen = false; this.load(); },
        error: (err) => { this.formError = err?.error?.message || 'Could not update user'; this.saving = false; }
      });
    } else {
      const payload = v.role === 'patient'
        ? { name: v.name!, email: v.email!, password: v.password!, role: v.role!, age: v.age, gender: v.gender!, phone: v.phone!, bloodGroup: v.bloodGroup! }
        : { name: v.name!, email: v.email!, password: v.password!, role: v.role! };
      this.userService.create(payload).subscribe({
        next: () => { this.saving = false; this.formOpen = false; this.load(); },
        error: (err) => { this.formError = err?.error?.message || 'Could not create user'; this.saving = false; }
      });
    }
  }

  // --- reset password ---
  openPassword(u: User): void {
    this.pwUser = u;
    this.newPassword = '';
    this.pwError = '';
    this.pwOpen = true;
  }
  closePassword(): void {
    this.pwOpen = false;
  }
  savePassword(): void {
    if (!this.pwUser) return;
    if (!this.newPassword || this.newPassword.length < 6) {
      this.pwError = 'Password must be at least 6 characters';
      return;
    }
    this.pwSaving = true;
    this.pwError = '';
    this.userService.resetPassword(this.uid(this.pwUser), this.newPassword).subscribe({
      next: () => { this.pwSaving = false; this.pwOpen = false; },
      error: (err) => { this.pwError = err?.error?.message || 'Could not update password'; this.pwSaving = false; }
    });
  }

  // --- delete ---
  remove(u: User): void {
    const id = this.uid(u);
    const msg = u.role === 'patient'
      ? `Delete user "${u.name}"?\n\nThis patient's clinical data (appointments, records, prescriptions, invoices, and more) will also be permanently deleted.\n\nThis cannot be undone.`
      : `Delete user "${u.name}"?\n\nThis cannot be undone.`;
    if (!confirm(msg)) return;
    this.userService.delete(id).subscribe({
      next: () => this.users = this.users.filter((x) => this.uid(x) !== id),
      error: (err) => this.error = err?.error?.message || 'Could not delete user'
    });
  }
}
