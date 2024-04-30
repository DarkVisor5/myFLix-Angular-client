import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component responsible for displaying movie synopsis details in a dialog.
 * @Component Marks the class as an Angular component and provides configuration metadata.
 */
@Component({
  selector: 'app-synopsis-details',  // CSS selector that identifies this component in a template
  templateUrl: './synopsis-details.component.html',  // URL to an external file containing a template for the view
  styleUrls: ['./synopsis-details.component.scss']  // URL to an external file containing CSS styles for this component
})
export class SynopsisDetailsComponent implements OnInit {

  /**
   * Constructs the SynopsisDetailsComponent.
   * @param data Contains the data passed to the dialog, specifically the synopsis of a movie.
   * @Inject Marks a constructor parameter as a dependency to be injected.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { synopsis: string }) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    // Component initialization logic can be added here if needed in the future.
  }

}
