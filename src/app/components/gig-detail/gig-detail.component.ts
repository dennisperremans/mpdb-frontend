import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { WpApiService } from '../../../services/wp-api.service';

@Component({
  selector: 'app-gig-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gig-detail.component.html',
  styleUrl: './gig-detail.component.scss'
})
export class GigDetailComponent implements OnInit {
  gig: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private wpApi: WpApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.wpApi.getItem('gig', id).subscribe({
        next: (data) => {
          this.gig = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load gig';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
