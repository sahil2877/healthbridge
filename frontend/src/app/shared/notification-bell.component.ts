import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AppNotification } from '../models/notification.model';

// Reusable notification bell with an unread badge and a dropdown panel.
// Polls the unread count every 20 seconds.
@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="position:relative;">
      <button class="icon-btn" (click)="toggle()" title="Notifications">
        <i class="fa-solid fa-bell"></i>
        <span class="dot" *ngIf="unread > 0"></span>
      </button>

      <div class="dropdown" *ngIf="open" style="display:block;">
        <div class="dropdown-header">
          <strong>Notifications</strong>
          <span class="badge badge-primary" *ngIf="unread > 0">{{ unread }} new</span>
          <a href="javascript:void(0)" (click)="markAll()" *ngIf="unread > 0" style="font-size:11px;">Mark all read</a>
        </div>

        <div class="empty-state" *ngIf="items.length === 0" style="padding:24px;">
          <i class="fa-solid fa-bell-slash"></i>
          <p>No notifications yet.</p>
        </div>

        <div class="notif-item" *ngFor="let n of items" [class.unread]="!n.read" (click)="openItem(n)">
          <div class="notif-icon" [style.background]="iconBg(n)">
            <i class="fa-solid" [ngClass]="iconClass(n)"></i>
          </div>
          <div class="notif-content">
            <p>{{ n.title }}</p>
            <small *ngIf="n.body">{{ n.body }}</small>
            <small style="display:block;opacity:.7;">{{ n.createdAt | date:'short' }}</small>
          </div>
        </div>
      </div>

      <div *ngIf="open" (click)="open = false" style="position:fixed;inset:0;z-index:150;"></div>
    </div>
  `
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  unread = 0;
  open = false;
  items: AppNotification[] = [];
  private sub?: Subscription;

  constructor(private notifications: NotificationService, private router: Router) {}

  ngOnInit(): void {
    // Poll the unread count on a timer (immediately, then every 20s)
    this.sub = interval(20000).pipe(
      startWith(0),
      switchMap(() => this.notifications.getUnreadCount())
    ).subscribe({
      next: (res) => this.unread = res.count,
      error: () => { /* ignore (e.g. logged out) */ }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggle(): void {
    this.open = !this.open;
    if (this.open) this.loadList();
  }

  loadList(): void {
    this.notifications.getAll().subscribe({
      next: (list) => this.items = list,
      error: () => { /* ignore */ }
    });
  }

  openItem(n: AppNotification): void {
    if (!n.read && n._id) {
      this.notifications.markRead(n._id).subscribe({
        next: () => { n.read = true; this.unread = Math.max(0, this.unread - 1); }
      });
    }
    this.open = false;
    if (n.link) this.router.navigateByUrl(n.link);
  }

  markAll(): void {
    this.notifications.markAllRead().subscribe({
      next: () => { this.items.forEach((n) => n.read = true); this.unread = 0; }
    });
  }

  // Pick an icon + colour based on the notification title/type for a richer panel.
  iconClass(n: AppNotification): string {
    const t = (n.title || '').toLowerCase();
    if (t.includes('appointment')) return 'fa-calendar-check';
    if (t.includes('lab') || t.includes('result')) return 'fa-flask';
    if (t.includes('prescription')) return 'fa-prescription-bottle-medical';
    if (t.includes('insurance') || t.includes('claim')) return 'fa-shield-halved';
    if (t.includes('invoice') || t.includes('payment') || t.includes('bill')) return 'fa-credit-card';
    return 'fa-bell';
  }
  iconBg(n: AppNotification): string {
    const t = (n.title || '').toLowerCase();
    if (t.includes('appointment')) return 'var(--gradient-1)';
    if (t.includes('lab') || t.includes('result')) return 'var(--gradient-success)';
    if (t.includes('prescription')) return 'var(--gradient-purple)';
    if (t.includes('insurance') || t.includes('claim')) return 'var(--gradient-warm)';
    return 'var(--gradient-2)';
  }
}
