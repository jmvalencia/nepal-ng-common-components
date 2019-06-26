import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ObjectValue, ObjectDetails } from './al-dropdown-filter.types';

@Component({
  selector: 'al-dropdown-filter',
  templateUrl: './al-dropdown-filter.component.html',
  styleUrls: ['./al-dropdown-filter.component.scss']
})

export class AlDropdownFilterComponent implements OnInit {
    public  options: any;
    public defaultWidth: string;

    /**
     * List of dashboard options
     */
    @Input() filterOptions: ObjectValue[];

    /**
     * Optional width setting
     */
    @Input() dropDownWidth: string;

    /**
     * Event to  fire dashboard object
     */
    @Output() toggleView: EventEmitter<ObjectDetails> = new EventEmitter();

    ngOnInit() {
        this.options = this.filterOptions;
        this.dropDownWidth ? this.defaultWidth = this.dropDownWidth : this.defaultWidth = '350px';
    }

    clickEvent( item ) {
        this.toggleView.emit(item);
    }
}
