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
    public themeToggle = false;
    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any;

    private populateConfig = (): void => {
        this.columnChart = Highcharts.chart(this.chart.nativeElement, {
            chart: {
                type: 'column',
            },
            credits: {
                enabled: false
            },
            title: {
                text: this.config.title
            },
            xAxis: {
                categories: this.config.dateOptions,
            },
            yAxis: {
                title: {
                    text: this.config.description
                },
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
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

    toggleTheme() {
        this.themeToggle = !this.themeToggle;
        this.toggleDarkTheme();
    }

    toggleDarkTheme() {
        if ( this.themeToggle ) {
            this.columnChart.update({
                chart: {
                    backgroundColor: '#3C3C3C',
                },
                yAxis: {
                    gridLineColor: '#3C3C3C',
                    labels: {
                        style: {
                            color: '#EDEDED'
                        }
                    }
                },
                xAxis: {
                    labels: {
                        style: {
                            color: '#EDEDED'
                        }
                    },
                    categories: {
                        color: '#EDEDED'
                    }
                },
                plotOptions: {
                    series: {
                        borderColor: '#3C3C3C'
                    }
                },
                legend:  {
                    itemStyle: {
                        color: '#EDEDED'
                    }
                }
            });
        } else  {
            this.columnChart.update({
                chart: {
                    backgroundColor: '#ffffff',
                },
                yAxis: {
                    gridLineColor: '#e6e6e6',
                    labels: {
                        style: {
                            color: '#666666'
                        }
                    }
                },
                xAxis: {
                    labels: {
                        style: {
                            color: '#666666'
                        }
                    },
                    categories: {
                        color: '#666666'
                    }
                },
                plotOptions: {
                    series: {
                        borderColor: '#ffffff'
                    }
                },
                legend:  {
                    itemStyle: {
                        color: '#666666'
                    }
                }
            });
        }
    }
}
