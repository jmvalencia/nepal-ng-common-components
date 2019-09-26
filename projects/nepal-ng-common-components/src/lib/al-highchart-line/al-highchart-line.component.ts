/**
 * @author Robert Parker <robert.parker@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { AlHighChartsUtilityService } from '../al-highcharts-utility-service';
import * as Highcharts from 'highcharts';


@Component({
    selector: 'al-highchart-line',
    templateUrl: './al-highchart-line.component.html',
    styleUrls: ['./al-highchart-line.component.scss']
})
export class AlHighchartLineComponent implements OnChanges {
    @ViewChild('chart') chart: ElementRef;

    public columnChart: any;
    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any;

    /*
     *
     */
    constructor(private utilityService: AlHighChartsUtilityService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.config) {
            if (changes.config.previousValue === undefined && changes.config.currentValue !== undefined) {
              this.populateConfig();
            } else {
              this.updateSeries();
            }
        }
    }

    private populateConfig = (): void => {
        const service = this.utilityService;
        this.columnChart = Highcharts.chart(this.chart.nativeElement, {
            chart: {
                type: 'line',
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
                shadow: false,
                useHTML: true,
                pointFormat: `
                    <span class="detail">{point.category}</span><br>
                    <span class="description">{series.name}:</span> <span class="detail">{point.y}</span><br>
                    <span class="description">% of Total:</span> <span class="detail">{point.percent}%</span>
                `,
            },
            xAxis: {
                categories: this.config.dateOptions,
            },
            yAxis: {
                gridLineColor: 'transparent',
                title: {
                    text: this.config.description
                },
                type: 'logarithmic',
                minorTickInterval: 1,
                lineWidth: 0,
                gridLineWidth: 0,
                minorGridLineWidth: 0
            },
            plotOptions: {
                line: {
                  marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2
                  }
                },
                series: {
                    events: {
                      // tslint:disable-next-line
                      legendItemClick: function(e: Highcharts.SeriesLegendItemClickEventObject) {
                        service.seriesLegendClickHandler(e);
                      },
                      // tslint:disable-next-line
                      click: function(event) {
                        event.target.dispatchEvent(new CustomEvent('data-element-clicked', {
                          detail: {
                            recordLink: event.point.recordLink
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
}
