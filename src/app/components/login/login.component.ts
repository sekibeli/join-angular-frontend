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


  async login(event: Event){
    event.preventDefault();
   let resp: any = await this.authService.login(this.email, this.password).subscribe(
      res => {
        console.log('Login successful');
        localStorage.setItem('token', resp.token);
        this.route.navigate(['/home/summary']);
      },
      err => {
        console.error('Login failed', err);
        this.errorMessage = 'email or password is incorrect';
      }
    );
  }
}
