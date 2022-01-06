import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoWalletConnectedComponent } from './no-wallet-connected.component';

describe('NoWalletConnectedComponent', () => {
  let component: NoWalletConnectedComponent;
  let fixture: ComponentFixture<NoWalletConnectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoWalletConnectedComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoWalletConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
