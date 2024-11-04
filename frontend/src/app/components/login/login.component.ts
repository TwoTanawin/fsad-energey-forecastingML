import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
  ){}

  onSubmit() {
    const userData = {
      email: this.email,
      password: this.password
    };

  }
}
