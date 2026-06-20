import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { PatientService } from '../../services/patient.service';
import { UserService } from '../../services/user.service';
import { Prescription } from '../../models/prescription.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

// One form for creating and editing a prescription, with a dynamic list of medicines
@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Edit Prescription' : 'New Prescription' }}</h2>
        <a class="btn btn-ghost" routerLink="/prescriptions">← Back</a>
      </div>

      <div class="card">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <div class="form-group">
              <label>Patient *</label>
              <select class="form-control" formControlName="patient">
                <option value="">-- Select patient --</option>
                <option *ngFor="let p of patients" [value]="p._id">{{ p.name }} ({{ p.phone }})</option>
              </select>
              <div class="field-error" *ngIf="invalid('patient')">Patient required</div>
            </div>
            <div class="form-group">
              <label>Doctor *</label>
              <select class="form-control" formControlName="doctor">
                <option value="">-- Select doctor --</option>
                <option *ngFor="let d of doctors" [value]="d.id">{{ d.name }} ({{ d.role }})</option>
              </select>
              <div class="field-error" *ngIf="invalid('doctor')">Doctor required</div>
            </div>
          </div>

          <div class="form-group">
            <label>Diagnosis</label>
            <input class="form-control" type="text" formControlName="diagnosis" placeholder="e.g. Viral fever" />
          </div>

          <!-- Dynamic medicine rows -->
          <label style="font-weight:600; display:block; margin:8px 0;">Medicines *</label>
          <div formArrayName="items">
            <div class="card" *ngFor="let item of items.controls; let i = index" [formGroupName]="i"
                 style="margin-bottom:10px; background:var(--bg);">
              <div class="form-row">
                <div class="form-group">
                  <label>Medicine *</label>
                  <input class="form-control" type="text" formControlName="drugName"
                         list="common-drugs" placeholder="e.g. Paracetamol" />
                </div>
                <div class="form-group">
                  <label>Dosage</label>
                  <input class="form-control" type="text" formControlName="dosage" placeholder="500mg" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Frequency</label>
                  <input class="form-control" type="text" formControlName="frequency" placeholder="1-0-1 / Twice a day" />
                </div>
                <div class="form-group">
                  <label>Duration (days)</label>
                  <input class="form-control" type="number" formControlName="durationDays" placeholder="5" />
                </div>
              </div>
              <div class="form-group">
                <label>Instructions</label>
                <input class="form-control" type="text" formControlName="instructions" placeholder="After food" />
              </div>
              <button type="button" class="btn btn-danger btn-sm" (click)="removeItem(i)"
                      [disabled]="items.length === 1">Remove medicine</button>
            </div>
          </div>

          <datalist id="common-drugs">
            <option *ngFor="let d of commonDrugs" [value]="d"></option>
          </datalist>

          <button type="button" class="btn btn-ghost btn-sm" (click)="addItem()" style="margin-bottom:16px;">
            + Add another medicine
          </button>

          <div class="form-group">
            <label>Notes / Advice</label>
            <textarea class="form-control" rows="2" formControlName="notes" placeholder="Follow up after 3 days"></textarea>
          </div>

          <div class="form-group" *ngIf="isEdit">
            <label>Status</label>
            <select class="form-control" formControlName="status">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Prescription' : 'Create Prescription') }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class PrescriptionFormComponent implements OnInit {
  isEdit = false;
  id: string | null = null;
  loading = false;
  error = '';
  patients: Patient[] = [];
  doctors: User[] = [];

  // Simple autocomplete suggestions (a full drug catalog can replace this later)
  commonDrugs = [
    'Paracetamol', 'Amoxicillin', 'Azithromycin', 'Ibuprofen', 'Cetirizine',
    'Pantoprazole', 'Metformin', 'Amlodipine', 'Atorvastatin', 'Omeprazole',
    'Aspirin', 'Vitamin D3', 'Vitamin B12', 'ORS', 'Cough Syrup'
  ];

  form: FormGroup = this.fb.group({
    patient: ['', Validators.required],
    doctor: ['', Validators.required],
    diagnosis: [''],
    items: this.fb.array([this.newItem()]),
    notes: [''],
    status: ['active']
  });

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private newItem(): FormGroup {
    return this.fb.group({
      drugName: ['', Validators.required],
      dosage: [''],
      frequency: [''],
      durationDays: [null as number | null],
      instructions: ['']
    });
  }

  addItem(): void {
    this.items.push(this.newItem());
  }

  removeItem(i: number): void {
    if (this.items.length > 1) this.items.removeAt(i);
  }

  ngOnInit(): void {
    this.patientService.getAll().subscribe({ next: (list) => this.patients = list });
    this.userService.getAll('doctor').subscribe({ next: (list) => this.doctors = list });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.prescriptionService.getOne(this.id).subscribe({
        next: (rx) => { this.patchForm(rx); this.loading = false; },
        error: (err) => { this.error = err?.error?.message || 'Could not load prescription'; this.loading = false; }
      });
    }
  }

  private patchForm(rx: Prescription): void {
    const patientId = typeof rx.patient === 'object' ? (rx.patient as Patient)._id : rx.patient;
    const doctorId = typeof rx.doctor === 'object' ? (rx.doctor as User).id : rx.doctor;

    // Rebuild the items FormArray to match the saved medicines
    this.items.clear();
    (rx.items || []).forEach((it) => {
      const g = this.newItem();
      g.patchValue(it);
      this.items.push(g);
    });
    if (this.items.length === 0) this.items.push(this.newItem());

    this.form.patchValue({
      patient: patientId || '',
      doctor: doctorId || '',
      diagnosis: rx.diagnosis || '',
      notes: rx.notes || '',
      status: rx.status || 'active'
    });
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
    const data = this.form.getRawValue() as unknown as Prescription;

    const req = this.isEdit && this.id
      ? this.prescriptionService.update(this.id, data)
      : this.prescriptionService.create(data);

    req.subscribe({
      next: (saved) => this.router.navigate(['/prescriptions', saved._id]),
      error: (err) => {
        this.error = err?.error?.message || 'Could not save prescription';
        this.loading = false;
      }
    });
  }
}
