import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';

/**
 * Represents the welcome page component.
 * This component serves as the landing page of the application where users can choose to log in or register.
 *
 * @Component Decorator that marks a class as an Angular component and provides configuration metadata.
 */
@Component({
  selector: 'app-welcome-page', // The CSS selector that identifies this component in a template
  templateUrl: './welcome-page.component.html', // The module-relative path to the HTML file for this component
  styleUrls: ['./welcome-page.component.scss'] // The module-relative path to the CSS file for this component
})
export class WelcomePageComponent implements OnInit {

  /**
   * Constructor to inject dependencies.
   * @param dialog MatDialog service to open modal dialog windows.
   */
  constructor(public dialog: MatDialog) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    // Lifecycle hook for initialization logic
  }

  /**
   * Opens the user registration dialog.
   * This method triggers a modal dialog using Angular Material's Dialog component to handle user registration.
   */
  openUserRegistrationDialog(): void {
    console.log("Opening registration dialog");
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px' // Specifies the width of the dialog
    });
  }

  /**
   * Opens the user login dialog.
   * This method triggers a modal dialog using Angular Material's Dialog component to handle user login.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px' // Specifies the width of the dialog
    });
  }
}
