import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, Payment } from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private api = 'http://localhost:5000/api/invoices';

  constructor(private http: HttpClient) {}

  // GET /api/invoices (optional ?patient= & ?status=)
  getAll(patientId = '', status = ''): Observable<Invoice[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patient', patientId);
    if (status) params = params.set('status', status);
    return this.http.get<Invoice[]>(this.api, { params });
  }

  getOne(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.api}/${id}`);
  }

  create(data: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.api, data);
  }

  update(id: string, data: Partial<Invoice>): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.api}/${id}`, data);
  }

  // Record a payment against an invoice
  addPayment(id: string, payment: Payment): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.api}/${id}/payments`, payment);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
