import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';

import { ALAppHeaderComponent } from './al-app-header.component';
import { FormsModule } from '@angular/forms';
import { AlSessionStartedEvent, AlSessionInstance, AlActingAccountResolvedEvent } from '@al/session';
import { AlEntitlementCollection } from '@al/subscriptions';
import { AIMSAccount } from '@al/client';
import { MenuItem } from 'primeng/api';

describe('ALAppHeaderComponent Test Suite', () => {
  let component: ALAppHeaderComponent;
  let fixture: ComponentFixture<ALAppHeaderComponent>;

  const alSessionLib = 'alSession';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ALAppHeaderComponent],
      imports: [
        MenubarModule, TooltipModule,
        NgSelectModule, FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ALAppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('When a session has started', () => {
    it('should set authenticated to true', () => {
      const sessionStartedEvent: AlSessionStartedEvent = {
        user: {
          name: 'Peter Pan',
          email: 'peter@pan.com',
          created: {
            at: 1,
            by: 'blaa'
          },
          modified: {
            at: 1,
            by: 'blaa'
          }
        },
        primaryAccount: {
          name: 'Foo',
          id: '1',
          active: true,
          default_location: 'Cardiff',
          accessible_locations: [],
          created: {
            at: 1,
            by: 'blaaa'
          },
          modified: {
            at: 1,
            by: 'blaa'
          }
        },
        session: new AlSessionInstance()

      };
      component.onSessionStart(sessionStartedEvent);
      expect(component.authenticated).toEqual(true);
      expect(component.userMenuItems[0].label).toEqual(sessionStartedEvent.user.name);
    });
  });
  describe('On resolving an acting account that manages one other account', () => {
    const primaryAccount = {
      id: '2',
      name: 'AL',
      active: true,
      accessible_locations: [],
      default_location: 'Cardiff',
      created: {
        at: 1,
        by: 'blaaa'
      },
      modified: {
        at: 1,
        by: 'blaa'
      }

    };
    const event: AlActingAccountResolvedEvent = {
      actingAccount: primaryAccount,
      managedAccounts: [{
        id: '132002',
        name: 'SRE Child Account 1',
        active: true,
        accessible_locations: [],
        default_location: 'Cardiff',
        created: {
          at: 1,
          by: 'blaaa'
        },
        modified: {
          at: 1,
          by: 'blaa'
        }}
      ],
      entitlements: new AlEntitlementCollection()
    };
    beforeEach(() => {
      spyOn(component[alSessionLib], 'getPrimaryAccount').and.returnValue(primaryAccount);
      component.onActingAccountResolved(event);
    });
    it('shoud initialise the acting account component properties', () => {
      expect(component.actingAccount).toEqual(event.actingAccount);
      expect(component.actingAccountId).toEqual(event.actingAccount.id);
    });
    it('shoud initialise the managedAccounts component properties', () => {
      expect(component.actingAccount).toEqual(event.actingAccount);
      expect(component.actingAccountId).toEqual(event.actingAccount.id);
    });
  });
  describe('When calling logout', () => {
    it('should call deactivateSession on the ALSession instance', () => {
      spyOn(component[alSessionLib], 'deactivateSession').and.callFake(() => {});
      component.logout();
      expect(component[alSessionLib].deactivateSession).toHaveBeenCalled();
    });
  });
  describe('When the selected account has changed', () => {
    describe('and the account value is valid', () => {
      it('should call setActingAccount() on the ALSession instance', () => {
        const account: AIMSAccount = {
          id: '2',
          name: 'AL',
          active: true,
          accessible_locations: [],
          default_location: 'Cardiff',
          created: {
            at: 1,
            by: 'blaaa'
          },
          modified: {
            at: 1,
            by: 'blaa'
          }
        };
        spyOn(component[alSessionLib], 'setActingAccount').and.callFake(() => {});
        component.onAccountChanged(account);
        expect(component[alSessionLib].setActingAccount).toHaveBeenCalledWith(account);
      });
    });
  });
  describe('When checking if an account matches a search term', () => {
    const account: AIMSAccount = {
      id: '2',
      name: 'Alert Logic, Inc',
      active: true,
      accessible_locations: [],
      default_location: 'Cardiff',
      created: {
        at: 1,
        by: 'blaaa'
      },
      modified: {
        at: 1,
        by: 'blaa'
      }
    };
    describe('and the account name contains the term', () => {
      it('should return a truthy match', () => {
        const searchTerm = 'Alert';
        expect(component.accountSearchFn(searchTerm, account)).toEqual(true);
      });
    });
    describe('and the account id starts with the term', () => {
      it('should return a truthy match', () => {
        const searchTerm = '2';
        expect(component.accountSearchFn(searchTerm, account)).toEqual(true);
      });
    });
    describe('and the account name does not contain the term', () => {
      it('should return a falsy match', () => {
        const searchTerm = 'SRE';
        expect(component.accountSearchFn(searchTerm, account)).toEqual(false);
      });
    });
  });
  describe('When scrolling to the end of the visible list of accounts', () => {
    it('should add further items to the managedAccountsBuffer list if possible', () => {
      component.bufferSize = 1;
      component.managedAccounts = [{
        id: '2',
        name: 'Alert Logic, Inc',
        active: true,
        accessible_locations: [],
        default_location: 'Cardiff',
        created: {
          at: 1,
          by: 'blaaa'
        },
        modified: {
          at: 1,
          by: 'blaa'
        }
      }, {
        id: '2',
        name: 'Alert Logic, Inc',
        active: true,
        accessible_locations: [],
        default_location: 'Cardiff',
        created: {
          at: 1,
          by: 'blaaa'
        },
        modified: {
          at: 1,
          by: 'blaa'
        }
      }];
      component.managedAccountsBuffer = [{}];
      component.onScrollToEnd();
      expect(component.managedAccountsBuffer.length).toEqual(2);
    });
  });
  describe('On scrolling the account selector', () => {
    describe('and the managedAccountsBuffer is already the same size as the original managedAccounts list', () => {
      it('should not add any more items to the managedAccountsBuffer', () => {
        component.managedAccountsBuffer = [];
        component.managedAccounts = [];
        component.onScroll({end: 1});
        expect(component.managedAccountsBuffer.length).toEqual(0);
      });
    });
    describe('and the managedAccountsBuffer contains less items than the original managedAccounts list', () => {
      it('should add further items to the managedAccountsBuffer', () => {
        component.managedAccountsBuffer = [];
        component.managedAccounts = [{
          id: '2',
          name: 'Alert Logic, Inc',
          active: true,
          accessible_locations: [],
          default_location: 'Cardiff',
          created: {
            at: 1,
            by: 'blaaa'
          },
          modified: {
            at: 1,
            by: 'blaa'
          }
        }];
        component.onScroll({end: 1});
        expect(component.managedAccountsBuffer.length).toEqual(1);
      });
    });
  });
  describe('On invoking the command associated to the Logout user menu item', () => {
    it('should call the component logout function', () => {
      spyOn(component, 'logout').and.callFake(() => {});
      const logoutItem = component.userMenuItems[0].items[0] as MenuItem;
      logoutItem.command();
      expect(component.logout).toHaveBeenCalled();
    });
  });
});
