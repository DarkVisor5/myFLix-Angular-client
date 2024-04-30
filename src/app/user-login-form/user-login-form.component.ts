import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

/**
 * Component responsible for rendering the user login form and handling user login actions.
 * @Component Marks the class as an Angular component and provides metadata.
 */
@Component({
  selector: 'app-user-login-form',  // CSS selector that identifies this component in a template
  templateUrl: './user-login-form.component.html',  // URL to an external file containing a template for the view
  styleUrls: ['./user-login-form.component.scss']  // URL to an external file containing CSS styles for this component
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Holds the user's login credentials.
   */
  loginData = { username: '', password: '' };

  /**
   * Constructs the UserLoginFormComponent with necessary dependency injections.
   * @param apiService Provides API data services for the login operation.
   * @param router Provides the navigation and URL manipulation capabilities.
   * @param dialogRef Reference to the dialog opened as this component.
   * @param cookieService Service to manage browser cookies.
   * @param snackBar Service to show notifications or messages at the bottom of the screen.
   * @param userService Service to handle operations related to user data.
   */
  constructor(
    private apiService: FetchApiDataService,
    private router: Router,
    private dialogRef: MatDialogRef<UserLoginFormComponent>,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit() {
    console.log('Component initialized');
  }

  /**
   * Attempts to log in the user using the provided loginData.
   */
  loginUser(): void {
    console.log('Attempting login with:', this.loginData);
    this.apiService.userLogin(this.loginData).subscribe({
      next: (response) => this.handleLoginSuccess(response),
      error: (error) => this.handleLoginError(error)
    });
  }

  /**
   * Handles successful login by setting the necessary cookies and navigating to the movies page.
   * @param response Contains the user token and data.
   */
  private handleLoginSuccess(response: any): void {
    this.cookieService.set('token', response.token, { secure: true, path: '/', sameSite: 'Strict' });
    this.cookieService.set('user', JSON.stringify(response.user), { secure: true, path: '/', sameSite: 'Strict' });
    this.userService.storeUserPassword(this.loginData.password); // Store password temporarily
    console.log('Login successful, token and user data stored in cookies.');
    this.dialogRef.close(); // Closes the login dialog
    this.router.navigate(['/movies']); // Navigates to the movies page
    this.snackBar.open('Login successful!', 'OK', { duration: 2000 });
  }

  /**
   * Handles login errors by displaying an appropriate error message.
   * @param error Contains the error message or status code.
   */
  private handleLoginError(error: any): void {
    console.error('Login failed:', error);
    let errorMessage = error.error?.message || error.message || "Login failed due to server error";
    this.snackBar.open(errorMessage, 'OK', { duration: 3000 });
  }
}





