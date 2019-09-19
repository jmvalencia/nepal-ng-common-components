import { Component, OnInit, ViewChild } from '@angular/core';
import { Carousel } from 'primeng/primeng';

@Component({
  selector: 'al-tutorial',
  templateUrl: './al-tutorial.component.html',
  styleUrls: ['./al-tutorial.component.scss'],
  providers: []
})
export class AlTutorialComponent implements OnInit {
  @ViewChild('carousel') carousel: Carousel;
  display: boolean = false;
  tutorialSteps: any[] = [];

  constructor() {}

  ngOnInit() {

    this.tutorialSteps = [
      { title: 'Title 1', text: 'This is an example for a simple text that is attached to the tittle 1', resource: 'assets/images/AlertLogic-logo.svg',},
      { title: 'Title 2', text: 'This is an example for a simple text that is attached to the tittle 2', resource: 'assets/images/AlertLogic-logo.svg',},
      { title: 'Title 3', text: 'This is an example for a simple text that is attached to the tittle 3', resource: 'assets/images/AlertLogic-logo.svg',},
      { title: 'Title 4', text: 'This is an example for a simple text that is attached to the tittle 4', resource: 'assets/images/AlertLogic-logo.svg',},
    ];
  }

  setPage(shift: number) {
    let newPage = this.carousel.page + shift;
    if (newPage >= 0 && newPage < this.carousel.totalPages) {
      this.carousel.setPage(newPage);
    }
  }

  nextStep() {
    this.setPage(1);
  }

  prevStep() {
    this.setPage(-1);
  }

  showTutorial() {
    this.display = true;
  }

  hideTutorial() {
    this.display = false;
  }
}
