import { Component, Input, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, NgZone } from '@angular/core';
import {
  ALSession,
  AlSessionStartedEvent,
  AlActingAccountChangedEvent,
  AlActingAccountResolvedEvent,
  AlSessionEndedEvent
} from '@al/session';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { AIMSAccount } from '@al/client';
import { AlSubscriptionGroup } from '@al/common';
import { AlLocatorService, AlInsightLocations, AlLocation } from '@al/common/locator';
import { AlNavigationService } from '../../services/al-navigation.service';
import { AlDatacenterOptionsSummary, AlNavigationContextChanged } from '../../types/navigation.types';

@Component({
  selector: 'al-archipeligo19-app-header',
  templateUrl: './al-archipeligo19-app-header.component.html',
  styleUrls: ['./al-archipeligo19-app-header.component.scss']
})
export class AlArchipeligo19AppHeaderComponent implements OnInit, OnDestroy
{
  authenticated = false;
  actingAccountName = '';
  actingAccountId: string;
  actingAccount: AIMSAccount = null;
  actingAccountNameTest = 'Alert Logic,Inc';

  managedAccounts: AIMSAccount[] = [];

  managedAccountsItems: SelectItem[];

  managedAccountsBuffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;

  userMenuItems: MenuItem[];

  datacenter:AlDatacenterOptionsSummary;

  subscriptions = new AlSubscriptionGroup( null );

  @ViewChildren('filterInput') filterInput: QueryList<ElementRef>;

  constructor( public alNavigation:AlNavigationService,
               public ngZone:NgZone,
               private confirmationService: ConfirmationService ) {
  }

  ngOnInit() {
    this.subscriptions.manage( [
        ALSession.notifyStream.attach('AlSessionStarted', this.onSessionStart),
        ALSession.notifyStream.attach('AlActingAccountResolved', this.onActingAccountResolved),
        this.alNavigation.events.attach('AlNavigationContextChanged', this.onNavigationContextChanged)
      ] );
    this.authenticated = ALSession.isActive();
    this.actingAccount = ALSession.getActingAccount();
    if ( this.actingAccount ) {
        this.actingAccountId = this.actingAccount.id;
    }
    this.userMenuItems = [
      {
        label: ALSession.getUserName(),
        items: [
          {
            label: 'Logout',
            icon: 'ui-icon-power-settings-new',
            command: () => {
              this.logout();
            }
          }
        ]
      }
    ];
    if ( this.authenticated ) {
      ALSession.getManagedAccounts().then( managedAccounts => {
        this.initializeAccountSelector( [ ...managedAccounts, ALSession.getPrimaryAccount() ] );
      } );
      this.onNavigationContextChanged( new AlNavigationContextChanged( this.alNavigation, ALSession ) );
    }
  }

  ngOnDestroy() {
    this.subscriptions.cancelAll();
  }

  onSessionStart = (event: AlSessionStartedEvent) => {
    this.ngZone.run(() => {
      this.authenticated = true;
      this.userMenuItems[0].label = event.user.name;
    });
  }

  onActingAccountResolved = (event: AlActingAccountResolvedEvent) => {
    this.ngZone.run(() => {
      this.actingAccount = event.actingAccount;
      this.actingAccountId = event.actingAccount.id;
      this.initializeAccountSelector( [ ...event.managedAccounts, ALSession.getPrimaryAccount() ] );
    });
  }

  onNavigationContextChanged = ( event:AlNavigationContextChanged ) => {
    if ( ALSession.isActive() ) {
      this.datacenter = this.alNavigation.generateDatacenterMenu( ALSession.getActiveDatacenter(),
                                                                  ALSession.getActingAccountAccessibleLocations(),
                                                                  this.onClickDatacenter );
    } else {
      this.datacenter = undefined;
    }
  }

  initializeAccountSelector( accounts:AIMSAccount[] ) {
    this.managedAccounts = accounts.sort( ( a, b ) => {
      return a.name.toUpperCase().localeCompare( b.name.toUpperCase() );
    });
    this.managedAccountsBuffer = this.managedAccounts.slice(0, this.bufferSize);
  }

  logout = () => {
    ALSession.deactivateSession();
    this.alNavigation.navigate.byLocation( AlLocation.AccountsUI, '/#/logout' );
  }

  onAccountChanged() {
    this.alNavigation.setActingAccount(this.actingAccountId);
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.managedAccounts.length === this.managedAccountsBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.managedAccountsBuffer.length) {
      this.fetchMore();
    }
  }

  accountSearchFn(term: string, account: AIMSAccount) {
    term = term.toLocaleLowerCase();
    return account.name.toLocaleLowerCase().indexOf(term) > -1 || account.id.startsWith(term);
  }

  onOpen() {
    this.filterInput.changes.subscribe(res => {
      if (this.filterInput.first) {
        this.filterInput.first.nativeElement.focus();
      }
    });
  }

  onClickDatacenter = ( insightLocationId:string, $event:any ) => {
    const actor = AlLocatorService.getActingNode();
    if ( actor === null || ! AlInsightLocations.hasOwnProperty( insightLocationId ) ) {
      //  No meateggs, no bacon?  No breakfast for you :(
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


  private fetchMore() {
    const len = this.managedAccountsBuffer.length;
    const more = this.managedAccounts.slice(len, this.bufferSize + len);
    this.managedAccountsBuffer = this.managedAccountsBuffer.concat(more);
  }
}
