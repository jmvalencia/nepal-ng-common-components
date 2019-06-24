import { Component, OnInit, NgZone, ViewChildren, QueryList, ElementRef } from '@angular/core';
import {
  ALSession,
  AlSessionStartedEvent,
  AlActingAccountChangedEvent,
  AlActingAccountResolvedEvent,
  AlSessionEndedEvent
} from '@al/session';
import { MenuItem, SelectItem } from 'primeng/api';
import { AIMSAccount } from '@al/client';

@Component({
  selector: 'al-app-header',
  templateUrl: './al-app-header.component.html',
  styleUrls: ['./al-app-header.component.scss']
})
export class ALAppHeaderComponent implements OnInit {

  private alSession = ALSession;

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

  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.alSession.notifyStream.attach('AlSessionStarted', this.onSessionStart);
    this.alSession.notifyStream.attach('AlActingAccountResolved', this.onActingAccountResolved);
    this.authenticated = this.alSession.isActive();
    this.actingAccount = this.alSession.getActingAccount();
    this.userMenuItems = [
      {
        label: this.alSession.getUserName(),
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
  }

  onSessionStart = (event: AlSessionStartedEvent) => {
    this.zone.run(() => {
      this.authenticated = true;
      this.userMenuItems[0].label = event.user.name;
    });
  }

  onActingAccountResolved = (event: AlActingAccountResolvedEvent) => {
    this.zone.run(() => {
      this.actingAccount = event.actingAccount;
      this.actingAccountId = event.actingAccount.id;
      const userPrimaryAccount = this.alSession.getPrimaryAccount();
      this.managedAccounts = [...event.managedAccounts, userPrimaryAccount];
      this.managedAccounts.sort((a, b) => {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        return textA.localeCompare(textB);
      });
      this.managedAccountsBuffer = this.managedAccounts.slice(0, this.bufferSize);
    });
  }

  logout = () => {
    this.alSession.deactivateSession();
  }

  onAccountChanged(account: AIMSAccount) {
    if (account && account.hasOwnProperty('id') && account.hasOwnProperty('name')) {
      this.alSession.setActingAccount(account);
    } else {
      console.log(`account change event trigged for malformed account data? - ${JSON.stringify(account)}`);
    }
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
        this.filterInput.first.nativeElement.focus();
    });
  }

  private fetchMore() {
    const len = this.managedAccountsBuffer.length;
    const more = this.managedAccounts.slice(len, this.bufferSize + len);
    this.managedAccountsBuffer = this.managedAccountsBuffer.concat(more);
  }
}
