import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlNavigationService } from '../../services/al-navigation.service';

@Component({
  selector: 'al-archipeligo19-nav-header',
  templateUrl: './al-archipeligo19-nav-header.component.html',
  styleUrls: ['./al-archipeligo19-nav-header.component.scss']
})
export class AlArchipeligo19NavHeaderComponent implements OnInit {

    heading = 'Dashboards';
    displayIconName = 'dashboard';


    // TODO - Thinking instead we should have navigation component service, where we can emit toggle state and
    // listen to that in the al-sidenav,
    // Otherwise every app will need to handle this output and set the toggle boolean @input to the al-sidenav!!
    @Output() toggleButtonClick: EventEmitter<any> = new EventEmitter();

    constructor( public alNavigation:AlNavigationService ) {
    }

    ngOnInit() {
    }

    toggleClick() {
        this.toggleButtonClick.emit();
    }
}
