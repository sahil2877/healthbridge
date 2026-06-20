import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog } from '../models/audit.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private api = 'http://localhost:5000/api/audit';

  constructor(private http: HttpClient) {}

  // GET /api/audit (optional ?entity= &action=)
  getAll(entity = '', action = ''): Observable<AuditLog[]> {
    let params = new HttpParams();
    if (entity) params = params.set('entity', entity);
    if (action) params = params.set('action', action);
    return this.http.get<AuditLog[]>(this.api, { params });
  }
}
