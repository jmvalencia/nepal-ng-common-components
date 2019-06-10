/*
 * Highcharts Activity Gauge Component
 *
 * @author stephen.jones <stephen.jones@alertlogic.com>
 * @copyright Alert Logic 2019
 *
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlHighchartsActivityGaugeComponent } from './al-highchart-activity-gauge.component';


describe('AlHighchartsActivityGaugeComponent', () => {
    let component: AlHighchartsActivityGaugeComponent;
    let fixture: ComponentFixture<AlHighchartsActivityGaugeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlHighchartsActivityGaugeComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlHighchartsActivityGaugeComponent);
        component = fixture.componentInstance;
        component.config = {
            value: 50,
            text1: '',
            text2: ''
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
