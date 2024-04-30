import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { ProfileComponent } from './profile/profile.component';
import { MovieCardComponent } from './movie-card/movie-card.component';

/**
 * Defines the routes used in the application.
 * @const {Routes} routes
 * @description
 * - '' (root) redirects to '/welcome'
 * - 'login' navigates to the UserLoginFormComponent where users can log in
 * - 'profile' navigates to the ProfileComponent where users can view their profile
 * - 'movies' navigates to the MovieCardComponent where users can browse movies
 * - '**' catches any undefined paths and redirects to '/welcome'
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: UserLoginFormComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'movies',
    component: MovieCardComponent
  },
  {
    path: '**',
    redirectTo: '/welcome'
  }
];

/**
 * @module AppRoutingModule
 * @description
 * Configures and provides the router module with the defined routes for the application.
 * It is responsible for handling the navigation between different components based on the URL.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


