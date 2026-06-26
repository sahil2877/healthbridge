import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LabOrder, LabPackage } from '../models/lab.model';

@Injectable({ providedIn: 'root' })
export class LabService {
  private api = `${environment.apiBase}/api/lab`;

  constructor(private http: HttpClient) {}

  // Catalog
  getPackages(category = ''): Observable<LabPackage[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    return this.http.get<LabPackage[]>(`${this.api}/packages`, { params });
  }

  // Orders
  getOrders(status = ''): Observable<LabOrder[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<LabOrder[]>(`${this.api}/orders`, { params });
  }
  getOrder(id: string): Observable<LabOrder> {
    return this.http.get<LabOrder>(`${this.api}/orders/${id}`);
  }
  createOrder(data: LabOrder): Observable<LabOrder> {
    return this.http.post<LabOrder>(`${this.api}/orders`, data);
  }
  updateStatus(id: string, data: { status?: string; reportUrl?: string }): Observable<LabOrder> {
    return this.http.patch<LabOrder>(`${this.api}/orders/${id}/status`, data);
  }
}
