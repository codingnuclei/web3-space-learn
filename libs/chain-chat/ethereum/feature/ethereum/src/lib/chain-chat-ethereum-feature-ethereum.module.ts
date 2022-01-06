import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChainChatSharedPipesAddressShrinkPipeModule } from '@myWeb3/chain-chat/shared/pipes/address-shrink-pipe';
import { ChainChatSharedUiButtonModule } from '@myWeb3/chain-chat/shared/ui/button';
import { ChainChatSharedUiPanelModule } from '@myWeb3/chain-chat/shared/ui/panel';
import { ChainChatSharedUiTextInputModule } from '@myWeb3/chain-chat/shared/ui/text-input';
import { LetModule, PushModule } from '@rx-angular/template';
import { EthereumComponent } from './ethereum.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ChainChatSharedUiPanelModule,
    ChainChatSharedPipesAddressShrinkPipeModule,
    ChainChatSharedUiButtonModule,
    ChainChatSharedUiTextInputModule,
    PushModule,
    LetModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: EthereumComponent }])
  ],
  declarations: [EthereumComponent]
})
export class ChainChatEthereumFeatureEthereumModule {}
