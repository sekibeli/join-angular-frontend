import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    const url = environment.baseUrl + '/tasks/';
    return this.http.get(url);
  }

  getContacts(): Observable<any> {
    const url = environment.baseUrl + '/contacts/';
    return this.http.get(url);
  }

  getCategories(): Observable<any> {
    const url = environment.baseUrl + '/categories/';
    return this.http.get(url);
  }
}
