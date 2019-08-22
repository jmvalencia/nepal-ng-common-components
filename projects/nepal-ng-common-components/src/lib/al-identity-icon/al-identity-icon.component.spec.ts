import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';

import { AlIdentityIconComponent } from './al-identity-icon.component';

describe('AlIdentityIconComponent', () => {
    let component: AlIdentityIconComponent;
    let fixture: ComponentFixture<AlIdentityIconComponent>;

    const getSpan = () => {
        return fixture.debugElement.nativeElement.querySelector("span.colored-square");
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AlIdentityIconComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlIdentityIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be instantiated', () => {
        expect(component).toBeTruthy();
    });

});

