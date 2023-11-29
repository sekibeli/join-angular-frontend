import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  vorname: string = '';
  nachname: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  signUp(){}
}
