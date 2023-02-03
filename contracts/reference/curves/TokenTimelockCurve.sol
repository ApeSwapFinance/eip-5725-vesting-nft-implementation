// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "../IVestingCurve.sol";

contract TokenTimelockCurve is IVestingCurve {
    /**
     * @dev See {IVestingCurve-getVestedPayoutAtTime}.
     */
    function getVestedPayoutAtTime(
        uint256 totalPayout,
        uint256 vestingTerm,
        uint256 startTimestamp,
        uint256 checkTimestamp
    ) external pure returns (uint256 vestedPayout_) {
        uint256 unlockTime = startTimestamp + vestingTerm;
        if (checkTimestamp < unlockTime) {
            return 0;
        } else {
            return totalPayout;
        }
    }
}
