import { Component, OnInit, NgZone } from '@angular/core';
import { AlNavigationService } from 'nepal-ng-common-components';
import { ALSession } from '@al/session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayNav = false;
  selectedExperience = "beta";
  menuClick: boolean;
  menuButtonClick: boolean;
  topbarMenuButtonClick: boolean;
  topbarMenuClick: boolean;
  topbarMenuActive: boolean;
  activeTopbarItem: Element;
  layoutMode = 'overlay';
  sidebarActive: boolean;
  mobileMenuActive: boolean;
  darkMenu: boolean;
  isRTL: boolean;
  rippleInitListener: any;
  rippleMouseDownListener: any;
  menuHoverActive: boolean;
  resetMenu: boolean;

  constructor( public alNavigation:AlNavigationService, public zone:NgZone ) {
    let w = <any>window;
    w.app = {
      authenticate: ( usernameOrToken:string, password?:string, mfa?:string ) => {
        let promise;
        if ( password ) {
          promise = ALSession.authenticate( usernameOrToken, password, mfa );
        } else {
          promise = ALSession.authenticateWithAccessToken( usernameOrToken );
        }
        promise.then( result => {
                        console.log("OK." );
                      }, error => {
                        console.warn("Failed to authenticate, sorry!", error );
                      } );
      },
      deauthenticate: () => {
        ALSession.deactivateSession();
      },
      setExperience: ( value:string ) => {
        this.zone.run( () => this.selectedExperience = value );
      }
    };
  }

  ngOnInit() {
  }

  toggleNav = () => {
    this.displayNav = !this.displayNav;
  }

  onWrapperClick() {
    if (!this.menuClick && !this.menuButtonClick) {
        this.mobileMenuActive = false;
    }

    if (!this.topbarMenuClick && !this.topbarMenuButtonClick) {
        this.topbarMenuActive = false;
        this.activeTopbarItem = null;
    }

    if (!this.menuClick) {
        if (this.isHorizontal() || this.isOverlay()) {
            this.resetMenu = true;
        }

        this.menuHoverActive = false;
    }


    this.menuClick = false;
    this.menuButtonClick = false;
    this.topbarMenuClick = false;
    this.topbarMenuButtonClick = false;
  }

  onSidebarClick(event: Event) {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onToggleMenuClick(event: Event) {
      this.layoutMode = this.layoutMode !== 'static' ? 'static' : 'overlay';
      event.preventDefault();
  }

  isMobile() {
      return window.innerWidth <= 1024;
  }

  isTablet() {
      const width = window.innerWidth;
      return width <= 1024 && width > 640;
  }

  isHorizontal() {
      return this.layoutMode === 'horizontal';
  }

  isOverlay() {
      return this.layoutMode === 'overlay';
  }
}
