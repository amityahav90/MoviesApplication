import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  private movieSubscription: Subscription;
  movie: {title: string, description: string, imagePath: string};

  constructor(private moviesService: MoviesService, private route: ActivatedRoute) {}

  ngOnInit() {
    const movieId = this.route.snapshot.params['id'];
    this.moviesService.getMovieById(movieId);
    this.movieSubscription = this.moviesService.getSelectedMovieListener()
      .subscribe(result => {
        this.movie = result;
      });
  }

  ngOnDestroy() {
    this.movieSubscription.unsubscribe();
  }
}
