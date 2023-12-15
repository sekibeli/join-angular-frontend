import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DialogLogoutComponent } from '../dialog-logout/dialog-logout.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
currentUser: any;

constructor(public dataService: DataService, private dialog: MatDialog){
 lastValueFrom(this.dataService.getCurrentUser()).then((user: any) => {
    this.currentUser = user;
    // console.log(this.currentUser);
  })
}

getInitials(vorname: string, nachname: string){
  if (vorname.length === 0 || nachname.length === 0) {
    return '';
}
const firstLetter = vorname.charAt(0);
const secondLetter = nachname.charAt(0);
return firstLetter + secondLetter;
}


openLogout() {

  const dialogConfig = new MatDialogConfig();

  dialogConfig.width = '200px';
  dialogConfig.height = '95px';

  dialogConfig.position = {
    top: '100px',  // Ändere diese Werte entsprechend deiner gewünschten Position
    right: '8%'   // Ändere diese Werte entsprechend deiner gewünschten Position
  };

  // dialogConfig.data = {
  
  //  editMode: false,
  //   overlayMode: true
  // };
 
  const dialogRef = this.dialog.open(DialogLogoutComponent, dialogConfig);


}
}
