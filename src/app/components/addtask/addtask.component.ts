import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Contact } from 'src/app/models/contact.class';
import { Category } from 'src/app/models/category.class';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit {
  subtaskValues: string[] = [];
  tomorrow: string = this.getTomorrowDate();
  priority: string = '';
  contacts: Contact[] = [];
  categories: Category[] = [];
  selectedContacts: Contact[] = [];
  showDropdown: boolean = false;

  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl(null, Validators.required),
    assigned: new FormControl('', Validators.required),
    dueDate: new FormControl(this.tomorrow, [Validators.required, this.validateDate]),
    priority: new FormControl(this.priority, Validators.required),
    subtasks: new FormArray([]),
    status: new FormControl('todo', Validators.required)

  })



  constructor(private fb: FormBuilder, private dataService: DataService) {
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


  ngOnInit(): void {
    this.dataService.getContacts().subscribe(response => {
      this.contacts = response;
      console.log(this.contacts);

    });
    this.dataService.getCategories().subscribe(response => {
      this.categories = response;
      console.log(this.categories);

    });

  }

  getTomorrowDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Add one day
    const tomorrowDate = new Date(today); // Erstelle eine Kopie des Datums
    return tomorrowDate.toISOString().substr(0, 10); // Format as "yyyy-MM-dd" for input[type="date"]
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
    this.taskForm.get('priority')?.setValue(newPriority);
    console.log(this.priority);
    console.log(this.taskForm);
    
  }

  addSubtask(subtaskTitle: string) {
    const subtasksArray = this.taskForm.get('subtasks') as FormArray;
    // const inputFieldValue = this.taskForm.get('subtaskControl')?.value;

    const newSubtask = new FormGroup({
      title: new FormControl(subtaskTitle),
      completed: new FormControl(false),
    });

    subtasksArray.push(newSubtask);

    subtaskTitle = '';
    this.taskForm.get('subtask')?.reset();

    this.subtaskValues = subtasksArray.controls.map((control) => control.value);
    console.log(this.subtaskValues);
    console.log(this.taskForm)
  }


  submitTask() {
   
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      console.log('body:', taskData);
      this.dataService.saveTask(taskData).subscribe(response => {
        console.log('Response:', response);
    }, error => {
        console.error('Error:', error);
    });
    }
  }

}
