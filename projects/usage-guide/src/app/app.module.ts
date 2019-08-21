import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import {HomeComponent} from './components/home/home.component';

import {
    NepalNgCommonComponentsModule,
    NepalNgNavigationModule
} from 'nepal-ng-common-components';
import { TypographyComponent } from './components/typography/typography.component';
import { ColourPalettesComponent } from './components/colour-palettes/colour-palettes.component';
import { DashboardExamplesComponent } from './components/dashboard-examples/dashboard-examples.component';
import { HighChartsComponent } from './components/highcharts/highcharts.component';
import { TableChartsComponent } from './components/table-charts/table-charts.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as tree from 'highcharts/modules/treemap.src';
import { FormExamplesComponent } from './components/primeng-components/form-examples/form-examples.component';

import {CarService} from './service/carservice';
import {CountryService} from './service/countryservice';
import {EventService} from './service/eventservice';
import {NodeService} from './service/nodeservice';

import {BreadcrumbService} from './breadcrumb.service';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { DataExamplesComponent } from './components/primeng-components/data-examples/data-examples.component';
import { PanelExamplesComponent } from './components/primeng-components/panel-examples/panel-examples.component';
import { OverlayExamplesComponent } from './components/primeng-components/overlay-examples/overlay-examples.component';
import { MenuExamplesComponent } from './components/primeng-components/menu-examples/menu-examples.component';
import { MessageExamplesComponent } from './components/primeng-components/message-examples/message-examples.component';
import { UtilitiesComponent } from './components/primeng-components/utilities/utilities.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';

import {CodeHighlighterModule} from 'primeng/codehighlighter';
import { CodeHighlighterDirective } from './pcode.directive';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'form-examples',
    component: FormExamplesComponent
  },
  {
    path: 'data-examples',
    component: DataExamplesComponent
  },
  {
    path: 'overlay-examples',
    component: OverlayExamplesComponent
  },
  {
    path: 'panel-examples',
    component: PanelExamplesComponent
  },
  {
    path: 'menu-examples',
    component: MenuExamplesComponent
  },
  {
    path: 'message-examples',
    component: MessageExamplesComponent
  },
  {
    path: 'utilities',
    component: UtilitiesComponent
  },
  {
    path: 'colour-palettes',
    component: ColourPalettesComponent
  },
  {
    path: 'typography',
    component: TypographyComponent
  },
  {
    path: 'highcharts',
    component: HighChartsComponent
  },
  {
    path: 'table-charts',
    component: TableChartsComponent
  },
  {
    path: 'dashboard-examples',
    component: DashboardExamplesComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AppBreadcrumbComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    ColourPalettesComponent,
    HomeComponent,
    DashboardExamplesComponent,
    TableChartsComponent,
    TypographyComponent,
    HighChartsComponent,
    FormExamplesComponent,
    DataExamplesComponent,
    PanelExamplesComponent,
    OverlayExamplesComponent,
    MenuExamplesComponent,
    MessageExamplesComponent,
    UtilitiesComponent,
    CodeHighlighterDirective
  ],
  imports: [
    ChartModule,
    BrowserModule,
    BrowserAnimationsModule,
    NepalNgCommonComponentsModule,
    NepalNgNavigationModule,
    RouterModule.forRoot(appRoutes, { useHash: true } ),
    HttpClientModule,
    CodeHighlighterModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ tree ] },
    CarService, CountryService, EventService, NodeService, BreadcrumbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
