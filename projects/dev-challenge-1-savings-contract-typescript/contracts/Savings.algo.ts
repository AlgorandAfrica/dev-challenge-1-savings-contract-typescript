import { Contract } from '@algorandfoundation/tealscript';

export class Savings extends Contract {
  /**
   * This is the target amount for the savings account
   * in algos.
   */
  targetAmount = GlobalStateKey<uint64>();

  /**
   * This creates the application
   * @param targetAmount The target amount for the savings account which
   * must be greater than 0.
   */
  createApplication(targetAmount: uint64): void {
    
  }

  /**
   * This deletes the application and sends all the funds in the
   * application to the creator. It fails if the algo balance
   * of the smart contract is less than the target amount.
   */
  deleteApplication(): void {
    
  }
}
