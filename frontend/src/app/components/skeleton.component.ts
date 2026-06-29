import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Reusable shimmer placeholder shown while data loads, instead of a spinner.
// Usage: <app-skeleton *ngIf="loading"></app-skeleton>            (table, default)
//        <app-skeleton *ngIf="loading" type="cards"></app-skeleton>
//        <app-skeleton *ngIf="loading" type="list" [rows]="4"></app-skeleton>
@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- TABLE: rows mimicking a data table (avatar + text + status + value) -->
    <div class="sk-table" *ngIf="type === 'table'">
      <div class="sk-row" *ngFor="let r of range(rows)">
        <div class="sk sk-avatar"></div>
        <div class="sk-lines">
          <div class="sk sk-line w60"></div>
          <div class="sk sk-line w35"></div>
        </div>
        <div class="sk sk-pill"></div>
        <div class="sk sk-line w15"></div>
      </div>
    </div>

    <!-- CARDS: stat / catalog grid -->
    <div class="sk-grid" *ngIf="type === 'cards'">
      <div class="sk-card" *ngFor="let c of range(rows)">
        <div class="sk sk-icon"></div>
        <div class="sk sk-line w50"></div>
        <div class="sk sk-line w80"></div>
      </div>
    </div>

    <!-- LIST: simple stacked blocks -->
    <div class="sk-list" *ngIf="type === 'list'">
      <div class="sk sk-block" *ngFor="let b of range(rows)"></div>
    </div>
  `,
  styles: [`
    /* Base shimmer block */
    .sk {
      position: relative;
      overflow: hidden;
      background: #e7ecf3;
      border-radius: 8px;
    }
    .sk::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent);
      animation: sk-shimmer 1.3s ease-in-out infinite;
    }
    @keyframes sk-shimmer { 100% { transform: translateX(100%); } }

    /* Line / shape primitives */
    .sk-line { height: 12px; }
    .w15 { width: 15%; } .w35 { width: 35%; } .w40 { width: 40%; }
    .w50 { width: 50%; } .w60 { width: 60%; } .w80 { width: 80%; }
    .sk-avatar { width: 40px; height: 40px; border-radius: 50%; flex: 0 0 40px; }
    .sk-pill { width: 80px; height: 22px; border-radius: 999px; flex: 0 0 80px; }
    .sk-icon { width: 44px; height: 44px; border-radius: 12px; margin-bottom: 14px; }
    .sk-block { height: 64px; border-radius: 12px; }

    /* TABLE layout */
    .sk-table { padding: 4px 0; }
    .sk-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 8px;
      border-bottom: 1px solid #eef1f6;
    }
    .sk-row:last-child { border-bottom: none; }
    .sk-lines { flex: 1; display: flex; flex-direction: column; gap: 8px; }

    /* CARDS layout */
    .sk-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .sk-card {
      padding: 20px;
      border: 1px solid #eef1f6;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* LIST layout */
    .sk-list { display: flex; flex-direction: column; gap: 12px; }
  `]
})
export class SkeletonComponent {
  @Input() type: 'table' | 'cards' | 'list' = 'table';
  @Input() rows = 6;

  range(n: number): unknown[] {
    return Array.from({ length: n });
  }
}
