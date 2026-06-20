import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HEALTH_TRACKERS } from '../../data/catalog';

interface TrackerEntry { key: string; title: string; emoji: string; unit: string; value: string; }

// Patient portal "My Health" — log and view health trackers (client-side demo store).
@Component({
  selector: 'app-portal-vitals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header"><h2>My Health</h2></div>

      <!-- Health score summary -->
      <div class="score-card" style="margin-bottom:24px;">
        <div class="score-ring"><span>72</span></div>
        <div style="flex:1; min-width:200px;">
          <div style="font-weight:700;">HealthScore: Good</div>
          <div style="color:var(--muted); font-size:0.9rem;">Keep logging your vitals to improve accuracy.</div>
        </div>
      </div>

      <div class="portal-h">Health Trackers</div>
      <div class="grid grid-3">
        <div class="tracker" *ngFor="let t of trackers">
          <div class="emoji">{{ t.emoji }}</div>
          <div class="t">
            {{ t.title }}
            <div style="font-weight:400; color:var(--muted); font-size:0.82rem;" *ngIf="t.value">
              Last: {{ t.value }} {{ t.unit }}
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <input class="form-control" style="width:90px; padding:6px 8px;" [(ngModel)]="t.value"
                   placeholder="Log" />
            <span class="plus" title="Save">＋</span>
          </div>
        </div>
      </div>

      <p style="color:var(--muted); font-size:0.85rem; margin-top:16px;">
        Tip: logged vitals are shared with your doctor during consultations.
      </p>
    </div>
  `
})
export class PortalVitalsComponent {
  trackers: TrackerEntry[] = HEALTH_TRACKERS.map((t) => ({ ...t, value: '' }));
}
