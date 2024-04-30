import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

/**
 * Component responsible for displaying the navigation bar and managing its visibility.
 * It also handles user-specific data such as the username display based on the current route.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html', // Path to the HTML template
  styleUrls: ['./navbar.component.scss']  // Path to the stylesheet for this component
})
export class NavbarComponent implements OnInit {
  isVisible: boolean = true; // Indicates whether the navbar should be visible
  username: string | null = null; // Stores the username retrieved from cookies

  /**
   * Constructs the NavbarComponent with necessary dependencies.
   * @param router Provides navigation and URL manipulation capabilities.
   * @param cookieService Manages browser cookies.
   * @param cdRef Manages change detection.
   */
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef // Used for manually triggering change detection
  ) {
    // Subscribe to router events to update navbar visibility and username upon navigation
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.updateVisibility(event.url);
      this.updateUsername(); // Update username on route change
      this.cdRef.detectChanges(); // Manually trigger change detection
    });
  }

  /**
   * Initializes the component by setting the initial visibility and username.
   */
  ngOnInit() {
    setTimeout(() => {
      this.updateVisibility(this.router.url); // Initial check for navbar visibility
      this.updateUsername(); // Initial username update
    }, 0);
  }

  /**
   * Updates the visibility of the navbar based on the current URL.
   * @param url The current URL path from the router.
   */
  updateVisibility(url: string) {
    this.isVisible = !url.includes('/welcome'); // Hide navbar on the welcome page
  }

  /**
   * Updates the username from the user's cookie data.
   */
  updateUsername() {
    const userCookie = this.cookieService.get('user');
    this.username = userCookie ? JSON.parse(userCookie).username : null; // Parse username from cookie
  }

  /**
   * Logs out the user by deleting all cookies and navigating to the welcome page.
   */
  logout(): void {
    this.cookieService.deleteAll(); // Deletes all cookies
    this.router.navigate(['/welcome']); // Navigate to the welcome page after logout
  }
}


