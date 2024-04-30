import { Component, OnInit, Input, Optional } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';

/**
 * The UserRegistrationFormComponent allows users to register a new account.
 *
 * @Component marks the class as an Angular component and provides metadata about the component.
 */
@Component({
  selector: 'app-user-registration-form',  // CSS selector that identifies this component in a template
  templateUrl: './user-registration-form.component.html',  // URL to an external file containing a template for the view
  styleUrls: ['./user-registration-form.component.scss']  // URL to an external file containing CSS styles for this component
})
export class UserRegistrationFormComponent implements OnInit {

  /**
   * User data model bound to the registration form inputs.
   */
  @Input() userData = { username: '', password: '', email: '', birthday: '' };

  /**
   * Constructs the UserRegistrationFormComponent with injected dependencies.
   *
   * @param fetchApiDataService Service to handle API data operations.
   * @param dialogRef Reference to the dialog opened as this component.
   * @param snackBar Service to show notifications or messages at the bottom of the screen.
   * @param router Service to navigate among views and URLs.
   * @param dialog Service to manage modal dialogs.
   * @param cookieService Service to manipulate browser cookies.
   */
  constructor(
    private fetchApiDataService: FetchApiDataService,
    @Optional() private dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private cookieService: CookieService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {}

  /**
   * Initiates the user registration process with the provided user data.
   */
  registerUser(): void {
    this.fetchApiDataService.userRegistration(this.userData).subscribe({
      next: (response) => this.handleRegistrationSuccess(response),
      error: (error) => this.handleRegistrationError(error)
    });
  }

  /**
   * Handles successful user registration by setting cookies, showing a success message,
   * closing the dialog, and redirecting to the login page.
   *
   * @param response The response data containing the user token and details.
   */
  private handleRegistrationSuccess(response: any): void {
    this.cookieService.set('token', response.token, { expires: 1, secure: true, sameSite: 'Strict' });
    this.cookieService.set('user', JSON.stringify(response.user), { expires: 1, secure: true, sameSite: 'Strict' });

    this.snackBar.open('Registration successful! Logging you in...', 'OK', {
      duration: 2000
    });

    this.closeDialog();
    this.redirectToLogin();
  }

  /**
   * Handles registration errors by displaying an appropriate error message.
   *
   * @param error The error response or object containing error details.
   */
  private handleRegistrationError(error: any): void {
    const errorMessage = error.error?.message || error.message || 'Failed to register';
    this.snackBar.open(errorMessage, 'OK', {
      duration: 2000
    });
  }

  /**
   * Closes the current dialog if this component was opened in a dialog.
   */
  private closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  /**
   * Redirects the user to the login form dialog shortly after registration.
   */
  private redirectToLogin(): void {
    setTimeout(() => {
      this.dialog.open(UserLoginFormComponent, {
        width: '280px'
      });
    }, 100); // Small delay to ensure UI updates smoothly
  }
}








