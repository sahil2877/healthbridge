import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClinicalRecord } from '../models/record.model';

@Injectable({ providedIn: 'root' })
export class RecordService {
  private api = 'http://localhost:5000/api/records';

  constructor(private http: HttpClient) {}

  // GET /api/records (optional ?patient=)
  getAll(patientId = ''): Observable<ClinicalRecord[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patient', patientId);
    return this.http.get<ClinicalRecord[]>(this.api, { params });
  }

  getOne(id: string): Observable<ClinicalRecord> {
    return this.http.get<ClinicalRecord>(`${this.api}/${id}`);
  }

  create(data: ClinicalRecord): Observable<ClinicalRecord> {
    return this.http.post<ClinicalRecord>(this.api, data);
  }

  update(id: string, data: Partial<ClinicalRecord>): Observable<ClinicalRecord> {
    return this.http.put<ClinicalRecord>(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }

  // POST /api/records/:id/documents -> upload file(s) via multipart form-data
  uploadDocuments(id: string, files: File[]): Observable<ClinicalRecord> {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    return this.http.post<ClinicalRecord>(`${this.api}/${id}/documents`, form);
  }
}
