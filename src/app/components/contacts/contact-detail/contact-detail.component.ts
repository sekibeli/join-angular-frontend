import { Component, Input, OnInit } from '@angular/core';
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
export class ContactDetailComponent implements OnInit {
  @Input() contact?: Contact | null;
  id?: number;
  selectedContact?:Contact;

  constructor(private dataService: DataService, private dialog: MatDialog){
    console.log(this.contact);
   

   

  }

  ngOnInit(): void {

    if (this.contact) {
      this.id = this.contact.id;
    }
    this.dataService.contacts$.subscribe(contacts => {
      if (this.id !== undefined && this.id < contacts.length) {
        this.selectedContact = contacts[this.id];
        this.contact = contacts[this.id];
        console.log('Empfangener Kontakt: ', contacts[this.id]);
      }
    });
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
    // dialogRef.componentInstance.contact = this.contact ?? null;
    
  
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
