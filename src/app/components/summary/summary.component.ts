import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(public dataService: DataService, private route: Router) { }

 async ngOnInit(): Promise<void> {
    await this.dataService.fetchAndSortTasks();
    await this.dataService.getTasks().subscribe(response => {
      this.tasks = response;
      // console.log(this.tasks);

    });
    
    await lastValueFrom(this.dataService.getCurrentUser()).then((user: any) => {
      this.currentUser = user;
    })
  }

  goToBoard(){
    this.route.navigateByUrl('/home/board');
  }

  getGreetingBasedOnTime(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 4 && currentHour < 11) {
        return "Guten Morgen";
    } else if (currentHour >= 11 && currentHour < 18) {
        return "Guten Tag";
    } else {
        return "Guten Abend";
    }
}
}
