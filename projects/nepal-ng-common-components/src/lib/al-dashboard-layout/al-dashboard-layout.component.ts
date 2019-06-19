/*
 * Dashboard Layout Container Component
 *
 * @author Stephen Jones <stephen.jones@alertlogic.com> & Meggy C
 * @copyright Alert Logic, 2019
 *
 */
import { Component, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, HostListener } from '@angular/core';
import { Widget, WidgetContentType } from '../types';
import { AlHighchartColumnComponent } from '../al-highchart-column/al-highchart-column.component';
import { AlHighchartSemiCircleComponent } from '../al-highchart-semi-circle/al-highchart-semi-circle.component';
import { AlHighchartsActivityGaugeComponent } from '../al-highchart-activity-gauge/al-highchart-activity-gauge.component';
import { AlHighchartTreeMapComponent } from '../al-highchart-treemap/al-highchart-treemap.component';
import { AlCountSummaryComponent } from '../al-count-summary/al-count-summary.component';
import { AlDetailedTableListComponent } from '../al-detailed-table-list/al-detailed-table-list.component';

@Component({
  selector: 'al-dashboard-layout',
  templateUrl: './al-dashboard-layout.component.html',
  styleUrls: ['./al-dashboard-layout.component.scss']
})

export class AlDashboardLayoutComponent {

  // For use in template
  public contentType: typeof WidgetContentType = WidgetContentType;
  public themeToggle = false;

  // Inputs
  @Input() config: Widget[];

  @ViewChildren(AlHighchartColumnComponent) columnChart: QueryList<AlHighchartColumnComponent>;
  @ViewChildren(AlHighchartSemiCircleComponent) semiCircle: QueryList<AlHighchartSemiCircleComponent>;
  @ViewChildren(AlHighchartsActivityGaugeComponent) activityGague: QueryList<AlHighchartsActivityGaugeComponent>;
  @ViewChildren(AlHighchartTreeMapComponent) treeMap: QueryList<AlHighchartTreeMapComponent>;
  @ViewChildren(AlCountSummaryComponent) countSummary: QueryList<AlCountSummaryComponent>;
  @ViewChildren(AlDetailedTableListComponent) tableList: QueryList<AlDetailedTableListComponent>;

  @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 't' && event.ctrlKey === true) {
      this.toggleTheme();
    }
  }

  // TODO - remove this test code
  private toggleTheme(): void {
    this.themeToggle = !this.themeToggle;
  }
}

