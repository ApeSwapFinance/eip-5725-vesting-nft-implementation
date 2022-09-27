---
eip: <to be assigned>
title: Transferable Vesting NFT standard
description: A standard for transferable vesting NFTs which release underlying tokens (ERC-20 or otherwise) over time.
# TODO: Fill in proper org and user names
author: Apeguru (https://github.com/Apegurus), Marco (CTO & Co-Founder @0xPaladinSec), Mario (Lead of Development Team @0xPaladinSec), DeFiFoFum (https://github.com/DeFiFoFum)
# TODO: Add in discussion URL
discussions-to: <URL>
status: Draft
type: Standards Track
category: ERC
created: 2022-09-08
requires: 721
---
# EIP-XXXX Vesting NFT Standard

## Table of Contents
- [EIP-XXXX Vesting NFT Standard](#eip-xxxx-vesting-nft-standard)
  - [Table of Contents](#table-of-contents)
  - [Simple Summary](#simple-summary)
  - [Abstract](#abstract)
  - [Motivation](#motivation)
    - [Use Cases](#use-cases)
  - [Specification](#specification)
  - [Rationale](#rationale)
  - [Backwards Compatibility](#backwards-compatibility)
  - [Reference Implementation](#reference-implementation)
  - [Test Cases](#test-cases)
  - [Security Considerations](#security-considerations)
  - [Extensions](#extensions)
  - [References](#references)
  - [Copyright](#copyright)
  - [Citation](#citation)


## Simple Summary
A **Non-Fungible Token** (NFT) standard used to vest tokens (ERC-20 or otherwise) over a vesting release curve. 

## Abstract
The following standard allows for the implementation of a standard API for NFT-based contracts that hold and represent the vested and locked properties of any underlying token (ERC-20 or otherwise) that is emitted to the NFT holder. This standard is an extension of the ERC-721 token that provides basic functionality for creating vesting NFTs, claiming the tokens and reading vesting curve properties.

## Motivation
Vesting contracts, including timelock contracts, lack a standard and unified interface, which results in diverse implementations of such contracts. Standardizing such contracts into a single interface would allow for the creation of an ecosystem of on- and off-chain tooling around these contracts. On top of this, liquid vesting in the form of non-fungible assets can prove to be a huge improvement over traditional **Simple Agreement for Future Tokens** (SAFTs)- or **Externally Owned Account** (EOA)-based vesting as it enables transferability and the ability to attach metadata similar to traditional NFTs. 
  
Such a standard would not only provide the much-needed ERC-20 token lock standard, but will also enable the creation of secondary marketplaces tailored for semi-liquid SAFTs.  

This standard also allows for a variety of different vesting curves to be implemented easily.  

These curves could represent: 
- linear vesting
- cliff vesting
- exponential vesting
- custom deterministic vesting

### Use Cases
1. Replicating SAFT contracts in a standardized form of semi-liquid vesting NFT assets
    - SAFTs are generally off-chain, while the current on-chain versions are address-based, which makes it difficult to distribute vesting shares that have several representatives. Standardization simplifies this convoluted process.
2. Providing a path for the standardization of vesting and token timelock contracts
    - There are many of such contracts in the wild and most of them differ in both interface and implementation.
3. NFT marketplaces dedicated to vesting NFTs
    - Whole new sets of interfaces and analytics could be created from a common standard for token vesting NFTs.
4. Integrating vesting NFTs into services like Gnosis Safe
    - A standard would mean services like Gnosis Safe could more easily and uniformly support interactions with these types of contracts inside of a multi-signature contract.
5. Enabling standardized fundraising implementations and general fundraising that sell vesting tokens (eg. SAFTs) in a more transparent manner
6. Allowing tools, front-end apps, aggregators, etc. to display a more holistic view of the vesting tokens and their properties that a user might have 
    - Currently, every project needs to program their own visualization of the vesting schedule of their vesting assets. If this is standardized, third-party tools could be developed to aggregate all vesting NFTs from all projects for a user, display their schedules, and allow the user to take aggregated vesting actions.
    - Such tooling can easily be compliant through the EIP-165 supportsInterface(IVestingNFT) check.
7. Making it easier for a single wrapping implementation to be used across all vesting standards that defines multiple recipients, periodic renting of vesting tokens, etc.

## Specification
<!-- The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow competing, interoperable implementations for any of the current Ethereum platforms (go-ethereum, parity, cpp-ethereum, ethereumj, ethereumjs, and [others](https://github.com/ethereum/wiki/wiki/Clients)). -->
The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title Non-Fungible Vesting Token Standard
 * @notice A non-fungible token standard used to vest tokens (ERC-20 or otherwise) over a vesting release curve
 *  scheduled using timestamps.
 * @dev Because this standard relies on timestamps for the vesting schedule, it's important to keep track of the
 *  tokens claimed per Vesting NFT so that a user cannot withdraw more tokens than alloted for a specific Vesting NFT.
 */
interface IVestingNFT is IERC721 {
    event PayoutClaimed(uint256 indexed tokenId, address indexed recipient, uint256 _claimAmount);

    /**
     * @notice Claim the pending payout for the NFT
     * @dev MUST grant the claimablePayout value at the time of claim being called
     * MUST revert if not called by the token owner or approved users
     * SHOULD revert if there is nothing to claim
     * @param tokenId The NFT token id
     * @return amountClaimed The amount of tokens claimed in this call
     */
    function claim(uint256 tokenId) external returns (uint256 amountClaimed);

    /**
     * @notice Total amount of tokens which have been vested at the current timestamp.
     *   This number also includes vested tokens which have been claimed.
     * @dev It is RECOMMENDED that this function calls `vestedPayoutAtTime` with
     *   `block.timestamp` as the `timestamp` parameter.
     * @param tokenId The NFT token id
     * @return payout Total amount of tokens which have been vested at the current timestamp.
     */
    function vestedPayout(uint256 tokenId) external view returns (uint256 payout);

    /**
     * @notice Total amount of vested tokens at the provided timestamp.
     *   This number also includes vested tokens which have been claimed.
     * @dev `timestamp` MAY be both in the future and in the past.
     * Zero MUST be returned if the timestamp is before the token was minted.
     * @param tokenId The NFT token id
     * @param timestamp The timestamp to check on, can be both in the past and the future
     * @return payout Total amount of tokens which have been vested at the provided timestamp
     */
    function vestedPayoutAtTime(uint256 tokenId, uint256 timestamp) external view returns (uint256 payout);

    /**
     * @notice Number of tokens for an NFT which are currently vesting (locked).
     * @dev The sum of vestedPayout and vestingPayout SHOULD always be the total payout.
     * @param tokenId The NFT token id
     * @return payout The number of tokens for the NFT which have not been claimed yet,
     *   regardless of whether they are ready to claim
     */
    function vestingPayout(uint256 tokenId) external view returns (uint256 payout);

    /**
     * @notice Number of tokens for the NFT which can be claimed at the current timestamp
     * @dev It is RECOMMENDED that this is calculated as the `vestedPayout()` value with the total
     * amount of tokens claimed subtracted.
     * @param tokenId The NFT token id
     * @return payout The number of vested tokens for the NFT which have not been claimed yet
     */
    function claimablePayout(uint256 tokenId) external view returns (uint256 payout);

    /**
     * @notice The start and end timestamps for the vesting of the provided NFT
     * MUST return the timestamp where no further increase in vestedPayout occurs for `vestingEnd`.
     * @param tokenId The NFT token id
     * @return vestingStart The beginning of the vesting as a unix timestamp
     * @return vestingEnd The ending of the vesting as a unix timestamp
     */
    function vestingPeriod(uint256 tokenId) external view returns (uint256 vestingStart, uint256 vestingEnd);

    /**
     * @notice Token which is used to pay out the vesting claims
     * @param tokenId The NFT token id
     * @return token The token which is used to pay out the vesting claims
     */
    function payoutToken(uint256 tokenId) external view returns (address token);
}
```


## Rationale
<!-- The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages. -->
**vesting terms**
- _vesting_: Tokens which are locked until a future date
- _vested_: Tokens which have reached their unlock date. (The usage in this specification relates to the **total** vested tokens for a given Vesting NFT.)
- _claimable_: Amount of tokens which can be claimed at the current `timestamp`. 
- _timestamp_: The [unix](https://www.unixtimestamp.com/) `timestamp` (seconds) representation of dates used for vesting. 

**vesting functions**
- `vestingPayout()` and `vestedPayout()` add up to the total number of tokens which can be claimed by the end of of the vesting schedule, which is also equal to `vestedPayoutAtTime()` with `type(uint256).max` as the `timestamp`.
- `vestedPayout()` will provide the total amount of tokens which are eligible for release (including claimed tokens), while `claimablePayout()` provides the amount of tokens which can be claimed at the current `timestamp`.
- `vestedPayoutAtTime()` provides functionality to iterate through the `vestingPeriod()` and provide a visual of the release curve. This allows for tools to iterate through a vesting schedule and create a visualization using on-chain data. It would be incredible to see integrations such as [hot-chain-svg](https://github.com/w1nt3r-eth/hot-chain-svg) to be able to create SVG visuals of vesting curves directly on-chain. 



**timestamps**
Generally in Solidity development it is advised against using `block.timestamp` as a state dependant variable as the timestamp of a block can be manipulated by a miner. The choice to use a `timestamp` over a `block` is to allow the interface to work across multiple **Ethereum Virtual Machine** (EVM) compatible networks which generally have different block times. Block proposal with a significantly fabricated timestamp will generally be dropped by all node implementations which makes the window for abuse negligible.

The `timestamp` makes cross chain integration easy, but internally, the reference implementation keeps track of the token payout per Vesting NFT to ensure that excess tokens alloted by the vesting terms cannot be claimed. 


## Backwards Compatibility
<!-- All EIPs that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The EIP must explain how the author proposes to deal with these incompatibilities. EIP submissions without a sufficient backwards compatibility treatise may be rejected outright. -->
- The Vesting NFT standard is meant to be fully backwards compatible with any current [ERC-721 standard](https://eips.ethereum.org/EIPS/eip-721) integrations and marketplaces.
- The Vesting NFT standard also supports [ERC-165 standard](https://eips.ethereum.org/EIPS/eip-165) interface detection for detecting `ERC-721` compatibility, as well as Vesting NFT compatibility.

## Reference Implementation
<!-- An optional section that contains a reference/example implementation that people can use to assist in understanding or implementing this specification.  If the implementation is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/eip-####/`. -->
<!-- TODO: Add proper link to url when -->
A reference implementation of this EIP can be found in [this repository](https://github.com/ApeSwapFinance/vesting-nft/tree/main/contracts/reference).


## Test Cases
The reference vesting NFT repository includes tests written in Hardhat.


## Security Considerations
<!-- All EIPs must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed. EIP submissions missing the "Security Considerations" section will be rejected. An EIP cannot proceed to status "Final" without a Security Considerations discussion deemed sufficient by the reviewers. -->
**timestamps**
- Vesting schedules are based on timestamps. As such, it's important to keep track of the number of tokens which have been claimed and to not give out more tokens than alloted for a specific Vesting NFT. 
  - `vestedPayoutAtTime(tokenId, type(uint256).max)`, for example, must return the total payout for a given `tokenId`

**approvals**
- When an approval is made on a Vesting NFT, the operator would have the rights to transfer the Vesting NFT to themselves and then claim the vested tokens.

## Extensions
- Vesting Curves
- Rental
- Beneficiary

## References
Standards

- [ERC-20](https://eips.ethereum.org/EIPS/eip-20) Token Standard.
- [ERC-165](https://eips.ethereum.org/EIPS/eip-165) Standard Interface Detection.
- [ERC-721](https://eips.ethereum.org/EIPS/eip-721) Token Standard.

- [Timestamp Dependence](https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/timestamp-dependence/#the-15-second-rule) The 15-second Rule.
- [hot-chain-svg](https://github.com/w1nt3r-eth/hot-chain-svg) On-chain SVG generator. Could be used to generate vesting curves for Vesting NFTs on-chain.

## Copyright
Copyright and related rights waived via [CC0](../LICENSE.md).

## Citation
Please cite this document as:
<!-- TODO: Update XXXX with EIP number -->
Apeguru, Marco, Mario, DeFiFoFum, "EIP-XXXX: Vesting NFT Standard," Ethereum Improvement Proposals, no. XXXX, September 2022. [Online serial]. Available: https://eips.ethereum.org/EIPS/eip-XXXX. 
