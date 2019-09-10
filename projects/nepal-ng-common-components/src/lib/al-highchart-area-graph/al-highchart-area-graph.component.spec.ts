import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlHighchartAreaGraphComponent } from './al-highchart-area-graph.component';
import { SimpleChange } from '@angular/core';
import * as Highcharts from 'highcharts';

describe('AlHighchartAreaGraphComponent', () => {
  let component: AlHighchartAreaGraphComponent;
  let fixture: ComponentFixture<AlHighchartAreaGraphComponent>;
  const config: Highcharts.Options = {
    xAxis: {
      categories: ['January', 'February', 'March']
    },
    yAxis: {
      title: {
        text: 'Count of Incidents'
      }
    },
    series: [
      {
        name: 'Critical',
        data: [502, 635, 809,],
        className: 'critical',
        type: 'area'
      }]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlHighchartAreaGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlHighchartAreaGraphComponent);
    component = fixture.componentInstance;
    component.config = config;
    component.ngOnChanges({
      config: new SimpleChange(undefined, config, true)
    });
    fixture.detectChanges();

  });
});
