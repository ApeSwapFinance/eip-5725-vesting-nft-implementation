import { ethers } from 'ethers'
import ERC5725_Artifact from '../artifacts/contracts/ERC5725.sol/ERC5725.json'
import { ERC5725 } from '../typechain-types'

// This constant represents the interface ID of the IERC5725 contract.
export const IERC5725_InterfaceId = '0x7c89676d'

/**
 * This function returns an instance of the ERC5725 contract, which is a smart contract that implements the IERC5725 interface.
 * @param address The EVM address of the ERC5725 contract.
 * @param signerOrProvider An optional parameter that specifies the signer or provider to use for sending transactions to the contract.
 * @returns An instance of the ERC5725 contract.
 */
export function getERC5725Contract(
  address: string,
  signerOrProvider?: ethers.Signer | ethers.providers.Provider
) {
  return new ethers.Contract(
    address,
    ERC5725_Artifact.abi,
    signerOrProvider
  ) as ERC5725
}

/**
 * This function returns the interface object for the ERC5725 contract.
 * @returns The interface object for the ERC5725 contract.
 */
export function getERC5725Interface() {
  // Create a new instance of the ethers.utils.Interface class with the ABI of the ERC5725 contract.
  return new ethers.utils.Interface(ERC5725_Artifact.abi)
}

/**
 * This async function checks whether a given contract at a specified address supports the IERC5725 interface.
 * @param address The EVM address of the contract to check.
 * @param signerOrProvider The signer or provider to use for sending transactions to the contract.
 * @returns A Promise that resolves to true if the contract supports the IERC5725 interface, and false otherwise.
 */
export async function supportsIERC5725(
  address: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) {
  const contract = getERC5725Contract(address, signerOrProvider)
  await contract.supportsInterface(IERC5725_InterfaceId)
}
