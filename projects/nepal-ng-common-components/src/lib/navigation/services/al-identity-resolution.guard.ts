/**
 *  AIMS/Auth0 Route Guard.
 *
 *  @author McNielsen <knielsen@alertlogic.com>
 *  @copyright 2019 Alert Logic, Inc.
 *
 */

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscriber, from, of as observableOf } from 'rxjs';
import { AlNavigationService } from '../services';
import { ALSession } from '@al/session';

@Injectable({
    providedIn: 'root'
})
export class AlIdentityResolutionGuard implements CanActivate
{
    protected resolver$:Observable<boolean>;

    constructor( public alNavigation:AlNavigationService ) {
    }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ):Observable<boolean> {

        if ( ! ALSession.isActive() ) {
            return observableOf( false );
        }

        if ( this.resolver$ ) {
            return this.resolver$;
        }

        this.resolver$ = new Observable<boolean>( ( observer:Subscriber<boolean> ) => {
            try {
                const activeDatacenterId = route.queryParams.hasOwnProperty( "locid" ) ? route.queryParams["locid"] : undefined;
                const actingAccountId = route.queryParams.hasOwnProperty( "aaid" ) ? route.queryParams["aaid"] : undefined;

                if ( activeDatacenterId && activeDatacenterId !== ALSession.getActiveDatacenter() ) {
                    console.warn("Setting active datacenter", route.queryParams["locid"] );
                    ALSession.setActiveDatacenter( route.queryParams["locid"] );
                }
                if ( actingAccountId && actingAccountId !== ALSession.getActingAccountId() ) {
                    this.alNavigation.setActingAccount( actingAccountId ).then( ( result:boolean ) => {
                            if ( result ) {
                                this.onResolved( observer );
                            } else {
                                this.onUnauthenticatedAccess( observer, route, state, `Could not set acting account to ${actingAccountId}` );
                            }
                        }, error => {
                            this.onUnauthenticatedAccess( observer, route, state, error.toString() );
                        } );
                } else {
                    this.onResolved( observer );
                }
            } catch( e ) {
                this.onUnauthenticatedAccess( observer, route, state, "Received unexpected error performing identity resolution." + e.toString() );
            }
        } );

        return this.resolver$;
    }

    onResolved( observer:Subscriber<boolean> ) {
        observer.next( true );
        observer.complete();
        this.resolver$ = undefined;
    }

    onUnauthenticatedAccess( observer:Subscriber<boolean>, route:ActivatedRouteSnapshot, state:RouterStateSnapshot, reason:string ) {
        console.log("AlIdentityResolutionGuard: refusing access to route: " + ( reason ? reason : "No reason specified" ) );
        observer.next( false );
        observer.complete();
        this.resolver$ = undefined;
        this.alNavigation.forceAuthentication();
    }
}

