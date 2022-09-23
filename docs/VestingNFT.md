# Solidity API

## VestingNFT

### VestDetails

```solidity
struct VestDetails {
  contract IERC20 payoutToken;
  uint256 payout;
  uint128 startTime;
  uint128 endTime;
}
```

### vestDetails

```solidity
mapping(uint256 => struct VestingNFT.VestDetails) vestDetails
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

_Initializes the contract by setting a `name` and a `symbol` to the token._

### create

```solidity
function create(address to, uint256 amount, uint128 releaseTimestamp, contract IERC20 token) public virtual
```

Creates a new vesting NFT and mints it

_Token amount should be approved to be transferred by this contract before executing create_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The recipient of the NFT |
| amount | uint256 | The total assets to be locked over time |
| releaseTimestamp | uint128 | When the full amount of tokens get released |
| token | contract IERC20 | The ERC20 token to vest over time |

### vestedPayoutAtTime

```solidity
function vestedPayoutAtTime(uint256 tokenId, uint256 timestamp) public view returns (uint256 payout)
```

_See {IVestingNFT}._

### _payoutToken

```solidity
function _payoutToken(uint256 tokenId) internal view returns (address)
```

_See {BaseVestingNFT}._

### _payout

```solidity
function _payout(uint256 tokenId) internal view returns (uint256)
```

_See {BaseVestingNFT}._

### _startTime

```solidity
function _startTime(uint256 tokenId) internal view returns (uint256)
```

_See {BaseVestingNFT}._

### _endTime

```solidity
function _endTime(uint256 tokenId) internal view returns (uint256)
```

_See {BaseVestingNFT}._

