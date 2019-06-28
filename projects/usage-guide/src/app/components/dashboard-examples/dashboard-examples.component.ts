import { Component, OnInit, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import {
        Widget,
        WidgetContent,
        WidgetContentType,
        WidgetWidth,
        WidgetHeight,
        TableListConfig,
        ActivityGaugeConfig,
        ZeroState,
        ZeroStateReason
    } from '../../../../../nepal-ng-common-components/src/lib/types';
import { BreadcrumbService } from '../../breadcrumb.service';

@Component({
  selector: 'app-dashboard-examples',
  templateUrl: './dashboard-examples.component.html',
  styleUrls: ['./dashboard-examples.component.scss']
})
export class DashboardExamplesComponent implements OnInit {

    public baseWidth = 384;
    public baseHeight = 384;
    public widgetHeight: string;
    public widgetWidth: string;
    public count = '999';
    public count2 = '1245';
    public count3 = '34123';
    public count4 = '198765';
    public count5: ZeroState = {
     nodata: true,
     reason: ZeroStateReason.API
    };
    public count6: ZeroState = {
     nodata: true,
     reason: ZeroStateReason.Entitlement
    };
    public failedSemi: ZeroState = {
     nodata: true,
     reason: ZeroStateReason.Zero
    };
    public failedTree: ZeroState = {
     nodata: true,
     reason: ZeroStateReason.Zero
    };
    public dashboards = [
        { label: 'Threat Summary', icon: 'ui-icon-vertical-align-top', value: { id: 6, name: 'Threat Summmary', code: 'TS' }},
        { label: 'Coverage and Health', icon: 'ui-icon-vertical-align-top', value: { id: 1, name: 'Coverage and Health', code: 'CAH' }},
        { label: 'Vulnerability Summary', icon: 'ui-icon-vertical-align-top', value: { id: 2, name: 'Vulnerability Summary', code: 'VS' }}
    ];

    public mockTreeMap: any = [
        {
            id: '1',
            name: 'High',
        }, {
            id: '2',
            name: 'Medium',
        }, {
            id: '3',
            name: 'Info',
        }, {
            id: '4',
            name: 'Low',
        }, {
            name: '6',
            parent: '1',
            value: 6,
            className: 'high'
        }, {
            name: 'B',
            parent: '2',
            value: 5,
            className: 'medium'
        }, {
            name: 'C',
            parent: '3',
            value: 4,
            className: 'info'
        }, {
            name: 'D',
            parent: '4',
            value: 3,
            className: 'low'
        }
    ];
    public semiCircleData = {
        title: '',
        series: [{
            type: 'pie',
            name: 'Critical and High Classifications',
            innerSize: '50%',
            dataLabels: {
                style: {
                    textOutline: '0px'
                }
            },
            data: [{
                name: 'Brute Force',
                y: 15.6,
                className: 'scanned'
            }, {
                name: 'Recon',
                y: 15.3,
                className: 'not-scanned'
            }]
        }]
    };

    /*
     *
     */
    public activityGaugeConfig: ActivityGaugeConfig = {
        value: 50,
        text1: '761/1k',
        text2: 'Essentials',
        backgroundColor: 'rgba(2, 80, 112, .3)',
        className: 'essential'
    };

    public columnData = {
        title: '',
        description: 'Total Coverage State',
        dateOptions: ['Monday', 'Tuesday', 'Wednesday', 'Thursda', 'Friday', 'Saturday', 'Sunday'],
        series: [{
            name: 'Enterprise',
            data: [[0, 25], [1, 15], [2, 35], [3, 40], [4, 15], [5, 10], [6, 5]],
            className: 'enterprise'
        }, {
            name: 'Professional',
            data: [[0, 5], [1, 10], [2, 15], [3, 10], [4, 5], [5, 10], [6, 5]],
            className: 'professional'
        }, {
            name: 'Essential',
            data: [[0, 15], [1, 0], [2, 20], [3, 15], [4, 15], [5, 15], [6, 15]],
            className: 'essential'
        }, {
            name: 'Unprotected',
            data: [[0, 15], [1, 15], [2, 25], [3, 20], [4, 15], [5, 15], [6, 10]],
            className: 'unprotected'
        }]
    };

    public columnRedData = {
        title: '',
        description: 'Count of Incidents',
        dateOptions: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        series: [{
            name: 'High',
            data: [[0, 25], [1, 15], [2, 15], [3, 4], [4, 25], [5, 1], [6, 15]],
            className: 'high'
        }, {
            name: 'Medium',
            data: [[0, 5], [1, 10], [2, 25], [3, 30], [4, 5], [5, 12], [6, 15]],
            className: 'low'
        }]
    };

    public tableConfig: TableListConfig = {
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

    public mockBarChart = {
        title: '',
        categories: ['Prod Networks', 'Prod VPC', 'Prod VNET', 'Dev Network', 'Dev VPC'],
        series: [{
            type: 'bar',
            name: 'Internal',
            data: [ 5, 4, 3, 2 ],
            className: 'high'
        },
        {
            type: 'bar',
            name: 'External',
            data: [ 3, 3, 2, 1 ],
            className: 'medium'
        }]
    };

    public mockAreaChart = {
        categories: ['January', 'February', 'March'],
        name: 'Logs',
        data: [ 3717, 4368, 4018 ],
        color: '#6CA2FF'
    };

    public configs: Widget[] = [{
      id: '1',
      title: 'Unprotected Nodes',
      actions: {
        primary: {
          name: 'Primary',
          action: {
            target_app: 'foo',
            path: 'bar'
          }
        },
        link1: 'Link 1',
        link2: 'Link 2',
      },
      content: {
        type: WidgetContentType.Count,
        data: this.count,
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '101',
      title: 'Unprotected Nodes',
      actions: {
        primary: {
          name: 'Primary',
          action: {
            target_app: 'foo',
            path: 'bar'
          }
        },
        link1: 'Link 1',
        link2: 'Link 2',
      },
      content: {
        type: WidgetContentType.Count,
        data: this.count2,
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '102',
      title: 'Unprotected Nodes',
      actions: {
        primary: {
          name: 'Primary',
          action: {
            target_app: 'foo',
            path: 'bar'
          }
        },
        link1: 'Link 1',
        link2: 'Link 2',
      },
      content: {
        type: WidgetContentType.Count,
        data: this.count3,
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '103',
      title: 'Unprotected Nodes',
      actions: {
        primary: {
          name: 'Primary',
          action: {
            target_app: 'foo',
            path: 'bar'
          }
        },
        link1: 'Link 1',
        link2: 'Link 2',
      },
      content: {
        type: WidgetContentType.Count,
        data: this.count4,
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '105',
      title: 'Failed API Call',
      actions: {
        primary: {
          name: 'Call Sales',
          action: {
            url: 'tel:+18774848383'
          }
        }
      },
      content: {
        type: WidgetContentType.Count,
        data: this.count5,
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '106',
      title: 'Failed Entitlement Call',
      actions: {
        primary: {
          name: 'Primary',
          action: {
            target_app: 'foo',
            path: 'bar'
          }
        },
        link1: 'Link 1',
        link2: 'Link 2',
      },
      content: {
        type: WidgetContentType.Count,
        data: this.count6,
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '107',
      title: '1 x 1 Widget with SemiCircle - No Data',
      content: {
        type: WidgetContentType.SemiCircle,
        data: this.failedSemi,
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '108',
      title: '1 x 1 Widget with TreeMap - No Data',
      actions: {
        link1: 'Link 1',
        link2: 'Link 2',
      },
      content: {
        type: WidgetContentType.TreeMap,
        data: this.failedTree
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '2',
      title: 'Empty Widget 2 x 1',
      content: {
        type: WidgetContentType.Column,
        data: this.columnData,
      },
      metrics: {
        width: WidgetWidth.W2,
        height: WidgetHeight.H1,
      }
    }, {
      id: '3',
      title: '2 x 1 Widget with Mixed Chart',
      actions: {
        link1: 'Link 1',
        link2: 'Link 2',
      },
      content: {
        type: WidgetContentType.Column,
        data: this.columnRedData,
      },
      metrics: {
        width: WidgetWidth.W2,
        height: WidgetHeight.H1,
      }
    }, {
      id: '9',
      title: '1 x 1 Widget with TreeMap',
      actions: {
        link1: 'Link 1',
        link2: 'Link 2',
      },
      content: {
        type: WidgetContentType.TreeMap,
        data: this.mockTreeMap
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
    }, {
      id: '4',
      hideSettings: true,
      title: 'Critical and High Classifications',
      actions: {
        primary: {
          name: 'Primary'
        },
      },
      content: {
        type: WidgetContentType.ActivityGauge,
        data: this.activityGaugeConfig
      },
      metrics: {
        width: WidgetWidth.W1,
        height: WidgetHeight.H1,
      }
  },
  {
    id: '3',
    title: '2 x 1 Widget with List Chart',
    actions: {
        link1: 'Export to CSV',
    },
    content: {
      type: WidgetContentType.SemiCircle,
      data: this.semiCircleData,
    },
    metrics: {
      width: WidgetWidth.W1,
      height: WidgetHeight.H1,
    }
  },
  {
    id: '3',
    title: '2 x 1 Widget with List Chart',
    actions: {
      link1: 'Export to CSV',
    },
    content: {
      type: WidgetContentType.TableListSummary,
      data: this.tableConfig,
    },
    metrics: {
      width: WidgetWidth.W1,
      height: WidgetHeight.H1,
    }
  },
  {
    id: '3',
    title: '2 x 1 Widget with List Chart',
    actions: {
      link1: 'Export to CSV',
    },
    content: {
      type: WidgetContentType.TableListSummary,
      data: this.tableConfig,
    },
    metrics: {
      width: WidgetWidth.W2,
      height: WidgetHeight.H1,
    }
  },
  {
    id: '3',
    title: '2 x 1 Widget with Bar Chart',
    actions: {},
    content: {
      type: WidgetContentType.Bar,
      data: this.mockBarChart,
    },
    metrics: {
      width: WidgetWidth.W2,
      height: WidgetHeight.H1,
    }
  },
  {
    id: '3',
    title: '1 x 1 Area Chart',
    actions: {},
    content: {
      type: WidgetContentType.Area,
      data: this.mockAreaChart,
    },
    metrics: {
      width: WidgetWidth.W1,
      height: WidgetHeight.H1,
    }
  },
];

  // For use in template
  public contentType: typeof WidgetContentType = WidgetContentType;

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
        {label: 'Examples'},
        {label: 'Dashboard', routerLink: ['/dashboard-examples']}
    ]);
  }

  ngOnInit() {
  }

  /*
   *
   */
  buttonClicked(e) {
    console.dirxml(e);
  }

  /*
   *
   */
  public getHeight(height: WidgetHeight): string {
    return `${height * this.baseHeight}px`;
  }

  /*
   *
   */
  public getWidth(width: WidgetWidth): string {
    return `${width * this.baseWidth}px`;
  }

  public updateData() {
        this.configs[5].content.data = {
          title: '',
          series: [{
              type: 'pie',
              name: 'Critical and High Classifications',
              innerSize: '50%',
              dataLabels: {
                  style: {
                      textOutline: '0px'
                  }
              },
              data: [{
                  name: 'Brute Forcey',
                  y: 75.6,
                  color: '#C4D8FC'
              }, {
                  name: 'Recon Attack',
                  y: 15.3,
                  color: '#77A7F9'
              }, {
                  name: 'Trojan Horse',
                    y: 26.1,
                    color: '#3E82F7'
                }]
            }]
        };

        this.configs[1].content.data = {
            title: '',
            description: 'Total Coverage State',
            dateOptions: ['Monday', 'Tuesday', 'Wednesday', 'Thursda', 'Friday', 'Saturday', 'Sunday'],
            series: [{
                name: 'Enterprise',
                data: [[0, 25], [1, 45], [2, 65], [3, 0], [4, 15], [5, 10], [6, 35]],
                color: '#3FC6F1'
            }, {
                name: 'Professional',
                data: [[0, 5], [1, 10], [2, 15], [3, 10], [4, 5], [5, 16], [6, 15]],
                color: '#028BA3'
            }, {
                name: 'Essential',
                data: [[0, 65], [1, 40], [2, 0], [3, 0], [4, 5], [5, 75], [6, 25]],
                color: '#025070'
            }, {
                name: 'Unprotected',
                data: [[0, 25], [1, 35], [2, 5], [3, 10], [4, 50], [5, 15], [6, 50]],
                color: '#EDEDED'
            }]
        };

        this.configs[8].content.data = {
            title: '',
            categories: ['Prod Networks', 'Prod VPC', 'Prod VNET', 'Dev Network', 'Dev VPC'],
            series: [{
                type: 'bar',
                name: 'Internal',
                data: [ 5, 25, 23, 28 ],
                color: '#3E82F7'
            },
            {
                type: 'bar',
                name: 'External',
                data: [ 13, 32, 12, 10 ],
                color: '#6CA2FF'
            }]
        };

        this.configs[9].content.data = {
            categories: ['January', 'February', 'March'],
            name: 'Logs',
            data: [ 4717, 2368, 6018 ],
            color: '#6CA2FF'
        };

        this.configs[7].content.data = {
            headers: [
                { name: 'Host Name Test', field: 'summary'},
                { name: 'Count 1', field: 'count'},
                { name: 'Deployment2', field: 'deployment'}
            ],
            body: [
                { summary: '123.234.46', count: '12.3k', deployment: 'AWS Account' },
                { summary: '123.234.46', count: '12.36', deployment: 'AWS Account2' },
                { summary: '123.4.445', count: '12', deployment: 'AWS Account 1' }
            ]
        };
    }
}
