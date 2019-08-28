/**
 * Test suite for ALMultiSelectChipsComponent
 *
 * @author Gisler Garces <ggarces@alertlogic.com>
 * @copyright 2019 Alert Logic, Inc.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ALMultiSelectChipsComponent } from './al-multiselect-chips.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Required primeng dependencies
import { TooltipModule } from 'primeng/tooltip';
import { ChipsModule } from 'primeng/chips';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectItem } from 'primeng/api';

describe("ALMultiSelectChipsComponent", () => {
    let component: ALMultiSelectChipsComponent;
    let fixture: ComponentFixture<ALMultiSelectChipsComponent>;

    let optionsMock = [];

    beforeEach(() => {
        optionsMock = [
            <SelectItem> {
              label: "John Whick",
              value: {
                  id: "1",
                  name: "Mr. John Whick in Chip" // Specify the field for the chip.
              }
            },
            <SelectItem> {
              label: "Steven Castro",
              value: {
                  id: "2",
                  name: "Mr. Steven Castro in Chip",
                  details: "detailsfor@stevencastro.com" // Example of item with details.
              }
            },
            <SelectItem> {
              label: "Peter Smith",
              value: {
                  id: "3",
                  name: "Mr. Peter Smith in Chip" // Specify the field for the chip.
              }
            }
        ];

        TestBed.configureTestingModule({
            declarations: [ ALMultiSelectChipsComponent ],
            imports: [
                TooltipModule,
                ChipsModule,
                MultiSelectModule
            ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
          }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ALMultiSelectChipsComponent);
        component = fixture.componentInstance;
    });

    describe("When the component is initiated", () => {
        beforeEach(() => {
            component.options = optionsMock;
        });
        it("should set Choose as the default value for the label", () => {
            expect(component.defaultLabel).toBe('Choose');
        });
        it("should set label as the default for the field to take label drom SelectItem", () => {
            expect(component.field).toBe('label');
        });
    });

    describe("When any change in selection is done should emit the new selected values", () => {
        beforeEach(() => {
            component.options = optionsMock;
            spyOn(component.onSelectedOption,'emit');
        });
        it("should emit the new selected values", () => {
            component.selectOption(optionsMock);
            expect(component.onSelectedOption.emit).toHaveBeenCalledWith(optionsMock);
        });
    });
});
