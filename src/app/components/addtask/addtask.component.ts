import { Component, Inject, EventEmitter, Input, Output, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Contact } from 'src/app/models/contact.class';
import { Category } from 'src/app/models/category.class';
import { Subtask } from 'src/app/models/subtask.class';
import { DataService, Status } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { Subscription, lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit, OnDestroy {
  @Output() closeEvent = new EventEmitter<void>();  //Möglichkeit die Elternkomponente von der Kinderkomponente aus zu schließen.
  private contactsSub: Subscription;
  private categoriesSub: Subscription;
  editMode = false;
  @Input() overlayMode?:boolean;
  @Input() data: any;

  newCategoryTitle: string = '';
  showNewCategoryInput: boolean = false;


  subtaskValues: { id: number, title: string, completed: boolean, task: number }[] = [];
  tomorrow: string = this.getTomorrowDate();
  priority?: string;
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
    status: new FormControl(Status.todo, Validators.required)

  })

  categoryForm: FormGroup = new FormGroup({
    newCategoryTitle: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required)
  })


  constructor(private fb: FormBuilder, private dataService: DataService, private route: Router) {

    // this.dataService.getCategories().subscribe((categories)=> {
    //   this.categories = categories;
    //   console.log('hier:', categories);
    // });
    this.categoriesSub = this.dataService.categories$.subscribe((response: Category[]) => {
      this.categories = response;
      // this.editMode = true;
      // console.log(this.categories);
      if (this.editMode && this.data) {
        const categoryToSet = this.categories.find(cat => cat.id === this.data.task.category);
        this.taskForm.get('category')?.setValue(categoryToSet || null);
      }
    });

    this.contactsSub = this.dataService.contacts$.subscribe((response: Contact[]) => {
      this.contacts = response;
      // this.editMode = true;
      // console.log(this.contacts);

      if (this.editMode && this.data) {

        const assignedContacts = this.data.task.assigned.map((assignedId: number) =>
          this.contacts.find(contact => contact.id === assignedId)
        ).filter((contact: Contact | undefined) => !!contact); // filtert undefined Werte heraus, falls ein Kontakt nicht gefunden wurde

        this.taskForm.get('assigned')?.setValue(assignedContacts);
      }

    });
    // this.categoriesSub = this.dataService.getCategories().subscribe(response => {
    //   this.categories = response;

    //   if (this.editMode && this.data) {
    //     const categoryToSet = this.categories.find(cat => cat.id === this.data.task.category);
    //     this.taskForm.get('category')?.setValue(categoryToSet || null);
    //   }
    // });
  }
  closeParent() {
    this.closeEvent.emit();
  }

  setFormValues(data: any): void {
    if (data) {
      this.editMode = data.editMode;
      this.subtaskValues = data.subtasks;
      // console.log('mit ids:', this.subtaskValues);
      this.initializeSubtaskFormArray();
      const formattedDueDate = this.convertToYYYYMMDD(data.task.dueDate);

      if (this.editMode) {
        this.priority = data.task.priority;
        this.taskForm.patchValue({
          ...this.data.task,
          dueDate: formattedDueDate,
          priority: this.priority,
          subtasks: this.subtaskValues

        });
        this.priority = data.task.priority;
      }

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

    this.setFormValues(this.data);

    if (this.editMode && this.data.task && this.data.task.assigned) {

      const assignedContacts = this.data.task.assigned.map((assignedId: number) =>
        this.contacts.find(contact => contact.id === assignedId)
      ).filter((contact: Contact | undefined) => !!contact); // filtert undefined Werte heraus, falls ein Kontakt nicht gefunden wurde
      // console.log('constructor - assignedContacts: ', assignedContacts);
      this.taskForm.get('assigned')?.setValue(assignedContacts);
    }

    if (this.editMode) {
      const categoryToSet = this.categories.find(cat => cat.id === this.data.task.category);
      this.taskForm.get('category')?.setValue(categoryToSet || null);
    }


  }

  getTomorrowDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Add one day
    const tomorrowDate = new Date(today); // Erstelle eine Kopie des Datums
    return tomorrowDate.toISOString().substr(0, 10); // Format as "yyyy-MM-dd" for input[type="date"]
  }


  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  isSelected(contact: Contact): boolean {
    return this.taskForm.get('contact-' + contact.id)?.value === true;
  }


  setPriorityNew(newPrio: string) {
    this.priority = newPrio;
    this.taskForm.get('priority')?.setValue(newPrio);
    // console.log(this.taskForm);
  }

  addSubtask(subtaskTitle: string, inputElem: HTMLInputElement) {
    let newSubtask: any = {};
    if (subtaskTitle.length === 0) {
      return;
    }
    const subtasksArray = this.taskForm.get('subtasks') as FormArray;

    if (this.editMode) {
      newSubtask = new FormGroup({
        title: new FormControl(subtaskTitle),
        completed: new FormControl(false),
        task: new FormControl(this.data.task.id)
      });
    } else {
      newSubtask = new FormGroup({
        title: new FormControl(subtaskTitle),
        completed: new FormControl(false),

      });
    }
    subtasksArray.push(newSubtask);

    subtaskTitle = '';
    // this.taskForm.get('subtaskInput')?.reset();
    inputElem.value = '';
    this.subtaskValues = subtasksArray.controls.map((control) => control.value);
  }

  submitTask() {

    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      taskData.category = taskData.category.id;
      taskData.status = this.dataService.Status.todo;

      this.dataService.saveTask(taskData).subscribe(response => {
        this.resetFormAndUI();

        this.route.navigateByUrl('/home/board').then(() => {
          this.dataService.cachedTasks = null;
          this.dataService.fetchAndSortTasks();
        });


      }, error => {
        console.error('Error:', error);
      });
    }
    if(this.overlayMode){
      this.closeParent();
    }
  }

  async editTask() {

    if (this.taskForm.valid) {

      // Erstellt eine Kopie von taskData, um die Originaldaten nicht zu verändern
      const taskData = { ...this.taskForm.value };

      taskData.category = taskData.category.id; // Todo: Richtig in Formdata speichern
      taskData.status = taskData.status.id; // Todo: Richtig in Formdata speichern

      const subbies = this.taskForm.value.subtasks
      const subtasksWithId = subbies.filter(
        (subtask: Subtask) => subtask.id !== undefined && subtask.id !== null);

      // Filtert Subtasks ohne ID
      const subtasksWithoutId = subbies.filter((subtask: Subtask) => subtask.id === undefined || subtask.id === null);

      //updated bestehende subtasks
      await lastValueFrom(this.dataService.updateSubtasks(subtasksWithId))



      if (subtasksWithoutId.length > 0) {
        await lastValueFrom(this.dataService.saveSubtasks(subtasksWithoutId, this.data.task.id)).then(response => {
          lastValueFrom(this.dataService.getSubtasksByTaskId(this.data.task.id)).then(response => {
            taskData.subtasks = response;
          })
        }

        );
      }


      taskData.priority = this.priority;

      taskData.assigned = taskData.assigned.map((contact: Contact) => contact.id);

      if (taskData.subtasks && Array.isArray(taskData.subtasks)) {
        taskData.subtasks = taskData.subtasks.map((subtask: Subtask) => subtask.id); // oder subtask.pk, je nachdem, wie Ihre Datenstruktur aussieht
      }
      delete taskData.subtasks; // lösche den Bereich subtasks weil schon im Backend vorhanden.

      //speichert das veränderte Task
      this.dataService.editTask(taskData, this.data.task.id).subscribe(response => {

        this.resetFormAndUI();

        this.route.navigateByUrl('/home/board').then(() => {
          this.dataService.cachedTasks = null;
          this.dataService.fetchAndSortTasks();

        });


      }, error => {
        console.error('Error:', error);
        this.dataService.fetchAndSortTasks();
      });
    }
    this.closeParent();
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
        // console.log('Category saved', response);
        if (response && response.id) {
          newCategory.id = response.id;
          newCategory.author = response.author; // Stellen Sie sicher, dass 'author' in der Antwort enthalten ist
        }
        // console.log('Category saved', response.id);
        const categoryToSelect = this.categories.find(cat => cat.title === newCategory.title);
        if (categoryToSelect) {
          this.taskForm.get('category')?.setValue(categoryToSelect);
        }
      }, error => {
        console.log(error);
      })

    }

  }
  // refreshCategories() {
  //   this.dataService.getCategories().subscribe(response => {
  //     this.categories = response;
  //      console.log(this.categories);
  //   });
  // }

  cancelNewCategory() {
    this.showNewCategoryInput = false;
    this.newCategoryTitle = '';
  }

  cancelSubtask(inputElem: HTMLInputElement) {
    inputElem.value = '';
  }

  deleteSubtask(sub: string, id: number) {
    // console.log('id', id);
    this.subtaskValues = this.subtaskValues.filter(subtask => subtask.title !== sub);

    const subtasksArray = this.taskForm.get('subtasks') as FormArray;
    const indexToRemove = subtasksArray.controls.findIndex(control => control.get('title')?.value === sub);
    if (indexToRemove > -1) {
      subtasksArray.removeAt(indexToRemove);
    }
    if (id != undefined) {
      this.dataService.deleteSubtask(id).subscribe(response => {
        // console.log('subtask gelöscht', response);
      })
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
  // closeDialog() {
  //   // this.dialogRef.close();
  // }

  ngOnDestroy(): void {
    if (this.contactsSub) {
      this.contactsSub.unsubscribe();
    }

    if (this.categoriesSub) {
      this.categoriesSub.unsubscribe();
    }
  }

  // Aktualisieren von subtaskValues bei Änderungen im FormArray
  updateSubtaskValuesFromForm() {
    const subtasksArray = this.taskForm.get('subtasks') as FormArray;
    this.subtaskValues = subtasksArray.value;
  }

  initializeSubtaskFormArray() {
    const subtasksArray = this.taskForm.get('subtasks') as FormArray;
    // console.log('Inhalt:',subtasksArray);
    subtasksArray.clear(); // Bestehende Einträge im Array löschen

    this.subtaskValues.forEach(subtask => {
      const subtaskFormGroup = new FormGroup({
        id: new FormControl(subtask.id),
        title: new FormControl(subtask.title),
        completed: new FormControl(subtask.completed),
        task: new FormControl(subtask.task)
      });

      subtasksArray.push(subtaskFormGroup);
    });
  }
}
