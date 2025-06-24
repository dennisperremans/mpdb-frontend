import { Component, OnInit } from '@angular/core';
import { WpApiService } from '../../../services/wp-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'app-gigs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginatorComponent
  ],
  templateUrl: './gigs.component.html',
  styleUrl: './gigs.component.scss'
})
export class GigsComponent implements OnInit {
  gigs: any[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;

  summaryLoaded = false;
  uniqueSongCount = 0;
  totalGigs = 0;
  totalSongsPlayed = 0;

  // filters
  venues: string[] = [];
  selectedVenue: string = '';
  countries: string[] = [];
  selectedCountry: string = '';
  cities: string[] = [];
  selectedCity: string = '';
  keyword: string = '';

  constructor(private wpApiService: WpApiService) {}

  ngOnInit(): void {
    // Load filters data
    this.loadVenues();
    this.loadCountries();
    this.loadCities();

    // Load initial gigs and summary
    this.loadGigs();
    this.fetchSummary();
  }

  loadGigs(): void {
    this.loading = true;
    this.wpApiService.getGigItems('gig', this.currentPage).subscribe({
      next: (response) => {
        this.gigs = response.body;
        console.log('Init gigs: ' + this.gigs);
        const totalPagesHeader = response.headers.get('X-WP-TotalPages');
        this.totalPages = totalPagesHeader ? +totalPagesHeader : 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load gigs';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadFilteredGigs(): void {
    this.loading = true;
    const filters = {
      venue_name: this.selectedVenue || undefined,
      country: this.selectedCountry || undefined,
      city: this.selectedCity || undefined,
      keyword: this.keyword || undefined,
    };

    this.wpApiService.getFilteredGigs(filters, this.currentPage).subscribe({
      next: (response) => {
        this.gigs = response.body;
        console.log('Filtered gigs: ' + this.gigs);
        const totalPagesHeader = response.headers.get('X-WP-TotalPages');
        this.totalPages = totalPagesHeader ? +totalPagesHeader : 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load filtered gigs';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;

    if (this.selectedVenue || this.selectedCountry || this.selectedCity) {
      this.loadFilteredGigs();
    } else {
      this.loadGigs();
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    if (this.selectedVenue || this.selectedCountry || this.selectedCity) {
      this.loadFilteredGigs();
    } else {
      this.loadGigs();
    }
  }

  fetchSummary() {
    this.loading = true;
    this.wpApiService.getSummary().subscribe({
      next: (response) => {
        this.totalSongsPlayed = response.total_songs_played;
        this.totalGigs = response.total_gigs;
        this.uniqueSongCount = response.total_unique_songs;
        this.summaryLoaded = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading summary data';
        this.loading = false;
      }
    });
  }

  loadVenues(): void {
    this.wpApiService.getUniqueVenues().subscribe({
      next: (venues) => {
        this.venues = venues;
      },
      error: (err) => {
        console.error('Failed to load venues:', err);
      }
    });
  }

  loadCountries(): void {
    this.wpApiService.getUniqueCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (err) => {
        console.error('Failed to load countries:', err);
      }
    });
  }

  loadCities(): void {
    this.wpApiService.getUniqueCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (err) => {
        console.error('Failed to load cities:', err);
      }
    });
  }
}
