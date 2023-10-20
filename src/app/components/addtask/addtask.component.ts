import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Contact } from 'src/app/models/contact.class';
import { Category } from 'src/app/models/category.class';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit{
  priority: string = '';
    contacts: Contact[] = [];
    categories: Category[] = [];
    selectedContacts: Contact[] = [];
    showDropdown: boolean = false;
 
    taskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    assigned: new FormControl('', Validators.required),
    dueDate: new FormControl(null, [Validators.required, this.validateDate]),
    category: new FormControl(null, Validators.required),
    subtasks: new FormControl('', Validators.required)

  })

 

  constructor(private fb: FormBuilder, private dataService: DataService){
    // this.contacts = [];
  }

  validateDate(control: AbstractControl) {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    if (selectedDate <= currentDate) {
      return { invalidDate: true };
    }

    return null;
  }


  ngOnInit():void{
    this.dataService.getContacts().subscribe(response => {
      this.contacts = response;
      console.log(this.contacts);

    });
    this.dataService.getCategories().subscribe(response => {
      this.categories = response;
      console.log(this.categories);

    });
  }

 

toggleDropdown() {
  console.log(this.showDropdown)
    this.showDropdown = !this.showDropdown;
}

isSelected(contact: Contact): boolean {
  return this.taskForm.get('contact-' + contact.id)?.value === true;
}

setPriority(newPriority: string) {
  this.priority = newPriority;
}

// addSubtask(){
//   const subtaskValue = this.subtaskForm.get('subtask').value;

//   if (subtaskValue) {
//     // Hier können Sie die Logik zum Speichern der Subtask im Backend implementieren.
//     // Z.B. durch einen API-Aufruf.
//     // Dies ist nur ein einfaches Beispiel.
//     console.log('Subtask to save:', subtaskValue);

//     // Optional: Setzen Sie das Inputfeld auf einen leeren Wert nach dem Speichern.
//     this.subtaskForm.get('subtask').setValue('');
//   }
// }
  
}
