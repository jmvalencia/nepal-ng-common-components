/**
 * A not-very-interesting service to coordinate navigational state management into a singleton.
 * This is a nepal-based implementation of AlRoutingHost.
 *
 * @author McNielsen <knielsen@alertlogic.com>
 *
 */

import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, NavigationExtras } from '@angular/router';
import { filter } from 'rxjs/operators';

import {
    ALSession,
    AlSessionStartedEvent,
    AlSessionEndedEvent,
    AlActingAccountChangedEvent,
    AlActingAccountResolvedEvent
} from '@al/session';
import {
    AlLocation,
    AlRoute,
    AlRoutingHost,
    AlRouteDefinition,
    AlRouteCondition,
    AlLocatorService,
    AlNavigationSchema,
    AlNavigationHost
} from '@al/common/locator';
import { AlEntitlementCollection } from '@al/subscriptions';
import { AlGlobalizer, AlStopwatch, AlTriggerStream, AlBehaviorPromise } from '@al/common';
import { AlExperiencePreferencesService } from './al-experience-preferences.service';
import {
    AlNavigationFrameChanged,
    AlNavigationContextChanged,
    AlNavigationTrigger,
    ExperiencePreference
} from '../types';

@Injectable({
    providedIn: 'root'
})
export class AlNavigationService implements AlNavigationHost
{
    public schema:AlNavigationSchema            =   null;
    public currentUrl:string                    =   '';
    public routeParameters                      =   {};

    /**
     * Acting entitlements (distinct from primary entitlements); initially empty.
     */
    public entitlements:AlEntitlementCollection =   new AlEntitlementCollection();

    /**
     * Navigation triggers (named events referenced by menu data) emit through this event channel.
     */
    public events                               =   new AlTriggerStream();

    /**
     * This cluster of methods supports imperative navigation of different types.
     * Note that each method accepts an optional `params` parameter bag.  This parameters will be used
     * to satisfy a given route or target's route parameters (if any); any *remaining* parameters will be
     * added as query parameters to the route.
     */
    public navigate = {
        /**
         * Navigates to a new URL based on a named route, like "cd17:overview" or "cd19:dashboards:settings".
         */
        byNamedRoute: ( namedRouteId:string, parameters:{[p:string]:string} = {}, options:any = {} ) => {
            return this.navigateByNamedRoute( namedRouteId, parameters, options );
        },

        /**
         * Navigates to a new URL based on a literal route.
         */
        byRoute: ( route: AlRoute, parameters:{[p:string]:string} = {}, options:any = {} ) => {
            return this.navigateByRoute( route, parameters, options );
        },

        /**
         * Navigates to a new URL based on location/path.
         */
        byLocation: ( locTypeId:string, path:string = '/#/', parameters:{[p:string]:string} = {}, options:any = {} ) => {
            return this.navigateByLocation( locTypeId, path, parameters, options );
        },

        /**
         * Navigates to a new URL
         */
        byURL: ( url:string, parameters:{[p:string]:string} = {}, options:any = {} ) => {
            return this.navigateByURL( url, parameters, options );
        },

        /**
         * Navigates to a new location in the current route using an array of angular commands.
         */
        byNgRoute: ( commands: any[], extras: NavigationExtras = { skipLocationChange: false } ) => {
            return this.navigateByNgRoute( commands, extras );
        }
    };

    public experience:string                    =   null;
    protected navigationSchemaId:string         =   null;

    protected schemas:{[schema:string]:Promise<AlNavigationSchema>} = {};
    protected menus:AlRoute[] = [];

    protected frameNotifier:AlStopwatch;
    protected contextNotifier:AlStopwatch;
    protected defaultSchema = new AlBehaviorPromise<AlNavigationSchema>();

    constructor( public http:HttpClient,
                 public router:Router,
                 public ngZone:NgZone,
                 public experiencePreference: AlExperiencePreferencesService ) {
        this.frameNotifier = AlStopwatch.later( this.emitFrameChanges );
        this.contextNotifier = AlStopwatch.later( this.emitContextChanges );
        this.currentUrl = window.location.href;
        this.router.events.pipe( filter( event => event instanceof NavigationEnd ) )
                .subscribe( event => this.onNavigationComplete( event ) );
        ALSession.notifyStream.attach( "AlSessionStarted", this.onSessionStarted );
        ALSession.notifyStream.attach( "AlActingAccountChanged", this.onActingAccountChanged );
        ALSession.notifyStream.attach( "AlActingAccountResolved", this.onActingAccountResolved );
        ALSession.notifyStream.attach( "AlSessionEnded", this.onSessionEnded );
        ALSession.getEffectiveEntitlements().then( entitlements => {
            this.entitlements = entitlements;
        } );
        this.routeParameters['accountId'] = ALSession.getActingAccountId();
        AlGlobalizer.expose( 'al.navigation', {
            routingHost: this,
            setContext: ( environment:string, residency:string, locationId:string ) => {
                let context = AlLocatorService.getContext();
                if ( environment ) {
                    context.environment = environment;
                }
                if ( residency ) {
                    context.residency = residency;
                }
                if ( locationId ) {
                    context.location = locationId;
                }
                AlLocatorService.setContext( context );
                this.refreshMenus();
            },
            setExperience: ( experience:string ) => {
                this.setExperience( experience );
            },
            setSchema: ( schema:string ) => {
                this.setSchema( schema );
            },
            refresh: () => {
                this.refreshMenus();
            },
            navigate: this.navigate
        } );
        this.listenForSignout();
    }

