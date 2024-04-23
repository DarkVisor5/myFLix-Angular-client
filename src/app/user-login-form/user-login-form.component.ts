import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent {
  loginData = { username: '', password: '' };

  constructor(private apiService: FetchApiDataService) {}

  loginUser(): void {
    this.apiService.userLogin(this.loginData).subscribe(response => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log(response); // Handle the response accordingly
    });
  }
}
