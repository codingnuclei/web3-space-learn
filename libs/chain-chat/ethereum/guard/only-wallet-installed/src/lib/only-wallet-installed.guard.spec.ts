import { TestBed } from '@angular/core/testing';

import { OnlyWalletInstalledGuard } from './only-wallet-installed.guard';

describe('OnlyWalletInstalledGuard', () => {
  let guard: OnlyWalletInstalledGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OnlyWalletInstalledGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
