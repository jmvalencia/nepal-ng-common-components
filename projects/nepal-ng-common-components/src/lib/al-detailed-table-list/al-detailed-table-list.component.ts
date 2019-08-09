import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { TableListConfig, TableListBody } from '../types';

@Component({
  selector: 'al-detailed-table-list',
  templateUrl: './al-detailed-table-list.component.html',
  styleUrls: ['./al-detailed-table-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlDetailedTableListComponent implements OnInit, OnChanges {

    public tableConfig: TableListConfig;

    /*
     * Configuration of the table
     */
    @Input() config: TableListConfig;

    constructor(private el: ElementRef) {}

    ngOnChanges(changes: SimpleChanges): void {
      this.tableConfig = this.config;
    }

    ngOnInit() {
      this.tableConfig = this.config;
    }

    onDataRowClick(rowBody: TableListBody) {
      if (rowBody.recordLink) {
        this.el.nativeElement
          .dispatchEvent(new CustomEvent('data-element-clicked', {
            detail: {
              recordLink: rowBody.recordLink
            },
            bubbles: true
          }));
      } else {
        console.log('No record link data attribute found for selected table row!');
      }

    }
}
