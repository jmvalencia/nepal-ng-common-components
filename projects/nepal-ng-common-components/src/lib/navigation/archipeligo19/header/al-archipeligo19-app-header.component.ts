import { Component, Input, OnInit, ViewChildren, QueryList, ElementRef, NgZone } from '@angular/core';
import {
  ALSession,
  AlSessionStartedEvent,
  AlActingAccountChangedEvent,
  AlActingAccountResolvedEvent,
  AlSessionEndedEvent
} from '@al/session';
import { MenuItem, SelectItem } from 'primeng/api';
import { AIMSAccount } from '@al/client';
import { AlNavigationService } from '../../services/al-navigation.service';

@Component({
  selector: 'al-archipeligo19-app-header',
  templateUrl: './al-archipeligo19-app-header.component.html',
  styleUrls: ['./al-archipeligo19-app-header.component.scss']
})
export class AlArchipeligo19AppHeaderComponent implements OnInit
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

  @ViewChildren('filterInput') filterInput: QueryList<ElementRef>;

  constructor( public alNavigation:AlNavigationService,
               public ngZone:NgZone ) {
  }

  ngOnInit() {
    ALSession.notifyStream.attach('AlSessionStarted', this.onSessionStart);
    ALSession.notifyStream.attach('AlActingAccountResolved', this.onActingAccountResolved);
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
    }
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

  initializeAccountSelector( accounts:AIMSAccount[] ) {
    this.managedAccounts = accounts.sort( ( a, b ) => {
      return a.name.toUpperCase().localeCompare( b.name.toUpperCase() );
    });
    this.managedAccountsBuffer = this.managedAccounts.slice(0, this.bufferSize);
  }

  logout = () => {
    ALSession.deactivateSession();
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

  private fetchMore() {
    const len = this.managedAccountsBuffer.length;
    const more = this.managedAccounts.slice(len, this.bufferSize + len);
    this.managedAccountsBuffer = this.managedAccountsBuffer.concat(more);
  }
}
