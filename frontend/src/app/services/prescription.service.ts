import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../models/prescription.model';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private api = 'http://localhost:5000/api/prescriptions';

  constructor(private http: HttpClient) {}

  // GET /api/prescriptions (optional ?patient=)
  getAll(patientId = ''): Observable<Prescription[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patient', patientId);
    return this.http.get<Prescription[]>(this.api, { params });
  }

  getOne(id: string): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.api}/${id}`);
  }

  create(data: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(this.api, data);
  }

  update(id: string, data: Partial<Prescription>): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
