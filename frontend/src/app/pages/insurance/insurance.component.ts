import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InsuranceService } from '../../services/insurance.service';
import { AuthService } from '../../services/auth.service';
import { Claim, InsurancePolicy, PolicyRef } from '../../models/insurance.model';
import { Patient } from '../../models/patient.model';

// Insurance hub — shows policies and claims in two tables.
@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Insurance Management</h1>
          <p>Track policies and process claims.</p>
        </div>
        <a class="btn btn-primary" *ngIf="canWrite()" routerLink="/insurance/policies/new">
          <i class="fa-solid fa-plus"></i> Add Policy
        </a>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <!-- Policies -->
      <div class="card" style="margin-bottom:18px;">
        <div class="card-header">
          <div class="card-title">Insurance Policies</div>
          <a class="btn btn-ghost btn-sm" *ngIf="canWrite()" routerLink="/insurance/policies/new">
            <i class="fa-solid fa-plus"></i> New Policy
          </a>
        </div>
        <div class="empty-state" *ngIf="policies.length === 0">
          <i class="fa-solid fa-shield-heart"></i>
          <p>No policies yet.</p>
        </div>
        <div class="table-wrap" *ngIf="policies.length > 0">
          <table>
            <thead><tr><th>Provider</th><th>Policy #</th><th>Patient</th><th>Coverage</th><th>Validity</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let p of policies">
                <td><strong>{{ p.payerName }}</strong></td>
                <td>{{ p.policyNumber }}</td>
                <td>{{ patientName(p.patient) }}</td>
                <td>₹{{ p.coverageAmount }}</td>
                <td>{{ p.validTo ? (p.validTo | date:'mediumDate') : '-' }}</td>
                <td style="white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" *ngIf="canWrite()" [routerLink]="['/insurance/policies', p._id, 'edit']">
                    <i class="fa-solid fa-pen"></i> Edit
                  </a>
                  <button class="btn btn-danger btn-sm" *ngIf="auth.hasRole('admin')" (click)="removePolicy(p)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Claims -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Recent Claims</div>
          <a class="btn btn-ghost btn-sm" *ngIf="canWrite()" routerLink="/insurance/claims/new">
            <i class="fa-solid fa-plus"></i> New Claim
          </a>
        </div>
        <div class="empty-state" *ngIf="claims.length === 0">
          <i class="fa-solid fa-file-medical"></i>
          <p>No claims yet.</p>
        </div>
        <div class="table-wrap" *ngIf="claims.length > 0">
          <table>
            <thead><tr><th>Claim #</th><th>Patient</th><th>Provider</th><th>Claimed</th><th>Approved</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let c of claims">
                <td><strong>{{ c.claimNumber }}</strong></td>
                <td>{{ patientName(c.patient) }}</td>
                <td>{{ payerName(c.policy) }}</td>
                <td>₹{{ c.amountClaimed }}</td>
                <td>₹{{ c.amountApproved }}</td>
                <td><span class="badge" [class]="'badge ' + claimBadge(c.status)">{{ c.status }}</span></td>
                <td style="white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" *ngIf="canWrite()" [routerLink]="['/insurance/claims', c._id, 'edit']">
                    <i class="fa-solid fa-pen"></i> Edit
                  </a>
                  <button class="btn btn-danger btn-sm" *ngIf="auth.hasRole('admin')" (click)="removeClaim(c)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InsuranceComponent implements OnInit {
  policies: InsurancePolicy[] = [];
  claims: Claim[] = [];
  error = '';

  constructor(private insurance: InsuranceService, public auth: AuthService) {}

  ngOnInit(): void {
    this.insurance.getPolicies().subscribe({
      next: (list) => this.policies = list,
      error: (err) => this.error = err?.error?.message || 'Could not load policies'
    });
    this.insurance.getClaims().subscribe({
      next: (list) => this.claims = list,
      error: (err) => this.error = err?.error?.message || 'Could not load claims'
    });
  }

  patientName(p: string | Patient): string {
    if (!p) return '(Deleted Patient)';
    return typeof p === 'object' ? (p as Patient).name : p;
  }
  payerName(p: string | PolicyRef): string {
    return typeof p === 'object' ? (p as PolicyRef).payerName || '-' : p;
  }

  claimBg(status?: string): string {
    if (status === 'approved' || status === 'paid') return '#0d9488';
    if (status === 'rejected') return '#dc2626';
    if (status === 'submitted') return '#2563eb';
    return '#64748b';
  }

  // Maps a claim status to a design-system badge class.
  claimBadge(status?: string): string {
    if (status === 'approved' || status === 'paid') return 'badge-success';
    if (status === 'rejected') return 'badge-danger';
    if (status === 'submitted') return 'badge-info';
    return 'badge-warning';
  }

  canWrite(): boolean {
    return this.auth.hasRole('admin', 'staff');
  }

  removePolicy(p: InsurancePolicy): void {
    if (!p._id || !confirm('Delete this policy?')) return;
    this.insurance.deletePolicy(p._id).subscribe({
      next: () => this.policies = this.policies.filter((x) => x._id !== p._id),
      error: (err) => this.error = err?.error?.message || 'Could not delete policy'
    });
  }
  removeClaim(c: Claim): void {
    if (!c._id || !confirm('Delete this claim?')) return;
    this.insurance.deleteClaim(c._id).subscribe({
      next: () => this.claims = this.claims.filter((x) => x._id !== c._id),
      error: (err) => this.error = err?.error?.message || 'Could not delete claim'
    });
  }
}
