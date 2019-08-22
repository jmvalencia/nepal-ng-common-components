import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef, Renderer, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem, ScrollPanel } from 'primeng/primeng';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, AfterViewInit {

  @Input() reset: boolean;

  model: any[];

  @ViewChild('scrollPanel') layoutMenuScrollerViewChild: ScrollPanel;

  constructor(public app: AppComponent) { }

  ngAfterViewInit() {
    setTimeout(() => { this.layoutMenuScrollerViewChild.moveBar(); }, 100);
  }

  ngOnInit() {
    this.model = [
      {
        label: 'Home', icon: 'home', routerLink: ['']
      },
      {
        label: 'Theming',
        items: [
          { label: 'Typography', icon: 'format-size', routerLink: ['/typography'] },
          { label: 'Colour Palettes', icon: 'palette', routerLink: ['/colour-palettes'] }
        ]
      },
      {
        label: 'Base Components',
        items: [
          { label: 'Forms', icon: 'create', routerLink: ['/form-examples'] },
          { label: 'Data', icon: 'sync', routerLink: ['/data-examples'] },
          { label: 'Panels', icon: 'content-copy', routerLink: ['/panel-examples'] },
          { label: 'Overlays', icon: 'flip-to-front', routerLink: ['/overlay-examples'] },
          { label: 'Menus', icon: 'menu', routerLink: ['/menu-examples'] },
          { label: 'Messages', icon: 'message', routerLink: ['/message-examples'] },
          { label: 'Utilities', icon: 'build', routerLink: ['/utilities'] }
        ]
      },
      {
        label: 'Visualisations',
        items: [
          { label: 'Highcharts', icon: 'insert-chart', routerLink: ['/highcharts'] },
          { label: 'Table Charts', icon: 'grid-on', routerLink: ['/table-charts'] },
        ]
      },
      {
        label: 'Examples',
        items: [
          { label: 'Dashboard Examples', icon: 'dashboard', routerLink: ['/dashboard-examples'] },
        ]
      }];
  }
}

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-submenu]',
  /* tslint:enable:component-selector */
  template: `
  <style>
      a i.submenu-toggler {
        transition: all 0.3s;
        right: unset;
      }
      li.active-menuitem > a i.submenu-toggler {
        transform: rotate(-180deg);
      }
    </style>
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" *ngIf="!child.routerLink"
                   [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                   (mouseenter)="onMouseEnter(i)" class="ripplelink">

                    <span class="menuitem-text">{{child.label}}</span>
                    <i class="material-icons submenu-toggler" *ngIf="child.items">keyboard_arrow_down</i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>

                <a (click)="itemClick($event,child,i)" *ngIf="child.routerLink"
                   [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                   [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                   (mouseenter)="onMouseEnter(i)" class="ripplelink">
                    <i class="fa ui-icon-{{child.icon}}"></i>
                    <span class="menuitem-text">{{child.label}}</span>
                    <i class="material-icons layout-submenu-toggler" *ngIf="child.items">>keyboard_arrow_down</i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>
                <ul app-submenu [item]="child" *ngIf="child.items && isActive(i)" [visible]="isActive(i)" [reset]="reset"
                    [parentActive]="isActive(i)" [@children]="(app.isHorizontal())&&root ? isActive(i) ?
                    'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
  animations: [
    trigger('children', [
      state('void', style({
        height: '0px'
      })),
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        height: '*',
        'z-index': 100
      })),
      state('hidden', style({
        height: '0px',
        'z-index': '*'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppSubMenuComponent {

  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  resetMenu: boolean;

  parentItemActive: boolean;

  activeIndex: number;

  constructor(public app: AppComponent, public router: Router, public location: Location, public appMenu: AppMenuComponent) { }

  itemClick(event: Event, item: MenuItem, index: number) {
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
      event.preventDefault();
    }

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    if (item.routerLink || item.items || item.command || item.url) {
      this.activeIndex = (this.activeIndex as number === index) ? -1 : index;
    }

    // execute command
    if (item.command) {
      item.command({ item, originalEvent: event });
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        this.appMenu.layoutMenuScrollerViewChild.moveBar();
      }, 450);
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      if (this.app.isMobile()) {
        this.app.sidebarActive = false;
        this.app.mobileMenuActive = false;
      }

      if (this.app.isHorizontal()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }

      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
  }

  onMouseEnter(index: number) {
    if (this.root && this.app.menuHoverActive && this.app.isHorizontal()
      && !this.app.isMobile() && !this.app.isTablet()) {
      this.activeIndex = index;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input() get reset(): boolean {
    return this.resetMenu;
  }

  set reset(val: boolean) {
    this.resetMenu = val;

    if (this.resetMenu && (this.app.isHorizontal() || this.app.isOverlay())) {
      this.activeIndex = null;
    }
  }

  @Input() get parentActive(): boolean {
    return this.parentItemActive;
  }

  set parentActive(val: boolean) {
    this.parentItemActive = val;

    if (!this.parentItemActive) {
      this.activeIndex = null;
    }
  }
}
