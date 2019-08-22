/*
 * Dashboard Layout Container Component
 *
 * @author Stephen Jones <stephen.jones@alertlogic.com> & Meggy C
 * @copyright Alert Logic, 2019
 *
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Widget, WidgetContentType } from '../types';

@Component({
  selector: 'al-dashboard-layout',
  templateUrl: './al-dashboard-layout.component.html',
  styleUrls: ['./al-dashboard-layout.component.scss']
})

export class AlDashboardLayoutComponent implements OnInit {

  // For use in template
  public contentType: typeof WidgetContentType = WidgetContentType;

  // Inputs
  @Input() config: Widget[];

  // Outputs
  @Output() resizeStart: EventEmitter<any> = new EventEmitter();
  @Output() resizeEnd: EventEmitter<any> = new EventEmitter();

  private isResizing = false;
  private timeoutHnd;

  /*
   *
   */
  ngOnInit() {
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  /*
   *
   */
  private resize = (): void => {
    if (!this.isResizing) {
      this.isResizing = true;
      this.resizeStart.emit();
    } else {
      clearTimeout(this.timeoutHnd);
    }

    this.timeoutHnd = setTimeout(() => {
      this.isResizing = false;
      this.resizeEnd.emit();
    }, 1000);
  }

}

