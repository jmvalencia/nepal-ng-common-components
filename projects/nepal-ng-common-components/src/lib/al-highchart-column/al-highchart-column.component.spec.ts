import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlHighchartColumnComponent } from './al-highchart-column.component';
import { SimpleChange } from '@angular/core';

describe('AlHighchartColumnComponent', () => {
  let component: AlHighchartColumnComponent;
  let fixture: ComponentFixture<AlHighchartColumnComponent>;
  const config = { title: '', series: {}, categories: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlHighchartColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlHighchartColumnComponent);
    component = fixture.componentInstance;
    component.config = config;
    component.ngOnChanges({
      config: new SimpleChange(undefined, config, true)
    });
    fixture.detectChanges();
  });
});
