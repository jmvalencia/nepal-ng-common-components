/*
 * Dashboard Widget Container Component
 *
 * @author Stephen Jones <stephen.jones@alertlogic.com>
 * @copyright Alert Logic, 2019
 *
 */
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Widget, WidgetClickType, WidgetButtonAction, WidgetContentType } from '../types';

export interface EmitValues {
  id: string;
  clickType: WidgetClickType;
}

@Component({
  selector: 'al-dashboard-widget',
  templateUrl: './al-dashboard-widget.component.html',
  styleUrls: ['./al-dashboard-widget.component.scss']
})

export class AlDashboardWidgetComponent implements OnInit {

  public hasActions = false;
  public contentType: typeof WidgetContentType = WidgetContentType;

  // Default Config
  @Input() config: Widget = {
    title: '',
    id: '',
    metrics: {
      height: 1,
      width: 1
    }
  };

  constructor(private el: ElementRef) {}

  /*
   *  When setting up test the config object for any actionLabels.  These render strings to the
   *  appropriate buttons or links.  If none are passed then the bottom bar should not be rendered.
   */
  ngOnInit() {
    this.hasActions = this.config.hasOwnProperty('actions')
        && Object.keys(this.config.actions).length > 0;
  }

  /*
   * Event Handlers
   */

  /*
   * Primary Button Clicked
   */
  public primaryClicked(): void {
    this.emitClick(this.config.actions.primary.action, WidgetClickType.Primary);
  }

  /**
   * Data element clicked
   */
  public dataElementClicked(ev: CustomEventInit<{recordLink: string}>): void {
    if(this.config.actions.drilldown) {
      this.emitClick(this.config.actions.drilldown.action, WidgetClickType.DrillDown, ev.detail.recordLink);
    } else {
      console.warn('No drill down action configured for this widget');
    }
  }

  /*
   * Settings Button Clicked
   */
  public settingsClicked(): void {
    // this.emitClick(this.config.actions.settings);
  }

  /*
   * Link1 Button Clicked
   */
  public link1Clicked(): void {
    this.emitClick(this.config.actions.link1.action, WidgetClickType.Link1);
  }

  /*
   * Link2 Button Clicked
   */
  public link2Clicked(): void {
    this.emitClick(this.config.actions.link2.action, WidgetClickType.Link2);
  }

  /*
   *  Event emitters don't bubble.  Use a dom dispatchEvent mechanism to dispatch
   *  the event as far up as required
   */
  private emitClick(buttonAction: WidgetButtonAction, widgetButton: WidgetClickType, recordLink?: string): void {
    if (buttonAction !== undefined) {
      if (!recordLink) {
        this.el.nativeElement
          .dispatchEvent(new CustomEvent('button-clicked', {
            detail: {
              buttonAction,
              widgetButton,
              id: this.config.id,
              title: this.config.title
            },
            bubbles: true
          }));
      } else {
        this.el.nativeElement
          .dispatchEvent(new CustomEvent('view-filtered-records', {
            detail: {
              buttonAction,
              widgetButton,
              recordLink,
              id: this.config.id,
              title: this.config.title
            },
            bubbles: true
          }));
      }
    }
  }
}
