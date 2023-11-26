import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';
import { AddContactComponent } from '../add-contact/add-contact.component';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent {
  @Input() contact?: Contact | null;

  constructor(private dataService: DataService, private dialog: MatDialog){
    console.log(this.contact);
  }

  editContact(contact:Contact) {

    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.minWidth = '60vw';
    dialogConfig.minHeight = '60vh';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '60vh';
  
  
    dialogConfig.data = {
      contact: contact,
      editMode: true
    };
   
    const dialogRef = this.dialog.open(AddContactComponent, dialogConfig);
    dialogRef.componentInstance.contact = this.contact ?? null;
    
  
  }

deleteContact(contactId: number) {
  lastValueFrom(this.dataService.deleteContact(contactId)).then(response => {
    console.log(response);
    // this.dataService.fetchAndSortTasks();
   this.contact = null;
  
   this.dataService.getContacts();
  })
}


}
