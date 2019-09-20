import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AlRoute } from '@al/common/locator';
import { AlNavigationService } from '../../services/al-navigation.service';

@Component({
    selector: 'al-archipeligo19-content-menu',
    templateUrl: './al-archipeligo19-content-menu.component.html',
    styleUrls: ['./al-archipeligo19-content-menu.component.scss']
})
export class AlArchipeligo19ContentMenuComponent implements OnChanges
{
    @Input() menu:AlRoute;
    // @Input() cursorItem:AlRoute;

    constructor( protected alNavigation:AlNavigationService ) {
    }

    ngOnChanges( changes:SimpleChanges ) {
        if ( "menu" in changes ) {
            //  Refresh!
            console.log("Got menu reference", this.menu );
        }
    }

    dispatch( route:AlRoute, $event:Event ) {
        if ( $event ) {
            $event.preventDefault();
        }
        route.dispatch();
    }
}
