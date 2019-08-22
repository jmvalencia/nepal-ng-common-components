import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlHighchartBarComponent } from './al-highchart-bar.component';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('AlHighchartSemiCircleComponent', () => {
  let component: AlHighchartBarComponent;
  let fixture: ComponentFixture<AlHighchartBarComponent>;
  const config = { title: '', series: {}, categories: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlHighchartBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlHighchartBarComponent);
    component = fixture.componentInstance;
    component.config = config;
    component.ngOnChanges({
      config: new SimpleChange(undefined, config, true)
    });
    fixture.detectChanges();
  });
});
