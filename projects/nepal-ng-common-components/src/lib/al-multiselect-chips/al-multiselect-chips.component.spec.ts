/**
 * Test suite for ALMultiSelectChipsComponent
 *
 * @author Gisler Garces <ggarces@alertlogic.com>
 * @copyright 2019 Alert Logic, Inc.
 */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ALMultiSelectChipsComponent, SelectItem} from './al-multiselect-chips.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

// Required primeng dependencies
import {TooltipModule} from 'primeng/tooltip';
import {ChipsModule} from 'primeng/chips';
import {MultiSelectModule} from 'primeng/multiselect';

interface MockValue {
    id: string;
    name: string;
    details?: string;
}

describe("ALMultiSelectChipsComponent", () => {
    let component: ALMultiSelectChipsComponent<MockValue>;
    let fixture: ComponentFixture<ALMultiSelectChipsComponent<MockValue>>;
    let optionsMock: SelectItem<MockValue>[] = [];

    beforeEach(() => {
        optionsMock = [
            {
                label: "John Whick",
                value: {
                    id: "1",
                    name: "Mr. John Whick in Chip" // Specify the field for the chip.
                }
            },
            {
                label: "Steven Castro",
                value: {
                    id: "2",
                    name: "Mr. Steven Castro in Chip",
                    details: "detailsfor@stevencastro.com" // Example of item with details.
                }
            },
            {
                label: "Peter Smith",
                value: {
                    id: "3",
                    name: "Mr. Peter Smith in Chip" // Specify the field for the chip.
                }
            }];
        TestBed.configureTestingModule({
            declarations: [ALMultiSelectChipsComponent],
            imports: [
                TooltipModule,
                ChipsModule,
                MultiSelectModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent<ALMultiSelectChipsComponent<MockValue>>(ALMultiSelectChipsComponent);
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
        });

        it("should delete an item from the list", (done: DoneFn) => {
            const checked = optionsMock.filter(m => m.value.id === '1' || m.value.id === '2').map(m => m.value);
            component.onSelectedOption.subscribe((data: MockValue[]) => {
                expect(data).toEqual(checked);
                done();
            });
            component.selectOption(checked);
        });
    });
});
