/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'al-highchart-column',
    templateUrl: './al-highchart-column.component.html',
    styleUrls: ['./al-highchart-column.component.scss']
})
export class AlHighchartColumnComponent implements OnChanges {
    @ViewChild('chart') chart: ElementRef;

    public columnChart: any;
    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any;

    private populateConfig = (): void => {
        this.columnChart = Highcharts.chart(this.chart.nativeElement, {
            chart: {
                type: 'column',
                styledMode: true
            },
            credits: {
                enabled: false
            },
            title: {
                text: this.config.title
            },
            tooltip: {
                headerFormat: '',
            },
            xAxis: {
                categories: this.config.dateOptions,
            },
            yAxis: {
                gridLineColor: 'transparent',
                title: {
                    text: this.config.description
                },
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                },
                series: {
                    events: {
                      // tslint:disable-next-line
                      click: function(event) {
                        event.target.dispatchEvent(new CustomEvent('segment-clicked', {
                          detail: {
                            segment: event.point
                          },
                          bubbles: true
                        }));
                      }
                    }
                }
            },
            series: this.config.series
        });
    }

    private updateSeries = (): void => {
        this.columnChart.update({
            series: this.config.series
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.config) {
            if (changes.config.previousValue === undefined && changes.config.currentValue !== undefined) {
              this.populateConfig();
            } else {
              this.updateSeries();
            }
        }
    }
}
