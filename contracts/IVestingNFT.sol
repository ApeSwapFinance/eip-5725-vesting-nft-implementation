// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title Non-Fungible Vesting Token Standard
 * @notice A non-fungible token standard used to vest tokens (ERC-20 or otherwise) over a vesting release curve
 *  scheduled using timestamps.
 * @dev Because this standard relies on timestamps for the vesting schedule, it's important to keep track of the
 *  tokens claimed per Vesting NFT so that a user cannot withdraw more tokens than alloted for a specific Vesting NFT.
 */
interface IVestingNFT is IERC721 {
    event PayoutClaimed(uint256 indexed tokenId, address indexed recipient, uint256 _claimAmount);

    /**
     * @notice Claim the pending payout for the NFT
     * @dev MUST grant the claimablePayout value at the time of claim being called
     * MUST revert if not called by the token owner or approved users
     * SHOULD revert if there is nothing to claim
     * @param tokenId The NFT token id
     * @return amountClaimed The amount of tokens claimed in this call
     */
    function claim(uint256 tokenId) external returns (uint256 amountClaimed);

    /**
     * @notice Total amount of tokens which have been vested at the current timestamp.
     *   This number also includes vested tokens which have been claimed.
     * @dev It is RECOMMENDED that this function calls `vestedPayoutAtTime` with `block.timestamp`
     *   as the `timestamp` parameter.
     * @param tokenId The NFT token id
     * @return payout Total amount of tokens which have been vested at the current timestamp.
     */
    function vestedPayout(uint256 tokenId) external view returns (uint256 payout);

    /**
     * @notice Total amount of vested tokens at the provided timestamp. 
     *   This number also includes vested tokens which have been claimed
     * @dev `timestamp` MAY be both in the future and in the past
     * Zero MUST be returned if the timestamp is before the token was minted
     * @param tokenId The NFT token id
     * @param timestamp The timestamp to check on, can be both in the past and the future
     * @return payout Total amount of tokens which have been vested at the provided timestamp
     */
    function vestedPayoutAtTime(uint256 tokenId, uint256 timestamp) external view returns (uint256 payout);

    /**
     * @notice Number of tokens for a NFT which are currently vesting or locked
     * @dev vestedPayoutAtTime(tokenId, type(uint).max) - vestedPayout(tokenId)
     * @param tokenId The NFT token id
     * @return payout The number of tokens for the NFT which have not been claimed yet, 
     *   regardless of whether they are ready to claim
     */
    function vestingPayout(uint256 tokenId) external view returns (uint256 payout);

    /**
     * @notice Number of tokens for the NFT which can be claimed at the current timestamp
     * @dev It is RECOMMENDED that this is calculated as the `vestedPayout()` value with the total
     * amount of tokens claimed subtracted.
     * @param tokenId The NFT token id
     * @return payout The number of vested tokens for the NFT which have not been claimed yet
     */
    function claimablePayout(uint256 tokenId) external view returns (uint256 payout);

    /**
     * @notice The start and end timestamps for the vesting of the provided NFT
     * MUST return the timestamp where no further increase in vestedPayout occurs for `vestingEnd`
     * @param tokenId The NFT token id
     * @return vestingStart The beginning of the vesting as a unix timestamp
     * @return vestingEnd The ending of the vesting as a unix timestamp
     */
    function vestingPeriod(uint256 tokenId) external view returns (uint256 vestingStart, uint256 vestingEnd);

    /**
     * @notice Token which is used to pay out the vesting claims
     * @param tokenId The NFT token id
     * @return token The token which is used to pay out the vesting claims
     */
    function payoutToken(uint256 tokenId) external view returns (address token);
}
