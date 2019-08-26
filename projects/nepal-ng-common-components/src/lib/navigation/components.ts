/**
 * Archipeligo 17/"CIE-Plus" Navigation Components
 */
import { AlArchipeligo17PrimaryMenuComponent } from './archipeligo17/primary-menu/al-archipeligo17-primary-menu.component';
import { AlArchipeligo17UserMenuComponent } from './archipeligo17/user-menu/al-archipeligo17-user-menu.component';
import { AlArchipeligo17AccountSelectorComponent } from './archipeligo17/account-selector/al-archipeligo17-account-selector.component';
import { AlArchipeligo17HeaderComponent } from './archipeligo17/header/al-archipeligo17-header.component';
import { AlArchipeligo17TertiaryMenuComponent } from './archipeligo17/al-tertiary-menu/al-archipeligo17-tertiary-menu.component';

/**
 * Archipeligo 19/"SIEMless" Navigation Components
 */
import { AlArchipeligo19AppHeaderComponent } from './archipeligo19/header/al-archipeligo19-app-header.component';
import { AlArchipeligo19NavHeaderComponent } from './archipeligo19/nav-header/al-archipeligo19-nav-header.component';
import { AlArchipeligo19SidenavComponent } from './archipeligo19/sidenav/al-archipeligo19-sidenav.component';

import { AlProtectedContentComponent } from './al-protected-content/al-protected-content.component';
import { AlNavigationFrameComponent } from './al-navigation-frame/al-navigation-frame.component';
import { AlNavigationOverlaysComponent } from './al-navigation-overlays/al-navigation-overlays.component';

const NAVIGATION_COMPONENTS = [
    AlArchipeligo17PrimaryMenuComponent,
    AlArchipeligo17UserMenuComponent,
    AlArchipeligo17AccountSelectorComponent,
    AlArchipeligo17HeaderComponent,

    AlArchipeligo19AppHeaderComponent,
    AlArchipeligo19NavHeaderComponent,
    AlArchipeligo19SidenavComponent,

    AlProtectedContentComponent,
    AlNavigationFrameComponent,
    AlNavigationOverlaysComponent,
    AlArchipeligo17TertiaryMenuComponent
];

export {
    NAVIGATION_COMPONENTS,
    AlArchipeligo17PrimaryMenuComponent,
    AlArchipeligo17UserMenuComponent,
    AlArchipeligo17AccountSelectorComponent,
    AlArchipeligo17HeaderComponent,
    AlArchipeligo19AppHeaderComponent,
    AlArchipeligo19NavHeaderComponent,
    AlArchipeligo19SidenavComponent,
    AlProtectedContentComponent,
    AlNavigationFrameComponent,
    AlNavigationOverlaysComponent,
    AlArchipeligo17TertiaryMenuComponent
};