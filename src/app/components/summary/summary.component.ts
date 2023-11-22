import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent{
  tasks: any;
  currentUser:any;
  constructor(public dataService: DataService) { }

 async ngOnInit(): Promise<void> {
    await this.dataService.fetchAndSortTasks();
    await this.dataService.getTasks().subscribe(response => {
      this.tasks = response;
      console.log(this.tasks);

    });
    
    await lastValueFrom(this.dataService.getCurrentUser()).then((user: any) => {
      this.currentUser = user;
    })
  }
}
