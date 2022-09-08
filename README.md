# Hardhat Template - _by [DeFiFoFum](https://github.com/defifofum)_ <img src="https://avatars.githubusercontent.com/u/78645267?v=4" alt="DeFiFoFum Avatar" width="25px"> 
<!-- 
  FIXME: Update `DeFiFoFum/hardhat-template` based on current repo 
  1. Find All (CMD/CTRL + SHIFT + F)
  2. Search for: DeFiFoFum/hardhat-template
  3. Replace with <user>/<your-repo>
  -->
[![lint & test](https://github.com/DeFiFoFum/hardhat-template/actions/workflows/lint-test.yml/badge.svg)](https://github.com/DeFiFoFum/hardhat-template/actions/workflows/lint-test.yml)
[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-yellow)](./docs/)
[![License](https://img.shields.io/badge/License-GPLv3-green.svg)](https://www.gnu.org/licenses/gpl-3.0)

Solidity Smart Contract development template using modern Web3 frameworks/tools including Hardhat, Typechain and more. 


## Features
  <!-- - // TODO: https://www.npmjs.com/package/@openzeppelin/hardhat-upgrades -->
  <!-- - // TODO: https://www.npmjs.com/package/@tenderly/hardhat-tenderly -->
  <!-- - // TODO: https://www.npmjs.com/package/hardhat-contract-sizer -->
- Contract Support
  - [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/): Trusted smart contract standards
  - [Openzeppelin Contracts Upgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable): Upgradeable smart contract support
- Typescript
  - [Typechain](https://www.npmjs.com/package/typechain): Generate smart contract typings for Ethers during 
- Docs
  - [Hardhat Docgen](https://www.npmjs.com/package/hardhat-docgen): Generate a static documentation site from NatSpec comments automatically on compilation with Hardhat.
compilation.
- Testing
  - [VS-Code Mocha Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter): Use Mocha Test Explorer to easily choose which tests to run. (Smart Contracts must be manually compiled between updates.)
  - Debug Solidity unit tests with [VS-Code debugger](https://code.visualstudio.com/docs/editor/debugging)
  - [solidity-coverage](https://www.npmjs.com/package/solidity-coverage): Generate a coverage report by running `yarn test:coverage`
  - [hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter): Check the gas costs of running test transactions with `yarn test:gas`
    - _these tests run slower than `yarn test`_
- Linting
  - [Prettier](https://prettier.io/): Most popular opinionated code formatter.
    - [Prettier Config](https://prettier.io/docs/en/configuration.html)
  - [Prettier Solidity plugin](https://www.npmjs.com/package/prettier-plugin-solidity): A Prettier plugin for automatically formatting your Solidity code.
  - [Solhint](https://www.npmjs.com/package/solhint): Open source project for linting Solidity code. This project provides both Security and Style Guide validations.
    - [solhint.config.ts](./solhint.config.js) is full featured and support Solidity style guide recommendations.
- [Build/Publish as NPM Package](#buildpublish-as-npm-package): This repo is setup to build important files into a publishable NPM package. (See below for more info)

## Deployment and Verification
This project uses special tasks, adapted from Balancer protocol, to deploy and verify contracts which provides methods for saving custom outputs and easily verifying contracts as well as compartmentalizing different types of deployments.

**Configuration**
- Copy [.env.example](./.env.example) and rename to `.env`
  - Provide the necessary `env` variables before deployment/verification
- [hardhat.config.ts](./hardhat.config.ts): Can be configured with additional networks if needed
- Create a deployment task (See the [template-readme](./tasks/20xxxxxx-template/readme.md) on creating a new task), then deploy/verify following the commands below

## Deployment 
`npx hardhat deploy --id <task-id> --network <network-name> [--key <apiKey> --force --verbose]`  

This will deploy the example task to `bscTestnet`:  
eg: `npx hardhat deploy --id 20220816-deploy-lock --network bscTestnet`  

## Verification
`npx hardhat verify-contract --id <task-id> --network <network-name> --name <contract-name> [--address <contract-address> --args <constructor-args --key <apiKey> --force --verbose]`  

This will verify the example task deployed to `bscTestnet`:  
eg: `npx hardhat verify-contract --id 20220816-deploy-lock --network bscTestnet --name Lock`  


<!-- 
NOTE: This feature is deprecated until @nomiclabs/hardhat-etherscan can be upgraded

To list the available networks for verification run the command below. API keys for any network in this list can be added to 
`npx hardhat verify --list-networks` 
-->

## Linting
This project uses Prettier, an opinionated code formatter, to keep code styles consistent. This project has additional plugins for Solidity support as well. 

### Linting Solidity Code
- [prettier.config.js](./prettier.config.js): Provide config settings for Solidity under `overrides`.
- [.solhint.json](./.solhint.json): Provide config settings for `solhint`.  

Check solidity files:  
`yarn lint:sol`  
  
Fix Solidity files:  
`yarn lint:sol:fix`  

## Build/Publish as NPM Package
Currently this repo is setup to `include`: 
- `src/`, 
- `artifacts` (Created after `yarn compile`)
- `typechain-types` (Created after `yarn compile`)

- `yarn build`: Build files into `./dist` directory
- [tsconfig.json](./tsconfig.json): 
  - `include`: Use this field to include additional files in the build output
  - `exclude`: Use this field to exclude files from the build output

