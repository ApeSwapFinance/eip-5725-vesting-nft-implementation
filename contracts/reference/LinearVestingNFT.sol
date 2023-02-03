// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "../ERC5725.sol";
import "./IVestingCurve.sol";

contract LinearVestingNFT is ERC5725 {
    using SafeERC20 for IERC20;

    struct VestDetails {
        IERC20 payoutToken; /// @dev payout token
        uint256 payout; /// @dev payout token remaining to be paid
        uint128 startTime; /// @dev when vesting starts
        uint128 vestingTerm; /// @dev duration of vesting schedule
    }
    mapping(uint256 => VestDetails) public vestDetails; /// @dev maps the vesting data with tokenIds

    /// @dev immutable vesting release schedule
    IVestingCurve public immutable vestingCurve;
    /// @dev tracker of current NFT id
    uint256 private _tokenIdTracker;

    /**
     * @dev See {IERC5725}.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        IVestingCurve vestingCurve_
    ) ERC721(name_, symbol_) {
        (uint256 totalPayout, uint256 vestDuration, uint256 start) = (1e18, 1000, 1000);
        require(
            vestingCurve_.getVestedPayoutAtTime(totalPayout, vestDuration, start, 0) == 0,
            "before vesting must be 0"
        );
        require(
            vestingCurve_.getVestedPayoutAtTime(totalPayout, vestDuration, start, vestDuration + start + 1) ==
                totalPayout,
            "after vesting must be totalPayout"
        );
        vestingCurve = vestingCurve_;
    }

    /**
     * @notice Creates a new vesting NFT and mints it
     * @dev Token amount should be approved to be transferred by this contract before executing create
     * @param to The recipient of the NFT
     * @param amount The total assets to be locked over time
     * @param startTime When the vesting starts in epoch timestamp
     * @param vestingTerm The vesting duration in seconds
     * @param token The ERC20 token to vest over time
     */
    function create(
        address to,
        uint256 amount,
        uint128 startTime,
        uint128 vestingTerm,
        IERC20 token
    ) public virtual {
        require(startTime >= block.timestamp, "startTime cannot be on the past");
        require(to != address(0), "to cannot be address 0");

        uint256 newTokenId = _tokenIdTracker;

        vestDetails[newTokenId] = VestDetails({
            payoutToken: token,
            payout: amount,
            startTime: startTime,
            vestingTerm: vestingTerm
        });

        _tokenIdTracker++;
        _mint(to, newTokenId);
        IERC20(payoutToken(newTokenId)).safeTransferFrom(msg.sender, address(this), amount);
    }

    /**
     * @dev See {IERC5725}.
     */
    function vestedPayoutAtTime(uint256 tokenId, uint256 timestamp)
        public
        view
        override(ERC5725)
        validToken(tokenId)
        returns (uint256)
    {
        VestDetails memory tokenVestDetails = vestDetails[tokenId];
        return
            vestingCurve.getVestedPayoutAtTime(
                tokenVestDetails.payout,
                tokenVestDetails.vestingTerm,
                tokenVestDetails.startTime,
                timestamp
            );
    }

    /**
     * @dev See {ERC5725}.
     */
    function _payoutToken(uint256 tokenId) internal view override returns (address) {
        return address(vestDetails[tokenId].payoutToken);
    }

    /**
     * @dev See {ERC5725}.
     */
    function _payout(uint256 tokenId) internal view override returns (uint256) {
        return vestDetails[tokenId].payout;
    }

    /**
     * @dev See {ERC5725}.
     */
    function _startTime(uint256 tokenId) internal view override returns (uint256) {
        return vestDetails[tokenId].startTime;
    }

    /**
     * @dev See {ERC5725}.
     */
    function _vestingTerm(uint256 tokenId) internal view override returns (uint256) {
        return vestDetails[tokenId].vestingTerm;
    }

    /**
     * @dev See {ERC5725}.
     */
    function _endTime(uint256 tokenId) internal view override returns (uint256) {
        VestDetails memory tokenVestDetails = vestDetails[tokenId];
        return tokenVestDetails.startTime + tokenVestDetails.vestingTerm;
    }
}
