// Make sure an equivalent 'primeng/xxx' umdModuleIds entry is added to ng-package.json for any primeng imports below
// This is to ensure an appropriate identifier is used for the module Ids when bundling into UMD format by ng-packagr during builds

import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CardModule,
    CarouselModule,
    ChipsModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    MenubarModule,
    MultiSelectModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    SidebarModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule
  ],
  exports: [
    ButtonModule,
    CardModule,
    CarouselModule,
    ChipsModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    MenubarModule,
    MultiSelectModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    SidebarModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule
  ],
  providers: [
    MessageService
  ]
})
export class PrimeNgModule {
}
