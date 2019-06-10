/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'al-highchart-bar',
    templateUrl: './al-highchart-bar.component.html',
    styleUrls: ['./al-highchart-bar.component.scss']
})
export class AlHighchartBarComponent implements OnChanges {
    @ViewChild('barChart') chart: ElementRef;

    public barChart: any;
    public themeToggle = false;
    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any;

    private populateConfig = (): void => {
        this.barChart = Highcharts.chart(this.chart.nativeElement, {
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: this.config.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.config.title
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                }
            },
            series: this.config.series
        });
    }

    private updateSeries = (): void => {
        this.barChart.update({
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

    toggleTheme() {
        this.themeToggle = !this.themeToggle;
        this.toggleDarkTheme();
    }

    toggleDarkTheme() {
        if ( this.themeToggle ) {
            this.barChart.update({
                chart: {
                    backgroundColor: '#3C3C3C',
                },
                yAxis: {
                    gridLineColor: '#3C3C3C',
                },
                plotOptions: {
                    series: {
                        borderColor: '#3C3C3C'
                    }
                }
            });
        } else  {
            this.barChart.update({
                chart: {
                    backgroundColor: '#ffffff',
                },
                yAxis: {
                    gridLineColor: '#e6e6e6',
                },
                plotOptions: {
                    series: {
                        borderColor: '#ffffff'
                    }
                },
            });
        }
    }
}
