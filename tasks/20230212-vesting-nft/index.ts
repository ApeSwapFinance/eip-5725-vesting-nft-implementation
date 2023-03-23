import { Task, TaskRunOptions } from '../../hardhat'
import { DeploymentInputs } from './input'

export default async (
  task: Task,
  { force, from }: TaskRunOptions = {}
): Promise<void> => {
  const input = task.input() as DeploymentInputs
  // Setup and deploy LinearVestingNFT
  const linearVestingArgs = [input.token0.name, input.token0.symbol]
  await task.deployAndVerify('LinearVestingNFT', linearVestingArgs, from, force)
  // Setup and deploy VestingNFT
  const vestingArgs = [input.token1.name, input.token1.symbol]
  await task.deployAndVerify('VestingNFT', vestingArgs, from, force)
}
