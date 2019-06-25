/**
 * @author Megan Castleton <megan.castleton@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import {
  Input,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef } from '@angular/core';
import { numberContract } from '../formatters';

interface Summary {
  count: string;
  origCount: string;
  suffix: string;
}

@Component({
    selector: 'al-count-summary',
    templateUrl: './al-count-summary.component.html',
    styleUrls: ['./al-count-summary.component.scss']
})

export class AlCountSummaryComponent implements OnInit, OnChanges {
    public fontSize = '100px';
    public summary: Summary = {
      count: '',
      origCount: '',
      suffix: ''
    };
    public themeToggle = false;

    @ViewChild('container') containerEl: ElementRef;


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
      this.updateCount(this.config);
      this.setFontSize();
    }

    /*
     *
     */
    ngOnInit() {
      this.updateCount(this.config);
      this.setFontSize();
    }

    onCountSelect( event ) {
        this.countSelected.emit(event);
    }

    toggleTheme() {
        this.themeToggle = !this.themeToggle;
    }

    /*
     *
     */
    private clear = () => {
      Object.assign(this.summary, {
        count: '',
        suffix: '',
        origCount: ''
      });
    }

    /*
     *
     */
    private setFontSize = (): void => {
      const len = `${this.summary.count}${this.summary.suffix}`.length;
      switch (true) {
        case len < 3:
          this.fontSize = '200px';
          break;
        case len === 3:
          this.fontSize = '180px';
          break;
        case len === 4:
          this.fontSize = '170px';
          break;
        case len === 4:
          this.fontSize = '105px';
          break;
        case len === 5:
          this.fontSize = '120px';
          break;

      }
    }

    /*
     * Update the count with the new passed in
     * If it's a string let is pass through - otherwise
     * format it.
     */
    private updateCount = (value: string): void => {
      const isNumber = /^\d+$/.test(value);
      const len: number = value.length;

      this.clear();

      if (isNumber) {
        this.summary = {...numberContract(Number(value)), origCount: value };
      } else {
        this.summary = { count: value, origCount: value, suffix: '' };
      }
    }
}
