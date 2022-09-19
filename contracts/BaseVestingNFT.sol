// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IVestingNFT.sol";

abstract contract BaseVestingNFT is IVestingNFT, ERC721 {
    using SafeERC20 for IERC20;

    /// @dev mapping for claimed payouts
    mapping(uint256 => uint256) /*tokenId*/ /*claimed*/
        internal _payoutClaimed;

    /**
     * @notice Checks if the tokenId exists and its valid
     * @param tokenId The NFT token id
     */
    modifier validToken(uint256 tokenId) {
        require(_exists(tokenId), "VestingNFT: invalid token ID");
        _;
    }

    /**
     * @dev See {IVestingNFT}.
     */
    function claim(uint256 tokenId) external override(IVestingNFT) validToken(tokenId) returns (uint256 amountClaimed) {
        require(ownerOf(tokenId) == msg.sender, "Not owner of NFT");
        amountClaimed = claimablePayout(tokenId);
        require(amountClaimed > 0, "VestingNFT: No pending payout");

        emit PayoutClaimed(tokenId, msg.sender, amountClaimed);

        _payoutClaimed[tokenId] += amountClaimed;
        IERC20(payoutToken(tokenId)).safeTransfer(msg.sender, amountClaimed);
    }

    /**
     * @dev See {IVestingNFT}.
     */
    function vestedPayout(uint256 tokenId) public view override(IVestingNFT) returns (uint256 payout) {
        return vestedPayoutAtTime(tokenId, block.timestamp);
    }

    /**
     * @dev See {IVestingNFT}.
     */
    function vestedPayoutAtTime(uint256 tokenId, uint256 timestamp)
        public
        view
        virtual
        override(IVestingNFT)
        returns (uint256 payout);

    /**
     * @dev See {IVestingNFT}.
     */
    function vestingPayout(uint256 tokenId)
        public
        view
        override(IVestingNFT)
        validToken(tokenId)
        returns (uint256 payout)
    {
        return _payout(tokenId) - vestedPayout(tokenId);
    }

    /**
     * @dev See {IVestingNFT}.
     */
    function claimablePayout(uint256 tokenId)
        public
        view
        override(IVestingNFT)
        validToken(tokenId)
        returns (uint256 payout)
    {
        return vestedPayout(tokenId) - _payoutClaimed[tokenId];
    }

    /**
     * @dev See {IVestingNFT}.
     */
    function vestingPeriod(uint256 tokenId)
        public
        view
        override(IVestingNFT)
        validToken(tokenId)
        returns (uint256 vestingStart, uint256 vestingEnd)
    {
        return (_startTime(tokenId), _endTime(tokenId));
    }

    /**
     * @dev See {IVestingNFT}.
     */
    function payoutToken(uint256 tokenId)
        public
        view
        override(IVestingNFT)
        validToken(tokenId)
        returns (address token)
    {
        return _payoutToken(tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     * IVestingNFT interfaceId = 0xf8600f8b
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165)
        returns (bool supported)
    {
        return interfaceId == type(IVestingNFT).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Internal function to get the payout token of a given vesting NFT
     *
     * @param tokenId on which to check the payout token address
     * @return address payout token address
     */
    function _payoutToken(uint256 tokenId) internal view virtual returns (address);

    /**
     * @dev Internal function to get the total payout of a given vesting NFT.
     * @dev This is the total that will be paid out to the NFT owner, including historical tokens.
     *
     * @param tokenId to check
     * @return uint256 the total payout of a given vesting NFT
     */
    function _payout(uint256 tokenId) internal view virtual returns (uint256);

    /**
     * @dev Internal function to get the start time of a given vesting NFT
     *
     * @param tokenId to check
     * @return uint256 the start time in epoch timestamp
     */
    function _startTime(uint256 tokenId) internal view virtual returns (uint256);

    /**
     * @dev Internal function to get the end time of a given vesting NFT
     *
     * @param tokenId to check
     * @return uint256 the end time in epoch timestamp
     */
    function _endTime(uint256 tokenId) internal view virtual returns (uint256);
}
