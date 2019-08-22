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

    activeChild:AlRoute         =   null;           //  First level activated item (topnav)
    activeGrandchild:AlRoute    =   null;           //  Second level activated item (subnav)
    externalChild:boolean       =   false;

    viewReady:boolean           =   false;
    primaryItems:AlRoute[]      =   [];             //  Primary menu items
    secondaryItems:AlRoute[]    =   [];             //  Subnav menu items

    refresh:AlStopwatch         =   null;

    constructor( public router:Router,
                 public alNavigation:AlNavigationService ) {
        this.refresh = AlStopwatch.later( this.onContextChanged );
    }

    ngOnInit() {
        this.alNavigation.events.attach( "AlActingAccountResolved", this.onActingAccountResolved );
        this.alNavigation.events.attach( "AlNavigationContextChanged", this.onContextChanged );
    }

    ngOnChanges(changes:SimpleChanges) {
        if ( changes.hasOwnProperty( "menu" ) ) {
            this.refresh.again();
        }
    }

    onActingAccountResolved = ( event:AlActingAccountResolvedEvent ) => {
    }

    ngOnDestroy() {
    }

    onContextChanged = () => {
        if ( ! this.menu ) {
            return;
        }
        this.primaryItems = this.menu.children;
        this.secondaryItems = [];
        for ( let i = 0; i < this.primaryItems.length; i++ ) {
            if ( this.primaryItems[i].activated ) {
                this.secondaryItems = this.primaryItems[i].children;
                break;
            }
        }
        this.viewReady = true;
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
        let activeGrandchild = null;
        if ( this.menu ) {
            this.menu.refresh( true );
            if ( ! this.externalChild ) {
                this.activeChild = null;
                for ( let i = 0; i < this.menu.children.length; i++ ) {
                    this.setMenuItemClasses( this.menu.children[i] );
                    if ( this.menu.children[i].activated ) {
                        this.activeChild = this.menu.children[i];
                    }
                }
            }
            if ( this.activeChild ) {
                for ( let j = 0; j < this.activeChild.children.length; j++ ) {
                    this.setMenuItemClasses( this.activeChild.children[j] );
                    if ( this.activeChild.children[j].activated ) {
                        activeGrandchild = this.activeChild.children[j];
                    }
                }
            }
        }
        if ( activeGrandchild !== this.activeGrandchild ) {
            if ( activeGrandchild ) {
                if ( activeGrandchild !== this.activeGrandchild ) {
                    if ( activeGrandchild.children.length > 0 ) {
                        /**
                         *  TODO: turn this into a constant
                         */
                        let event = new AlNavigationTertiarySelected(activeGrandchild);
                        this.alNavigation.events.trigger(event);
                    } else if ( activeGrandchild.getProperty( "tertiaryMenu" ) ) {
                        let tertiaryMenuId = activeGrandchild.getProperty( "tertiaryMenu" );
                        this.alNavigation.getMenu( this.navigationScheme, tertiaryMenuId  )
                                        .then( tertiaryMenu => {
                                            let event = new AlNavigationTertiarySelected(tertiaryMenu);
                                            this.alNavigation.events.trigger(event);
                                        }, error => {
                                            console.warn(`WARNING: failed to retrieve tertiary menu ${tertiaryMenuId} from navigation scheme ${this.navigationScheme}; ignoring.` );
                                        } );
                    } else {
                        let event = new AlNavigationTertiarySelected(null);
                        this.alNavigation.events.trigger(event);
                    }
                }
            } else {
                let event = new AlNavigationTertiarySelected(null);
                this.alNavigation.events.trigger(event);
            }
            this.activeGrandchild = activeGrandchild;
        }
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
}
