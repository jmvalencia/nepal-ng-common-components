/**
 * The AlNavigationFrameComponent is meant to provide an abstract, top level frame for a specific navigation implementation to be inserted into.
 *
 * In addition, the <al-navigation-frame> directive allows applications to assign an initial schema and experience for the navigation layer.
 * This can also be assigned programmatically via AlNavigationService.
 */

import { Component, OnInit, OnChanges, SimpleChanges, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    AlNavigationHost,
    AlNavigationFrameChanged,
    AlNavigationContextChanged,
    ALNAV_DISABLE_PRIMARY,
    ALNAV_DISABLE_TERTIARY
} from '../types';
import { ALSession } from '@al/session';
import { AIMSClient } from '@al/aims';
import { AlRoute } from '@al/common/locator';
import { AlTriggerStream } from '@al/common';
import { AlNavigationService } from '../services/al-navigation.service';
import { AlNavigationRouteMounted } from '../types/navigation.types';

@Component({
    selector: 'al-navigation-frame',
    templateUrl: './al-navigation-frame.component.html',
    styleUrls: ['./al-navigation-frame.component.scss']
})
export class AlNavigationFrameComponent implements OnInit, OnChanges
{
    /**
     * Instance properties
     */
    @Input() public experience:string = null;       //  this is only used to set the *initial* state.
    @Input() public schema:string = null;           //  this is only used to set the *initial* state.

    primaryMenu:AlRoute;
    userMenu:AlRoute;
    contentMenu:AlRoute;
    sidenavMenu:AlRoute;
    sidenavContentRef:TemplateRef<any>;

    displayNav:boolean = false;

    disablePrimaryMenu:boolean = false;
    disableTertiaryMenu:boolean = false;

    constructor( public alNavigation:AlNavigationService,
                 public activatedRoute:ActivatedRoute ) {
    }

    ngOnInit() {
        this.alNavigation.events.attach( "AlNavigationFrameChanged", this.onNavigationChanged );
        this.alNavigation.events.attach( "AlNavigationContextChanged", this.onNavigationContextChanged );
        this.activatedRoute.queryParams.subscribe( this.onQueryParamsChanged );
    }

    ngOnChanges( changes:SimpleChanges ) {
        if ( this.schema ) {
            this.alNavigation.setSchema( this.schema );
        }
        if ( this.experience ) {
            this.alNavigation.setExperience( this.experience );
        }
    }

    onQueryParamsChanged = ( params:any ) => {
        if ( ALSession.isActive() ) {
            if ( params.hasOwnProperty("aaid") ) {
                const aaidInURL:string = params["aaid"];
                if ( aaidInURL !== ALSession.getActingAccountId() ) {
                    AIMSClient.getAccountDetails( aaidInURL ).then( account => {
                        ALSession.setActingAccount( account );
                    }, error => {
                        console.warn("Warning: failed to retrieve account information!" );
                        //  TODO: rewrite query parameters to matching acting account ID?
                    } );
                }
            }
        }
    }

    onNavigationChanged = ( event:AlNavigationFrameChanged ) => {
        if ( ! event.schema ) {
            console.warn("Cannot assign menus for the current experience in the absence of a navigation scheme!  Ignoring." );
            return;
        }
        this.experience = event.experience;
        this.schema = event.schema;
        if ( event.schema.menus.hasOwnProperty("primary") ) {
            this.primaryMenu = new AlRoute( this.alNavigation, event.schema.menus.primary );
        } else {
            this.primaryMenu = AlRoute.empty();
        }
        if ( event.schema.menus.hasOwnProperty("user") ) {
            this.userMenu = new AlRoute( this.alNavigation, event.schema.menus.user );
        } else {
            this.userMenu = AlRoute.empty();
        }
        this.evaluateMenuActivation();
    }

    onNavigationContextChanged = ( event:AlNavigationContextChanged ) => {
        if ( this.primaryMenu ) {
            this.primaryMenu.refresh( true );
        }
        this.evaluateMenuActivation();
        if ( this.alNavigation.routeData.hasOwnProperty("alNavigation" ) && Array.isArray( this.alNavigation.routeData.alNavigation ) ) {
            const routeDirectives = <string[]>this.alNavigation.routeData.alNavigation;
            this.disablePrimaryMenu = routeDirectives.includes( ALNAV_DISABLE_PRIMARY );
            this.disableTertiaryMenu = routeDirectives.includes( ALNAV_DISABLE_TERTIARY );
        }
    }

    evaluateMenuActivation() {
        if ( ! this.primaryMenu ) {
            return;
        }

        let activatedPath = this.primaryMenu.getActivationCursorFlat();
        if ( ! activatedPath ) {
            return;
        }

        let contentMenu:AlRoute = undefined;
        let sidenavMenu:AlRoute = undefined;

        activatedPath.forEach( ( route:AlRoute, index:number ) => {
            let outlet = route.getProperty("childOutlet", "none" );
            if ( outlet === "content-menu" ) {
                contentMenu = route;
            } else if ( outlet === "sidenav" ) {
                sidenavMenu = route;
            }
        } );

        console.log("Activated path: ", activatedPath );

        if ( ! contentMenu && ! sidenavMenu && activatedPath.length > 3 ) {
            sidenavMenu = activatedPath[3];
        }

        if ( this.contentMenu !== contentMenu ) {
            console.log("New content menu...", contentMenu );
            this.contentMenu = contentMenu;
            let event = new AlNavigationRouteMounted( "content-menu", this.contentMenu );
            this.alNavigation.events.trigger( event );
        }

        if ( this.sidenavMenu !== sidenavMenu ) {
            console.log("New content menu...", sidenavMenu );
            this.sidenavMenu = sidenavMenu;
            let event = new AlNavigationRouteMounted( "sidenav", this.sidenavMenu );
            this.alNavigation.events.trigger( event );
            this.sidenavContentRef = event.response();
            console.log("Receiving in response to mounting sidenav: ", this.sidenavContentRef );
        }
    }

    toggleNav() {
        this.displayNav = ! this.displayNav;
    }
}
