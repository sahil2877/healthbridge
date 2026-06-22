import { Injectable, signal } from '@angular/core';

// Light/dark theme toggle, persisted to localStorage and applied to <html data-theme>.
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'hb_theme';
  theme = signal<'light' | 'dark'>(this.read());

  constructor() {
    this.apply(this.theme());
  }

  toggle(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem(this.key, next);
    this.apply(next);
  }

  private apply(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private read(): 'light' | 'dark' {
    return localStorage.getItem(this.key) === 'dark' ? 'dark' : 'light';
  }
}
