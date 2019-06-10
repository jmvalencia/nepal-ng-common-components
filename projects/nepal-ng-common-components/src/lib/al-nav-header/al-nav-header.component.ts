import { Component, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'al-nav-header',
  templateUrl: './al-nav-header.component.html',
  styleUrls: ['./al-nav-header.component.scss']
})
export class ALNavHeaderComponent implements OnInit {

  heading = 'Dashboards';
  displayIconName = 'dashboard';


 // TODO - Thinking instead we should have navigation component service, where we can emit toggle state and
 // listen to that in the al-sidenav,
 // Otherwise every app will need to handle this output and set the toggle boolean @input to the al-sidenav!!
  @Output() toggleButtonClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    // TODO - This component will display the current active routes name (caption) with a contextual icon.
    // will also need an output for handlking click of the toggle icon button
  }

  toggleClick() {
    this.toggleButtonClick.emit();
  }
}
