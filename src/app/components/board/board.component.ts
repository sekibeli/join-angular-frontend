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
    this.dataService.getTasks().subscribe(response => {
      this.tasks = response;
      console.log(this.tasks);
      console.log(this.tasks[0].subtasks)

      // tasks nach status sortieren
      this.todo = this.tasks.filter((task:any) => task.status.title === 'todo');
      this.inProgress = this.tasks.filter((task:any) => task.status.title === 'inProgress');
      this.awaitingFeedback = this.tasks.filter((task:any) => task.status.title === 'awaitingFeedback');
      this.done = this.tasks.filter((task:any) => task.status.title === 'done');
      
    });
    
   
  }

ngOnInit(): void {
    console.log();
}
  // todo = ['Get to work', 'Pick up groceries'];

  // done = ['Get up', 'Brush teeth'];

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
      const newStatus = this.getStatusByContainerId(event.container.id);
      movedTask.status.title = newStatus;
    }
  }

  getStatusByContainerId(id: string): string {
    switch (id) {
      case 'todoList': return 'todo';
      case 'inProcessList': return 'inProcess';
      case 'awaitingFeedbackList': return 'awaitingFeedback';
      default: return 'done';
    }
  }
}
