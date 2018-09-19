import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { Movie } from './movie.model';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class MoviesService {
  private movies: Array<Movie> = [];
  private moviesUpdated = new Subject<Array<Movie>>();
  private selectedMovie = new Subject<{ title: string, description: string, imagePath: string}>();

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {}

  getAllMovies() {
    this.http.get<{movies: any}>('http://x-mode.co.il/exam/allMovies/allMovies.txt')
      .pipe(map(movieData => {
        return {
          movies: movieData.movies.map(movie => {
            return {
              id: movie.id,
              title: movie.name,
              category: movie.category,
              year: +movie.year
            };
          })};
      }))
      .subscribe(transformedData => {
        this.movies = transformedData.movies;
        this.movies.sort((a, b) => a.year - b.year);
        this.moviesUpdated.next([...this.movies]);
      });
  }

  getMovieById(movieId: string) {this.http.get<{ name: string, description: string, imageUrl: string}>('http://x-mode.co.il/exam/descriptionMovies/' + movieId + '.txt')
      .subscribe(movie => {
        const selectedMovie = {
          title: movie.name,
          description: movie.description,
          imagePath: movie.imageUrl
        }
        this.selectedMovie.next(selectedMovie);
      }, error => {
        const dialogRef = this.dialog.open(ErrorComponent);
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['/']);
        });
      });
  }

  getMoviesUpdateListener() {
    return this.moviesUpdated.asObservable();
  }

  getSelectedMovieListener() {
    return this.selectedMovie.asObservable();
  }

  searchMovie(movieName: string) {
    const result = this.movies.find(movie => movie.title.toLowerCase().trim() === movieName.toLowerCase().trim());
    if (result) {
      this.movies = [];
      this.movies.push(result);
      this.moviesUpdated.next([...this.movies]);
    } else {
      this.moviesUpdated.next([]);
    }
  }
}
