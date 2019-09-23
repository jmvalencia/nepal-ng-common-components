import { Component, OnInit, OnDestroy, Input, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { AlRoute } from '@al/common/locator';
import { AlTriggerSubscription } from '@al/common';
import { ALSession } from '@al/session';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlManageExperienceService } from '../../services/al-manage-experience.service';
import { Sidebar } from 'primeng/primeng';

@Component({
    selector: 'al-archipeligo19-sidenav',
    templateUrl: './al-archipeligo19-sidenav.component.html',
    styleUrls: ['./al-archipeligo19-sidenav.component.scss']
})
export class AlArchipeligo19SidenavComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() displayNav = false;    // See al-nav-header toggle button click handling, this should be based on value from a service (observable)
    @Input() menu:AlRoute = null;

    @ViewChild(Sidebar) sidebar: Sidebar;

    documentEscapeListener: Function;

    constructor( alNavigation:AlNavigationService,
                protected alManageExperience: AlManageExperienceService,
                protected renderer: Renderer2) {
        }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {
      this.bindDocumentEscapeListener();
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

    bindDocumentEscapeListener() {
      this.documentEscapeListener = this.renderer.listen('document', 'keydown', (event) => {
        if (event.which === 27) {
          this.sidebar.close(event);
        }
      });
    }

}
