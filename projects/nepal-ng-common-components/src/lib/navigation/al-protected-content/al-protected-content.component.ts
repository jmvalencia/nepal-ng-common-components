/**
 *  AlProtectedContentComponent provides a simple way to project content that is entitlement-specific without having to actually worry about
 *  the entitlements subsystem.
 *
 *  To use it, simply wrap your content inside an <al-protected-content> block with the appropriate entitlement expression assigned to its `entitlement` property.
 *  This entitlement expression can be either a | separated list of product families (see O3NavigationService.evaluateEntitlements) OR a named entitlement
 *  group (see the EntitlementGroup class).
 *
 *  The component also accepts optional event handlers for when the content is displayed or hidden (onDisplay and onHide) respectively.
 *
 *  <al-protected-content entitlement="EntitlementGroup.AnyDefender"
 *                       (onDisplay)="onContentDisplayed()"
 *                       (onHide)="onContentHidden()"
 *                       (unentitled)="onUnentitledAccess($event)">
 *      <div>This is my cloud defender-specific content!  Hurrah!</div>
 *      <div class="inaccessible">This is only visible if the content's entitlement requirements aren't met.</div>
 *  </al-protected-content>
 *
 *  The visibility of the content will be updated dynamically as entitlements for different accounts are resolved.
 *
 *  The `unentitled` event emitter will dispatch a copy of the current effective EntitlementCollection to the attached event handler,
 *  allowing the patron component to react to the invalid access in an entitlement-specific way.
 *
 *  @author McNielsen <knielsen@alertlogic.com>
 *  @copyright Alert Logic Inc, 2018
 */

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlNavigationService } from '../services/al-navigation.service';
import { AIMSAccount } from '@al/aims';
import { ALSession, AlActingAccountChangedEvent, AlActingAccountResolvedEvent } from '@al/session';
import { AlRoute, AlRouteDefinition, AlRouteCondition } from '@al/common/locator';
import { AlStopwatch, AlSubscriptionGroup } from '@al/common';
import { AlEntitlementCollection } from '@al/subscriptions';
import { EntitlementGroup } from '../types/entitlement-group.class';
import { AlExperiencePreferencesService } from '../services/al-experience-preferences.service';
import { AlExperience } from '../types/navigation.types';

@Component({
    selector: 'al-protected-content',
    templateUrl: './al-protected-content.component.html'
})

export class AlProtectedContentComponent implements OnInit, OnChanges, OnDestroy
{
    public contentVisible:boolean = null;

    @Input() entitlement:string|string[];
    @Input() experienceAllowed:AlExperience|AlExperience[]      =   ['beta','default', null];// experience allowed by default

    @Input() accountChangeRoute:string|string[]|boolean         =   null;
    @Input() unentitledRoute:string|string[]|boolean            =   null;

    @Output() onDisplay:EventEmitter<any>                       =   new EventEmitter();
    @Output() onHide:EventEmitter<any>                          =   new EventEmitter();
    @Output() unentitled:EventEmitter<AlEntitlementCollection>  =   new EventEmitter<AlEntitlementCollection>();
    @Output() onAccountChange:EventEmitter<any>                 =   new EventEmitter<AIMSAccount>();

    protected subscriptions = new AlSubscriptionGroup();

    constructor( public router:Router,
                 public navigation:AlNavigationService,
                 public experiencePreferences: AlExperiencePreferencesService ) {
        this.subscriptions.manage(
            ALSession.notifyStream.attach("AlActingAccountChanged", this.onAccountChanged ),
            ALSession.notifyStream.attach("AlActingAccountResolved", this.onAccountResolved )
        );
    }

    ngOnInit() {
        this.setEntitlements( this.entitlement );
        Promise.all( [ ALSession.resolved(), this.navigation.ready() ] ).then( async () => {
            if ( await this.evaluateAccessibility() ) {
                this.onAccountChange.emit( ALSession.getActingAccount() );
            }
        });
    }

