import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConsultationService } from '../../services/consultation.service';
import { AuthService } from '../../services/auth.service';
import { Consultation } from '../../models/consultation.model';

// Shared teleconsultation video room — embeds a Jitsi Meet room so both the
// patient and the doctor join the same call by opening this consultation.
@Component({
  selector: 'app-video-room',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="height:100vh; display:flex; flex-direction:column;">
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 16px; background:var(--primary); color:#fff;">
        <div><b>🏥 HealthBridge Consultation</b> <span *ngIf="reason" style="opacity:0.85;">— {{ reason }}</span></div>
        <button class="btn" style="background:#fff; color:var(--primary-dark);" (click)="leave()">End / Leave</button>
      </div>

      <div class="alert alert-error" *ngIf="error" style="margin:16px;">{{ error }}</div>

      <iframe *ngIf="safeUrl"
        [src]="safeUrl"
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        style="flex:1; width:100%; border:0;"></iframe>
    </div>
  `
})
export class VideoRoomComponent implements OnInit {
  safeUrl: SafeResourceUrl | null = null;
  reason = '';
  error = '';
  private id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultations: ConsultationService,
    private auth: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) return;

    this.consultations.getOne(this.id).subscribe({
      next: (c) => this.openRoom(c),
      error: (err) => this.error = err?.error?.message || 'Could not open consultation'
    });
  }

  private openRoom(c: Consultation): void {
    this.reason = c.reason || '';
    const name = encodeURIComponent(this.auth.currentUser()?.name || 'Guest');
    // Jitsi Meet public instance — same roomId means same call for both participants
    const url = `https://meet.jit.si/${c.roomId}#userInfo.displayName=%22${name}%22&config.prejoinPageEnabled=false`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    // Mark the call as in progress when someone joins
    if (c.status === 'requested' && c._id) {
      this.consultations.setStatus(c._id, 'in_progress').subscribe({ error: () => {} });
    }
  }

  leave(): void {
    // Patients return to their portal; providers to the consultations list
    this.router.navigate([this.auth.hasRole('patient') ? '/portal/consult' : '/consultations']);
  }
}
