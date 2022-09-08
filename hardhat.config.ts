import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'solidity-coverage'
import 'hardhat-docgen'

import { task, types } from 'hardhat/config'
import { TASK_TEST } from 'hardhat/builtin-tasks/task-names'
import { HardhatRuntimeEnvironment, NetworkUserConfig } from 'hardhat/types'

import { Task, Verifier, Network } from './hardhat'
import { getEnv, Logger, testRunner } from './hardhat/utils'
import solhintConfig from "./solhint.config"

/**
 * Deploy contracts based on a directory ID in tasks/
 * 
 * `npx hardhat deploy --id <task-id> --network <network-name> [--key <apiKey> --force --verbose]`
 */
task('deploy', 'Run deployment task')
  .addParam('id', 'Deployment task ID')
  .addFlag('force', 'Ignore previous deployments')
  .addOptionalParam('key', 'Etherscan API key to verify contracts')
  .setAction(
    async (
      args: { id: string; force?: boolean; key?: string; verbose?: boolean },
      hre: HardhatRuntimeEnvironment
    ) => {
      Logger.setDefaults(false, args.verbose || false)
      const key = parseApiKey(hre.network.name as Network, args.key);
      const verifier = key
        ? new Verifier(hre.network, key)
        : undefined
      await Task.fromHRE(args.id, hre, verifier).run(args)
    }
  )

/**
 * Verify contracts based on a directory ID in tasks/
 * 
 * eg: `npx hardhat verify-contract --id <task-id> --network <network-name> --name <contract-name>
 *  [--address <contract-address> --args <constructor-args --key <apiKey> --force --verbose]`
 */
task('verify-contract', 'Run verification for a given contract')
  .addParam('id', 'Deployment task ID')
  .addParam('name', 'Contract name')
  .addOptionalParam('address', 'Contract address')
  .addOptionalParam('args', 'ABI-encoded constructor arguments')
  .addOptionalParam('key', 'Etherscan API key to verify contracts')
  .setAction(
    async (
      args: {
        id: string
        name: string
        address?: string
        key?: string
        args?: string
        verbose?: boolean
      },
      hre: HardhatRuntimeEnvironment
    ) => {
      Logger.setDefaults(false, args.verbose || false)
      const key = parseApiKey(hre.network.name as Network, args.key);
      const verifier = key
        ? new Verifier(hre.network, key)
        : undefined

      await Task.fromHRE(args.id, hre, verifier).verify(
        args.name,
        args.address,
        args.args
      )
    }
  )

/**
 * Provide additional fork testing options
 * 
 * eg: `npx hardhat test --fork <network-name> --blockNumber <block-number>`
 */
task(TASK_TEST)
  .addOptionalParam(
    'fork',
    'Optional network name to be forked block number to fork in case of running fork tests.'
  )
  .addOptionalParam(
    'blockNumber',
    'Optional block number to fork in case of running fork tests.',
    undefined,
    types.int
  )
  .setAction(testRunner)

export const mainnetMnemonic = getEnv('MAINNET_MNEMONIC')
export const testnetMnemonic = getEnv('TESTNET_MNEMONIC')

const networkConfig: Record<Network, NetworkUserConfig> = {
  mainnet: {
    // TODO: Add default network url
    url: getEnv('MAINNET_RPC_URL') || '',
    chainId: 1,
    accounts: {
      mnemonic: mainnetMnemonic,
    },
  },
  ropsten: {
    // TODO: Add default network url
    url: getEnv('ROPSTEN_RPC_URL') || '',
    chainId: 3,
    accounts: {
      mnemonic: testnetMnemonic,
    },
  },
  bsc: {
    url: getEnv('BSC_RPC_URL') || 'https://bsc-dataseed1.binance.org',
    chainId: 56,
    accounts: {
      mnemonic: mainnetMnemonic,
    },
  },
  bscTestnet: {
    url:
      getEnv('BSC_TESTNET_RPC_URL') ||
      'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainId: 97,
    accounts: {
      mnemonic: testnetMnemonic,
    },
  },
  polygon: {
    url: getEnv('POLYGON_RPC_URL') || 'https://matic-mainnet.chainstacklabs.com',
    chainId: 137,
    accounts: {
      mnemonic: mainnetMnemonic,
    },
  },
  polygonTestnet: {
    url:
    getEnv('POLYGON_TESTNET_RPC_URL') || 'https://rpc-mumbai.maticvigil.com/',
    chainId: 80001,
    accounts: {
      mnemonic: testnetMnemonic,
    },
  },
  // Placeholder for the configuration below.
  hardhat: {},
}

const config: HardhatUserConfig = {
  // Storing this single source of truth in `solhint.config.js`
  solidity: solhintConfig.rules['compiler-version'][1],
  networks: {
    ...networkConfig,
    hardhat: {
      gas: 'auto',
      gasPrice: 'auto',
    },
  },
  gasReporter: {
    // More options can be found here:
    // https://www.npmjs.com/package/hardhat-gas-reporter
    enabled: getEnv('REPORT_GAS') ? true : false,
    currency: "USD",
    excludeContracts: []
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  },
  typechain: {
    // outDir: 'src/types', // defaults to './typechain-types/'
    target: 'ethers-v5',
    // externalArtifacts: [], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    dontOverrideCompile: false // defaults to false
  },
  etherscan: {
    /**
     * // NOTE This is valid in the latest version of "@nomiclabs/hardhat-etherscan.
     *  This version breaks the src/task.ts file which hasn't been refactored yet
     */
    // apiKey: {
    //   mainnet: getEnv('ETHERSCAN_API_KEY'),
    //   optimisticEthereum: getEnv('OPTIMISTIC_ETHERSCAN_API_KEY'),
    //   arbitrumOne: getEnv('ARBISCAN_API_KEY'),
    //   bsc: getEnv('BSCSCAN_API_KEY'),
    //   bscTestnet: getEnv('BSCSCAN_API_KEY'),
    //   polygon: getEnv('POLYGONSCAN_API_KEY'),
    //   polygonTestnet: getEnv('POLYGONSCAN_API_KEY'),
    // },
  },
}

const parseApiKey = (network: Network, key?: string): string | undefined => {
  return key || verificationConfig.etherscan.apiKey[network]
}

/**
 * Placeholder configuration for @nomiclabs/hardhat-etherscan to store verification API urls
 */
const verificationConfig: {etherscan: { apiKey: Record<Network, string>}} = {
  etherscan: {
    apiKey: {
      hardhat: 'NO_API_KEY',
      mainnet: getEnv('ETHERSCAN_API_KEY'),
      ropsten: getEnv('ETHERSCAN_API_KEY'),
      bsc: getEnv('BSCSCAN_API_KEY'),
      bscTestnet: getEnv('BSCSCAN_API_KEY'),
      polygon: getEnv('POLYGONSCAN_API_KEY'),
      polygonTestnet: getEnv('POLYGONSCAN_API_KEY'),
    }
  }
}

export default config
