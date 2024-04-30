import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

/**
 * Service that manages user data and interactions with browser cookies.
 * It provides methods to handle user sessions and temporary password storage.
 * @Injectable Decorator that marks the class as a service that can be injected.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Observable that holds the user's data and broadcasts changes to subscribers.
   */
  private userSubject: BehaviorSubject<any>;

  /**
   * Temporarily stores the user's password. Intended for immediate use only and should not be persisted.
   */
  private tempPassword: string | null = null;

  /**
   * Constructs the UserService.
   * @param platformId Identifier for the platform being used; used for checking if the platform is a browser.
   * @param cookieService Service to manage cookies.
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService
  ) {
    this.userSubject = new BehaviorSubject<any>(this.retrieveUser());
  }

  /**
   * Retrieves the user data from browser cookies and initializes the userSubject with it.
   * @returns {any} The user data if available, or an empty object.
   */
  private retrieveUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userCookie = this.cookieService.get('user');
      return userCookie ? JSON.parse(userCookie) : {};
    }
    return {};
  }

  /**
   * Updates and broadcasts the user data. Stores the updated user data in cookies if on a browser platform.
   * @param userData The user data to set.
   */
  setUser(userData: any): void {
    this.userSubject.next(userData);
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.set('user', JSON.stringify(userData), { expires: 7, secure: true, sameSite: 'Strict' });
    }
  }

  /**
   * Returns the current user data.
   * @returns {any} The current user data as held in the userSubject.
   */
  getUser(): any {
    return this.userSubject.value;
  }

  /**
   * Clears the user data from the service and the browser's cookies.
   */
  clearUser(): void {
    this.userSubject.next(null);
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.delete('user');
    }
    this.clearTempPassword();
  }

  /**
   * Stores the user's password temporarily in the service.
   * Note: This should be handled with care to ensure security.
   * @param password The user's password to store temporarily.
   */
  storeUserPassword(password: string): void {
    this.tempPassword = password;
  }

  /**
   * Retrieves the temporarily stored user's password.
   * @returns {string | null} The temporarily stored password or null if none is stored.
   */
  getUserPassword(): string | null {
    return this.tempPassword;
  }

  /**
   * Clears the temporarily stored user's password from the service.
   */
  clearTempPassword(): void {
    this.tempPassword = null;
  }
}



