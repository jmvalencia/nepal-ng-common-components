import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';

@Injectable({
  providedIn: 'root',
})
export class AlHighChartsUtilityService {

  constructor() { }

  /*
   *
   */
  public pieLegendClickHandler(e: Highcharts.PointLegendItemClickEventObject): void {
    const legendItem: Highcharts.Point = e.target;
    const selfValue = legendItem.y;
    const visibleRemaining = legendItem.series.data.filter(item => item.visible);
    const countVisible = visibleRemaining.length;
    const remainingVisibleValue = visibleRemaining.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.y;
    }, 0) - selfValue;

    // If the count of remaining visibles is only one (must be this one) then don't
    // allow it to be switched off
    if (legendItem.visible && (countVisible === 1 || remainingVisibleValue <= 0)) {
      e.preventDefault();
    }
  }

  /*
   *
   */
  public seriesLegendClickHandler(e: Highcharts.SeriesLegendItemClickEventObject): void {
    const legendItem: Highcharts.Series = e.target;
    const visibleRemaining = legendItem.chart.series.filter(item => item.visible).length;
    if (legendItem.visible && visibleRemaining === 1) {
      e.preventDefault();
    }
  }
}
