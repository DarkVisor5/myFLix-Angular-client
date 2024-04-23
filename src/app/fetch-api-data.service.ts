import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'YOUR_HOSTED_API_URL_HERE/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) { }

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(`${apiUrl}users`, userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User login
  public userLogin(credentials: any): Observable<any> {
    return this.http.post(`${apiUrl}login`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http.get(`${apiUrl}movies`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get one movie
  public getOneMovie(id: string): Observable<any> {
    return this.http.get(`${apiUrl}movies/${id}`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get director
  public getDirector(name: string): Observable<any> {
    return this.http.get(`${apiUrl}directors/${name}`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get genre
  public getGenre(name: string): Observable<any> {
    return this.http.get(`${apiUrl}genres/${name}`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get user
  public getUser(username: string): Observable<any> {
    return this.http.get(`${apiUrl}users/${username}`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get favourite movies for a user
  public getFavouriteMovies(username: string): Observable<any> {
    return this.http.get(`${apiUrl}users/${username}/movies`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Add a movie to favourite Movies
  public addMovieToFavourite(username: string, movieId: string): Observable<any> {
    return this.http.post(`${apiUrl}users/${username}/movies/${movieId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Edit user
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http.put(`${apiUrl}users/${username}`, userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Delete user
  public deleteUser(username: string): Observable<any> {
    return this.http.delete(`${apiUrl}users/${username}`).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a movie from the favorite movies
  public deleteMovieFromFavourites(username: string, movieId: string): Observable<any> {
    return this.http.delete(`${apiUrl}users/${username}/movies/${movieId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Helper method to extract data
  private extractResponseData(res: any): any {
    return res || {};
  }

  // Error handling
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}

