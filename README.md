# EIP-5725: Transferrable Vesting NFT - Reference Implementation
[![lint & test](https://github.com/ApeSwapFinance/eip-5725-vesting-nft-implementation/actions/workflows/lint-test.yml/badge.svg)](https://github.com/ApeSwapFinance/eip-5725-vesting-nft-implementation/actions/workflows/lint-test.yml)
[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-yellow)](./docs/)
[![License](https://img.shields.io/badge/License-GPLv3-green.svg)](https://www.gnu.org/licenses/gpl-3.0)

This repository serves as both a reference implementation and an sdk module for EIP-572 Transferrable Vesting NFT Standard.

## EIP-5725

"A Non-Fungible Token (NFT) standard used to vest ERC-20 over a vesting release curve."  

Find the official [EIP located here](https://eips.ethereum.org/EIPS/eip-5725).

## Examples

The [ethers example](./examples/getVestingPeriod.ts) can be run quickly with `yarn example`.  

This [solidity reference](./contracts/reference/LinearVestingNFT.sol) shows how to extend `ERC5725.sol` to quickly create a transferrable vesting NFT.  

## `@ape.swap/erc-5725` Package Usage

### Installation

Add the ERC-5725 module to your Solidity, Frontend and/or Backend application.

```shell
npm install @ape.swap/erc-5725
# OR
yarn add @ape.swap/erc-5725
```

### Usage with Solidity Smart Contracts

Extend `ERC5725.sol` to quickly create a transferrable Vesting NFT contract implementation.

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@ape.swap/erc-5725/contracts/ERC5725.sol";

contract LinearVestingNFT is ERC5725 { ... }
```

### Usage with Frontend/Backend Node Applications

Quickly interact with an ERC5725 contract by providing an `ethers` provider.

```ts
import { getERC5725Contract } from '../src'
import { ethers } from 'ethers';
// Very quickly send txs to/read from type safe ERC-5725 contract
const provider = await ethers.getDefaultProvider('https://bscrpc.com');
const erc5725Contract = getERC5725Contract('0x<erc-5725-address>', provider);
```

## Usage via Clone

- `git clone git@github.com:ApeSwapFinance/eip-5725-vesting-nft-implementation.git`
- `cd eip-5725-vesting-nft-implementation`
- `yarn`
- Copy [.env.example](./.env.example) and rename to `.env`
  - Provide the necessary `env` variables before deployment/verification
  - `MAINNET_MNEMONIC`/`TESTNET_MNEMONIC` for deployments
  - `<explorer>_API_KEY` for verifications
- [hardhat.config.ts](./hardhat.config.ts): Can be configured with additional networks if needed

### Deployment and Verification

This project uses special tasks, adapted from Balancer protocol, to deploy and verify contracts which provides methods for saving custom outputs and easily verifying contracts as well as compartmentalizing different types of deployments.

#### Default (yarn script) Deployment and Verification

Deploy [20230212-vesting-nft](./tasks/20230212-vesting-nft/) task to the network of your choice  
`yarn deploy <network-name>`  

<br>

Verify [20230212-vesting-nft](./tasks/20230212-vesting-nft/) on the network of your choice  
`yarn verify <network-name> --name <LinearVestingNFT|VestingNFT>`  

#### Hardhat Deployment and Verification

Deploy using hardhat tasks  
`npx hardhat deploy --id 20230212-vesting-nft --network <network-name>`  

<br>

Verify using hardhat tasks  
`npx hardhat verify-contract --id 20230212-vesting-nft --network <network-name> --name <LinearVestingNFT|VestingNFT>`   


### Linting

This project uses Prettier, an opinionated code formatter, to keep code styles consistent. This project has additional plugins for Solidity support as well. 

#### Linting Solidity Code

- [prettier.config.js](./prettier.config.js): Provide config settings for Solidity under `overrides`.
- [.solhint.json](./.solhint.json): Provide config settings for `solhint`.  

- `yarn lint`: Lint Solidity & TS/JS files
- `yarn lint:fix`: Fix Solidity & TS/JS files
