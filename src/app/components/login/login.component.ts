import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private route: Router){}



async login() {
  try {
    let resp: any = await this.authService.login(this.email, this.password);
    console.log(resp.token);
    localStorage.setItem('token', resp.token);
    this.route.navigateByUrl('/home');
    console.log(resp);
  } catch (e) {
    alert('Anmeldung fehlgeschlagen - Passwort oder Username falsch');
    console.log('Fehler:', e);
  }
}
}
