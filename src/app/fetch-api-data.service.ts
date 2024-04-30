import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

const apiUrl = 'https://testmovieapi.onrender.com/';

/**
 * @class FetchApiDataService
 * @description Service class to handle all API calls for the myFlix Angular application.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  /**
   * @constructor
   * @param {HttpClient} http Angular service for making HTTP requests.
   * @param {CookieService} cookieService Service to manage browser cookies.
   */
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  /**
   * Generates HTTP headers, optionally including authorization token.
   * @param {boolean} [includeAuth=true] Whether to include the authorization token.
   * @returns {HttpHeaders} The HTTP headers with or without the authorization token.
   */
  private getHeaders(includeAuth = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (includeAuth) {
      const token = this.getAuthorizationToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  /**
   * Retrieves the authorization token from cookies.
   * @returns {string | undefined} The authorization token if available, otherwise undefined.
   */
  private getAuthorizationToken(): string | undefined {
    const token = this.cookieService.get('token');
    return token ? `Bearer ${token}` : undefined;
  }

  /**
   * Registers a new user with the given details.
   * @param {any} userDetails The user registration details.
   * @returns {Observable<any>} Observable representing the server response.
   */
  userRegistration(userDetails: any): Observable<any> {
    return this.http.post(`${apiUrl}users`, userDetails, { headers: this.getHeaders(false) })
      .pipe(catchError(this.handleError));
  }

  /**
   * Logs in a user with the provided credentials.
   * @param {any} credentials The user login credentials.
   * @returns {Observable<any>} Observable representing the server response.
   */
  userLogin(credentials: any): Observable<any> {
    return this.http.post(`${apiUrl}login`, credentials, { headers: this.getHeaders() })
      .pipe(
        map(this.handleLoginResponse.bind(this)),
        catchError(this.handleError)
      );
  }

  /**
   * Fetches all movies from the database.
   * @returns {Observable<any>} Observable array of all movies.
   */
  getAllMovies(): Observable<any> {
    return this.http.get(`${apiUrl}movies`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves detailed information about a director by name.
   * @param {string} name The director's name.
   * @returns {Observable<any>} Observable containing director details.
   */
  getDirector(name: string): Observable<any> {
    return this.http.get(`${apiUrl}directors/${name}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves genre information by genre name.
   * @param {string} name The genre name.
   * @returns {Observable<any>} Observable containing genre details.
   */
  getGenre(name: string): Observable<any> {
    return this.http.get(`${apiUrl}genres/${name}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a user by username.
   * @param {string} username The username of the user.
   * @returns {Observable<any>} Observable containing user details.
   */
  getUser(username: string): Observable<any> {
    return this.http.get(`${apiUrl}users/${username}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Adds a movie to the user's list of favorites.
   * @param {string} username The username of the user.
   * @param {string} movieId The ID of the movie to add.
   * @returns {Observable<any>} Observable of the updated user data.
   */
  addMovieToFavourite(username: string, movieId: string): Observable<any> {
    return this.http.post(`${apiUrl}users/${username}/movies/${movieId}`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates user information.
   * @param {string} originalUsername The original username.
   * @param {any} updatedUserDetails The details to update.
   * @returns {Observable<any>} Observable of the updated user data.
   */
  editUser(originalUsername: string, updatedUserDetails: any): Observable<any> {
    if (originalUsername !== updatedUserDetails.username) {
      console.error("Mismatch between path and body usernames:", originalUsername, updatedUserDetails.username);
      return throwError(() => new Error("Username in the parameter does not match the one in the request body"));
    }
    return this.http.put(`${apiUrl}users/${originalUsername}`, updatedUserDetails, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a user by username.
   * @param {string} username The username to delete.
   * @returns {Observable<any>} Observable of the server response, typically a success message.
   */
  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${apiUrl}users/${username}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Removes a movie from the user's list of favorites.
   * @param {string} username The username of the user.
   * @param {string} movieId The ID of the movie to remove.
   * @returns {Observable<any>} Observable of the updated user data.
   */
  deleteMovieFromFavourites(username: string, movieId: string): Observable<any> {
    return this.http.delete(`${apiUrl}users/${username}/movies/${movieId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles the response from the login API.
   * @param {any} response The server response from the login request.
   * @returns {any} The processed response data.
   */
  private handleLoginResponse(response: any): any {
    if (response.token && response.user) {
      this.cookieService.set('token', response.token);
      this.cookieService.set('user', JSON.stringify(response.user));
    } else {
      throw new Error('Login failed: No token or user data received');
    }
    return response;
  }

  /**
   * Handles HTTP errors by logging them and rethrowing as a new error.
   * @param {HttpErrorResponse} error The error response from HTTP requests.
   * @returns {Observable<never>} An observable that errors with the processed message.
   */
  private handleError(error: HttpErrorResponse) {
    const message = error.error.message || `Server error: ${error.message}`;
    console.error(message);
    return throwError(() => new Error(message));
  }
}



