import { TemplateRef } from '@angular/core';
import { AlRoute, AlRouteDefinition, AlRoutingHost, AlNavigationSchema } from '@al/common/locator';
import { AlTrigger, AlTriggerStream, AlTriggeredEvent } from '@al/common';
import { AlActingAccountResolvedEvent, AlSessionInstance } from '@al/session';
import { MenuItem as PrimengMenuItem } from 'primeng/components/common/menuitem';

/**
 * This interface is used to abstract services that a host application must provide to top-level navigation components
 * in order for them to request data and adapt to their environment.  Most of this external functionality is already described
 * by the AlRoutingHost interface in @al/common/locator; this interface extends that one.
 */
export interface AlNavigationHost extends AlRoutingHost
{
    /**
     * A method to retrieve a menu definition (identified by `schema` and `menuId`)
     * from the local execution environment.
     */
    getMenu( schema:string, menuId:string ):Promise<AlRoute>;
}

/**
 * A triggered event that indicates something in the parent frame has changed -- either a new schema is being installed, the experience setting has changed.
 * This event will not fire until the schema has been fully loaded.
 */
@AlTrigger("AlNavigationFrameChanged")
export class AlNavigationFrameChanged extends AlTriggeredEvent<void>
{
    constructor( public host:AlNavigationHost,
                 public schema:AlNavigationSchema,
                 public experience:string ) {
        super();
    }
}

/**
 * A triggered event that indicates something in the navigation context has changed -- specifically, this can be
 *     - A new route/URL has been set
 *     - Route parameters have changed
 *     - Acting account/effective eEntitlements have changed
 *     - Authentication status has changed
 */
@AlTrigger("AlNavigationContextChanged")
export class AlNavigationContextChanged extends AlTriggeredEvent<void>
{
    constructor( public host:AlNavigationHost,
                 public session: AlSessionInstance ) {
        super();
    }
}

/**
 * This event will be triggered when a route of type `trigger` is dispatched by AlNavigationService.
 * Its `host` property will refer to AlNavigationService; its `triggerName` will indicate the name of the trigger.
 *
 * This event type can accept boolean responses indicating whether the event was handled as expected.
 */
@AlTrigger("AlNavigationTrigger")
export class AlNavigationTrigger extends AlTriggeredEvent<boolean>
{
    constructor( public host:AlNavigationHost,
                 public triggerName:string,
                 public definition:AlRouteDefinition,
                 public route:AlRoute ) {
        super();
    }
}

/**
 * @deprecate
 */
@AlTrigger("AlNavigationSecondarySelected")
export class AlNavigationSecondarySelected extends AlTriggeredEvent<void>
{
    constructor(public child: AlRoute) {
        super( "AlNavigationSecondarySelected" );
    }
}

/**
 * @deprecate
 */
@AlTrigger("AlNavigationTertiarySelected")
export class AlNavigationTertiarySelected extends AlTriggeredEvent<void>
{
    constructor(public child: AlRoute) {
        super( "AlNavigationTertiarySelected" );
    }
}

/**
 * This event is intended to replace AlNavigationSecondarySelected and AlNavigationTertiarySelected.
 * It will be emitted when AlNavigationService detects activation (or deactivation) of a route with the
 * `childOutlet` property set to a known content slot in the navigation frame.
 *
 * A listener can `respond` to the event with a `TemplateRef<any>` value, which (in the case of the sidenav) will be
 * emitted into the appropriate content slot.
 */
@AlTrigger("AlNavigationRouteMounted")
export class AlNavigationRouteMounted extends AlTriggeredEvent<TemplateRef<any>>
{
    constructor( public contentOutlet:string,
                 public container:AlRoute       ) {
        super( "AlNavigationRouteMounted" );
    }
}

export interface ExperiencePreference
{
    displayBetaNavigation:  boolean;
    dismissBetaForever?:    boolean;
    offerBetaTutorial?:     boolean;
}

export interface AlDatacenterOptionsSummary
{
    locationsAvailable:     number;
    selectableRegions:      PrimengMenuItem[];
    currentRegion:          string;
    currentResidency:       string;
}

export const ALNAV_DISABLE_PRIMARY = "alNavigation.disablePrimary";
export const ALNAV_DISABLE_TERTIARY = "alNavigation.disableTertiary";

export type Experience = "default" | "beta"; // Experience types used to define the content to display
