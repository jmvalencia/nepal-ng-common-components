# al-entitled-content

## Overview

The `al-entitled-content` component allows application authors to easily protect views or view elements from accounts who are not entitled to see them.
It also provides functionality to automatically redirect to a more appropriate route when the acting account changes, show a zero state in the event the current user is unentitled, or redirect to a default route in the case the current user is unentitled.

## Basic Usage

```
<al-entitled-content entitlement="cloud_defender">
    Content for entitled view
    <div class="inaccessible">
        Only unentitled viewers will see this.
    </div>
</al-entitled-content>
```

The `entitlement` attribute can be any valid entitlement expression (e.g., `"cloud_insight&!active_watch_premier|web_security_managed"`), a named entitlement group (e.g., `"EntitlementGroup.Incidents"`),
OR the string constant `'*'` (which will always display the content).

_Best Practice_: Embed your entitlement expression or group directly into your component's markup instead of storing it in a public property on your component.  This makes it easier to tell when and how the component should work from its markup.

## Events

`al-entitled-content` emits three events under normal usage conditions.

`onHide` emits `void` when the current account's entitlements do NOT allow the acting user to view the entitled content, before it is hidden (or at initialization time).
`onDisplay` emits `void` when the current account's entitlements DO allow the acting user to view the entitled content, before it is displayed.
`unentitled` emits the current entitlements when the current account has been determined to be ineligible to view the protected content.  These entitlements take the form of an `EntitlementCollection` instance, which can be used to determine the best place to redirect to, for instance.

#### Example

Component HTML:

```
<al-entitled-content [entitlement]="'EntitlementGroup.CloudInsightOnly'"
                    (onDisplay)="beforeShowContent()"
                    (onHide)="beforeHideContent()"
                    (unentitled)="onUnentitledAccess($event)">
    Na nah, you can't see me without the right entitlements!

    <em>{{notice}}</em>
</al-entitled-content>
```

Component TS:

```
    public onDisplay() {
        console.log("Showing protected content" );
        this.notice = "I will be populated before the content displays.";
    }

    public onHide() {
        this.notice = null;     //  whatever 
    }

    public onUnentitledAccess( entitlements:EntitlementCollection ) {
        if ( this.navigation.evaluateEntitlement("log_manager|threat_manager", entitlements ) ) {
            this navigation.route( [ 'some', 'other', 'route' ] );
        } else {
            this navigation.route( [ 'some', 'other', 'other', 'route' ] );
        }
    }
```

In this example, the onDisplay event is used to calculate a property before the inner content is destroyed, clean it up when the current viewer is unentitled, and redirect to an alternative location based on the user's entitlements when the unentitled case is detected.

## Account Change Handling

Most applications with account-specific views will want to automatically reroute the current view to reference the newly activated account when it changes, or redirect to a default/"detector" route (typically '/') when the newly activated account is not entitled to access the current view.
The `al-entitled-content` component supports both of these common use cases with the @Input(s) `accountChangeRoute` and `unentitledRoute`.

Both `accountChangeRoute` and `unentitledRoute` can be assigned a boolean, string, or array of strings.  
When the acting account changes, IF the new account is entitled to view the inner content based on the `entitlement` attribute, then `al-entitled-content` will redirect to the given route.  
If `accountChangeRoute` is a boolean, the component will attempt to redirect to the current view, replacing the old account ID with the new one.  
If `accountChangeRoute` is a string, it will be treated as a route literal.
If `accountChangeRoute` is a string[], it will be treated as an array of route segments.

#### Examples

```
<al-entitled-content entitlement="threat_manager"
						 [accountChangeRoute]="true"
						 [unentitledRoute]="true">
	<div>My Content Lives Here</div>
</al-entitled-content>
```

The above example will display "My Content Lives Here" if the current account has the "threat_manager" entitlement.

If the acting account changes to another account that has the threat_manager entitlement, the component will redirect the application to the *same* route with the old acting account ID replaced with the new one.

If the acting account changes to an account without the threat_manager entitlement, it will redirect to the default unentitled route -- '/'.

```
<al-entitled-content entitlement="log_manager|cloud_insight"
						 [accountChangeRoute]="['kevin', 'was', 'here', ':accountId' ]"
						 unentitledRoute="/unacceptable/:accountId">
    <!-- State Seekrets Here -->
</al-entitled-content>
```

In the above example, state secrets will be shown to accounts with log manager or cloud insight entitlements.  If the account changes to an account with those entitlements, the app will be routed to '/kevin/was/here/(account ID)'.  Otherwise, it will be routed to '/unacceptable/(account ID)'.

*Note* that the component does not need to be used with both route inputs at once.  Either can be used in isolation, if the client wishes to show a zero state or not modify the route when the account changes.