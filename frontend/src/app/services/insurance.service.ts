import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim, InsurancePolicy } from '../models/insurance.model';

@Injectable({ providedIn: 'root' })
export class InsuranceService {
  private api = 'http://localhost:5000/api/insurance';

  constructor(private http: HttpClient) {}

  // ---- Policies ----
  getPolicies(patientId = ''): Observable<InsurancePolicy[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patient', patientId);
    return this.http.get<InsurancePolicy[]>(`${this.api}/policies`, { params });
  }
  getPolicy(id: string): Observable<InsurancePolicy> {
    return this.http.get<InsurancePolicy>(`${this.api}/policies/${id}`);
  }
  createPolicy(data: InsurancePolicy): Observable<InsurancePolicy> {
    return this.http.post<InsurancePolicy>(`${this.api}/policies`, data);
  }
  updatePolicy(id: string, data: Partial<InsurancePolicy>): Observable<InsurancePolicy> {
    return this.http.put<InsurancePolicy>(`${this.api}/policies/${id}`, data);
  }
  deletePolicy(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/policies/${id}`);
  }

  // ---- Claims ----
  getClaims(patientId = '', status = ''): Observable<Claim[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patient', patientId);
    if (status) params = params.set('status', status);
    return this.http.get<Claim[]>(`${this.api}/claims`, { params });
  }
  getClaim(id: string): Observable<Claim> {
    return this.http.get<Claim>(`${this.api}/claims/${id}`);
  }
  createClaim(data: Claim): Observable<Claim> {
    return this.http.post<Claim>(`${this.api}/claims`, data);
  }
  updateClaim(id: string, data: Partial<Claim>): Observable<Claim> {
    return this.http.put<Claim>(`${this.api}/claims/${id}`, data);
  }
  deleteClaim(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/claims/${id}`);
  }
}
