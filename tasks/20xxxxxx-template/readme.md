# Task 20xxxxxx-template
Use this directory as a template for creating new tasks

## Setup
1. Copy the parent directory of this `readme.md` into the `tasks/` directory and replace `xxxxxx` with the current date and `-template` with a name for the task.
2. `yarn compile` all contracts
3. [artifacts/](../../artifacts/) will contain the needed JSON files in the [artifacts/build-info/](../../artifacts/build-info/) and [artifacts/contracts/](../../artifacts/contracts/) dirs.
   * _`artifacts` are generated after compiling_
4. Copy [artifacts/contracts/](../../artifacts/contracts/) needed files into the `./contract-artifacts` task directory
5. Copy and rename the proper [artifacts/build-info/](../../artifacts/build-info/) files into the `./build-info` task directory.
   * _`build-info` files have unreadable names. Check the `contracts/<contract-name>.dbg` for the link to the proper `build-info` file._
6. Update `index.ts` and `input.ts` in the task directory to finish configuring the task.