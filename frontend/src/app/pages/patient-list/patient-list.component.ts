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
        <div class="page-title">
          <h1>Patients</h1>
          <p>Manage your patient directory and records.</p>
        </div>
        <a class="btn btn-primary" routerLink="/patients/new"><i class="fa-solid fa-user-plus"></i> Onboard Patient</a>
      </div>

      <div class="card">
        <div class="filter-bar">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              class="form-control"
              type="text"
              placeholder="Search by name or phone..."
              [(ngModel)]="search"
              (ngModelChange)="search$.next($event)"
            />
          </div>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="empty-state" *ngIf="!loading && patients.length === 0">
          <i class="fa-solid fa-user-injured"></i>
          <p>No patients found. Click <strong>Onboard Patient</strong> to add one.</p>
        </div>

        <div class="empty-state" *ngIf="loading"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading...</p></div>

        <div class="table-wrap" *ngIf="!loading && patients.length > 0">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Blood</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of patients">
                <td>
                  <div class="patient-cell">
                    <div class="avatar" [style.background]="avatarBg(p.name)">{{ initials(p.name) }}</div>
                    <div class="patient-cell-info">
                      <p>{{ p.name }}</p>
                      <small>{{ p.email || p.phone }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ p.age }}</td>
                <td>{{ p.gender }}</td>
                <td>{{ p.phone }}</td>
                <td><span class="badge badge-danger">{{ p.bloodGroup }}</span></td>
                <td style="text-align:right; white-space:nowrap;">
                  <a class="btn btn-ghost btn-sm" [routerLink]="['/patients', p._id, 'edit']"><i class="fa-solid fa-pen"></i></a>
                  <button class="btn btn-danger btn-sm" *ngIf="auth.hasRole('admin')" (click)="remove(p)"><i class="fa-solid fa-trash"></i></button>
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

  initials(name: string): string {
    return (name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }
  avatarBg(name: string): string {
    const grads = ['var(--gradient-1)', 'var(--gradient-2)', 'var(--gradient-purple)', 'var(--gradient-warm)', 'var(--gradient-success)'];
    let h = 0;
    for (const c of (name || '')) h = (h + c.charCodeAt(0)) % grads.length;
    return grads[h];
  }

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
