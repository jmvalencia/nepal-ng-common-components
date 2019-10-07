import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { TableListConfig } from '../types';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'al-detailed-table-list',
  templateUrl: './al-detailed-table-list.component.html',
  styleUrls: ['./al-detailed-table-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlDetailedTableListComponent implements OnInit, OnChanges {

    public tableConfig: TableListConfig;
    public mouseOverContent: string;
    public showTooltip = false;

    /*
     * Configuration of the table
     */
    @Input() config: TableListConfig;


    @ViewChild('op') op: OverlayPanel;

    constructor(private el: ElementRef) {}

    ngOnChanges(changes: SimpleChanges): void {
      this.tableConfig = this.config;
    }

    ngOnInit() {
      this.tableConfig = this.config;
    }

    onDataRowClick(rowBody: {[p:string]: string|number}[]) {
      if (rowBody.hasOwnProperty('recordLink')) {
        this.el.nativeElement
          .dispatchEvent(new CustomEvent('data-element-clicked', {
            detail: {
              recordLink: rowBody['recordLink']
            },
            bubbles: true
          }));
      } else {
        console.log('No record link data attribute found for selected table row!');
      }

    }

    onContentMouseOver(event, overlayTarget, content: string, classList: string) {
      if(classList &&  classList.includes('multiline-content')) {
        this.mouseOverContent = content;
        this.op.show(event, overlayTarget);
      } else {
        this.op.hide();
      }

    }
    onContentMouseOut(event) {
      this.mouseOverContent = null;
      this.op.hide();
    }
}
