/**
 * An enhanced version of the primeng multiselect but with chips.
 *
 * @author Gisler Garces <ggarces@alertlogic.com>
 * @copyright 2019 Alert Logic, Inc.
 */
import { Input, Component, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
    selector: 'al-multiselect-chips',
    templateUrl: './al-multiselect-chips.component.html',
    styleUrls: ['./al-multiselect-chips.component.scss']
})
export class ALMultiSelectChipsComponent  {

    @Input() defaultLabel:string = 'Choose';
    @Input() field:string = 'label';
    @Input() options:SelectItem[] = [];

    @Output() onSelectedOptionsEvent:EventEmitter<any> = new EventEmitter();

    constructor(){}

    onSelectedOptions(newSelectedOptions:any) {
        this.onSelectedOptionsEvent.emit(newSelectedOptions);
    }
}
