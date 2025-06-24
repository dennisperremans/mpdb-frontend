import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

    getUniqueCountries(): Observable<string[]> {
        return this.http.get<string[]>(`${this.customApiBaseUrl}/countries`);
    }

    getUniqueCities(): Observable<string[]> {
        return this.http.get<string[]>(`${this.customApiBaseUrl}/cities`);
    }

    getFilteredGigs(
        filters: {
            venue_name?: string;
            country?: string;
            city?: string;
            keyword?: string;
        },
        page = 1,
        perPage = 10
    ): Observable<any> {

        let params = new HttpParams()
            .set('page', page)
            .set('per_page', perPage);

        if (filters.venue_name) {
            params = params.set('venue_name', filters.venue_name);
        }

        if (filters.country) {
            params = params.set('country', filters.country);
        }

        if (filters.city) {
            params = params.set('city', filters.city);
        }

        if (filters.keyword) {
            params = params.set('keyword', filters.keyword);
        }

        return this.http.get<any[]>(`${this.customApiBaseUrl}/gigs`, {
            params,
            observe: 'response'
        });
    }



}
