import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'croco-app';
  prizeWinned: any;

  prizes = [
    { id: 'spins50', prizetype: 'text', colorPIXI: 0x99B080, color: '#99B080', text: '50 Spins'},
    { id: 'chopper', prizetype: 'icon', colorPIXI: 0xF9B572, color: '#F9B572', iconName: 'chopper'},
    { id: 'gel100', prizetype: 'text', colorPIXI: 0x3876BF, color: '#3876BF', text: '100 GEL'},
    { id: 'macbook', prizetype: 'icon', colorPIXI: 0xFF5B22, color: '#FF5B22', iconName: 'macbook'},
    { id: 'spins200', prizetype: 'text', colorPIXI: 0xB15EFF, color: '#B15EFF', text: '200 Spins'},
    { id: 'gel500', prizetype: 'text', colorPIXI: 0xA9A9A9, color: '#A9A9A9', text: '500 GEL'},
    { id: 'car', prizetype: 'icon', colorPIXI: 0xFFFB73, color: '#FFFB73', iconName: 'car'},
    { id: 'phone', prizetype: 'icon', colorPIXI: 0x3D30A2, color: '#3D30A2', iconName: 'phone'}
  ];

  public prizeWon(ev: any) {
    this.prizeWinned = this.prizes.find( prize => prize.id == ev);
    console.error(ev);
    setTimeout(() => {
      this.prizeWinned = undefined;
    }, 3000);
  }
}
