import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { SummaryComponent } from './components/summary/summary.component';
import { BoardComponent } from './components/board/board.component';
import { AddtaskComponent } from './components/addtask/addtask.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TaskComponent } from './components/board/task/task.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TaskDetailComponent } from './components/board/task-detail/task-detail.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    MainComponent,
    SummaryComponent,
    BoardComponent,
    AddtaskComponent,
    ContactsComponent,
    TaskComponent,
    TaskDetailComponent,
   

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    DragDropModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
