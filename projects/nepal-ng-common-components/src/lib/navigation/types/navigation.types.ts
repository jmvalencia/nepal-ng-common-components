import { AlRoute, AlRouteDefinition, AlRoutingHost, AlNavigationSchema } from '@al/common/locator';
import { AlTriggerStream, AlTriggeredEvent } from '@al/common';
import { AlActingAccountResolvedEvent, AlSessionInstance } from '@al/session';

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
export class AlNavigationFrameChanged extends AlTriggeredEvent
{
    constructor( public host:AlNavigationHost,
                 public schema:AlNavigationSchema,
                 public experience:string ) {
        super( "AlNavigationFrameChanged" );
    }
}

/**
 * A triggered event that indicates something in the navigation context has changed -- specifically, this can be
 *     - A new route/URL has been set
 *     - Route parameters have changed
 *     - Acting account/effective eEntitlements have changed
 *     - Authentication status has changed
 */
export class AlNavigationContextChanged extends AlTriggeredEvent
{
    constructor( public host:AlNavigationHost,
                 public session: AlSessionInstance ) {
        super( "AlNavigationContextChanged" );
    }
}

export class AlNavigationTrigger extends AlTriggeredEvent
{
    constructor( public host:AlNavigationHost,
                 public triggerName:string,
                 public definition:AlRouteDefinition,
                 public route:AlRoute ) {
        super("AlNavigationTrigger");
    }
}

export class AlNavigationSecondarySelected extends AlTriggeredEvent
{
    constructor(public child: AlRoute) {
        super( "AlNavigationSecondarySelected" );
    }
}

export class AlNavigationTertiarySelected extends AlTriggeredEvent
{
    constructor(public child: AlRoute) {
        super( "AlNavigationTertiarySelected" );
    }
}

export interface ExperiencePreference
{
    displayBetaNavigation:  boolean;
    dismissBetaForever?:    boolean;
    offerBetaTutorial?:     boolean;
}

export const ALNAV_DISABLE_PRIMARY = "alNavigation.disablePrimary";
export const ALNAV_DISABLE_TERTIARY = "alNavigation.disableTertiary";