    /**
     * Sets the desired experience and notifies the navigation components of the changed setting.
     */
    public setExperience( experience:string ) {
        this.experience = experience;
        this.frameNotifier.again();
    }

    /**
     * Sets the desired schema and notifies the navigation components of the changed setting.
     */
    public setSchema( schemaId:string ) {
        this.navigationSchemaId = schemaId;
        this.frameNotifier.again();
    }

    /**
     * Changes the acting account.
     */
    public setActingAccount( accountId:string ):Promise<boolean> {

        //  Capture original state -- accountId, acting node, acting base URL
        const originalActingAccountId = ALSession.getActingAccountId();
        const originalActingNode = AlLocatorService.getActingNode();
        const originalBaseUrl = AlRoute.link( this, originalActingNode.locTypeId ).toHref();

        //  Change the acting account via @al/session
        return ALSession.setActingAccount( accountId ).then(
            resolved => {
                //  Update the accountId route parameter
                this.setRouteParameter("accountId", accountId );

                let actingBaseUrl = AlRoute.link( this, originalActingNode.locTypeId ).toHref();
                if ( originalBaseUrl !== actingBaseUrl ) {
                    //  If these two strings don't match, the residency portal for the acting application has changed (e.g., we've switched from .com to .co.uk or vice-versa)
                    //  In this case, redirect to the correct target location.
                    let path = window.location.href.replace( originalBaseUrl, '' );
                    if ( originalActingAccountId ) {
                        //  Replace references to the previous acting account ID with references to the new one.
                        //  This could hypothetically malfunctino for certain deep links -- so far, no issues have been reported (fingerscrossed)
                        path = path.replace( `/${originalActingAccountId}`, `/${accountId}` );
                    }
                    if ( path.indexOf( "?" ) >= 0 ) {
                        //  Chop off query parameters.  Why are we doing this again?
                        path = path.substring( 0, path.indexOf( "?" ) );
                    }

                    console.warn("Portal residency changed; redirecting to [%s] [%s]", actingBaseUrl, path );
                    AlRoute.link( this, originalActingNode.locTypeId, path ).dispatch();        //  GO!
                }
                return true;
            },
            error => {
                console.error("AlNavigationService: failed to set acting account: ", error );
                return false;
            }
        );
    }

    public getNavigationSchema( schema:string ):Promise<AlNavigationSchema> {
        if ( ! this.schemas.hasOwnProperty( schema ) ) {
            let path = `assets/navigation/${schema}.json`;
            this.schemas[schema] = this.http.get<AlNavigationSchema>( path ).toPromise();
        }
        return this.schemas[schema];
    }

    public getRouteById( namedRouteId:string ):AlRouteDefinition {
        if ( ! this.schema ) {
            console.warn(`AlNavigationService: cannot retrieve route with id '${namedRouteId}'; no schema is loaded.` );
            return null;
        }
        if ( ! this.schema.namedRoutes || ! this.schema.namedRoutes.hasOwnProperty( namedRouteId ) ) {
            console.warn(`AlNavigationService: cannot retrieve route with id '${namedRouteId}'; no such named route is defined.` );
            return null;
        }
        return this.schema.namedRoutes[namedRouteId];
    }

    public getMenu( schema:string, menuId:string ):Promise<AlRoute> {
        return this.getNavigationSchema( schema ).then( schema => {
            if ( schema.menus.hasOwnProperty( menuId ) ) {
                let menu = new AlRoute( this, schema.menus[menuId] );
                this.menus.push( menu );
                menu.refresh(true);
                return menu;
            }
            return Promise.reject( new Error( `Navigation schema '${schema}' does not have a menu with ID '${menuId}'` ) );
        } );
    }

    /**
     * Handles user dispatch of a given route.
     */
    public dispatch = ( route:AlRoute, params?:{[param:string]:string} ) => {
        console.log("Dispatching route!", route );
        this.navigate.byRoute( route, params );
    }

