import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { TaskComponent } from './task.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatProgressBarModule],
      declarations: [TaskComponent]
    });
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    component.task = { subtasks: [], assigned: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
