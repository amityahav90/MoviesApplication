import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MoviesService } from '../movies.service';
import { Movie } from '../movie.model';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit, OnDestroy {
  private moviesSubscription: Subscription;
  movies: Movie[] = [];
  searchValue = '';

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.moviesService.getAllMovies();
    this.moviesSubscription = this.moviesService.getMoviesUpdateListener()
      .subscribe(movieData => {
        this.movies = movieData;
      });
  }

  onSearch() {
    this.moviesService.searchMovie(this.searchValue);
  }

  onBack() {
    this.moviesService.getAllMovies();
    this.searchValue = '';
  }

  ngOnDestroy() {
    this.moviesSubscription.unsubscribe();
  }
}
