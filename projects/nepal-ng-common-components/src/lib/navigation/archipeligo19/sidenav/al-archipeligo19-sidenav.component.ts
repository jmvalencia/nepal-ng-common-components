import { Component,
         OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit,
         Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Sidebar } from 'primeng/primeng';
import { AlRoute, AlSubscriptionGroup } from '@al/common';
import { ALSession, AlActingAccountResolvedEvent } from '@al/session';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlManageExperienceService } from '../../services/al-manage-experience.service';
import { AlNavigationContextChanged } from '../../types/navigation.types';

@Component({
    selector: 'al-archipeligo19-sidenav',
    templateUrl: './al-archipeligo19-sidenav.component.html',
    styleUrls: ['./al-archipeligo19-sidenav.component.scss']
})
export class AlArchipeligo19SidenavComponent implements OnChanges {
    @Input() displayNav = false;    // See al-nav-header toggle button click handling, this should be based on value from a service (observable)
    @Input() menu:AlRoute = null;
    @Output() displayNavChange = new EventEmitter<boolean>();

    documentEscapeListener: Function;

    constructor( protected alNavigation:AlNavigationService,
                 protected alManageExperience: AlManageExperienceService,
                 protected renderer:Renderer2 ) {
    }

    ngOnChanges( changes:SimpleChanges ) {
        if ( changes.hasOwnProperty( "menu" ) ) {
            this.expandActivatedItems();
        }
    }

    ngAfterViewInit() {
        this.bindDocumentEscapeListener();
    }

    dispatch( route: AlRoute, $event: MouseEvent ) {
        if ( $event ) {
            $event.preventDefault();
        }
        // open in a new tab if user using the combo: (CMD + click)  or (Ctrl + click) or (middle click)
        if ($event.metaKey || $event.ctrlKey || $event.which === 2) {
          return window.open(route.href, '_blank');
        }
        route.dispatch();
        if( !route.children || route.parent.caption !== "primary"){
            this.displayNav = false;
            this.displayNavChange.emit( false );
        }
    }

    dispatchParent( route: AlRoute, $event: MouseEvent ) {
        if ( $event ) {
            $event.preventDefault();
        }

        let visibleChildren = route.children.reduce<boolean>( ( alpha, child ) => alpha || child.visible, false );
        if ( visibleChildren) {
            if(!route.getProperty( 'expanded', false )) {
                // Expose children
                route.setProperty( 'expanded', true );
            } else {
                // Unexposed children
                route.setProperty( 'expanded', false );
            }
        } else {
            //  Children already exposed, just dispatch!
            this.dispatch( route, $event );
        }
    }

    expandActivatedItems() {
        if ( ! this.menu ) {
            return;
        }
        const expander = ( route:AlRoute ) => {
            if ( route.activated ) {
                route.setProperty("expanded", true );
                route.children.forEach( expander );
            }
        };

        expander( this.menu );
    }

    leaveBeta() {
        this.alManageExperience.manageExperienceOption("back-default");
    }

    bindDocumentEscapeListener() {
      this.documentEscapeListener = this.renderer.listen('document', 'keydown', (event) => {
        if (event.which === 27 && this.displayNav ) {
          this.displayNav = false;
          this.displayNavChange.emit( false );
        }
      });
    }

}
