# Solidity API

## LinearVestingNFT

### VestDetails

```solidity
struct VestDetails {
  contract IERC20 payoutToken;
  uint256 payout;
  uint128 startTime;
  uint128 vestingTerm;
}
```

### vestDetails

```solidity
mapping(uint256 => struct LinearVestingNFT.VestDetails) vestDetails
```

### vestingCurve

```solidity
contract IVestingCurve vestingCurve
```

_immutable vesting release schedule_

### _tokenIdTracker

```solidity
uint256 _tokenIdTracker
```

_tracker of current NFT id_

### constructor

```solidity
constructor(string name_, string symbol_, contract IVestingCurve vestingCurve_) public
```

_See {IERC5725}._

### create

```solidity
function create(address to, uint256 amount, uint128 startTime, uint128 vestingTerm, contract IERC20 token) public virtual
```

Creates a new vesting NFT and mints it

_Token amount should be approved to be transferred by this contract before executing create_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The recipient of the NFT |
| amount | uint256 | The total assets to be locked over time |
| startTime | uint128 | When the vesting starts in epoch timestamp |
| vestingTerm | uint128 | The vesting duration in seconds |
| token | contract IERC20 | The ERC20 token to vest over time |

### vestedPayoutAtTime

```solidity
function vestedPayoutAtTime(uint256 tokenId, uint256 timestamp) public view returns (uint256)
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

