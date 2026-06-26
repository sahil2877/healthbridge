import { environment } from '../../environments/environment';
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiBase}/api/auth`;
  private tokenKey = 'hb_token';
  private userKey = 'hb_user';

  // Keep the current user in a signal so the navbar stays reactive
  currentUser = signal<User | null>(this.readUser());

  constructor(private http: HttpClient) {}

  // POST /api/auth/register
  // Patient signups also send age/gender/phone/bloodGroup so the backend can
  // create their clinical record in one shot.
  register(data: {
    name: string; email: string; password: string; role: string;
    age?: number | null; gender?: string; phone?: string; bloodGroup?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, data).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  // POST /api/auth/login
  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, data).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  // logout -> clear localStorage
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // True if the current user's role is one of the given roles (for UI gating)
  hasRole(...roles: string[]): boolean {
    const user = this.currentUser();
    return !!user && roles.includes(user.role);
  }

  // Store the token and user in localStorage
  private saveSession(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private readUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
