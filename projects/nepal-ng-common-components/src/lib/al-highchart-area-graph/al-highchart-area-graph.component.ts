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
    public areaGraphItem: Highcharts.Chart;

    @ViewChild('areaGraph') areaGraph: ElementRef;

    @Input() config: Highcharts.Options;

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
      this.areaGraphItem = Highcharts.chart(this.areaGraph.nativeElement, Object.assign({
        chart: {
            type: 'area',
            styledMode: true
        },
        credits: {
            enabled: false
        },
        title: {
          text: ''
        },
        yAxis: {
            gridLineColor: 'transparent',
        },
        tooltip: {
          headerFormat: '',
          shadow: false,
          useHTML: true,
          pointFormat: `
              <span class="detail">{point.category}</span><br>
              <span class="description">{series.name}:</span> <span class="detail">{point.y}</span><br>
              <span class="description">% of Total:</span> <span class="detail">{point.percentage:.1f}%</span>
          `,
        },
        plotOptions: {
            area: {
              stacking: 'normal',
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
      }, this.config));
    }

    private updateSeries = (): void => {
        this.areaGraphItem.update({
            series: this.config.series
        });
    }
}
