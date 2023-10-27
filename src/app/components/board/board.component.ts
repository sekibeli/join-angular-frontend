import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {NgFor} from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Status } from 'src/app/models/status.class';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit{
  public tasks:any = [];
  public subtasks:any = [];
  public todo: any[] = [];
  public inProgress: any[] = [];
  public awaitingFeedback: any[] = [];
  public done: any[] = [];

  constructor(private dataService: DataService){
    
  }

ngOnInit(): void {
  this.fetchAndSortTasks();
}

fetchAndSortTasks() {
  this.dataService.getTasks().subscribe(response => {
    this.tasks = response;
    
    // tasks nach status sortieren
    this.todo = this.tasks.filter((task:any) => task.status.title === 'todo');
    this.inProgress = this.tasks.filter((task:any) => task.status.title === 'inProgress');
    this.awaitingFeedback = this.tasks.filter((task:any) => task.status.title === 'awaitingFeedback');
    this.done = this.tasks.filter((task:any) => task.status.title === 'done');
  });

  // Da addTaskToSubject nur bei Änderungen aufgerufen werden sollte, sollten Sie es an dem Ort verwenden, an dem tatsächliche Änderungen vorgenommen werden (z.B. wo Sie einen Task hinzufügen oder ändern).
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
