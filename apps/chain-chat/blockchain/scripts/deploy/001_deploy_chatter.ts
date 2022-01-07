import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { CONTRACTS } from '../constants';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const sptDeployment = await deployments.get(CONTRACTS.SPT);

  await deploy(CONTRACTS['chatter'], {
    from: deployer,
    args: ['Welcome to chatter.', sptDeployment.address, deployer],
    log: true,
    skipIfAlreadyDeployed: true
  });
};

func.tags = [CONTRACTS['chatter'], 'setup', 'core'];

export default func;
