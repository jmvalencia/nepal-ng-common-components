import { Component, OnInit, ViewChild, } from '@angular/core';
import { Carousel } from 'primeng/primeng';
import "snapsvg-cjs";
declare var Snap: any;
declare var mina: any;

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

  barsSvg: any;
  barsSVGData: any = {};
  wavesSvg: any;
  wavesSVGData: any = {};
  compassSvg: any;
  compassSVGData: any = {};
  svgChangeRate: number = 3; // In seconds
  width: number = 400;
  height: number = 200;

  constructor() {}

  ngOnInit() {

    this.tutorialSteps = [
      { title: 'Welcome!', text: 'Time to explore our all-new Dashboards, combined with improved navigation to help you take action.', svg:'waves-svg' },
      { title: 'All-new Dashboards.', text: 'Rich visuals allow to you respond directly to Threats and Exposures, SIEMlessly.', svg:'bars-svg' },
      { title: 'The path to action.', text: 'Stay on track and head in the right direction with all-new, action-centric navigation.', svg: 'compass-svg' },
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

  public showTutorial() {
    this.display = true;
    if (!this.barsSvg) { setTimeout(() => { this.snapBarsSVG(); this.animateBars(true); },0); }
    if (!this.wavesSvg) { setTimeout(() => { this.snapWavesSVG(); this.animateWaves(true); },0); }
    if (!this.compassSvg) { setTimeout(() => { this.snapCompassSVG(); this.animateCompass(true); },0); }
  }

  hideTutorial() {
    this.display = false;
  }

  createUpperBar(position) {
    return this.barsSvg.rect(
      this.barsSVGData.upperBarXBase * (position-1),
      this.barsSVGData.upperBarYBase,
      this.barsSVGData.upperBarWidht,
      this.barsSVGData.upperBarHeight
    ).attr({fill: '#BCE0FD'});
  }

  createLowerBar(position) {
    return this.barsSvg.rect(
      this.barsSVGData.lowerBarXBase * (position-1),
      this.barsSVGData.lowerBarYBase,
      this.barsSVGData.lowerBarWidht,
      this.barsSVGData.lowerBarHeight
    ).attr({fill: '#2699FB'});
  }

  snapBarsSVG(retries:number = 10) {
    this.barsSvg = Snap("#bars-svg");
    if (!this.barsSvg) { setTimeout(() => { this.snapBarsSVG(retries-1); this.animateBars(true); },100); }
    if (retries === 0) { return null; } // Impossible to render

    this.barsSVGData.upperBarXBase = (this.width/12)|1;
    this.barsSVGData.upperBarYBase = 0;
    this.barsSVGData.upperBarWidht = this.barsSVGData.upperBarXBase-10;
    this.barsSVGData.upperBarHeight = this.height;

    this.barsSVGData.upperBar1 = this.createUpperBar(1);
    this.barsSVGData.upperBar2 = this.createUpperBar(2);
    this.barsSVGData.upperBar3 = this.createUpperBar(3);
    this.barsSVGData.upperBar4 = this.createUpperBar(4);
    this.barsSVGData.upperBar5 = this.createUpperBar(5);
    this.barsSVGData.upperBar6 = this.createUpperBar(6);
    this.barsSVGData.upperBar7 = this.createUpperBar(7);
    this.barsSVGData.upperBar8 = this.createUpperBar(8);
    this.barsSVGData.upperBar9 = this.createUpperBar(9);
    this.barsSVGData.upperBar10  = this.createUpperBar(10);
    this.barsSVGData.upperBar11  = this.createUpperBar(11);
    this.barsSVGData.upperBar12  = this.createUpperBar(12);

    this.barsSVGData.lowerBarXBase = (this.width/12)|1;
    this.barsSVGData.lowerBarYBase = 0;
    this.barsSVGData.lowerBarWidht = this.barsSVGData.lowerBarXBase-10;
    this.barsSVGData.lowerBarHeight = this.height;

    this.barsSVGData.lowerBar1 = this.createLowerBar(1);
    this.barsSVGData.lowerBar2 = this.createLowerBar(2);
    this.barsSVGData.lowerBar3 = this.createLowerBar(3);
    this.barsSVGData.lowerBar4 = this.createLowerBar(4);
    this.barsSVGData.lowerBar5 = this.createLowerBar(5);
    this.barsSVGData.lowerBar6 = this.createLowerBar(6);
    this.barsSVGData.lowerBar7 = this.createLowerBar(7);
    this.barsSVGData.lowerBar8 = this.createLowerBar(8);
    this.barsSVGData.lowerBar9 = this.createLowerBar(9);
    this.barsSVGData.lowerBar10 = this.createLowerBar(10);
    this.barsSVGData.lowerBar11 = this.createLowerBar(11);
    this.barsSVGData.lowerBar12 = this.createLowerBar(12);

    this.barsSVGData.upperBars = [
      this.barsSVGData.upperBar1,
      this.barsSVGData.upperBar2,
      this.barsSVGData.upperBar3,
      this.barsSVGData.upperBar4,
      this.barsSVGData.upperBar5,
      this.barsSVGData.upperBar6,
      this.barsSVGData.upperBar7,
      this.barsSVGData.upperBar8,
      this.barsSVGData.upperBar9,
      this.barsSVGData.upperBar10,
      this.barsSVGData.upperBar11,
      this.barsSVGData.upperBar12
    ];

    this.barsSVGData.lowerBars = [
      this.barsSVGData.lowerBar1,
      this.barsSVGData.lowerBar2,
      this.barsSVGData.lowerBar3,
      this.barsSVGData.lowerBar4,
      this.barsSVGData.lowerBar5,
      this.barsSVGData.lowerBar6,
      this.barsSVGData.lowerBar7,
      this.barsSVGData.lowerBar8,
      this.barsSVGData.lowerBar9,
      this.barsSVGData.lowerBar10,
      this.barsSVGData.lowerBar11,
      this.barsSVGData.lowerBar12
    ];
  }

  animateBars(loop: boolean = false) {
    for (let index = 0; index < this.barsSVGData.lowerBars.length; index++) {
      const inOutEffectTime = 550;
      const random1 = Math.random()*this.height|1;
      const random2 = (this.height-random1)*Math.random()|1;
      const lowerBarY = this.barsSVGData.lowerBarYBase+this.barsSVGData.lowerBarHeight-random1;
      const upperBarY = this.barsSVGData.upperBarYBase+this.barsSVGData.upperBarHeight-random1-random2;
      this.barsSVGData.lowerBars[index].animate({height:random1, y: lowerBarY}, inOutEffectTime, mina.easeinout);
      this.barsSVGData.upperBars[index].animate({height:random2, y: upperBarY}, inOutEffectTime, mina.easeinout);
    }
    if (loop && this.display) {
      setTimeout(() => { this.animateBars(loop); }, this.svgChangeRate * 1000);
    }
  }

  getPointFromPrevPoint(prevPoint = {x:0, y:0}) {
    return {
      x: (prevPoint.x + this.wavesSVGData.minShiftX + (this.wavesSVGData.maxShiftX-this.wavesSVGData.minShiftX) * Math.random())|1,
      y: this.wavesSVGData.borderY * this.height + (Math.random() * this.height * (1 - (this.wavesSVGData.borderY * 2)))|1
    };
  }

  getFinalPath() {
    const path = this.wavesSVGData.points.reduce((partialPath, point, index, points) => {
      const curve = this.bezierfy(point, index, points);
      partialPath += "C " + curve.x1 + "," + curve.y1 + " " + curve.x2 + "," + curve.y2 + " " + curve.x + "," + curve.y + " ";
      return partialPath;
    }, '');
    return path;
  }

  getLineBetweenPoints(p1 = {x:0,y:0}, p2 = {x:0,y:0}) {
    const dx = p2.x - p1.x;
    const dy = Math.abs(p2.y - p1.y);
    return {
      length: Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
      angle: Math.atan2(dy, dx)
    };
  }

  getControlPoint(current = {x:0, y:this.height}, previous = null, next = null, reverse = false) {
    const opposedLine = this.getLineBetweenPoints(previous || current, next || current);
    const angle = opposedLine.angle + (reverse ? Math.PI : 0);
    const length = opposedLine.length * 0.2;
    return {
      x: current.x + Math.cos(angle) * length,
      y: current.y + Math.sin(angle) * length
    };
  }

  bezierfy(point, index, pointsArray) {
    const controlPointStart = this.getControlPoint(pointsArray[index - 1], pointsArray[index - 2], point);
    const controlPointEnd = this.getControlPoint(point, pointsArray[index - 1], pointsArray[index + 1], true);
    return {
      x1: controlPointStart.x, y1: controlPointStart.y,
      x2: controlPointEnd.x,   y2: controlPointEnd.y,
      x: point.x, y: point.y
    };
  }

  getCurvesPath() {
    const initialY = Math.random() * this.height|1;
    this.wavesSVGData.points = [];
    this.wavesSVGData.points.push(this.getPointFromPrevPoint({x:0, y:initialY}));
    while(this.wavesSVGData.points[this.wavesSVGData.points.length-1].x <= this.width) {
      const prevPoint = this.wavesSVGData.points[this.wavesSVGData.points.length-1];
      this.wavesSVGData.points.push(this.getPointFromPrevPoint({x: prevPoint.x, y: prevPoint.y}));
    }
    this.wavesSVGData.points[this.wavesSVGData.points.length-1].x = this.width;
    const curvesPath = this.getFinalPath();
    const finalPath =  "M0," + this.height + " V" + initialY + " " + curvesPath + " " + "V" + this.height;
    return finalPath;
  }

  createWave() {
    this.wavesSVGData.minShiftX = this.width * 0.35;
    this.wavesSVGData.maxShiftX = this.width * 0.45;
    this.wavesSVGData.borderY = 0.08;
    const gradient = this.wavesSvg.gradient("l(0, 1, 0, 0)#2699FB-#FFFFFF");
    return this.wavesSvg.path(this.getCurvesPath()).attr(
      {fill: gradient, stroke: "#2699FB", strokeWidth: "0", fillOpacity: 0.5}
    );
  }

  snapWavesSVG(retries:number = 10) {
    this.wavesSvg = Snap("#waves-svg");
    if (!this.wavesSvg) { setTimeout(() => { this.snapWavesSVG(retries-1); this.animateWaves(true); },100); }
    if (retries === 0) { return null; } // Impossible to render
    this.wavesSVGData.waves = [];
    for (let i = 0; i < 3; i++) this.wavesSVGData.waves.push(this.createWave());
  }

  animateWaves(loop: boolean = false) {
    for (let i = 0; i < this.wavesSVGData.waves.length; i++) {
      this.wavesSVGData.waves[i].animate({d: this.getCurvesPath()}, 550, mina.easeinout);
    }
    if (loop && this.display) {
      setTimeout(() => { this.animateWaves(loop); }, this.svgChangeRate * 1000);
    }
  }

  snapCompassSVG(retries:number = 10) {
    this.compassSvg = Snap("#compass-svg");
    if (!this.compassSvg) { setTimeout(() => { this.snapCompassSVG(retries-1); this.animateCompass(true); },100); }
    if (retries === 0) { return null; } // Impossible to render
    this.compassSVGData.compass = this.compassSvg.path(
      "M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1z" +
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" +
      "m2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"
    ).attr(
      {transform: 'scale(10,10); translate(7.5,-2)'}
    );
  }

  animateCompass(loop: boolean = false) {
    // this.compassSVGData.compass.animate({ transform: "r60," + '200' + ',' + '100'}, 1000);
    // if (loop && this.display) {
    //   setTimeout(() => { this.animateCompass(loop); }, this.svgChangeRate * 1000);
    // }
  }
}
