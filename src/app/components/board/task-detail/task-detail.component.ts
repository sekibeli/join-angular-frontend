import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { AddtaskComponent } from '../../addtask/addtask.component';
import { WrapperAddtaskComponent } from '../../addtask/wrapper-addtask/wrapper-addtask.component';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  taskId?: number;
  public task: any;
  assigned: any;
  subtasks: any;
  constructor(private dataService: DataService, @Inject(MAT_DIALOG_DATA) public id: number, public dialogRef: MatDialogRef<TaskDetailComponent>, private dialog: MatDialog) {
    this.taskId = id;


    this.dataService.getTaskById(this.taskId).subscribe(response => {
      this.task = response;

      if (this.task && this.task.assigned) {
        this.dataService.getContactsByIds(this.task.assigned).subscribe(assignedResponse => {
          this.assigned = assignedResponse;
          // console.log('detail-assigned:', this.assigned);
        });
      }

      if (this.task && this.task.subtasks) {
        this.dataService.getSubtasksByIds(this.task.subtasks).subscribe(subtaskResponse => {
          this.subtasks = subtaskResponse;
          // console.log('subbies:', this.subtasks);

        });
      }


    })

  }

  ngOnInit(): void {

  }

  closeDialog() {
    this.dialogRef.close();
  }

  deleteTask(taskId: number) {
    this.dataService.deleteTask(taskId).subscribe(response => {
      // console.log(response);
      this.dataService.fetchAndSortTasks();
      this.dialogRef.close();
    })
  }

  openEditTask(task: any) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.minWidth = '80vw';
    dialogConfig.minHeight = '90vh';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '90vh';


    dialogConfig.data = {
      task: task,
      assigned: this.assigned,
      subtasks: this.subtasks,
      editMode: true,
      overlayMode: false,
    };
   
    this.dialog.open(WrapperAddtaskComponent, dialogConfig);

    
    this.dialogRef.close();
  }
}
