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
        <div class="page-title">
          <h1>{{ isEdit ? 'Edit Patient' : 'Onboard Patient' }}</h1>
          <p>{{ isEdit ? 'Update patient details' : 'Register a new patient with complete medical profile' }}</p>
        </div>
      </div>

      <div class="card">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <!-- ===== Demographics ===== -->
          <h3 class="form-section-title"><i class="fa-solid fa-user"></i> Personal Details</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input class="form-control" type="text" formControlName="name" placeholder="e.g. Anand Sharma" />
              <div class="field-error" *ngIf="invalid('name')">Name required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Phone *</label>
              <input class="form-control" type="text" formControlName="phone" placeholder="e.g. 9876543210" />
              <div class="field-error" *ngIf="invalid('phone')">Phone required</div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Age *</label>
              <input class="form-control" type="number" formControlName="age" placeholder="Years" />
              <div class="field-error" *ngIf="invalid('age')">Valid age required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Gender *</label>
              <select class="form-control" formControlName="gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input class="form-control" type="email" formControlName="email" placeholder="patient@example.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Blood Group</label>
              <select class="form-control" formControlName="bloodGroup">
                <option *ngFor="let bg of bloodGroups" [value]="bg">{{ bg }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Address</label>
            <textarea class="form-control" rows="2" formControlName="address" placeholder="Full residential address"></textarea>
          </div>

          <!-- ===== Medical Profile ===== -->
          <h3 class="form-section-title"><i class="fa-solid fa-notes-medical"></i> Medical History</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Height (cm)</label>
              <input class="form-control" type="number" formControlName="height" placeholder="e.g. 168" />
            </div>
            <div class="form-group">
              <label class="form-label">Weight (kg)</label>
              <input class="form-control" type="number" formControlName="weight" placeholder="e.g. 72" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Allergies</label>
            <textarea class="form-control" rows="2" formControlName="allergies" placeholder="e.g. Penicillin, Peanuts, Latex — write 'None' if none"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Chronic / Existing Conditions</label>
            <textarea class="form-control" rows="2" formControlName="chronicConditions" placeholder="e.g. Diabetes Type 2, Hypertension, Asthma — write 'None' if none"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Current Medications</label>
            <textarea class="form-control" rows="2" formControlName="currentMedications" placeholder="e.g. Metformin 500mg daily, Lisinopril 10mg — write 'None' if none"></textarea>
          </div>

          <!-- ===== Emergency Contact ===== -->
          <h3 class="form-section-title"><i class="fa-solid fa-phone-volume"></i> Emergency Contact</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Contact Name</label>
              <input class="form-control" type="text" formControlName="emergencyContactName" placeholder="e.g. Priya Sharma (Wife)" />
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone</label>
              <input class="form-control" type="text" formControlName="emergencyContactPhone" placeholder="e.g. 9876543211" />
            </div>
          </div>

          <div style="display:flex; gap:10px; margin-top:20px;">
            <button class="btn btn-primary" type="submit" [disabled]="loading">
              <i class="fa-solid" [class.fa-spinner]="loading" [class.fa-spin]="loading" [class.fa-floppy-disk]="!loading"></i>
              {{ loading ? 'Saving...' : (isEdit ? 'Update Patient' : 'Onboard Patient') }}
            </button>
            <a class="btn btn-ghost" routerLink="/patients"><i class="fa-solid fa-xmark"></i> Cancel</a>
          </div>
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
    // Demographics
    name: ['', Validators.required],
    age: [null as number | null, [Validators.required, Validators.min(0), Validators.max(150)]],
    gender: ['Male', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    address: [''],
    bloodGroup: ['Unknown'],
    // Medical profile
    height: [null as number | null],
    weight: [null as number | null],
    allergies: [''],
    chronicConditions: [''],
    currentMedications: [''],
    // Emergency contact
    emergencyContactName: [''],
    emergencyContactPhone: ['']
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
