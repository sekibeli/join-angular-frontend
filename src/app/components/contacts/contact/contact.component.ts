import { Component, Input } from '@angular/core';

import { Contact } from 'src/app/models/contact.class';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
@Input() contact?: Contact;

showContactDetail(contact:Contact | undefined){
  
}


}
