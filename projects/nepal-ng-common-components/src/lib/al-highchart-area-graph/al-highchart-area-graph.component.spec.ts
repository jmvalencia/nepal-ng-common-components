import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlHighchartAreaGraphComponent } from './al-highchart-area-graph.component';
import { SimpleChange } from '@angular/core';

describe('AlHighchartAreaGraphComponent', () => {
  let component: AlHighchartAreaGraphComponent;
  let fixture: ComponentFixture<AlHighchartAreaGraphComponent>;
  const config = [
    {
        id: '1',
        name: 'High',
        data: [234, 234]
    }
  ];
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

  describe('When the theme is toggled', () => {
    it('Should change the value of the themeToggle variable', () => {
        component.themeToggle = false;
        component.toggleTheme();
        expect(component.themeToggle).toBe(true);
    });
  });
});
