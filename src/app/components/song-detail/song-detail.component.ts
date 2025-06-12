import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WpApiService } from '../../../services/wp-api.service';

@Component({
  selector: 'app-song-detail.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.scss'
})
export class SongDetailComponent implements OnInit {
  song: any = null;
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
      this.wpApi.getItem('song', id).subscribe({
        next: (data) => {
          this.song = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load song';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
