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
        <h2>Health Screening</h2>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Patient *</label>
            <select class="form-control" formControlName="patient">
              <option value="">-- Select patient --</option>
              <option *ngFor="let p of patients" [value]="p._id">{{ p.name }} ({{ p.phone }})</option>
            </select>
            <div class="field-error" *ngIf="invalid('patient')">Patient required</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Height (cm) *</label>
              <input class="form-control" type="number" formControlName="heightCm" />
              <div class="field-error" *ngIf="invalid('heightCm')">Valid height required</div>
            </div>
            <div class="form-group">
              <label>Weight (kg) *</label>
              <input class="form-control" type="number" formControlName="weightKg" />
              <div class="field-error" *ngIf="invalid('weightKg')">Valid weight required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Systolic BP (upper)</label>
              <input class="form-control" type="number" formControlName="systolic" />
            </div>
            <div class="form-group">
              <label>Diastolic BP (lower)</label>
              <input class="form-control" type="number" formControlName="diastolic" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group" style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" formControlName="smoker" id="smoker" style="width:auto;" />
              <label for="smoker" style="margin:0;">Smoker</label>
            </div>
            <div class="form-group" style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" formControlName="diabetic" id="diabetic" style="width:auto;" />
              <label for="diabetic" style="margin:0;">Diabetic</label>
            </div>
          </div>

          <button class="btn btn-primary" type="submit" [disabled]="loading">
            {{ loading ? 'Calculating...' : 'Run Screening' }}
          </button>
        </form>
      </div>

      <!-- Result of the most recent screening -->
      <div class="card" *ngIf="result" style="margin-bottom:16px;">
        <h3 style="margin-top:0;">Result</h3>
        <div class="form-row">
          <div><b>BMI:</b> {{ result.bmi }} <span class="badge">{{ result.bmiCategory }}</span></div>
          <div>
            <b>Risk:</b>
            <span class="badge" [style.background]="riskBg(result.riskLevel)" [style.color]="'#fff'">
              {{ result.riskLevel }}
            </span>
            (score {{ result.riskScore }})
          </div>
        </div>
        <div style="margin-top:12px;">
          <b>Recommendations:</b>
          <ul style="margin:6px 0 0; padding-left:18px;">
            <li *ngFor="let rec of result.recommendations">{{ rec }}</li>
          </ul>
        </div>
      </div>

      <!-- Past screenings -->
      <div class="card">
        <h3 style="margin-top:0;">Screening History</h3>
        <div class="empty" *ngIf="history.length === 0">No screenings yet.</div>
        <div class="table-wrap" *ngIf="history.length > 0">
          <table>
            <thead>
              <tr><th>Date</th><th>Patient</th><th>BMI</th><th>Category</th><th>Risk</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of history">
                <td>{{ s.createdAt | date:'mediumDate' }}</td>
                <td>{{ patientName(s) }}</td>
                <td>{{ s.bmi }}</td>
                <td>{{ s.bmiCategory }}</td>
                <td><span class="badge" [style.background]="riskBg(s.riskLevel)" [style.color]="'#fff'">{{ s.riskLevel }}</span></td>
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
