import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtaskComponent } from './addtask.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('AddtaskComponent', () => {
  let component: AddtaskComponent;
  let fixture: ComponentFixture<AddtaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, MatFormFieldModule, MatSelectModule, MatIconModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [AddtaskComponent]
    });
    fixture = TestBed.createComponent(AddtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
