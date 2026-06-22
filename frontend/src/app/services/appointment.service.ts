import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private api = 'http://localhost:5000/api/appointments';

  constructor(private http: HttpClient) {}

  // GET /api/appointments (optional ?status=)
  getAll(status = ''): Observable<Appointment[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Appointment[]>(this.api, { params });
  }

  getOne(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.api}/${id}`);
  }

  create(data: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.api, data);
  }

  // Patient self-booking — the server fills in the patient from the login.
  book(data: { doctor: string; date: string; reason: string }): Observable<Appointment> {
    return this.http.post<Appointment>(this.api, data);
  }

  update(id: string, data: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
