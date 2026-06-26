import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { PatientService } from '../../services/patient.service';
import { UserService } from '../../services/user.service';
import { ClinicalRecord, RecordDocument } from '../../models/record.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

// One form for creating a record and (in edit mode) uploading documents
@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>{{ isEdit ? 'Edit Record' : 'New Clinical Record' }}</h1>
          <p>{{ isEdit ? 'Update the clinical record and manage documents' : 'Capture a new clinical encounter' }}</p>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
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

          <div class="form-group">
            <label class="form-label">Diagnosis *</label>
            <input class="form-control" type="text" formControlName="diagnosis" />
            <div class="field-error" *ngIf="invalid('diagnosis')">Diagnosis required</div>
          </div>

          <div class="form-group">
            <label class="form-label">Prescription</label>
            <textarea class="form-control" rows="2" formControlName="prescription"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea class="form-control" rows="2" formControlName="notes"></textarea>
          </div>

          <div style="display:flex; gap:10px; margin-top:8px;">
            <button class="btn btn-primary" type="submit" [disabled]="loading">
              <i class="fa-solid" [class.fa-spinner]="loading" [class.fa-spin]="loading" [class.fa-floppy-disk]="!loading"></i>
              {{ loading ? 'Saving...' : (isEdit ? 'Update Record' : 'Create Record') }}
            </button>
            <a class="btn btn-ghost" routerLink="/records"><i class="fa-solid fa-xmark"></i> Cancel</a>
          </div>
        </form>
      </div>

      <!-- Document upload is only available once the record exists (edit mode) -->
      <div class="card" *ngIf="isEdit">
        <h3 style="margin-top:0;">Documents</h3>

        <ul *ngIf="documents.length" style="padding-left:18px;">
          <li *ngFor="let d of documents">
            <a [href]="fileUrl(d.url)" target="_blank">{{ d.originalName }}</a>
          </li>
        </ul>
        <div class="empty-state" *ngIf="!documents.length">
          <i class="fa-solid fa-folder-open"></i>
          <p>No documents uploaded yet.</p>
        </div>

        <div class="alert alert-error" *ngIf="uploadError">{{ uploadError }}</div>
        <div class="form-group">
          <label class="form-label">Upload files (pdf / image / doc — max 5, up to 5 MB each)</label>
          <input class="form-control" type="file" multiple (change)="onFileChange($event)" />
        </div>
        <button class="btn btn-primary" [disabled]="uploading || selectedFiles.length === 0" (click)="upload()">
          <i class="fa-solid" [class.fa-spinner]="uploading" [class.fa-spin]="uploading" [class.fa-upload]="!uploading"></i>
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
    </div>
  `
})
export class RecordFormComponent implements OnInit {
  isEdit = false;
  id: string | null = null;
  loading = false;
  error = '';
  patients: Patient[] = [];
  doctors: User[] = [];

  documents: RecordDocument[] = [];
  selectedFiles: File[] = [];
  uploading = false;
  uploadError = '';

  form = this.fb.group({
    patient: ['', Validators.required],
    doctor: ['', Validators.required],
    diagnosis: ['', Validators.required],
    prescription: [''],
    notes: ['']
  });

  constructor(
    private fb: FormBuilder,
    private recordService: RecordService,
    private patientService: PatientService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientService.getAll().subscribe({ next: (list) => this.patients = list });
    this.userService.getAll('doctor').subscribe({ next: (list) => this.doctors = list });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.recordService.getOne(this.id).subscribe({
        next: (r) => { this.patchForm(r); this.documents = r.documents || []; this.loading = false; },
        error: (err) => { this.error = err?.error?.message || 'Could not load record'; this.loading = false; }
      });
    }
  }

  private patchForm(r: ClinicalRecord): void {
    const patientObj = r.patient as Patient | null;
    const doctorObj = r.doctor as User | null;
    const patientId: string = patientObj && typeof patientObj === 'object' ? (patientObj._id || '') : (r.patient as string || '');
    const doctorId: string = doctorObj && typeof doctorObj === 'object' ? (doctorObj.id || '') : (r.doctor as string || '');
    this.form.patchValue({
      patient: patientId,
      doctor: doctorId,
      diagnosis: r.diagnosis,
      prescription: r.prescription || '',
      notes: r.notes || ''
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
    const data = this.form.getRawValue() as unknown as ClinicalRecord;

    const req = this.isEdit && this.id
      ? this.recordService.update(this.id, data)
      : this.recordService.create(data);

    req.subscribe({
      next: (saved) => {
        // After creating, jump into edit mode so documents can be uploaded
        if (!this.isEdit && saved._id) {
          this.router.navigate(['/records', saved._id, 'edit']);
        } else {
          this.router.navigate(['/records']);
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Could not save record';
        this.loading = false;
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files ? Array.from(input.files) : [];
  }

  fileUrl(url: string): string {
    return `${environment.apiBase}${url}`;
  }

  upload(): void {
    if (!this.id || this.selectedFiles.length === 0) return;
    this.uploading = true;
    this.uploadError = '';
    this.recordService.uploadDocuments(this.id, this.selectedFiles).subscribe({
      next: (r) => {
        this.documents = r.documents || [];
        this.selectedFiles = [];
        this.uploading = false;
      },
      error: (err) => {
        this.uploadError = err?.error?.message || 'Upload failed';
        this.uploading = false;
      }
    });
  }
}
