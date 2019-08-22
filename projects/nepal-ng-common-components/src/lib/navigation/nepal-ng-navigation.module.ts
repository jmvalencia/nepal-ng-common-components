import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../primeng/primeng.module';
import { MessageService } from 'primeng/api';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';

import { NepalNgCommonComponentsModule } from '../nepal-ng-common-components.module';

import * as components from './components';
import { AlNavigationService } from './services/al-navigation.service';
import { AlExperiencePreferencesService } from './services/al-experience-preferences.service';
import { AlManageExperienceService } from './services/al-manage-experience.service';

@NgModule({
    declarations: [
        components.NAVIGATION_COMPONENTS
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        NgSelectModule,
        NepalNgCommonComponentsModule,
        HttpClientModule
    ],
    exports: [
        ...components.NAVIGATION_COMPONENTS
    ],
    providers: [
        MessageService
    ]
})
export class NepalNgNavigationModule {
}
