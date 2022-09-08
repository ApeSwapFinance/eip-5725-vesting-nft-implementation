import { Network } from '../../hardhat'

export type DeploymentInputs = {
  unlockTime: number
}

const DEFAULT_UNLOCK = 100;

const deploymentInputs: Record<Network, DeploymentInputs> = {
  mainnet: {
    unlockTime: DEFAULT_UNLOCK,
  },
  ropsten: {
    unlockTime: DEFAULT_UNLOCK,
  },
  bsc: {
    unlockTime: DEFAULT_UNLOCK,
  },
  bscTestnet: {
    unlockTime: DEFAULT_UNLOCK,
  },
  polygon: {
    unlockTime: DEFAULT_UNLOCK,
  },
  polygonTestnet: {
    unlockTime: DEFAULT_UNLOCK,
  },
  hardhat: {
    unlockTime: DEFAULT_UNLOCK,
  },
}

export default deploymentInputs
