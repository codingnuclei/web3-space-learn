import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChainChatSharedUiPanelModule } from '@myWeb3/chain-chat/shared/ui/panel';
import { NoWalletConnectedComponent } from './no-wallet-connected.component';

@NgModule({
  imports: [
    CommonModule,
    ChainChatSharedUiPanelModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: NoWalletConnectedComponent }])
  ],
  declarations: [NoWalletConnectedComponent]
})
export class ChainChatNoWalletConnectModule {}
