import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {PrimeNgModule} from './primeng.module';
import { NgSelectModule } from '@ng-select/ng-select';

import * as components from './components';

@NgModule({
  declarations: [
    components.ALL_COMPONENTS
  ],
  imports: [
    BrowserAnimationsModule,
    PrimeNgModule,
    NgSelectModule
  ],
  exports: [
    ...components.ALL_COMPONENTS,
    PrimeNgModule,
    NgSelectModule
  ]
})
export class NepalNgCommonComponentsModule { }
