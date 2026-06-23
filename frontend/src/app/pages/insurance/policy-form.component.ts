import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InsuranceService } from '../../services/insurance.service';
import { PatientService } from '../../services/patient.service';
import { InsurancePolicy } from '../../models/insurance.model';
import { Patient } from '../../models/patient.model';

// Create / edit an insurance policy
@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Edit Policy' : 'New Policy' }}</h2>
        <a class="btn btn-ghost" routerLink="/insurance">← Back</a>
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
              <label>Insurance Company (Payer) *</label>
              <input class="form-control" type="text" formControlName="payerName" placeholder="e.g. Star Health" />
              <div class="field-error" *ngIf="invalid('payerName')">Payer required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Policy Number *</label>
              <input class="form-control" type="text" formControlName="policyNumber" />
              <div class="field-error" *ngIf="invalid('policyNumber')">Policy number required</div>
            </div>
            <div class="form-group">
              <label>Holder Name</label>
              <input class="form-control" type="text" formControlName="holderName" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Coverage Amount (₹)</label>
              <input class="form-control" type="number" formControlName="coverageAmount" />
            </div>
            <div class="form-group">
              <label>Valid To</label>
              <input class="form-control" type="date" formControlName="validTo" />
            </div>
          </div>

          <div class="form-group">
            <label>Valid From</label>
            <input class="form-control" type="date" formControlName="validFrom" style="max-width:220px;" />
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea class="form-control" rows="2" formControlName="notes"></textarea>
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Policy' : 'Create Policy') }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class PolicyFormComponent implements OnInit {
  isEdit = false;
  id: string | null = null;
  loading = false;
  error = '';
  patients: Patient[] = [];

  form = this.fb.group({
    patient: ['', Validators.required],
    payerName: ['', Validators.required],
    policyNumber: ['', Validators.required],
    holderName: [''],
    coverageAmount: [0],
    validFrom: [''],
    validTo: [''],
    notes: ['']
  });

  constructor(
    private fb: FormBuilder,
    private insurance: InsuranceService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientService.getAll().subscribe({ next: (list) => this.patients = list });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.insurance.getPolicy(this.id).subscribe({
        next: (p) => { this.patchForm(p); this.loading = false; },
        error: (err) => { this.error = err?.error?.message || 'Could not load policy'; this.loading = false; }
      });
    }
  }

  private patchForm(p: InsurancePolicy): void {
    const pat = p.patient;
    const patientId: string = pat && typeof pat === 'object' ? ((pat as Patient)._id || '') : (p.patient as string || '');
    this.form.patchValue({
      patient: patientId || '',
      payerName: p.payerName,
      policyNumber: p.policyNumber,
      holderName: p.holderName || '',
      coverageAmount: p.coverageAmount || 0,
      validFrom: this.toDateInput(p.validFrom),
      validTo: this.toDateInput(p.validTo),
      notes: p.notes || ''
    });
  }

  private toDateInput(iso?: string): string {
    return iso ? new Date(iso).toISOString().slice(0, 10) : '';
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
    const data = this.form.getRawValue() as unknown as InsurancePolicy;

    const req = this.isEdit && this.id
      ? this.insurance.updatePolicy(this.id, data)
      : this.insurance.createPolicy(data);

    req.subscribe({
      next: () => this.router.navigate(['/insurance']),
      error: (err) => {
        this.error = err?.error?.message || 'Could not save policy';
        this.loading = false;
      }
    });
  }
}
