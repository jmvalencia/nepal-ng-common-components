/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'al-highchart-semi-circle',
    templateUrl: './al-highchart-semi-circle.component.html',
    styleUrls: ['./al-highchart-semi-circle.component.scss']
})
export class AlHighchartSemiCircleComponent implements OnChanges {

    public semiCircle: any;
    public themeToggle = false;
    @ViewChild('semiCircle') semiCircleEl: ElementRef;

    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any;

    /*
     *
     */
    private populateConfig = (): void => {
      this.semiCircle = Highcharts.chart(this.semiCircleEl.nativeElement, {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        credits: {
          enabled: false
        },
        title: {
          text: this.config.title || ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            size: '110%'
          }
        },
        series: this.config.series || []
      });
    }

    /*
     *
     */
    private updateSeries = (): void => {
      this.semiCircle.update({
        series: this.config.series
      });
    }

    /*
     *
     */
    ngOnChanges(changes: SimpleChanges): void {
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
    toggleTheme() {
        this.themeToggle = !this.themeToggle;
        this.toggleDarkTheme();
    }

    public toggleDarkTheme(): void {
        if ( this.themeToggle ) {
            this.semiCircle.update({
                chart: {
                    backgroundColor: '#3C3C3C',
                },
                plotOptions: {
                    pie: {
                        borderColor: '#3C3C3C'
                    }
                }
            });
        } else {
            this.semiCircle.update({
                chart: {
                    backgroundColor: '#ffffff',
                },
                plotOptions: {
                    pie: {
                        borderColor: '#ffffff'
                    }
                }
            });
        }
    }
}
