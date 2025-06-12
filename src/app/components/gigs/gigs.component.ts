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
  songs: any[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;

  summaryLoaded = false;
  uniqueSongCount = 0;
  totalGigs = 0;
  totalSongsPlayed = 0;

  //filters
  venues: string[] = [];
  selectedVenue: string = '';

  constructor(private wpApiService: WpApiService) {}

  ngOnInit(): void {
    // Filters
    this.loadVenues();

    // Load data
    this.loadGigs();
    this.fetchSummary();
  }

  loadGigs(): void {
    this.loading = true;
    this.wpApiService.getGigItems('gig', this.currentPage).subscribe({
      next: (response) => {
        this.gigs = response.body;
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

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadGigs();
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

  /*
   * Load the filter values
   *
   * 
   */

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


  applyFilters(): void {
    this.currentPage = 1;
    this.loadGigs();
  }




}
