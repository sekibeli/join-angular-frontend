import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {

  constructor(private dataService: DataService){}
  contact: Contact | null = null;

  contactForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
   email: new FormControl('', Validators.required),
    phone: new FormControl(null, Validators.required),
 

  })

  closeNewContact(){}

  submitContact(){
if(this.contactForm.valid){
  this.contact = this.contactForm.value as Contact;

  this.contact.initials = this.getInitials(this.contact.name)

  this.contact.color = this.dataService.generateDarkColor();
  console.log(this.contact);
  lastValueFrom(this.dataService.saveContact(this.contact)).then((response)=> {
    console.log(response);
  })
}
  

  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    const initials = parts.map(part => part[0]).join('');
    return initials;
}
}
