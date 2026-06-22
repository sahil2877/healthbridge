import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../services/audit.service';
import { AuditLog } from '../../models/audit.model';

// Admin audit explorer — read-only view of the action trail.
@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>Audit Logs</h1>
          <p>System activity tracking and compliance.</p>
        </div>
      </div>

      <div class="card">
        <div class="filter-bar">
          <select class="form-control" [(ngModel)]="entity" (ngModelChange)="load()">
            <option value="">All Entities</option>
            <option *ngFor="let e of entities" [value]="e">{{ e }}</option>
          </select>
          <select class="form-control" [(ngModel)]="action" (ngModelChange)="load()">
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="empty-state" *ngIf="loading">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Loading audit logs...</p>
        </div>
        <div class="empty-state" *ngIf="!loading && logs.length === 0">
          <i class="fa-solid fa-clipboard-list"></i>
          <p>No audit entries found.</p>
        </div>

        <div class="table-wrap" *ngIf="!loading && logs.length > 0">
          <table>
            <thead>
              <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Target ID</th><th>Method</th><th>IP Address</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of logs">
                <td>{{ log.at | date:'medium' }}</td>
                <td>
                  <div class="patient-cell">
                    <div class="avatar">{{ initials(log.actor.name) }}</div>
                    <div class="patient-cell-info">
                      <p>{{ log.actor.name }}</p>
                      <small>{{ log.actor.role }}</small>
                    </div>
                  </div>
                </td>
                <td><span class="badge" [ngClass]="actionBadge(log.action)">{{ log.action }}</span></td>
                <td>{{ log.entity }}</td>
                <td style="font-family:monospace; font-size:0.8rem;">{{ log.entityId || '-' }}</td>
                <td>{{ log.method }} <span style="color:var(--muted);">({{ log.statusCode }})</span></td>
                <td style="font-family:monospace; font-size:0.8rem;">{{ log.ip }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AuditComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = false;
  error = '';
  entity = '';
  action = '';
  entities = ['patients', 'appointments', 'records', 'prescriptions', 'invoices', 'screening', 'users'];

  constructor(private auditService: AuditService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.auditService.getAll(this.entity, this.action).subscribe({
      next: (list) => { this.logs = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Could not load audit logs'; this.loading = false; }
    });
  }

  actionBg(action: string): string {
    if (action === 'delete') return '#dc2626';
    if (action === 'update') return '#d97706';
    return '#0d9488';
  }

  // Map an audit action to a design-system badge class.
  actionBadge(action: string): string {
    if (action === 'delete') return 'badge-danger';
    if (action === 'update') return 'badge-warning';
    return 'badge-success';
  }

  // First two initials for the actor avatar chip.
  initials(name: string | undefined): string {
    return (name || '?').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
