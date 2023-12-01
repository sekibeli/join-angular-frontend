import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';
import { AddtaskComponent } from '../addtask/addtask.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';


type MatDrawerMode = 'over' | 'push' | 'side';

interface GroupedContacts {
  [key: string]: Contact[];
}
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  private userStatusSubscription?: Subscription;
  // private userChangeSubscription?: Subscription;
public contacts = new BehaviorSubject<any[]>([]);
public selectedContact: Contact | null = null;
public isDetailVisible?: boolean;
public showDetails?: boolean = false;
// public rightDrawerMode: string = "side";


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



  constructor(public dataService: DataService, private dialog: MatDialog){
    this.loadContacts();
  }

ngOnInit(): void {
    
  this.userStatusSubscription = this.dataService.userStatus$.subscribe(user => {
    if (user) {
      // Benutzer ist angemeldet, lade Kontakte
      this.loadContacts();
    } else {
      // Kein Benutzer angemeldet, leere die Kontaktliste
      // this.contacts = [];
    }
  });
 
}

private loadContacts(){
  this.dataService.contacts$.subscribe(contacts => {
    this.contacts.next(contacts)
    console.log('contacts geladen', this.contacts.value);
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

rightDrawerMode(): MatDrawerMode {
  return (this.dataService.isSmallScreen) ? 'over' : 'side';
}

toggleDetailVisibility() {
  this.isDetailVisible = !this.isDetailVisible;
}

@HostListener('window:resize', ['$event'])
onResize(event: Event) {
  this.checkScreenSize();
}

checkScreenSize() {
  if(window.innerWidth < 600) {
    this.dataService.isSmallScreen = true;
  } else {
    this.dataService.isSmallScreen = false;
  }
  console.log('isSmallScreen:', this.dataService.isSmallScreen);
}

showContactDetails(){
  this.showDetails = false;
}

ngOnDestroy(): void {
  // Bereinigen des Abonnements
  this.userStatusSubscription?.unsubscribe();
}
}
