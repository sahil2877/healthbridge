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
    <div class="bell">
      <button class="bell-btn" (click)="toggle()" title="Notifications">
        🔔
        <span class="bell-badge" *ngIf="unread > 0">{{ unread }}</span>
      </button>

      <div class="bell-panel" *ngIf="open">
        <div class="head">
          <b>Notifications</b>
          <a href="javascript:void(0)" (click)="markAll()" *ngIf="unread > 0" style="font-size:0.8rem;">Mark all read</a>
        </div>

        <div class="bell-empty" *ngIf="items.length === 0">No notifications yet.</div>

        <div class="bell-item" *ngFor="let n of items" [class.unread]="!n.read" (click)="openItem(n)">
          <div class="t">{{ n.title }}</div>
          <div class="b" *ngIf="n.body">{{ n.body }}</div>
          <div class="when">{{ n.createdAt | date:'short' }}</div>
        </div>
      </div>
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
}
