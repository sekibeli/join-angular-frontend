import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-wrapper-addtask',
  templateUrl: './wrapper-addtask.component.html',
  styleUrls: ['./wrapper-addtask.component.scss']
})
export class WrapperAddtaskComponent implements OnInit{
public overlayMode?: boolean;
  constructor(private dialogRef: MatDialogRef<WrapperAddtaskComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any){
  
   
  }

  ngOnInit(){
    // console.log('overlayMode:', this.overlayMode);
  }

  closeDialog(){
    this.dialogRef.close();
  }
  
  closeSelf() {
    this.dialogRef.close();
    // console.log('Elternkomponente wird geschlossen');
  }
}
