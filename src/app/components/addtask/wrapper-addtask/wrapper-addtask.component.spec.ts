import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperAddtaskComponent } from './wrapper-addtask.component';

describe('WrapperAddtaskComponent', () => {
  let component: WrapperAddtaskComponent;
  let fixture: ComponentFixture<WrapperAddtaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WrapperAddtaskComponent]
    });
    fixture = TestBed.createComponent(WrapperAddtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
