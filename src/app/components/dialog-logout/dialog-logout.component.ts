import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WrapperAddtaskComponent } from '../addtask/wrapper-addtask/wrapper-addtask.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dialog-logout',
  templateUrl: './dialog-logout.component.html',
  styleUrls: ['./dialog-logout.component.scss']
})
export class DialogLogoutComponent {

  constructor(public dialog: MatDialogRef<WrapperAddtaskComponent> , public dataService: DataService ){}
  goto(){}
 
}
