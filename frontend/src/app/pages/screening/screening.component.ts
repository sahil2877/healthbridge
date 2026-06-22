import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScreeningService } from '../../services/screening.service';
import { PatientService } from '../../services/patient.service';
import { Screening } from '../../models/screening.model';
import { Patient } from '../../models/patient.model';

// Health screening: enter vitals, the backend computes BMI / risk / recommendations
@Component({
  selector: 'app-screening',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Health Screening</h1>
          <p>Predictive risk assessment from patient vitals.</p>
        </div>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <div class="grid-2">
        <!-- Questionnaire -->
        <div class="card">
          <div class="card-header"><div class="card-title">Patient Vitals & Lifestyle</div></div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="form-group">
              <label class="form-label">Patient *</label>
              <select class="form-control" formControlName="patient">
                <option value="">-- Select patient --</option>
                <option *ngFor="let p of patients" [value]="p._id">{{ p.name }} ({{ p.phone }})</option>
              </select>
              <div class="field-error" *ngIf="invalid('patient')">Patient required</div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Height (cm) *</label>
                <input class="form-control" type="number" formControlName="heightCm" />
                <div class="field-error" *ngIf="invalid('heightCm')">Valid height required</div>
              </div>
              <div class="form-group">
                <label class="form-label">Weight (kg) *</label>
                <input class="form-control" type="number" formControlName="weightKg" />
                <div class="field-error" *ngIf="invalid('weightKg')">Valid weight required</div>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Systolic BP (upper)</label>
                <input class="form-control" type="number" formControlName="systolic" />
              </div>
              <div class="form-group">
                <label class="form-label">Diastolic BP (lower)</label>
                <input class="form-control" type="number" formControlName="diastolic" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group" style="display:flex; align-items:center; gap:8px;">
                <input type="checkbox" formControlName="smoker" id="smoker" style="width:auto;" />
                <label for="smoker" class="form-label" style="margin:0;">Smoker</label>
              </div>
              <div class="form-group" style="display:flex; align-items:center; gap:8px;">
                <input type="checkbox" formControlName="diabetic" id="diabetic" style="width:auto;" />
                <label for="diabetic" class="form-label" style="margin:0;">Diabetic</label>
              </div>
            </div>

            <button class="btn btn-primary" style="width:100%;" type="submit" [disabled]="loading">
              <i class="fa-solid" [class.fa-spinner]="loading" [class.fa-spin]="loading" [class.fa-wand-magic-sparkles]="!loading"></i>
              {{ loading ? 'Calculating...' : 'Run Screening' }}
            </button>
          </form>
        </div>

        <!-- Result of the most recent screening -->
        <div class="card">
          <div class="card-header"><div class="card-title">Screening Result</div></div>

          <div class="risk-result low show" *ngIf="!result">
            <div class="risk-icon"><i class="fa-solid fa-heart-pulse"></i></div>
            <h3>Awaiting Input</h3>
            <p style="font-size:13px; color:var(--muted); margin-top:6px;">Complete the form and run screening to view the risk assessment.</p>
          </div>

          <div *ngIf="result">
            <div class="risk-result show" [class]="'risk-result show ' + riskClass(result.riskLevel)">
              <div class="risk-icon"><i class="fa-solid fa-heart-pulse"></i></div>
              <h3>{{ result.riskLevel }} Risk</h3>
              <div class="score">{{ result.riskScore }}</div>
              <p style="font-size:13px; color:var(--muted);">
                BMI {{ result.bmi }} <span class="badge badge-info">{{ result.bmiCategory }}</span>
              </p>
            </div>
            <div style="margin-top:16px;">
              <div class="card-title" style="margin-bottom:8px;">Recommendations</div>
              <ul style="margin:0; padding-left:18px; color:var(--muted); font-size:13px;">
                <li *ngFor="let rec of result.recommendations" style="margin-bottom:4px;">{{ rec }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Past screenings -->
      <div class="card" style="margin-top:18px;">
        <div class="card-header"><div class="card-title">Screening History</div></div>
        <div class="empty-state" *ngIf="history.length === 0">
          <i class="fa-solid fa-clipboard-list"></i>
          <p>No screenings yet.</p>
        </div>
        <div class="table-wrap" *ngIf="history.length > 0">
          <table>
            <thead>
              <tr><th>Patient</th><th>Date</th><th>BMI</th><th>Category</th><th>Risk</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of history">
                <td>{{ patientName(s) }}</td>
                <td>{{ s.createdAt | date:'mediumDate' }}</td>
                <td>{{ s.bmi }}</td>
                <td>{{ s.bmiCategory }}</td>
                <td><span class="badge" [class]="'badge ' + riskBadge(s.riskLevel)">{{ s.riskLevel }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ScreeningComponent implements OnInit {
  patients: Patient[] = [];
  history: Screening[] = [];
  result: Screening | null = null;
  loading = false;
  error = '';

  form = this.fb.group({
    patient: ['', Validators.required],
    heightCm: [null as number | null, [Validators.required, Validators.min(30)]],
    weightKg: [null as number | null, [Validators.required, Validators.min(1)]],
    systolic: [null as number | null],
    diastolic: [null as number | null],
    smoker: [false],
    diabetic: [false]
  });

  constructor(
    private fb: FormBuilder,
    private screeningService: ScreeningService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patientService.getAll().subscribe({ next: (list) => this.patients = list });
    this.loadHistory();
  }

  loadHistory(): void {
    this.screeningService.getAll().subscribe({
      next: (list) => this.history = list,
      error: (err) => this.error = err?.error?.message || 'Could not load history'
    });
  }

  patientName(s: Screening): string {
    return typeof s.patient === 'object' ? (s.patient as Patient).name : s.patient;
  }

  riskBg(level?: string): string {
    if (level === 'High') return '#dc2626';
    if (level === 'Medium') return '#d97706';
    return '#0d9488';
  }

  // Modifier for the .risk-result panel (low/medium/high).
  riskClass(level?: string): string {
    if (level === 'High') return 'high';
    if (level === 'Medium') return 'medium';
    return 'low';
  }

  // Design-system badge class for a risk level.
  riskBadge(level?: string): string {
    if (level === 'High') return 'badge-danger';
    if (level === 'Medium') return 'badge-warning';
    return 'badge-success';
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
    const data = this.form.getRawValue() as unknown as Screening;

    this.screeningService.create(data).subscribe({
      next: (saved) => {
        this.result = saved;
        this.history = [saved, ...this.history];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Could not run screening';
        this.loading = false;
      }
    });
  }
}
