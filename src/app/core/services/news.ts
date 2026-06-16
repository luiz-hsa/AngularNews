import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../enviroments';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = environment.newsApiUrl;
  private apiKey = environment.newsApiKey;

  constructor(private http: HttpClient) { }

  getTopHeadlines(category: string = 'general'): Observable<any> {
    const cacheKey = `headlines_${category}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = (new Date().getTime() - parsed.timestamp) > 30 * 60 * 1000;
      if (!isExpired) return of(parsed.data);
    }

    const url = `${this.apiUrl}/top-headlines?country=us&category=${category}&apiKey=${this.apiKey}`;
    
    return this.http.get<any>(url).pipe(
      tap(response => {
        localStorage.setItem(cacheKey, JSON.stringify({ data: response, timestamp: new Date().getTime() }));
      }),
      catchError(error => {
        return cached ? of(JSON.parse(cached).data) : of({ articles: [] });
      })
    );
  }
}