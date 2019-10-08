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
import {TooltipModule} from 'primeng/tooltip';

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
  public containerWidth: number;
  public containerHeight: number;
  public containerFontSize: number;
  public numberFontSize: number;

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
      this.reflow();
    }

    /*
     *
     */
  ngOnInit() {
      this.updateCount(this.config);
      this.reflow();
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
  private reflow(): void {
      const len: number = (this.summary.count.replace(/\./, '')).length + (this.summary.suffix ? 1 : 0);
      this.containerWidth = this.containerEl.nativeElement.offsetWidth;
      this.containerHeight = this.containerEl.nativeElement.offsetHeight;
      this.containerFontSize = this.containerHeight;

      switch (len) {
        case 1:
          this.numberFontSize = this.containerHeight - 40;
          break;
        case 2:
          this.numberFontSize = this.containerHeight / 1.5;
          break;
        case 3:
          this.numberFontSize = this.containerHeight / 1.75;
          break;
        case 4:
          this.numberFontSize = this.containerHeight / 2;
          break;
        case 5:
          this.numberFontSize = this.containerHeight / 2.25;
          break;
        case 6:
          this.numberFontSize = this.containerHeight / 2.5;
          break;
      }

      if (/\./.test(this.summary.count)) {
        this.numberFontSize -= 20;
      }
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
