# dev-challenge-1-savings-contract-typescript

Welcome to this Developer Challenge!

In this challenge, you are required to get all the pre-written test cases of a simple savings smart contract to pass. The savings smart contract allows its creator to save algos in the smart contract till a specified target amount is reached. After the target amount is reached or exceeded, the creator can safely delete the smart contract and have the smart contract release all the saved algos back to them. The target amount is specified by the creator at the point of creation of the smart contract and cannot be modified after. Algos can be saved in the smart contract by making payment transactions directly to the smart contract address. 

By default, `projects_root_path` parameter is set to `projects`. Which instructs AlgoKit CLI to create a new directory under `projects` directory when new project is instantiated via `algokit init` at the root of the workspace.

## Getting Started

To solve this challenge, create a fork of the main branch of this GitHub repository, open the file in the path `/projects/dev-challenge-1-savings-contract-typescript/contracts/Savings.algo.ts` and add the required logic in the `createApplication` and `deleteApplication` methods to make all the test cases pass. You are not expected to edit any other file, especially the file containing the tests. For ease of setting up, you can use the GitHub Codespace created for you.

To see how to run the tests, refer to the `README.md` file in the `/projects/dev-challenge-1-savings-contract-typescript/` directory.

To learn more about algokit, visit [documentation](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md).

To submit, submit the link to your forked version of this repository to [DaoWakanda](https://www.daowakanda.org/developers/6716d79b1a83de8e2755bbb4)

Powered by [Copier templates](https://copier.readthedocs.io/en/stable/).
