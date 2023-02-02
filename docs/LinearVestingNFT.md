# Solidity API

## LinearVestingNFT

### VestDetails

```solidity
struct VestDetails {
  contract IERC20 payoutToken;
  uint256 payout;
  uint128 startTime;
  uint128 endTime;
  uint128 cliff;
}
```

### vestDetails

```solidity
mapping(uint256 => struct LinearVestingNFT.VestDetails) vestDetails
```

### _tokenIdTracker

```solidity
uint256 _tokenIdTracker
```

_tracker of current NFT id_

### constructor

```solidity
constructor(string name, string symbol) public
```

_See {IERC5725}._

### create

```solidity
function create(address to, uint256 amount, uint128 startTime, uint128 duration, uint128 cliff, contract IERC20 token) public virtual
```

Creates a new vesting NFT and mints it

_Token amount should be approved to be transferred by this contract before executing create_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The recipient of the NFT |
| amount | uint256 | The total assets to be locked over time |
| startTime | uint128 | When the vesting starts in epoch timestamp |
| duration | uint128 | The vesting duration in seconds |
| cliff | uint128 | The cliff duration in seconds |
| token | contract IERC20 | The ERC20 token to vest over time |

### vestedPayoutAtTime

```solidity
function vestedPayoutAtTime(uint256 tokenId, uint256 timestamp) public view returns (uint256 payout)
```

_See {IERC5725}._

### _payoutToken

```solidity
function _payoutToken(uint256 tokenId) internal view returns (address)
```

_See {ERC5725}._

### _payout

```solidity
function _payout(uint256 tokenId) internal view returns (uint256)
```

_See {ERC5725}._

### _startTime

```solidity
function _startTime(uint256 tokenId) internal view returns (uint256)
```

_See {ERC5725}._

### _endTime

```solidity
function _endTime(uint256 tokenId) internal view returns (uint256)
```

_See {ERC5725}._

### _cliff

```solidity
function _cliff(uint256 tokenId) internal view returns (uint256)
```

_Internal function to get the cliff time of a given linear vesting NFT_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | to check |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 the cliff time in seconds |

