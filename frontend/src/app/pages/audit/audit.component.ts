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
      <div class="page-header"><h2>Audit Logs</h2></div>

      <div class="card">
        <div style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:16px;">
          <div class="form-group" style="margin:0; min-width:160px;">
            <label>Entity</label>
            <select class="form-control" [(ngModel)]="entity" (ngModelChange)="load()">
              <option value="">All</option>
              <option *ngFor="let e of entities" [value]="e">{{ e }}</option>
            </select>
          </div>
          <div class="form-group" style="margin:0; min-width:160px;">
            <label>Action</label>
            <select class="form-control" [(ngModel)]="action" (ngModelChange)="load()">
              <option value="">All</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
          </div>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="empty" *ngIf="loading">Loading...</div>
        <div class="empty" *ngIf="!loading && logs.length === 0">No audit entries found.</div>

        <div class="table-wrap" *ngIf="!loading && logs.length > 0">
          <table>
            <thead>
              <tr><th>When</th><th>Actor</th><th>Action</th><th>Entity</th><th>Target ID</th><th>Method</th><th>IP</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of logs">
                <td>{{ log.at | date:'medium' }}</td>
                <td>{{ log.actor.name }} <span class="badge">{{ log.actor.role }}</span></td>
                <td><span class="badge" [style.background]="actionBg(log.action)" [style.color]="'#fff'">{{ log.action }}</span></td>
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
}
