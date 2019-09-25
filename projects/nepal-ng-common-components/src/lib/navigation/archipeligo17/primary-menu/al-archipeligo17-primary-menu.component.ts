import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlStopwatch } from '@al/common';
import { AlRoute } from '@al/common/locator';
import { AlActingAccountResolvedEvent } from '@al/session';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlNavigationTertiarySelected } from '../../types';

@Component({
    selector: 'al-archipeligo17-primary-menu',
    templateUrl: './al-archipeligo17-primary-menu.component.html',
    styleUrls: [ './al-archipeligo17-primary-menu.component.scss' ]
})
export class AlArchipeligo17PrimaryMenuComponent implements OnInit, OnChanges, OnDestroy
{
    @Input() navigationScheme:string = "archipeligo";
    @Input() menu:AlRoute       =   null;

    externalChild:boolean       =   false;

    viewReady:boolean           =   false;
    primaryItems:AlRoute[]      =   [];             //  Primary menu items
    secondaryItems:AlRoute[]    =   [];             //  Subnav menu items
    activeSecondaryItem:AlRoute =   null;           //  Active secondary item

    constructor( public router:Router,
                 public alNavigation:AlNavigationService ) {
    }

    ngOnInit() {
        this.alNavigation.events.attach( "AlActingAccountResolved", this.onActingAccountResolved );
        this.alNavigation.events.attach( "AlNavigationContextChanged", this.onContextChanged );
        this.alNavigation.events.attach( "AlNavigationSecondarySelected", this.onSetSecondaryMenu );
    }

    ngOnChanges(changes:SimpleChanges) {
    }

    onActingAccountResolved = ( event:AlActingAccountResolvedEvent ) => {
        this.onContextChanged();
    }

    ngOnDestroy() {
    }

    onContextChanged = () => {
        if ( ! this.menu ) {
            return;
        }
        this.primaryItems = this.menu.children;
        this.onLocationChange();
    }

    onClick( menuItem:AlRoute, $event:any ) {
        if ( menuItem.properties.hasOwnProperty("target") && menuItem.properties.target === '_blank' ) {
            return;
        }
        if ( $event ) {
            $event.stopPropagation();
            $event.preventDefault();
        }
        menuItem.dispatch();
    }

    onHoverStart( menuItem:AlRoute, $event:any ) {
        menuItem.refresh( true );
    }
    onLocationChange = () => {
        let activeSecondaryItem = null;
        if ( this.menu ) {
            if ( ! this.externalChild ) {
                this.primaryItems = this.menu.children;
                const activeChild = this.findActiveChild(this.primaryItems);
                this.secondaryItems = activeChild ? activeChild.children : [];
            }
            activeSecondaryItem = this.findActiveChild(this.secondaryItems);
        }
        if ( activeSecondaryItem !== this.activeSecondaryItem ) {
            if ( activeSecondaryItem ) {
                if ( activeSecondaryItem !== this.activeSecondaryItem ) {
                    if ( activeSecondaryItem.children.length > 0 ) {
                        const event = new AlNavigationTertiarySelected(activeSecondaryItem);
                        this.alNavigation.events.trigger(event);
                    } else {
                        let event = new AlNavigationTertiarySelected(null);
                        this.alNavigation.events.trigger(event);
                    }
                }
            } else {
                let event = new AlNavigationTertiarySelected(null);
                this.alNavigation.events.trigger(event);
            }
            this.activeSecondaryItem = activeSecondaryItem;
        }
        this.viewReady = true;
    }

    setMenuItemClasses( route:AlRoute ) {
        let classes = [ route.getProperty("css_class", "default" ) ];
        if ( route.activated ) {
            classes.push( 'active' );
        }
        if ( ! route.enabled ) {
            classes.push( "disabled" );
        }

        classes.push( route.id ? route.id.replace( /\:/g, "_" ) : route.caption.replace( /\s/g, "_" ) );
        route.setProperty( "consolidated_css_classes", classes.join(" " ) );
    }

    onSetSecondaryMenu = ( context ) => {
        if ( context.child ) {
            this.secondaryItems = context.child.children;
            this.externalChild = true;
        } else {
            this.secondaryItems = [];
            this.externalChild = false;
        }
    }

    /**
     * set menu item classes and returns the activated item or null
     */
    findActiveChild(items) {
        let activeItem = null;
        items.forEach(item => {
            this.setMenuItemClasses(item);
            activeItem = item.activated ? item : activeItem;
        });
        return activeItem;
    }

}
