import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

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
 * The ProfileComponent is responsible for handling the user profile view.
 * It allows users to view and manage their profile information including favorite movies.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  originalUsername: string = '';
  favoriteMovies: any[] = [];  // This could be typed as Movie[] if the interface is defined globally

  /**
   * Constructs the ProfileComponent with dependencies injected.
   * @param cookieService Service to manage browser cookies.
   * @param fetchApiData Service to fetch API data.
   * @param userService Service to manage user data.
   * @param snackBar Service to display brief messages.
   * @param router Service to navigate among views.
   * @param datePipe Service to format dates.
   */
  constructor(
    private cookieService: CookieService,
    private fetchApiData: FetchApiDataService,
    private userService: UserService,
    public snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  /**
   * Initializes the component by setting up user profile data.
   */
  ngOnInit(): void {
    this.initializeUserProfile();
  }

  /**
   * Initializes user profile data from the user service or redirects if no user is found.
   */
  initializeUserProfile(): void {
    this.user = this.userService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      this.snackBar.open('No user data found. Please log in.', 'OK', { duration: 2000 });
      return;
    }
    this.originalUsername = this.user.username;
    this.user.birthday = this.datePipe.transform(this.user.birthday, 'yyyy-MM-dd');
    this.loadFavoriteMovies();
  }

  /**
   * Loads the user's favorite movies using their username.
   */
  loadFavoriteMovies(): void {
    if (!this.user.username) {
      this.snackBar.open('No user data found. Please log in.', 'OK', { duration: 2000 });
      return;
    }

    this.fetchApiData.getUser(this.user.username).subscribe({
      next: (user) => {
        const favoriteMovieIds = user.favoriteMovies || [];
        this.fetchAllMoviesAndFilterFavorites(favoriteMovieIds);
      },
      error: (err) => {
        console.error("Failed to load user data:", err);
        this.snackBar.open('Failed to load user data.', 'OK', { duration: 2000 });
      }
    });
  }

  /**
   * Fetches all movies from the database and filters out the user's favorites.
   * @param favoriteMovieIds Array of favorite movie IDs to filter from all movies.
   */
  fetchAllMoviesAndFilterFavorites(favoriteMovieIds: string[]): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (allMovies: Movie[]) => {
        this.favoriteMovies = allMovies.filter((movie: Movie) => favoriteMovieIds.includes(movie._id));
        console.log("Filtered Favorite Movies:", this.favoriteMovies);
      },
      error: (err) => {
        console.error("Failed to load all movies:", err);
        this.snackBar.open('Failed to load movies.', 'OK', { duration: 2000 });
      }
    });
  }

  /**
   * Updates the user's profile with the current data.
   */
  updateProfile(): void {
    if (this.originalUsername !== this.user.username) {
      this.snackBar.open('Cannot change username via this update. Please create a new account.', 'OK', { duration: 3000 });
      return;
    }

    const password = this.userService.getUserPassword(); // Retrieve the stored password
    const updatedUser = {
      username: this.user.username,
      email: this.user.email,
      password: password,
      birthday: this.datePipe.transform(this.user.birthday, 'yyyy-MM-dd')
    };

    this.fetchApiData.editUser(this.originalUsername, updatedUser).subscribe({
      next: (resp) => this.handleProfileUpdateSuccess(resp),
      error: (error) => this.handleError('Failed to update profile.')
    });
  }

  /**
   * Deletes the user's profile and handles success or failure responses.
   */
  deleteProfile(): void {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    this.fetchApiData.deleteUser(this.user.username).subscribe({
      next: () => {
        console.log("Unexpected success path");
      },
      error: (error) => {
        if (error.status === 200 || (error.error && error.error.text === 'User deleted successfully')) {
          this.handleMisreportedSuccess('Account deleted successfully');
        } else {
          this.handleError('Failed to delete account');
        }
      }
    });
  }

  /**
   * Handles successful profile update by updating the user data and displaying a success message.
   * @param resp The updated user data from the API.
   */
  handleProfileUpdateSuccess(resp: any): void {
    this.userService.setUser(resp);
    this.cookieService.set('user', JSON.stringify(resp), { expires: 7, secure: true, sameSite: 'Strict' });
    this.snackBar.open('Profile updated successfully!', 'OK', { duration: 2000 });
    this.user = resp;
    this.originalUsername = this.user.username;
  }

  /**
   * Handles cases where success is misreported by the API as an error.
   * @param message The message to display if a success is misreported.
   */
  handleMisreportedSuccess(message: string): void {
    this.userService.clearUser();
    this.cookieService.delete('user');
    this.snackBar.open(message, 'OK', { duration: 2000 });
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  /**
   * Handles errors by displaying a message to the user.
   * @param errorMessage The error message to display.
   */
  handleError(errorMessage: string): void {
    this.snackBar.open(errorMessage, 'OK', { duration: 2000 });
  }
}




