import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ALSideNavComponent } from './al-sidenav.component';

describe('ALSideNavComponent', () => {
  let component: ALSideNavComponent;
  let fixture: ComponentFixture<ALSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ALSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ALSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
