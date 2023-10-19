import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // private apiUrl = 'https://joinbackend.pythonanywhere.com/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string):Promise<any>{
    const url = environment.baseUrl + '/login/';
    const body = {
      "username": email,
      "password": password
    }
    
    return lastValueFrom(this.http.post(url,body));
  }
}
