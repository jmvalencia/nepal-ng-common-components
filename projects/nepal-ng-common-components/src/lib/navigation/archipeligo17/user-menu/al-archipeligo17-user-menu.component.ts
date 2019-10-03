import { Component, Input, ViewChild, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem as PrimengMenuItem } from 'primeng/components/common/menuitem';
import { ConfirmationService } from 'primeng/api';
import { ALSession } from '@al/session';
import { AIMSAccount } from '@al/aims';
import { AlRoute, AlLocation, AlLocatorService, AlInsightLocations, AlStopwatch, AlSubscriptionGroup } from '@al/common';
import { AlArchipeligo17AccountSelectorComponent } from '../account-selector/al-archipeligo17-account-selector.component';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlNavigationContextChanged, AlNavigationSecondarySelected, AlNavigationTertiarySelected, AlDatacenterOptionsSummary } from '../../types';

@Component({
    selector: 'al-archipeligo17-user-menu',
    templateUrl: './al-archipeligo17-user-menu.component.html',
    styleUrls: [ './al-archipeligo17-user-menu.component.scss' ]
})

export class AlArchipeligo17UserMenuComponent implements OnInit, OnChanges, OnDestroy
{
    @Input() menu:AlRoute;

    public menuItems: PrimengMenuItem[];
    public userMenuAvailable:boolean        =   false;              //  controls visibility of entire authenticated user menu component

    public allAccountsData:AIMSAccount[]    = [];
    public allAccountsLoaded:boolean        = false;
    public notificationPrefsAvailable:boolean = false;

    /**
     *  Initials menu container
     */
    public initialsMenu:PrimengMenuItem[]     = null;

    /**
     *  Active child menu (determined during refresh cycles by activated items in primary menu)
     */
    public activeChild:AlRoute             = null;

    /**
     *  DCO properties
     */
    public datacenter:AlDatacenterOptionsSummary;

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
                 public alNavigation: AlNavigationService,
                 private confirmationService: ConfirmationService ) {
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
        this.loadinitialsMenu();
    }

    onNavigationContextChanged = ( navigationEvent?: AlNavigationContextChanged ) => {
        if ( ALSession.isActive() ) {
            this.userMenuAvailable = true;
            this.userName = ALSession.getUserName();
            this.accountName = ALSession.getActingAccountName();
            this.accountId = ALSession.getActingAccountID();

            const actingLocation = AlLocatorService.getActingNode();
            if ( actingLocation && ALSession.getActiveDatacenter() ) {
                const defenderDatacenterId = ALSession.getActiveDatacenter();
                const accessibleLocationIds = ALSession.getActingAccountAccessibleLocations();
                this.datacenter = this.alNavigation.generateDatacenterMenu( defenderDatacenterId, accessibleLocationIds, this.onClickDatacenter );
            } else {
                this.datacenter = undefined;
            }
            if ( this.menu ) {
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

    // load the logout from user dropdown menu
    loadinitialsMenu() {
        // Load the User Menu
        this.alNavigation.getMenu( 'cie-plus2', 'initials' ).then( initialMenu => {
            if(initialMenu) {
                this.initialsMenu = initialMenu.children.map( child => this.parseToPrimeMenuItem( child ) );
            }
        });
    }

    onClick( menuItem:AlRoute, $event:any ) {
        menuItem.refresh(true);
        if ( menuItem.properties.hasOwnProperty( "target" ) && menuItem.properties.target === "_blank" ) {
            return;
        }
        menuItem.dispatch();
    }

    onClickDatacenter = ( insightLocationId:string, $event:any ) => {
        const actor = AlLocatorService.getActingNode();
        if ( actor === null || ! AlInsightLocations.hasOwnProperty( insightLocationId ) ) {
            //  No eggs, no bacon?  No breakfast for you :(
            return;
        }
        const regionLabel = AlInsightLocations[insightLocationId].logicalRegion;
        this.confirmationService.confirm({
            key: 'confirmation',
            header: 'Are you sure?',
            message: `You are about to switch regions to ${regionLabel}.  Are you sure this is what you want to do?`,
            acceptLabel: 'Yes, switch now!',
            rejectLabel: 'No thanks',
            accept: () => {
                const originBaseURI = AlLocatorService.resolveURL( actor.locTypeId );
                ALSession.setActiveDatacenter( insightLocationId );
                AlLocatorService.setContext( { insightLocationId } );
                const targetBaseURI = AlLocatorService.resolveURL( actor.locTypeId );
                if ( targetBaseURI !== originBaseURI ) {
                    //  The new domain portal for the changed datacenter is the one we're on.  Emit a notice and redirect.
                    console.log(`NOTICE: changing active location to '${insightLocationId}' requires change to a new portal at [${targetBaseURI}]`);
                    this.alNavigation.navigate.byLocation( actor.locTypeId );
                } else {
                    //  The new domain portal is the same as the old one.  Route to its base/default route using angular's router.
                    this.alNavigation.navigate.byNgRoute( [ '/' ] );
                }
            }
        });
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
