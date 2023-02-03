import { Task, TaskRunOptions } from '../../hardhat'
import { DeploymentInputs } from './input'

export default async (task: Task, { force, from }: TaskRunOptions = {}): Promise<void> => {
  const input = task.input() as DeploymentInputs
  const args = [input.admin]
  // TODO: Update contract name
  await task.deployAndVerify('MyContract', args, from, force)
}
