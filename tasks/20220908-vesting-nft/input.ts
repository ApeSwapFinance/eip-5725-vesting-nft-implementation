import { Network } from '../../hardhat'

export type DeploymentInputs = {
  token0: {
    name: string,
    symbol: string,
  },
  token1: {
    name: string,
    symbol: string,
  }
}

const defaultInputs: DeploymentInputs = {
  token0: {
    name: 'LinearVestingNFT',
    symbol: 'LV-0'
  },
  token1: {
    name: 'VestingNFT',
    symbol: 'V-1'
  }
}

const deploymentInputs: Record<Network, DeploymentInputs> = {
  mainnet: defaultInputs,
  ropsten: defaultInputs,
  bsc: defaultInputs,
  bscTestnet: defaultInputs,
  polygon: defaultInputs,
  polygonTestnet: defaultInputs,
  hardhat: defaultInputs,
}

export default deploymentInputs
