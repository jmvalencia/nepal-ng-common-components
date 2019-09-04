import { Component, Input, ViewChild, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ALSession } from '@al/session';
import { AIMSClient, AIMSAccount } from '@al/aims';
import { AlRoute, AlLocation, AlLocatorService } from '@al/common/locator';
import { AlArchipeligo17AccountSelectorComponent } from '../account-selector/al-archipeligo17-account-selector.component';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlNavigationContextChanged, AlNavigationSecondarySelected, AlNavigationTertiarySelected } from '../../types';
import { AlStopwatch, AlTriggerStream, AlSubscriptionGroup } from '@al/common';
import { MenuItem as PrimengMenuItem } from 'primeng/components/common/menuitem';

@Component({
    selector: 'al-archipeligo17-user-menu',
    templateUrl: './al-archipeligo17-user-menu.component.html',
    styleUrls: [ './al-archipeligo17-user-menu.component.scss' ]
})

export class AlArchipeligo17UserMenuComponent implements OnInit, OnChanges, OnDestroy
{
    @Input() menu:AlRoute;

    public menuItems: PrimengMenuItem[];
    public userMenuAvailable:boolean        =   false;      //  controls visibility of entire authenticated user menu component

    public allAccountsData:AIMSAccount[]    = [];
    public allAccountsLoaded:boolean        = false;
    public notificationPrefsAvailable:boolean = false;

    /**
     *  Initials menu container
     */
    public initialsMenu:AlRoute            = null;

    /**
     *  Active child menu (determined during refresh cycles by activated items in primary menu)
     */
    public activeChild:AlRoute             = null;

    /**
     *  DCO properties
     */
    public locations:{[dataResidency:string]:AlRoute[]} = {};      //  list of available locations (as AlRoute instances), keyed by data residency code.
    public locationsAvailable:number        =   0;              //  whether or not any locations are available to switch to
    public currentLocationResidency:string  =   'US';               //  data residency of currently selected location
    public currentLocationName:string       =   '';

    /**
     *  Account and user information
     */
    public userName:string                  = "";
    public accountName:string               = "";
    public accountId:string                 = "";

    public refresh:AlStopwatch              =   null;

    @ViewChild(AlArchipeligo17AccountSelectorComponent) accountSelector:AlArchipeligo17AccountSelectorComponent;

    /**
     *  Private/internal state
     */
    protected subscriptions                 =   new AlSubscriptionGroup( null );

    constructor( public router:Router,
                 public activatedRoute:ActivatedRoute,
                 public alNavigation: AlNavigationService ) {
        this.subscriptions.manage( this.alNavigation.events.attach( "AlNavigationContextChanged", this.onNavigationContextChanged ) );
        this.onNavigationContextChanged( new AlNavigationContextChanged( this.alNavigation, ALSession ) );
        this.refresh = AlStopwatch.later( this.onNavigationContextChanged );
    }

    ngOnInit() {
        this.loadAllManagedAccounts();
    }

    ngOnDestroy = () => {
        this.subscriptions.cancelAll();
    }

    ngOnChanges(changes: SimpleChanges){
        if (typeof changes['menu'] !== 'undefined') {
            this.loadMenu();
        }
    }

    onNavigationContextChanged = ( navigationEvent?: AlNavigationContextChanged ) => {
        if ( ALSession.isActive() ) {
            this.userMenuAvailable = true;
            this.userName = ALSession.getUserName();
            this.accountName = ALSession.getActingAccountName();
            this.accountId = ALSession.getActingAccountID();

            /*
            let actingNode = this.brainstem.getServiceMatrix().getActingNode();

            if ( actingNode ) {
                // let currentLocationId = this.property( O3CoreState.BoundLocationID ) || "none"; //commented out since this var is not in use below
                this.locationsAvailable = 0;
                this.currentLocationResidency = actingNode.dataResidency || "US";       //  bah
                this.currentLocationName = actingNode.uiCaption || actingNode.locationId || '';

                let accessibleLocations = this.brainstem.getServiceMatrix().getAccessibleLocations( this.navigation );
                this.locations = {};
                for ( let i = 0; i < accessibleLocations.length; i++ ) {
                    let route = accessibleLocations[i];
                    let residency = route.getProperty("dataResidency") || "US";
                    let routeNode = accessibleLocations[i].getProperty( "node" );
                    this.locationsAvailable++;
                    if ( ! this.currentLocationName || route.activated ) {
                        this.currentLocationResidency = residency;
                        this.currentLocationName = route.caption;
                    }

                    if ( ! this.locations.hasOwnProperty( residency ) ) {
                        this.locations[residency] = [];
                    }
                    this.locations[residency].push( route );
                }
            }
             */
            if ( this.menu ) {
                this.menu.refresh( true );
                const activeChild = this.menu.children.find(child => child.activated);
                if ( activeChild && activeChild !== this.activeChild ) {
                    this.activeChild = activeChild;
                    this.alNavigation.events.trigger( new AlNavigationSecondarySelected(activeChild) );   // set
                } else if ( ! activeChild && this.activeChild ) {
                    this.activeChild = null;
                    this.alNavigation.events.trigger( new AlNavigationTertiarySelected(this.activeChild) );   //  clear
                }

                // Setting tertiary menu
                if (this.activeChild) {
                    const activeGrandchild = this.activeChild.children.find(child => child.activated);
                    this.alNavigation.events.trigger(new AlNavigationTertiarySelected(activeGrandchild));
                }

                this.menuItems = this.menu.children.map((child: AlRoute) => {
                    return this.parseToPrimeMenuItem(child);
                });
            }

        } else {
            this.userMenuAvailable = false;
        }
    }

