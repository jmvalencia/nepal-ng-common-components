/*
 * Dashboards Controller Component
 *
 * @author Stephen Jones <stephen.jones@alertlogic.com>
 * @copyright Alert Logic, 2019
 *
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlDashboardsComponent } from './al-dashboards.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AlDashboardWidgetComponent', () => {
    let component: AlDashboardsComponent;
    let fixture: ComponentFixture<AlDashboardsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlDashboardsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlDashboardsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

