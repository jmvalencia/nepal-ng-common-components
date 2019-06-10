/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Input, Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'al-count-summary',
    templateUrl: './al-count-summary.component.html',
    styleUrls: ['./al-count-summary.component.scss']
})
export class AlCountSummaryComponent implements OnInit, OnChanges {
    public countSummary: string;
    public themeToggle = false;
    /**
     * Count to display in widget
     */
    @Input() config = '';

    /**
     * Event to emit the selected count item
     */
    @Output() countSelected: EventEmitter<any> = new EventEmitter();

    /*
     *  Detect a change to the value
     */
    ngOnChanges(changes: SimpleChanges): void {
      this.countSummary = this.config;
    }

    /*
     *
     */
    ngOnInit() {
      this.countSummary = this.config;
    }

    onCountSelect( event ) {
        this.countSelected.emit(event);
    }

    toggleTheme() {
        this.themeToggle = !this.themeToggle;
    }
}
