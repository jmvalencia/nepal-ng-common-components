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


  public containerWidth: number;
  public containerHeight: number;

  public semiCircle: any;
  @ViewChild('semiCircle') semiCircleEl: ElementRef;
  @ViewChild('semiCircleContainer') semiCircleContainer: ElementRef;

  /**
   * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
   * an interface
   */
  @Input() config: any;

  /*
   *
   */
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
  private populateConfig = (): void => {
    this.semiCircle = Highcharts.chart(this.semiCircleEl.nativeElement, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        styledMode: true,
        width: this.containerWidth,
        height: this.containerHeight,
        marginLeft: 50,
        marginRight: 50,
        marginBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        spacingBottom: 40,
        spacingTop: 10
      },
      credits: {
        enabled: false
      },
      title: {
        text: this.config.title || ''
      },
      tooltip: {
        pointFormat: '{point.y:.0f}',
        headerFormat: '',
        followPointer: false,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            softConnector: false,
            distance: 15,
            // tslint:disable-next-line
            formatter: function() {
              if ( this.point.y === 0 ) {
                return null;
              } else {
                let count: string;
                if ( this.point.y > 1000 ) {
                  count = this.point.y > 1000000 ?
                    Highcharts.numberFormat( this.point.y / 1000000, 1 ) + 'M' :
                    Highcharts.numberFormat( this.point.y / 1000, 1 ) + 'K';
                } else {
                  count = String(this.point.y);
                }
                return count;
              }
            }
          },
          showInLegend: true,
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '65%'],
          size: '120%'
        },
        series: {
          events: {
            // tslint:disable-next-line
            click: function(event) {
              event.target.dispatchEvent(new CustomEvent('data-element-clicked', {
                detail: {
                  segment: event.point
                },
                bubbles: true
              }));
            }
          }
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
  private reflow(): void {
    this.containerWidth = this.semiCircleContainer.nativeElement.offsetWidth;
    this.containerHeight = this.semiCircleContainer.nativeElement.offsetHeight;
  }
}
