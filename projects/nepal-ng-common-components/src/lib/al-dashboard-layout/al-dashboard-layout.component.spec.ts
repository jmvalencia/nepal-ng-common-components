/*
 * Dashboard Layout Component
 *
 * @author stephen.jones <stephen.jones@alertlogic.com>
 * @copyright Alert Logic 2019
 *
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlDashboardLayoutComponent } from './al-dashboard-layout.component';

describe('AlHighchartsActivityGaugeComponent', () => {
    let component: AlDashboardLayoutComponent;
    let fixture: ComponentFixture<AlDashboardLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlDashboardLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlDashboardLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
