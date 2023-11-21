import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent{
  tasks: any;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getTasks().subscribe(response => {
      this.tasks = response;
      console.log(this.tasks);

    });
    
  }
}
