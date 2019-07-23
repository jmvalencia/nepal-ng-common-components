/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';


@Component({
    selector: 'al-highchart-bubble',
    templateUrl: './al-highchart-bubble.component.html',
    styleUrls: ['./al-highchart-bubble.component.scss']
})
export class AlHighchartBubbleComponent implements OnChanges {
    @ViewChild('chart') chart: ElementRef;
    @ViewChild('chartContainer') chartContainer: ElementRef;

    public containerWidth: number;
    public containerHeight: number;
    public bubbleChart: any;
    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any;

    /*
     *
     */
    private reflow(): void {
      this.containerWidth = this.chartContainer.nativeElement.offsetWidth;
      this.containerHeight = this.chartContainer.nativeElement.offsetHeight;
    }

    private populateConfig = (): void => {
        this.bubbleChart = Highcharts.chart(this.chart.nativeElement, {
            chart: {
                type: 'packedbubble',
                width: this.containerWidth,
                height: this.containerHeight,
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip: {
                useHTML: true,
                pointFormat: '{point.value}',
                headerFormat: '',
                style: {
                    animation: false,
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        // tslint:disable-next-line
                        formatter: function() {
                            let count: string;
                            if ( this.point.value > 1000 ) {
                                count = this.point.value > 1000000 ?
                                        Highcharts.numberFormat( this.point.value / 1000000, 1 ) + 'M' :
                                        Highcharts.numberFormat( this.point.value / 1000, 1 ) + 'K';
                            } else {
                                count = Highcharts.numberFormat( this.point.value, 0 );
                            }
                            return `<b>${this.point.name}</b><br>${count}`;
                        },
                        style: {
                            color: 'white',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        }
                    },
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
                },
                packedbubble: {
                    useSimulation: false,
                    minSize: '105px',
                    maxSize: '100%',
                    draggable: false,
                }
            },
            series: [{
                name: '',
                type: 'packedbubble',
                data: this.config
            }]
        });
    }

    private updateSeries = (): void => {
        this.bubbleChart.update({
            series: this.config
        });
    }

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
}
