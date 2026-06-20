import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

// A single form used for both add and edit (edit mode when an id is present in the route)
@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Edit Patient' : 'Onboard Patient' }}</h2>
        <a class="btn btn-ghost" routerLink="/patients">← Back</a>
      </div>

      <div class="card">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input class="form-control" type="text" formControlName="name" />
              <div class="field-error" *ngIf="invalid('name')">Name required</div>
            </div>
            <div class="form-group">
              <label>Phone *</label>
              <input class="form-control" type="text" formControlName="phone" />
              <div class="field-error" *ngIf="invalid('phone')">Phone required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Age *</label>
              <input class="form-control" type="number" formControlName="age" />
              <div class="field-error" *ngIf="invalid('age')">Valid age required</div>
            </div>
            <div class="form-group">
              <label>Gender *</label>
              <select class="form-control" formControlName="gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input class="form-control" type="email" formControlName="email" />
            </div>
            <div class="form-group">
              <label>Blood Group</label>
              <select class="form-control" formControlName="bloodGroup">
                <option *ngFor="let bg of bloodGroups" [value]="bg">{{ bg }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Address</label>
            <textarea class="form-control" rows="2" formControlName="address"></textarea>
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Patient' : 'Onboard Patient') }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class PatientFormComponent implements OnInit {
  isEdit = false;
  id: string | null = null;
  loading = false;
  error = '';
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];

  form = this.fb.group({
    name: ['', Validators.required],
    age: [null as number | null, [Validators.required, Validators.min(0), Validators.max(150)]],
    gender: ['Male', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    address: [''],
    bloodGroup: ['Unknown']
  });

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.patientService.getOne(this.id).subscribe({
        next: (p) => { this.form.patchValue(p); this.loading = false; },
        error: (err) => { this.error = err?.error?.message || 'Could not load patient'; this.loading = false; }
      });
    }
  }

  invalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.touched && c.invalid;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const data = this.form.getRawValue() as unknown as Patient;

    const req = this.isEdit && this.id
      ? this.patientService.update(this.id, data)
      : this.patientService.create(data);

    req.subscribe({
      next: () => this.router.navigate(['/patients']),
      error: (err) => {
        this.error = err?.error?.message || 'Could not save patient';
        this.loading = false;
      }
    });
  }
}
