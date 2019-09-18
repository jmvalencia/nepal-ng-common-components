import { CommonComponentsService } from './common-components.service';
import { TestBed } from '@angular/core/testing';
import * as Highcharts from 'highcharts';

describe('CommonComponentsService', () => {

  let service: CommonComponentsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ CommonComponentsService ]
    });
    service = TestBed.get(CommonComponentsService);
  });

  describe('when clicking on a pie legend item', () => {
    it('should prevent default when it is the last viewable segment', () => {
      const eventObject: Highcharts.PointLegendItemClickEventObject = {
        preventDefault: () => {},
        type: "legendItemClick",
        browserEvent: new PointerEvent('click'),
        target: Object.assign(new Highcharts.Point, {
          visible: true,
          y: 4,
          series: {
            data: [
              {visible: true, y: 1},
              {visible: false, y: 1},
              {visible: false, y: 1}
            ]
          }
        })
      } as Highcharts.PointLegendItemClickEventObject;

      const spy = spyOn(eventObject, 'preventDefault');
      service.pieLegendClickHandler(eventObject);
      expect(spy).toHaveBeenCalled();
    });
  });

});
