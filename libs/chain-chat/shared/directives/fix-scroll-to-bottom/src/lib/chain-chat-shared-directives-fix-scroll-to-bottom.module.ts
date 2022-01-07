import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixScrollToBottomDirective } from './fix-scroll-to-bottom.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [FixScrollToBottomDirective],
  exports: [FixScrollToBottomDirective]
})
export class ChainChatSharedDirectivesFixScrollToBottomModule {}
