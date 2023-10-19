import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

// baseURL = '127.0.0.1:8000'
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    const url = environment.baseUrl + '/tasks/';
    // return this.http.get(this.baseURL + '/tasks/');
    return this.http.get(url);
  }
}
