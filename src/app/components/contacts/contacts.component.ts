import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
public contacts = new BehaviorSubject<any[]>([]);
  constructor(private dataService: DataService){}

ngOnInit(): void {
    
  this.dataService.getContacts().subscribe(contacts => {
    this.contacts.next(contacts)
    console.log(this.contacts.value);
  })
}
}
