import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlRoute } from '@al/common/locator';
import { filter } from 'rxjs/operators';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlNavigationTertiarySelected } from '../../types/navigation.types';

@Component({
    selector: 'al-archipeligo17-tertiary-menu',
    templateUrl: './al-archipeligo17-tertiary-menu.component.html',
    styleUrls: [ './al-archipeligo17-tertiary-menu.component.scss' ]
})

export class AlArchipeligo17TertiaryMenuComponent implements OnInit
{
    @Input()
    public visible:boolean      =   true;

    menu:AlRoute                =   null;
    public activeTabs:AlRoute   =   null;
    sidenavOpen:boolean         =   false;
    stateChanges: Subscription  =   null;

    constructor(public router:Router,
                public alNavigation:AlNavigationService) {
        this.alNavigation.events.attach( "AlNavigationTertiarySelected", this.onMenuChanged );
    }

    ngOnInit() {
        this.router.events
        .pipe(
            filter(e => e instanceof NavigationEnd))
        .subscribe(event => {
          this.onLocationChange();
        });
    }

    onDestroy = () => {
    }

    onMenuChanged = ( event:AlNavigationTertiarySelected ) => {
        this.menu = this.alNavigation.tertiaryMenu || event.child;
        this.alNavigation.setBookmark("tertiaryMenu", this.menu );
        if ( this.menu && this.menu.children.length > 0 ) {
            this.sidenavOpen = true;
            this.onLocationChange();
        } else {
            this.sidenavOpen = false;
        }
    }

    onClick( menuItem:AlRoute, $event:any ) {
        if ( $event ) {
            $event.stopPropagation();
            $event.preventDefault();
        }
        menuItem.dispatch();
    }

    onHoverStart( menuItem:AlRoute, $event:any ) {
        menuItem.refresh( true );
    }

    setMenuItemClasses( route:AlRoute, hasCuartoTab = false ) {
        let classes = [ route.getProperty("css_class", "default" ) ];
        if ( route.activated ) {
            classes.push( 'active' );
        }
        if ( ! route.activated ) {
            classes.push( "disabled" );
        }
        if ( hasCuartoTab ) {
            classes.push( "cuarto-tab" );
        }

        classes.push( route.id ? route.id.replace( /\:/g, "_" ) : route.caption.replace( /\s/g, "_" ) );
        route.setProperty( "consolidated_css_classes", classes.join(" " ) );
    }

    onLocationChange = () => {
        this.activeTabs = null;
        if ( this.menu ) {
            this.menu.refresh( true );
            for ( let i = 0; i < this.menu.children.length; i++ ) {
                this.setMenuItemClasses( this.menu.children[i]);
                if ( this.menu.children[i].activated ) {
                    this.activeTabs = this.menu.children[i];
                    for ( let j = 0; j < this.activeTabs.children.length; j++ ) {
                        this.setMenuItemClasses( this.activeTabs.children[j] , true);
                    }
                }
            }
        }
    }
}
