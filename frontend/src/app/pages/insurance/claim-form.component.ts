import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InsuranceService } from '../../services/insurance.service';
import { Claim, InsurancePolicy, PolicyRef } from '../../models/insurance.model';
import { Patient } from '../../models/patient.model';

// Create / edit an insurance claim, with a status workflow.
@Component({
  selector: 'app-claim-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>{{ isEdit ? 'Edit Claim' : 'New Claim' }}</h2>
        <a class="btn btn-ghost" routerLink="/insurance">← Back</a>
      </div>

      <div class="card">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group" style="max-width:420px;">
            <label>Policy *</label>
            <select class="form-control" formControlName="policy" (change)="onPolicyChange()">
              <option value="">-- Select policy --</option>
              <option *ngFor="let p of policies" [value]="p._id">
                {{ p.payerName }} — {{ p.policyNumber }} ({{ patientName(p) }})
              </option>
            </select>
            <div class="field-error" *ngIf="invalid('policy')">Policy required</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Amount Claimed (₹) *</label>
              <input class="form-control" type="number" formControlName="amountClaimed" />
              <div class="field-error" *ngIf="invalid('amountClaimed')">Valid amount required</div>
            </div>
            <div class="form-group">
              <label>Amount Approved (₹)</label>
              <input class="form-control" type="number" formControlName="amountApproved" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Pre-Authorization No.</label>
              <input class="form-control" type="text" formControlName="preAuthNo" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select class="form-control" formControlName="status">
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea class="form-control" rows="2" formControlName="notes"></textarea>
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Claim' : 'Create Claim') }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class ClaimFormComponent implements OnInit {
  isEdit = false;
  id: string | null = null;
  loading = false;
  error = '';
  policies: InsurancePolicy[] = [];

  form = this.fb.group({
    policy: ['', Validators.required],
    patient: ['', Validators.required], // derived from the selected policy
    amountClaimed: [0, [Validators.required, Validators.min(1)]],
    amountApproved: [0],
    preAuthNo: [''],
    status: ['draft'],
    notes: ['']
  });

  constructor(
    private fb: FormBuilder,
    private insurance: InsuranceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.insurance.getPolicies().subscribe({ next: (list) => this.policies = list });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.insurance.getClaim(this.id).subscribe({
        next: (c) => { this.patchForm(c); this.loading = false; },
        error: (err) => { this.error = err?.error?.message || 'Could not load claim'; this.loading = false; }
      });
    }
  }

  patientName(p: InsurancePolicy): string {
    const pat = p.patient;
    if (!pat) return 'Deleted';
    return typeof pat === 'object' ? (pat as Patient).name : '';
  }

  // When a policy is picked, copy its patient onto the claim
  onPolicyChange(): void {
    const selected = this.policies.find((p) => p._id === this.form.value.policy);
    if (selected) {
      const pat = selected.patient;
      const patientId: string = pat && typeof pat === 'object' ? ((pat as Patient)._id || '') : (selected.patient as string || '');
      this.form.patchValue({ patient: patientId });
    }
  }

  private patchForm(c: Claim): void {
    const pol = c.policy;
    const policyId: string = pol && typeof pol === 'object' ? ((pol as PolicyRef)._id || '') : (c.policy as string || '');
    const pat = c.patient;
    const patientId: string = pat && typeof pat === 'object' ? ((pat as Patient)._id || '') : (c.patient as string || '');
    this.form.patchValue({
      policy: policyId || '',
      patient: patientId || '',
      amountClaimed: c.amountClaimed,
      amountApproved: c.amountApproved || 0,
      preAuthNo: c.preAuthNo || '',
      status: c.status || 'draft',
      notes: c.notes || ''
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
    const data = this.form.getRawValue() as unknown as Claim;

    const req = this.isEdit && this.id
      ? this.insurance.updateClaim(this.id, data)
      : this.insurance.createClaim(data);

    req.subscribe({
      next: () => this.router.navigate(['/insurance']),
      error: (err) => {
        this.error = err?.error?.message || 'Could not save claim';
        this.loading = false;
      }
    });
  }
}
