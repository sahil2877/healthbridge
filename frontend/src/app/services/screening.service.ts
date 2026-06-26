import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Screening } from '../models/screening.model';

@Injectable({ providedIn: 'root' })
export class ScreeningService {
  private api = `${environment.apiBase}/api/screening`;

  constructor(private http: HttpClient) {}

  // GET /api/screening (optional ?patient=)
  getAll(patientId = ''): Observable<Screening[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patient', patientId);
    return this.http.get<Screening[]>(this.api, { params });
  }

  getOne(id: string): Observable<Screening> {
    return this.http.get<Screening>(`${this.api}/${id}`);
  }

  // Server computes BMI / risk / recommendations and returns the saved screening
  create(data: Screening): Observable<Screening> {
    return this.http.post<Screening>(this.api, data);
  }
}
