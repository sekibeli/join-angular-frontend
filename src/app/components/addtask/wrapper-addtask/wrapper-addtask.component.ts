import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-wrapper-addtask',
  templateUrl: './wrapper-addtask.component.html',
  styleUrls: ['./wrapper-addtask.component.scss']
})
export class WrapperAddtaskComponent {

  constructor(private dialogRef: MatDialogRef<WrapperAddtaskComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any){
    console.log('data Wrapper:', data);
  }


  closeDialog(){
    this.dialogRef.close();
  }
}
