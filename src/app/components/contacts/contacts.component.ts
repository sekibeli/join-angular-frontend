import { Component, HostListener, OnInit } from '@angular/core';
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
export class ContactsComponent implements OnInit {
  public contacts = new BehaviorSubject<any[]>([]);
  public selectedContact: Contact | null = null;
  // public detailVisible?: boolean =false;
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



  constructor(public dataService: DataService, private dialog: MatDialog) {
    this.loadContacts();
    console.log(this.dataService.detailVisible);
  }

  ngOnInit(): void {

  }

  private loadContacts() {
    this.dataService.contacts$.subscribe(contacts => {
      this.contacts.next(contacts)

    })
  }
  getKeys(obj: { [key: string]: any }): string[] {
    return Object.keys(obj);
  }


  addNewContact() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.minWidth = '90vw';
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

  // toggleDetailVisibility() {
  //   this.detailVisible = !this.detailVisible;
  // }

  showContactsDetails(){
    this.dataService.detailVisible = true;
  }

  hideContactsDetails(){
    this.dataService.detailVisible = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth < 600) {
      this.dataService.isSmallScreen = true;
      this.dataService.detailVisible = false;
    } else {
      this.dataService.isSmallScreen = false;
    }
    console.log('isSmallScreen:', this.dataService.isSmallScreen);
  }

  showContactDetails() {
    this.showDetails = false;
  }


}
