import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  public tasks:any = [];

  constructor(private dataService: DataService){
    this.dataService.getTasks().subscribe(response => {
      this.tasks = response;
      console.log(this.tasks);

    });
  }
}
