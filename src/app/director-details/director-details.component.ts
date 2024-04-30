import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Defines the structure for director data.
 */
export interface Director {
  name: string;
  bio: string;
  birth?: string; // ISO date string for the director's birthdate, optional.
  birth_year: number; // Year of birth.
  death?: string;  // ISO date string for the director's date of death, optional.
  death_year?: number;  // Year of death, optional.
}

/**
 * A component that displays detailed information about a movie director in a dialog.
 */
@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',  // Path to the HTML template
  styleUrls: ['./director-details.component.scss']  // Path to the component-specific styles
})
export class DirectorDetailsComponent implements OnInit {

  /**
   * Constructs the DirectorDetailsComponent.
   * @param data The director data to display, injected from the dialog opener.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: Director) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties.
   */
  ngOnInit(): void {
    // Component initialization logic could go here if needed.
  }

}

