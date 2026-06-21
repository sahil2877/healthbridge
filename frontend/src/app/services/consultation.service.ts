import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../models/consultation.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private api = 'http://localhost:5000/api/consultations';

  constructor(private http: HttpClient) {}

  // Doctors a patient can consult
  getDoctors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/doctors`);
  }

  getAll(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(this.api);
  }

  getOne(id: string): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.api}/${id}`);
  }

  request(data: { doctor: string; reason?: string }): Observable<Consultation> {
    return this.http.post<Consultation>(this.api, data);
  }

  setStatus(id: string, status: string): Observable<Consultation> {
    return this.http.patch<Consultation>(`${this.api}/${id}/status`, { status });
  }

  saveSummary(id: string, summary: string): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.api}/${id}`, { summary });
  }
}
