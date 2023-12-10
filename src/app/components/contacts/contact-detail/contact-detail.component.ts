import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, lastValueFrom, map } from 'rxjs';
import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';
import { AddContactComponent } from '../add-contact/add-contact.component';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit, OnChanges {
  @Input() contact?: Contact | null;
  id?: number;
  selectedContact?:Contact;
  selectedContact$?: Observable<Contact | undefined>;

  constructor(public dataService: DataService, private dialog: MatDialog){
   
   
   

   

  }

  ngOnInit(): void {
    
    if (this.contact && this.contact.id) {
      this.id = this.contact.id;
      this.fetchSelectedContact();
    }
    // this.dataService.contactUpdated.subscribe(updatedContact => {
    //   if (updatedContact && this.id === updatedContact.id) {
    //     this.contact = updatedContact;
       
    //   }
    // });
    
   
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.contact && this.contact.id) {
      this.id = this.contact.id;
      this.selectedContact$ = this.dataService.contacts$.pipe(
        map(contacts => contacts.find(c => c.id === this.id))
       
      );
    }
  }
  fetchSelectedContact(): void {
    this.dataService.contacts$.subscribe(contacts => {
      if (contacts && this.id) {
        this.selectedContact = contacts.find(c => c.id === this.id);
      }
    });
  }
  
  editContact(contact:Contact) {

    const dialogConfig = new MatDialogConfig();
  
    // dialogConfig.minWidth = '300px';
    // dialogConfig.minHeight = '60vh';
    // dialogConfig.maxWidth = '600px';
    // dialogConfig.maxHeight = '60vh';
    

    if (this.dataService.isSmallScreen){
      dialogConfig.width = '320px';
      dialogConfig.height = '500px';
    }
    else {
      dialogConfig.width = '720px';
      dialogConfig.height = '400px';
    }
  
  
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

closeDetail(){
  this.dataService.detailVisible = false;
  this.dataService.showTheDetails = false;
  this.dataService.showIt = true;
}

}
