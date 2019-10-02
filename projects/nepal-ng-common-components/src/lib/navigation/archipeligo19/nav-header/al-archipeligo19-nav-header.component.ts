import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlRoute } from '@al/common/locator';
import { AlSubscriptionGroup } from '@al/common';
import { ALSession, AlSessionStartedEvent, AlSessionEndedEvent } from '@al/session';

@Component({
  selector: 'al-archipeligo19-nav-header',
  templateUrl: './al-archipeligo19-nav-header.component.html',
  styleUrls: ['./al-archipeligo19-nav-header.component.scss']
})
export class AlArchipeligo19NavHeaderComponent implements OnInit {

    @Input() menu:AlRoute = AlRoute.empty();
    @Input() userMenu:AlRoute = AlRoute.empty();
    @Input() breadcrumbs: AlRoute[] = [];

    displayIconName = '';
    subscriptions:AlSubscriptionGroup = new AlSubscriptionGroup( null );
    authenticated = false;


    // TODO - Thinking instead we should have navigation component service, where we can emit toggle state and
    // listen to that in the al-sidenav,
    // Otherwise every app will need to handle this output and set the toggle boolean @input to the al-sidenav!!
    @Output() toggleButtonClick: EventEmitter<any> = new EventEmitter();

    constructor( public alNavigation:AlNavigationService ) {
    }

    ngOnInit() {
        this.authenticated = ALSession.isActive();
        this.subscriptions.manage([
            ALSession.notifyStream.attach( AlSessionStartedEvent, this.onSessionStart ),
            ALSession.notifyStream.attach( AlSessionEndedEvent, this.onSessionEnd )
        ]);
    }

    ngOnChanges( changes:SimpleChanges ) {
        if ( changes.hasOwnProperty( "breadcrumbs" ) ) {
            this.inferIconFromBreadcrumbs( this.breadcrumbs || [] );
        }
    }

    ngOnDestroy() {
        this.subscriptions.cancelAll();
    }

    onSessionStart = ( event:AlSessionStartedEvent ) => {
        this.authenticated = true;
    }

    onSessionEnd = ( event:AlSessionEndedEvent ) => {
        this.authenticated = false;
    }

    toggleClick() {
        this.toggleButtonClick.emit();
    }

    inferIconFromBreadcrumbs( breadcrumbs:AlRoute[] ) {
        let breadcrumbIcon = '';
        breadcrumbs.forEach( breadcrumb => {
            breadcrumbIcon = breadcrumb.getProperty("iconClass", breadcrumbIcon );
        } );
        this.displayIconName = breadcrumbIcon;
    }

    dispatch( route:AlRoute, event:MouseEvent ) {
        if ( event ) {
            event.preventDefault();
            event.stopPropagation();
        }
        route.dispatch();
    }
}
