import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
editMode: boolean;
originalContact?: Contact;
contact: Contact | null = null;
editedContact: Contact | null = null;

contactForm: FormGroup = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', Validators.required),
  phone: new FormControl(null, Validators.required),


})

  constructor(private dataService: DataService, @Inject(MAT_DIALOG_DATA) public data: any , public dialogRef: DialogRef) { 
    this.editMode = this.data.editMode;
    if(this.data.editMode)
    
    {
      this.originalContact = JSON.parse(JSON.stringify(this.data.contact));
      console.log(this.originalContact);
    }
  }
 
  ngOnInit(): void {
  
      this.setFormValues(this.data.contact)
    
      
  }

  closeNewContact() { }

  submitContact() {
    if (this.contactForm.valid) {
      this.contact = this.contactForm.value as Contact;

      this.contact.initials = this.getInitials(this.contact.name)

      this.contact.color = this.dataService.generateDarkColor();
      console.log(this.contact);
      lastValueFrom(this.dataService.saveContact(this.contact)).then((response) => {
        console.log(response);
        this.dataService.getContacts();
      })
    }
    this.dialogRef.close();

  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    const initials = parts.map(part => part[0]).join('');
    return initials;
  }
  cancel(){
    Object.assign(this.data.contact, this.originalContact);
     this.dialogRef.close();
    }

    // updateContact(){
    //   // this.dataService.setUserName(this.data.user['id'], this.data.user['username']);
    //   this.dialogRef.close();
    // }

    setFormValues(data: any): void {
      if (data) {
      //   this.editMode = data.editMode;
      //   this.subtaskValues = data.subtasks;
      //   // console.log('mit ids:', this.subtaskValues);
      //   this.initializeSubtaskFormArray();
      //   const formattedDueDate = this.convertToYYYYMMDD(data.task.dueDate);
  
        if (this.data.editMode) {
          // this.priority = data.task.priority;
          this.contactForm.patchValue({
            ...this.data.contact,
            name: this.data.contact.name,
            email: this.data.contact.email,
            phone: this.data.contact.phone
  
          });
          
        }
  
      } else {
        this.editMode = false;
      }
    }


    async editContact() {

      if (this.contactForm.valid) {
  
        // Erstellt eine Kopie von contactData, um die Originaldaten nicht zu verändern
        const contactData = { ...this.contactForm.value };
  
        //speichert den veränderten Contact
        this.dataService.editContact(contactData, this.data.contact.id).subscribe(response => {
          console.log('response: ', response);
          this.editedContact = response as Contact;
          this.dataService.contactUpdated.next(this.editedContact);
          this.dataService.getContacts();
        }, error => {
          console.error('Error:', error);
      
        });
      }

     
      this.dialogRef.close();
    }
  
}
