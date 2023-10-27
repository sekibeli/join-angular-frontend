// import { TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AppComponent } from './app.component';

// describe('AppComponent', () => {
//   beforeEach(() => TestBed.configureTestingModule({
//     imports: [RouterTestingModule],
//     declarations: [AppComponent]
//   }));

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it(`should have as title 'join-angular-frontend'`, () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app.title).toEqual('join-angular-frontend');
//   });

//   it('should render title', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('.content span')?.textContent).toContain('join-angular-frontend app is running!');
//   });
// });

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule, FormsModule], // Verwenden Sie die "routes"-Konstante, die Sie definiert haben
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  }));

  it('should redirect to "login" route on startup', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/login');
    });
  }));

  // it('should navigate to "home" route', async(() => {
  //   router.navigate(['home']);
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(location.path()).toBe('/home');
  //   });
  // }));

  // it('should navigate to default child route inside "home"', async(() => {
  //   router.navigate(['home']);
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(location.path()).toBe('/home');
  //     // Hier könnte man noch weitere Überprüfungen hinzufügen, 
  //     // z.B. ob die MainComponent korrekt gerendert wurde.
  //   });
  // }));
});
