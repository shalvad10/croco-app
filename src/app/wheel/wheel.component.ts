import { AfterViewInit, Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Linear, Power3, Power4, TweenMax } from 'gsap';
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
  private appWidth: number = 600;
  private appHeight: number = 600;
  private circleRadius: number = 200;
  private wonItemSector: any;
  private sectorRadians!: number;
  private loader = PIXI.Loader.shared;
  private spinning: boolean = false;
  private sectorToLandOn!: number;
  private sectorIDSByNums = [
    { num : 0, isText: true, id: 'gel100'},
    { num : 1, isText: false, id: 'chopper'},
    { num : 2, isText: true, id: 'spins50'},
    { num : 3, isText: false, id: 'phone'},
    { num : 4, isText: false, id: 'car'},
    { num : 5, isText: true, id: 'gel500'},
    { num : 6, isText: true, id: 'spins200'},
    { num : 7, isText: false, id: 'macbook'}
  ];

  public prizeList: any[] = [];

  @Input() set prizes(val: any) {
    this.prizeList = val;
    this.sectorRadians = 2 * Math.PI / val.length;
  }

  @Input() set destination(val: any) {
    if (val !== 'random') {
      this.sectorToLandOn = this.sectorIDSByNums.find(sector => sector.id == val)!.num;
    } else {
      this.sectorToLandOn = this.getRandom(0,7);
    }
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
    this.wheel.position.set(250, 250);
    this.app.stage.addChild(this.wheel);
    this.createCircle();
    this.drawButton();
    this.gameElement.nativeElement.appendChild(this.app.view)
  }

  private drawButton() {
      this.buttonContainer = new PIXI.Sprite();
      let obj = new PIXI.Graphics();
      obj.beginFill(0xCC00FF);
      obj.drawRect(0, 0, 40, 40);
      obj.position.set(280,215);
      obj.rotation = 2.35;
      this.button = new PIXI.Graphics();
      this.button.beginFill(0xCC00FF);
      this.button.drawCircle(0, 0, 50);
      this.button.endFill();
      this.wheel.pivot.set(0, 0);
      this.button.position.set(250,250);
      this.buttonContainer.addChild(obj);
      this.buttonContainer.addChild(this.button);
      this.buttonContainer.interactive = true;
      this.buttonContainer.buttonMode = true;
      this.app.stage.addChild(this.buttonContainer);
      this.buttonContainer.on('pointertap', () => {
        this.toggleFiltertoContainer(false);
        this.prizeWon.emit(-1);
        this.spinWEheel();
      });
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
    for (let i = 0; i < this.prizeList.length; i++) { 
      this.circle = new PIXI.Graphics();  
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
        this.circle.lineStyle(3, 0x000000)
      }
    }    
  }

  private createTextSector(text: string, index: number): PIXI.Text {
    const rotation = index * this.sectorRadians;
    const textAnchorPercentage = (this.circleRadius - 150 / 2) / this.circleRadius;
    const txt = new PIXI.Text(text, {fill: '#000000'});
    txt.anchor.set(0.5, 0.5);
    txt.rotation = rotation + Math.PI;
    txt.position.x = this.circleRadius * textAnchorPercentage * Math.cos(rotation);
    txt.position.y = this.circleRadius * textAnchorPercentage * Math.sin(rotation);
    return txt;
  }

  private finalPoisition() {
  
    
    const factionOfCircle = this.sectorToLandOn / this.prizeList.length;
    const landingAngle = factionOfCircle * Math.PI * 2;
    const finalRotation = landingAngle + Math.PI;
    this.spinning = true;
    
    TweenMax.to(this.wheel, 1, {
      rotation: finalRotation,
      ease: Power3.easeInOut,
      repeat: 3,
      repeatRefresh: true,
      direction: -1,
      onComplete: () => {
        this.spinning = false;
        const selectedElement = this.sectorIDSByNums.find(sector => sector.num === this.sectorToLandOn);
        const selectedElementValue = this.prizeList.find( prize => prize.id === selectedElement?.id).text;
        const selectedElementIcon = this.prizeList.find( prize => prize.id === selectedElement?.id).iconName;
        
        for (let i = 0; i < this.wheel.children.length; i++) {
          const element: any = this.wheel.children[i];
          if (selectedElement?.isText == true && selectedElementValue !== undefined) {
            if(element.children[0].children[0]['_text'] === selectedElementValue) {
              this.wonItemSector = element;
              this.toggleFiltertoContainer(true);
            }
          } else if (selectedElement?.isText == false && selectedElementIcon !== undefined) {
            this.wonItemSector = element.getChildByName(selectedElementIcon)?.parent;
            if (this.wonItemSector) {
              this.toggleFiltertoContainer(true); 
            }
          } 
        }
        this.prizeWon.emit(selectedElement?.id);
      }
    });
  }
  
  private toggleFiltertoContainer(add: boolean) {
    const elements: any = this.wheel.children;
    if (add) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element !== this.wonItemSector) {
          const blurFilter = new PIXI.filters.BlurFilter();
          blurFilter.blur = 9;
          element.filters = [blurFilter];
        }
      }
    } else {
      for (let i = 0; i < elements.length; i++) {
        elements[i].filters = [];
        this.wonItemSector = undefined;
      }
    }
  }

  private createImgSector(img: string, index: number): PIXI.Container {
    const rotation = index * this.sectorRadians;
    const imageAnchorPrecentage = (this.circleRadius - 120 / 2) / this.circleRadius;
    const tmpSector: any = new PIXI.Container();
    tmpSector.name = img;
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
