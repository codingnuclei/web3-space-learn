import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TextInputComponent],
  exports: [TextInputComponent]
})
export class ChainChatSharedUiTextInputModule {}
