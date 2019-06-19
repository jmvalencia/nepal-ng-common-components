/*
 * Dashboard Layout Container Component
 *
 * @author Stephen Jones <stephen.jones@alertlogic.com> & Meggy C
 * @copyright Alert Logic, 2019
 *
 */
import { Component, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, HostListener } from '@angular/core';
import { Widget, WidgetContentType } from '../types';

@Component({
  selector: 'al-dashboard-layout',
  templateUrl: './al-dashboard-layout.component.html',
  styleUrls: ['./al-dashboard-layout.component.scss']
})

export class AlDashboardLayoutComponent {

  // For use in template
  public contentType: typeof WidgetContentType = WidgetContentType;

  // Inputs
  @Input() config: Widget[];

}

