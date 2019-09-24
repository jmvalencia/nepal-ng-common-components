import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { Sidebar } from 'primeng/primeng';
import { AlRoute } from '@al/common/locator';
import { AlSubscriptionGroup } from '@al/common';
import { ALSession, AlActingAccountResolvedEvent } from '@al/session';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlManageExperienceService } from '../../services/al-manage-experience.service';
import { AlNavigationContextChanged } from '../../types/navigation.types';

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
