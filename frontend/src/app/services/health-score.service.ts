import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

// One logged vital reading (the raw text the user typed for a tracker).
export type VitalsMap = Record<string, string>;

export interface HealthScore {
  score: number | null;   // 0-100, or null when nothing has been logged yet
  label: string;          // Excellent / Good / Fair / Needs attention / Not enough data
  message: string;        // human-friendly explanation
  factors: string[];      // which vitals contributed
}

// Computes a *real* HealthScore from the vitals the patient logs, and
// persists those vitals per-user in localStorage so the score is stable
// across the Home and My-Health pages and between sessions.
@Injectable({ providedIn: 'root' })
export class HealthScoreService {
  // Reactive snapshot so any component can react to changes.
  vitals = signal<VitalsMap>({});

  constructor(private auth: AuthService) {
    this.vitals.set(this.read());
  }

  private storageKey(): string {
    const id = this.auth.currentUser()?.id || this.auth.currentUser()?.email || 'guest';
    return `hb_vitals_${id}`;
  }

  private read(): VitalsMap {
    try {
      const raw = localStorage.getItem(this.storageKey());
      return raw ? (JSON.parse(raw) as VitalsMap) : {};
    } catch {
      return {};
    }
  }

  // Save/update a single tracker reading and persist.
  setVital(key: string, value: string): void {
    const next = { ...this.vitals(), [key]: (value || '').trim() };
    if (!next[key]) delete next[key]; // empty clears the reading
    localStorage.setItem(this.storageKey(), JSON.stringify(next));
    this.vitals.set(next);
  }

  getVitals(): VitalsMap {
    return this.vitals();
  }

  // ---- Scoring ---------------------------------------------------------
  // Each measurable vital yields a 0-100 sub-score; the overall score is the
  // average of the sub-scores we could actually compute. Trackers without a
  // clinical range (e.g. "medicine") are ignored.
  compute(): HealthScore {
    const v = this.vitals();
    const subs: number[] = [];
    const factors: string[] = [];

    const num = (s?: string) => {
      const n = parseFloat((s || '').replace(/[^0-9.]/g, ''));
      return isNaN(n) ? null : n;
    };

    // Step count — more is better (target 8000+).
    const steps = num(v['steps']);
    if (steps !== null) {
      subs.push(steps >= 8000 ? 100 : steps >= 5000 ? 80 : steps >= 2000 ? 60 : 35);
      factors.push('steps');
    }

    // Fasting blood sugar (mg/dL).
    const sugar = num(v['sugar']);
    if (sugar !== null) {
      subs.push(sugar >= 70 && sugar <= 99 ? 100 : sugar <= 125 ? 70 : sugar < 70 ? 60 : 40);
      factors.push('sugar');
    }

    // Blood pressure — typed as "120/80".
    if (v['bp']) {
      const parts = v['bp'].split('/').map((p) => parseFloat(p.replace(/[^0-9.]/g, '')));
      const sys = parts[0];
      const dia = parts[1];
      if (!isNaN(sys) && !isNaN(dia)) {
        let s = 40;
        if (sys < 120 && dia < 80) s = 100;
        else if (sys < 130 && dia < 85) s = 85;
        else if (sys < 140 && dia < 90) s = 65;
        subs.push(s);
        factors.push('blood pressure');
      }
    }

    // Resting heart rate (bpm) — healthy 60-100.
    const heart = num(v['heart']);
    if (heart !== null) {
      subs.push(heart >= 60 && heart <= 100 ? 100 : (heart >= 50 && heart < 60) || (heart > 100 && heart <= 110) ? 75 : 50);
      factors.push('heart rate');
    }

    if (subs.length === 0) {
      return {
        score: null,
        label: 'Not enough data',
        message: 'Log your vitals below to calculate your HealthScore.',
        factors: []
      };
    }

    const score = Math.round(subs.reduce((a, b) => a + b, 0) / subs.length);
    let label: string;
    let message: string;
    if (score >= 85) {
      label = 'Excellent';
      message = 'Your vitals are in great shape. Keep up the healthy lifestyle!';
    } else if (score >= 70) {
      label = 'Good';
      message = 'Good overall — a few small improvements can push you higher.';
    } else if (score >= 50) {
      label = 'Fair';
      message = 'Some vitals need attention. Consider a checkup and lifestyle changes.';
    } else {
      label = 'Needs attention';
      message = 'Several vitals are outside healthy ranges. Please consult a doctor.';
    }

    return { score, label, message, factors };
  }
}
