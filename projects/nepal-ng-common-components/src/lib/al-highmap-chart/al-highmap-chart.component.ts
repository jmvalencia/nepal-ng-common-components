/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import proj4 from 'proj4';
import * as Highcharts from 'highcharts';

import map from 'highcharts/modules/map';

const mapWorld = require('@highcharts/map-collection/custom/world.geo.json');
map(Highcharts);

@Component({
    selector: 'al-highmap-chart',
    templateUrl: './al-highmap-chart.component.html',
    styleUrls: ['./al-highmap-chart.component.scss']
})
export class AlHighmapChartComponent implements OnChanges {
    public mapChart: any;
    public containerWidth: number;
    public containerHeight: number;

    @ViewChild('chart') chart: ElementRef;
    @ViewChild('mapChartContainer') mapContainer: ElementRef;

    /**
     * Input to populate the graph - set to 'any' until backend is defined, allowing us to build
     * an interface
     */
    @Input() config: any;

    ngOnChanges(changes: SimpleChanges): void {
        if ( typeof window !== 'undefined' ) {
            (<any>window).proj4 = proj4;
        }
        this.reflow();
        if (this.config) {
            if (changes.config.previousValue === undefined && changes.config.currentValue !== undefined) {
              this.populateConfig();
            } else {
              this.updateSeries();
            }
        }
    }

    private populateConfig = (): void => {
        this.mapChart = Highcharts.mapChart(this.chart.nativeElement, {
            chart: {
                map: mapWorld,
                borderWidth: 1,
                styledMode: true,
            },
            title: {
                text: ''
            },
            mapNavigation: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function () {
                    return this.point.id + (
                        this.point.lat ?
                            '<br>Lat: ' + this.point.lat + ' Lon: ' + this.point.lon : ''
                    );
                }
            },
            series: [
                {
                    type: 'map',
                    mapData: Highcharts.maps['countries/gb/gb-all'],
                    name: 'Basemap',
                    borderColor: '#d6d6d6',
                    nullColor: '#eeeeee',
                    showInLegend: false
                },
                {
                    zIndex: 1,
                    data: this.config,
                    type: 'mappoint',
                    name: 'Cities',
                    dataLabels: {
                        align: 'center',
                        format: `
                            <text class="map-id">{point.id}</text><br>
                            <text class="map-value" x="15" dy="15">{point.value}</text>`,
                    },
                }
            ]
        });
    }

    private reflow(): void {
        this.containerWidth = this.mapContainer.nativeElement.offsetWidth;
        this.containerHeight = this.mapContainer.nativeElement.offsetHeight;
    }

    private updateSeries = (): void => {
        this.mapChart.update({
            series: {
                data: this.config
            }
        });
    }
}