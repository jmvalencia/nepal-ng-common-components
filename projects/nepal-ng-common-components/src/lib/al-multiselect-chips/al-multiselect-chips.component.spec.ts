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

    let optionsMock = [
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

    beforeEach(() => {
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
            spyOn(component.onSelectedOptionsEvent,'emit');
        });
        it("should delete an item from the list", () => {
            component.onSelectedOptions(optionsMock);
            expect(component.onSelectedOptionsEvent.emit).toHaveBeenCalledWith(optionsMock);
        });
    });
});
