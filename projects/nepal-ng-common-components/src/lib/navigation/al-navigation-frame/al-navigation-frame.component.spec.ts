import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlNavigationFrameComponent } from './al-navigation-frame.component';
import { AlNavigationService } from '../services';

const stubNavigationService = {
    events: {
        attach: () => { return "fake"; }
    }
};

xdescribe('AlNavigationFrameComponent', () => {
  let component: AlNavigationFrameComponent;
  let fixture: ComponentFixture<AlNavigationFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlNavigationFrameComponent ],
      providers: [ { provide: AlNavigationService, useValue: stubNavigationService } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlNavigationFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
