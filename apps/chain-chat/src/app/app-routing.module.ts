import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyWalletInstalledGuard } from '@myWeb3/chain-chat/ethereum/guard/only-wallet-installed';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ethereum' },
  {
    path: 'ethereum',
    canActivate: [OnlyWalletInstalledGuard],
    loadChildren: async () =>
      (await import('@myWeb3/chain-chat/ethereum/feature/ethereum')).ChainChatEthereumFeatureEthereumModule
  },
  {
    path: 'wallet-required',
    loadChildren: async () => (await import('@myWeb3/chain-chat/no-wallet-connect')).ChainChatNoWalletConnectModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'disabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
