import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Contact } from 'src/app/models/contact.class';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
@Input() contact?: Contact;
@Output() contactSelected = new EventEmitter<Contact>();
id?: number;

constructor(private dataService: DataService){}

ngOnInit(): void {

}
showContactDetail():void{
  this.contactSelected.emit(this.contact);
  this.dataService.showTheDetails = true;
  this.dataService.showIt = false;
  // this.dataService.showContactsDetails();
//   if (this.dataService.isSmallScreen) {
//     this.dataService.detailVisible = true;
  
// }


}
}
