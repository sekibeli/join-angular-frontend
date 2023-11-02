import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.class';
import { Status } from '../models/status.class';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cachedCategories: Observable<any> | null = null;
  private cachedContacts: Observable<any> | null = null;
  public cachedTasks: Observable<any> | null = null;
  private cachedSubtasks: Observable<any> | null = null;


  tasks$ = new BehaviorSubject<any[]>([]);
  // public subtasks:any = [];
  public todo: any[] = [];
  public todo$ = new BehaviorSubject<any[]>([]);
  public inProgress: any[] = [];
  public awaitingFeedback: any[] = [];
  public done: any[] = [];
  public inProgress$ = new BehaviorSubject<any[]>([]);
public awaitingFeedback$ = new BehaviorSubject<any[]>([]);
public done$ = new BehaviorSubject<any[]>([]);


  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    const url = environment.baseUrl + '/tasks/';
    // if (!this.cachedTasks) {
      this.cachedTasks = this.http.get(url)
//       .pipe(
//       shareReplay(1)  // Dies stellt sicher, dass das Ergebnis für zukünftige Abonnenten zwischengespeichert wird
//      );
//  }
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

updateTaskStatus(taskId: number, newStatusId: number): Observable<any> {
  const url = `${environment.baseUrl}/tasks/${taskId}/`;
  return this.http.patch(url, { status_id: newStatusId });
}

getTaskById(id:number){
  const url = `${environment.baseUrl}/tasks/${id}/`;
  return this.http.get(url);
}

deleteTask(id:number){
  const url = `${environment.baseUrl}/tasks/${id}/`;
  return this.http.delete(url);
}

fetchAndSortTasks() {
  
  this.getTasks().subscribe(tasks => {
    this.tasks$.next(tasks);
    console.log('alle Tasks:', tasks);
  
    // sortieren
    this.todo$.next(tasks.filter((task: any) => task.status.title === 'todo'));
    this.inProgress$.next(tasks.filter((task: any) => task.status.title === 'inProgress'));
    this.awaitingFeedback$.next(tasks.filter((task: any) => task.status.title === 'awaitingFeedback'));
    this.done$.next(tasks.filter((task: any) => task.status.title === 'done'));
    
    // console.log('todo-Tasks:', this.todo);
  });
  
}

editTask(task:any, id:number){
  const url = `${environment.baseUrl}/tasks/${id}/`;
  return this.http.put(url, task);
}

}

