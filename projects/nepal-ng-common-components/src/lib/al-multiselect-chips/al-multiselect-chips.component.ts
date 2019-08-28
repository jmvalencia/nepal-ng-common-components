/**
 * An enhanced version of the primeng multiselect but with chips.
 *
 * @author Gisler Garces <ggarces@alertlogic.com>
 * @copyright 2019 Alert Logic, Inc.
 */
import { Input, Component, Output, EventEmitter } from '@angular/core';

export interface SelectItem<T> {
  label?: string;
  value: T;
  styleClass?: string;
  icon?: string;
  title?: string;
  disabled?: boolean;
}

@Component({
    selector: 'al-multiselect-chips',
    templateUrl: './al-multiselect-chips.component.html',
    styleUrls: ['./al-multiselect-chips.component.scss']
})
export class ALMultiSelectChipsComponent<T>  {
    @Input() defaultLabel:string = 'Choose';
    @Input() field:string = 'label';
    @Input() options:SelectItem<T>[] = [];

    public selectedOptions;

    @Output() onSelectedOption:EventEmitter<T[]> = new EventEmitter();

    selectOption(newSelectedOptions:T[]) {
        this.onSelectedOption.emit(newSelectedOptions);
    }
}
