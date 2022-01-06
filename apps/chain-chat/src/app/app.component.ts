import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'web3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chain-chat';
  constructor(private router: Router) {
    setTimeout(() => {
      this.router.initialNavigation();
    });
  }
}
