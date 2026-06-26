import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsOverview } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private api = `${environment.apiBase}/api/analytics`;

  constructor(private http: HttpClient) {}

  getOverview(): Observable<AnalyticsOverview> {
    return this.http.get<AnalyticsOverview>(`${this.api}/overview`);
  }
}
