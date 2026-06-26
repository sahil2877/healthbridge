import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private api = `${environment.apiBase}/api/patients`;

  constructor(private http: HttpClient) {}

  // GET /api/patients (optional ?search=)
  getAll(search = ''): Observable<Patient[]> {
    let params = new HttpParams();
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<Patient[]>(this.api, { params });
  }

  // GET /api/patients/:id
  getOne(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.api}/${id}`);
  }

  // POST /api/patients
  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.api, patient);
  }

  // PUT /api/patients/:id
  update(id: string, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.api}/${id}`, patient);
  }

  // DELETE /api/patients/:id
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
