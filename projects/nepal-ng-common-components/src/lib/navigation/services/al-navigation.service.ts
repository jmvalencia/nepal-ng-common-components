/**
 * A not-very-interesting service to coordinate navigational state management into a singleton.
 * This is a nepal-based implementation of AlRoutingHost.
 *
 * @author McNielsen <knielsen@alertlogic.com>
 *
 */

import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, NavigationExtras, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem as PrimengMenuItem } from 'primeng/components/common/menuitem';

import {
    AlConduitClient,
    ALSession,
    AlSessionStartedEvent,
    AlSessionEndedEvent,
    AlActingAccountChangedEvent,
    AlActingAccountResolvedEvent
} from '@al/session';
import {
    AlInsightLocations,
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
    AlDatacenterOptionsSummary,
    AlNavigationFrameChanged,
    AlNavigationContextChanged,
    AlNavigationTrigger,
    AlNavigationTertiarySelected,
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
    public routeData:{[k:string]:string}        =   {};
    public queryParams:{[k:string]:string}      =   {};
    public tertiaryMenu:AlRoute                 =   null;

    /**
     * Acting entitlements (distinct from primary entitlements); initially empty.
     */
    public entitlements:AlEntitlementCollection =   new AlEntitlementCollection();

    /**
     * Navigation triggers (named events referenced by menu data) emit through this event channel.
     */
    public events                               =   new AlTriggerStream();

    /**
     * EventEmitter to pass a css class to tertiary-content (al-archipeligo17-tertiary-menu)
     */
    public tertiaryContentClass$: EventEmitter<string|string[]|{[i:string]:boolean}> = new EventEmitter();

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

    protected experience:string                    =   null;
    protected navigationSchemaId:string            =   null;

    protected schemas:{[schema:string]:Promise<AlNavigationSchema>} = {};
    protected loadedMenus:{[fullMenuId:string]:AlRoute} = {};
    protected bookmarks:{[bookmarkId:string]:AlRoute} = {};
    protected namedRouteDictionary:{[routeId:string]:AlRouteDefinition} = {};

    protected frameNotifier:AlStopwatch;
    protected contextNotifier:AlStopwatch;
    protected defaultSchema = new AlBehaviorPromise<AlNavigationSchema>();
    protected conduit = new AlConduitClient();

    constructor( public http:HttpClient,
                 public router:Router,
                 public ngZone:NgZone,
                 public experiencePreference: AlExperiencePreferencesService ) {
        this.frameNotifier = AlStopwatch.later( this.emitFrameChanges );
        this.contextNotifier = AlStopwatch.later( this.emitContextChanges );
        this.currentUrl = window.location.href;
        this.router.events.pipe( filter( event => event instanceof NavigationEnd ) ).subscribe( this.onNavigationComplete );
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
            routes: ( search:string = null ) => {
                Object.keys( this.namedRouteDictionary )
                    .filter( id => search === null || id.indexOf( search ) >= 0 || this.namedRouteDictionary[id].caption.indexOf( search ) >= 0 )
                    .sort()
                    .forEach( id => {
                        const definition = this.namedRouteDictionary[id];
                        console.log(`[${id}] "${definition.caption}"`, definition );
                    } );
            },
            menus: ( id:string ) => {
                if ( id ) {
                    return this.loadedMenus.hasOwnProperty( id ) ? this.loadedMenus[id] : null;
                }
                return this.loadedMenus;
            },
            navigate: this.navigate
        } );
        this.listenForSignout();
        this.conduit.start();

        // Start loading both schemas immediately in order to populate the namedRouteDictionary.
        this.getNavigationSchema("cie-plus2");
        this.getNavigationSchema("siemless");
    }

    /**
     * Returns the experience
     */
    public getExperience() {
        return this.experience;
    }

    /**
     * Returns the navigation schema id
     */
    public getSchema() {
        return this.navigationSchemaId;
    }

    /**
     * Sets the desired experience and notifies the navigation components of the changed setting.
     */
    public setExperience( experience:string ) {
        this.routeParameters["experience"] = experience;        //  make the selected experience available for conditional routes to test against
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

    public setTertiaryMenu( menu:AlRoute ) {
        this.tertiaryMenu = menu;
        this.events.trigger( new AlNavigationTertiarySelected( menu ) );
    }

    /**
     * Changes the acting account.
     */
    public setActingAccount( accountId:string ):Promise<boolean> {

        //  Capture original state -- accountId, acting node, acting base URL
        const originalActingAccountId = ALSession.getActingAccountId();
        const originalActingNode = AlLocatorService.getActingNode();
        const originalBaseUrl = AlLocatorService.resolveURL( originalActingNode.locTypeId );

        //  Change the acting account via @al/session
        return ALSession.setActingAccount( accountId ).then(
            resolved => {
                //  Update the accountId route parameter
                this.setRouteParameter("accountId", accountId );

                let actingBaseUrl = AlLocatorService.resolveURL( originalActingNode.locTypeId );
                if ( originalBaseUrl !== actingBaseUrl ) {
                    //  If these two strings don't match, the residency portal for the acting application has changed (e.g., we've switched from .com to .co.uk or vice-versa)
                    //  In this case, redirect to the correct target location.
                    let path = window.location.href.replace( originalBaseUrl, '' );
                    if ( originalActingAccountId ) {
                        //  Replace references to the previous acting account ID with references to the new one.
                        //  This could hypothetically malfunction for certain deep links -- so far, no issues have been reported (fingerscrossed)
                        path = path.replace( `/${originalActingAccountId}`, `/${accountId}` );
                    }
                    if ( path.indexOf( "?" ) >= 0 ) {
                        //  Chop off query parameters.  Why are we doing this again?
                        path = path.substring( 0, path.indexOf( "?" ) );
                    }

                    console.warn("Portal residency changed; redirecting to", originalBaseUrl, actingBaseUrl, path );
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

    /**
     * Retrieves a navigation schema (or resolves with the already-loaded schema).
     *
     * @param schemaId The identifier of the schema, currently either 'cie-plus2' or 'siemless' (although that is subject to change).
     *
     * The method will first attempt to retrieve the schema from conduit, and then fall back to retrieving a local copy using http.
     */
    public getNavigationSchema( schemaId:string ):Promise<AlNavigationSchema> {
        if ( ! this.schemas.hasOwnProperty( schemaId ) ) {
            this.schemas[schemaId] = this.conduit.getGlobalResource( `navigation/${schemaId}`, 60 )
                .then(
                    schema => this.ingestNavigationSchema( schemaId, schema as AlNavigationSchema ),
                    error => {
                        let path = `assets/navigation/${schemaId}.json`;
                        return this.http.get<AlNavigationSchema>( `assets/navigation/${schemaId}.json` )
                                    .toPromise()
                                    .then( ( schema:AlNavigationSchema ) => this.ingestNavigationSchema( schemaId, schema ) );
                    }
                );
        }
        return this.schemas[schemaId];
    }

    public getRouteByName( routeName:string ):AlRouteDefinition {
        if ( ! this.namedRouteDictionary.hasOwnProperty( routeName ) ) {
            console.warn(`AlNavigationService: cannot retrieve route with name '${routeName}'; no such named route is defined.` );
            return null;
        }
        return this.namedRouteDictionary[routeName];
    }

    /**
     * @deprecated
     *
     * Routes with ids are now referred to as 'named routes'; use getRouteByName instead.
     */
    public getRouteById( routeId:string ):AlRouteDefinition {
        console.warn("AlNavigationService.getRouteById is deprecated; please use getRouteByName instead." );
        return this.getRouteByName;
    }

    public getMenu( schemaId:string, menuId:string ):Promise<AlRoute> {
        return this.getNavigationSchema( schemaId ).then( schema => {
            let menuKey = `${schemaId}:${menuId}`;
            if ( this.loadedMenus.hasOwnProperty( menuKey ) ) {
                return this.loadedMenus[menuKey];
            }
            return Promise.reject( new Error( `Navigation schema '${schemaId}' does not have a menu with ID '${menuId}'` ) );
        } );
    }

    public setBookmark( bookmarkId:string, menuItem:AlRoute ) {
        this.bookmarks[bookmarkId] = menuItem;
    }

    public getBookmark( bookmarkId:string ):AlRoute {
        return this.bookmarks.hasOwnProperty( bookmarkId ) ? this.bookmarks[bookmarkId] : null;
    }

    /**
     * Handles user dispatch of a given route.
     */
    public dispatch = ( route:AlRoute, params?:{[param:string]:string} ) => {
        this.navigate.byRoute( route, params );
    }

    public refreshMenus() {
        Object.values( this.loadedMenus ).forEach( menu => menu.refresh( true ) );
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
        this.refreshMenus();
        this.contextNotifier.again();
    }

    /**
     * Deletes a route parameter and schedules notification of child components.
     */
    public deleteRouteParameter( parameter ) {
        delete this.routeParameters[parameter];
        this.refreshMenus();
        this.contextNotifier.again();
    }

    /**
     * Implements `AlRoutingHost`'s decorateHref method, which allows it to manipulate the URLs generated
     * by @al/common.
     */
    public decorateHref( route:AlRoute ) {
        if ( route && route.href && route.visible ) {
            route.href = this.applyParameters( route.href, {}, true, true );        //  applies locid and aaid query parameters as appropriate
        }
    }

    /**
     * Black magic function that, given a url with :variable placeholder, consumes provided parameters as route parameters
     * and compiles any remainders into a query string.
     *
     * @param url The input url, with route parameter placeholder -- e.g., https://console.overview.alertlogic.com/#/remediations-scan-status/:accountId/:deploymentId
     * @param parameters The list of parameters to consume
     * @param rewriteQueryString If true (default), applies unused keys/values from the `parameters` input to generate a query string, and appends that to the result.
     * @param applyIdentityParameters If true (default), applies current acting account and location parameters to the query string.
     *
     * @returns The compiled URL.
     */
    public applyParameters( url:string, parameters:{[p:string]:string}, rewriteQueryString:boolean = true, applyIdentityParameters:boolean = true ):string {
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
                //  Missing route parameters should not occur under most circumstances
                //  console.warn(`AlNavigationService: cannot fully construct URL which requires missing parameter '${variableId}'`);
                return "(null)";
            }
        } );

        if ( rewriteQueryString ) {
            if ( applyIdentityParameters && ALSession.isActive() ) {
                unused["aaid"] = ALSession.getActingAccountID();
                let datacenterId = ALSession.getActiveDatacenter();
                if ( datacenterId ) {
                    unused["locid"] = datacenterId;      //  corresponds to insight locations service locationId
                }
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

    /**
     *  Generates the available data center menu structure.
     *
     *  A note on history: the reason this code is so unduly complicated is because, when the data center selector was introduced during 2017's "Universal Navigation"
     *  project (a time period when it was necessary to manage seperate user accounts and logins for different datacenters, if you can imagine that) the decision was made
     *  to conflate defender and insight locations into composites "us-west-1", "us-east-1", and "uk-west-1".  The problem, of course, is that the defender and insight
     *  datacenters of the US are asymmetrical.  It was assumed that the number of datacenters would inevitably increase and span further regions, so abstraction
     *  was preferred over a simpler enumeration of the possible permutations.
     *
     *  This expansion has not yet occurred, but the code is ready for it...  :)
     */
    public generateDatacenterMenu( currentLocationId:string,
                                      accessible:string[],
                                      activationCallback:{(insightLocationId:string,$event:any):void} ):AlDatacenterOptionsSummary {
        let available = {};
        let currentRegion = AlInsightLocations.hasOwnProperty( currentLocationId )
                                ? AlInsightLocations[currentLocationId].logicalRegion
                                : 'us-west-1';      //  without a default, people complain...  they complain so much
        accessible.forEach( accessibleLocationId => {
            if ( ! AlInsightLocations.hasOwnProperty( accessibleLocationId ) ) {
                return;
            }
            const locationInfo = AlInsightLocations[accessibleLocationId];
            let targetLocationId = accessibleLocationId;
            let logicalRegion = locationInfo.logicalRegion;
            if ( locationInfo.alternatives ) {
                locationInfo.alternatives.find( alternativeLocationId => {
                    if ( accessible.includes( alternativeLocationId ) ) {
                        targetLocationId = alternativeLocationId;
                        logicalRegion = AlInsightLocations[alternativeLocationId].logicalRegion;
                        return true;
                    }
                    return false;
                } );
            }
            if ( ! available.hasOwnProperty( locationInfo.residencyCaption ) ) {
                available[locationInfo.residencyCaption] = {};
            }
            if ( ! available[locationInfo.residencyCaption].hasOwnProperty( logicalRegion ) ) {
                available[locationInfo.residencyCaption][logicalRegion] = targetLocationId;
            }
        } );

        let locationsAvailable = 0;
        let currentResidency = "US";
        let selectableRegions:PrimengMenuItem[] = [];
        Object.keys( available ).forEach( region => {
            let regionMenu = {
                label: region,
                items: []
            };
            Object.keys( available[region] ).forEach( logicalRegion => {
                const targetLocationId = available[region][logicalRegion];
                const activated = ( logicalRegion === currentRegion ) ? true : false;
                if ( activated ) {
                    currentResidency = AlInsightLocations[targetLocationId].residency;
                    currentRegion = AlInsightLocations[targetLocationId].logicalRegion;
                }
                locationsAvailable++;
                regionMenu.items.push( {
                    label: logicalRegion,
                    styleClass: activated ? "active" : "",
                    command: ( event ) => activationCallback( targetLocationId, event )
                } );
            } );
            selectableRegions.push( regionMenu );
        } );

        return { locationsAvailable, selectableRegions, currentRegion, currentResidency };
    }

    /**
     * Forces the user to login.
     */
    public forceAuthentication() {
        this.navigate.byLocation( AlLocation.AccountsUI, '/#/login', { return: window.location.href } );
    }

    /**
     * Registers a listener for the Navigation.User.Signout trigger, which should prompt local session destruction and a redirect to
     * console.account's logout route.
     */
    protected listenForSignout() {
        this.events.attach( 'AlNavigationTrigger', (event: AlNavigationTrigger) => {
          if(event.triggerName === 'Navigation.User.Signout') {
            event.respond( true );
            ALSession.deactivateSession();
            this.navigate.byLocation( AlLocation.AccountsUI, '/#/logout' );
          }
        });
    }

    /**
     * Listens for router complete/cancel events from angular
     */
    protected onNavigationComplete = ( event:NavigationEnd ) => {
        this.currentUrl = window.location.href;         //  Update the current "official" URL for the menu system

        //  Iterate through the router's root to accumulate all data from its children, and make that data public
        let aggregatedData = {};
        let aggregatedQueryParams = {};
        if ( this.router.routerState.root.snapshot.children ) {
            let accumulator = ( element:ActivatedRouteSnapshot ) => {
                Object.assign( aggregatedData, element.data );
                Object.assign( aggregatedQueryParams, element.queryParams );
                if ( element.children ) {
                    element.children.forEach( accumulator );
                }
            };
            accumulator( this.router.routerState.root.snapshot );
        }
        this.routeData = aggregatedData;
        this.queryParams = aggregatedQueryParams;

        this.refreshMenus();                            //  Refresh menus against the most current data

        this.contextNotifier.again();                   //  Notify child components
    }

    /**
     * Listens for session start triggers from @al/session
     */
    protected onSessionStarted = ( event:AlSessionStartedEvent ) => {
        this.refreshMenus();
        this.contextNotifier.again();
    }

    /**
     * Listens for acting account changed triggers from @al/session
     */
    protected onActingAccountChanged = ( event:AlActingAccountChangedEvent ) => {
        if ( event.actingAccount.id !== this.routeParameters['accountId'] ) {
            this.routeParameters['accountId'] = event.actingAccount.id;
            this.refreshMenus();
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
            let definition = this.getRouteByName( namedRouteId );
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
            } else if ( action.type === 'trigger' ) {
                console.log("AlNavigationService.Trigger [%s]", action.trigger );
                this.events.trigger( new AlNavigationTrigger( this,
                                                              action.trigger,
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
        this.navigateByURL( AlLocatorService.resolveURL( locTypeId, path ), parameters, options );
    }

    /**
     * Internal handler for navigation by raw URL
     */
    protected navigateByURL( url:string, parameters:{[p:string]:string} = {}, options:any = {} ) {
        url = this.applyParameters( url, parameters );
        console.log(`AlNavigationService: following link to [${url}]` );

        if ( options.hasOwnProperty('target') && options['target'] === '_blank' ) {
            window.open( url, "_blank" );
        } else {
            window.location.href = url;
        }
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
     * Processes a schema when it is loaded for the first time -- hydrates its menus, stores its named routes, etc.
     */
    protected ingestNavigationSchema( schemaId:string, schema:AlNavigationSchema ):AlNavigationSchema {
        //  First ingest named routes and add them to the internal dictionary
        if ( schema.namedRoutes ) {
            Object.entries( schema.namedRoutes )
                .forEach( ( [ routeId, routeDefinition ]:[ string, AlRouteDefinition ] ) => {
                    this.namedRouteDictionary[routeId] = routeDefinition;
                } );
        }
        //  Then build living menus from their definitions
        if ( schema.menus ) {
            Object.entries( schema.menus )
                .forEach( ( [ menuId, menuDefinition ]:[ string, AlRouteDefinition ] ) => {
                    const menuKey = `${schemaId}:${menuId}`;
                    if ( ! this.loadedMenus.hasOwnProperty( menuKey ) ) {
                        this.loadedMenus[`${schemaId}:${menuId}`] = new AlRoute( this, menuDefinition );
                    }
                } );
        }
        return schema;
    }

}
