import { ethers } from 'hardhat'
import { BigNumber, Signer } from 'ethers'
import { expect } from 'chai'
import { time } from '@nomicfoundation/hardhat-network-helpers'
// typechain
import { ERC20Mock, VestingNFT } from '../typechain-types'
import { IERC5725_InterfaceId } from '../src/erc5725'

const testValues = {
  payout: '1000000000',
  payoutDecimals: 18,
  lockTime: 60,
}

describe('VestingNFT', function () {
  let accounts: Signer[]
  let vestingNFT: VestingNFT
  let mockToken: ERC20Mock
  let receiverAccount: string
  let spenderAccount: string
  let unlockTime: number
  let invalidTokenID = 1337

  beforeEach(async function () {
    const VestingNFT = await ethers.getContractFactory('VestingNFT')
    vestingNFT = await VestingNFT.deploy('VestingNFT', 'TLV')
    await vestingNFT.deployed()

    const ERC20Mock = await ethers.getContractFactory('ERC20Mock')
    mockToken = await ERC20Mock.deploy(
      '1000000000000000000000',
      testValues.payoutDecimals,
      'LockedToken',
      'LOCK'
    )
    await mockToken.deployed()
    await mockToken.approve(vestingNFT.address, '1000000000000000000000')

    accounts = await ethers.getSigners()
    receiverAccount = await accounts[1].getAddress()
    spenderAccount = await accounts[2].getAddress()
    unlockTime = await createVestingNft(
      vestingNFT,
      receiverAccount,
      mockToken,
      5
    )
  })

  it('Supports ERC721 and IERC5725 interfaces', async function () {
    // ERC721
    expect(await vestingNFT.supportsInterface('0x80ac58cd')).to.equal(true)

    /**
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified
     * // Solidity export interface id:
     * bytes4 public constant IID_ITEST = type(IERC5725).interfaceId;
     * // Pull out the interfaceId in tests
     * const interfaceId = await vestingNFT.IID_ITEST();
     */
    // Vesting NFT Interface ID
    expect(await vestingNFT.supportsInterface(IERC5725_InterfaceId)).to.equal(
      true
    )
  })

  it('Returns a valid vested payout', async function () {
    const totalPayout = await vestingNFT.vestedPayoutAtTime(0, unlockTime)
    expect(await vestingNFT.vestedPayout(0)).to.equal(0)
    await time.increase(testValues.lockTime)
    expect(await vestingNFT.vestedPayout(0)).to.equal(totalPayout)
  })

  it('Reverts with invalid ID', async function () {
    await expect(vestingNFT.vestedPayout(invalidTokenID)).to.revertedWith(
      'ERC5725: invalid token ID'
    )
    await expect(
      vestingNFT.vestedPayoutAtTime(invalidTokenID, unlockTime)
    ).to.revertedWith('ERC5725: invalid token ID')
    await expect(vestingNFT.vestingPayout(invalidTokenID)).to.revertedWith(
      'ERC5725: invalid token ID'
    )
    await expect(vestingNFT.claimablePayout(invalidTokenID)).to.revertedWith(
      'ERC5725: invalid token ID'
    )
    await expect(vestingNFT.vestingPeriod(invalidTokenID)).to.revertedWith(
      'ERC5725: invalid token ID'
    )
    await expect(vestingNFT.payoutToken(invalidTokenID)).to.revertedWith(
      'ERC5725: invalid token ID'
    )
    await expect(vestingNFT.claim(invalidTokenID)).to.revertedWith(
      'ERC5725: invalid token ID'
    )
    // NOTE: Removed claimTo from spec
    // await expect(vestingNFT.claimTo(1, receiverAccount)).to.revertedWith(
    //   "ERC5725: invalid token ID"
    // );
  })

  it('Returns a valid pending payout', async function () {
    expect(await vestingNFT.vestingPayout(0)).to.equal(testValues.payout)
  })

  it('Returns a valid releasable payout', async function () {
    const totalPayout = await vestingNFT.vestedPayoutAtTime(0, unlockTime)
    expect(await vestingNFT.claimablePayout(0)).to.equal(0)
    await time.increase(testValues.lockTime)
    expect(await vestingNFT.claimablePayout(0)).to.equal(totalPayout)
  })

  it('Returns a valid vesting period', async function () {
    const vestingPeriod = await vestingNFT.vestingPeriod(0)
    expect(vestingPeriod.vestingEnd).to.equal(unlockTime)
  })

  it('Returns a valid payout token', async function () {
    expect(await vestingNFT.payoutToken(0)).to.equal(mockToken.address)
  })

  it('Is able to claim', async function () {
    const connectedVestingNft = vestingNFT.connect(accounts[1])
    await time.increase(testValues.lockTime)
    const txReceipt = await connectedVestingNft.claim(0)
    await txReceipt.wait()
    expect(await mockToken.balanceOf(receiverAccount)).to.equal(
      testValues.payout
    )
  })

  it('Reverts claim when payout is 0', async function () {
    const connectedVestingNft = vestingNFT.connect(accounts[1])
    await expect(connectedVestingNft.claim(0)).to.revertedWith(
      'ERC5725: No pending payout'
    )
  })

  it('Reverts claim when payout is not from owner or account with permission', async function () {
    const connectedVestingNft = vestingNFT.connect(accounts[2])
    await expect(connectedVestingNft.claim(0)).to.revertedWith(
      'ERC5725: not owner of NFT or no permission to spend'
    )
  })

  // NOTE: Removed claimTo from spec
  // it("Is able to claim to other account", async function () {
  //   const connectedVestingNft = vestingNFT.connect(accounts[1]);
  //   const otherReceiverAddress = await accounts[2].getAddress();
  //   await increaseTime(testValues.lockTime);
  //   const txReceipt = await connectedVestingNft.claimTo(
  //     0,
  //     otherReceiverAddress
  //   );
  //   await txReceipt.wait();
  //   expect(await mockToken.balanceOf(otherReceiverAddress)).to.equal(
  //     testValues.payout
  //   );
  // });

  it('Reverts when creating to account 0', async function () {
    await expect(
      vestingNFT.create(
        '0x0000000000000000000000000000000000000000',
        testValues.payout,
        unlockTime,
        mockToken.address
      )
    ).to.revertedWith('to cannot be address 0')
  })

  //MINE

  it('Owner can set a spender with an allowance that can be spent', async function () {
    // Setup allowance exactly equal to claimable amount
    const allowanceAmount = testValues.payout
    const connectedVestingNft = vestingNFT.connect(accounts[1])
    let increaseAllowanceTx = await connectedVestingNft.increaseClaimAllowance(
      spenderAccount,
      allowanceAmount
    )
    await increaseAllowanceTx.wait()
    // Do we have the expected allowance in state?
    const getCurrentAllowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(getCurrentAllowance.toString()).to.equal(allowanceAmount.toString())
    await time.increase(testValues.lockTime)
    // Connect with the spenderAccount and claim our allowance
    const connectedAllowanceVestingNft = vestingNFT.connect(accounts[2])
    let claimTx = await connectedAllowanceVestingNft.claim(0)
    await claimTx.wait()
    // Do we have allowance 0 since we claimed all of our allowance?
    const postClaimAllowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(postClaimAllowance.toString()).to.equal((0).toString())
    // Compare balance after claim, spender now has tokens, owner doesn't
    const spenderPostClaimBalance = await mockToken.balanceOf(spenderAccount)
    expect(spenderPostClaimBalance.toString()).to.equal(
      testValues.payout.toString()
    )
    const ownerPostClaimBalance = await mockToken.balanceOf(receiverAccount)
    expect(ownerPostClaimBalance.toString()).to.equal(BigNumber.from(0))
  })

  it('Spender cannot overspend allowance', async function () {
    // Setup allowance to be less than claimable amount
    const allowanceAmount = Number(testValues.payout) / 2
    const connectedVestingNft = vestingNFT.connect(accounts[1])
    let increaseAllowanceTx = await connectedVestingNft.increaseClaimAllowance(
      spenderAccount,
      allowanceAmount
    )
    await increaseAllowanceTx.wait()
    // Do we have the expected allowance in state?
    const getCurrentAllowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(getCurrentAllowance.toString()).to.equal(allowanceAmount.toString())
    await time.increase(testValues.lockTime)
    // Connect with the spenderAccount and since our allowance is less than the vestedPayout, we are unable to claim. Allowance:n-1 Claimable:n
    const connectedAllowanceVestingNft = vestingNFT.connect(accounts[2])
    await expect(connectedAllowanceVestingNft.claim(0)).to.be.revertedWith(
      'ERC5725: insufficient allowance'
    )
    // We should still have our original allowance
    const postClaimAllowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(postClaimAllowance.toString()).to.equal(allowanceAmount.toString())
  })

  it('Owner can set a spender with an allowance that can be claimed across multiple tokenIds ', async function () {
    // Set the allowance to twice the payout value
    const allowanceAmount = Number(testValues.payout) * 2
    const connectedVestingNft = vestingNFT.connect(accounts[1])
    let increaseAllowanceTx = await connectedVestingNft.increaseClaimAllowance(
      spenderAccount,
      allowanceAmount
    )
    await increaseAllowanceTx.wait()
    // Do we have the expected allowance in state?
    const getCurrentAllowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(getCurrentAllowance.toString()).to.equal(allowanceAmount.toString())
    await time.increase(testValues.lockTime)
    // Connect with the spenderAccount and claim our allowance
    const connectedAllowanceVestingNft = vestingNFT.connect(accounts[2])
    let claimTx1 = await connectedAllowanceVestingNft.claim(0)
    await claimTx1.wait()
    // Compare balance after claim, spender now has tokens
    const spenderPostClaim1Balance = await mockToken.balanceOf(spenderAccount)
    expect(spenderPostClaim1Balance.toString()).to.equal(
      testValues.payout.toString()
    )
    // The allowance should be reduced by the payout
    let postClaim1Allowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(postClaim1Allowance.toString()).to.equal(
      testValues.payout.toString()
    )
    // Now claim from the second token
    let claimTx2 = await connectedAllowanceVestingNft.claim(1)
    await claimTx2.wait()
    // Check the spender balance, should now be twice the payout
    const spenderPostClaim2Balance = await mockToken.balanceOf(spenderAccount)
    expect(spenderPostClaim2Balance.toString()).to.equal(
      (Number(testValues.payout) * 2).toString()
    )
    // The allowance should now be 0 since we claimed all of our allowance
    let postClaim2Allowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(postClaim2Allowance.toString()).to.equal((0).toString())
  })

  it('Allowances set by an account aren\'t reset when NFT is transferred', async function () {
    // Set an allowance for spender
    const allowanceAmount = testValues.payout
    const connectedVestingNft = vestingNFT.connect(accounts[1])
    let increaseAllowanceTx = await connectedVestingNft.increaseClaimAllowance(
      spenderAccount,
      allowanceAmount
    )
    await increaseAllowanceTx.wait()

    // Check the allowance is set correctly
    const getCurrentAllowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(getCurrentAllowance.toString()).to.equal(allowanceAmount.toString())

    // Transfer NFT from receiver to a different account
    const connectedReceiverVestingNft = vestingNFT.connect(accounts[1])
    let transferTx = await connectedReceiverVestingNft.transferFrom(
      receiverAccount,
      spenderAccount,
      0
    )
    await transferTx.wait()

    // Check that the allowance is still the same even though the NFT was transferred
    const postTransferAllowance = await vestingNFT.allowance(
      receiverAccount,
      spenderAccount
    )
    expect(postTransferAllowance.toString()).to.equal(
      allowanceAmount.toString()
    )
  })

  // MINE END
})

async function createVestingNft(
  vestingNFT: VestingNFT,
  receiverAccount: string,
  mockToken: ERC20Mock,
  batchMintAmount: number = 1
) {
  const latestBlock = await ethers.provider.getBlock('latest')
  const unlockTime = latestBlock.timestamp + testValues.lockTime

  for (let i = 0; i <= batchMintAmount; i++) {
    const txReceipt = await vestingNFT.create(
      receiverAccount,
      testValues.payout,
      unlockTime,
      mockToken.address
    )
    await txReceipt.wait()
  }

  return unlockTime
}