    ngOnChanges( changes:SimpleChanges ) {
        if ( changes.hasOwnProperty( 'entitlement' ) ) {
            if ( ! changes.entitlement.firstChange ) {
                //  Reflect changes to the entitlement string after onInit has been executed
                this.setEntitlements( changes.entitlement.currentValue );
                this.evaluateAccessibility();
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.cancelAll();
    }

    setEntitlements = ( entitlement:string|string[] ) => {
        if ( ! entitlement ) {
            console.warn("Warning: the entitlement expression of the al-protected-content component should not be empty; using '*'" );
            this.entitlement = "*";
        }
        if ( typeof( entitlement) === "string" ) {
            this.entitlement = this.setEntitlementGroup(entitlement);
        }

        if ( entitlement instanceof Array ){
            for (let i = 0; i < entitlement.length; i++) {
                entitlement[i] = this.setEntitlementGroup(entitlement[i]);
            }
            this.entitlement = entitlement;
        }
    }

    setEntitlementGroup = ( entitlement:string ):string=> {
        if ( entitlement.startsWith("EntitlementGroup.") ) {
            entitlement = entitlement.substring( 17 );
            if ( EntitlementGroup.hasOwnProperty( entitlement ) ) {
                entitlement = EntitlementGroup[entitlement];
            } else {
                throw new Error(`Warning: the entitlement expression 'EntitlementGroup.${entitlement}' does not reflect a valid entitlement group.  Are you using an outdated O3 constant?` );
            }
        } else if ( entitlement === '@schema' ) {
            entitlement = this.getEntitlementsFromSchema();
            console.log(`Notice: al-protected-content extracted entitlement expression "${entitlement}" from currently activated route` );
        }
        return entitlement;
    }

    onAccountResolved = ( event:AlActingAccountResolvedEvent ) => {
        AlStopwatch.once( async () => {
            if ( await this.evaluateAccessibility( event.entitlements ) ) {
                this.onAccountChange.emit( event.actingAccount );
            }
        }, 10 );
    }

    onAccountChanged = ( event:AlActingAccountChangedEvent ) => {
        if ( this.contentVisible && this.accountChangeRoute ) {
            this.dispatchRoute( this.accountChangeRoute, event, window.location.pathname );
        } else if ( ! this.contentVisible && this.unentitledRoute ) {
            this.dispatchRoute( this.unentitledRoute, event, "/" );
        }
    }

    onContentUnavailable = ( invalidEntitlements:AlEntitlementCollection ) => {
        this.onHide.emit();
        this.unentitled.emit( invalidEntitlements );
    }

    async evaluateAccessibility( entitlements:AlEntitlementCollection = null ):Promise<boolean> {
        if ( ! entitlements ) {
            entitlements = this.navigation.entitlements;
        }
        let contentVisible = this.entitlement === '*' ? true :  false;
        // tslint:disable-next-line: no-boolean-literal-compare
        if ( contentVisible === false ){
            if ( typeof(this.entitlement) === "string" ) {
                contentVisible = this.navigation.evaluateEntitlementExpression( this.entitlement );
            } else if ( this.entitlement instanceof Array ) {
                contentVisible = this.navigation.evaluateEntitlementExpression( this.entitlement.join('|') );
            } else {
                console.warn("AlProtectedContent: cannot evaluate entitlement expression that is not a string!" );
            }

        }
        // Check the experience preference
        try{
            await this.experiencePreferences.getExperiencePreferences();// to avoid getExperience() 'null' due to the delay to set the experience
            const experience = this.navigation.getExperience();// get the current experience
            const isExperienceAllowed = this.experienceAllowed instanceof Array ? this.experienceAllowed.includes(experience) : this.experienceAllowed === experience;
            contentVisible = contentVisible && isExperienceAllowed;
        }catch(err){
            console.error(err);
        }

        if ( contentVisible ) {
            this.onDisplay.emit();
        } else {
            this.onContentUnavailable( entitlements );
        }
        this.contentVisible = contentVisible;
        return contentVisible;
    }

    /**
     * Dispatches a route.  This can be a boolean 'true' (in which case the defaultRoute will be used),
     * a string URL, or an array of segments.
     *
     * The method will coerce any of these inputs into an array of segments, and replace :accountId with the new acting account ID for each segment.
     */
    dispatchRoute( route:string|string[]|boolean, event:AlActingAccountChangedEvent, defaultRoute:string ) {
        if ( ! event.previousAccount ) {
            return;
        }
        if ( typeof( route ) === 'boolean' ) {
            route = defaultRoute.replace( `/${event.previousAccount.id}`, `/${event.actingAccount.id}` );       //  only replace the old account ID with the new one if it is at the beginning of a path segment
        }

        if ( typeof( route ) === 'string' ) {
            route = route.split("/").slice( 1 );
        }

        if ( route instanceof Array ) {
            route[0] = `/${route[0]}`;      // route relative to root
            route = route.map( el => el.replace( ":accountId", event.actingAccount.id ) );
            this.navigation.navigate.byNgRoute( route );
        }
    }

    /**
     * Attempts to retrieve a valid entitlement expression from the current activated route.
     */
    getEntitlementsFromSchema() {
        if ( ! this.navigation.activatedRoute ) {
            console.warn("Warning: al-protected-content cannot extract entitlements from schema; no activated route is currently set." );
            return "void_entitlement";
        }
        let route = this.navigation.activatedRoute;
        while( route ) {
            if ( typeof( route.definition.visible ) === 'object' ) {
                let entitlementExpression = this.getEntitlementsFromRouteCondition( route.definition.visible );
                if ( entitlementExpression ) {
                    return entitlementExpression;
                }
            }
            route = route.parent;
        }

        console.warn("Warning: al-protected-content cannot extract entitlements from schema; activated route hierarchy does not contain any entitlement conditions." );
        return "void_entitlement";
    }

    /**
     * Attempts to retrieve a valid entitlement expression from a route condition (or nested condition).  PLEASE NOTE
     * that this will not yield the desired results in cases of complex or compound route conditions.
     */
    getEntitlementsFromRouteCondition( condition:AlRouteCondition ):string {
        if ( condition.entitlements ) {
            return condition.entitlements;
        }
        if ( condition.conditions && condition.rule === 'all' ) {
            for ( let i = 0; i < condition.conditions.length; i++ ) {
                let entitlementExpression = this.getEntitlementsFromRouteCondition( condition.conditions[i] );
                if ( entitlementExpression ) {
                    return entitlementExpression;
                }
            }
        }
        return null;
    }
}
