import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';
import { AddtaskComponent } from '../addtask/addtask.component';
import { AddContactComponent } from './add-contact/add-contact.component';

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



contacts$ = this.dataService.getContacts().pipe(
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
    
  this.dataService.getContacts().subscribe(contacts => {
    this.contacts.next(contacts)
    console.log(this.contacts.value);
  })
}

getKeys(obj: { [key: string]: any }): string[] {
  return Object.keys(obj);
}
openAddContact() {

  const dialogConfig = new MatDialogConfig();

  dialogConfig.minWidth = '80vw';
  dialogConfig.minHeight = '90vh';
  dialogConfig.maxWidth = '100vw';
  dialogConfig.maxHeight = '90vh';


  // dialogConfig.data = {
  //   task: task,
  //   assigned: this.assigned,
  //   subtasks: this.subtasks,
  //   editMode: true
  // };
 
  this.dialog.open(AddContactComponent, dialogConfig);

  

}

}
