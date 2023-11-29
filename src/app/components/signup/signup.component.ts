import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private route:Router, private authService: AuthService){}
  async signUp(){
    try {
      let resp: any = await this.authService.signup(this.vorname, this.nachname, this.email, this.password);
      console.log(resp.token);
      // localStorage.setItem('token', resp.token);
      this.route.navigateByUrl('/login');
      console.log(resp);
    } catch (e) {
      alert('Signup fehlgeschlagen - irgendwas ist schiefgegangen');
      console.log('Fehler:', e);
    }
  }
}
