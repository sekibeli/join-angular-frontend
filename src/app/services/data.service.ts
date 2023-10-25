import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.class';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cachedCategories: Observable<any> | null = null;
  private cachedContacts: Observable<any> | null = null;
  private cachedTasks: Observable<any> | null = null;
  private cachedSubtasks: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    const url = environment.baseUrl + '/tasks/';
    if (!this.cachedTasks) {
      this.cachedTasks = this.http.get(url).pipe(
      shareReplay(1)  // Dies stellt sicher, dass das Ergebnis für zukünftige Abonnenten zwischengespeichert wird
     );
 }
    return this.cachedTasks;
  }

  getContacts(): Observable<any> {
    const url = environment.baseUrl + '/contacts/';
    if (!this.cachedContacts) {
      this.cachedContacts = this.http.get(url).pipe(
      shareReplay(1)  // Dies stellt sicher, dass das Ergebnis für zukünftige Abonnenten zwischengespeichert wird
     );
 }
    return this.cachedContacts;
  }

   getCategories(): Observable<any> {
    const url = environment.baseUrl + '/categories/';

    if (!this.cachedCategories) {
         this.cachedCategories = this.http.get(url).pipe(
         shareReplay(1)  
        );
    }

    // Gibt das zwischengespeicherte Observable zurück (entweder das neu abgerufene oder das bereits vorhandene)
    return this.cachedCategories;
}

  saveNewCategory(body:Category): Observable<any> {
    const url = environment.baseUrl + '/categories/';
    return this.http.post(url, body).pipe(
      tap(()=> {
        this.cachedCategories = null;
      })
    );
  }
  
  saveTask(body: any): Observable<any> {
    const url = environment.baseUrl + '/create_task_with_subtasks/';
    console.log('saveTask');
    return this.http.post(url, body).pipe(
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  getSubtasks(){
       
    const url = environment.baseUrl + '/subtasks/';
    if (!this.cachedSubtasks) {
      this.cachedSubtasks = this.http.get(url).pipe(
      shareReplay(1)  // Dies stellt sicher, dass das Ergebnis für zukünftige Abonnenten zwischengespeichert wird
     );
 }
    return this.cachedSubtasks;
  }


  getSubtasksByIds(ids: number[]): Observable<any> {
    const url = `${environment.baseUrl}/subtasks/?ids[]=${ids.join('&ids[]=')}`;
    return this.http.get(url);
}

getContactsByIds(ids: number[]): Observable<any> {
  const url = `${environment.baseUrl}/assigned/?ids[]=${ids.join('&ids[]=')}`;
  return this.http.get(url);
}
}

