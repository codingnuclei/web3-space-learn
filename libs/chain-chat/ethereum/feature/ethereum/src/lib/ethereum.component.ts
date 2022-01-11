import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Chatter__factory, SpaceChatERC20Token__factory } from '@myWeb3/chain-chat/blockchain/types';
import { AppConfig, APP_CONFIG } from '@myWeb3/chain-chat/shared/app-config';
import { HotToastService } from '@ngneat/hot-toast';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { filter, from, fromEvent, map, merge, ReplaySubject, share, Subject, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'myWeb3-ethereum',
  templateUrl: './ethereum.component.html',
  styleUrls: ['./ethereum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EthereumComponent implements OnInit {
  message = new FormControl('');

  chatterAddress = this.appConfig.CHATTER_CONTRACT_ADDRESS;
  tokenAddress = this.appConfig.SPACE_TOKEN_ADDRESS;
  expectedChainId = this.appConfig.EXPECTED_CHAIN_ID;

  provider = ethers.providers.getDefaultProvider(this.appConfig.DEFAULT_PROVIDER_URL, {
    projectId: this.appConfig.INFURA_PROJECT_ID
  });

  // can use IFrameEthereumProvider web3Modal to get wallet provider
  walletProvider = (this.document.defaultView as any).ethereum;
  connectedProvider = new ethers.providers.Web3Provider(this.walletProvider, 'any');

  initialAccount$ = from(
    this.walletProvider.request({
      method: 'eth_accounts'
    })
  ).pipe(
    filter((accounts: any) => accounts?.length > 0),
    map((accounts: any) => accounts[0])
  );

  accountChanges$ = fromEvent<string[]>(this.walletProvider, 'accountsChanged').pipe(map(accounts => accounts[0]));
  onActionConnectAccount$ = new ReplaySubject(1);

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

  manualFetchTokenBalance$ = new Subject();
  manualFetchRemainingAllowance$ = new Subject();

  accountBalance$ = this.addressInContext$.pipe(switchMap((address: string) => this.requestAccountBalance(address)));
  tokenBalance$ = merge(this.addressInContext$, this.manualFetchTokenBalance$).pipe(
    switchMap((address: string) => this.fetchTokenBalance(address))
  );

  remainingAllowance$ = merge(this.addressInContext$, this.manualFetchRemainingAllowance$).pipe(
    switchMap((address: string) => this.getAllowance(address)),
    share({
      connector: () => new ReplaySubject(1),
      resetOnComplete: false,
      resetOnError: false,
      resetOnRefCountZero: true
    })
  );

  chainId$ = from(this.requestChainId()).pipe(
    tap(chainId => {
      if (chainId !== this.expectedChainId) {
        this.toast.error('Wrong network selected');
      }
    })
  );

  chatMessages$ = new ReplaySubject<{ addr: string; message: string }[]>(1);

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

  async getAllowance(address: string) {
    const token = SpaceChatERC20Token__factory.connect(this.tokenAddress, this.provider);
    const allowance = await token.allowance(address, this.appConfig.CHATTER_CONTRACT_ADDRESS);
    return ethers.utils.formatEther(allowance);
  }

  async fetchTokenBalance(address: string) {
    const token = SpaceChatERC20Token__factory.connect(this.tokenAddress, this.provider);
    const balance = await token.balanceOf(address);
    return ethers.utils.formatEther(balance);
  }

  async addToken() {
    await this.walletProvider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: this.tokenAddress,
          symbol: 'SPT',
          decimals: 18,
          image: 'https://cdn.svgapi.com/vector/92139/space-ship.svg'
        }
      }
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

    return from(contract.allMessages());
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

  async approve() {
    const token = SpaceChatERC20Token__factory.connect(this.tokenAddress, this.connectedProvider.getSigner());
    const signer = this.connectedProvider.getSigner();
    const signerAddress = await signer.getAddress();

    const transaction = await token.approve(
      this.appConfig.CHATTER_CONTRACT_ADDRESS,
      ethers.utils.parseUnits('2000000000', 'gwei').toString()
    );
    from(transaction.wait())
      .pipe(
        this.toast.observe({
          loading: { content: 'Approving...', duration: 3000000 },
          success: { content: 'Approve Success', duration: 3000 },
          error: 'Could not approve.'
        })
        // switchMap(() => this.fetchTokenBalance().pipe(take(1)))
      )
      .subscribe({
        next: x => {
          this.manualFetchRemainingAllowance$.next(signerAddress);
        }
      });
  }

  async transfer(to: string) {
    const token = SpaceChatERC20Token__factory.connect(this.tokenAddress, this.connectedProvider.getSigner());
    const decimals = await token.decimals();
    const volume = parseUnits('100', decimals);
    const transaction = await token.transfer(to, volume);
    from(transaction.wait())
      .pipe(
        this.toast.observe({
          loading: { content: 'Transferring...', duration: 3000000 },
          success: { content: 'Transfer Success', duration: 3000 },
          error: 'Could not transfer.'
        })
        // switchMap(() => this.fetchTokenBalance().pipe(take(1)))
      )
      .subscribe({
        next: () => this.document.defaultView?.location.reload()
      });
  }

  async addMessage() {
    if (!this.message.value) {
      return;
    }
    const signer = this.connectedProvider.getSigner();
    const signerAddress = await signer.getAddress();
    const contract = Chatter__factory.connect(this.chatterAddress, signer);

    const transaction = await contract.addMessage(this.message.value);
    this.message.reset();
    from(transaction.wait())
      .pipe(
        this.toast.observe({
          loading: { content: 'Posting...Balances might be inaccurate till complete', duration: 3000000 },
          success: { content: 'Message posted', duration: 3000 },
          error: 'Could not post.'
        }),
        switchMap(() => this.fetchChatMessages().pipe(take(1)))
      )
      .subscribe({
        next: messages => {
          this.chatMessages$.next(messages);
          this.manualFetchTokenBalance$.next(signerAddress);
          this.manualFetchRemainingAllowance$.next(signerAddress);
        }
      });
  }
}
