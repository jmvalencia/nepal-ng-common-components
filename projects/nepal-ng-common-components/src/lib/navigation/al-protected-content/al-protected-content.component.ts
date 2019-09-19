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
import { AlRoute } from '@al/common/locator';
import { AlStopwatch, AlSubscriptionGroup } from '@al/common';
import { AlEntitlementCollection } from '@al/subscriptions';
import { EntitlementGroup } from '../types/entitlement-group.class';

@Component({
    selector: 'al-protected-content',
    templateUrl: './al-protected-content.component.html'
})

export class AlProtectedContentComponent implements OnInit, OnChanges, OnDestroy
{
    public contentVisible:boolean = null;

    @Input() entitlement:string|string[];

    @Input() accountChangeRoute:string|string[]|boolean         =   null;
    @Input() unentitledRoute:string|string[]|boolean            =   null;

    @Output() onDisplay:EventEmitter<any>                       =   new EventEmitter();
    @Output() onHide:EventEmitter<any>                          =   new EventEmitter();
    @Output() unentitled:EventEmitter<AlEntitlementCollection>  =   new EventEmitter<AlEntitlementCollection>();
    @Output() onAccountChange:EventEmitter<any>                 =   new EventEmitter<AIMSAccount>();

    protected subscriptions = new AlSubscriptionGroup( null );

    constructor( public router:Router,
                 public navigation:AlNavigationService ) {
        this.subscriptions.manage( ALSession.notifyStream.attach("AlActingAccountChanged", this.onAccountChanged ) );
        this.subscriptions.manage( ALSession.notifyStream.attach("AlActingAccountResolved", this.onAccountResolved ) );
    }

    ngOnInit() {
        this.setEntitlements( this.entitlement );
        ALSession.resolved().then( () => {
            if ( this.evaluateAccessibility() ) {
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
        if ( entitlement.indexOf("EntitlementGroup.") === 0 ) {
            entitlement = entitlement.substring( 17 );
            if ( EntitlementGroup.hasOwnProperty( entitlement ) ) {
                entitlement = EntitlementGroup[entitlement];
            } else {
                if ( this.entitlement instanceof Array ) {
                    let entitlementExpression = "";
                    for (let i = 0; i < this.entitlement.length; i++) {
                        (i === 0) ? entitlementExpression = this.entitlement[i]
                                  : entitlementExpression = `${entitlementExpression}|${this.entitlement[i]}`;
                    }
                    contentVisible = this.navigation.evaluateEntitlementExpression( entitlementExpression );
                } else {
                    console.warn("AlProtectedContent: cannot evaluate entitlement expression that is not a string!" );
                }
            }
        }
        return entitlement;
    }

    onAccountResolved = ( event:AlActingAccountResolvedEvent ) => {
        AlStopwatch.once( () => {
            if ( this.evaluateAccessibility( event.entitlements ) ) {
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

    evaluateAccessibility( entitlements:AlEntitlementCollection = null ):boolean {
        if ( ! entitlements ) {
            entitlements = this.navigation.entitlements;
        }
        let contentVisible = this.entitlement === '*' ? true :  false;
        // tslint:disable-next-line: no-boolean-literal-compare
        if ( contentVisible === false ){
            if ( typeof(this.entitlement) === "string" ) {
                contentVisible = this.navigation.evaluateEntitlementExpression( this.entitlement );
            } else {
                console.warn("AlProtectedContent: cannot evaluate entitlement expression that is not a string!" );
            }

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
}
