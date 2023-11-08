import { Component, Inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Contact } from 'src/app/models/contact.class';
import { Category } from 'src/app/models/category.class';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { Subscription } from 'rxjs';

// Importieren Sie den Dialog-Komponenten, den Sie erstellen werden.

 export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  URGENT = 'urgent'
}
interface PriorityType {
  key: Priority;
  value: string;
}


@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit, OnDestroy {
  Priority = Priority;
  private contactsSub: Subscription;
  private categoriesSub: Subscription;
  editMode = false;
  @Input() data: any;

  newCategoryTitle: string = '';
  showNewCategoryInput: boolean = false;
  
 

  subtaskValues: { title: string, completed: boolean }[] = [];
  tomorrow: string = this.getTomorrowDate();
  priority?: PriorityType; 
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

  categoryForm: FormGroup = new FormGroup({
    newCategoryTitle: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required)
  })


  constructor(private fb: FormBuilder, private dataService: DataService, private route: Router) {
  
    this.contactsSub = this.dataService.getContacts().subscribe((response: Contact[]) => {
      this.contacts = response;
   
      if (this.editMode && this.data.task && this.data.task.assigned) {

          const assignedContacts = this.data.task.assigned.map((assignedId: number) =>
          this.contacts.find(contact => contact.id === assignedId)
        ).filter((contact: Contact | undefined) => !!contact); // filtert undefined Werte heraus, falls ein Kontakt nicht gefunden wurde
        console.log('constructor - assignedContacts: ', assignedContacts);
        this.taskForm.get('assigned')?.setValue(assignedContacts);
      }

    });
    this.categoriesSub = this.dataService.getCategories().subscribe(response => {
      this.categories = response;
      console.log('load2', this.categories);
      if (this.editMode) {
        const categoryToSet = this.categories.find(cat => cat.id === this.data.task.category.id);
        this.taskForm.get('category')?.setValue(categoryToSet || null);
      }

    });
  }

  setFormValues(data: any): void {
    if (data) {
      this.editMode = data.editMode;
      this.subtaskValues = data.subtasks;
      const formattedDueDate = this.convertToYYYYMMDD(data.task.dueDate);


      if (this.editMode) {
        this.priority = data.task.priority;
        console.log('subtask', this.subtaskValues);
        this.taskForm.patchValue({
          ...this.data.task,
          dueDate: formattedDueDate,
          priority: this.priority,
          subtasks: this.subtaskValues
          
          // category: data.task.category.title,
          // assigned: selectedContacts,
          // status: data.task.status.title.toLowerCase() 
        });
        this.priority = data.task.priority;
       
      }
      console.log('setFormValues - data:', data);
      console.log('setFormValues - active category:', data.task.category.title);
     
    } else {
      this.editMode = false;
     }
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
console.log('prio key: ', Priority.LOW);
    this.setFormValues(this.data);
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

  setPriority(newPriority: PriorityType) {
    const priorityKey: Priority = newPriority.key;
    // Der Wert sollte bereits ein Kleinbuchstabe sein, wie im Enum definiert
    const priorityValue = newPriority.value.toLowerCase();

    const priorityToSend: PriorityType = {
      key: priorityKey, // Direkt zuweisen, da es vom Typ Priority ist
      value: newPriority.value // Der Wert sollte bereits in Kleinbuchstaben sein.
    };

    this.priority = priorityToSend;
    console.log(this.priority);
    this.taskForm.get('priority')?.setValue(newPriority.value);
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
       
        console.log('taskData:', taskData);
        console.log('Task gespeichert', response)
        this.resetFormAndUI();

         this.route.navigateByUrl('/home/board').then(()=> {
          this.dataService.cachedTasks = null;
          this.dataService.fetchAndSortTasks();
         });


      }, error => {
        console.error('Error:', error);
      });
    }
  }

  editTask() {
    
    if (this.taskForm.valid) {
      // Erstelle eine Kopie von taskData, um die Originaldaten nicht zu verändern
      const taskData = { ...this.taskForm.value };
      // const taskData = this.taskForm.value;
      taskData.priority = this.priority;
      console.log('taskData in editTask', taskData);


      taskData.assigned = taskData.assigned.map((contact: Contact) => contact.id);
      console.log('body:', taskData);
      this.dataService.editTask(taskData, this.data.task.id).subscribe(response => {

        console.log('taskData:', taskData);
        console.log('Task gespeichert', response)
        this.resetFormAndUI();

         this.route.navigateByUrl('/home/board').then(()=> {
          this.dataService.cachedTasks = null;
          this.dataService.fetchAndSortTasks();
         });


      }, error => {
        console.error('Error:', error);
      });
    }
  }
  createNewCategory() {
    this.showNewCategoryInput = true;
  }

  enableNewCategoryInput() {
    this.showNewCategoryInput = true;
  }

  resetFormAndUI() {
    // Formularwerte zurücksetzen
    this.taskForm.reset({
      dueDate: this.getTomorrowDate(),
      priority: '',
      status: 'todo'
    });

    this.categoryForm.reset();

    // UI-Zustände zurücksetzen
    this.priority = {key: Priority.LOW, value: 'low'};
    this.subtaskValues = [];
    this.showNewCategoryInput = false;
    this.selectedContacts = [];


  }
  saveNewCategory() {
    const newCategoryTitleValue = this.categoryForm.get('newCategoryTitle')?.value;
    this.newCategoryTitle = newCategoryTitleValue;
    if (newCategoryTitleValue) {
      const newCategory = new Category({
        title: this.newCategoryTitle,
        color: this.generateDarkColor()
      });

      this.categories.push(newCategory);
      // this.taskForm.get('category')?.setValue(newCategory);
      this.showNewCategoryInput = false;
      this.newCategoryTitle = '';
      this.dataService.saveNewCategory(newCategory).subscribe(response => {
        console.log('Category saved', response);
        if (response && response.id) {
          newCategory.id = response.id;
          newCategory.author = response.author; // Stellen Sie sicher, dass 'author' in der Antwort enthalten ist
        }
        console.log('Category saved', response.id);
        const categoryToSelect = this.categories.find(cat => cat.title === newCategory.title);
        if (categoryToSelect) {
          this.taskForm.get('category')?.setValue(categoryToSelect);
        }
      }, error => {
        console.log(error);
      })

    }

  }
  refreshCategories() {
    this.dataService.getCategories().subscribe(response => {
      this.categories = response;
      console.log(this.categories);
    });
  }

  cancelNewCategory() {
    this.showNewCategoryInput = false;
    this.newCategoryTitle = '';
  }

  cancelSubtask(inputElem: HTMLInputElement) {
    inputElem.value = '';
  }

  deleteSubtask(sub: string) {
    this.subtaskValues = this.subtaskValues.filter(subtask => subtask.title !== sub);

    const subtasksArray = this.taskForm.get('subtasks') as FormArray;
    const indexToRemove = subtasksArray.controls.findIndex(control => control.get('title')?.value === sub);
    if (indexToRemove > -1) {
      subtasksArray.removeAt(indexToRemove);
    }
  }

  generateDarkColor(): string {
    // Funktion um eine zufällige dunkle Farbkomponente zu generieren
    function randomDarkComponent(): number {
      return Math.floor(Math.random() * (200 - 80 + 1) + 80); // Werte zwischen 80 und 200
    }

    // Erzeugt die RGB-Komponenten
    const r = randomDarkComponent();
    const g = randomDarkComponent();
    const b = randomDarkComponent();

    // Gibt die Farbe im #xxxxxx Format zurück
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  convertToYYYYMMDD(dateIsoString: string): string {
    const dateObj = new Date(dateIsoString);
    const year = dateObj.getFullYear();
    // getMonth() gibt einen 0-basierten Index zurück, daher +1 für einen 1-basierten Monat
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    // Verwenden Sie padStart um sicherzustellen, dass Monat und Tag immer zweistellig sind
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  closeDialog() {
    // this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.contactsSub) {
      this.contactsSub.unsubscribe();
    }

    if (this.categoriesSub) {
      this.categoriesSub.unsubscribe();
    }
    console.log('kaputtboardzu');
  }

}