    parseToPrimeMenuItem(route: AlRoute) {
        const menuItem: PrimengMenuItem = {
            label: route.caption,
            visible: route.visible,
            command: (event) => { this.onClick(route, event); }
        };
        if (route['href']) {
            menuItem.url = route.href;
        }
        if (route.properties.iconClass === 'material-icons') {
            menuItem.icon = 'ui-icon-' + route.properties.iconText.replace(/(_)/g, '-');
        } else {
            menuItem.icon = route.properties.iconClass;
        }
        return menuItem;
    }

    refreshUserData = () => {
        /**
         * TODO: reimplement this using nepal tooling
         */
        /*
        this.accountMenuAvailable   = true;
        if ( this.brainstem.getServiceMatrix().getActingNode() ) {
            if ( this.brainstem.getServiceMatrix().getActingNode().serviceNodeId === AlServiceIdentity.AccountsUI ) {
                this.router.events.subscribe( event => {
                    if ( event instanceof NavigationEnd) {
                        this.accountMenuAvailable = true;
                        if (this.activatedRoute.snapshot.firstChild.data.hasOwnProperty( 'disableAccountSwitch') ) {
                            this.accountMenuAvailable = !this.activatedRoute.snapshot.firstChild.data['disableAccountSwitch'];
                        }
                    }
                });
            }
        }
        this.activeAccountID = this.brainstem.getActingAccountId();
        this.accountName = this.brainstem.getActingAccountName();
        this.userName = this.brainstem.getActingUserName();
        let parts = [];
        if ( this.accountName ) {
            parts = this.accountName.split(" " );
            this.accountFirstName = parts.shift();
            this.accountSecondName = parts.join( " " );
        } */
    }

    // load the menu
    loadMenu() {
        // Load the User Menu
        this.alNavigation.getMenu(  'cie-plus2', 'user' ).then( menu => {
                // this.viewReady = true;
                this.menu = menu;
                this.refresh.again();
            },
            err => {
                console.error("Failed to retrieve menu 'user'; not instantiating.", err );
                // this.menu = AlXRoute.abstract( this.navigation, "Empty Menu" );
            });
    }

    onClick( menuItem:AlRoute, $event:any ) {
        menuItem.refresh(true);
        if ( menuItem.properties.hasOwnProperty( "target" ) && menuItem.properties.target === "_blank" ) {
            return;
        }
        if ( ! menuItem.definition.action.hasOwnProperty('type') ) {
            $event.stopPropagation();
            $event.preventDefault();
        }
        if (menuItem.enabled) {
            menuItem.dispatch();
        }
    }

    onClickDatacenter( menuItem:AlRoute, $event:any ) {
        /*
        if ( $event ) {
            $event.preventDefault();
        }
        let dialogRef = this.dialog.open( AlConfirmComponent, {
            width: '80%',
            data: {
                title:      'Are you sure?',
                message:    `You are about to switch regions to ${menuItem.caption}.  Are you sure this is what you want to do?`,
                cancel:     'No thanks',
                confirm:    'Yes, switch now!',
                data:       menuItem            // if user confirms, this will be emitted from the afterClosed() observable
            }
        } );

        dialogRef.afterClosed().subscribe( menuItemDCO => {
            if ( menuItemDCO ) {
                if ( menuItemDCO.action.locationId ) {
                    this.brainstem.setLocationInfo( menuItemDCO.action.locationId, null, true );
                    menuItemDCO.refresh( true );     //  bwahahha
                }

                console.warn("User has changed datacenters.  Entry point: ", menuItemDCO );
                this.onClick( <AlRoute>menuItemDCO, undefined );
            }
        } );
        */
    }

    onHoverStart( menuItem:AlRoute, $event:any ) {
        menuItem.refresh( true );
    }

    onHoverEnd( menuItem:AlRoute, $event:any ) {
    }

    getDefaultReturnLocation() {
        let path = this.router.url;
        if ( path.indexOf( "?" ) !== -1 ) {
            path = path.substring( 0, path.indexOf( "?" ) );
        }
        return path;
    }

    /**
     * When a new account has been selected.
     */
    selectActingAccount(selectedAccount:AIMSAccount) {
        if (!selectedAccount || !selectedAccount.id) {
            return;
        }
        this.selectActingAccountById(selectedAccount.id);
    }

    /**
     * When a new account has been selected.
     * TODO: reinstate this funness
     */
    selectActingAccountById(selectedAccountID) {
        this.alNavigation.setActingAccount( selectedAccountID );
    }

    /**
     * Loads all the accounts.
     */
    loadAllManagedAccounts = () => {
        ALSession.getManagedAccounts().then(
            accounts => {
                accounts.push( ALSession.getPrimaryAccount() );
                this.allAccountsData = accounts;
            }
        );
    }

    /**
     * Navigates to the user preferences page.
     */
    public goToUserPreferences = () => {
        if ( ! this.notificationPrefsAvailable ) {
            return;
        }

        AlRoute.link( this.alNavigation, AlLocation.AccountsUI, '/#/preferences/notifications' ).dispatch();
    }
}
