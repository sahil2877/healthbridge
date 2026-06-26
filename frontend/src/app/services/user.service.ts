import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

// Payload for creating a user from the admin User Management page.
export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: string;
  age?: number | null;
  gender?: string;
  phone?: string;
  bloodGroup?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.apiBase}/api/users`;

  constructor(private http: HttpClient) {}

  // GET /api/users (optional ?role=doctor) -> list (doctor dropdowns + admin page)
  getAll(role = ''): Observable<User[]> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    return this.http.get<User[]>(this.api, { params });
  }

  // GET /api/users/:id
  getOne(id: string): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  // POST /api/users -> create a new user (admin only)
  create(data: NewUser): Observable<User> {
    return this.http.post<User>(this.api, data);
  }

  // PUT /api/users/:id -> update name/email/role (admin only)
  update(id: string, data: { name: string; email: string; role: string }): Observable<User> {
    return this.http.put<User>(`${this.api}/${id}`, data);
  }

  // PUT /api/users/:id/password -> admin resets a user's password
  resetPassword(id: string, password: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/${id}/password`, { password });
  }

  // DELETE /api/users/:id (admin only; cascades for patient-role users)
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