    public refreshMenus() {
        this.menus.forEach( menu => {
            menu.refresh( true );
        } );
    }

    /**
     * Evaluates a route condition.  Please note that this method will only be called for conditionals that cannot already be intuited by data from this service's
     * AlRoutingHost implementation.
     */
    public evaluate = ( condition: AlRouteCondition ) => {

        if ( condition.entitlements ) {
            if ( ! this.entitlements ) {
                return false;
            }
            return this.evaluateEntitlementExpression( condition.entitlements );
        }
        return false;
    }

    /**
     * Convenience method to evaluate currently installed entitlements against a logic entitlement expression.
     * See @al/subscriptions AlEntitlementCollection for more information on these expressions and how they are evaluated.
     */
    public evaluateEntitlementExpression( expression:string ):boolean {
        return this.entitlements.evaluateExpression( expression );
    }

    /**
     * @deprecated
     * Alias of evaluateEntitlementExpression
     */
    public evaluateEntitlement( expression:string ):boolean {
        return this.evaluateEntitlementExpression( expression );
    }

    /**
     * Sets a route parameter and schedules notification of child components.
     */
    public setRouteParameter( parameter:string, value:string ) {
        this.routeParameters[parameter] = value;
        this.contextNotifier.again();
    }

    /**
     * Deletes a route parameter and schedules notification of child components.
     */
    public deleteRouteParameter( parameter ) {
        delete this.routeParameters[parameter];
        this.contextNotifier.again();
    }

    /**
     * Registers a listener for the User.Navigation.Signout trigger, which should prompt local session destruction and a redirect to
     * console.account's logout route.
     */
    protected listenForSignout() {
        this.events.attach( 'AlNavigationTrigger', ( event:AlNavigationTrigger ) => {
            console.log("Got navigation trigger event", event );
            if ( event.triggerName === 'Navigation.User.Signout' ) {
                event.respond( true );
                ALSession.deactivateSession();
                this.navigate.byLocation( AlLocation.AccountsUI, '/#/logout' );
            }
        } );
    }

    /**
     * Listens for router complete/cancel events from angular
     */
    protected onNavigationComplete( event ) {
        this.currentUrl = window.location.href;
        this.refreshMenus();
        this.contextNotifier.again();
    }

    /**
     * Listens for session start triggers from @al/session
     */
    protected onSessionStarted = ( event:AlSessionStartedEvent ) => {
        this.contextNotifier.again();
    }

    /**
     * Listens for acting account changed triggers from @al/session
     */
    protected onActingAccountChanged = ( event:AlActingAccountChangedEvent ) => {
        if ( event.actingAccount.id !== this.routeParameters['accountId'] ) {
            this.routeParameters['accountId'] = event.actingAccount.id;
            this.contextNotifier.again();
        }
    }

    /**
     * Listens for acting account resolution triggers from @al/session
     */
    protected onActingAccountResolved = ( event:AlActingAccountResolvedEvent ) => {
        this.entitlements = event.entitlements;
        this.refreshMenus();
        this.contextNotifier.again();
    }

    /**
     * Listens for session ended triggers from @al/session
     */
    protected onSessionEnded = ( event:AlSessionEndedEvent ) => {
        this.deleteRouteParameter( 'accountId' );
        this.refreshMenus();
        this.contextNotifier.again();
    }

    /**
     * Internal handler for navigation by named route.
     */
    protected navigateByNamedRoute( namedRouteId:string, parameters:{[p:string]:string} = {}, options:any = {} ) {
        this.defaultSchema.then( schema => {
            let definition = this.getRouteById( namedRouteId );
            if ( ! definition ) {
                throw new Error("Imperative navigation could not be executed." );
            }
            let route = new AlRoute( this, definition );
            this.navigateByRoute( route, parameters, options );
        } );
    }

    /**
     * Internal handler for navigation by route.
     */
    protected navigateByRoute( route: AlRoute, parameters:{[p:string]:string} = {}, options:any = {} ) {
        const action = route.getRouteAction();
        if ( action ) {
            if ( action.type === 'link' ) {
                if ( action.url ) {
                    this.navigateByURL( action.url, parameters, options );
                } else if ( action.location ) {
                    this.navigateByLocation( action.location, action.path, parameters, options );
                } else {
                    console.warn("AlNavigationService: cannot dispatch link route without a link!", action );
                }
            } else if ( route.definition.action.type === 'trigger' ) {
                console.log("AlNavigationService.Trigger [%s]", route.definition.action.trigger );
                this.events.trigger( new AlNavigationTrigger( this,
                                                              route.definition.action.trigger,
                                                              route.definition,
                                                              route ) );
            }
        } else {
            //  Find first visible child with an action and go there instead
            let eligibleChild = route.children.find( child => child.visible && child.definition.action );
            if ( eligibleChild ) {
                return this.navigateByRoute( eligibleChild, parameters, options );
            } else {
                console.warn("AlNavigationService: cannot dispatch route without an action!", route );
            }
        }
    }

