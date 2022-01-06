import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { getAppConfigProvider } from '@myWeb3/chain-chat/shared/app-config';
import { ChainChatSharedUiPanelModule } from '@myWeb3/chain-chat/shared/ui/panel';
import { HotToastModule } from '@ngneat/hot-toast';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ChainChatSharedUiPanelModule, HotToastModule.forRoot()],
  providers: [getAppConfigProvider(environment)],
  bootstrap: [AppComponent]
})
export class AppModule {}
