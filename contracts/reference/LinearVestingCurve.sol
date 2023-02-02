// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "../IVestingCurve.sol";

contract LinearVestingCurve is IVestingCurve {
    /**
     * @dev See {IVestingCurve-getVestedPayoutAtTime}.
     */
    function getVestedPayoutAtTime(
        uint256 totalPayout,
        uint256 vestingTerm,
        uint256 startTimestamp,
        uint256 checkTimestamp
    ) external pure returns (uint256 vestedPayout_) {
        if (checkTimestamp <= startTimestamp) {
            vestedPayout_ = 0;
        } else if (checkTimestamp >= (startTimestamp + vestingTerm)) {
            vestedPayout_ = totalPayout;
        } else {
            /// @dev This is where custom vesting curves can be implemented.
            vestedPayout_ = (totalPayout * (checkTimestamp - startTimestamp)) / vestingTerm;
        }
    }
}
