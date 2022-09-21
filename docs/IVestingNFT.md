# Solidity API

## IVestingNFT

A non-fungible token standard used to vest tokens (ERC-20 or otherwise) over a vesting release curve
 scheduled using timestamps.

_Because this standard relies on timestamps for the vesting schedule, it's important to keep track of the
 tokens claimed per Vesting NFT so that a user cannot withdraw more tokens than alloted for a specific Vesting NFT._

### PayoutClaimed

```solidity
event PayoutClaimed(uint256 tokenId, address recipient, uint256 _claimAmount)
```

### claim

```solidity
function claim(uint256 tokenId) external returns (uint256 amountClaimed)
```

Claim the pending payout for the NFT

_MUST grant the claimablePayout value at the time of claim being called
MUST revert if not called by the token owner or approved users
SHOULD revert if there is nothing to claim_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The NFT token id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountClaimed | uint256 | The amount of tokens claimed in this call |

### vestedPayout

```solidity
function vestedPayout(uint256 tokenId) external view returns (uint256 payout)
```

Total amount of tokens which have been vested at the current timestamp.
  This number also includes vested tokens which have been claimed.

_It is RECOMMENDED that this function calls `vestedPayoutAtTime` with `block.timestamp`
  as the `timestamp` parameter._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The NFT token id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| payout | uint256 | Total amount of tokens which have been vested at the current timestamp. |

### vestedPayoutAtTime

```solidity
function vestedPayoutAtTime(uint256 tokenId, uint256 timestamp) external view returns (uint256 payout)
```

Total amount of vested tokens at the provided timestamp. 
  This number also includes vested tokens which have been claimed

_`timestamp` MAY be both in the future and in the past
Zero MUST be returned if the timestamp is before the token was minted_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The NFT token id |
| timestamp | uint256 | The timestamp to check on, can be both in the past and the future |

| Name | Type | Description |
| ---- | ---- | ----------- |
| payout | uint256 | Total amount of tokens which have been vested at the provided timestamp |

### vestingPayout

```solidity
function vestingPayout(uint256 tokenId) external view returns (uint256 payout)
```

Number of tokens for a NFT which are currently vesting or locked

_vestedPayoutAtTime(tokenId, type(uint).max) - vestedPayout(tokenId)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The NFT token id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| payout | uint256 | The number of tokens for the NFT which have not been claimed yet,    regardless of whether they are ready to claim |

### claimablePayout

```solidity
function claimablePayout(uint256 tokenId) external view returns (uint256 payout)
```

Number of tokens for the NFT which can be claimed at the current timestamp

_It is RECOMMENDED that this is calculated as the `vestedPayout()` value with the total
amount of tokens claimed subtracted._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The NFT token id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| payout | uint256 | The number of vested tokens for the NFT which have not been claimed yet |

### vestingPeriod

```solidity
function vestingPeriod(uint256 tokenId) external view returns (uint256 vestingStart, uint256 vestingEnd)
```

The start and end timestamps for the vesting of the provided NFT
MUST return the timestamp where no further increase in vestedPayout occurs for `vestingEnd`

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The NFT token id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingStart | uint256 | The beginning of the vesting as a unix timestamp |
| vestingEnd | uint256 | The ending of the vesting as a unix timestamp |

### payoutToken

```solidity
function payoutToken(uint256 tokenId) external view returns (address token)
```

Token which is used to pay out the vesting claims

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The NFT token id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | The token which is used to pay out the vesting claims |

