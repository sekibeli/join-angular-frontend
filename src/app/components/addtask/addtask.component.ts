import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Contact } from 'src/app/models/contact.class';
import { Category } from 'src/app/models/category.class';
import { DataService } from 'src/app/services/data.service';

// Importieren Sie den Dialog-Komponenten, den Sie erstellen werden.



@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit {
  newCategoryTitle: string = '';
  showNewCategoryInput: boolean = false;
  // subtaskValues: string[] = [];
  subtaskValues: { title: string, completed: boolean }[] = [];
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

  categoryForm: FormGroup = new FormGroup ({
    newCategoryTitle: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required)
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

  addSubtask(subtaskTitle: string, inputElem: HTMLInputElement) {
    if (subtaskTitle.length === 0) {
      return; 
    }
      const subtasksArray = this.taskForm.get('subtasks') as FormArray;
      
      const newSubtask = new FormGroup({
        title: new FormControl(subtaskTitle),
        completed: new FormControl(false),
      });
  
      subtasksArray.push(newSubtask);
  
      subtaskTitle = '';
      // this.taskForm.get('subtaskInput')?.reset();
      inputElem.value = '';
  
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

  createNewCategory(){
    this.showNewCategoryInput  = true;
  }

  enableNewCategoryInput() {
    this.showNewCategoryInput = true;
}

saveNewCategory() {
  const newCategoryTitleValue = this.categoryForm.get('newCategoryTitle')?.value;
  this.newCategoryTitle = newCategoryTitleValue;
    if (newCategoryTitleValue) {
        const newCategory = new Category({
            title: this.newCategoryTitle,
            color: '#552233'          
        });
       
        this.categories.push(newCategory);
        this.taskForm.get('category')?.setValue(newCategory);
        this.showNewCategoryInput = false;
        this.newCategoryTitle = '';
        this.dataService.saveNewCategory(newCategory).subscribe(response => {
          console.log('Category saved', response)
        }, error => {
          console.log(error);
        })
        
    }
}

cancelNewCategory() {
    this.showNewCategoryInput = false;
    this.newCategoryTitle = '';
}

cancelSubtask(inputElem: HTMLInputElement){
  inputElem.value = '';
}

deleteSubtask(sub: string){
  this.subtaskValues = this.subtaskValues.filter(subtask => subtask.title !== sub);

  const subtasksArray = this.taskForm.get('subtasks') as FormArray;
    const indexToRemove = subtasksArray.controls.findIndex(control => control.get('title')?.value === sub);
    if (indexToRemove > -1) {
        subtasksArray.removeAt(indexToRemove);
    }
}
}
