import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  currentUser: any;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private route: Router, private dataService: DataService){}

async guestLogin(){
  await this.authService.login('max@muster.de', 'guestuser1').then((user)=> {
    this.dataService.loginUser(user);
    localStorage.setItem('token', user.token);
    console.log('Eingeloggt ist:', user);
    this.currentUser = user;
    this.dataService.loginUser(user);
    this.dataService.getContacts();
    this.dataService.getCategories();
    this.route.navigateByUrl('/home/summary');
  });
}

async login() {
  try {
    // let resp: any = 
    await this.authService.login(this.email, this.password).then((user)=> {
      this.dataService.loginUser(user);
      localStorage.setItem('token', user.token);
      console.log('Eingeloggt ist:', user);
      this.currentUser = user;
      this.dataService.loginUser(user);
      this.dataService.getContacts();
      this.dataService.getCategories();
      this.route.navigateByUrl('/home/summary');
    });
  //   console.log(resp.token);
  //   localStorage.setItem('token', resp.token);
  //   this.currentUser = resp.user;

  // console.log(this.currentUser);
  //   this.route.navigateByUrl('/home/summary');
  //   console.log(resp);
  } catch (e) {
    alert('Anmeldung fehlgeschlagen - Passwort oder Username falsch');
    console.log('Fehler:', e);
  }
}

showSignUp(){
  this.route.navigateByUrl('/signup');
}

// getUser(){
//   lastValueFrom(this.dataService.getUser()).then(())
// }

}
