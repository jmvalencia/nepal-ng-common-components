/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, ViewChild, ElementRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { AlHighChartsUtilityService } from '../al-highcharts-utility-service';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'al-highchart-doughnut',
    templateUrl: './al-highchart-doughnut.component.html',
    styleUrls: ['./al-highchart-doughnut.component.scss']
})
export class AlHighchartDoughnutComponent implements OnChanges  {
    @ViewChild('chart') chart: ElementRef;
    @ViewChild('chartContainer') chartContainer: ElementRef;

    public containerWidth: number;
    public containerHeight: number;
    public doughnutChart: Highcharts.Chart;
    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any[];


    /*
     *
     */
    constructor(private utilityService: AlHighChartsUtilityService) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.reflow();
        if (this.config) {
            if (changes.config.previousValue === undefined && changes.config.currentValue !== undefined) {
              this.populateConfig();
            } else {
              this.updateSeries();
            }
        }
    }

    private reflow(): void {
      this.containerWidth = this.chartContainer.nativeElement.offsetWidth;
      this.containerHeight = this.chartContainer.nativeElement.offsetHeight;
    }

    private populateConfig = (): void => {
        const service = this.utilityService;
        const legend: Highcharts.LegendOptions = this.legendConfig();

        this.doughnutChart = Highcharts.chart(this.chart.nativeElement, {
            legend,
            chart: {
                type: 'pie',
                width: this.containerWidth,
                height: this.containerHeight,
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%'],
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                    },
                    point: {
                      events: {
                        // tslint:disable-next-line
                        legendItemClick: function(e: Highcharts.PointLegendItemClickEventObject) {
                          service.pieLegendClickHandler(e);
                        }
                      }
                    },
                    showInLegend: true,
                    size: '90%',
                    events: {
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
            title: {
                text: ''
            },
            tooltip: {
                headerFormat: '',
                shadow: false,
                shape: 'callout',
                useHTML: true,
                pointFormat: `
                    <span class="description">{point.name}:</span> <span class="detail">{point.y}</span><br>
                    <span class="description">% of Total:</span> <span class="detail">{point.percentage:.1f}%</span>
                `,
            },
            credits: {
                enabled: false
            },
            series: [{
                type: 'pie',
                innerSize: '55%',
                data: this.config
            }]
        });
    }

    /*
     * When the point count gets above 4 change the legend so that it shows in two
     * vertical columns
     */
    private legendConfig (): Highcharts.LegendOptions {
      if (this.config.length > 3) {
        const width: number = this.containerWidth - 20;
        const itemWidth: number = width / 2;
        const itemStyleWidth: number = itemWidth - 15;

        return {
          width,
          itemWidth,
          labelFormat: '{name}',
          itemStyle: {
            width: itemStyleWidth
          }
        };
      } else {
        return {
          labelFormat: '{name}',
          layout: 'horizontal'
        };
      }
    }

    /*
     *
     */
    private updateSeries = (): void => {
      const legend: Highcharts.LegendOptions = this.legendConfig();
      this.doughnutChart.update({
        legend,
        series: this.config
      });
    }
}
