import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class WpApiService {
    private baseUrl = environment.wpApiBaseUrl;
    private customApiBaseUrl = environment.customApiBaseUrl;

    constructor(private http: HttpClient) {}

    getGigItems(type: string, page: number = 1, perPage: number = 10): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrl}/${type}?page=${page}&per_page=${perPage}`, {
            observe: 'response'
        });
    }


    getItem(endpoint: string, id: number | string): Observable<any> {
        const url = `${this.baseUrl}/${endpoint}/${id}`;
        return this.http.get(url);
    }

    // Get the summary from custom endpoint 
    getSummary(): Observable<any> {
        return this.http.get(`${this.customApiBaseUrl}/songs-played-count`);
    }

    // Get unique venues
    getUniqueVenues(): Observable<string[]> {
        return this.http.get<string[]>(`${this.customApiBaseUrl}/venues`);
    }
}
