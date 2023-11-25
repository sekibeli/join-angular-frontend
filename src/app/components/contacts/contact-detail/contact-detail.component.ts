import { Component, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent {
  @Input() contact?: Contact | null;

  constructor(private dataService: DataService){
    console.log(this.contact);
  }

editContact(){}

deleteContact(contactId: number) {
  lastValueFrom(this.dataService.deleteContact(contactId)).then(response => {
    console.log(response);
    // this.dataService.fetchAndSortTasks();
   this.contact = null;
  
   this.dataService.getContacts();
  })
}


}
