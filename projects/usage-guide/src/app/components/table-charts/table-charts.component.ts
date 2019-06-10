import { Component } from '@angular/core';
import { TableListConfig } from '../../../../../nepal-ng-common-components/src/lib/types';
import { BreadcrumbService } from '../../breadcrumb.service';

@Component({
  selector: 'app-table-charts',
  templateUrl: './table-charts.component.html',
  styleUrls: ['./table-charts.component.scss']
})
export class TableChartsComponent {

    public config2: TableListConfig = {
        headers: [
            { name: 'Host Name', field: 'summary'},
            { name: 'Count', field: 'count'},
            { name: 'Deployment1', field: 'deployment'}
        ],
        body: [
            { summary: '123.234.45', count: '12.3k', deployment: 'AWS Account' },
            { summary: '123.234.456', count: '12.36', deployment: 'AWS Account2' },
            { summary: '123.4.45', count: '12', deployment: 'AWS Account 1' }
        ]
    };

    public config1: TableListConfig = {
        headers: [
            { name: 'Host Name', field: 'summary 5' },
            { name: 'Count', field: 'count' },
            { name: 'Deployment1', field: 'deployment' },
            { name: 'Worst Status', field: 'status' }
        ],
        body: [
            { summary: '123.234.45', count: '12.3k', deployment: 'AWS Account', status: 'High' },
            { summary: '123.234.456', count: '12.36', deployment: 'AWS Account2', status: 'Medium' },
            { summary: '123.4.45', count: '12', deployment: 'AWS Account 1', status: 'Low' }
        ]
    };

    public config3: TableListConfig = {
        headers: [
            { name: 'Host Name', field: 'summary' },
            { name: 'Count', field: 'count', style: 'right' },
        ],
        body: [
            { summary: '123.234.45', count: '12.3k' },
            { summary: '123.234.456', count: '12.36' },
            { summary: '123.4.45', count: '12' }
        ]
    };

    constructor(private breadcrumbService: BreadcrumbService) {
      this.breadcrumbService.setItems([
          {label: 'Visualisations'},
          {label: 'Table Charts', routerLink: ['/table-charts']}
      ]);
    }
}
