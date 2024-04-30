import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
// movies related imports

// genre
import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { Genre } from '../genre-details/genre-details.component';

// director
import { DirectorDetailsComponent } from '../director-details/director-details.component';
import { Director } from '../director-details/director-details.component';

// Movie description
import { SynopsisDetailsComponent } from '../synopsis-details/synopsis-details.component';

interface Movie {
  _id: string;
  title: string;
  description: string;
  director?: {
    name: string;
    bio: string;
    birth_year: number;
  };
  genre: Array<{ name: string; description: string }>;
  image_url: string;
}

/**
 * Component for displaying individual movie cards with options to view details and manage favorites.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: Movie[] = [];
  favorites: string[] = [];

  /**
   * Initializes component with necessary services.
   * @param fetchApiData Service to interact with API endpoints related to movies.
   * @param dialog Service to open modal dialogues for more detailed movie information.
   * @param snackBar Service to display notifications.
   * @param cookieService Service to handle browser cookies for user session.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cookieService: CookieService
  ) {}

  /**
   * On component initialization, load user favorites and movie list.
   */
  ngOnInit(): void {
    this.loadFavorites();
    this.getMovies();
  }

  /**
   * Retrieves all movies from the server and updates local state.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (resp: any) => {
        this.movies = resp.map((movieData: any): Movie => ({
          ...movieData,
          director: movieData.director || { name: 'Unknown' }
        }));
        this.updateFavorites();
      },
      error: (err: any) => this.handleError(err, 'Failed to load movies')
    });
  }

  /**
   * Loads the favorite movies of the current user.
   */
  loadFavorites(): void {
    const userCookie = this.cookieService.get('user');  // Get user from cookies
    const user = userCookie ? JSON.parse(userCookie) : {};  // Parse user data or set to empty object if not present

    if (user && user.username) {
        this.fetchApiData.getUser(user.username).subscribe({
            next: (user: any) => {
                this.favorites = user.favoriteMovies || [];
                this.updateFavorites();
            },
            error: (err: any) => this.handleError(err, 'Failed to load favorite movies')
        });
    }
  }

  /**
   * Toggles a movie's favorite status for the current user.
   * @param movieId The ID of the movie to toggle.
   */
  toggleFavorite(movieId: string): void {
    const userCookie = this.cookieService.get('user');
    const user = userCookie ? JSON.parse(userCookie) : {};
    if (!user || !user.username) {
      this.snackBar.open('User not authenticated.', 'OK', { duration: 2000 });
      return;
    }

    const index = this.favorites.indexOf(movieId);
    const isFavorite = index > -1;

    if (isFavorite) {
      this.fetchApiData.deleteMovieFromFavourites(user.username, movieId).subscribe({
        next: () => {
          this.favorites.splice(index, 1); // Remove from favorites
          this.snackBar.open('Movie removed from favorites!', 'OK', { duration: 2000 });
        },
        error: (err) => this.handleError(err, 'Failed to remove from favorites')
      });
    } else {
      this.fetchApiData.addMovieToFavourite(user.username, movieId).subscribe({
        next: () => {
          this.favorites.push(movieId); // Add to favorites
          this.snackBar.open('Movie added to favorites!', 'OK', { duration: 2000 });
        },
        error: (err) => this.handleError(err, 'Failed to add to favorites')
      });
    }
  }

  /**
   * Updates the display of favorites based on the current state.
   */
  updateFavorites(): void {
    console.log('Favorites updated:', this.favorites);
  }

  /**
   * Handles errors during API interaction or logical operations.
   * @param error The error object received.
   * @param message The message to display in the snackbar.
   */
  handleError(error: any, message: string): void {
    console.error(error);
    this.snackBar.open(message, 'OK', { duration: 2000 });
  }

  /**
   * Opens a dialog with genre details.
   * @param genre The genre to display details for.
   */
  openGenreDetails(genre: Genre): void {
    this.dialog.open(GenreDetailsComponent, { width: '250px', data: genre });
  }

  /**
   * Opens a dialog with director details.
   * @param director The director to display details for.
   */
  openDirectorDetails(director: Director | undefined): void {
    if (director) {
      this.dialog.open(DirectorDetailsComponent, { width: '300px', data: director });
    }
  }

  /**
   * Opens a dialog with movie synopsis details.
   * @param synopsis The synopsis text to display.
   */
  openSynopsisDetails(synopsis: string): void {
    this.dialog.open(SynopsisDetailsComponent, { width: '400px', data: { synopsis } });
  }
}






