import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'myWeb3-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInputComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
