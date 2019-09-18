import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimeNgModule } from './primeng/primeng.module';
import { AlHighChartsUtilityService } from './al-highcharts-utility-service';
import * as components from './components';
import { AlToastService } from './al-toast/al-toast.service';

@NgModule({
  declarations: [
    components.ALL_COMPONENTS,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    PrimeNgModule
  ],
  exports: [
    ...components.ALL_COMPONENTS,
    NgSelectModule,
    PrimeNgModule
  ],
  providers: [
    AlToastService
  ]
})
export class NepalNgCommonComponentsModule { }
