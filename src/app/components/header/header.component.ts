import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
currentUser: any;

constructor(public dataService: DataService){
 lastValueFrom(this.dataService.getCurrentUser()).then((user: any) => {
    this.currentUser = user;
    console.log(this.currentUser);
  })
}


}
