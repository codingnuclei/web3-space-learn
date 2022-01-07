import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { CONTRACTS } from '../constants';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy(CONTRACTS['SPT'], {
    from: deployer,
    args: [10000000],
    log: true,
    skipIfAlreadyDeployed: true
  });
};

func.tags = [CONTRACTS['SPT'], 'setup', 'token'];

export default func;
