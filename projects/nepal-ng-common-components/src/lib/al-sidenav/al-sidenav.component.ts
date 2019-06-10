import { Component, OnInit, Input } from '@angular/core';
// import { ALSession } from '@al/session';

@Component({
  selector: 'al-sidenav',
  templateUrl: './al-sidenav.component.html',
  styleUrls: ['./al-sidenav.component.scss']
})
export class ALSideNavComponent implements OnInit {

  @Input()
  displayNav = false; // See al-nav-header toggle button click handling, this should be based on value from a service (observable)

  // TODO - Items below need to be coming from Nepal lib responsible for building navigation hierarchy based on account entitlements
  menuItems: any[] = [{
    name: 'Dashboards',
    icon: 'dashboard',
    expanded: true
  }, {
    name: 'Respond',
    icon: 'security',
    expanded: false,
    children: [{
      name: 'Incidents'
    }, {
      name: 'Exposures'
    }, {
      name: 'Health'
    }, {
      name: 'PCI Disputes'
    }]
  }, {
    name: 'Investigate',
    icon: 'search',
    expanded: false,
    children: [{
      name: 'Incidents'
    }, {
      name: 'Observations'
    }, {
      name: 'Assets'
    }, {
      name: 'Content Coverage'
    }]
  }, {
    name: 'Validate',
    icon: 'check_circle',
    expanded: false,
    children: [{
      name: 'Reports'
    }, {
      name: 'Activity'
    }]
  }, {
    name: 'Configure',
    icon: 'settings',
    expanded: false,
    children: [{
      name: 'Deployments'
    }, {
      name: 'Endpoints'
    }, {
      name: 'PCI Scanning'
    }, {
      name: 'Automation'
    }]
  }, {
    name: 'Manage',
    icon: 'supervised_user_circle',
    expanded: false,
    children: [{
      name: 'Users'
    }, {
      name: 'Accounts'
    }, {
      name: 'Notifications'
    }, {
      name: 'Integrations'
    }]
  }];

  constructor() { }

  ngOnInit() {

  }

  toggleNav = () => {
    this.displayNav = !this.displayNav;
  }

  toggleItemExpanded = (menuItem) => {
    menuItem.expanded = !menuItem.expanded;
  }

  logout = () => {
    // ALSession.deactivateSession();
  }

}
