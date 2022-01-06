import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressShrinkPipe } from './address-shrink.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [AddressShrinkPipe],
  exports: [AddressShrinkPipe]
})
export class ChainChatSharedPipesAddressShrinkPipeModule {}
