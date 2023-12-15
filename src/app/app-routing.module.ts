import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/main/main.component';
import { SummaryComponent } from './components/summary/summary.component';
import { BoardComponent } from './components/board/board.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AddtaskComponent } from './components/addtask/addtask.component';
import { SignupComponent } from './components/signup/signup.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { HelpComponent } from './components/help/help.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'home', component: HomeComponent,
    
    children: [
      { path: '', component: MainComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'board', component: BoardComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'addtask', component: AddtaskComponent},
      { path: 'impressum', component: ImpressumComponent},
      { path: 'help', component: HelpComponent}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


