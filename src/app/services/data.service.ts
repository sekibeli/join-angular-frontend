import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.class';
import { Subtask } from '../models/subtask.class';
// import { Status } from '../models/status.class';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Contact } from '../models/contact.class';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WrapperAddtaskComponent } from '../components/addtask/wrapper-addtask/wrapper-addtask.component';

export enum Status {
  todo = 'To do',
  inProgress = 'In Progress',
  awaitingFeedback = 'Awaiting Feedback',
  done = 'Done'
}

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  public contacts$ = this.contactsSubject.asObservable();

  Status = Status;
  private cachedCategories: Observable<any> | null = null;
  private cachedContacts: Observable<any> | null = null;
  public cachedTasks: Observable<any> | null = null;
  private cachedSubtasks: Observable<any> | null = null;

  currentUser: any;

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
  public urgentTasks$ = new BehaviorSubject<any[]>([]);
  public urgentTasks: any[] = [];
  public tasks: any;

  todoCount?: number;
  doneCount?: number;
  progressCount?: number;
  awaitingCount?: number;

  constructor(private http: HttpClient) {
    this.getTasks().subscribe(tasks => {
      this.tasks$.next(tasks);
      console.log('alle Tasks:', tasks);
    });
    this.tasks = this.tasks$.getValue();
    console.log('currentUser', this.currentUser);

    this.getContacts();

  }
  ngOnInit(): void {
    lastValueFrom(this.getCurrentUser()).then(response => {
      console.log('User:', response);
    });
    console.log('currentUser', this.currentUser);

    this.getContacts();


    // lastValueFrom(this.getContacts()).then((response)=> {
    //   this.contactsSubject.next(response);
    // });
  }


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

  //   getContacts(): Observable<Contact[]> {
  //     const url = environment.baseUrl + '/contacts/';
  //     if (!this.cachedContacts) {
  //       this.cachedContacts = this.http.get(url).pipe(
  //         // this.contactsSubject.next(this.cachedContacts);
  //       shareReplay(1)


  //      );
  //  }
  //     return this.cachedContacts;
  //   }

  getContacts(): void {
    const url = environment.baseUrl + '/contacts/';
    this.http.get<Contact[]>(url).subscribe(
      contacts => {
          this.contactsSubject.next(contacts);
        console.log(contacts);
      },
      error => {
        console.error('Fehler beim Laden der Kontakte:', error);
      }
    );
  }

  getCategories(): Observable<Category[]> {
    const url = environment.baseUrl + '/categories/';

    if (!this.cachedCategories) {
      this.cachedCategories = this.http.get(url).pipe(
        shareReplay(1)
      );
    }

    // Gibt das zwischengespeicherte Observable zurück (entweder das neu abgerufene oder das bereits vorhandene)
    return this.cachedCategories;
  }

  getCategoryById(id: number): Observable<any> {

    const url = `${environment.baseUrl}/categories/${id}/`;
    return this.http.get(url);
  }

  saveNewCategory(body: Category): Observable<any> {
    const url = environment.baseUrl + '/categories/';
    return this.http.post(url, body).pipe(
      tap(() => {
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

  updateSubtasks(subtasks: any) {
    console.log('...', subtasks);

    const url = environment.baseUrl + `/subtasks/update_many/`;
    return this.http.put(url, subtasks);

  }


  saveSubtasks(subtasks: any, taskId: number) {
    console.log('...', subtasks);

    const url = environment.baseUrl + `/tasks/${taskId}/add_subtasks/`;
    return this.http.post(url, subtasks);

  }
  getSubtasks() {

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

  getSubtasksByTaskId(taskId: number) {
    const url = `${environment.baseUrl}/subtasks/?task_id=${taskId}`;
    return this.http.get(url);
  }


  getContactsByIds(ids: number[]): Observable<any> {
    const url = `${environment.baseUrl}/assigned/?ids[]=${ids.join('&ids[]=')}`;
    return this.http.get(url);
  }

  updateTaskStatus(taskId: number, newStatus: string): Observable<any> {
    console.log(taskId, newStatus);
    const url = `${environment.baseUrl}/tasks/${taskId}/`;
    return this.http.patch(url, { status: newStatus });
  }

  getTaskById(id: number) {
    const url = `${environment.baseUrl}/tasks/${id}/`;
    return this.http.get(url);
  }

  deleteTask(id: number) {
    const url = `${environment.baseUrl}/tasks/${id}/`;
    return this.http.delete(url);
  }

  deleteSubtask(id: number) {
    const url = `${environment.baseUrl}/subtasks/${id}`;
    return this.http.delete(url);
  }

  fetchAndSortTasks() {

    this.getTasks().subscribe(tasks => {
      this.tasks$.next(tasks);
      console.log('alle Tasks:', tasks);

      // sortieren für board
      this.todo$.next(tasks.filter((task: any) => task.status === 'To do'));
      this.inProgress$.next(tasks.filter((task: any) => task.status === 'In Progress'));
      this.awaitingFeedback$.next(tasks.filter((task: any) => task.status === 'Awaiting Feedback'));
      this.done$.next(tasks.filter((task: any) => task.status === 'Done'));

      // Daten für Summary
      this.todoCount = this.todo$.value.length;
      this.doneCount = this.done$.value.length;
      this.awaitingCount = this.awaitingFeedback$.value.length;
      this.progressCount = this.inProgress$.value.length;
      console.log(this.todoCount);
    });

  }

  getUrgentTasks() {
    this.tasks = this.tasks$.getValue();
    this.urgentTasks$.next(this.tasks.filter((task: any) => task.priority === 'urgent'))
    this.urgentTasks = this.urgentTasks$.getValue();

    return this.urgentTasks.length;
  }

  editTask(task: any, id: number) {
    console.log('last check:', task);
    const url = `${environment.baseUrl}/tasks/${id}/`;
    return this.http.put(url, task);
  }

  editContact(contact:Contact, id: number){
    console.log('contact last check:', contact);
    const url = `${environment.baseUrl}/contacts/${id}/`;
    return this.http.put(url, contact);

  }
  getFirstUpcomingDeadline() {
    const dateArray = this.tasks.map((task: any) => new Date(task.dueDate));

    return this.findNextDueDate(dateArray);
  }

  findNextDueDate(dates: Date[]) {
    // Aktuelles Datum für den Vergleich
    const today = new Date();

    // Filtern der Daten, die in der Zukunft liegen
    const futureDates = dates.filter((date) => date > today);

    // Sortieren der zukünftigen Daten
    futureDates.sort((a, b) => a.getTime() - b.getTime());

    // Rückgabe des nächstgelegenen Datums, falls vorhanden
    return futureDates.length > 0 ? futureDates[0] : null;
  }

  getCurrentUser() {
    const url = environment.baseUrl + '/user/';
    this.currentUser = this.http.get(url)
    return this.currentUser;
  }

  generateDarkColor(): string {
    // Funktion um eine zufällige dunkle Farbkomponente zu generieren
    function randomDarkComponent(): number {
      return Math.floor(Math.random() * (200 - 80 + 1) + 80); // Werte zwischen 80 und 200
    }

    // Erzeugt die RGB-Komponenten
    const r = randomDarkComponent();
    const g = randomDarkComponent();
    const b = randomDarkComponent();

    // Gibt die Farbe im #xxxxxx Format zurück
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  saveContact(body: Contact) {
    const url = environment.baseUrl + '/contacts/';
    return this.http.post(url, body);
  }
  deleteContact(id: number) {
    const url = `${environment.baseUrl}/contacts/${id}`;
    return this.http.delete(url);
  }



}

