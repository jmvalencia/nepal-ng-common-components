/*
 * Dashboard Widget Container Component
 *
 * @author Stephen Jones <stephen.jones@alertlogic.com>
 * @copyright Alert Logic, 2019
 *
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlDashboardWidgetComponent } from './al-dashboard-widget.component';
import { ButtonModule } from 'primeng/button';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AlDashboardWidgetComponent', () => {
    let component: AlDashboardWidgetComponent;
    let fixture: ComponentFixture<AlDashboardWidgetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ButtonModule],
            declarations: [AlDashboardWidgetComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlDashboardWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.config = {
          id: '1',
          title: 'Test Title',
          metrics: {
            height: 1,
            width: 1
          }
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /*
     *  Config Tests
     */
    describe('when reading in the config', () => {
        it('should set hasActions to false when no actions are passed in', () => {
            component.ngOnInit();
            expect(component.hasActions).toEqual(false);
        });

        it('should set hasActions to true when an action label is passed in', () => {
            Object.assign(component.config, {
                actions: {
                    primary: {
                      name: 'Primary',
                      action: {
                        target_app: 'foo',
                        path: 'bar'
                      }
                    }
                }
            });

            component.ngOnInit();
            expect(component.hasActions).toEqual(true);
        });
    });

    /*
     *  Action / Button click events
     */
    describe('when clicking the action buttons / links', () => {
        it('should emit the primary event when the primary button is clicked', () => {
            Object.assign(component.config, {
                actions: {
                    primary: {
                      name: 'Primary',
                      action: {
                        target_app: 'foo',
                        path: 'bar'
                      }
                    }
                }
            });

            const eventSpy = jasmine.createSpy();
            fixture.nativeElement.addEventListener('button-clicked', eventSpy);
            component.primaryClicked();
            expect(eventSpy).toHaveBeenCalled();
        });

        xit('should emit the settings event when the settings button is clicked', () => {
            Object.assign(component.config, {
                actions: {
                    settings: 'Settings'
                }
            });

            const eventSpy = jasmine.createSpy();
            fixture.nativeElement.addEventListener('button-clicked', eventSpy);
            component.settingsClicked();
            expect(eventSpy).toHaveBeenCalled();
        });

        xit('should emit the link 1 event when the link 1 link is clicked', () => {
            Object.assign(component.config, {
                actions: {
                    link1: 'Link 1'
                }
            });

            const eventSpy = jasmine.createSpy();
            fixture.nativeElement.addEventListener('button-clicked', eventSpy);
            component.link1Clicked();
            expect(eventSpy).toHaveBeenCalled();
        });

        xit('should emit the link 2 event when the link 2 link is clicked', () => {
            Object.assign(component.config, {
                actions: {
                    link2: 'Link 2'
                }
            });

            const eventSpy = jasmine.createSpy();
            fixture.nativeElement.addEventListener('button-clicked', eventSpy);
            component.link2Clicked();
            expect(eventSpy).toHaveBeenCalled();
        });
    });
});
