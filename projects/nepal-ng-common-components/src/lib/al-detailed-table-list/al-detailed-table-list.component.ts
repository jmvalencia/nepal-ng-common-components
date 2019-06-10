import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { TableListConfig } from '../types';

@Component({
  selector: 'al-detailed-table-list',
  templateUrl: './al-detailed-table-list.component.html',
  styleUrls: ['./al-detailed-table-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlDetailedTableListComponent implements OnInit, OnChanges {

    public themeToggle = false;
    public tableConfig: TableListConfig;

    /*
     * Configuration of the table
     */
    @Input() config: TableListConfig;

    ngOnChanges(changes: SimpleChanges): void {
      this.tableConfig = this.config;
    }

    ngOnInit() {
      this.tableConfig = this.config;
    }

    toggleTheme() {
      this.themeToggle = !this.themeToggle;
  }
}
