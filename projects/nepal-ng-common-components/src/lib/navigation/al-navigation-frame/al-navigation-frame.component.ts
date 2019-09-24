/**
 * The AlNavigationFrameComponent is meant to provide an abstract, top level frame for a specific navigation implementation to be inserted into.
 *
 * In addition, the <al-navigation-frame> directive allows applications to assign an initial schema and experience for the navigation layer.
 * This can also be assigned programmatically via AlNavigationService.
 */

import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
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
    contentMenuCursor:AlRoute;

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
        this.evaluateActivatedContentMenu();
    }

    onNavigationContextChanged = ( event:AlNavigationContextChanged ) => {
        this.primaryMenu.refresh( true );
        if ( this.alNavigation.routeData.hasOwnProperty("alNavigation" ) && Array.isArray( this.alNavigation.routeData.alNavigation ) ) {
            const routeDirectives = <string[]>this.alNavigation.routeData.alNavigation;
            this.disablePrimaryMenu = routeDirectives.includes( ALNAV_DISABLE_PRIMARY );
            this.disableTertiaryMenu = routeDirectives.includes( ALNAV_DISABLE_TERTIARY );
        }
        this.evaluateActivatedContentMenu();
    }

    /*  Finds the first activated route with `childOutlet === "content-menu"`.  This route will then be used
     *  as the container for the al-archipeligo19-content-menu component.  */
    evaluateActivatedContentMenu() {
        let contentMenu:AlRoute = undefined;
        let contentMenuFinder = ( container:AlRoute ):AlRoute => {
            return container.children.find( route => {
                if ( route.activated ) {
                    if ( route.getProperty("childOutlet") === "content-menu" ) {
                        contentMenu = route;
                    } else {
                        return contentMenuFinder( route );
                    }
                }
            } );
        };

        if ( this.primaryMenu ) {
            contentMenuFinder( this.primaryMenu );
        }

        if ( this.contentMenu !== contentMenu ) {
            this.contentMenu = contentMenu;
            contentMenu.summarize( true );
            // this.contentMenuCursor = contentMenu.children.find( c => c.activated );
        }
    }

    toggleNav() {
        this.displayNav = ! this.displayNav;
    }
}
