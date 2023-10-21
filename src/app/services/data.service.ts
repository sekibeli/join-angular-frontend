import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

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

  saveTask(body: any): Observable<any> {

    const url = environment.baseUrl + '/create_task_with_subtasks/';
    console.log('saveTask');
    return this.http.post(url, body)
  }
}
