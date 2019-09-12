import { Component, Input, ViewChild, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ALSession } from '@al/session';
import { AIMSAccount } from '@al/aims';
import { AlRoute, AlLocation, AlLocatorService } from '@al/common/locator';
import { AlArchipeligo17AccountSelectorComponent } from '../account-selector/al-archipeligo17-account-selector.component';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlNavigationContextChanged, AlNavigationSecondarySelected, AlNavigationTertiarySelected } from '../../types';
import { AlStopwatch, AlSubscriptionGroup } from '@al/common';
import { MenuItem as PrimengMenuItem } from 'primeng/components/common/menuitem';
import { ConfirmationService } from 'primeng/api';

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
    public initialsMenu:AlRoute            = null;

    /**
     *  Active child menu (determined during refresh cycles by activated items in primary menu)
     */
    public activeChild:AlRoute             = null;

    /**
     *  DCO properties
     */
    public locations:{[dataResidency:string]:AlRoute[]} = {};       //  list of available locations (as AlRoute instances), keyed by data residency code.
    public locationsAvailable:number        =   0;                  //  whether or not any locations are available to switch to
    public currentLocationResidency:string  =   'US';               //  data residency of currently selected location
    public currentLocationName:string       =   '';
    public regionSelectorItems: PrimengMenuItem[] = [];

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

    /* TODO(kjn): procure this data from @al/common/locator, for the sake of DRYness...  this is only included here until it can be updated.*/
    protected insightLocations: {[i:string]: ({residency: string; residencyCaption?: string, alternatives?: string[]; logicalRegion: string});} = {
        "defender-us-denver": {
            residency: "US",
            residencyCaption: "UNITED STATES",
            logicalRegion: "us-west-1"
        },
        "defender-us-ashburn": {
            residency: "US",
            residencyCaption: "UNITED STATES",
            logicalRegion: "us-east-1"
        },
        "defender-uk-newport": {
            residency: "EMEA",
            residencyCaption: "UNITED KINGDOM",
            logicalRegion: "uk-west-1"
        },
        "insight-us-virginia": {
            residency: "US",
            residencyCaption: "UNITED STATES",
            alternatives: [ "defender-us-denver", "defender-us-ashburn" ],
            logicalRegion: "us-east-1"
        },
        "insight-eu-ireland": {
            residency: "EMEA",
            residencyCaption: "UNITED KINGDOM",
            alternatives: [ "defender-uk-newport" ],
            logicalRegion: "uk-west-1"
        }
    };

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

            const actingLocation = AlLocatorService.getActingNode();
            if ( actingLocation && ALSession.getActiveDatacenter() ) {
                const defenderDatacenterId = ALSession.getActiveDatacenter();
                const accessibleLocationIds = ALSession.getActingAccountAccessibleLocations();
                this.currentLocationResidency = actingLocation.dataResidency || "US";
                this.generateDatacenterMenu( defenderDatacenterId, accessibleLocationIds );
            } else {
                this.regionSelectorItems = [];
            }
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
        menuItem.dispatch();
    }

    onClickDatacenter( insightLocationId:string, $event:any ) {
        const actor = AlLocatorService.getActingNode();
        if ( actor === null || ! this.insightLocations.hasOwnProperty( insightLocationId ) ) {
            //  No eggs, no bacon?  No breakfast for you :(
            return;
        }
        const regionLabel = this.insightLocations[insightLocationId].logicalRegion;
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

    /**
     *  Generates the available data center menu structure.
     *
     *  A note on history: the reason this code is so unduly complicated is because, when the data center selector was introduced during 2017's "Universal Navigation"
     *  project (a time period when it was necessary to manage seperate user accounts and logins for different datacenters, if you can imagine that) the decision was made
     *  to conflate defender and insight locations into composites "us-west-1", "us-east-1", and "uk-west-1".  The problem, of course, is that the defender and insight
     *  datacenters of the US are asymmetrical.  It was assumed that the number of datacenters would inevitably increase and span further regions, so abstraction
     *  was preferred over a simpler enumeration of the possible permutations.
     *
     *  This expansion has not yet occurred, but the code is ready for it...  :)
     */
    protected generateDatacenterMenu( currentLocationId:string, accessible:string[] ) {
        let available = {};
        let currentLogicalRegion = this.insightLocations.hasOwnProperty( currentLocationId )
                                    ? this.insightLocations[currentLocationId].logicalRegion
                                    : 'us-west-1';      //  without a default, people complain...  they complain so much
        accessible.forEach( accessibleLocationId => {
            if ( ! this.insightLocations.hasOwnProperty( accessibleLocationId ) ) {
                return;
            }
            const locationInfo = this.insightLocations[accessibleLocationId];
            let targetLocationId = accessibleLocationId;
            let logicalRegion = locationInfo.logicalRegion;
            if ( locationInfo.alternatives ) {
                locationInfo.alternatives.find( alternativeLocationId => {
                    if ( accessible.includes( alternativeLocationId ) ) {
                        targetLocationId = alternativeLocationId;
                        logicalRegion = this.insightLocations[alternativeLocationId].logicalRegion;
                        return true;
                    }
                    return false;
                } );
            }
            if ( ! available.hasOwnProperty( locationInfo.residencyCaption ) ) {
                available[locationInfo.residencyCaption] = {};
            }
            if ( ! available[locationInfo.residencyCaption].hasOwnProperty( logicalRegion ) ) {
                available[locationInfo.residencyCaption][logicalRegion] = targetLocationId;
            }
        } );

        this.locationsAvailable = 0;
        this.regionSelectorItems = [];
        Object.keys( available ).forEach( region => {
            let regionMenu = {
                label: region,
                items: []
            };
            Object.keys( available[region] ).forEach( logicalRegion => {
                const targetLocationId = available[region][logicalRegion];
                const activated = ( logicalRegion === currentLogicalRegion ) ? true : false;
                if ( activated ) {
                    this.currentLocationResidency = this.insightLocations[targetLocationId].residency;
                    this.currentLocationName = this.insightLocations[targetLocationId].logicalRegion;
                }
                this.locationsAvailable++;
                regionMenu.items.push( {
                    label: logicalRegion,
                    styleClass: activated ? "active" : "",
                    command: ( event ) => this.onClickDatacenter( targetLocationId, event )
                } );
            } );
            this.regionSelectorItems.push( regionMenu );
        } );
    }
}