    /**
     * Internal handler for navigation based on location/path.
     */
    protected navigateByLocation( locTypeId:string, path:string = '/#/', parameters:{[p:string]:string} = {}, options:any = {} ) {
        let node = AlLocatorService.getNode( locTypeId );
        if ( ! node ) {
            console.warn(`AlNavigationService: cannot navigate to unknown location '${locTypeId}'; aborting imperative navigation.` );
            return;
        }
        let url = node.uri;
        if ( path && path.length ) {
            url = url + path;
        }
        this.navigateByURL( url, parameters, options );
    }

    /**
     * Internal handler for navigation by raw URL
     */
    protected navigateByURL( url:string, parameters:{[p:string]:string} = {}, options:any = {} ) {
        url = this.applyParameters( url, parameters );
        console.log(`AlNavigationService: following link to [${url}]` );
        window.location.href = url;
    }

    /**
     * Internal handler for navigation using angular router
     */
    protected navigateByNgRoute( commands: any[], initialExtras: NavigationExtras = { skipLocationChange: false } ) {
        let extras = initialExtras || {};
        extras.queryParamsHandling = extras.queryParamsHandling || 'merge';
        extras.queryParams = extras.queryParams || {};
        if ( ALSession.isActive() ) {
            extras.queryParams["aaid"] = ALSession.getActingAccountId();
            let datacenterId = ALSession.getActiveDatacenter();             //  corresponds to insight locations service locationId
            if ( datacenterId ) {
                extras.queryParams["locid"] = datacenterId;
            }
        }
        this.router.navigate( commands, extras );
    }

    /**
     *  Notifies the navigation componentry that the schema or experience has changed, after loading the selected schema.
     *  This change is communicated via an AlNavigationFrameChanged event emitted through AlNavigationService's `events` channel.
     */
    protected emitFrameChanges = () => {
        if ( ! this.navigationSchemaId || ! this.experience ) {
            //  If no schema or experience has been set, do not notify the frame of any changes -- both must be present for the frame to be displayed.
            return true;
        }
        this.getNavigationSchema( this.navigationSchemaId ).then( schema => {
            this.schema = schema;
            this.defaultSchema.resolve( schema );
            this.ngZone.run( () => {
                let event = new AlNavigationFrameChanged( this, schema, this.experience );
                this.events.trigger( event );
            } );
        } );
    }

    /**
     * Notifies the navigation componentry that one (or more) of the following things has changed:
     *      - Authentication status
     *      - Acting account/entitlements
     *      - Route parameters
     *      - Current route
     *  This change is communicated via an AlNavigationContextChanged event emitted through AlNavigationService's `events` channel.
     */
    protected emitContextChanges = () => {
        this.ngZone.run( () => {
            let event = new AlNavigationContextChanged( this, ALSession );
            this.events.trigger( event );
        } );
    }


    /**
     * Black magic.  Consumes provided parameters as route parameters and compiles any remainders into a query string.
     */
    protected applyParameters( url:string, parameters:{[p:string]:string}, rewriteQueryString:boolean = true, applyIdentityParameters:boolean = true ):string {
        let unused = Object.assign( {}, parameters );

        url = url.replace( /\:[a-zA-Z_]+/g, match => {
            let variableId = match.substring( 1 );
            if ( unused.hasOwnProperty( variableId ) ) {
                let value = unused[variableId];
                delete unused[variableId];
                return value;
            } else if ( this.routeParameters.hasOwnProperty( variableId ) ) {
                return this.routeParameters[variableId];
            } else {
                console.warn(`AlNavigationService: cannot fully construct URL which requires missing parameter '${variableId}'`);
                return "(null)";
            }
        } );

        if ( rewriteQueryString ) {
            if ( applyIdentityParameters && ALSession.isActive() ) {
                unused["aaid"] = ALSession.getActingAccountID();
                unused["locid"] = ALSession.getActiveDatacenter();      //  corresponds to insight locations service locationId
            }
            let qsOffset = url.indexOf("?");
            if ( qsOffset !== -1 ) {
                let existing = url.substring( qsOffset + 1 ).split("&");
                for ( let k in existing ) {
                    if ( existing.hasOwnProperty( k ) ) {
                        unused[k] = existing[k];
                    }
                }
                url = url.substring( 0, qsOffset );
            }
            if ( Object.keys( unused ).length > 0 ) {
                let queryString = Object.keys( unused ).map( key => `${key}=${encodeURIComponent( unused[key] )}` ).join( "&" );
                url = `${url}?${queryString}`;
            }
        }

        return url;
    }
}
