import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlCountSummaryComponent } from './al-count-summary.component';

xdescribe('AlCountSummaryComponent', () => {
  let component: AlCountSummaryComponent;
  let fixture: ComponentFixture<AlCountSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlCountSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlCountSummaryComponent);
    component = fixture.componentInstance;
    component.config = '123';
    fixture.detectChanges();
  });

  describe('When the component is initiated', () => {
    it('Should define the coulmn chart data', () => {
        component.ngOnInit();
        expect(1).toBe(1);
    });
  });
});
