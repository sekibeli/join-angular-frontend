import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
taskId?: number;
public task: any;
assigned: any;
  constructor(private dataService: DataService, @Inject(MAT_DIALOG_DATA) public id: number){
this.taskId = id;

this.dataService.getTaskById(this.taskId).subscribe(response => {
  this.task = response;

  if (this.task && this.task.assigned) {
    this.dataService.getContactsByIds(this.task.assigned).subscribe(assignedResponse => {
      this.assigned = assignedResponse;
      console.log('detail-assigned:',this.assigned);
    }); 
    }
})
    
  }

  ngOnInit(): void {
   
  }
  
}
