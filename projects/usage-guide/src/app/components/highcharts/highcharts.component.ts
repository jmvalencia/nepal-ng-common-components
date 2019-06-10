import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../breadcrumb.service';

@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss']
})
export class HighChartsComponent implements OnInit {

    public dashboards = [
        { label: 'Threat Summary', icon: 'ui-icon-vertical-align-top', value: { id: 6, name: 'Threat Summmary', code: 'TS' }},
        { label: 'Coverage and Health', icon: 'ui-icon-vertical-align-top', value: { id: 1, name: 'Coverage and Health', code: 'CAH' }},
        { label: 'Vulnerability Summary', icon: 'ui-icon-vertical-align-top', value: { id: 2, name: 'Vulnerability Summary', code: 'VS' }}
    ];

    public mockColumnData: any = {
        title: 'Protection Coverage Trend',
        description: 'Total Coverage State',
        dateOptions: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        series: [
            {
                name: 'Enterprise',
                data: [
                    [0, 25], [1, 15], [2, 35], [3, 40], [4, 15], [5, 10], [6, 5]
                ],
                color: '#3FC6F1'
            },
            {
                name: 'Professional',
                data: [
                    [0, 5], [1, 10], [2, 15], [3, 10], [4, 5], [5, 10], [6, 5]
                ],
                color: '#028BA3'
            },
            {
                name: 'Essential',
                data: [
                    [0, 15], [1, 0], [2, 20], [3, 15], [4, 15], [5, 15], [6, 15]
                ],
                color: '#025070'
            },
            {
                name: 'Unprotected',
                data: [
                    [0, 15], [1, 15], [2, 25], [3, 20], [4, 15], [5, 15], [6, 10]
                ],
                color: '#EDEDED'
            },
        ]
    };

    public mockColumnDataRedOrange: any = {
        title: '',
        description: 'Count of Incidents',
        dateOptions: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        series: [
            {
                name: 'Critical',
                data: [
                    [0, 25], [1, 15], [2, 15], [3, 4], [4, 25], [5, 1], [6, 15]
                ],
                color: '#F57C00'
            },
            {
                name: 'High',
                data: [
                    [0, 5], [1, 10], [2, 25], [3, 30], [4, 5], [5, 12], [6, 15]
                ],
                color: '#E53935'
            },
            {
                type: 'line',
                name: 'Overall Count',
                data: [10, 20.67, 30, 16.33, 13.33, 6, 15],
                color: '#535353',
            }
        ]
    };
    public mockSemiCircleData = {
        title: 'Critical and High Classifications',
        series: [{
            type: 'pie',
            name: 'Critical and High Classifications',
            innerSize: '50%',
            data: [
                {
                    name: 'Brute Force',
                    y: 15.6,
                    color: '#C4D8FC'
                },
                {
                    name: 'Recon',
                    y: 15.3,
                    color: '#77A7F9'
                },
                {
                    name: 'Trojan',
                    y: 69.1,
                    color: '#3E82F7'
                },

            ],
            dataLabels: {
                style: {
                    textOutline: '0px',
                    color: 'white',
                }
            }
        }]
    };

    public mockTreeMap: any = [
        {
            id: '1',
            name: 'High',
            color: '#EF534F'
        }, {
            id: '2',
            name: 'Medium',
            color: '#FFB840'
        }, {
            id: '3',
            name: 'Info',
            color: '#EDEDED'
        }, {
            id: '4',
            name: 'Low',
            color: '#FFDB6B'
        }, {
            name: '6',
            parent: '1',
            value: 6,
        }, {
            name: 'B',
            parent: '2',
            value: 5,
        }, {
            name: 'C',
            parent: '3',
            value: 4,
        }, {
            name: 'D',
            parent: '4',
            value: 3,
        }
    ];

    public mockAreaChart = {
        categories: ['January', 'February', 'March'],
        name: 'Logs',
        data: [ 3717, 4368, 4018 ],
        color: '#6CA2FF'
    };

    public mockBarChart = {
        title: '',
        categories: ['Prod Networks', 'Prod VPC', 'Prod VNET', 'Dev Network', 'Dev VPC'],
        series: [{
            type: 'bar',
            name: 'Internal',
            data: [ 5, 4, 3, 2 ],
            color: '#3E82F7'
        },
        {
            type: 'bar',
            name: 'External',
            data: [ 3, 3, 2, 1 ],
            color: '#6CA2FF'
        }]
    };

    constructor(private breadcrumbService: BreadcrumbService) {
      this.breadcrumbService.setItems([
          {label: 'Visualisations'},
          {label: 'Highcharts', routerLink: ['/highcharts']}
      ]);
    }

    ngOnInit() {}
}
