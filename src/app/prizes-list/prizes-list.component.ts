import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prizes-list',
  templateUrl: './prizes-list.component.html',
  styleUrls: ['./prizes-list.component.scss']
})
export class PrizesListComponent {

  public prizeList: any[] = [];
  public prizeWinned: any;

  @Input() set prizes(val: any) {
    this.prizeList = val;
    console.warn(val);
  }
  @Input() set prizeWon(val: any) {
    this.prizeWinned = val;
  }
}
