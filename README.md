# EIP-XXXX: Transferrable Vesting NFT - Reference Implementation
[![lint & test](https://github.com/ApeSwapFinance/ercXXXX-vesting-nft/actions/workflows/lint-test.yml/badge.svg)](https://github.com/ApeSwapFinance/ercXXXX-vesting-nft/actions/workflows/lint-test.yml)
[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-yellow)](./docs/)
[![License](https://img.shields.io/badge/License-GPLv3-green.svg)](https://www.gnu.org/licenses/gpl-3.0)

This repository serves as a reference implementation for EIP-XXXX Transferrable Vesting NFT Standard. A Non-Fungible Token (NFT) standard used to vest tokens (ERC-20 or otherwise) over a vesting release curve.   

<!-- 
TODO: Update all eip-xxxx, EIP-XXXX, etc with actual EIP number when obtained.
 -->
## EIP-XXXX
Find the official [EIP located here](https://eips.ethereum.org/EIPS/eip-xxxx).

## Installation and Setup
- `git clone git@github.com:ApeSwapFinance/eip-xxxx-vesting-nft-implementation.git`
- `cd eip-xxxx-vesting-nft-implementation`
- `yarn`
- Copy [.env.example](./.env.example) and rename to `.env`
  - Provide the necessary `env` variables before deployment/verification
  - `_MNEMONIC` for deployments
  - `_API_KEY` for verifications
- [hardhat.config.ts](./hardhat.config.ts): Can be configured with additional networks if needed

## Deployment and Verification
This project uses special tasks, adapted from Balancer protocol, to deploy and verify contracts which provides methods for saving custom outputs and easily verifying contracts as well as compartmentalizing different types of deployments.

### Default (yarn script) Deployment and Verification
Deploy [20220914-vesting-nft](./tasks/20220914-vesting-nft/) task to the network of your choice  
`yarn deploy <network-name>`  

<br>

Verify [20220914-vesting-nft](./tasks/20220914-vesting-nft/) on the network of your choice  
`yarn verify <network-name> --name <LinearVestingNFT|VestingNFT>`  

### Hardhat Deployment and Verification
Deploy using hardhat tasks  
`npx hardhat deploy --id 20220914-vesting-nft --network <network-name>`  

<br>

Verify using hardhat tasks  
`npx hardhat verify-contract --id 20220914-vesting-nft --network <network-name> --name <LinearVestingNFT|VestingNFT>`   


## Linting
This project uses Prettier, an opinionated code formatter, to keep code styles consistent. This project has additional plugins for Solidity support as well. 

### Linting Solidity Code
- [prettier.config.js](./prettier.config.js): Provide config settings for Solidity under `overrides`.
- [.solhint.json](./.solhint.json): Provide config settings for `solhint`.  

- `yarn lint`: Lint Solidity & TS/JS files
- `yarn lint:fix`: Fix Solidity & TS/JS files
