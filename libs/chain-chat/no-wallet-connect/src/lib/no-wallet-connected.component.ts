import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'myWeb3-no-wallet-connected',
  templateUrl: './no-wallet-connected.component.html',
  styleUrls: ['./no-wallet-connected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoWalletConnectedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
