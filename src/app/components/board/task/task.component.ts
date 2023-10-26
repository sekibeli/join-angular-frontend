import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
@Input() task:any;
subtasks: any[] = [];
public percent!: number;
public completedCount!: number;
assigned: any[] = [];

constructor(private dataService: DataService){}


ngOnInit(): void {
  this.dataService.getSubtasksByIds(this.task.subtasks).subscribe(subtaskResponse => {
    this.subtasks = subtaskResponse;
      this.getCompletedSubtasksPercentage();
});

this.dataService.getContactsByIds(this.task.assigned).subscribe(assignedResponse => {
  this.assigned = assignedResponse;
  console.log('assigned:',this.assigned);
})

}

getCompletedSubtasksPercentage(){
  this.completedCount = this.subtasks.filter((subtask:any) => subtask.completed).length;
  this.percent = ( this.completedCount / this.subtasks.length) * 100;
}
}
