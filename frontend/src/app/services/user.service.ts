import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  // GET /api/users (optional ?role=doctor) -> used to populate doctor dropdowns
  getAll(role = ''): Observable<User[]> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    return this.http.get<User[]>(this.api, { params });
  }
}
