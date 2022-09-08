import { Network } from '../../hardhat'

export type DeploymentInputs = {
  admin: string
}

const deploymentInputs: Record<Network, DeploymentInputs> = {
  mainnet: {
    admin: '0x',
  },
  ropsten: {
    admin: '0x',
  },
  bsc: {
    admin: '0x',
  },
  bscTestnet: {
    admin: '0x',
  },
  polygon: {
    admin: '0x',
  },
  polygonTestnet: {
    admin: '0x',
  },
  hardhat: {
    admin: '0x',
  },
}

export default deploymentInputs
