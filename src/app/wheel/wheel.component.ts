import { AfterViewInit, Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Linear, TweenLite, TweenMax } from 'gsap';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements AfterViewInit {

  private app!: PIXI.Application;
  private circle!: PIXI.Graphics;
  private wheel!: PIXI.Container;
  private buttonContainer!: any;
  private button!: PIXI.Graphics;
  private appWidth: number = 500;
  private appHeight: number = 500;
  private imgWidth: number = 100;
  private imgHeight: number = 100;
  private circleRadius: number = 200;
  private sectorRadians!: number;
  private animation: any;
  private loader = PIXI.Loader.shared;
  private spinning: boolean = false;

  public prizeList: any[] = [];

  @Input() set prizes(val: any) {
    this.prizeList = val;
    this.sectorRadians = 2 * Math.PI / val.length;
    console.warn(val);
  }

  @Output() prizeWon: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('game') private gameElement!: ElementRef; 

  constructor() {
    this.loader.add('car',      './assets/images/car.png')
                .add('phone',   './assets/images/phone.png')
                .add('macbook', './assets/images/macbook.png')
                .add('chopper', './assets/images/chopper.png');
  }

  private getRandom(min:number, max:number) {
    let rnd = Math.floor(Math.random() * (max - min) + min);
    return rnd;
  }

  ngAfterViewInit(): void {
    this.app = new PIXI.Application({width: this.appWidth, height: this.appHeight, backgroundAlpha: 0});
    this.wheel = new PIXI.Container();
    this.wheel.pivot.set(0, 0);
    this.wheel.position.set(200, 200);
    this.app.stage.addChild(this.wheel);
    this.createCircle();
    this.drawButton();
    this.gameElement.nativeElement.appendChild(this.app.view)
  }

  private drawButton() {
      this.buttonContainer = new PIXI.Sprite();
      this.button = new PIXI.Graphics();
      this.button.beginFill(0xCC00FF);
      this.button.drawCircle(0, 0, 50);
      this.button.endFill();
      this.wheel.pivot.set(0, 0);
      this.button.position.set(200,200);
      this.buttonContainer.addChild(this.button);
      this.buttonContainer.interactive = true;
      this.buttonContainer.buttonMode = true;
      this.app.stage.addChild(this.buttonContainer);
      this.buttonContainer.on('pointertap', () => { this.spinWEheel(); });
      const txt = new PIXI.Text('SPIN', {fill: '#000000'});
      txt.anchor.set(0.5,0.5);
      txt.position.set(0,0);
      this.button.addChild(txt);
  }

  private spinWEheel() {
    if (this.spinning) return;
    this.finalPoisition();
  }

  private createCircle() {
    this.circle = new PIXI.Graphics();    
    for (let i = 0; i < this.prizeList.length; i++) { 
      let color = this.prizeList[i].colorPIXI;
      this.circle.beginFill(color);
      this.circle.lineStyle(1, 0xffffff, 1);
      const startingAngle = i * this.sectorRadians - this.sectorRadians / 2;
      const endingAngle = startingAngle + this.sectorRadians;
      this.circle.moveTo(0, 0);
      this.circle.arc(0, 0, this.circleRadius, startingAngle, endingAngle);
      this.circle.lineTo(0, 0);
      this.wheel.addChild(this.circle);
      if (this.prizeList[i].prizetype == 'text') {
        const textContainer = new PIXI.Container();
        this.circle.addChild(textContainer);
        textContainer.addChild(this.createTextSector(this.prizeList[i].text,i));
      } else {
        this.circle.addChild(this.createImgSector(this.prizeList[i].iconName,i));
      }
    }    
  }

  private createTextSector(text: string, index: number): PIXI.Text {
    const rotation = index * this.sectorRadians;
    const textAnchorPercentage = (this.circleRadius - 150 / 2) / this.circleRadius;
    const txt = new PIXI.Text(text + index, {fill: '#000000'});
    txt.anchor.set(0.5, 0.5);
    txt.rotation = rotation + Math.PI;
    txt.position.x = this.circleRadius * textAnchorPercentage * Math.cos(rotation);
    txt.position.y = this.circleRadius * textAnchorPercentage * Math.sin(rotation);
    return txt;
  }

  private finalPoisition() {
    
    const sectorToLandOn = this.getRandom(0,7);
    const sectorIDSByNums = [
      { num : 0, id: 'gel100'},
      { num : 1, id: 'chopper'},
      { num : 2, id: 'spins50'},
      { num : 3, id: 'phone'},
      { num : 4, id: 'car'},
      { num : 5, id: 'gel500'},
      { num : 6, id: 'spins200'},
      { num : 7, id: 'macbook'}
    ];
  
    
    const factionOfCircle = sectorToLandOn / this.prizeList.length;
    const landingAngle = factionOfCircle * Math.PI * 2;
    const finalRotation = landingAngle + Math.PI;
    this.spinning = true;
    
    TweenMax.to(this.wheel, 1, {
      rotation: finalRotation,
      ease: Linear.easeNone,
      repeat: 3,
      repeatRefresh: true,
      direction: -1,
      onComplete: () => {
        this.spinning = false;
        this.prizeWon.emit(sectorIDSByNums.find(sector => sector.num === sectorToLandOn)?.id);
      }
    });
  }

  private createImgSector(img: string, index: number): PIXI.Container {
    const rotation = index * this.sectorRadians;
    const imageAnchorPrecentage = (this.circleRadius - 120 / 2) / this.circleRadius;
    const tmpSector = new PIXI.Container();
    const image = new PIXI.Sprite(PIXI.Texture.from(`./assets/images/${img}.png`));
    image.scale.set(0.7);
    image.anchor.set(0.5, 0.5);
    image.rotation = rotation + Math.PI;
    image.position.x = this.circleRadius * imageAnchorPrecentage * Math.cos(rotation);
    image.position.y = this.circleRadius * imageAnchorPrecentage * Math.sin(rotation);
    tmpSector.addChild(image);
    
    return tmpSector;
  }



}
