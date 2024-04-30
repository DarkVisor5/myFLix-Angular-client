import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Defines the structure for genre data.
 */
export interface Genre {
  name: string;
  description: string;
}

/**
 * A component that displays the details of a genre in a dialog.
 */
@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',  // Path to the HTML template
  styleUrls: ['./genre-details.component.scss']  // Path to the component-specific styles
})
export class GenreDetailsComponent implements OnInit {

  /**
   * Constructs the GenreDetailsComponent.
   * @param data The genre data to display, injected from the dialog opener.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: Genre) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties.
   */
  ngOnInit(): void {
    // Component initialization logic could go here
  }
}

