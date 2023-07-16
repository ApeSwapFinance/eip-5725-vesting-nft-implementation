// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IERC5725.sol";

abstract contract ERC5725 is IERC5725, ERC721 {
    using SafeERC20 for IERC20;

    /// @dev mapping for claimed payouts
    mapping(uint256 => uint256) /*tokenId*/ /*claimed*/ internal _payoutClaimed;

    /// @dev mapping for allowances
    mapping(address => mapping(address => uint256)) /*address*/ /*(spender, amount)*/ internal _allowances;

    /**
     * @notice Checks if the tokenId exists and its valid
     * @param tokenId The NFT token id
     */
    modifier validToken(uint256 tokenId) {
        require(_exists(tokenId), "ERC5725: invalid token ID");
        _;
    }

    /**
     * @dev See {IERC5725}.
     */
    function claim(uint256 tokenId) external override(IERC5725) validToken(tokenId) {
        require(
            ownerOf(tokenId) == msg.sender ||
                (ownerOf(tokenId) != address(0) && allowance(ownerOf(tokenId), msg.sender) > 0),
            "ERC5725: not owner of NFT or no permission to spend"
        );

        uint256 amountClaimed = claimablePayout(tokenId);
        require(amountClaimed > 0, "ERC5725: No pending payout");

        // If the caller is not the owner, spend the allowance
        if (ownerOf(tokenId) != msg.sender) {
            _spendAllowance(ownerOf(tokenId), msg.sender, amountClaimed);
        }

        emit PayoutClaimed(tokenId, msg.sender, amountClaimed);

        _payoutClaimed[tokenId] += amountClaimed;
        IERC20(payoutToken(tokenId)).safeTransfer(msg.sender, amountClaimed);
    }

    /**
     * @dev See {IERC5725}.
     */
    function vestedPayout(uint256 tokenId) public view override(IERC5725) returns (uint256 payout) {
        return vestedPayoutAtTime(tokenId, block.timestamp);
    }

    /**
     * @dev See {IERC5725}.
     */
    function vestedPayoutAtTime(
        uint256 tokenId,
        uint256 timestamp
    ) public view virtual override(IERC5725) returns (uint256 payout);

    /**
     * @dev See {IERC5725}.
     */
    function vestingPayout(
        uint256 tokenId
    ) public view override(IERC5725) validToken(tokenId) returns (uint256 payout) {
        return _payout(tokenId) - vestedPayout(tokenId);
    }

    /**
     * @dev See {IERC5725}.
     */
    function claimablePayout(
        uint256 tokenId
    ) public view override(IERC5725) validToken(tokenId) returns (uint256 payout) {
        return vestedPayout(tokenId) - _payoutClaimed[tokenId];
    }

    /**
     * @dev See {IERC5725}.
     */
    function claimedPayout(
        uint256 tokenId
    ) public view override(IERC5725) validToken(tokenId) returns (uint256 payout) {
        return _payoutClaimed[tokenId];
    }

    /**
     * @dev See {IERC5725}.
     */
    function vestingPeriod(
        uint256 tokenId
    ) public view override(IERC5725) validToken(tokenId) returns (uint256 vestingStart, uint256 vestingEnd) {
        return (_startTime(tokenId), _endTime(tokenId));
    }

    /**
     * @dev See {IERC5725}.
     */
    function payoutToken(uint256 tokenId) public view override(IERC5725) validToken(tokenId) returns (address token) {
        return _payoutToken(tokenId);
    }

    /**
     * @dev See {IERC5725}.
     */
    function increaseClaimAllowance(address spender, uint256 addedValue) external override(IERC5725) {
        _setClaimAllowance(msg.sender, spender, _allowances[msg.sender][spender] + addedValue);
    }

    /**
     * @dev See {IERC5725}.
     */
    function decreaseClaimAllowance(address spender, uint256 subtractedValue) external override(IERC5725) {
        _setClaimAllowance(msg.sender, spender, _allowances[msg.sender][spender] - subtractedValue);
    }

    /**
     * @dev See {IERC5725}.
     */
    function allowance(address owner, address spender) public view override(IERC5725) returns (uint256 result) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     * IERC5725 interfaceId = 0xf316c058
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, IERC165) returns (bool supported) {
        return interfaceId == type(IERC5725).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Internal function to spend a set allowance
     *
     * @param owner The owner of the token
     * @param spender The spender who is permitted to spend the allowance
     * @param value The allowance to be set for spender
     *
     */
    function _setClaimAllowance(address owner, address spender, uint256 value) internal virtual {
        if (spender == address(0)) {
            revert("ERC5725: spender cannot be 0 address");
        }
        _allowances[owner][spender] = value;
        emit ClaimApproval(owner, spender, value);
    }

    /**
     * @dev Internal function to spend a set allowance
     *
     * @param owner The owner of the token
     * @param spender The spender who is claiming the allowance
     * @param value The allowance to be spent by spender
     *
     */
    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            if (currentAllowance < value) {
                revert("ERC5725: insufficient allowance");
            }
            _allowances[owner][spender] = currentAllowance - value;
        }
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
