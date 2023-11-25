import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Contact } from 'src/app/models/contact.class';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
@Input() contact?: Contact;
@Output() contactSelected = new EventEmitter<Contact>();

showContactDetail():void{
  this.contactSelected.emit(this.contact);
}


}
