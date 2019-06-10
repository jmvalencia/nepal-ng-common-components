import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlHighchartSemiCircleComponent } from './al-highchart-semi-circle.component';
import { SimpleChange } from '@angular/core';

describe('AlHighchartSemiCircleComponent', () => {
  let component: AlHighchartSemiCircleComponent;
  let fixture: ComponentFixture<AlHighchartSemiCircleComponent>;
  const config = { title: '', series: {}, categories: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlHighchartSemiCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlHighchartSemiCircleComponent);
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
