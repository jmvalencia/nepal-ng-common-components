/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'al-highchart-area-graph',
    templateUrl: './al-highchart-area-graph.component.html',
    styleUrls: ['./al-highchart-area-graph.component.scss']
})
export class AlHighchartAreaGraphComponent implements OnChanges {
    public areaGraphItem: any;

    @ViewChild('areaGraph') areaGraph: ElementRef;
    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any;

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
        this.areaGraphItem = Highcharts.chart(this.areaGraph.nativeElement, {
            chart: {
                type: 'area',
                styledMode: true
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: this.config.categories
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                  // tslint:disable-next-line
                    formatter: function() {
                        return this.value / 1000 + 'k';
                    }
                }
            },
            tooltip: {
                pointFormat: '{point.y:,.0f}'
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                type: 'area',
                name: this.config.name,
                color: this.config.color,
                data: this.config.data,
                className: this.config.className
            }]
        });
    }

    private updateSeries = (): void => {
        this.areaGraphItem.update({
            series: {
                data: this.config.data
            }
        });
    }
}
