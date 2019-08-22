import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AlRoute } from '@al/common/locator';
import { AlTriggerSubscription } from '@al/common';
import { ALSession } from '@al/session';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlManageExperienceService } from '../../services/al-manage-experience.service';

@Component({
    selector: 'al-archipeligo19-sidenav',
    templateUrl: './al-archipeligo19-sidenav.component.html',
    styleUrls: ['./al-archipeligo19-sidenav.component.scss']
})
export class AlArchipeligo19SidenavComponent implements OnInit, OnDestroy {
    @Input() displayNav = false;    // See al-nav-header toggle button click handling, this should be based on value from a service (observable)
    @Input() menu:AlRoute = null;

    protected subscription:AlTriggerSubscription = null;

    constructor( alNavigation:AlNavigationService,
                protected alManageExperience: AlManageExperienceService) {
        }

    ngOnInit() {
        this.subscription = ALSession.notifyStream.attach( "AlActingAccountResolved", () => {
            //  Queue refresh task
            if ( ! this.menu ) {
            }
            setTimeout( () => {
                this.menu.refresh();
            }, 1 );
        } );
    }

    ngOnDestroy() {
        if ( this.subscription ) {
            this.subscription.cancel();
        }
    }

    toggleNav = () => {
        this.displayNav = !this.displayNav;
    }

    toggleItemExpanded = (menuItem) => {
        menuItem.setProperty( 'expanded', ! menuItem.getProperty( 'expanded', false ) );
    }

    logout = () => {
        ALSession.deactivateSession();
    }

    dispatch( route:AlRoute, $event:Event ) {
        if ( $event ) {
            $event.preventDefault();
        }
        route.dispatch();
    }

    leaveBeta() {
        this.alManageExperience.manageExperienceOption("back-default");
    }
}
