import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit{
  form!: FormGroup;

  constructor(private fb: FormBuilder){}
  ngOnInit():void{
    this.form = this.fb.group({
      left: this.fb.group({
        title: [''],
        description: ['']
      }),
      right: this.fb.group({
        dueDate: [''],
        priority: ['']
      })
    });
  }

  getLeftForm(): FormGroup {
    return this.form.get('left') as FormGroup;
  }
  
  getRightForm(): FormGroup {
    return this.form.get('right') as FormGroup;
  }
 
}
