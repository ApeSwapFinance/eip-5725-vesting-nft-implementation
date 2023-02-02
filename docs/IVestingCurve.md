# Solidity API

## IVestingCurve

VestingCurve interface to allow for simple updates of vesting release schedules.

### getVestedPayoutAtTime

```solidity
function getVestedPayoutAtTime(uint256 totalPayout, uint256 vestingTerm, uint256 startTimestamp, uint256 checkTimestamp) external pure returns (uint256 vestedPayout_)
```

Returns the vested token amount given the inputs below.

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalPayout | uint256 | Total payout vested once the vestingTerm is up |
| vestingTerm | uint256 | Length of time in seconds that tokens are vesting for |
| startTimestamp | uint256 | The timestamp of when vesting starts |
| checkTimestamp | uint256 | The timestamp to calculate vested tokens |

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestedPayout_ | uint256 | Total payoutTokens vested at checkTimestamp Requirements - MUST return 0 if checkTimestamp is less than startTimestamp - MUST return totalPayout if checkTimestamp is greater than startTimestamp + vestingTerm, - MUST return a value including or between 0 and totalPayout |

