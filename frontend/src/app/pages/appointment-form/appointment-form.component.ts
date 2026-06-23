import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { UserService } from '../../services/user.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

// One form for both booking and editing an appointment
@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>{{ isEdit ? 'Edit Appointment' : 'Book Appointment' }}</h1>
          <p>{{ isEdit ? 'Update appointment details' : 'Schedule a new appointment for a patient' }}</p>
        </div>
      </div>

      <div class="card">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Patient *</label>
              <select class="form-control" formControlName="patient">
                <option value="">-- Select patient --</option>
                <option *ngFor="let p of patients" [value]="p._id">{{ p.name }} ({{ p.phone }})</option>
              </select>
              <div class="field-error" *ngIf="invalid('patient')">Patient required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Doctor *</label>
              <select class="form-control" formControlName="doctor">
                <option value="">-- Select doctor --</option>
                <option *ngFor="let d of doctors" [value]="d.id">{{ d.name }} ({{ d.role }})</option>
              </select>
              <div class="field-error" *ngIf="invalid('doctor')">Doctor required</div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Date &amp; Time *</label>
              <input class="form-control" type="datetime-local" formControlName="date" />
              <div class="field-error" *ngIf="invalid('date')">Date required</div>
            </div>
            <div class="form-group" *ngIf="isEdit">
              <label class="form-label">Status</label>
              <select class="form-control" formControlName="status">
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Reason *</label>
            <input class="form-control" type="text" formControlName="reason" placeholder="e.g. Fever checkup" />
            <div class="field-error" *ngIf="invalid('reason')">Reason required</div>
          </div>

          <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea class="form-control" rows="2" formControlName="notes"></textarea>
          </div>

          <div style="display:flex; gap:10px; margin-top:8px;">
            <button class="btn btn-primary" type="submit" [disabled]="loading">
              <i class="fa-solid" [class.fa-spinner]="loading" [class.fa-spin]="loading" [class.fa-floppy-disk]="!loading"></i>
              {{ loading ? 'Saving...' : (isEdit ? 'Update Appointment' : 'Book Appointment') }}
            </button>
            <a class="btn btn-ghost" routerLink="/appointments"><i class="fa-solid fa-xmark"></i> Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AppointmentFormComponent implements OnInit {
  isEdit = false;
  id: string | null = null;
  loading = false;
  error = '';
  patients: Patient[] = [];
  doctors: User[] = [];

  form = this.fb.group({
    patient: ['', Validators.required],
    doctor: ['', Validators.required],
    date: ['', Validators.required],
    reason: ['', Validators.required],
    notes: [''],
    status: ['scheduled']
  });

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load dropdown data
    this.patientService.getAll().subscribe({ next: (list) => this.patients = list });
    // Doctors and admins can be assigned as the appointment's doctor
    this.userService.getAll('doctor').subscribe({ next: (list) => this.doctors = list });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.appointmentService.getOne(this.id).subscribe({
        next: (a) => { this.patchForm(a); this.loading = false; },
        error: (err) => { this.error = err?.error?.message || 'Could not load appointment'; this.loading = false; }
      });
    }
  }

  // Fill the form, converting populated objects to their ids.
  // Guard against null (patient was deleted → populated field is null).
  private patchForm(a: Appointment): void {
    const p = a.patient;
    const d = a.doctor;
    const patientId: string = p && typeof p === 'object' ? ((p as Patient)._id || '') : (a.patient as string || '');
    const doctorId: string = d && typeof d === 'object' ? ((d as User).id || '') : (a.doctor as string || '');
    this.form.patchValue({
      patient: patientId,
      doctor: doctorId,
      date: this.toLocalInput(a.date),
      reason: a.reason,
      notes: a.notes || '',
      status: a.status || 'scheduled'
    });
  }

  // Convert an ISO date to the "yyyy-MM-ddThh:mm" format the input expects
  private toLocalInput(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
    const data = this.form.getRawValue() as unknown as Appointment;

    const req = this.isEdit && this.id
      ? this.appointmentService.update(this.id, data)
      : this.appointmentService.create(data);

    req.subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: (err) => {
        this.error = err?.error?.message || 'Could not save appointment';
        this.loading = false;
      }
    });
  }
}
