import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownModule } from 'primeng/dropdown';

import { AlDropdownFilterComponent } from './al-dropdown-filter.component';

describe('AlDashboardFilterComponent', () => {
  let component: AlDropdownFilterComponent;
  let fixture: ComponentFixture<AlDropdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DropdownModule],
      declarations: [ AlDropdownFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlDropdownFilterComponent);
    component = fixture.componentInstance;
    component.defaultWidth = '350px';
    fixture.detectChanges();
  });

  describe('When the component is initiated', () => {
    it('Should build', () => {
        component.ngOnInit();
        expect(component.defaultWidth).toBe('350px');
    });
  });

  describe('When a dashboard is toggled', () => {
    it('Should emit the selected item', () => {
        const item = 'item to emit';
        spyOn(component.toggleView, 'emit');
        component.clickEvent(item);
        expect(component.toggleView.emit).toHaveBeenCalledWith(item);
    });
  });

});
