import { Injectable } from '@angular/core';
import { ActivityGaugeConfig } from '../types';
import { BASE_CONFIG } from './al-highchart-activity-gauge.types';

@Injectable({
    providedIn: 'root'
})

export class AlHighchartsActivityGaugeService {

    /*
     *
     */
    getConfig(config: ActivityGaugeConfig): any {
        const { title, value, text1, text2, className, backgroundColor } = config;

        BASE_CONFIG.title.text = title;
        BASE_CONFIG.pane.background[0].backgroundColor = backgroundColor;
        BASE_CONFIG.series[0].data[0].className = className;
        BASE_CONFIG.series[0].data[0].y = value;
        BASE_CONFIG.plotOptions.solidgauge.dataLabels.formatter = (() => {
            return `<dl style='display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-family: "Open Sans";
                        font-weight: 100;
                        margin-left: -5px'>
                <dt style='font-size: 24px'>${text1}</dt>
                <dd style="margin: 0; font-size: 12px">${text2}</dd>
            </dl>`;
        });
        return BASE_CONFIG;
    }
}
