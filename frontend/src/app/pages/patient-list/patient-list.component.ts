import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Patients</h2>
        <a class="btn btn-primary" routerLink="/patients/new">+ Onboard Patient</a>
      </div>

      <div class="card">
        <div class="form-group" style="margin-bottom:16px;">
          <input
            class="form-control"
            type="text"
            placeholder="Search by name or phone..."
            [(ngModel)]="search"
            (ngModelChange)="search$.next($event)"
          />
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="empty" *ngIf="!loading && patients.length === 0">
          No patients found. Click <strong>Onboard Patient</strong> to add one.
        </div>

        <div class="empty" *ngIf="loading">Loading...</div>

        <div class="table-wrap" *ngIf="!loading && patients.length > 0">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Blood</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of patients">
                <td><strong>{{ p.name }}</strong></td>
                <td>{{ p.age }}</td>
                <td>{{ p.gender }}</td>
                <td>{{ p.phone }}</td>
                <td><span class="badge">{{ p.bloodGroup }}</span></td>
                <td style="text-align:right; white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" [routerLink]="['/patients', p._id, 'edit']">Edit</a>
                  <button class="btn btn-danger btn-sm" *ngIf="auth.hasRole('admin')" (click)="remove(p)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  error = '';
  search = '';
  search$ = new Subject<string>();

  constructor(private patientService: PatientService, public auth: AuthService) {}

  ngOnInit(): void {
    // search box -> debounce -> API call (avoid firing a request on every keystroke)
    this.search$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((term) => {
          this.loading = true;
          return this.patientService.getAll(term);
        })
      )
      .subscribe({
        next: (list) => { this.patients = list; this.loading = false; },
        error: (err) => { this.error = err?.error?.message || 'Could not load patients'; this.loading = false; }
      });

    this.load();
  }

  load(): void {
    this.loading = true;
    this.patientService.getAll(this.search).subscribe({
      next: (list) => { this.patients = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load patients'; this.loading = false; }
    });
  }

  remove(p: Patient): void {
    if (!p._id) return;
    if (!confirm(`Delete patient "${p.name}"?`)) return;

    this.patientService.delete(p._id).subscribe({
      next: () => this.patients = this.patients.filter((x) => x._id !== p._id),
      error: (err) => this.error = err?.error?.message || 'Could not delete patient'
    });
  }
}
