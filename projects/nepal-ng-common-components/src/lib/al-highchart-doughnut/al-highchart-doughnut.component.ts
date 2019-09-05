/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, ViewChild, ElementRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
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
    public doughnutChart: any;
    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any[];

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

    /*
     *
     */
    private reflow(): void {
      this.containerWidth = this.chartContainer.nativeElement.offsetWidth;
      this.containerHeight = this.chartContainer.nativeElement.offsetHeight;
    }

    private populateConfig = (): void => {
        this.doughnutChart = Highcharts.chart(this.chart.nativeElement, {
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
                        enabled: false
                    },
                    showInLegend: true,
                    size: '90%'
                },
            },
            title: {
                text: ''
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                labelFormat: '{name}: {y} - {percent}',
                layout: 'vertical',
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

    private updateSeries = (): void => {
        this.doughnutChart.update({
            series: this.config
        });
    }
}
