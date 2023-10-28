import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Status } from 'src/app/models/status.class';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy{
  //public tasks:any = [];

  alive: boolean = true;
  tasks$ = new BehaviorSubject<any[]>([]);
  // public subtasks:any = [];
  public todo: any[] = [];
  public inProgress: any[] = [];
  public awaitingFeedback: any[] = [];
  public done: any[] = [];

  constructor(private dataService: DataService){
    this.fetchAndSortTasks();
  }

ngOnInit(): void {
  
}

processTasks(tasks: any[]) {
  this.tasks$.next(tasks);
  
}
ngOnDestroy(): void {
   this.alive = false; 
}
fetchAndSortTasks() {
  
  this.dataService.getTasks().subscribe(tasks => {
    this.tasks$.next(tasks);
    
    // tasks nach status sortieren
    this.todo = tasks.filter((task:any) => task.status.title === 'todo');
    this.inProgress = tasks.filter((task:any) => task.status.title === 'inProgress');
    this.awaitingFeedback = tasks.filter((task:any) => task.status.title === 'awaitingFeedback');
    this.done = tasks.filter((task:any) => task.status.title === 'done');
  });
  
}

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      // Aktualisieren des Status der verschobenen Aufgabe
      const movedTask = event.container.data[event.currentIndex];
      const newStatusId = this.getStatusByContainerId(event.container.id);
        
      
      this.dataService.updateTaskStatus(movedTask.id, newStatusId)
      .subscribe(response => {
          console.log("Status updated successfully", response);
         
      }, error => {
          console.error("Error updating status", error);
         
      });
    }
  }
  getStatusByContainerId(id: string): number {
    switch (id) {
        case 'todoList': return 1;
        case 'inProgressList': return 2;
        case 'awaitingFeedbackList': return 3;
        default: return 4;
    }
}
}
