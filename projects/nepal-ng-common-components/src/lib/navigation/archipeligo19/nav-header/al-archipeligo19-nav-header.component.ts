import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlNavigationContextChanged } from '../../types';
import { AlRoute } from '@al/common/locator';
import { AlSubscriptionGroup } from '@al/common';

@Component({
  selector: 'al-archipeligo19-nav-header',
  templateUrl: './al-archipeligo19-nav-header.component.html',
  styleUrls: ['./al-archipeligo19-nav-header.component.scss']
})
export class AlArchipeligo19NavHeaderComponent implements OnInit {

    @Input() menu:AlRoute = AlRoute.empty();
    @Input() userMenu:AlRoute = AlRoute.empty();

    heading = '';
    displayIconName = '';
    subscriptions:AlSubscriptionGroup = new AlSubscriptionGroup( null );


    // TODO - Thinking instead we should have navigation component service, where we can emit toggle state and
    // listen to that in the al-sidenav,
    // Otherwise every app will need to handle this output and set the toggle boolean @input to the al-sidenav!!
    @Output() toggleButtonClick: EventEmitter<any> = new EventEmitter();

    constructor( public alNavigation:AlNavigationService ) {
    }

    ngOnInit() {
        this.subscriptions.manage(
            this.alNavigation.events.attach( "AlNavigationContextChanged", event => this.onMenuChange() )
        );
    }

    ngOnChanges( changes:SimpleChanges ) {
        if ( changes.hasOwnProperty("menu") || changes.hasOwnProperty("userMenu" ) ) {
            //  Refresh if our menu inputs are modified
            this.onMenuChange();
        }
    }

    ngOnDestroy() {
        this.subscriptions.cancelAll();
    }

    toggleClick() {
        this.toggleButtonClick.emit();
    }

    onMenuChange = () => {
        let activatedChild = this.findActivatedChild( this.menu ) || this.findActivatedChild( this.userMenu );
        if ( activatedChild ) {
            this.heading = activatedChild.caption;
            this.displayIconName = activatedChild.getProperty("iconClass", "");
        }
    }

    protected findActivatedChild( route:AlRoute ) {
        if ( ! route || ! route.activated ) {
            return null;
        }
        if ( route.children.length ) {
            let activatedChild = route.children.find( r => r.activated );
            return activatedChild || route;
        }
        return null;
    }
}
