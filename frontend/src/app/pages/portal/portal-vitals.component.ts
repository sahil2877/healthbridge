import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HEALTH_TRACKERS } from '../../data/catalog';
import { HealthScoreService, HealthScore } from '../../services/health-score.service';

interface TrackerEntry { key: string; title: string; emoji: string; unit: string; value: string; saved: string; }

// Patient portal "My Health" — log and view health trackers. Logged vitals are
// persisted (per-user) and drive the computed HealthScore shown here and on Home.
@Component({
  selector: 'app-portal-vitals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="page-title">
          <h1>My Health Dashboard</h1>
          <p>AI-powered insights into your wellbeing.</p>
        </div>
      </div>

      <div class="grid-2">
        <!-- Health score widget -->
        <div class="health-score-widget">
          <div class="score-ring" [style.background]="ringStyle" style="margin:0 auto 14px;">
            <span>{{ score.score !== null ? score.score : '—' }}</span>
          </div>
          <h4 style="font-size:16px;font-weight:600;position:relative;z-index:1;">HealthScore: {{ score.label || '—' }}</h4>
          <p style="font-size:12px;opacity:0.9;margin-top:4px;position:relative;z-index:1;">{{ score.message }}</p>
        </div>

        <!-- Latest vitals -->
        <div class="card">
          <div class="card-header"><div class="card-title">Latest vitals</div></div>
          <div class="vitals-grid" style="margin:0;">
            <div class="vital-card" *ngFor="let t of trackers">
              <div class="vital-icon" [style.background]="'var(--gradient-1)'" style="font-size:18px;">{{ t.emoji }}</div>
              <h4>{{ t.saved || '—' }} <small>{{ t.saved ? t.unit : '' }}</small></h4>
              <p>{{ t.title }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="portal-h">Health Trackers</div>
      <div class="grid-3">
        <div class="tracker" *ngFor="let t of trackers">
          <div class="head">
            <div class="emoji">{{ t.emoji }}</div>
            <div class="t">
              {{ t.title }}
              <div style="font-weight:400; color:var(--muted); font-size:0.82rem;" *ngIf="t.saved">
                Last: {{ t.saved }} {{ t.unit }}
              </div>
            </div>
          </div>
          <div class="controls">
            <input class="form-control log-input" [(ngModel)]="t.value"
                   (keyup.enter)="save(t)" placeholder="Enter {{ t.unit || 'value' }}" />
            <span class="plus" title="Save" (click)="save(t)">＋</span>
          </div>
        </div>
      </div>

      <div class="alert alert-success" *ngIf="saved" style="margin-top:14px;">
        <i class="fa-solid fa-circle-check"></i> Saved. Your HealthScore has been updated.
      </div>

      <p style="color:var(--muted); font-size:0.85rem; margin-top:16px;">
        Tip: enter blood pressure as <b>120/80</b>. Logged vitals are shared with your doctor during consultations.
      </p>
    </div>
  `
})
export class PortalVitalsComponent implements OnInit {
  trackers: TrackerEntry[] = [];
  score: HealthScore = { score: null, label: '', message: '', factors: [] };
  saved = false;

  constructor(private health: HealthScoreService) {}

  ngOnInit(): void {
    const stored = this.health.getVitals();
    this.trackers = HEALTH_TRACKERS.map((t) => ({ ...t, value: stored[t.key] || '', saved: stored[t.key] || '' }));
    this.recompute();
  }

  save(t: TrackerEntry): void {
    this.health.setVital(t.key, t.value);
    t.saved = (t.value || '').trim();
    this.recompute();
    this.saved = true;
  }

  private recompute(): void {
    this.score = this.health.compute();
  }

  // Fill the score ring proportionally to the score (falls back to empty).
  get ringStyle(): string {
    const pct = this.score.score ?? 0;
    return `conic-gradient(var(--primary) 0 ${pct}%, #e2e8f0 ${pct}% 100%)`;
  }
}
