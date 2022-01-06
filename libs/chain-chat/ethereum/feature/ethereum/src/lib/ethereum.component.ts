import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppConfig, APP_CONFIG } from '@myWeb3/chain-chat/shared/app-config';
import { Chatter__factory } from '@myWeb3/chain-chat/typechain';
import { HotToastService } from '@ngneat/hot-toast';
import { ethers } from 'ethers';
import { filter, from, fromEvent, map, merge, ReplaySubject, share, Subject, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'myWeb3-ethereum',
  templateUrl: './ethereum.component.html',
  styleUrls: ['./ethereum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EthereumComponent implements OnInit {
  @ViewChild('chatHistory') chatHistory!: ElementRef;

  message = new FormControl('');

  chatterAddress = this.appConfig.CHATTER_CONTRACT_ADDRESS;
  expectedChainId = this.appConfig.EXPECTED_CHAIN_ID;

  provider = ethers.providers.getDefaultProvider(this.appConfig.DEFAULT_PROVIDER_URL, {
    projectId: this.appConfig.INFURA_PROJECT_ID
  });

  // can use IFrameEthereumProvider web3Modal to get wallet provider
  walletProvider = (this.document.defaultView as any).ethereum;
  connectedProvider = new ethers.providers.Web3Provider(this.walletProvider, 'any');

  onActionConnectAccount$ = new ReplaySubject(1);

  initialAccount$ = from(
    this.walletProvider.request({
      method: 'eth_accounts'
    })
  ).pipe(
    filter((accounts: any) => accounts?.length > 0),
    map((accounts: any) => accounts[0])
  );

  accountChanges$ = fromEvent<string[]>(this.walletProvider, 'accountsChanged').pipe(map(accounts => accounts[0]));

  addressInContext$ = merge(this.initialAccount$, this.accountChanges$, this.onActionConnectAccount$).pipe(
    tap(newAccount => {
      if (!newAccount) {
        setTimeout(() => this.document.defaultView?.location.reload(), 0);
      }
    }),
    share({
      connector: () => new ReplaySubject(1),
      resetOnComplete: false,
      resetOnError: false,
      resetOnRefCountZero: true
    })
  );

  accountBalance$ = this.addressInContext$.pipe(switchMap((address: string) => this.requestAccountBalance(address)));

  chainId$ = from(this.requestChainId()).pipe(
    tap(chainId => {
      if (chainId !== this.expectedChainId) {
        this.toast.error('Wrong network selected');
      }
    })
  );

  chatMessages$ = new Subject<{ addr: string; message: string }[]>();

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(DOCUMENT) private document: Document,
    private toast: HotToastService
  ) {
    this.walletProvider.on('chainChanged', (chainId: string) => {
      console.log(chainId);
      this.document.defaultView?.location.reload();
    });

    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    this.connectedProvider.on('network', (newNetwork: string, oldNetwork: string) => {
      if (oldNetwork) {
        this.document.defaultView?.location.reload();
      }
    });
  }

  ngOnInit() {
    this.fetchChatMessages().subscribe({
      next: messages => this.chatMessages$.next(messages)
    });
  }

  async connect() {
    const accounts = await this.walletProvider.request({
      method: 'eth_requestAccounts'
    });
    this.onActionConnectAccount$.next(accounts[0]);
  }

  fetchChatMessages() {
    const contract = Chatter__factory.connect(this.chatterAddress, this.provider);

    return from(contract.allMessages()).pipe(
      tap(() => {
        setTimeout(() => {
          const xH = this.chatHistory.nativeElement.scrollHeight;
          this.chatHistory.nativeElement.scrollTo(0, xH);
        }, 0);
      })
    );
  }

  async requestAccountBalance(address: string) {
    return await this.provider.getBalance(address).then(bigNumber => ethers.utils.formatEther(bigNumber));
  }

  async requestChainId() {
    return await this.walletProvider.request({
      method: 'eth_chainId'
    });
  }

  switchNetwork() {
    this.walletProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x3'
        }
      ]
    });
  }

  async addMessage() {
    if (!this.message.value) {
      return;
    }
    const signer = this.connectedProvider.getSigner();
    const contract = Chatter__factory.connect(this.chatterAddress, signer);

    const transaction = await contract.addMessage(this.message.value);
    this.message.reset();
    from(transaction.wait())
      .pipe(
        this.toast.observe({
          loading: 'Saving...',
          success: 'Message saved!',
          error: 'Could not save.'
        }),
        switchMap(() => this.fetchChatMessages().pipe(take(1)))
      )
      .subscribe({
        next: messages => this.chatMessages$.next(messages)
      });
  }
}
