/*
 * @author Stephen Jones   <stephen.jones@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import {
  Input,
  Component,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';

import { WidgetContentType, ZeroStateReason, ZeroState } from '../types';

@Component({
    selector: 'al-content-zero-data',
    templateUrl: './al-content-zero-data.component.html',
    styleUrls: ['./al-content-zero-data.component.scss']
})
export class AlZeroContentDataComponent implements OnInit {

  public title = '';
  public icon = '';
  public isError = false;

  @Input() contentType: WidgetContentType;
  @Input() config: ZeroState;

  // For use in template
  public widgetContentType: typeof WidgetContentType = WidgetContentType;

  /*
   *
   */
  ngOnInit() {
    switch (this.config.reason) {
      case ZeroStateReason.API:
        this.title = 'Error: Unable to load data';
        this.icon = 'ui-icon-error';
        this.isError = true;
        break;
      case ZeroStateReason.Entitlement:
        this.title = 'Entitlement not available';
        this.icon = 'ui-icon-warning';
        this.isError = true;
        break;
    }
  }
}

