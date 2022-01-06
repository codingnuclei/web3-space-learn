import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import { config as dotenvConfig } from 'dotenv';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import { HardhatUserConfig, task } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/types';
import { resolve } from 'path';
import 'solidity-coverage';

dotenvConfig({ path: resolve(__dirname, `./${process.env.NETWORK}.env`) });

const chainIds = {
  goerli: 5,
  hardhat: 1337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Ensure that we have all the environment variables we need.
const privateKey: string | undefined = process.env['ACCOUNT_PRIVATE_KEY'] ?? 'NO_PRIVATE_KEY';
const infuraProjectId: string | undefined = process.env['INFURA_PROJECT_ID'] ?? 'NO_INFURA_PROJECT_ID';

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url = `https://${network}.infura.io/v3/${infuraProjectId}`;
  return {
    accounts: [`0x${privateKey}`],
    chainId: chainIds[network],
    url
  };
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: '0.8.4',
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
    deploy: './scripts/deploy',
    deployments: './deployments'
  },
  networks: {
    hardhat: {
      chainId: chainIds.hardhat
    },
    localhost: {},
    ropsten: getChainConfig('ropsten')
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5'
  },
  gasReporter: {
    enabled: process.env['REPORT_GAS'] !== undefined,
    currency: 'USD'
  },
  etherscan: {
    apiKey: process.env['ETHERSCAN_API_KEY']
  }
};

export default config;
