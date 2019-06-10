import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ALNavHeaderComponent } from './al-nav-header.component';

describe('ALNavHeaderComponent', () => {
  let component: ALNavHeaderComponent;
  let fixture: ComponentFixture<ALNavHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ALNavHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ALNavHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
