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
// import { Status } from 'src/app/models/status.class';
import { BehaviorSubject } from 'rxjs';

export enum Status {
  todo = 'To do',
  inProgress = 'In Progress' ,
  awaitingFeedback = 'Awaiting Feedback',
  done = 'Done'
}
interface PriorityType {
  key: Status;
  value: string;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy{
  //public tasks:any = [];
  Status = Status;

  alive: boolean = true;

  // tasks$ = new BehaviorSubject<any[]>([]);
  // public subtasks:any = [];
  // public todo: any[] = [];
  // public inProgress: any[] = [];
  // public awaitingFeedback: any[] = [];
  // public done: any[] = [];

  constructor(public dataService: DataService){
    this.dataService.fetchAndSortTasks();
   
  }

ngOnInit(): void {
  this.dataService.cachedTasks?.subscribe((tasks)=> {
    // console.log('cachedTasks', tasks);
  })
  
}

processTasks(tasks: any[]) {
  // this.tasks$.next(tasks);
  
}
ngOnDestroy(): void {
   this.alive = false; 
   console.log('board destroyed');
}
// fetchAndSortTasks() {
  
//   this.dataService.getTasks().subscribe(tasks => {
//     this.tasks$.next(tasks);
    
//     // tasks nach status sortieren
//     this.todo = tasks.filter((task:any) => task.status.title === 'todo');
//     this.inProgress = tasks.filter((task:any) => task.status.title === 'inProgress');
//     this.awaitingFeedback = tasks.filter((task:any) => task.status.title === 'awaitingFeedback');
//     this.done = tasks.filter((task:any) => task.status.title === 'done');
//   });
  
// }

  drop(event: CdkDragDrop<any[] | null, any> ) {
    if (!event.previousContainer.data || !event.container.data) {
      return;  // Verlassen Sie die Funktion, wenn einer der Daten null ist.
    }
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
  getStatusByContainerId(id: string): string {
    switch (id) {
        case 'todoList': return "to do";
        case 'inProgressList': return "In Progress";
        case 'awaitingFeedbackList': return "Awaiting Feedback";
        default: return "Done";
    }
}
}
