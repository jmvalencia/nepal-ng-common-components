import { Component, ViewChild } from '@angular/core';
import { Carousel } from 'primeng/primeng';

@Component({
  selector: 'al-dialog-carrousel',
  templateUrl: './al-dialog-carrousel.component.html',
  styleUrls: ['./al-dialog-carrousel.component.scss'],
  providers: []
})
export class AlDialogCarrouselComponent {
  @ViewChild('carousel') carousel: Carousel;
  display: boolean = false;
  tutorialSteps: {
    title?: string,
    text?: string,
    svg?: string,
    resource?: string
    icon?: string
  }[] = [];
  width: number;
  height: number;

  constructor() {}

  public setPage(shift: number) {
    let newPage = this.carousel.page + shift;
    if (newPage >= 0 && newPage < this.carousel.totalPages) {
      this.carousel.setPage(newPage);
    }
  }

  public nextStep() { this.setPage(1); }

  public prevStep() { this.setPage(-1); }

  public showTutorial() { this.display = true; }

  public hideTutorial() { this.display = false; }
}
