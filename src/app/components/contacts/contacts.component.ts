import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';
import { AddtaskComponent } from '../addtask/addtask.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

interface GroupedContacts {
  [key: string]: Contact[];
}
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
public contacts = new BehaviorSubject<any[]>([]);
public selectedContact: Contact | null = null;



contacts$ = this.dataService.contacts$.pipe(
  map((contacts: Contact[]) => {
    const grouped = contacts.reduce<GroupedContacts>((acc, contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {});

    return grouped;
  })
);



  constructor(private dataService: DataService, private dialog: MatDialog){}

ngOnInit(): void {
    

  this.dataService.contacts$.subscribe(contacts => {
    this.contacts.next(contacts)
    console.log(this.contacts.value);
  })
}

getKeys(obj: { [key: string]: any }): string[] {
  return Object.keys(obj);
}
addNewContact() {

  const dialogConfig = new MatDialogConfig();

  dialogConfig.minWidth = '60vw';
  dialogConfig.minHeight = '60vh';
  dialogConfig.maxWidth = '100vw';
  dialogConfig.maxHeight = '60vh';


  dialogConfig.data = {
   
  
    editMode: false
  };
 
  this.dialog.open(AddContactComponent, dialogConfig);

  

}

showContactDetail(contact: Contact): void {
  this.selectedContact = contact;
}



}
