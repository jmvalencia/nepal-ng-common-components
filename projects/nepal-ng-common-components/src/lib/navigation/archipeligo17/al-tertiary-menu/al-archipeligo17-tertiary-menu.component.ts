import { Component, OnInit, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlRoute } from '@al/common';
import { filter } from 'rxjs/operators';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlNavigationTertiarySelected } from '../../types/navigation.types';

@Component({
    selector: 'al-archipeligo17-tertiary-menu',
    templateUrl: './al-archipeligo17-tertiary-menu.component.html',
    styleUrls: [ './al-archipeligo17-tertiary-menu.component.scss' ]
})

export class AlArchipeligo17TertiaryMenuComponent implements OnInit, OnChanges
{
    @Input()
    public visible:boolean      =   true;

    @Input()
    menu:AlRoute                =   null;

    @Input()
    contentRef:TemplateRef<any> =   null;

    public activeTabs:AlRoute   =   null;
    sidenavOpen:boolean         =   false;
    stateChanges: Subscription  =   null;

    constructor(public router:Router,
                public alNavigation:AlNavigationService) {

    }

    ngOnInit() {
    }

    ngOnChanges( changes:SimpleChanges ) {
        if ( changes.hasOwnProperty( "menu" ) || changes.hasOwnProperty( "contentRef" ) ) {
            this.onMenuChanged();
        }
    }

    onMenuChanged = () => {
        if ( ( this.menu && this.menu.children.length > 0 ) || this.contentRef ) {
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

        classes.push( route.definition.id ? route.definition.id.replace( /\:/g, "_" ) : route.caption.replace( /\s/g, "_" ) );
        route.setProperty( "consolidated_css_classes", classes.join(" " ) );
    }

    onLocationChange = () => {
        this.activeTabs = null;
        if ( this.menu ) {
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
