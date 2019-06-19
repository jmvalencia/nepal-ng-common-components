import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlDetailedTableListComponent } from './al-detailed-table-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TableListConfig } from 'nepal-ng-common-components/lib/types';

describe('AlDetailedTableListComponent', () => {
  let component: AlDetailedTableListComponent;
  let fixture: ComponentFixture<AlDetailedTableListComponent>;
  const mockConfig: TableListConfig = {
    headers: [],
    body: []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlDetailedTableListComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlDetailedTableListComponent);
    component = fixture.componentInstance;
    component.config = mockConfig;
    fixture.detectChanges();

  });

  describe('When the component is initiated', () => {
    it('Should build the component', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });
  });
});
