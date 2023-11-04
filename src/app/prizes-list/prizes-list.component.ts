import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prizes-list',
  templateUrl: './prizes-list.component.html',
  styleUrls: ['./prizes-list.component.scss'],
  animations: [
    trigger('testAnimation', [
      state('start', style({ backgroundColor: '{{backColor}}', opacity: 1, color: '#ffffff' }), {params: {backColor: 'transparent'}}),
      state('end',   style({ backgroundColor: 'transparent', opacity: 0.3, color: '#000000' })),
      transition('start => end', animate('300ms ease-in-out')),
      transition('end => start', animate('300ms ease-in-out')),
    ]),
  ],
})
export class PrizesListComponent {

  public prizeList: any[] = [];
  public prizeWinned: any;
  public animationState = 'end';

  @Input() set prizes(val: any) {
    this.prizeList = val;
  }
  @Input() set prizeWon(val: any) {
    if (val == undefined) {
      this.animationState = 'end';
    }

    this.prizeWinned = val;
    let counter = 0;
    const interval = setInterval(() => {
      this.toggleAnimation();
      if ( counter == 7) {
        clearInterval(interval); this.animationState = 'start';
      }
      counter++;
    }, 300);
  }

  toggleAnimation() {
    this.animationState == 'start' ? this.animationState = 'end' : this.animationState = 'start';
  }

}
